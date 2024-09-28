// src/app/rooms/asd/page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getRoomById, getBedsByRoomId } from '../../api/rooms';
import Image from 'next/image';
import Layout from "@/app/components/Layout";
import placeholderImage from '@/assets/placeholder_room.jpg';
import Button2 from "@/app/components/Button2";
import Link from "next/link";

interface Room {
    id: number;
    name: string;
    address: string;
    description: string;
    price_month: number;
    image: string;
}

interface Bed {
    id: number;
    occupied: boolean;
}

const RoomDetails = () => {
    const { id } = useParams();
    const [room, setRoom] = useState<Room | null>(null);
    const [beds, setBeds] = useState<Bed[]>([]);

    useEffect(() => {
        if (id) {
            const fetchRoom = async () => {
                const roomData = await getRoomById(Number(id));
                setRoom(roomData);
            };
            fetchRoom().then(r => r);

            const fetchBeds = async () => {
                const bedsData = await getBedsByRoomId(Number(id));
                setBeds(bedsData);
            };
            fetchBeds().then(r => r);
        }
    }, [id]);

    if (!room) {
        return <div>Loading...</div>;
    }

    return (
        <Layout>
            <div className="flex px-16 flex-row">
                <div className="w-1/2">
                    <Image
                        src={room.image || placeholderImage}
                        alt={room.name}
                        className="rounded-3xl h-full w-full"
                        width={400}
                        height={400}
                    />
                </div>
                <div className="w-1/2 px-16 h-full flex flex-col justify-center gap-6">
                    <h1 className="text-4xl font-bold">
                        {room.name}
                    </h1>
                    <ul className="list-disc list-inside">
                        <h3 className="font-bold mb-2">
                            For boys only
                        </h3>
                        <li>The two-storey apartment accommodates 6 people</li>
                        <li>Private bathroom for 6 residents</li>
                        <li>Access to a private balcony with a beautiful view</li>
                    </ul>
                    <p className="bg-[#DBE9FB] py-6 px-4 rounded-3xl">
                        Features of living: sorting of garbage (plastic, glass, and paper) is mandatory in the house.
                        Those who have just moved to the Czech Republic usually need to get used to a lower temperature
                        regime at home. Turning on the heating at full capacity is fraught with overspending of
                        electricity and additional expenses.
                    </p>
                    <p className={"border-b-2 border-[#0F478D] w-fit pr-12 font-medium"}>
                        Area: 75.2 sq2
                    </p>
                    <h3 className={"font-bold"}>
                        Available places:
                    </h3>
                    <div className={"flex flex-col"}>
                        {beds.map((bed) => (
                            <p key={bed.id}>
                                Bed {bed.id} is {bed.occupied ? 'occupied' : 'free'}
                            </p>
                        ))}

                        <Link href={`/rooms/${id}/reservation`}>
                            <Button2 className={"w-60"}>
                                Book a bed
                            </Button2>
                        </Link>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default RoomDetails;