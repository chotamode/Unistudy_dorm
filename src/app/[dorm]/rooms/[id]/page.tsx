"use client";

import React, {useEffect, useState} from 'react';
import {useParams, useSearchParams} from 'next/navigation';
import {getRoomById, getBedsByRoomId, getRoomDetailsByRoomId, getRoomType, getRoomImages} from '../../../api/rooms';
import Image from 'next/image';
import Layout from "@/app/components/Layout";
import placeholderImage from '@/assets/placeholder_room.jpg';
import Button2 from "@/app/components/Button2";
import Link from "next/link";
import {Carousel} from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import '../../../carousel-custom.css';
import BedCard from '@/app/components/BedCard';
import {useFormData, ReservationContextProvider} from "@/app/context/ReservationContext";

interface Room {
    // area: number;
    id: number;
    name: string;
    address: string;
    description: string;
    price_month: number;
    image?: string;
    mini_description: string;
}

interface Bed {
    id: number;
    occupied: boolean;
    cost: number;
}

interface RoomDetail {
    id: number;
    detail: string;
}


const RoomDetails: React.FC = () => {
    const {id} = useParams();
    const {dorm} = useParams();
    const searchParams = useSearchParams();
    // const year = searchParams.get('year');
    // const gender = searchParams.get('gender');
    const [room, setRoom] = useState<Room | null>(null);
    const [beds, setBeds] = useState<Bed[]>([]);
    const [details, setDetails] = useState<RoomDetail[]>([]);
    const [roomType, setRoomType] = useState<string>('both');
    const [images, setImages] = useState<string[]>([]);
    const {year, gender} = useFormData();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);

    useEffect(() => {

        if (id) {
            const fetchRoom = async () => {
                const roomData = await getRoomById(Number(id));
                setRoom(roomData);
            };
            fetchRoom().then(r => r);

            const fetchBeds = async () => {
                const bedsData = await getBedsByRoomId(Number(id), year);
                setBeds(bedsData);
            };
            fetchBeds().then(r => r);

            const fetchDetails = async () => {
                const detailsData = await getRoomDetailsByRoomId(Number(id));
                setDetails(detailsData);
            };
            fetchDetails().then(r => r);

            const fetchRoomType = async () => {
                const type = await getRoomType(Number(id), year);
                setRoomType(type);
            };
            fetchRoomType().then(r => r);

            const fetchImages = async () => {
                const imageUrls = await getRoomImages(Number(id));
                setImages(imageUrls.length > 0 ? imageUrls : Array(5).fill(placeholderImage.src));
            };
            fetchImages().then(r => r);
        }
    }, [id, year]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (isModalOpen) {
                if (e.key === 'Escape') {
                    setIsModalOpen(false);
                } else if (e.key === 'ArrowRight') {
                    setSelectedImageIndex((prevIndex) => (prevIndex + 1) % images.length);
                } else if (e.key === 'ArrowLeft') {
                    setSelectedImageIndex((prevIndex) =>
                        (prevIndex - 1 + images.length) % images.length
                    );
                }
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isModalOpen, images.length]);

    if (!room) {
        return <div>Loading...</div>;
    }

    return (
        <Layout>
            <div
                className="px-0 desktopxl:px-24 medium-desktop:px-48 rounded-3xl gap-2 desktop:gap-10 flex flex-col items-center  mdsuperbook:flex-row mdsuperbook:flex-wrap justify-center">
                <div
                    className="flex flex-row rounded-xxl bg-cover bg-center w-[350px] h-[230px] tablet:min-h-[520px] tablet:w-[590px]">
                    <Carousel
                        renderArrowPrev={(onClickHandler, hasPrev) =>
                            hasPrev && (
                                <button
                                    type="button"
                                    onClick={onClickHandler}
                                    className="custom-arrow left-arrow"
                                >
                                    ‹
                                </button>
                            )
                        }
                        renderArrowNext={(onClickHandler, hasNext) =>
                            hasNext && (
                                <button
                                    type="button"
                                    onClick={onClickHandler}
                                    className="custom-arrow right-arrow"
                                >
                                    ›
                                </button>
                            )
                        }
                        showThumbs={false}
                        showStatus={false}
                    >
                        {images.map((url, index) => (
                            <div className=" cursor-pointer w-[350px] h-[230px] tablet:w-[590px] tablet:h-[520px]"
                                 key={index}
                                 onClick={() => {
                                     setSelectedImageIndex(index);
                                     setIsModalOpen(true);
                                 }}
                            >
                                <img src={url} alt={`Room image ${index + 1}`}/>
                            </div>
                        ))}
                    </Carousel>
                </div>

                <div
                    className=" w-[350px] tablet:w-[590px] mdsuperbook:mt-0 mt-5 h-full flex flex-col gap-3 justify-center mdsuperbook:gap-6">

                    <h1 className="text-3xl  px-[4px] font-bold">
                        {room.name}
                    </h1>
                    <ul className="list-disc text-adxs px-2 list-inside">
                        <h3 className="font-bold text-adxs">
                            {roomType === 'both' ? `For ${gender === 'male' ? 'boys' : 'girls'}` : `For ${roomType === 'male' ? 'boys' : 'girls'} only`}
                        </h3>
                        {details.map((detail) => (
                            <li key={detail.id}>{detail.detail}</li>
                        ))}
                    </ul>
                    <p className="bg-[#DBE9FB] text-adxs w-[350px] tablet:w-[570px] py-6 px-4 rounded-3xl">
                        {room.description}
                    </p>
                    {/*<p className={"border-b-2 border-[#0F478D] w-fit pr-12 font-medium"}>*/}
                    {/*    Area: {room.area} m²*/}
                    {/*</p>*/}
                    <h3 className={"font-bold"}>
                        Available places:
                    </h3>

                    <div className={"flex flex-row flex-wrap gap-4"}>
                        {beds.map(bed => (
                            <BedCard key={bed.id} bed={bed} year={Number(year)} roomId={Number(id)}/>
                        ))}

                    </div>
                    {/*<YearGenderProvider>*/}
                    <Link href={`../rooms/${id}/reservation`}>
                        <div className="flex mt-4 max-mdsuperbook:mt-4 w-full justify-center tablet:justify-start ">
                            <Button2 className={"w-96 tablet:w-52"}>
                                Book a bed
                            </Button2>
                        </div>
                    </Link>
                    {/*</YearGenderProvider>*/}
                </div>
            </div>
            {isModalOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center z-50"
                >
                    <div
                        className="relative max-w-full max-h-full flex flex-col items-center"
                    >
                        <button
                            className="absolute top-1 right-4 text-black text-5xl"
                            onClick={() => setIsModalOpen(false)}
                        >
                            &times;
                        </button>


                        <img
                            src={images[selectedImageIndex]}
                            alt={`Room image ${selectedImageIndex + 1}`}
                            className="w-full max-w-3xl max-h-screen h-auto object-contain"
                        />

                        <button
                            className="absolute top-1/2 left-4 transform -translate-y-1/2 text-black text-6xl p-2"
                            onClick={() =>
                                setSelectedImageIndex((prevIndex) =>
                                    (prevIndex - 1 + images.length) % images.length
                                )
                            }
                        >
                            ‹
                        </button>
                        <button
                            className="absolute top-1/2 right-4 transform -translate-y-1/2 text-black text-6xl p-2"
                            onClick={() =>
                                setSelectedImageIndex((prevIndex) => (prevIndex + 1) % images.length)
                            }
                        >
                            ›
                        </button>
                    </div>

                    <div className="flex overflow-x-auto mt-4">
                        {images.map((url, index) => (
                            <img
                                key={index}
                                src={url}
                                alt={`Thumbnail ${index + 1}`}
                                className={`w-20 h-20 object-cover mx-1 cursor-pointer ${
                                    index === selectedImageIndex ? 'border-2 border-blue-500' : ''
                                }`}
                                onClick={() => setSelectedImageIndex(index)}
                            />
                        ))}
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default RoomDetails;