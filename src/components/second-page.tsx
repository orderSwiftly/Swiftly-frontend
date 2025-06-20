import Reason from "./reason"

export default function secondPage() {
    return (
        <section className="flex flex-col md:flex-row items-center justify-center gap-12 w-full py-16 px-6 md:px-12 mt-5 bg-white h-fit">
            <Reason />
        </section>
    )
}