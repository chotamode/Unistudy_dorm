import GoToMainPageButton from "@/app/components/GoMainPageButton";
import Layout from "@/app/components/Layout";
import Image from 'next/image';
import geoIcon from '@/assets/geoIcon.svg';

const stage4Page = () => {
    return (
        <Layout>
            <div className={"flex flex-col justify-center items-center h-[47rem] bg-blue-100 rounded-3xl mx-20"}>
                <div className={"flex flex-col justify-center items-center gap-2 mb-10"}>
                    <h1 className={"text-7xl font-semibold"}>Now the manager will</h1>
                    <h1 className={"text-7xl font-semibold"}>contact you</h1>
                </div>
                <div className={"flex items-center gap-2"}>
                    <Image src={geoIcon} alt="Geo Icon"/>
                    <div className={"bg-[#0F478D] rounded-3xl py-4 px-12 mb-2"}>
                        <p className={"text-white"}>Kirovogradskaya street, 13A</p>
                    </div>
                </div>
                <p className={"underline mb-5"}>Downloading documents</p>
                <div className={"pr-11"}>
                    <GoToMainPageButton text="Go back to the main page"/>
                </div>
            </div>
        </Layout>
    );
}

export default stage4Page;