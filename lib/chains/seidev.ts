import { defineChain } from "viem";

export const seidev = defineChain({
  network: "Sei",
  id: 713715,
  name: "SeiDev",
  nativeCurrency: {
    decimals: 18,
    name: "SEI",
    symbol: "SEI",
  },
  rpcUrls: {
    default: {
      http: ["https://evm-rpc-arctic-1.sei-apis.com"],
      // ws: ["wss://evm-ws.sei-apis.com"]
    },
    public: {
      http: ["https://evm-rpc.arctic-1.seinetwork.io"],
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
