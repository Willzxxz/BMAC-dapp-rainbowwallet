import { Box, VStack } from "@chakra-ui/react";
import Footer from "../components/footer";
import Navbar from "../components/navigation/navbar";

export default function MainLayout({ children }) {
  return (
    <Box>
      <Navbar />
      {children}
      <Footer />
    </Box>
  );
}
