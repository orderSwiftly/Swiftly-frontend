import Introduction from "./intro";
import FirstHero from "./hero";

export default function FirstPage() {
    return (
      <section className="flex flex-col md:flex-row items-center justify-between gap-12 w-full py-16 px-6 md:px-12 mt-5 bg-gradient-to-b from-[#006B4F] via-[#119471] to-[#2BBD96] h-fit">
        <Introduction />
        <FirstHero />
      </section>
    );
}  