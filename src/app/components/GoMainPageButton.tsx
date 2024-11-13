"use client";

import Link from 'next/link';
import Image from 'next/image';
import arrowRight from '@/assets/arrow_right.svg';
import {useParams} from "next/navigation";

interface GoToMainPageButtonProps {
    text: string;
}

const GoToMainPageButton: React.FC<GoToMainPageButtonProps> = ({ text }) => {
    const { dorm } = useParams();
    return (
        <Link href={`/${dorm}`}>
            <div className={"w-70 laptop:w-80 h-14 laptop:h-16 flex flex-row cursor-pointer"}>
                <div className={"bg-[#0F478D] p-4 rounded-xl h-full w-full flex justify-center items-center"}>
                    <p className={"text-white font-medium"}>
                        {text}
                    </p>
                </div>
            </div>
        </Link>
    );
};

export default GoToMainPageButton;