import Footer from "../components/footer";
import Navbar from "../components/navigation/navbar";

export default function MainLayout({ children }) {
  return (
    <div>
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
