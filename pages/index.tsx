import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Address, useNetwork } from "wagmi";
import useNetworkNativeToken from "@/components/hooks/useNetworkNativeToken";
import useTokenData from "@/components/hooks/useTokenData";
import Input from "@/components/ui/Input";
import MadeBy from "@/components/ui/MadeBy";

const Home = () => {
  const router = useRouter();
  const { chain } = useNetwork();
  const { nativeToken } = useNetworkNativeToken();
  const [contractAddress, setContractAddress] = useState<Address>(null);

  // Fetch token information
  const { isLoading, isValid } = useTokenData({
    contractAddress,
  });

  // Redirect to proper route based on token data input
  useEffect(() => {
    if (contractAddress && isValid) {
      router.push(contractAddress);
    }
  }, [contractAddress, isValid]);

  return (
    <div className="flex flex-col">
      <p className="mb-2 text-4xl">{`LET'S AAAAIRDROP!`}</p>
      <p className="text-2xl mb-6 text-grey">
        Enter an ERC-20 or ERC-721 contract address:
      </p>
      <Input
        value={contractAddress}
        onChange={(address) => {
          if (address.length > 42) return;
          setContractAddress(address);
        }}
        isLoading={isLoading}
        containerClassName={''}
      />
      <div className="flex flex-col space-y-2 py-4">
        <p>$SEIYAN ERC-20: 0x5f0E07dFeE5832Faa00c63F2D33A0D79150E8598</p>
        {/* <br/> */}
        <div style={{display:'inline'}}>
          <Link href="/drop/native" className="underline">or airdrop {nativeToken} on Sei</Link>
          {/* <Link href="" className="underline" style={{display:'inline'}}>           */}
          {/* </Link><p className="line-through" style={{display:'inline'}}>or airdrop {nativeToken}</p> coming soon... */}
        </div>        
        {/* <Link href="/deploy/erc20" className="underline">
          or deploy an ERC-20 on Sei
        </Link> */}
        {/* <Link href="/verify/erc20" className="underline">
          or check if existing contract is Bytecode20 on Sei
        </Link> */}
      </div>
      {contractAddress && !isValid && !isLoading && (
        <p className=" mt-6 text-black bg-critical bg-opacity-50 border border-critical p-4 rounded-md">
          {`Oops! That doesn't look like a valid contract address on
                  ${chain?.name}. Double check the address and please try again.`}
        </p>
      )}
    </div>    
  );
};

export default Home;
