import React from "react";
import Head from "next/head";
import Link from "next/link";
import { useAccount } from "wagmi";
import { Toaster } from "sonner";
import DisconnectedView from "@/components/ui/DisconnectedView";
import Footer from "@/components/ui/Footer";
import Navbar from "@/components/ui/Navbar";
import MadeBy from "@/components/ui/MadeBy";

const SEO = ({ title }) => {
  return (
    <Head>
      <title>{`SeiLite Drop | ${title}`}</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
      <link rel="manifest" href="/site.webmanifest" />
    </Head>
  );
};

const MobileMenu = () => (
  <div className="flex flex-col items-center w-full space-y-6">
    <div className="lg:hidden">
      <Navbar />
    </div>
    <div className="flex flex-col lg:mt-0">
        <img
          src={"/seiyantoken.png"}
          alt="Seiyan Logo"
          className="w-7 h-7 mr-4"
          style={{
            display: "block",
            marginLeft: "auto",
            marginRight: "auto",
            height: "50%",
            width: "80%",
          }}
        />
      {/* <h1 className="text-5xl font-alarm uppercase text-markPink-900">
        <Link href="/">Seilite Drop</Link>
      </h1> */}
      <h2 className="text-grey text-base lg:text-xl" style={{textAlign: "center", marginTop: "2%", color: "white"}}> The most efficient airdrop tool brought to SEI by $SEIYAN.
      </h2>
    </div>
  </div>
);

const DesktopMenu = () => (
  <div className="hidden lg:flex w-full">
    <Navbar />
  </div>
);

const Layout = ({ children, title = "The most efficient airdrop tool brought to SEI by $SEIYAN." }) => {
  const { isConnected } = useAccount();
  return (
    <>
      <SEO title={title} />
      <main className="flex flex-col min-h-[100dvh] w-full">
        <Toaster theme="dark" />
        <div className="flex flex-col lg:flex-row border-b-2 border-grey/[0.1]">
          <div className="lg:w-5/12 pt-4 pb-12 lg:py-24 px-4 text-center lg:text-left lg:px-12 items-center text-black bg-zinc-900 border-right border-black flex justify-center">
            <MobileMenu />
          </div>
          <div className="lg:w-7/12 mx-auto">
            <DesktopMenu />
            <div className="flex flex-col justify-center min-h-[calc(100vh-100px)] overflow-auto py-6 md:py-0 px-6 lg:px-12 xl:px-24">
              {!isConnected ? <DisconnectedView /> : children}
            </div>
          </div>
        </div>
        <Footer />
      </main>
      <MadeBy></MadeBy>
    </>
  );
};

export default Layout;
