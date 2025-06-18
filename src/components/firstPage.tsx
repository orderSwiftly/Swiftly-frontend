import Introduction from "./intro";
import FirstHero from "./hero";

export default function FirstPage() {
    return (
      <section className="flex flex-col-reverse md:flex-row items-center justify-between gap-12 w-full py-16 px-6 md:px-12 mt-5 bg-[var(--bg-clr)] h-fit">
        <Introduction />
        <FirstHero />
      </section>
    );
}  