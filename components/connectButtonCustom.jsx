import { Button, Center } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function ConnectCustomButton() {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");

        function someFunc() {
          openConnectModal();
          // connectWallet();
        }

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <Center>
                    <Button
                      bgColor="#0E76FD"
                      color="white"
                      _hover={{ transform: "scale(1.03)" }}
                      borderRadius="12px"
                      onClick={someFunc}
                      // onClick={openConnectModal; connectWallet}
                    >
                      Connect your Wallet
                    </Button>
                  </Center>
                );
              }

              return <div style={{ display: "flex", gap: 12 }}></div>;
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}
