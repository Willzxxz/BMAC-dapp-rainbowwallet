import styles from "../styles/Home.module.css";
import NFTGallery from "../components/nftGallery";
import BuyMeACoffee from "../components/buyMeACoffee";

export default function Home() {
  return (
    <div>
      <main className={styles.main}>
        {/* <NFTGallery /> */}
        <BuyMeACoffee />
      </main>
    </div>
  );
}
