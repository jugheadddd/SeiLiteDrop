import React, { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useAccount, useNetwork, useBalance } from "wagmi";
import { toast } from "sonner";
import { isAddress } from "viem";
import { MdWarning as WarningIcon } from "react-icons/md";
import clsx from "clsx";
import AirdropModal from "@/components/ui/AirdropModal";
import PageTitle from "@/components/ui/PageTitle";
import Pill from "@/components/ui/Pill";
import useNetworkNativeToken from "@/components/hooks/useNetworkNativeToken";
import Input from "@/components/ui/Input";
import { recipientsParser } from "@/components/types/parsers";
import useTwitterData from "@/components/hooks/useTwitterData";
import { toParams } from "@/components/utils";
import { useDebouncedEffect } from "@react-hookz/web";
import useTokenData from "@/components/hooks/useTokenData";
import { FaExternalLinkAlt as ExternalLinkIcon } from "react-icons/fa";
import TwitterAddressModal from "@/components/ui/TwitterAddressModal";
import { differenceInWeeks } from "date-fns";

const deriveTweetUrl = (username, id) =>
  `https://twitter.com/${username}/status/${id}`;

const TwitterDrop = () => {
  const { chain } = useNetwork();
  const { address } = useAccount();
  const { nativeToken } = useNetworkNativeToken();
  const router = useRouter();
  const [airdrop, setAirdrop] = useState(null);

  const [exclusions, setExclusions] = useState({});

  const [isShowingAddresses, setIsShowingAddresses] = useState(false);

  const { id = "", dropAddress = "" } = router.query;

  const [tweetId, setTweetId] = useState(id);
  const [tweetUrl, setTweetUrl] = useState(null);
  const [tweetData, setTweetData] = useState(null);
  const [airdropValue, setAirdropValue] = useState(null);
  const [contractAddress, setContractAddress] = useState(dropAddress);

  useDebouncedEffect(
    () => {
      if (!contractAddress || isAddress(contractAddress)) {
        router.push(
          `?${toParams({
            ...router?.query,
            dropAddress: contractAddress,
          })}`,
          null,
          {
            shallow: true,
          }
        );
      }
    },
    [contractAddress],
    200,
    500
  );

  useDebouncedEffect(
    () => {
      router.push(
        `?${toParams({
          ...router?.query,
          id: tweetId || "",
        })}`,
        null,
        {
          shallow: true,
        }
      );
    },
    [tweetId],
    200,
    500
  );

  const { data: balance, refetch: onRefresh } = useBalance({
    address,
    onError: (error) => toast.error(error.message),
    chainId: chain?.id,
  });

  const { isLoading, error } = useTwitterData({
    tweetId: id,
    onLoaded: (data) => {
      const { conversation_id, user } = data?.tweet;
      if (conversation_id && user?.username) {
        setTweetUrl(deriveTweetUrl(user?.username, conversation_id));
      }
      setTweetData(data);
    },
  });

  const { tweet = null, summary = [] } = tweetData || {};

  const { isLoading: isLoadingToken, ...token } = useTokenData({
    contractAddress: dropAddress,
  });

  const handleTwitterAirdrop = useCallback(
    ({
      data: addresses,
      airdropValue: amountPerHolder,
      dropAddress: tokenAddress,
    }) => {
      setAirdrop(
        recipientsParser(tokenAddress ? token?.decimals : 18).parse(
          addresses.map((address) => [address, amountPerHolder])
        )
      );
    },
    [JSON.stringify(token)]
  );

  const foundTweetUrl = useMemo(
    () => deriveTweetUrl(tweet?.user?.username, tweet?.conversation_id),
    [JSON.stringify(tweet)]
  );

  const onApplyExclusion = (change) => {
    setExclusions((prev) => ({
      ...prev,
      ...change,
    }));
  };

  const filteredSummary = useMemo(
    () =>
      summary?.reduce((acc, item) => {
        if (
          // Below min follower count
          item?.user?.public_metrics?.followers_count <=
            exclusions.minFollowerCount ||
          // Below min tweet count
          item?.user?.public_metrics?.tweet_count <= exclusions.minTweetCount ||
          // Below min age
          differenceInWeeks(new Date(), new Date(item?.user?.created_at)) <=
            exclusions.minAccountAge ||
          // No picture
          (exclusions.hasProfile && !item?.user?.profile_image_url) ||
          // No description
          (exclusions.hasDescription && !item?.user?.description) ||
          // No location
          (exclusions.hasLocation && !item?.user?.location)
        ) {
          return acc;
        }
        acc.push(item);
        return acc;
      }, []),
    [JSON.stringify(exclusions), JSON.stringify(summary)]
  );

  const addresses = filteredSummary?.map((item) => item.addr);

  return (
    <>
      {isShowingAddresses && (
        <TwitterAddressModal
          data={filteredSummary}
          onApplyExclusion={onApplyExclusion}
          onClose={() => {
            setIsShowingAddresses(false);
          }}
        />
      )}
      {airdrop?.length > 0 && (
        <AirdropModal
          contractAddress={dropAddress}
          recipients={airdrop}
          token={
            dropAddress
              ? token
              : {
                  isLoading: false,
                  isERC721: false,
                  symbol: nativeToken,
                  decimals: 18,
                  balance: balance?.value,
                  formattedBalance: balance?.formatted,
                  onRefresh,
                }
          }
          onClose={() => {
            setAirdrop(null);
          }}
        />
      )}
      <div className="flex flex-col h-full w-full">
        <div className="flex flex-col justify-center w-full space-y-2">
          <PageTitle title="Enter X Post" />
          <Input
            value={tweetUrl}
            onChange={(value) => {
              if (!value) {
                setTweetUrl(null);
                setTweetId(null);
              } else if (
                value.startsWith("https://") &&
                value.includes("status/")
              ) {
                setTweetUrl(value);
                setTweetId(value?.split("/").pop());
              }
            }}
            isLoading={isLoading}
            placeholder="E.g., https://twitter.com/PopPunkOnChain/status/1694775747045462183"
          />
          {tweet && (
            <div className="flex flex-row items-center justify-between text-sm">
              <a
                href={foundTweetUrl}
                target="_blank"
                rel="noreferrer"
                className="flex flex-row items-center space-x-2 hover:underline text-primary"
              >
                <span>View post</span>
                <ExternalLinkIcon className="text-sm" />
              </a>
              <span className="text-grey text-sm">
                {tweet?.public_metrics?.reply_count} replies,{" "}
                {tweet?.public_metrics?.like_count} likes,{" "}
                {tweet?.public_metrics?.impression_count} views
              </span>
            </div>
          )}
          {error && (
            <div className="flex flex-row items-center py-1">
              <p className="text-black bg-critical bg-opacity-50 border border-critical p-4 rounded-md">
                {`Oops! Looks like there was an issue pulling down the tweet, perhaps due to rate limiting. Please try again later.`}
              </p>
            </div>
          )}
          <div className="flex flex-row items-center gap-2">
            <Pill>X (Twitter)</Pill>
            {id && addresses?.length > 0 && (
              <Pill variant="primary">
                <button
                  type="button"
                  className="underline"
                  onClick={() => {
                    setIsShowingAddresses(true);
                  }}
                >
                  {`View ${addresses?.length || 0} addresses found`}
                </button>
              </Pill>
            )}
          </div>
          {addresses?.length > 0 ? (
            <div className="flex flex-col space-y-1">
              <div className="min-h-fit mt-2 space-y-2">
                <div className="flex flex-col space-y-1">
                  <h2 className="text-2xl text-base-100">
                    Enter an amount to send to each address:
                  </h2>
                  <p className="text-sm text-gray">
                    {`Enter a contract address if you'd like to send an ERC20
                    token instead. Leave empty for ${nativeToken}.`}
                  </p>
                  <div className="flex flex-row items-center space-x-2">
                    <Input
                      className="border-none focus:outline-none w-full text-base"
                      spellCheck={false}
                      onChange={(contractAddress) => {
                        if (contractAddress.length > 42) return;
                        setContractAddress(contractAddress);
                      }}
                      placeholder="0x"
                      value={contractAddress || ""}
                      isLoading={isLoadingToken}
                    />
                    <Input
                      containerClassName="max-w-[150px]"
                      className="border-none focus:outline-none w-full text-right text-base"
                      onChange={(amount) => {
                        setAirdropValue(amount);
                      }}
                      placeholder={"E.g., 0.1"}
                      value={airdropValue || ""}
                    />
                  </div>
                  {dropAddress ? (
                    token?.isValid ? (
                      <div className="flex flex-row items-center space-x-1">
                        <Pill>{token?.symbol}</Pill>
                        <Pill variant="primary">
                          {`You have ${token?.formattedBalance} ${token?.symbol}`}
                        </Pill>
                      </div>
                    ) : (
                      <div className="flex flex-row items-center py-1">
                        <p className="text-black bg-critical bg-opacity-50 border border-critical p-4 rounded-md">
                          {`Oops! That doesn't look like a valid contract address on
                  ${chain?.name}. Double check the address and please try again.`}
                        </p>
                      </div>
                    )
                  ) : (
                    <div className="flex flex-row items-center space-x-1">
                      <Pill>{nativeToken}</Pill>
                      <Pill variant="primary">
                        {`You have ${balance?.formatted} ${nativeToken}`}
                      </Pill>
                    </div>
                  )}
                </div>
                <textarea
                  value={addresses?.join(
                    `,${airdropValue ? `${airdropValue},` : ""}\n`
                  )}
                  className="w-full min-h-[200px] max-h-[400px] p-3 text-black border-black border-2 rounded-md"
                  readOnly
                />
                <button
                  type="button"
                  className={clsx(
                    "py-4 rounded-md w-full my-4 text-white bg-markPink-900 font-bold tracking-wide",
                    {
                      "opacity-30 cursor-not-allowed":
                        addresses.length === 0 || !airdropValue,
                    }
                  )}
                  onClick={() => {
                    handleTwitterAirdrop({
                      data: addresses,
                      airdropValue,
                      dropAddress,
                    });
                  }}
                  disabled={addresses.length === 0 || !airdropValue}
                >
                  Continue
                </button>
              </div>
            </div>
          ) : id && !isLoading && !isLoadingToken ? (
            <div className="flex flex-row items-center space-x-4 bg-markPink-100 bg-opacity-50 border border-markPink-200 py-4 pl-4 pr-6 rounded-md mt-10">
              <WarningIcon className="flex-shrink-0 text-2xl text-primary" />
              <p className="text-primary">
                {`This tweet has no associated addresses.`}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default TwitterDrop;
