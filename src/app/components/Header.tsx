import Image from 'next/image';
import logo from '../../../public/logo.svg';
import Button2 from "@/app/components/Button2";

const Header = () => {
    return (
        <header className="bg-none text-white py-8 px-20">
            <nav className="mt-2 flex flex-row justify-between items-center font-montserrat w-full">
                {/*  logo*/}
                <div className="flex-shrink-0">
                    <Image src={logo} alt="Logo" width={55} height={55}/>
                </div>
                {/*  navigation*/}
                <div className="font-medium flex flex-row min-w-96 justify-around text-bold">
                    <div className="text-black">To book</div>
                    <div className="text-black">Contacts</div>
                </div>
                <div>
                    <Button2>Home</Button2>
                </div>
            </nav>
        </header>
    );
};

export default Header;