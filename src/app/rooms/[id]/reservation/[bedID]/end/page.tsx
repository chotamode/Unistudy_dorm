"use client";

import React from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { useFormData } from "@/app/context/ReservationContext";
import GoToMainPageButton from "@/app/components/GoMainPageButton";
import Layout from "@/app/components/Layout";
import Image from 'next/image';
import geoIcon from '@/assets/geoIcon.svg';
import { useParams } from "next/navigation";

const Stage4Page = () => {
    const { bedID, id } = useParams();
    const { year, gender, name, surname, phoneNumber, email, dateOfBirth, reservationFrom, reservationTo } = useFormData();

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
            ["Reservation From", reservationFrom],
            ["Reservation To", reservationTo],
        ];

        doc.autoTable({
            startY: 30,
            head: [tableColumn],
            body: tableRows,
            theme: 'grid',
            styles: { fontSize: 12 },
            headStyles: { fillColor: false }, // Убираем заливку цвета
        });

        doc.save('reservation-details.pdf');
    };

    return (
        <Layout>
            <div className={"flex flex-col justify-center items-center h-[47rem] bg-blue-100 rounded-3xl mx-20"}>
                <div className={"flex flex-col justify-center items-center gap-2 mb-10"}>
                    <h1 className={"text-xl custom-tablet:text-3xl md:text-5xl desktop:text-7xl font-semibold"}>Now the manager will</h1>
                    <h1 className={"text-xl custom-tablet:text-3xl md:text-5xl desktop:text-7xl font-semibold"}>contact you</h1>
                </div>
                <div className={"flex items-center gap-2"}>
                    <div className="hidden md:flex">
                        <Image src={geoIcon} alt="Geo Icon"/>
                    </div>
                    <div className={"bg-[#0F478D] rounded-3xl py-4 px-12 mb-2"}>
                        <p className={"text-white"}>Kirovogradskaya street, 13A</p>
                    </div>
                </div>

                <button onClick={generatePDF} className="underline mb-5">Downloading documents</button>
                <div className="max-custom-tablet:w-">
                    <GoToMainPageButton text="Go back to the main page"/>
                </div>
            </div>
        </Layout>
    );
}

export default Stage4Page;