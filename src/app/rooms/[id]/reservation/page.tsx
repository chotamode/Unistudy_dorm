"use client";

import React, {useEffect, useState} from 'react';
import {useParams, useSearchParams} from 'next/navigation';
import Image from 'next/image';
import Layout from "@/app/components/Layout";
import Link from "next/link";
import {getBedsByRoomId} from '@/app/api/rooms';
import chosenBed from '../../../../assets/beds/chosen_bed.svg';
import freeBed from '../../../../assets/beds/free_bed.svg';
import {Bed, Plan} from "@/app/components/Plan";
import finger from "@/assets/finger.svg";
import Button2 from "@/app/components/Button2";

const BedSelect: React.FC = () => {
    const {id} = useParams();
    const [beds, setBeds] = useState<Bed[]>([]);
    const searchParams = useSearchParams();
    const year = searchParams.get('year');
    const gender = searchParams.get('gender');

    useEffect(() => {
        if (id) {
            const fetchBeds = async () => {
                const bedsData = await getBedsByRoomId(Number(id), Number(year));
                setBeds(bedsData);
            };
            fetchBeds().then(r => r);
        }
    }, [id]);

    return (
        <Layout>
            {/*контейнер с надписью и иконкой пальца*/}
            <div
                className="absolute -top-[13rem] phonese:-top-[13rem] zfold:-top-[20rem] phonexr:-top-[18rem] phonexs:-top-[19rem] phone:-top-[15rem] tablet:-top-[12vh] md:bottom-0 md:top-[5rem] laptop:top-[4rem] desktop:top-[5rem] large-desktop:top-[11rem]
                        left-[40vw]  phone:left-[42.5vw] phonexs:left-[42vw] phonexr:left-[42.5vw] tablet:left-[49vw] md:left-1/2
                        transform -translate-x-1/2 px-6 pr-2 w-80 h-screen md:h-16 bg-transparent md:bg-[#0F478D] rounded-2xl flex flex-row items-center justify-center
                        ">
                <p className="w-3/4 text-black md:text-white text-center font-semibold whitespace-nowrap text-sm">
                    To book a bed, click on the bed
                </p>
                <div className="relative ml-8 z-0 w-1/4 h-4 hidden tablet:block">
                    <Image src={finger} alt="Finger" layout="fill" objectFit="contain"/>
                </div>
            </div>
            {/*контейнер с планом комнаты*/}
            <div
                className={"flex justify-center flex-col items-center h-[85vh] mx-0 px-4 pt-10 phone:pt-8 md:mx-12 laptop:mx-24 desktop:mx-36 large-desktop:mx-48 mt-16 md:mt-0"}>
                <div
                    className={"flex justify-center bg-[#F6F4F2]  py-8 px-4 md:px-4  rounded-3xl relative w-full md:h-[700px] phone:h-[550px] phonexs:h-[450px] h-[350px]  minibook:h-full"}
                    style={{boxShadow: 'inset 0 7px 10px rgba(0, 0, 0, 0.3), 0 7px 10px rgba(0, 0, 0, 0.2)'}}>

                    <Plan beds={beds}/>
                </div>
                <div className={"flex flex-row gap-4 mt-14"}>
                    <div className={"flex flex-col items-center text-xl"}>
                        <Image src={freeBed} alt="Free bed" width={160} height={160}/>
                        <p>Bed is free</p>
                    </div>
                    <div className={"flex flex-col items-center text-xl"}>
                        <Image src={chosenBed} alt="Chosen bed" width={160} height={160}/>
                        <p>Bed is booked</p>
                    </div>
                </div>
                {/*Кнопка*/}
                <div className={"my-10"}>
                    <Link href={`/rooms/${id}`}>
                        <Button2 className={"w-full md:w-60 mt-12 md:mt-0"}>
                            Go back
                        </Button2>
                    </Link>
                </div>
            </div>
        </Layout>
    );
};

export default BedSelect;