import React from 'react';
import Button2 from "@/app/components/Button2";
import {white} from "next/dist/lib/picocolors";
import Link from 'next/link';
import Button from "@/app/components/Button";
import Image from "next/image";

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
        <div
            className="rounded-xxl flex flex-col justify-end overflow-hidden bg-cover bg-center min-h-120 max-w-110 filter grayscale-[28%]"
            style={{ backgroundImage: `url(${background})` }}  // Dynamic or default background
        >
            <div className="p-4 text-white mb-12 filter font-semibold">
                <h2 className="text-xxl font-black mb-2">{name}</h2>

                <div className="text-xs my-4">
                    <p>{floor} | {apart_name}</p>
                    <p>{sex}</p>
                    <p>
                        -Two–storey apartment accommodates 6 people <br/>
                        - Private bathroom for 6 residents <br/>
                        - Access to a private balcony with a beautiful view
                    </p>
                </div>

                <Link href={`../rooms/${id}`}>
                    <Button2 className="h-10 w-40 text-xs">learn more</Button2>
                </Link>
                {/* You can uncomment these lines if you want to display other props */}
                {/* <p className="text-gray-700 mb-2">{address}</p> */}
                {/* <p className="text-gray-700 mb-4">{description}</p> */}
                {/* <p className="text-left text-lg font-semibold text-blue-600">${price_month}/month</p> */}
            </div>
        </div>
    );
};

export default RoomCard;


