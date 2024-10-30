"use client";

import React, { useEffect, useState } from 'react';
import RoomCard from './components/RoomCard';
import { getRooms, getRoomType, getRoomAvailability } from './api/rooms';
import Image from 'next/image';
import IconSwitch from '@/app/components/IconSwitch';
import YearSwitch from "@/app/components/YearSwitch";

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
    const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
    const [gender, setGender] = useState<'male' | 'female' | 'both'>('female'); // Default to 'female'
    const [year, setYear] = useState<number>(new Date().getFullYear());

    useEffect(() => {
        const fetchRooms = async () => {
            const roomsData = await getRooms();
            setRooms(roomsData);
        };
        fetchRooms().then(r => r);
    }, []);

    useEffect(() => {
        const filterRooms = async () => {
            const filtered = await Promise.all(
                rooms.map(async (room) => {
                    const roomType = await getRoomType(room.id);
                    const isAvailable = await getRoomAvailability(room.id, year);
                    const matchesGender = gender === 'both' || roomType === gender || roomType === 'both';
                    return matchesGender && (isAvailable) ? room : null;
                })
            );
            setFilteredRooms(filtered.filter(room => room !== null) as Room[]);
        };
        filterRooms();
    }, [rooms, gender, year]);

    return (
        <div>
            <div className="relative">
                <Image
                    src="/images/mpage_hero.svg"
                    alt="Background"
                    objectFit="cover"
                    width={3840}
                    height={2160}
                />
                <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
                    <h1 className="text-1xl phonexs:text-2xl phone:text-3xl md:text-5xl lg:text-[4.2rem] xl:text-[5rem] font-bold text-black p-4 sm:p-12 md:p-16 rounded-xl text-center">
                        <div className="text-white">Student housing rentals</div>
                        <div className="text-[#A6D0FF]"> — easy and convenient!</div>
                        <p className="hidden sm:block text-white mt-2 text-xs sm:text-xs md:text-sm lg:text-xl font-light sm:w-2/3 md:w-1/2 mx-auto">
                            We understand how important it is for students to find comfortable and affordable housing,
                            so we have created a platform that helps you quickly and efficiently choose an apartment
                            that is right for you.
                        </p>
                    </h1>
                </div>
            </div>
            <div className="min-h-screen p-8 md:px-0 lg:px-18 xl:px-52 pt-28">
                <main>
                    <IconSwitch activeIndex={1} onClick={setGender} /> {/* Default to 'female' */}
                    <YearSwitch activeIndex={year === new Date().getFullYear() ? 0 : 1} onClick={setYear} />
                    <h2 className="lg:text-8xl md:text-7xl sm:text-6xl font-semibold text-black mb-20 mt-24 text-center">Spare rooms</h2>
                    <div className="grid grid-cols-1 justify-items-center desktop:grid-cols-2  medium-desktop:grid-cols-3">
                        {filteredRooms.map((room) => (
                            <RoomCard
                                key={room.id}
                                id={room.id}
                                name={room.name}
                                background={room.image}
                                address={room.address}
                                description={room.description}
                                gender={gender}
                                year={year}
                            />
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default MainPage;