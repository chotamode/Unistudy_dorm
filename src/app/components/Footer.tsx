import Image from 'next/image';
import logo from '../../../public/logo.svg';
import vkLogo from '@/assets/social_media/vk_logo.svg';
import fbLogo from '@/assets/social_media/fb_logo.svg';
import instaLogo from '@/assets/social_media/inst_logo.svg';

const Footer = () => {
    return (
        <footer className="bg-[#D9E8FB] p-4 mt-auto text-black flex flex-row justify-between items-center px-64 rounded-t-3xl">
            <Image src={logo} alt="Logo" className="mb-4" width={150} height={150}/>
            <div className="text-center">
                <ul className="flex flex-col text-left font-montserrat">
                    <li><a href="#contacts" className="hover:underline">Контакты</a></li>
                    <li><a href="#room-selection" className="hover:underline">Выбор комнаты</a></li>
                    <li><a href="#booking" className="hover:underline">Перейти к бронированию</a></li>
                </ul>
            </div>
            <div className={"flex flex-col text-center"}>
                <p>+420 999 99 99</p>
                <div className={"flex flex-row justify-center"}>
                    <Image src={vkLogo} alt="VK" width={30} height={30}/>
                    <Image src={fbLogo} alt="Facebook" width={30} height={30}/>
                    <Image src={instaLogo} alt="Instagram" width={30} height={30}/>
                </div>
            </div>
        </footer>
    );
};

export default Footer;