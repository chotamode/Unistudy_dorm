"use client";

import React, { useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { useFormData } from "@/app/context/ReservationContext";
import GoToMainPageButton from "@/app/components/GoMainPageButton";
import Layout from "@/app/components/Layout";
import Image from 'next/image';
import geoIcon from '@/assets/geoIcon.svg';
import { useParams } from "next/navigation";
import { getRoomById } from "@/app/api/rooms";

const Stage4Page = () => {
    const { bedID, id } = useParams();
    const { year, gender, name, surname, phoneNumber, email, dateOfBirth, reservationFrom, reservationTo } = useFormData();
    const [room, setRoom] = useState<any>(null);

    useEffect(() => {
        const fetchRoom = async () => {
            const roomData = await getRoomById(Number(id));
            setRoom(roomData);
        };
        fetchRoom();
    }, [id]);

    const generatePDF = () => {
        const doc = new jsPDF();

        doc.setFontSize(16);
        doc.text("Reservation Details", 14, 20);

        const tableColumn = ["", ""];
        const tableRows = [
            ["Name", name],
            ["Surname", surname],
            ["Phone Number", phoneNumber],
            ["Email", email],
            ["Gender", gender],
            ["Date of Birth", dateOfBirth.toISOString().split('T')[0]],
            ["Year", year],
            ["Room address", room?.address],
            ["Room name", room?.name],
            // ["Room price", room?.price_month],
            ["Reservation From", reservationFrom.toISOString().split('T')[0]],
            ["Reservation To", reservationTo.toISOString().split('T')[0]],
        ];

        doc.autoTable({
            startY: 30,
            head: [tableColumn],
            body: tableRows,
            theme: 'grid',
            styles: { fontSize: 12 },
            headStyles: { fillColor: false },
        });

        doc.save('reservation-details.pdf');
    };

    if (!room) {
        return <div>Loading...</div>;
    }

    return (
        <Layout>
            <div className={"flex flex-col justify-center items-center h-[47rem] bg-blue-100 rounded-0 tablet:rounded-3xl mx-0 sm:mx-10 md:mx-20 "}>

                {/*контейнер с надписью */}
                <div className={"flex flex-col justify-center items-center gap-2 mb-6 md:mb-10"}>
                    <p className={"zfold:text-3xl phone:text-4xl md:text-5xl laptop:text-6xl font-semibold text-center"}>Thank you! Our manager </p>
                    <p className={"zfold:text-3xl phone:text-4xl md:text-5xl laptop:text-6xl font-semibold text-center"}>will contact you shortly.</p>
                </div>

                    {/*контейнер с иконкой и адресом */}
                <div className={"flex flex-row items-center pr-8 laptop:pr-16 laptop:mr-1 gap- laptop:gap-2"}>
                    <Image src={geoIcon} alt="Geo Icon" className="w-10 h-10 laptop:w-16 laptop:h-16"/>
                    <div className={"bg-[#0F478D] rounded-3xl  py-4 px-8 md:px-12 mb-0 md:mb-0"}>
                        <p className={"text-white phonese:text-sm zfold:text-xs laptop:text-base"}>{room.address}</p>
                    </div>
                </div>

                {/*кнопка скачать документы*/}
                <p className={"underline mb-5 zfold:text-sm"} onClick={generatePDF}>Downloading documents</p>

                {/*кнопка назад*/}
                <div className={"pr-0 laptop:pr-0 zfold:text-xs phonese:text-base"}>
                    <GoToMainPageButton text="Go back to the main page"/>
                </div>
            </div>
        </Layout>
    );
}

export default Stage4Page;