import Image from "next/image";
import Link from "next/link";

export default function Header() {
    return (
        <section className="fixed top-0 left-0 z-50 w-full bg-[var(--bg-clr)]/90 backdrop-blur-md shadow-sm pry-ff">
            <div className="flex items-center justify-between px-4 py-3">
                <Link href='/'>
                    <div className="flex items-center gap-2">
                        <Image
                            src='/tredia-logo.png'
                            alt="Tredia Logo"
                            width={40}
                            height={40}
                            className="w-auto object-cover"
                        />
                    </div>
                </Link>

                <span className="py-2.5 px-4 rounded-full bg-gray-400 text-black">N</span>
            </div>
        </section>
    );
}