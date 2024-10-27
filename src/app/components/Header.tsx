"use client";

import Image from 'next/image';
import logo from '../../../public/logo.svg';
import Link from "next/link";
import { usePathname } from 'next/navigation';

const Header = () => {
    const pathname = usePathname();
    const isBlueBackground =  pathname.includes('/reservation/');

    return (
        <header className={`static top-0 left-0 w-full p-4 ${isBlueBackground ? 'bg-[#0F478D] md:bg-transparent' : 'bg-transparent'} z-20`}>
            <nav className="flex flex-row justify-between items-center font-montserrat w-full">
                {/* Logo */}
                <div className="relative w-10 h-10 tablet:w-14 tablet:h-14 flex-shrink-0">
                    <Link href="/">
                        <Image src={logo} alt="Logo" fill />
                    </Link>
                </div>
                {/* Contacts Link */}
                <div className="text-sm tablet:text-bold font-medium">
                    <Link href="/contacts">
                        <div className="text-black cursor-pointer">Contacts</div>
                    </Link>
                </div>
            </nav>
        </header>
    );
};

export default Header;
