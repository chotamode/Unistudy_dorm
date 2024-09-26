import Image from 'next/image';
import logo from '../../../public/logo.svg';
import Button2 from "@/app/components/Button2";
import Link from "next/link";

const Header = () => {
    return (
        <header className="bg-none text-white py-8 px-20">
            <nav className="mt-2 flex flex-row justify-between items-center font-montserrat w-full">
                {/*  logo*/}
                <div className="flex-shrink-0">
                    <Image src={logo} alt="Logo" width={55} height={55}/>
                </div>
                <div className={" text-bold font-medium"}>
                    <Link href="/contacts">
                        <div className="text-black cursor-pointer">Contacts</div>
                    </Link>
                </div>
            </nav>
        </header>
    );
};

export default Header;