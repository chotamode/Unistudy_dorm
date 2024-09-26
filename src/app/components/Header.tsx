import Image from 'next/image';
import logo from '../../../public/logo.svg';
import Button2 from "@/app/components/Button2";

const Header = () => {
    return (
        <header className="bg-none text-white py-8 px-20">
            <nav className="mt-2 flex flex-row justify-between items-center font-montserrat w-full">
                {/*  logo*/}
                <div className="flex-shrink-0">
                    <a href="#Home"><Image src={logo} alt="Logo" width={55} height={55}/></a>
                </div>
                {/*  navigation*/}

                    <div className="text-black font-medium text-bold">Contacts</div>

            </nav>
        </header>
    );
};

export default Header;