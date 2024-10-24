"use client";

import React, {useEffect, useState} from 'react';
import {useParams} from 'next/navigation';
import Image from 'next/image';
import Layout from "@/app/components/Layout";
import {getBedsByRoomId} from '@/app/api/rooms';
import chosenBed from '../../../../assets/beds/chosen_bed.svg';
import freeBed from '../../../../assets/beds/free_bed.svg';
import {Bed, Plan} from "@/app/components/Plan";

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
            <div className={"flex justify-center flex-col items-center h-[85vh] mx-0 phone:mx-56"}>
                <Plan beds={beds}/>
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