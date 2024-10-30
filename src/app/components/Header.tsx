import Image from 'next/image';
import logo from '../../../public/logo.svg';
import Button2 from "@/app/components/Button2";
import Link from "next/link";

const Header = () => {
    return (
        <header className="bg-none text-white py-3 tablet:py-8 px-5 tablet:px-20">
            <nav className="mt-2 flex flex-row justify-between items-center font-montserrat w-full">
                {/*  logo*/}
                <div className="relative w-10 h-10 ml-2 phone:-ml-6 md:ml-0 tablet:w-14 tablet:h-14 flex-shrink-0">
                    <Link href="/">
                        <Image src={logo} alt="Logo" fill />
                    </Link>
                </div>
                <div className={" text-sm tablet:text-bold font-medium"}>
                    <Link href="/contacts">
                        <div className="text-black cursor-pointer">Contacts</div>
                    </Link>
                </div>
            </nav>
        </header>
    );
};

export default Header;