import { defineChain } from "viem";
import { arbitrum, base, mainnet, optimism, polygon, sepolia, bsc, zora } from "@wagmi/chains";

import { sei } from "@/lib/chains/sei";

export const airdropContractAddress = {
  [sei.id]: "0x09350F89e2D7B6e96bA730783c2d76137B045FEF",
};