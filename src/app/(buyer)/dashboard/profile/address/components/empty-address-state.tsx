import Image from "next/image";

export default function EmptyAddressState() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-16">
      <div className="relative w-64 h-64 mb-6">
        <Image
          src="/no_addresses.png"
          alt="No address"
          fill
          className="object-contain"
          priority
        />
      </div>
      <p className="text-[#9C9C9C] text-2xl">No address yet</p>
    </div>
  );
}
