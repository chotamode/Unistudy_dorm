import Image from 'next/image';
import logo from '../../../public/logo.svg';
import Button from "@/app/components/Button";

const Header = () => {
    return (
        <header className="bg-none text-white p-4">
            <nav className="mt-2 flex flex-row justify-between items-center w-full">
                {/*  logo*/}
                <div className="flex-shrink-0">
                    <Image src={logo} alt="Logo" width={150} height={150}/>
                </div>
                {/*  navigation*/}
                <div className="flex space-x-2">
                    <Button backgroundColor="bg-[#0F0B5B]" textColor="text-white" textSize={"base"}>Выбрать комнату</Button>
                    <Button backgroundColor="bg-[#0F0B5B]" textColor="text-white" textSize={"base"}>Забронировать</Button>
                    <Button backgroundColor="bg-[#0F0B5B]" textColor="text-white" textSize={"base"}>Контакты</Button>
                </div>
                {/*    language switcher*/}
                <div className="flex-shrink-0 px-12 py-2 rounded-full h-fit bg-[#0F0B5B]">
                    <p className="text-white">RU</p>
                </div>
            </nav>
        </header>
    );
};

export default Header;