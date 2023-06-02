import abi from "../utils/BuyMeACoffee.json";
import { ethers } from "ethers";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import { Box, Button, Center, HStack, Link, Text } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import ConnectCustomButton from "./connectButtonCustom";

export default function BuyMeACoffee() {
  // Contract Address & ABI
  const contractAddress = "0xD6563FA7E41C643be7EF1D2558E2004d31A306bb";
  const contractABI = abi.abi;

  // Component state
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [memos, setMemos] = useState([]);

  const onNameChange = (event) => {
    setName(event.target.value);
  };

  const onMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const buyCoffee = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum, "any");
        const signer = provider.getSigner();
        const buyMeACoffee = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        console.log("buying coffee..");
        const coffeeTxn = await buyMeACoffee.buyCoffee(
          name ? name : "anon",
          message ? message : "Enjoy your coffee!",
          { value: ethers.utils.parseEther("0.001") }
        );

        await coffeeTxn.wait();

        console.log("mined ", coffeeTxn.hash);

        console.log("coffee purchased!");

        // Clear the form fields.
        setName("");
        setMessage("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const options = {
    // hour12: "false",
    hour: "numeric",
    minute: "2-digit",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  // Function to fetch all memos stored on-chain.
  const getMemos = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const buyMeACoffee = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        console.log("fetching memos from the blockchain..");
        const memos = await buyMeACoffee.getMemos();
        console.log("fetched!");
        setMemos(memos);
      } else {
        console.log("Metamask is not connected");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    let buyMeACoffee;
    getMemos();

    // Create an event handler function for when someone sends
    // us a new memo.

    const onNewMemo = (from, timestamp, name, message) => {
      console.log("Memo received: ", from, timestamp, name, message);
      setMemos((prevState) => [
        ...prevState,
        {
          address: from,
          timestamp: new Date(timestamp * 1000),
          message,
          name,
        },
      ]);
    };

    const { ethereum } = window;

    // Listen for new memo events.
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum, "any");
      const signer = provider.getSigner();
      buyMeACoffee = new ethers.Contract(contractAddress, contractABI, signer);

      buyMeACoffee.on("NewMemo", onNewMemo);
    }

    return () => {
      if (buyMeACoffee) {
        buyMeACoffee.off("NewMemo", onNewMemo);
      }
    };
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Buy Will a Coffee!</title>
        <meta name="description" content="Tipping site" />
        {/* <link rel="icon" href="/favicon.ico" />  */}
      </Head>

      <main className={styles.main}>
        <Text fontSize="45px" mb="50px">
          Buy Will a Coffee!
        </Text>
        <Box border="2px" py="20px" px="40px" borderRadius="12px">
          <form>
            <label>Name</label>
            <br />
            <Box border="1px" py="3px" px="4px" borderRadius="5px">
              <input
                width="100%"
                id="name"
                type="text"
                placeholder="anon"
                onChange={onNameChange}
              />
            </Box>
            <br />
            <label>Send Will a message</label>
            <br />
            <Box border="1px" py="3px" px="4px" borderRadius="5px">
              <textarea
                rows={4}
                placeholder="Enjoy your coffee!"
                id="message"
                onChange={onMessageChange}
                required
              ></textarea>
            </Box>
            <br />
            <ConnectButton.Custom>
              {({ account, chain, authenticationStatus, mounted }) => {
                const ready = mounted && authenticationStatus !== "loading";
                const connected =
                  ready &&
                  account &&
                  chain &&
                  (!authenticationStatus ||
                    authenticationStatus === "authenticated");

                return (
                  <div>
                    {(() => {
                      if (connected) {
                        return (
                          <Center>
                            <Button
                              bgColor="#3574F4"
                              color="white"
                              _hover={{ transform: "scale(1.03)" }}
                              borderRadius="12px"
                              onClick={buyCoffee}
                            >
                              Send 1 Coffee for 0.001ETH
                            </Button>
                          </Center>
                        );
                      } else {
                        return (
                          <Center>
                            <ConnectCustomButton />
                          </Center>
                        );
                      }

                      // return <></>;
                    })()}
                  </div>
                );
              }}
            </ConnectButton.Custom>
          </form>
        </Box>
      </main>
      <ConnectButton.Custom>
        {({ account, chain, authenticationStatus, mounted }) => {
          const ready = mounted && authenticationStatus !== "loading";
          const connected =
            ready &&
            account &&
            chain &&
            (!authenticationStatus || authenticationStatus === "authenticated");

          return (
            <div>
              {(() => {
                if (connected) {
                  return (
                    <Center>
                      <Box
                        border="2px"
                        w="650px"
                        py="20px"
                        px="40px"
                        borderRadius="12px"
                        margin="auto"
                      >
                        <Center>
                          <Text mb="20px" fontSize="20px">
                            <b>Memos received</b>
                          </Text>
                        </Center>

                        {memos
                          .slice(0)
                          .reverse()
                          .map((memo, idx) => {
                            const timestamp = new Date(memo.timestamp * 1000);

                            return (
                              <div
                                key={idx}
                                style={{
                                  border: "2px solid",
                                  borderRadius: "5px",
                                  padding: "5px",
                                  margin: "5px",
                                }}
                              >
                                <p style={{ fontWeight: "bold" }}>
                                  "{memo.message}"
                                </p>
                                <HStack justifyContent="space-between">
                                  <Box>From: {memo.name} </Box>
                                  <Box>
                                    {timestamp.toLocaleDateString(
                                      "en-US",
                                      options
                                    )}
                                  </Box>
                                </HStack>
                              </div>
                            );
                          })}
                      </Box>
                    </Center>
                  );
                }

                // return <></>;
              })()}
            </div>
          );
        }}
      </ConnectButton.Custom>

      <br />
    </div>
  );
}
