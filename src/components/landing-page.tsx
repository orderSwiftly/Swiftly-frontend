import FirstPage from "./firstPage";
import SecondPage from "./second-page";
import ThirdPage from "./third-page";

export default function LandingPage() {
  return (
    <div className="w-full h-screen flex flex-col">
      <FirstPage />
      <SecondPage />
      <ThirdPage />
    </div>
  );
}