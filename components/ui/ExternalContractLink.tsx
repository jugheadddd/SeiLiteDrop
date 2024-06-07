import React from "react";
import { FaExternalLinkAlt as ExternalLinkIcon } from "react-icons/fa";
import { shortenAddress } from "@/components/utils";
import { sepolia, optimism, arbitrum, polygon, base, bsc, } from "@wagmi/chains";
import { sei } from "@/lib/chains/sei";
import { baseSepolia } from "viem/chains";

const deriveExternalLink = (tokenAddress, chainId) => {
  switch (chainId) {
    case sepolia.id:
      return `https://sepolia.etherscan.io/address/${tokenAddress}`;
    case optimism.id:
      return `https://optimistic.etherscan.io/address/${tokenAddress}`;
    case arbitrum.id:
      return `https://arbiscan.io/address/${tokenAddress}`;
    case polygon.id:
      return `https://polygonscan.com/address/${tokenAddress}`;
    case base.id:
      return `https://basescan.org/address/${tokenAddress}`;
    case baseSepolia.id:
      return `https://sepolia.basescan.org/address/${tokenAddress}`;
    case bsc.id:
      return `https://bscscan.com/address/${tokenAddress}`;
    case sei.id:
      return `https://seitrace.com/address/${tokenAddress}`;
    default:
      return `https://seitrace.com/address/${tokenAddress}`;
  }
};

const ExternalContractLink = ({ address, chainId }) => {
  return (
    <div className="flex flex-row items-center space-x-2">
      <a
        href={deriveExternalLink(address, chainId)}
        target="_blank"
        rel="noreferrer"
        className="flex flex-row items-center space-x-2 hover:underline text-zinc"
      >
        <span className="hidden md:flex text-xl">{address}</span>
        <span className="flex md:hidden text-xl">
          {shortenAddress(address)}
        </span>
        <ExternalLinkIcon className="text-sm" />
      </a>
    </div>
  );
};

export default ExternalContractLink;
