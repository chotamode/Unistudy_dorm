"use client";

import React, { useEffect, useState } from 'react';
import RoomCard from './components/RoomCard';
import { getRooms } from './api/rooms';
import Button from './components/Button';
import maleIcon from '@/assets/sex/male.svg';
import femaleIcon from '@/assets/sex/female.svg';
import Image from "next/image";
import logo from "../../public/logo.svg";

interface Room {
    id: number;
    name: string;
    address: string;
    description: string;
    price_month: number;
}

const MainPage = () => {
    const [rooms, setRooms] = useState<Room[]>([]);

    useEffect(() => {
        const fetchRooms = async () => {
            const roomsData = await getRooms();
            setRooms(roomsData);
        };
        fetchRooms().then(r => r);
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 p-8 px-64">
            <header className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-black w-full">
                        <div>Student housing rentals</div>
                        <div className="text-main-color"> — easy and convenient! </div>
                        <p className="text-sm font-light text-black w-1/2 mx-auto">

                        </p> We understand how important it is for students to find comfortable and affordable housing,
                        We understand how important it is for students to find comfortable and affordable housing,
                        so we have created a platform that helps you quickly and efficiently choose an apartment that
                        is right for you.
                    </h1>
            </header>
            <main>
                <div className="flex justify-center space-x-4 mt-8">
                    <button className="w-16 h-16 rounded-lg flex items-center justify-center">
                        <Image src={maleIcon} alt={"Только для мальчиков"} className={"w-full h-full"}/>
                    </button>
                    <button className="w-16 h-16 rounded-lg flex items-center justify-center">
                        <Image src={femaleIcon} alt={"Только для девочек"} className={"w-full h-full"}/>
                    </button>
                    <button className="w-16 h-16 rounded-lg flex items-center justify-center">
                        <Image src={maleIcon} alt={"Только для мальчиков"} className={"w-full h-full"}/>
                    </button>
                </div>
                <h2 className="text-2xl font-bold text-black mb-8 text-center">Свободные комнаты</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {rooms.map((room) => (
                        <RoomCard
                            key={room.id}
                            name={room.name}
                            image={"https://placehold.co/600x600/png"}
                            address={room.address}
                            description={room.description}
                            price_month={room.price_month}
                        />
                    ))}
                </div>
            </main>
        </div>
    );
};

export default MainPage;