import { ConnectButton } from "@rainbow-me/rainbowkit";
import styles from "../../styles/Navbar.module.css";
import { Box } from "@chakra-ui/react";

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <Box fontFamily="Parisienne" fontSize="2rem">
        Will
      </Box>
      <Box>
        <ConnectButton></ConnectButton>
      </Box>
    </nav>
  );
}
