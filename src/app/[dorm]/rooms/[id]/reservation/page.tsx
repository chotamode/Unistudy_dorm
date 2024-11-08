"use client";

import React, {useEffect, useState} from 'react';
import {useParams, useSearchParams} from 'next/navigation';

import Image from 'next/image';
import Layout from "@/app/components/Layout";
import Link from "next/link";
import {getBedsByRoomId} from '@/app/api/rooms';
import chosenBed from '../../../../../assets/beds/chosen_bed.svg';
import freeBed from '../../../../../assets/beds/free_bed.svg';
import {Bed, Plan} from "@/app/components/Plan";
import finger from "@/assets/finger.svg";
import {useFormData, ReservationContextProvider} from "@/app/context/ReservationContext";
import Button2 from "@/app/components/Button2";

const BedSelect: React.FC = () => {
    const {id} = useParams();
    const [beds, setBeds] = useState<Bed[]>([]);
    const searchParams = useSearchParams();
    // const year = searchParams.get('year');
    // const gender = searchParams.get('gender');
    const { year, gender } = useFormData();

    useEffect(() => {
        if (id) {
            const fetchBeds = async () => {
                const bedsData = await getBedsByRoomId(Number(id), year);
                setBeds(bedsData);
            };
            fetchBeds().then(r => r);
        }
    }, [id]);

    const { dorm } = useParams();

    return (
        <Layout>
            {/* Контейнер с надписью и схемой */}
            <div className="relative flex flex-col items-center h-[85vh] mx-0 px-4 pt-10 phone:pt-8 md:mx-12 laptop:mx-24 desktop:mx-36 large-desktop:mx-48 mt-24 md:mt-8">
                {/* Надпись и иконка пальца */}
                <div
                    className="absolute -top-10 md:top-[-2rem] left-1/2 transform -translate-x-1/2
                           px-6 pr-4 md:pr-0 w-80 h-auto md:h-16 bg-transparent md:bg-[#0F478D]
                           rounded-2xl flex items-center justify-center z-10">
                    <p className="w-full text-black md:text-white text-center font-semibold whitespace-nowrap text-sm py-4 md:py-0">
                        To book a bed, click on the bed
                    </p>
                    <div className="relative pl-4 ml-3 w-5 h-5 hidden md:block">
                        <Image src={finger} alt="Finger" layout="fill" objectFit="contain" />
                    </div>
                </div>

                {/* Контейнер с планом комнаты */}
                <div
                    className="flex justify-center bg-[#F6F4F2] py-8 px-4 md:px-4 rounded-3xl
                           relative w-full md:h-[700px] phone:h-[550px] phonexs:h-[450px]
                           h-[350px] minibook:h-full mt-0 md:mt-6"
                    style={{ boxShadow: 'inset 0 7px 10px rgba(0, 0, 0, 0.3), 0 7px 10px rgba(0, 0, 0, 0.2)' }}
                >
                    <Plan beds={beds} />
                </div>

                {/* Легенда кроватей */}
                <div className="flex flex-row gap-4 mt-14">
                    <div className="flex flex-col items-center text-xl">
                        <Image src={freeBed} alt="Free bed" width={160} height={160} />
                        <p>Bed is free</p>
                    </div>
                    <div className="flex flex-col items-center text-xl">
                        <Image src={chosenBed} alt="Chosen bed" width={160} height={160} />
                        <p>Bed is booked</p>
                    </div>
                </div>

                {/* Кнопка назад */}
                <div className="my-10">
                    <Link href={`/${dorm}`}>
                        <Button2 className="w-full md:w-60 mt-12 md:mt-0">
                            Go back
                        </Button2>
                    </Link>
                </div>
            </div>
        </Layout>
    );

};

export default BedSelect;