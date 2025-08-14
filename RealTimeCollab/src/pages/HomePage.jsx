import Header from "../components/Header";
import Background from "../components/Background";
import HeroSection from "../components/HeroSection";
import SideSvgs from "../components/SideSvgs";

function HomePage() {
  return (
    <>
      <Header />
      <Background>
        <HeroSection />
        <SideSvgs />
      </Background>
    </>
  );
}

export default HomePage;
