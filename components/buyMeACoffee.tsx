import abi from "../utils/BuyMeACoffee.json";
import { ethers } from "ethers";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import {
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Link,
  Text,
  Textarea,
} from "@chakra-ui/react";
import ConnectCustomButton from "./connectButtonCustom";
// import MemosBox from "./memosBox";
import { useAccount } from "wagmi";
import BmacForm from "./bmac-form";

export default function BuyMeACoffee() {
  // Contract Address & ABI
  const contractAddress = "0xD6563FA7E41C643be7EF1D2558E2004d31A306bb";
  const contractABI = abi.abi;

  const [isMagic, setIsMagic] = useState(false);
  const { isConnected } = useAccount({
    onConnect: ({ address, isReconnected, connector }) => {
      if (!isReconnected) alert("Wallet has been connected!");
    },
    onDisconnect: () => {
      alert("Wallet disconnected");
    },
  });

  useEffect(() => {
    const checkWalletConnection = async () => {
      if (isConnected) {
        setIsMagic(true);
      } else {
        setIsMagic(false);
      }
    };

    checkWalletConnection();
  }, [isConnected]);

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

  const options: Intl.DateTimeFormatOptions = {
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
          timestamp: new Date(timestamp),
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
    <Box>
      <Head>
        <title>Buy Will a Coffee!</title>
        <meta name="description" content="Tipping site" />
        {/* <link rel="icon" href="/favicon.ico" />  */}
      </Head>
      <Center>
        <Box
          border="2px solid black"
          w="60rem"
          h="30rem"
          borderRadius="12px"
          top="5rem"
          position="absolute"
          bgColor="#0E76FD"
          zIndex="-1"
        />
      </Center>
      <Box className={styles.main} mt="-30px">
        <Box
          border="1rem solid black"
          w="100vw"
          h="7rem"
          top="8rem"
          position="absolute"
          bgColor="black"
          zIndex="-1"
        />
        <Text
          fontSize="73px"
          mb="50px"
          color="white"
          fontFamily="Spline Sans Mono"
        >
          Buy Will a Coffee!
        </Text>
        <Box
          border="2px"
          py="20px"
          px="40px"
          borderRadius="12px"
          bgColor="white"
        >
          <FormControl>
            <FormLabel>Name</FormLabel>
            <Input
              id="name"
              type="text"
              placeholder="Anonymous"
              onChange={onNameChange}
              mb="2rem"
            />
            <FormLabel>Send Will a message</FormLabel>
            <Textarea
              rows={4}
              placeholder="Enjoy your coffee!"
              id="message"
              mb="2rem"
              onChange={onMessageChange}
              required
            />
            <br />
            <Center>
              <div>
                {isMagic ? (
                  <Button
                    bgColor="#3574F4"
                    color="white"
                    _hover={{ transform: "scale(1.03)" }}
                    borderRadius="12px"
                    onClick={buyCoffee}
                  >
                    Send 1 Coffee for 0.001ETH
                  </Button>
                ) : (
                  <ConnectCustomButton />
                )}
              </div>
            </Center>
          </FormControl>
        </Box>
      </Box>
      {/* <BmacForm /> */}

      {isMagic && (
        <Center>
          {/* <MemosBox></MemosBox> */}
          <Box
            border="2px"
            w="50rem"
            py="20px"
            px="40px"
            borderRadius="12px"
            bgColor=" #0E76FD"
          >
            <Center>
              <Text mb="20px" fontSize="20px" color="white">
                <b>Memos received</b>
              </Text>
            </Center>

            {memos
              .slice(0)
              .reverse()
              .map((memo, idx) => {
                const timestamp = new Date(memo.timestamp * 1000);

                return (
                  <Box
                    bgColor="white"
                    key={idx}
                    style={{
                      border: "2px solid",
                      borderRadius: "5px",
                      padding: "5px",
                      margin: "5px",
                    }}
                  >
                    <Box style={{ fontWeight: "bold" }}>"{memo.message}"</Box>
                    <Box maxH="50px" minH="30px" />
                    <HStack justifyContent="space-between">
                      <Box>From: {memo.name} </Box>
                      <Box>
                        {timestamp.toLocaleDateString("en-US", options)}
                      </Box>
                    </HStack>
                  </Box>
                );
              })}
          </Box>
        </Center>
      )}

      <br />
    </Box>
  );
}
