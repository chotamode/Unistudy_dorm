import Image from 'next/image';
import logo from '../../../public/logo.svg';
import fbLogo from '../../assets/social_media/fb_logo.svg';
import instaLogo from '../../assets/social_media/inst_logo.svg';
import Link from 'next/link';
import {useParams} from 'next/navigation';

const Footer = () => {
    const { dorm } = useParams();
    return (
        <footer>
            <div

                className="bg-[#D9E8FB] p-4 py-8 md:py-20 text-black flex flex-col
                           lg:flex-row flex-wrap md:justify-between md:items-center px-10  md:px-20 lg:px-28
                           rounded-large"
            >
                <div className="flex flex-col md:flex-row justify-start items-start flex-wrap md:justify-between md:w-full">
                    <div className="flex flex-col laptop:flex-row flex-wrap justify-start items-start md:gap-2 lg:gap-20 minibook:gap-14 mr-10">
                        <div className="relative mb-5 md:mr-10 w-14 h-14 lg:w-20 lg:h-20 flex-shrink-0">
                            <Link href={`/${dorm}`}>
                                <Image src={logo} alt="Logo" fill/>
                            </Link>
                        </div>
                        <div className="text-center items font-medium">
                            <ul className="flex flex-col text-left font-montserrat gap-y-2 ">
                                <li className="text-adxs lg:text-xl">
                                    <div><a href="#contacts" className="hover:underline">Contacts</a></div>
                                </li>
                                <li className="text-xs lg:text-lg">
                                    <div>Correspondence address:</div>
                                    <div><a href="#adress" className="hover:underline ">Jaurisova 515/4, Praha 4 -
                                        Michle</a>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className={"flex flex-col gap-3 lg:mt-0 mt-3 md:mt-10  md:w-auto w-60 text-sm lg:text-xl xl:text-xxl text-start xl:text-center font-medium"}>
                        <div className= " ">
                            <p className=" w-60 ">+420 724 309 967</p>
                            <p className=" w-60 ">+420 725 356 427</p>
                        </div>
                        <div className={"flex flex-row justify-start md:justify-end gap-x-2"}>
                           <div className="relative  w-6 h-6  lg:w-10 lg:h-10 xl:w-12 xl:h-12">
                               <Link href="https://www.instagram.com/roomrent.cz?igsh=M29ka3JsdXFkZG8z">
                                   <Image src={instaLogo} alt="Instagram" fill/>
                               </Link>
                           </div>
                        </div>
                    </div>
                </div>

            </div>
            <div className="flex flex-row flex-wrap justify-between text-stone-400 font-medium text-xs py-6 px-4 md:px-14">

                <div className=" flex flex-row w-screen gap-4 flex-wrap justify-between">

                    <div className="flex flex-wrap flex-row px-0 max-phone:gap-4 gap-10">
                        <p> &copy; Copyright 2024. RoomRent </p>


                        <Link href="/legal/gdpr.pdf" target="_blank" rel="noopener noreferrer">
                            Privacy policy
                        </Link>
                    </div>
                    <div className="flex ">
                        <Link href={"/"}>
                            Created by MetaFlow
                        </Link>
                    </div>


                </div>

            </div>
        </footer>
    );
};

export default Footer;