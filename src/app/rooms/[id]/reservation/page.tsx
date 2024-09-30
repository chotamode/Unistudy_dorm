"use client";

import React, {useEffect, useRef, useState} from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import planDefault from '../../../../assets/room_plans/plan_default.svg';
import Layout from "@/app/components/Layout";
import chosenBed from '../../../../assets/beds/chosen_bed.svg';
import freeBed from '../../../../assets/beds/free_bed.svg';
import occupiedBed from '../../../../assets/beds/occupied_bed.svg';
import finger from '../../../../assets/finger.svg';
import Button2 from "@/app/components/Button2";
import { getBedsByRoomId } from '@/app/api/rooms';
import freeHorizontalBed from '../../../../assets/beds/free_horizontal_bed.svg';
import chosenHorizontalBed from '../../../../assets/beds/chosen_horizontal_bed.svg';
import occupiedHorizontalBed from '../../../../assets/beds/occupied_horizontal_bed.svg';


import plan1 from '../../../../assets/room_plans/plan1.svg';
import Link from "next/link";
// import plan2 from '../../../../assets/room_plans/plan2.svg';
// import plan3 from '../../../../assets/room_plans/plan3.svg';
// import plan4 from '../../../../assets/room_plans/plan4.svg';
// import plan5 from '../../../../assets/room_plans/plan5.svg';
// import plan6 from '../../../../assets/room_plans/plan6.svg';

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
    // '2': plan2,
    // '3': plan3,
    // '4': plan4,
    // '5': plan5,
    // '6': plan6,
};

const bedsMapping: Bed[] = [
    // room1
    { id: 1, occupied: true, x: 20, y: 20, horizontal: false, room: 1 },
    { id: 2, occupied: true, x: 20, y: 350, horizontal: true, room: 1 },
    // room2
];

const Plan: React.FC<PlanProps> = ({ beds = [] }) => {
    const { id } = useParams();
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
        <div className={"flex justify-center bg-[#F6F4F2] px-44 py-24 rounded-3xl relative"}
             style={{ boxShadow: 'inset 0 7px 10px rgba(0, 0, 0, 0.3), 0 7px 10px rgba(0, 0, 0, 0.2)' }}>
            <div
                className="absolute top-[-30px] left-1/2 transform -translate-x-1/2 px-6 pr-2 w-80 h-16 bg-[#0F478D] rounded-2xl flex flex-row items-center">
                <p className="w-3/4 text-white text-center font-semibold whitespace-nowrap text-sm">
                    To book a bed, click on the bed
                </p>
                <div className="relative w-1/4 h-4">
                    <Image src={finger} alt="Finger" layout="fill" objectFit="contain" />
                </div>
            </div>
            <div className="relative">
                <Image src={planImage} alt="Plan" width={600} height={400} />
                {bedsForPlan.map((bed) => (
                    <button
                        key={bed.id}
                        onClick={() => handleBedClick(bed)}
                        className="absolute"
                        style={{
                            left: bed.x,
                            top: bed.y,
                            width: bed.horizontal ? '50px' : '100px',
                            height: bed.horizontal ? '100px' : '50px'
                        }} // Set the desired width and height conditionally
                    >
                        <Image
                            src={bed.occupied
                                ? (bed.horizontal ? occupiedHorizontalBed : occupiedBed)
                                : (selectedBed?.id === bed.id
                                    ? (bed.horizontal ? chosenHorizontalBed : chosenBed)
                                    : (bed.horizontal ? freeHorizontalBed : freeBed))}
                            alt={`Bed ${bed.id}`}
                            layout="fill" // Use layout="fill" to make the image fill the button
                            objectFit="contain" // Ensure the image maintains its aspect ratio
                        />
                    </button>
                ))}
                {selectedBed && showMessage && (
                    <div ref={messageRef} className="absolute bg-white rounded-2xl shadow-2xl p-8 flex flex-col gap-3 items-center"
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
            <div className={"flex justify-center flex-col items-center"}>
                <Plan beds={beds} />
                <div className={"flex flex-row gap-4 mt-14"}>
                    <div className={"flex flex-col items-center text-xl"}>
                        <Image src={freeBed} alt="Free bed" width={160} height={160} />
                        <p>Bed is free</p>
                    </div>
                    <div className={"flex flex-col items-center text-xl"}>
                        <Image src={chosenBed} alt="Chosen bed" width={160} height={160} />
                        <p>Bed is booked</p>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default BedSelect;