import React from 'react';
import Button from "@/app/components/Button";
import {white} from "next/dist/lib/picocolors";
import Link from 'next/link';

interface RoomCardProps {
    name: string;
    address: string;
    description: string;
    price_month: number;
    image: string;
}

const RoomCard: React.FC<RoomCardProps> = ({name, address, description, price_month, image}) => {
    return (
        <div className="border rounded-lg overflow-hidden bg-[#0F478D]">
            <div className="p-4 text-white">
                <img src={image} alt={name} className="w-full h-48 object-cover mb-2"/>
                <h2 className="text-xl font-bold mb-2">{name}</h2>
                <p>Только для мальчиков</p>
                <Link href={"../rooms"}>
                    <Button backgroundColor={"bg-white"} textColor={"text-black"} textSize={"sm"}>Узнать подробнее</Button>
                </Link>
                {/*<p className="text-gray-700 mb-2">{address}</p>*/}
                {/*<p className="text-gray-700 mb-4">{description}</p>*/}
                {/*<p className="text-left text-lg font-semibold text-blue-600">${price_month}/month</p>*/}
            </div>
        </div>
    );
};

export default RoomCard;