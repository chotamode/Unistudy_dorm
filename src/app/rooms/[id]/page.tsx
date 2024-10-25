"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getRoomById, getBedsByRoomId, getRoomDetailsByRoomId, getRoomType } from '../../api/rooms';
import Image from 'next/image';
import Layout from "@/app/components/Layout";
import placeholderImage from '@/assets/placeholder_room.jpg';
import Button2 from "@/app/components/Button2";
import Link from "next/link";
import freeBed from '../../../assets/beds/free_bed.svg';
import {Reservation, Room, Bed} from '@/app/types';
import { cancelReservation } from '@/app/api/rooms';




interface RoomDetail {
    id: number;
    detail: string;
}

const RoomDetails: React.FC<Room > = ({ image }) => {

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

            const handleCancelReservation = async (reservationId: number) => {
                try {
                    await cancelReservation(reservationId);
                    await fetchBeds(); // Обновляем данные о кроватях после отмены резервации
                } catch (error) {
                    console.error('Error canceling reservation:', error);
                }
            };

        }
    }, [id]);

    if (!room) {
        return <div>Loading...</div>;
    }

    return (
        <Layout>
            <div className="px-48 rounded-3xl gap-10 flex flex-row">
                <div className="flex flex-row rounded-xxl
                           bg-cover bg-center min-h-[40rem] w-[700px]
                           " style={{backgroundImage: `url(${placeholderImage.src})`}} >
                </div>
                <div className="w-1/2  h-full flex flex-col justify-center gap-6">
                    <h1 className="text-3xl px-[4px] font-bold">
                        {room.name}
                    </h1>
                    <ul className="list-disc text-adxs px-2 list-inside">
                        <h3 className="font-bold text-adxs mb-2">
                            {roomType === 'both' ? 'For boys and girls ' : `For ${roomType === 'male' ? 'boys' : 'girls'} only`}
                        </h3>
                        {details.map((detail) => (
                            <li key={detail.id}>{detail.detail}</li>
                        ))}
                    </ul>
                    <p className="bg-[#DBE9FB] text-adxs py-6 px-4 rounded-3xl">
                        {room.description}
                    </p>
                    <p className={"border-b-2 border-[#0F478D] w-fit pr-12 font-medium"}>
                        Area: {room.area} m²
                    </p>
                    <h3 className={"font-bold"}>
                        Available places:
                    </h3>
                    <div className={"flex flex-col"}>
                        <div className="grid grid-cols-3 p-6 gap-4">
                            {beds.map(bed => (
                                <div key={bed.id} className="mb-2 bg-[#DBE9FB] p-3 border rounded-2xl">
                                    <div className="mt-2 flex flex-col gap-2">
                                        <Image
                                            src={freeBed}
                                            alt="free bed"
                                            objectFit="cover"
                                            width={75}
                                            height={75}>
                                        </Image>
                                        <p> bed - {bed.id}</p>
                                        <div className="flex flex-row gap-2">
                                            <p className="bg-[#32648B] text-white px-3 py-1 rounded-xl">{bed.cost}$</p>
                                            <p className="bg-[#32648B] text-white px-3 py-1 rounded-xl"> {new Date(bed.availableFrom).toLocaleDateString()} - {new Date(bed.availableTo).toLocaleDateString()}</p>
                                        </div>

                                    </div>

                                </div>
                            ))}
                        </div>

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