import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { sepolia } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "Skill Mint",
  projectId: "e4e2b0428e01a449ec95da2d5a5e4e3e",
  chains: [sepolia],
  ssr: false,
});
