import Image from "next/image";
import Link from "next/link";
import { FaEnvelope } from "react-icons/fa";
import { FiHelpCircle, FiMenu } from "react-icons/fi";

interface HeaderProps {
    mode?: 'compact'; // mode is optional and can be 'compact'
}

export default function Header({ mode }: HeaderProps) {
    return (
        <div>
            <div className="py-4 flex items-center">
                <Link href="/">
                    <Image src="/logo.svg" alt="logo" width={100} height={100} className="w-8" />
                </Link>
                <div className="ml-auto flex items-center space-x-4">
                    {mode === 'compact' ? (
                        <div className="flex items-center">
                            <FiHelpCircle className="text-2xl mr-2" />
                            <FiMenu className="text-2xl" />
                        </div>
                    ) : (
                        <>
                            <Link href="/about">About</Link>
                            <Link href="https://github.com/m1ngjp/annoote" target="_blank" rel="noopener noreferrer">GitHub</Link>
                            <Link href="#" className="bg-secondary text-white px-4 py-2 rounded-full flex items-center outline-none focus-visible:ring-2 focus-visible:ring-primary duration-200 ring-offset-2">
                                <FaEnvelope className="mr-2" />
                                Contact
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}