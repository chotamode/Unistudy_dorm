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
            <div className={"flex flex-col gap-16 justify-center items-center"}>
                <h1 className={"text-7xl font-bold"}>
                    Our contacts
                </h1>

                <div className={"flex flex-row gap-60 justify-center items-center"}>
                    <div className={"flex flex-col items-center gap-11"}>
                        <Image src={phoneIcon} alt="Phone icon"/>
                        <div className={"flex flex-col justify-center items-center"}>
                            <p>+420 775 095 879</p>
                            <p>+420 773 037 688</p>
                            <p>(WhatsApp, Viber, Telegram)</p>
                        </div>
                    </div>
                    <div className={"flex flex-col items-center gap-11"}>
                        <Image src={locationIcon} alt="Location icon"/>
                        <div className={"flex flex-col justify-center items-center"}>
                            <p>
                                Jaurisova 515/4,
                            </p>
                            <p>
                                Praha 4 - Michle
                            </p>
                        </div>
                    </div>
                    <div className={"flex flex-col items-center gap-11"}>
                        <Image src={socialIcon} alt="Social icon"/>
                        <div className={"flex flex-row gap-4"}>
                            <Image src={instagramLogo} alt="Instagram logo"/>
                            <Image src={facebookLogo} alt="Facebook logo"/>
                        </div>
                    </div>
                </div>

                <GoToMainPageButton text="Go back to the main page" />
            </div>
        </Layout>
    );
}

export default contacts;