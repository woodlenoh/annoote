import Image from "next/image";
import Link from "next/link";

export default function Footer() {
    return (
        <div className="mt-8 border-t py-8 grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="space-y-4">
                <Link href="/">
                    <Image src="/logo.svg" alt="logo" width={100} height={100} className="w-8" />
                </Link>
                <p>&copy; 2024 Annoote.</p>
            </div>
            <div className="md:hidden" />
            <div>
                <p className="mb-4 font-bold">Guides</p>
                <div className="flex flex-col space-y-2">
                    <Link href="#">How to Use</Link>
                    <Link href="#">FAQ</Link>
                </div>
            </div>
            <div>
                <p className="mb-4 font-bold">Legal</p>
                <div className="flex flex-col space-y-2">
                    <Link href="#">Terms of Use</Link>
                    <Link href="#">Privacy Policy</Link>
                </div>
            </div>
        </div>
    )
}