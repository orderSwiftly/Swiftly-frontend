import Image from 'next/image';

export default function FirstHero() {
  return (
    <section
      className="relative w-full max-w-xl flex items-center justify-center p-6 rounded-xl bg-transparent"
      style={{
        backgroundImage: 'radial-gradient(circle, rgba(0, 255, 231, 0.2) 0%, #010314 40%, transparent 10%)',
      }}
    >
      <Image
        src="/freepik_r2.png"
        width={500}
        height={500}
        alt="Hero Image"
        quality={100}
        className="z-10 object-contain w-full h-auto max-h-[450px]"
      />
    </section>
  );
}