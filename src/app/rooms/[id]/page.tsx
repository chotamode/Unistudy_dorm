"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getRoomById, getBedsByRoomId, getRoomDetailsByRoomId, getRoomType } from '../../api/rooms';
import Image from 'next/image';
import Layout from "@/app/components/Layout";
import placeholderImage from '@/assets/placeholder_room.jpg';
import Button2 from "@/app/components/Button2";
import Link from "next/link";

interface Room {
    area: number;
    id: number;
    name: string;
    address: string;
    description: string;
    price_month: number;
    image: string;
    mini_description: string;
}

interface Bed {
    id: number;
    occupied: boolean;
}

interface RoomDetail {
    id: number;
    detail: string;
}

const RoomDetails = () => {
    const { id } = useParams();
    const [room, setRoom] = useState<Room | null>(null);
    const [beds, setBeds] = useState<Bed[]>([]);
    const [details, setDetails] = useState<RoomDetail[]>([]);
    const [roomType, setRoomType] = useState<string>('both');

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

            const fetchDetails = async () => {
                const detailsData = await getRoomDetailsByRoomId(Number(id));
                setDetails(detailsData);
            };
            fetchDetails().then(r => r);

            const fetchRoomType = async () => {
                const type = await getRoomType(Number(id));
                setRoomType(type);
            };
            fetchRoomType().then(r => r);
        }
    }, [id]);

    if (!room) {
        return <div>Loading...</div>;
    }

    return (
        <Layout>
            <div className="px-4 md:px-48 rounded-3xl flex flex-col md:flex-row">
                <div className="relative rounded-xxl
                           bg-cover bg-center min-h-[20rem] md:min-h-[40rem] w-full md:w-110

                           " style={{backgroundImage: `url(${room.image})`}} >
                </div>
                <div className="w-full md:w-1/2  h-full flex flex-col justify-center gap-6 mt-6 md:mt-0">
                    <h1 className="text-2xl md:text-3xl px-1.5 md:px-[4px] font-bold">
                        {room.name}
                    </h1>
                    <ul className="list-disc text-sm md:text-adxs px-2 list-inside">
                        <h3 className="font-bold text-sm md:text-adxs mb-2">
                            {roomType === 'both' ? 'For boys and girls ' : `For ${roomType === 'male' ? 'boys' : 'girls'} only`}
                        </h3>
                        {details.map((detail) => (
                            <li key={detail.id}>{detail.detail}</li>
                            ))}
                    </ul>
                    <p className="bg-[#DBE9FB] text-adxs py-5 md:py-6 px-5 md:px-4 rounded-3xl">
                        {room.description}
                    </p>
                    <p className={"border-b-2 border-[#0F478D] w-fit pr-1 md:pr-12 font-medium"}>
                        Area: {room.area} m²
                    </p>
                    <h3 className={"font-bold"}>
                        Available places:
                    </h3>
                    <div className={"flex flex-col"}>
                        <p className="text-start text-adxs  w-full md:max-w-[450px] font-medium py-4">
                            Double room with access to the balcony |
                            1 place is free • 8500kh per month per place Double room
                            without access to the balcony |
                            2 places are free • 8000kh per month per place
                        </p>

                        <Link href={`/rooms/${id}/reservation`}>
                            <Button2 className={"w-full md:w-60 mt-5 md:mt-0"}>
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