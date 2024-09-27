"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import planDefault from '../../assets/room_plans/plan_default.svg';
import Layout from "@/app/components/Layout";
import chosenBed from '../../assets/beds/chosen_bed.svg';
import freeBed from '../../assets/beds/free_bed.svg';
import occupiedBed from '../../assets/beds/occupied_bed.svg';
import finger from '../../assets/finger.svg';
import Button2 from "@/app/components/Button2";

interface Bed {
    id: number;
    occupied: boolean;
    x: number;
    y: number;
}

interface PlanProps {
    beds: Bed[];
    roomPlan?: string;
}

const Plan: React.FC<PlanProps> = ({ beds,
    roomPlan = planDefault,
}) => {
    const [selectedBed, setSelectedBed] = useState<Bed | null>(null);
    const [showMessage, setShowMessage] = useState(false);

    const handleBedClick = (bed: Bed) => {
        if (!bed.occupied) {
            setSelectedBed(bed);
            setShowMessage(true);
        }
    };

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
                <Image src={roomPlan} alt="Plan" layout="responsive" />
                {beds.map((bed) => (
                    <button
                        key={bed.id}
                        onClick={() => handleBedClick(bed)}
                        className="absolute w-28 h-15"
                        style={{ left: bed.x, top: bed.y }}
                    >
                        <Image
                            src={bed.occupied ? occupiedBed : (selectedBed?.id === bed.id ? chosenBed : freeBed)}
                            alt={`Bed ${bed.id}`}
                            layout="responsive"
                        />
                    </button>
                ))}
                {selectedBed && showMessage && (
                    <div className="absolute bg-white rounded-2xl shadow-2xl p-8 flex flex-col gap-3 items-center"
                         style={{ left: selectedBed.x + 20, top: selectedBed.y + 20 }}>
                        <p className={"text-3xl font-normal text-center"}>
                            The bed is free
                        </p>
                        <Button2 className={"w-28 h-12 mt-2"} color={"bg-[#14803F]"}>
                            Book
                        </Button2>
                    </div>
                )}
            </div>
        </div>
    );
};

const BedSelect: React.FC = () => {
    const beds: Bed[] = [
        { id: 1, occupied: false, x: 10, y: 0 },
        { id: 2, occupied: false, x: 150, y: 0 },
        { id: 3, occupied: true, x: 10, y: 300 },
        { id: 4, occupied: false, x: 550, y: 300 },
    ];

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