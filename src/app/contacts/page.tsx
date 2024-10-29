import Layout from "@/app/components/Layout";
import phoneIcon from "@/assets/contacts/phone_icon.svg";
import socialIcon from "@/assets/contacts/social_icon.svg";
import locationIcon from "@/assets/contacts/location_icon.svg";
import Image from "next/image";
import instagramLogo from "@/assets/social_media/inst_logo.svg";
import facebookLogo from "@/assets/social_media/fb_logo.svg";
import arrowRight from "@/assets/arrow_right.svg";
import GoToMainPageButton from "@/app/components/GoMainPageButton";

const contacts = () => {
    return (
        <Layout>
            <div className={"flex flex-col gap-10 sm:gap-16 justify-center items-center"}>
                <h1 className={"text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold"}>
                    Our contacts
                </h1>

                <div className={"flex flex-row gap-5 sm:gap-28 md:gap-40 justify-center items-center flex-wrap"}>



                    <div className={"flex flex-col w-40 tablet:w-56 custom-tablet:w-48 items-center gap-2 lg:gap-10"}>
                        <div className="tablet:max-lg:w-24  max-tablet:w-14">
                            <Image src={phoneIcon} alt="Phone icon"/>
                        </div>
                        <div className={"flex flex-col text-adxs tablet:text-lg justify-center items-center"}>
                            <p>+420 775 095 879</p>
                            <p>+420 773 037 688</p>
                            <p>Telegram</p>
                        </div>
                    </div>

                    <div className={"flex flex-col w-40 custom-tablet:w-48 tablet:w-56 items-center gap-2 lg:gap-10 "}>
                        <div className="tablet:max-lg:w-24 max-tablet:w-14">
                            <Image src={locationIcon} alt="Location icon"/>
                        </div>

                        <div className={"flex flex-col text-adxs tablet:text-lg justify-center items-center"}>
                            <p>
                                Jaurisova 515/4,
                            </p>
                            <p>
                                Praha 4 - Michle
                            </p>
                        </div>
                    </div>

                    <div className={"flex flex-col w-40 custom-tablet:w-48 tablet:w-56 mb-8 items-center gap-2 lg:gap-10"}>
                        <div className="tablet:max-lg:w-24 max-tablet:w-14">
                            <Image src={socialIcon} alt="Social icon"/>
                        </div>
                        <div className={"flex phone:max-sm:w-6 max-tablet:w-6 flex-row gap-4"}>
                            <Image src={instagramLogo} alt="Instagram logo"/>
                        </div>
                    </div>
                </div>

                <GoToMainPageButton text="Go back to the main page" />
            </div>
        </Layout>
    );
}

export default contacts;