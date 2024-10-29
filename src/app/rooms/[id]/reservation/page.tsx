"use client";

import React, {useEffect, useState} from 'react';
import {useParams} from 'next/navigation';
import Image from 'next/image';
import Layout from "@/app/components/Layout";
import {getBedsByRoomId} from '@/app/api/rooms';
import chosenBed from '../../../../assets/beds/chosen_bed.svg';
import freeBed from '../../../../assets/beds/free_bed.svg';
import {Bed, Plan} from "@/app/components/Plan";
import Link from "next/link";
import Button2 from "@/app/components/Button2";

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
            <div className={"flex justify-center flex-col items-center h-[85vh] mx-0  md:mx-12 laptop:mx-24 desktop:mx-36 large-desktop:mx-48"}>
                <Plan beds={beds}/>
                <div className={"flex flex-row gap-4 mt-14"}>
                    <div className={"flex flex-col items-center text-xl"}>
                        <Image src={freeBed} alt="Free bed" width={160} height={160}/>
                        <p>Bed is free</p>
                    </div>
                    <div className={"flex flex-col items-center text-lg md:text-xl w-24 h-24 md:w-40 md:h-40"}>
                        <Image src={chosenBed} alt="Chosen bed" width={160} height={160} sizes="(max-width: 768px) 80px, 160px"/>
                        <p className={"text-center"}>Bed is booked</p>
                    </div>
                </div>

                <Link href={`/rooms/${id}`}>
                <Button2 className={"w-full md:w-60 mt-12 md:mt-0"}>
                    Go back
                </Button2>
                </Link>
            </div>
        </Layout>
    );
};

export default BedSelect;