"use client";

import React, { useEffect, useState } from 'react';
import RoomCard from './components/RoomCard';
import { getRooms, getRoomType, getRoomAvailability } from './api/rooms';
import Image from 'next/image';
import IconSwitch from '@/app/components/IconSwitch';
import YearSwitch from "@/app/components/YearSwitch";
import { useFormData } from '@/app/context/ReservationContext';
import {useParams, useSearchParams} from "next/navigation";

interface Room {
    id: number;
    dorm: string;
    name: string;
    address: string;
    price_month: number;
    image: string;
    roomType?: 'male' | 'female' | 'both';
}

const MainPage = () => {
    const dormParam = useParams().dorm;
    const dorm = Array.isArray(dormParam) ? dormParam[0] : dormParam;
    const [rooms, setRooms] = useState<Room[]>([]);
    const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
    const { year, gender, setYear, setGender } = useFormData();
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
        const fetchRooms = async () => {
            const roomsData = await getRooms();
            const roomsWithTypes = await Promise.all(
                roomsData.map(async (room) => {
                    const roomType = await getRoomType(room.id, year);
                    return { ...room, roomType };
                })
            );
            setRooms(roomsWithTypes);
        };
        fetchRooms();
    }, [year]);

    useEffect(() => {
        const filterRooms = async () => {
            const filtered = await Promise.all(
                rooms.map(async (room) => {
                    const isAvailable = await getRoomAvailability(room.id, year);
                    const matchesGender = room.roomType === gender || room.roomType === 'both';
                    const matchesDorm = dorm === "sokolovna" ? room.dorm === "sokol" : room.dorm === dorm;
                    return matchesGender && isAvailable && matchesDorm ? room : null;
                })
            );
            const sortedFilteredRooms = filtered
                .filter(room => room !== null)
                .sort((a, b) => a!.name.localeCompare(b!.name));
            setFilteredRooms(sortedFilteredRooms as Room[]);
        };
        filterRooms();
    }, [rooms, gender, year]);

    const handleShowMore = () => {
        setShowAll(!showAll);
    };

    const roomsToDisplay = showAll ? filteredRooms : filteredRooms.slice(0, 3);

    return (
        <div>
            {/*<h1>*/}
            {/*    ${dorm}*/}
            {/*</h1>*/}
            <div className="relative mt-10 tablet:mt-0">
                <Image
                    src="/images/mpage_hero.svg"
                    alt="Background"
                    objectFit="cover"
                    width={3840}
                    height={2160}
                />
                <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
                    <h1 className="text-1xl phonexs:text-xl phone:text-2xl md:text-5xl lg:text-[4.2rem] xl:text-[5rem] font-bold text-black p-4 sm:p-12 md:p-16 rounded-xl text-center">
                        <div className="text-white">Student housing in Prague</div>
                        <div className="text-[#A6D0FF]"> — easy and convenient!</div>
                        <p className="hidden sm:block text-white mt-2 text-xs sm:text-xs md:text-sm lg:text-xl font-light sm:w-2/3 md:w-1/2 mx-auto">
                            Three building reconstructed based on student&apos;s needs. Dormitory style accommodatoin, residences and apartments. Single, double, triple options and more!
                        </p>
                    </h1>
                </div>
            </div>
            <div className="min-h-screen p-8 md:px-0 lg:px-18 xl:px-52 pt-28">
                <main>
                    <IconSwitch activeIndex={gender === 'male' ? 0 : 1} onClick={setGender} />
                    <YearSwitch activeIndex={year === new Date().getFullYear() ? 0 : 1} onClick={setYear} />
                    <h2 className="lg:text-8xl md:text-7xl sm:text-6xl font-semibold text-black mb-20 mt-24 text-center">What&apos;s available</h2>
                    <div className="grid grid-cols-1 justify-items-center desktop:grid-cols-2 medium-desktop:grid-cols-3">
                        {roomsToDisplay.map((room) => (
                            <RoomCard
                                key={room.id}
                                id={room.id}
                                dorm={dorm}
                                name={room.name}
                                background={room.image}
                                address={room.address}
                                gender={room.roomType}
                            />
                        ))}
                    </div>
                    <div className="flex flex-row justify-center items-center">
                        {filteredRooms.length > 3 && (
                            <button onClick={handleShowMore} className="mt-8 py-4 px-16 md:px-24 font-medium text-xl iphonexs:text-2xl laptop:text-3xl bg-[#0F478D] text-white rounded-xl">
                                {showAll ? 'Show less' : 'More'}
                            </button>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default MainPage;