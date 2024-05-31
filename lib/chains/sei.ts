import { defineChain } from "viem";

export const sei = defineChain({
  network: "Sei",
  id: 1_329,
  name: "Sei",
  nativeCurrency: {
    decimals: 18,
    name: "SEI",
    symbol: "SEI",
  },
  rpcUrls: {
    default: {
      http: ["https://evm-rpc.sei-apis.com"],
      // ws: ["wss://evm-ws.sei-apis.com"]
    },
    public: {
      http: ["https://evm-rpc.sei-apis.com"],
      // ws: ["wss://evm-ws.sei-apis.com"]
    },
  },
  blockExplorers: {
    default: {
      name: "SeiTrace",
      url: "https://seitrace.com",
    },
  },
  iconUrl: "https://cdn.sei.io/assets/Sei_Symbol_Gradient.svg",
});
