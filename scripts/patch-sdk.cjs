#!/usr/bin/env node

/**
 * Patch @idos-network/client rc.1.0 to work with the deployed enclave.
 *
 * The deployed enclave (both playground and production) expects messages in the
 * format { method: "methodName", data: [arg1, arg2, ...] }, but the published
 * rc.1.0 SDK sends raw objects like { configure: options }.
 *
 * This script patches the IframeEnclave class in the dist file to:
 * 1. Use the new message format in requestToEnclave
 * 2. Call "load" then "reconfigure" during initialization
 * 3. Map old method names to new enclave method names
 */

const fs = require("fs");
const path = require("path");

const distPath = path.join(
  __dirname,
  "..",
  "node_modules",
  "@idos-network",
  "client",
  "dist",
  "index.js"
);

if (!fs.existsSync(distPath)) {
  console.log("SDK dist file not found, skipping patch (path:", distPath, ")");
  process.exit(0);
}

let code = fs.readFileSync(distPath, "utf8");

// Check if already patched
if (code.includes("__PATCHED_FOR_NEW_ENCLAVE__")) {
  console.log("SDK already patched, skipping.");
  process.exit(0);
}

let patchCount = 0;

// ──────────────────────────────────────────────────────────────────────
// 1. Patch requestToEnclave: translate old format to { method, data }
// ──────────────────────────────────────────────────────────────────────

const oldRequestToEnclave = `\tasync requestToEnclave(request) {
\t\treturn new Promise((resolve, reject) => {
\t\t\tconst { port1, port2 } = new MessageChannel();
\t\t\tport1.onmessage = ({ data }) => {
\t\t\t\tport1.close();
\t\t\t\tdata.error ? reject(data.error) : resolve(data.result);
\t\t\t};
\t\t\tthis.iframe.contentWindow.postMessage(request, this.hostUrl.origin, [port2]);
\t\t});
\t}`;

const newRequestToEnclave = `\t/* __PATCHED_FOR_NEW_ENCLAVE__ */
\tasync requestToEnclave(request) {
\t\tlet method, args;
\t\tif (typeof request === "string") {
\t\t\tmethod = request; args = [];
\t\t} else {
\t\t\tconst key = Object.keys(request)[0];
\t\t\tconst value = request[key];
\t\t\tswitch (key) {
\t\t\t\tcase "configure": method = "reconfigure"; args = [value]; break;
\t\t\t\tcase "storage": method = "reconfigure"; args = [value]; break;
\t\t\t\tcase "keys": method = "ensureUserEncryptionProfile"; args = []; break;
\t\t\t\tcase "reset": method = "reset"; args = []; break;
\t\t\t\tcase "confirm": method = "confirm"; args = [value.message]; break;
\t\t\t\tcase "encrypt": method = "encrypt"; args = [value.message, value.receiverPublicKey]; break;
\t\t\t\tcase "decrypt": method = "decrypt"; args = [value.fullMessage, value.senderPublicKey]; break;
\t\t\t\tcase "filterCredentials": method = "filterCredentials"; args = [value.credentials, value.privateFieldFilters]; break;
\t\t\t\tcase "backupPasswordOrSecret": method = "backupUserEncryptionProfile"; args = []; break;
\t\t\t\tdefault: method = key; args = [value]; break;
\t\t\t}
\t\t}
\t\treturn new Promise((resolve, reject) => {
\t\t\tconst { port1, port2 } = new MessageChannel();
\t\t\tport1.onmessage = ({ data }) => {
\t\t\t\tport1.close();
\t\t\t\tdata.error ? reject(data.error) : resolve(data.result);
\t\t\t};
\t\t\tthis.iframe.contentWindow.postMessage({ method, data: args }, this.hostUrl.origin, [port2]);
\t\t});
\t}`;

if (code.includes(oldRequestToEnclave)) {
  code = code.replace(oldRequestToEnclave, newRequestToEnclave);
  patchCount++;
  console.log("  ✓ Patched requestToEnclave");
} else {
  console.error("  ✗ Could not find requestToEnclave to patch!");
}

// ──────────────────────────────────────────────────────────────────────
// 2. Patch load(): call "load" first, then "reconfigure"
// ──────────────────────────────────────────────────────────────────────

const oldLoad = `\tasync load() {
\t\tawait this.loadEnclave();
\t\tawait this.requestToEnclave({ configure: this.options });
\t}`;

const newLoad = `\tasync load() {
\t\tawait this.loadEnclave();
\t\tawait this.requestToEnclave("load");
\t\tawait this.requestToEnclave({ configure: this.options });
\t}`;

if (code.includes(oldLoad)) {
  code = code.replace(oldLoad, newLoad);
  patchCount++;
  console.log("  ✓ Patched load()");
} else {
  console.error("  ✗ Could not find load() to patch!");
}

// ──────────────────────────────────────────────────────────────────────
// Write patched file
// ──────────────────────────────────────────────────────────────────────

fs.writeFileSync(distPath, code);
console.log(`\nSDK patch complete (${patchCount}/2 patches applied).`);

if (patchCount < 2) {
  console.error("WARNING: Not all patches were applied! The SDK may not work correctly.");
  process.exit(1);
}
