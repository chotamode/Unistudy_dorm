import React from 'react';
import Button2 from "@/app/components/Button2";
import {white} from "next/dist/lib/picocolors";
import Link from 'next/link';
import Button from "@/app/components/Button";
import Image from "next/image";
import arrowButton from "../../assets/arrow_button.svg"
import classNames from 'classnames';

interface RoomCardProps {
    id?: number;
    name?: string;
    address?: string;
    sex?: string;
    description?: string;
    price_month?: number;
    background?: string;
    floor?: string;
    apart_name?: string;
}

const RoomCard: React.FC<RoomCardProps> = ({
                                               id = 1,
                                               name = "Default Room Name",            // Default value for name
                                               address = "Default Address",            // Default value for address
                                               description = "No description provided",
                                               sex = "Girls only",
                                               price_month = 0,
                                               apart_name = "Penthouse Apratment",
                                               background = "/images/rommbg.png",
                                               floor = "Fifth Floor",
                                           }) => {
    return (
        <div>
            <div
                className="hidden rounded-xxl md:flex flex-col justify-end overflow-hidden
                           bg-cover bg-center min-h-120 w-110 filter grayscale-[1%]
                           lg:w-110
                           "
                style={{backgroundImage: `url(${background})`}}
            >
                <div className="absolute inset-0 bg-black opacity-50 z-0"></div>
                <div className=" px-4 text-white mb-8 filter z-10 relative font-semibold">
                    <h2 className="text-xxl font-black mb-2">{name}</h2>

                    <div className="text-adxs my-4">
                        <p>{floor} | {apart_name}</p>
                        <p>{sex}</p>
                        <p className="py-2">
                            {description}
                        </p>
                        <p className="text-xl">
                            {price_month} $
                        </p>
                    </div>

                    <Link href={`../rooms/${id}`}>
                        <Button2 className="h-10 w-40 text-xs">learn more</Button2>
                    </Link>
                </div>

            </div>


            <div
                className="md:hidden  rounded-xxl flex flex-col justify-end items-center
                           bg-white overflow-hidden
                           h-mlg w-mlg"
            >
                <div className="flex bg-cover bg-no-repeat bg-center rounded-xl
                                my-2 bg-clip-content w-[22rem] h-[13.5rem]"
                     style={{backgroundImage: `url(${background})`}}
                >

                </div>


                <div className="flex flex-row justify-between items-end w-[368px] px-2 text-black   mb-2 filter font-semibold">

                    <div className="flex flex-col">
                        <h2 className="text-xxl font-black mb-2">{name}</h2>

                        <div className="text-xs my-4">
                            <p>{price_month} $</p>
                        </div>
                    </div>

                    <div className="flex flex-col ">
                        <Link href={`../rooms/${id}`}>
                                <Image src={arrowButton} alt={arrowButton}></Image>
                        </Link>
                    </div>



                </div>
            </div>
        </div>

    );
};

export default RoomCard;


