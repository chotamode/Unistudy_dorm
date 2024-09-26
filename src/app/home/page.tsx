import Layout from "@/app/components/Layout";
import house1 from "@/assets/home/house1.svg";
import house2 from "@/assets/home/house2.svg";
import house3 from "@/assets/home/house3.svg";
import Image from 'next/image';

const home = () => {
    return (
        <Layout>
            <div className={"flex flex-col justify-center items-center gap-6"}>

                <div className={"flex flex-row gap-4 justify-between items-start h-96"}>
                    <House icon={house1} title={"PRAGUE CASTLE APARTMENTS"}
                           p1={"10 minutes walk from prague castle and schwarzenberg palace"}
                           p2={"70+ accommodation options including single, double and triple rooms"}></House>
                    <div className={"w-0 h-full border-[#0F478D] border-r-2 mx-32"}>
                    </div>
                    <House icon={house2} title={"KAMYCKA APARTMENTS"}
                           p1={"Perfect location for czu students and people who want to live in one of the safest parts of prague"}
                           p2={"Sizes of apartments are from 18 square meters to 56 square meters"}></House>
                </div>

                <div>
                    <House icon={house3} title={"SOKOL APARTMENTS"}
                           p1={"Perfect location for czu students and people who want to live in one of the safest parts of prague"}
                           p2={"Sizes of apartments are from 18 square meters to 56 square meters"}></House>
                </div>
            </div>
        </Layout>
    );
}

interface HouseProps {
    icon: string;
    title: string;
    p1: string;
    p2: string;
}

const House = ({icon, title, p1, p2}: HouseProps) => {
    return (
        <div className={"flex flex-col justify-center items-center w-[32rem]"}>
            <Image src={icon} alt={title} width={180} height={180}/>
            <h2>{title}</h2>
            <p className={"text-center"}>
                {p1}
            </p>
            <p className={"text-center"}>
                {p2}
            </p>
        </div>
    );
};

export default home;