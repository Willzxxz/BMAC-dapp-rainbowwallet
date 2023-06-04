import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Center,
  Button,
} from "@chakra-ui/react";

export default function BmacForm() {
  return (
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
      <Box border="2px" py="20px" px="40px" borderRadius="12px" bgColor="white">
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
  );
}
