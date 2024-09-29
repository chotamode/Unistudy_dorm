import Image from 'next/image';
import logo from '../../../public/logo.svg';
import fbLogo from '../../assets/social_media/fb_logo.svg';
import instaLogo from '../../assets/social_media/inst_logo.svg';
import Link from 'next/link';

const Footer = () => {
    return (
        <footer>
            <div

                className="bg-[#D9E8FB] p-4 py-8 md:py-20 text-black flex flex-col
                           lg:flex-row flex-wrap md:justify-between md:items-center px-10  md:px-20 lg:px-28
                           rounded-large"
            >
                <div className="flex flex-col md:flex-row justify-start items-start flex-wrap md:justify-between md:w-full">
                    <div className="flex flex-col md:flex-row flex-wrap justify-start items-start md:gap-2 lg:gap-20 minibook:gap-14 mr-10">
                        <div className="relative mb-5 md:mr-10 w-14 h-14 lg:w-20 lg:h-20 flex-shrink-0">
                            <Link href="/">
                                <Image src={logo} alt="Logo" fill/>
                            </Link>
                        </div>
                        <div className="text-center font-medium">
                            <ul className="flex flex-col text-left font-montserrat gap-y-2 ">
                                <li className="text-adxs lg:text-xl">
                                    <div><a href="#booking" className="hover:underline">To book</a></div>
                                    <div><a href="#contacts" className="hover:underline">Contacts</a></div>
                                </li>
                                <li className="text-xs lg:text-lg">
                                    <div>Correspondence address:</div>
                                    <div><a href="#adress" className="hover:underline ">Jaurisova 515/4, Praha 4 -
                                        Michle</a>
                                    </div>
                                </li>
                                <li className="text-xs lg:text-lg"><a href="#https://roomrent.cz/" className="hover:underline">Link
                                    to
                                    our old website</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className={"flex flex-col gap-3 lg:mt-0 mt-3 md:mt-10  md:w-auto w-60 text-sm lg:text-xl xl:text-xxl text-start xl:text-center font-medium"}>
                        <div className= " ">
                            <p className=" w-60 ">+420 775 095 879</p>
                            <p className=" w-60 ">+420 773 037 688</p>
                        </div>
                        <div className={"flex flex-row justify-start md:justify-end gap-x-2"}>
                           <div className="relative  w-6 h-6  lg:w-10 lg:h-10 xl:w-12 xl:h-12"> <Image src={instaLogo} alt="Instagram" fill/> </div>
                           <div className="relative  w-6 h-6 lg:w-10 lg:h-10 xl:w-12 xl:h-12"> <Image src={fbLogo} alt="Facebook" fill/> </div>
                        </div>
                    </div>
                </div>

            </div>
            <div className="flex flex-row flex-wrap justify-between text-stone-400 font-medium text-xs py-6 px-14">

                <div className=" flex justify-around">

                    <p> &copy; Copyright 2024. UniStudy</p>

                    <div className="flex px-28 gap-16">
                        <Link href={`../rooms`}>
                            Privacy policy
                        </Link>

                        <Link href={`../rooms`}>
                           Offer Agreement
                        </Link>

                    </div>

                </div>

                <div>
                    <p>Made in Solonobeach</p>
                </div>

            </div>
        </footer>
    );
};

export default Footer;