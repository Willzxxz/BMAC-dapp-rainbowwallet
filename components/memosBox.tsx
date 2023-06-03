import { Box, Center, HStack, Text } from "@chakra-ui/react";
import { useState } from "react";

export default function MemosBox() {
  const [memos, setMemos] = useState([]);

  return (
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
                <Box>{timestamp.toLocaleDateString("en-US", options)}</Box>
              </HStack>
            </Box>
          );
        })}
    </Box>
  );
}
