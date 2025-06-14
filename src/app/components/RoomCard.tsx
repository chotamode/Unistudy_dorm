import React, {useEffect, useState} from 'react';
import Button2 from "@/app/components/Button2";
import Link from 'next/link';
import Image from "next/image";
import arrowButton from "../../assets/arrow_button.svg";
import {getFirstRoomPhoto} from '@/app/api/rooms';
import {ReservationContextProvider} from "@/app/context/ReservationContext";

interface RoomCardProps {
    id?: number;
    dorm?: string;
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
                                               dorm = 'dorm',
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
                           bg-cover bg-center min-h-120 w-110 filter grayscale-[1%] h-[30rem]
                           desktop:min-h-[30rem] desktop:w-[26rem]
                           medium-desktop:min-h-120 medium-desktop:w-110
                           large-desktop:min-h-[37rem] large-desktop:w-[32rem]"
                style={{backgroundImage: `url(${firstPhoto})`}}
            >
                <Link className={"relative w-full h-full"}
                      href={`../${dorm}/rooms/${id}`}>
                    <div className="absolute inset-0 bg-black opacity-50 z-0"></div>
                    <div
                        className="px-4 text-white filter z-10 relative font-semibold w-full h-full flex flex-col justify-end pb-6">
                        <h2 className="text-xxl font-black mb-2">{name}</h2>
                        <div className="text-adxs my-4">
                            {/*<p>{floor} | {apart_name}</p>*/}
                            <p>
                            {/*    if dorm === "sokolovna" then dorm = "sokol" else dorm = dorm*/}
                                {dorm === "sokolovna" ? "Affordable private dorm in one of the safest parts of prague" : ""}
                                {dorm === "castle" ? "10 minutes from prague castle and schwarzenberg palace" : ""}
                                {dorm === "kamycka" ? "Sizes of apartments are from 18 to 56 square meters" : ""}
                            </p>
                            <p>{gender === 'both' ? 'For boys and girls' : `For ${gender === 'male' ? 'boys' : 'girls'} only`}</p>
                        </div>
                        <Button2 className="h-10 w-40 text-xs">Book now</Button2>
                    </div>
                </Link>
            </div>
            <div
                className="md:hidden rounded-xxl flex flex-col justify-end items-center
                           bg-white overflow-hidden h-mlg w-mlg"
            >
                <Link href={`../${dorm}/rooms/${id}`}>
                    <div className="flex bg-cover bg-no-repeat bg-center rounded-xl
            my-2 bg-clip-content w-[22rem] h-[13.5rem]"
                         style={{backgroundImage: `url(${firstPhoto})`}}
                    >
                    </div>
                    <div
                        className="flex flex-row justify-between items-end w-[368px] px-2 text-black mb-2 filter font-semibold">
                        <div className="flex flex-col">
                            <h2 className="text-xxl font-black mb-2">{name}</h2>
                        </div>
                        <div className="flex flex-col w-11 h-11 min-w-[44px] min-h-[44px]">
                            <Image src={arrowButton} width={44} height={44} alt="Arrow Button"
                                   className="object-contain"/>
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default RoomCard;