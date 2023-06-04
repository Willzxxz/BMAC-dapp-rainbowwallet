import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import * as React from "react";
import { Box, ChakraProvider } from "@chakra-ui/react";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { createClient, configureChains, WagmiConfig } from "wagmi";
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  goerli,
  polygonMumbai,
  optimismGoerli,
  arbitrumGoerli,
} from "wagmi/chains";
// import { SessionProvider } from "next-auth/react";
// import { Session } from "next-auth";
import { AppProps } from "next/app";
import { publicProvider } from "wagmi/providers/public";
import MainLayout from "../layout/mainLayout";

const { chains, webSocketProvider, provider } = configureChains(
  [
    mainnet,
    goerli,
    polygon,
    polygonMumbai,
    optimism,
    optimismGoerli,
    arbitrum,
    arbitrumGoerli,
  ],
  // [publicProvider({ apiKey: process.env.ALCHEMY_API_KEY }), publicProvider()]
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "My BMAC DApp",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  webSocketProvider,
  provider,
  connectors,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Box>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider chains={chains}>
          <MainLayout>
            <ChakraProvider>
              <Component {...pageProps} />
            </ChakraProvider>
          </MainLayout>
        </RainbowKitProvider>
      </WagmiConfig>
    </Box>
  );
}
export default MyApp;
