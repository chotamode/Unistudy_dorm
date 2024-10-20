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

import sokol_plan1 from '../../../../assets/room_plans/sokol_plan1.svg';

import castle_plan1 from '../../../../assets/room_plans/castle_plan1.svg'
import castle_plan2 from '../../../../assets/room_plans/castle_plan2.svg'
import castle_plan3 from '../../../../assets/room_plans/castle_plan3.svg'
import castle_plan4 from '../../../../assets/room_plans/castle_plan4.svg'
import castle_plan5 from '../../../../assets/room_plans/castle_plan5.svg'
import castle_plan6 from '../../../../assets/room_plans/castle_plan6.svg'
import castle_plan7 from '../../../../assets/room_plans/castle_plan7.svg'
import castle_plan8 from '../../../../assets/room_plans/castle_plan8.svg'
import castle_plan9 from '../../../../assets/room_plans/castle_plan9.svg'
import castle_plan10 from '../../../../assets/room_plans/castle_plan10.svg'
import castle_plan11 from '../../../../assets/room_plans/castle_plan11.svg'
import castle_plan12 from '../../../../assets/room_plans/castle_plan12.svg'
import castle_plan13 from '../../../../assets/room_plans/castle_plan13.svg'
import castle_plan14 from '../../../../assets/room_plans/castle_plan14.svg'
import sokol_plan2 from '../../../../assets/room_plans/sokol_plan2.svg'
import sokol_plan3 from '../../../../assets/room_plans/sokol_plan3.svg'
import sokol_plan4 from '../../../../assets/room_plans/sokol_plan4.svg'
import sokol_plan5 from '../../../../assets/room_plans/sokol_plan5.svg'
import sokol_plan6 from '../../../../assets/room_plans/sokol_plan6.svg'
import sokol_plan7 from '../../../../assets/room_plans/sokol_plan7.svg'
import sokol_plan8 from '../../../../assets/room_plans/sokol_plan8.svg'
import sokol_plan9 from '../../../../assets/room_plans/sokol_plan9.svg'
import kamcka_plan1 from '../../../../assets/room_plans/kamcka_plan1.svg'
import kamcka_plan2 from '../../../../assets/room_plans/kamcka_plan2.svg'
import kamcka_plan3 from '../../../../assets/room_plans/kamcka_plan3.svg'
import kamcka_plan4 from '../../../../assets/room_plans/kamcka_plan4.svg'
import kamcka_plan5 from '../../../../assets/room_plans/kamcka_plan5.svg'
import kamcka_plan6 from '../../../../assets/room_plans/kamcka_plan6.svg'
import kamcka_plan7 from '../../../../assets/room_plans/kamcka_plan7.svg'
import kamcka_plan8 from '../../../../assets/room_plans/kamcka_plan8.svg'
import kamcka_plan9 from '../../../../assets/room_plans/kamcka_plan9.svg'
import kamcka_plan10 from '../../../../assets/room_plans/kamcka_plan10.svg'
import kamcka_plan11 from '../../../../assets/room_plans/kamcka_plan11.svg'
import sokol_plan10 from '../../../../assets/room_plans/sokol_plan10.svg'
import sokol_plan11 from '../../../../assets/room_plans/sokol_plan11.svg'

interface Bed {
    id: number;
    occupied: boolean;
    x?: number;
    y?: number;
    horizontal?: boolean;
    room?: number;
    plan?: string;
}

interface PlanProps {
    beds: Bed[];
    roomPlan?: string;
}

const plansMapping: { [key: string]: string } = {

    //sokol plans

    '1': sokol_plan1,
    '2': sokol_plan1,

    // castle plans

    '3': castle_plan1,
    '4': castle_plan2,
    '8': castle_plan3,
    '9': castle_plan3,
    '10': castle_plan4,
    '11': castle_plan4,
    '12': castle_plan4,
    '13': castle_plan5,
    '14': castle_plan5,
    '15': castle_plan6,
    '16': castle_plan7,
    '17': castle_plan8,
    '18': castle_plan9,
    '20': castle_plan11,
    '21': castle_plan12,
    '22': castle_plan13,
    '23': castle_plan14,
    '24': castle_plan10,

    // Continued Sokol Plans

    '25': sokol_plan1,
    '26': sokol_plan2,
    '27': sokol_plan3,
    '28': sokol_plan4,
    '29': sokol_plan5,
    '30': sokol_plan6,
    '31': sokol_plan7,
    '32': sokol_plan7,
    '33': sokol_plan8,
    '34': sokol_plan8,
    '35': sokol_plan9,
    '36': sokol_plan9,
    '37': sokol_plan9,
    '38': sokol_plan9,


    // Kamcka plans

    '39': kamcka_plan1,
    '40': kamcka_plan2,
    '41': kamcka_plan3,
    '42': kamcka_plan4,
    '43': kamcka_plan5,
    '44': kamcka_plan6,
    '45': kamcka_plan7,
    '46': kamcka_plan8,
    '47': kamcka_plan9,
    '48': kamcka_plan10,
    '49': kamcka_plan11,

    // Sokol Plans last added

    '50': sokol_plan10,
    '51': sokol_plan10,
    '52': sokol_plan11,



};

const bedsMapping: Bed[] = [

    // Sokolovna Plans

    {id: 1, occupied: true, x: 5, y: 14, horizontal: false, room: 1, plan: 'standard'},
    {id: 2, occupied: true, x: 5, y: 64, horizontal: true, room: 1, plan: 'standard'},

    {id: 3, occupied: true, x: 5, y: 14, horizontal: false, room: 2, plan: 'standard'},
    {id: 4, occupied: true, x: 5, y: 64, horizontal: true, room: 2, plan: 'standard'},

    // Castle apps

    {id: 5, occupied: true, x: 37, y: 14, horizontal: false, room: 3, plan: 'standard'},
    {id: 6, occupied: true, x: 37, y: 21, horizontal: false, room: 3, plan: 'standard'},
    {id: 7, occupied: true, x: 73, y: 76, horizontal: false, room: 3, plan: 'standard'},

    {id: 8, occupied: true, x: 40, y: 16, horizontal: true, room: 4, plan: 'standard'},
    {id: 9, occupied: true, x: 72, y: 16, horizontal: false, room: 4, plan: 'standard'},
    {id: 10, occupied: true, x: 72, y: 23, horizontal: false, room: 4, plan: 'standard'},

    {id: 11, occupied: true, x: 2, y: 26, horizontal: false, room: 8, plan: 'small'},
    {id: 12, occupied: true, x: 22, y: 26, horizontal: false, room: 8, plan: 'small'},
    {id: 13, occupied: true, x: 6, y: 65, horizontal: false, room: 8, plan: 'small'},
    {id: 14, occupied: true, x: 6, y: 60, horizontal: false, room: 8, plan: 'small'},
    {id: 15, occupied: true, x: 78, y: 65, horizontal: false, room: 8, plan: 'small'},

    {id: 16, occupied: true, x: 2, y: 26, horizontal: false, room: 9, plan: 'small'},
    {id: 17, occupied: true, x: 22, y: 26, horizontal: false, room: 9, plan: 'small'},
    {id: 18, occupied: true, x: 6, y: 65, horizontal: false, room: 9, plan: 'small'},
    {id: 19, occupied: true, x: 6, y: 60, horizontal: false, room: 9, plan: 'small'},
    {id: 20, occupied: true, x: 78, y: 65, horizontal: false, room: 9, plan: 'small'},

    {id: 21, occupied: true, x: 76, y: 60, horizontal: false, room: 10, plan: 'standard'},
    {id: 22, occupied: true, x: 26, y: 29, horizontal: false, room: 10, plan: 'standard'},

    {id: 23, occupied: true, x: 76, y: 60, horizontal: false, room: 11, plan: 'standard'},
    {id: 24, occupied: true, x: 26, y: 29, horizontal: false, room: 11, plan: 'standard'},

    {id: 25, occupied: true, x: 76, y: 60, horizontal: false, room: 12, plan: 'standard'},
    {id: 26, occupied: true, x: 26, y: 29, horizontal: false, room: 12, plan: 'standard'},

    {id: 27, occupied: true, x: 4, y: 71, horizontal: false, room: 13, plan: 'small'},
    {id: 28, occupied: true, x: 4, y: 51, horizontal: false, room: 13, plan: 'small'},
    {id: 29, occupied: true, x: 63, y: 27, horizontal: false, room: 13, plan: 'small'},
    {id: 30, occupied: true, x: 82, y: 27, horizontal: false, room: 13, plan: 'small'},
    {id: 31, occupied: true, x: 82, y: 22, horizontal: false, room: 13, plan: 'small'},

    {id: 32, occupied: true, x: 82, y: 22, horizontal: false, room: 14, plan: 'small'},
    {id: 33, occupied: true, x: 82, y: 27, horizontal: false, room: 14, plan: 'small'},
    {id: 34, occupied: true, x: 63, y: 27, horizontal: false, room: 14, plan: 'small'},
    {id: 35, occupied: true, x: 4, y: 71, horizontal: false, room: 14, plan: 'small'},
    {id: 36, occupied: true, x: 4, y: 51, horizontal: false, room: 14, plan: 'small'},

    {id: 37, occupied: true, x: 91, y: 53, horizontal: true, room: 15, plan: 'small'},
    {id: 38, occupied: true, x: 81, y: 72, horizontal: false, room: 15, plan: 'small'},
    {id: 39, occupied: true, x: 82, y: 21, horizontal: false, room: 15, plan: 'small'},
    {id: 40, occupied: true, x: 62, y: 21, horizontal: false, room: 15, plan: 'small'},

    {id: 41, occupied: true, x: 24, y: 22, horizontal: false, room: 16, plan: 'small'},
    {id: 42, occupied: true, x: 2, y: 22, horizontal: false, room: 16, plan: 'small'},
    {id: 43, occupied: true, x: 1, y: 33, horizontal: true, room: 16, plan: 'small'},

    {id: 44, occupied: true, x: 5, y: 55, horizontal: false, room: 17, plan: 'standard'},
    {id: 45, occupied: true, x: 5, y: 48, horizontal: false, room: 17, plan: 'standard'},

    {id: 46, occupied: true, x: 23, y: 52, horizontal: false, room: 18, plan: 'small'},
    {id: 47, occupied: true, x: 23, y: 62, horizontal: false, room: 18, plan: 'small'},
    {id: 48, occupied: true, x: 2, y: 40, horizontal: false, room: 18, plan: 'small'},
    {id: 49, occupied: true, x: 2, y: 29, horizontal: false, room: 18, plan: 'small'},

    {id: 52, occupied: true, x: 28, y: 42, horizontal: false, room: 20, plan: 'small'},
    {id: 53, occupied: true, x: 58, y: 42, horizontal: false, room: 20, plan: 'small'},
    {id: 54, occupied: true, x: 28, y: 4, horizontal: false, room: 20, plan: 'small'},

    {id: 55, occupied: true, x: 10, y: 85, horizontal: false, room: 21, plan: 'standard'},
    {id: 56, occupied: true, x: 73, y: 85, horizontal: false, room: 21, plan: 'standard'},

    {id: 57, occupied: true, x: 38, y: 5, horizontal: false, room: 22, plan: 'small'},
    {id: 58, occupied: true, x: 76, y: 46, horizontal: false, room: 22, plan: 'small'},
    {id: 59, occupied: true, x: 76, y: 41, horizontal: false, room: 22, plan: 'small'},

    {id: 60, occupied: true, x: 22, y: 5, horizontal: false, room: 23, plan: 'small'},
    {id: 61, occupied: true, x: 50, y: 5, horizontal: false, room: 23, plan: 'small'},
    {id: 62, occupied: true, x: 76, y: 3, horizontal: true, room: 23, plan: 'small'},
    {id: 63, occupied: true, x: 90, y: 22, horizontal: true, room: 23, plan: 'small'},
    {id: 64, occupied: true, x: 27, y: 86, horizontal: false, room: 23, plan: 'standard'},
    {id: 65, occupied: true, x: 70, y: 86, horizontal: false, room: 23, plan: 'standard'},

    {id: 66, occupied: true, x: 10, y: 85, horizontal: false, room: 24, plan: 'standard'},
    {id: 67, occupied: true, x: 73, y: 86, horizontal: false, room: 24, plan: 'standard'},

    // Sokolovna Plans continued

    {id: 68, occupied: true, x: 5, y: 14, horizontal: false, room: 25, plan: 'standard'},
    {id: 69, occupied: true, x: 5, y: 64, horizontal: true, room: 25, plan: 'standard'},

    {id: 70, occupied: true, x: 5, y: 42, horizontal: true, room: 26, plan: 'standard'},
    {id: 71, occupied: true, x: 86, y: 66, horizontal: true, room: 26, plan: 'standard'},

    {id: 72, occupied: true, x: 5, y: 14, horizontal: false, room: 27, plan: 'standard'},
    {id: 73, occupied: true, x: 5, y: 64, horizontal: true, room: 27, plan: 'standard'},

    {id: 74, occupied: true, x: 7, y: 6, horizontal: true, room: 28, plan: 'standard'},
    {id: 75, occupied: true, x:63, y: 83, horizontal: false, room: 28, plan: 'standard'},

    {id: 76, occupied: true, x:50, y: 5, horizontal: true, room: 29, plan: 'standard'},
    {id: 77, occupied: true, x:73, y: 85, horizontal: false, room: 29, plan: 'standard'},

    {id: 78, occupied: true, x:85, y: 55, horizontal: true, room: 30, plan: 'standard'},
    {id: 79, occupied: true, x:4, y: 76, horizontal: true, room: 30, plan: 'standard'},

    {id: 80, occupied: true, x:85, y: 64, horizontal: true, room: 31, plan: 'standard'},
    {id: 81, occupied: true, x:6, y: 18, horizontal: false, room: 31, plan: 'standard'},

    {id: 82, occupied: true, x:85, y: 64, horizontal: true, room: 32, plan: 'standard'},
    {id: 83, occupied: true, x:6, y: 18, horizontal: false, room: 32, plan: 'standard'},

    {id: 84, occupied: true, x:76, y: 14, horizontal: true, room: 33, plan: 'standard'},
    {id: 85, occupied: true, x:74, y: 78, horizontal: false, room: 33, plan: 'standard'},

    {id: 86, occupied: true, x:76, y: 14, horizontal: true, room: 34, plan: 'standard'},
    {id: 87, occupied: true, x:74, y: 78, horizontal: false, room: 34, plan: 'standard'},

    {id: 88, occupied: true, x:5, y: 13, horizontal: true, room: 35, plan: 'standard'},
    {id: 89, occupied: true, x:74, y: 77, horizontal: false, room: 35, plan: 'standard'},

    {id: 90, occupied: true, x:5, y: 13, horizontal: true, room: 36, plan: 'standard'},
    {id: 91, occupied: true, x:74, y: 77, horizontal: false, room: 36, plan: 'standard'},

    {id: 92, occupied: true, x:5, y: 13, horizontal: true, room: 37, plan: 'standard'},
    {id: 93, occupied: true, x:74, y: 77, horizontal: false, room: 37, plan: 'standard'},

    {id: 94, occupied: true, x:5, y: 13, horizontal: true, room: 38, plan: 'standard'},
    {id: 95, occupied: true, x:74, y: 77, horizontal: false, room: 38, plan: 'standard'},

    // Kamcka Apartments

    {id: 96, occupied: true, x:22, y: 2, horizontal: true, room: 39, plan: 'standard'},

    {id: 97, occupied: true, x:69, y: 4, horizontal: true, room: 40, plan: 'standard'},
    {id: 98, occupied: true, x:57, y: 4, horizontal: true, room: 40, plan: 'standard'},

    {id: 99, occupied: true, x:21, y: 4, horizontal: true, room: 41, plan: 'standard'},
    {id: 100, occupied: true, x:34, y: 4, horizontal: true, room: 41, plan: 'standard'},

    {id: 101, occupied: true, x:4, y: 67, horizontal: true, room: 42, plan: 'standard'},
    {id: 102, occupied: true, x:32, y: 67, horizontal: true, room: 42, plan: 'standard'},
    {id: 103, occupied: true, x:4, y: 20, horizontal: false, room: 42, plan: 'standard'},

    {id: 104, occupied: true, x:20, y: 5, horizontal: true, room: 43, plan: 'standard'},
    {id: 105, occupied: true, x:12, y: 76, horizontal: true, room: 43, plan: 'standard'},
    {id: 106, occupied: true, x:30, y: 76, horizontal: true, room: 43, plan: 'standard'},

    {id: 107, occupied: true, x:10, y: 3, horizontal: false, room: 44, plan: 'standard'},
    {id: 108, occupied: true, x:10, y: 17, horizontal: false, room: 44, plan: 'standard'},

    {id: 109, occupied: true, x:55, y: 33, horizontal: false, room: 45, plan: 'small'},
    {id: 110, occupied: true, x:55, y: 45, horizontal: false, room: 45, plan: 'small'},
    {id: 111, occupied: true, x:55, y: 86, horizontal: false, room: 45, plan: 'small'},

    {id: 112, occupied: true, x:82, y: 53, horizontal: true, room: 46, plan: 'standard'},
    {id: 113, occupied: true, x:68, y: 53, horizontal: true, room: 46, plan: 'standard'},

    {id: 114, occupied: true, x:68, y: 77, horizontal: true, room: 47, plan: 'standard'},
    {id: 115, occupied: true, x:58, y: 16, horizontal: false, room: 47, plan: 'standard'},
    {id: 116, occupied: true, x:58, y: 4, horizontal: false, room: 47, plan: 'standard'},

    {id: 117, occupied: true, x:64, y: 64, horizontal: true, room: 48, plan: 'small'},
    {id: 118, occupied: true, x:47, y: 64, horizontal: true, room: 48, plan: 'small'},
    {id: 119, occupied: true, x:4, y: 20, horizontal: true, room: 48, plan: 'small'},
    {id: 120, occupied: true, x:22, y: 49, horizontal: false, room: 48, plan: 'small'},

    {id: 121, occupied: true, x:32, y: 81, horizontal: true, room: 49, plan: 'small'},
    {id: 122, occupied: true, x:52, y: 90, horizontal: false, room: 49, plan: 'small'},
    {id: 123, occupied: true, x:52, y: 80, horizontal: false, room: 49, plan: 'small'},

    {id: 125, occupied: true, x:3, y: 50, horizontal: true, room: 50, plan: 'standard'},
    {id: 126, occupied: true, x:48, y: 66, horizontal: false, room: 50, plan: 'standard'},

    {id: 127, occupied: true, x:3, y: 50, horizontal: true, room: 51, plan: 'standard'},
    {id: 128, occupied: true, x:48, y: 66, horizontal: false, room: 51, plan: 'standard'},

    {id: 129, occupied: true, x:4, y: 34, horizontal: true, room: 52, plan: 'standard'},
    {id: 130, occupied: true, x:85, y: 74, horizontal: true, room: 52, plan: 'standard'},


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
                className="absolute  top-[-30px] left-1/2 transform -translate-x-1/2 px-6 pr-2 w-80 h-16 bg-[#0F478D] rounded-2xl flex flex-row items-center">
                <p className="w-3/4 text-white text-center font-semibold whitespace-nowrap text-sm">
                    To book a bed, click on the bed
                </p>
                <div className="relative w-1/4 h-4">
                    <Image src={finger} alt="Finger" layout="fill" objectFit="contain"/>
                </div>
            </div>
            <div className="relative w-full h-full">
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100"
                     preserveAspectRatio="xMidYMid meet">
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
                            width={bed.plan === 'small'
                                ? (bed.horizontal ? 8 : 16)
                                : (bed.horizontal ? 10 : 20)}

                            height={bed.plan === 'small'
                                ? (bed.horizontal ? 16 : 8)
                                : (bed.horizontal ? 20 : 10)}
                            onClick={() => handleBedClick(bed)}
                            className="cursor-pointer"
                        />
                    ))}

                </svg>
                {selectedBed && showMessage && (
                    <div ref={messageRef}
                         className="absolute bg-white rounded-2xl shadow-2xl p-8 flex flex-col gap-3 items-center"
                         style={{left: (selectedBed.x ?? 0) + 20 , top: (selectedBed.y ?? 0) + 10}}>
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