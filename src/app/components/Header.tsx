"use client";

import Image from 'next/image';
import logo from '../../../public/logo.svg';
import Button2 from "@/app/components/Button2";
import Link from "next/link";
import {useParams, usePathname} from 'next/navigation';

const Header = () => {
    const { dorm } = useParams();
    const pathname = usePathname();
    const isBlueBackground = /^\/rooms\/\d+\/reservation\/\d+$/.test(pathname);
    const isGayBlueBackground = pathname.includes('/rooms') && pathname.includes('/reservation') && pathname.includes('/end');

    return (
        <header
            className={`static top-0 left-0 w-full p-4 ${isGayBlueBackground ? 'bg-blue-100 surface:bg-transparent' : isBlueBackground ? 'bg-[#0F478D] md:bg-transparent' : 'bg-transparent'} z-20`}>
            <nav className="flex flex-row justify-between items-center font-montserrat w-full">
                {/* Logo */}
                <div className="relative w-10 h-10 tablet:w-14 tablet:h-14 flex-shrink-0">
                    <Link href={`/${dorm}`}>
                        <Image src={logo} alt="Logo" fill/>
                    </Link>
                </div>
                <div className={"text-sm tablet:text-bold font-medium"}>
                    <Link href={`/${dorm}/contacts`}>
                        <div className="text-black cursor-pointer">Contacts</div>
                    </Link>
                </div>
            </nav>
        </header>
    );
};

export default Header;