import { defineChain } from "viem";
import { arbitrum, base, mainnet, optimism, polygon, sepolia, bsc, zora } from "@wagmi/chains";

import { sei } from "@/lib/chains/sei";

export const airdropContractAddress = {
  [sei.id]: "0xAf4057BA4BFBdaC52161B60B11eAf2613c3d5931",
};