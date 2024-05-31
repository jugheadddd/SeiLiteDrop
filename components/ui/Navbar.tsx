import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useNetwork } from "wagmi";
import { sei } from "@/lib/chains/sei";
import { airdropContractAddress } from "@/lib/contracts";
export default function Navbar() {
  const { isConnected } = useAccount();
  const { chain } = useNetwork();

  const chainName = chain?.name?.toUpperCase().replace(" ", "_");

  const getBlockExplorer = (chainName: string) => {
    const chainId = chain?.id || "1";
    const explorers: any = {
      SEI: `${sei.blockExplorers.default.url}/address/${airdropContractAddress?.[chainId]}`,
    };
    return explorers[chainName];
  };

  const explorerURL = `${getBlockExplorer(chainName)}`;
  

  const size = "20";

  return (
    <header className="flex flex-row min-h-[80px] items-center justify-center w-full mx-auto mb-4 mt-[4px] space-x-2">     
      {/* <Link
        href={explorerURL}
        target="_blank"
        rel="noopener noreferrer"
        className="hidden md:block flex-shrink-0"
      >
        <Image
          src={`/etherscan-logo.svg`}
          alt="Etherscan Logo"
          className="w-7 h-7 mr-4"
          width={size}
          height={size}
        />
      </Link> */}
      {isConnected && <ConnectButton chainStatus="name" accountStatus="address" label="Connect Your Wallet" />}
    </header>
  );
}
