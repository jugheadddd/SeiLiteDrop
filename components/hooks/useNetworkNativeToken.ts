import { useNetwork } from "wagmi";

function useNetworkNativeToken() {
  const { chain } = useNetwork();

  const getNetworkNativeToken = () => {
    return "SEI"
  };

  return {
    nativeToken: getNetworkNativeToken(),
  };
}

export default useNetworkNativeToken;
