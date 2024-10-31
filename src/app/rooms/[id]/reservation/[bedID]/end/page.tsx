import GoToMainPageButton from "@/app/components/GoMainPageButton";
import Layout from "@/app/components/Layout";
import Image from 'next/image';
import geoIcon from '@/assets/geoIcon.svg';

const stage4Page = () => {
    return (
        <Layout>
            <div className={"flex flex-col justify-center items-center h-[47rem] bg-blue-100 rounded-0 tablet:rounded-3xl mx-0 sm:mx-10 md:mx-20 "}>
                <div className={"flex flex-col justify-center items-center gap-2 mb-6 md:mb-10"}>
                    <h1 className={"zfold:text-2xl phone:text-4xl md:text-5xl laptop:text-7xl font-semibold text-center"}>Now the manager will</h1>
                    <h1 className={"zfold:text-2xl phone:text-4xl md:text-5xl laptop:text-7xl font-semibold text-center"}>contact you</h1>
                </div>
                <div className={"flex items-center pr-8 laptop:pr-16 laptop:mr-1 gap-0 laptop:gap-2"}>
                    <Image src={geoIcon} alt="Geo Icon" className="w-10 h-10 laptop:w-16 laptop:h-16"/>
                    <div className={"bg-[#0F478D] rounded-3xl  py-4 px-8 md:px-12 mb-0 md:mb-0"}>
                        <p className={"text-white phonese:text-sm zfold:text-xs laptop:text-base"}>Kirovogradskaya street, 13A</p>
                    </div>
                </div>
                <p className={"underline mb-5 zfold:text-sm"}>Downloading documents</p>
                <div className={"pr-0 laptop:pr-0 zfold:text-xs phonese:text-base"}>
                    <GoToMainPageButton text="Go back to the main page"/>
                </div>
            </div>
        </Layout>
    );
}

export default stage4Page;