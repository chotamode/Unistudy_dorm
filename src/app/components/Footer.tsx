import Image from 'next/image';
import logo from '../../../public/logo.svg';
import fbLogo from '../../assets/social_media/fb_logo.svg';
import instaLogo from '../../assets/social_media/inst_logo.svg';

const Footer = () => {
    return (
        <footer className="bg-[#D9E8FB] p-4 py-20 text-black flex flex-shrink flex-row justify-between items-center px-44 rounded-large">
            <div className="flex justify-start items-center mr-10 ">
                <Image src={logo} alt="Logo" className="mb-4 mr-20 " width={90} height={90}/>

                <div className="text-center font-medium">
                    <ul className="flex flex-col text-left font-montserrat gap-y-2 ">
                        <li className="text-xl">
                            <div><a href="#booking" className="hover:underline">To book</a></div>
                            <div><a href="#contacts" className="hover:underline">Contacts</a></div>
                        </li>
                        <li className="text-lg">
                            <div>Correspondence address:</div>
                            <div><a href="#adress" className="hover:underline">Jaurisova 515/4, Praha 4 - Michle</a></div>
                        </li>
                        <li className="text-lg"><a href="#https://roomrent.cz/" className="hover:underline">Link to our old website</a></li>
                    </ul>
                </div>
            </div>

            <div className={"flex flex-col text-xxl text-center font-medium"}>
                <p>+420 775 095 879</p>
                <p>+420 773 037 688</p>
                <div className={"flex flex-row justify-end gap-x-2"}>
                    <Image src={instaLogo} alt="Instagram" width={40.5} height={40.5}/>
                    <Image src={fbLogo} alt="Facebook" width={40.5} height={40.5}/>
                </div>
            </div>
        </footer>
    );
};

export default Footer;