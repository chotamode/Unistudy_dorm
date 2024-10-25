import Layout from "@/app/components/Layout";
import phoneIcon from "@/assets/contacts/phone_icon.svg";
import socialIcon from "@/assets/contacts/social_icon.svg";
import locationIcon from "@/assets/contacts/location_icon.svg";
import Image from "next/image";
import instagramLogo from "@/assets/social_media/inst_logo.svg";
import facebookLogo from "@/assets/social_media/fb_logo.svg";
import GoToMainPageButton from "@/app/components/GoMainPageButton";

const contacts = () => {
    return (
        <Layout>
            <div className={"flex flex-col gap-10 sm:gap-16 justify-center items-center"}>
                <h1 className={"pt-10 mt-10 md:pt-0 md:mt-0 text-5xl md:text-5xl lg:text-6xl xl:text-7xl font-bold"}>
                    Our contacts
                </h1>

                <div className={"flex flex-col xl:flex-row gap-3"}>
                    {/*Контейнер с телефоном и адресом*/}
                    <div className={"flex flex-row  gap-10 sm:gap-28 md:gap-60 justify-center pr-5 items-center "}>

                        {/*адрес*/}
                        <div className={"flex flex-col  w-56 items-center gap-5 md:gap-6 lg:gap-10 "}>
                            <div className="phone:max-lg:w-32">
                                <Image src={locationIcon} alt="Location icon"/>
                            </div>

                            <div className={"flex flex-col justify-center items-center font-bold  md:text-xl"}>
                                <p>
                                    Jaurisova 515/4,
                                </p>
                                <p>
                                    Praha 4 - Michle
                                </p>
                            </div>
                        </div>

                        {/*телефон*/}
                        <div className={"flex flex-col items-center gap-5 md:gap-6 lg:gap-10"}>
                            <div className="flex flex-col md:flex-row items-center gap-4">
                                <Image src={phoneIcon} alt="Phone icon"/>
                            </div>
                            <div className={"flex flex-col justify-center font-bold items-center"}>
                                <p>+420 775 095 879</p>
                                <p>+420 773 037 688</p>
                                <p className={"text-xs md:text-base"}>(WhatsApp, Viber, Telegram)</p>
                            </div>
                        </div>
                    </div>

                    {/*Контейнер с социальными кнопками и кнопкой возврата*/}
                    <div className={"flex flex-col items-center gap-5 md:gap-6 lg:gap-10"}>
                        <div className="phone:max-lg:w-32">
                            <Image src={socialIcon} alt="Social icon"/>
                        </div>
                        <div className={"flex flex-row gap-4 cursor-pointer"}>
                            <Image src={instagramLogo} alt="Instagram logo"/>
                            <Image src={facebookLogo} alt="Facebook logo"/>
                        </div>
                        <div className={"static md:absolute justify-end mt-4 w-full md:w-1/6 md:pt-20 md:mt-14 pt-1"}>
                            <GoToMainPageButton text="Go back to the main page"/>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default contacts;