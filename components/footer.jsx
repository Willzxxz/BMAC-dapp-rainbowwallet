import { Box } from "@chakra-ui/react";
import styles from "../styles/Home.module.css";

export default function Footer() {
  return (
    <Box width="100%" p="0.8rem 4rem 0.8rem 4rem" gap="2rem" marginTop="2%">
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
  );
}
