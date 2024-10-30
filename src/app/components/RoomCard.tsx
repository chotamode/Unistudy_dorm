import React, { useEffect, useState } from 'react';
import Button2 from "@/app/components/Button2";
import Link from 'next/link';
import Image from "next/image";
import arrowButton from "../../assets/arrow_button.svg";
import { getFirstRoomPhoto } from '@/app/api/rooms';

interface RoomCardProps {
    id?: number;
    name?: string;
    address?: string;
    sex?: string;
    background?: string;
    floor?: string;
    apart_name?: string;
    gender?: 'male' | 'female' | 'both';
    year?: number;
}

const RoomCard: React.FC<RoomCardProps> = ({
    id = 1,
    name = "Default Room Name",
    address = "Default Address",
    sex = "Girls only",
    apart_name = "Penthouse Apartment",
    background = "/images/rommbg.png",
    floor = "Fifth Floor",
    gender = 'both',
    year = new Date().getFullYear(),
}) => {
    const [firstPhoto, setFirstPhoto] = useState<string>(background);

    useEffect(() => {
        const fetchFirstPhoto = async () => {
            if (id) {
                const photoUrl = await getFirstRoomPhoto(id);
                if (photoUrl) {
                    setFirstPhoto(photoUrl);
                }
            }
        };

        fetchFirstPhoto();
    }, [id]);

    return (
        <div className="mb-10">
            <div
                className="hidden rounded-xxl md:flex flex-col justify-end overflow-hidden
                           bg-cover bg-center min-h-120 w-110 filter grayscale-[1%]
                           desktop:min-h-[30rem] desktop:w-[26rem]
                           medium-desktop:min-h-120 medium-desktop:w-110
                           large-desktop:min-h-[37rem] large-desktop:w-[32rem]"
                style={{ backgroundImage: `url(${firstPhoto})` }}
            >
                <Link href={`../rooms/${id}?year=${year}&gender=${gender}`}>
                    <div className="absolute inset-0 bg-black opacity-50 z-0"></div>
                    <div className="px-4 text-white mb-8 filter z-10 relative font-semibold">
                        <h2 className="text-xxl font-black mb-2">{name}</h2>
                        <div className="text-adxs my-4">
                            <p>{floor} | {apart_name}</p>
                            <p>{sex}</p>
                        </div>
                        <Button2 className="h-10 w-40 text-xs">Book now</Button2>
                    </div>
                </Link>
            </div>
            <div
                className="md:hidden rounded-xxl flex flex-col justify-end items-center
                           bg-white overflow-hidden h-mlg w-mlg"
            >
                <Link href={`../rooms/${id}?year=${year}&gender=${gender}`}>
                    <div className="flex bg-cover bg-no-repeat bg-center rounded-xl
                                    my-2 bg-clip-content w-[22rem] h-[13.5rem]"
                         style={{ backgroundImage: `url(${firstPhoto})` }}
                    ></div>
                    <div className="flex flex-row justify-between items-end w-[368px] px-2 text-black mb-2 filter font-semibold">
                        <div className="flex flex-col">
                            <h2 className="text-xxl font-black mb-2">{name}</h2>
                        </div>
                        <div className="flex flex-col">
                            <Image src={arrowButton} width={40} height={40} alt={arrowButton}></Image>
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default RoomCard;