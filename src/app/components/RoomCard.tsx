import React from 'react';
import Button2 from "@/app/components/Button2";
import {white} from "next/dist/lib/picocolors";
import Link from 'next/link';
import Button from "@/app/components/Button";
import Image from "next/image";

interface RoomCardProps {
    name?: string;
    address?: string;
    description?: string;
    price_month?: number;
    background?: string;
}

const RoomCard: React.FC<RoomCardProps> = ({
                                               name = "Default Room Name",            // Default value for name
                                               address = "Default Address",            // Default value for address
                                               description = "No description provided", // Default value for description
                                               price_month = 0,                        // Default value for price
                                               background = "/images/rommbg.png"           // Default value for background
                                           }) => {
    return (
        <div
            className="rounded-xxl overflow-hidden bg-cover bg-center min-h-120 w-full"
            style={{ backgroundImage: `url(${background})` }}  // Dynamic or default background
        >
            <div className="p-4 text-white">
                <h2 className="text-xl font-bold mb-2">{name}</h2>
                <p>Только для мальчиков</p>
                <Link href="../rooms">
                    <Button2>Узнать подробнее</Button2>
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


