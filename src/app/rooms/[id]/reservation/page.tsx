"use client";

import React, {useEffect, useRef, useState} from 'react';
import {useParams} from 'next/navigation';
import Image from 'next/image';
import Layout from "@/app/components/Layout";
import Button2 from "@/app/components/Button2";
import Link from "next/link";
import {getBedsByRoomId} from '@/app/api/rooms';
import planDefault from '../../../../assets/room_plans/plan_default.svg';
import chosenBed from '../../../../assets/beds/chosen_bed.svg';
import freeBed from '../../../../assets/beds/free_bed.svg';
import occupiedBed from '../../../../assets/beds/occupied_bed.svg';
import finger from '../../../../assets/finger.svg';
import freeHorizontalBed from '../../../../assets/beds/free_horizontal_bed.svg';
import chosenHorizontalBed from '../../../../assets/beds/chosen_horizontal_bed.svg';
import occupiedHorizontalBed from '../../../../assets/beds/occupied_horizontal_bed.svg';
import plan1 from '../../../../assets/room_plans/plan1.svg';

interface Bed {
    id: number;
    occupied: boolean;
    x?: number;
    y?: number;
    horizontal?: boolean;
    room?: number;
}

interface PlanProps {
    beds: Bed[];
    roomPlan?: string;
}

const plansMapping: { [key: string]: string } = {
    '1': plan1,
    '5': plan1,
};

const bedsMapping: Bed[] = [
    {id: 1, occupied: true, x: 20, y: 20, horizontal: false, room: 1},
    {id: 2, occupied: true, x: 20, y: 350, horizontal: true, room: 1},
    {id: 3, occupied: true, x: 20, y: 20, horizontal: false, room: 5},
    {id: 4, occupied: true, x: 20, y: 350, horizontal: true, room: 5},
];

const Plan: React.FC<PlanProps> = ({beds = []}) => {
    const {id} = useParams();
    const planImage = plansMapping[id as string] || planDefault;

    const bedsForPlan = bedsMapping
        .filter(bed => bed.room === Number(id))
        .map(bed => ({
            ...bed,
            occupied: beds.find(dbBed => dbBed.id === bed.id)?.occupied ?? bed.occupied
        }));

    const [selectedBed, setSelectedBed] = useState<Bed | null>(null);
    const [showMessage, setShowMessage] = useState(false);
    const messageRef = useRef<HTMLDivElement>(null);

    const handleBedClick = (bed: Bed) => {
        if (!bed.occupied) {
            setSelectedBed(bed);
            setShowMessage(true);
        }
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (messageRef.current && !messageRef.current.contains(event.target as Node)) {
            setShowMessage(false);
            setSelectedBed(null);
        }
    };

    useEffect(() => {
        if (showMessage) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showMessage]);

    return (
        <div className={"flex justify-center bg-[#F6F4F2] rounded-3xl relative w-full h-full"}
             style={{boxShadow: 'inset 0 7px 10px rgba(0, 0, 0, 0.3), 0 7px 10px rgba(0, 0, 0, 0.2)'}}>
            <div
                className="absolute top-[-30px] left-1/2 transform -translate-x-1/2 px-6 pr-2 w-80 h-16 bg-[#0F478D] rounded-2xl flex flex-row items-center">
                <p className="w-3/4 text-white text-center font-semibold whitespace-nowrap text-sm">
                    To book a bed, click on the bed
                </p>
                <div className="relative w-1/4 h-4">
                    <Image src={finger} alt="Finger" layout="fill" objectFit="contain"/>
                </div>
            </div>
            <div className="relative w-full h-full">
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100"
                     preserveAspectRatio="xMidYMid slice">
                    <image href={planImage.src} width="100%" height="100%"/>
                    {bedsForPlan.map((bed) => (
                        <image
                            key={bed.id}
                            href={bed.occupied
                                ? (bed.horizontal ? occupiedHorizontalBed.src : occupiedBed.src)
                                : (selectedBed?.id === bed.id
                                    ? (bed.horizontal ? chosenHorizontalBed.src : chosenBed.src)
                                    : (bed.horizontal ? freeHorizontalBed.src : freeBed.src))}
                            x={bed.x}
                            y={bed.y}
                            width={bed.horizontal ? '10' : '20'}
                            height={bed.horizontal ? '20' : '10'}
                            onClick={() => handleBedClick(bed)}
                            className="cursor-pointer"
                        />
                    ))}
                </svg>
                {selectedBed && showMessage && (
                    <div ref={messageRef}
                         className="absolute bg-white rounded-2xl shadow-2xl p-8 flex flex-col gap-3 items-center"
                         style={{left: (selectedBed.x ?? 0) + 20, top: (selectedBed.y ?? 0) + 20}}>
                        <p className={"text-3xl font-normal text-center"}>
                            The bed is free
                        </p>
                        <Link href={`/rooms/${id}/reservation/${selectedBed.id}`}>
                            <Button2 className={"w-28 h-12 mt-2"} color={"bg-[#14803F]"}>
                                Book
                            </Button2>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

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
            <div className={"flex justify-center flex-col items-center h-[85vh] mx-56"}>
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