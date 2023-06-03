import styles from "../styles/Home.module.css";
import BuyMeACoffee from "../components/buyMeACoffee";
import { Box } from "@chakra-ui/react";

export default function Home() {
  return (
    <Box>
      <main className={styles.main}>
        <BuyMeACoffee />
      </main>
    </Box>
  );
}
