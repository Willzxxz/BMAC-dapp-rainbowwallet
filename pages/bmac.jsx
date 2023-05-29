import abi from "../utils/BuyMeACoffee.json";
import { ethers } from "ethers";
import Head from "next/head";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import { Box, Button, Link, Text } from "@chakra-ui/react";

export default function Home() {
  // Contract Address & ABI
  const contractAddress = "0xD6563FA7E41C643be7EF1D2558E2004d31A306bb";
  const contractABI = abi.abi;

  // Component state
  const [currentAccount, setCurrentAccount] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [memos, setMemos] = useState([]);

  const onNameChange = (event) => {
    setName(event.target.value);
  };

  const onMessageChange = (event) => {
    setMessage(event.target.value);
  };

  // Wallet connection logic
  const isWalletConnected = async () => {
    try {
      const { ethereum } = window;

      const accounts = await ethereum.request({ method: "eth_accounts" });
      console.log("accounts: ", accounts);

      if (accounts.length > 0) {
        const account = accounts[0];
        console.log("wallet is connected! " + account);
      } else {
        console.log("make sure MetaMask is connected");
      }
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("please install MetaMask");
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
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
    isWalletConnected();
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
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Text fontSize="45px" mb="50px">
          Buy Will a Coffee!
        </Text>
        {currentAccount ? (
          <Box border="2px" py="20px" px="40px" borderRadius="12px">
            <form>
              <div>
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
              </div>
              <br />
              <div>
                <label>Send Will a message</label>
                <br />
                <Box border="1px" py="3px" px="4px" borderRadius="5px">
                  <textarea
                    rows={3}
                    placeholder="Enjoy your coffee!"
                    id="message"
                    onChange={onMessageChange}
                    required
                  ></textarea>
                </Box>
              </div>
              <br />
              <div>
                <Button
                  bgColor="#3574F4"
                  color="white"
                  _hover={{ transform: "scale(1.03)" }}
                  borderRadius="12px"
                  onClick={buyCoffee}
                >
                  Send 1 Coffee for 0.001ETH
                </Button>
              </div>
            </form>
          </Box>
        ) : (
          <Button
            bgColor="#3574F4"
            color="white"
            _hover={{ transform: "scale(1.03)" }}
            borderRadius="12px"
            onClick={connectWallet}
          >
            Connect your Wallet
          </Button>
        )}
      </main>

      {currentAccount && (
        <Box
          border="2px"
          py="20px"
          px="40px"
          borderRadius="12px"
          boxSize="60%"
          margin="auto"
        >
          {currentAccount && <h1>Memos received</h1>}

          {currentAccount &&
            memos.map((memo, idx) => {
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
                  <p style={{ fontWeight: "bold" }}>"{memo.message}"</p>
                  <p>
                    From: {memo.name} at {memo.timestamp.toString()}
                  </p>
                </div>
              );
            })}
        </Box>
      )}
      <br />

      <Box
        flex
        width="100%"
        p=" .8rem 4rem 0.8rem 4rem"
        gap="2rem"
      >
        <footer className={styles.footer}>
          <a
            href="https://www.linkedin.com/in/guilherme-de-deus/"
            target="_blank"
            rel="noopener noreferrer"
          >
            All Rights Reserved (c) Will de Deus 2023
          </a>
        </footer>
      </Box>
    </div>
  );
}
