"use client";

import React, { useEffect, useState } from 'react';
import RoomCard from './components/RoomCard';
import { getRooms } from './api/rooms';
import Image from 'next/image';
import IconSwitch from './components/IconSwitch';

interface Room {
    id: number;
    name: string;
    address: string;
    description: string;
    price_month: number;
    image: string;
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
        <div>
            <div className="relative">
                <Image
                    src="/images/mpage_hero.svg"
                    alt="Background"
                    objectFit="cover"
                    width={1920}
                    height={1080}
                />
                <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
                    <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-8xl font-bold text-black p-4 sm:p-12 md:p-16 rounded-xl text-center">
                        <div className="text-white">Student housing rentals</div>
                        <div className="text-[#A6D0FF]"> — easy and convenient!</div>
                        <p className="text-white text-xs sm:text-sm md:text-base lg:text-lg font-light w-2/12 sm:w-2/3 md:w-1/2 mx-auto">
                            We understand how important it is for students to find comfortable and affordable housing,
                            so we have created a platform that helps you quickly and efficiently choose an apartment
                            that is right for you.
                        </p>
                    </h1>
                </div>
            </div>
            <div className="min-h-screen bg-gray-100 p-8 px-64 pt-28">
                <main>
                    <IconSwitch />
                    <h2 className="text-8xl font-semibold text-black mb-20 text-cente mt-24 text-center">Spare rooms</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {rooms.map((room) => (
                            <RoomCard
                                key={room.id}
                                id={room.id}
                                name={room.name}
                                background={room.image}
                                address={room.address}
                                description={room.description}
                                price_month={room.price_month}
                            />
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default MainPage;