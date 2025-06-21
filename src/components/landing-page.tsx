import FirstPage from "./firstPage";
import SecondPage from "./second-page";
import ThirdPage from "./third-page";
import Footer from "./footer/footer";

export default function LandingPage() {
  return (
    <div className="w-full h-screen flex flex-col">
      <FirstPage />
      <SecondPage />
      <ThirdPage />
      <Footer />
    </div>
  );
}