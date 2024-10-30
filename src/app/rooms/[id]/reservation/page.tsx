"use client";

import React, {useEffect, useState} from 'react';
import {useParams} from 'next/navigation';
import Image from 'next/image';
import Layout from "@/app/components/Layout";
import {getBedsByRoomId} from '@/app/api/rooms';
import chosenBed from '../../../../assets/beds/chosen_bed.svg';
import freeBed from '../../../../assets/beds/free_bed.svg';
import {Bed, Plan} from "@/app/components/Plan";
import finger from "@/assets/finger.svg";

const BedSelect: React.FC = () => {
    const {id} = useParams();
    const [beds, setBeds] = useState<Bed[]>([]);

    useEffect(() => {
        if (id) {
            const fetchBeds = async () => {
                const bedsData = await getBedsByRoomId(Number(id));
                setBeds(bedsData);
            };
            fetchBeds().then(r => r);
        }
    }, [id]);

    return (
        <Layout>
            <div
                className={"flex justify-center flex-col items-center h-[85vh] mx-0  md:mx-12 laptop:mx-24 mt-10 tablet:mt-0 desktop:mx-36 large-desktop:mx-48"}>
                <div
                    className={"flex justify-center bg-[#F6F4F2]  py-8 px-4  rounded-3xl relative w-full md:h-[700px] phone:h-[550px] phonexs:h-[450px] h-[350px]  minibook:h-full"}
                    style={{boxShadow: 'inset 0 7px 10px rgba(0, 0, 0, 0.3), 0 7px 10px rgba(0, 0, 0, 0.2)'}}>

                    <div
                        className="absolute  top-[-30px] left-1/2 transform -translate-x-1/2 px-6 pr-2 w-80 h-16 bg-[#0F478D] rounded-2xl flex flex-row items-center">
                        <p className="w-3/4 text-white text-center font-semibold whitespace-nowrap text-sm">
                            To book a bed, click on the bed
                        </p>
                        <div className="relative ml-8 z-0 w-1/4 h-4">
                            <Image src={finger} alt="Finger" layout="fill" objectFit="contain"/>
                        </div>
                    </div>

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
            </div>
        </Layout>
    );
};

export default BedSelect;