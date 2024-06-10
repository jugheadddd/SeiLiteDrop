import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WebSocketPublicClient } from "wagmi";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { publicProvider } from "wagmi/providers/public";
import { sei } from "@/lib/chains/sei";
import { seidev } from "@/lib/chains/seidev";

// NOTE: On the providers, there are some issues with Sepolia currently and Wagmi.
// The setup below will work. Adding an Alchemy provider, for example, will break things
// Issue: https://github.com/wagmi-dev/wagmi/issues/2219#issuecomment-1520882923
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    sei,
    seidev
  ],
  [
    jsonRpcProvider({
      rpc: () => ({
        http: process.env.NEXT_PUBLIC_RHINO_API!,
        // webSocket: process.env.NEXT_PUBLIC_RHINO_WS!,
      }),
    }),
    jsonRpcProvider({
      rpc: () => ({
        http: process.env.NEXT_PUBLIC_SEIDEV_API!,
      }),
    }),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "SeiLite Drop",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_API_KEY as string,
  chains,
});

export const client = createConfig({
  autoConnect: false,
  connectors,
  webSocketPublicClient,
  publicClient,
});

export { chains };
