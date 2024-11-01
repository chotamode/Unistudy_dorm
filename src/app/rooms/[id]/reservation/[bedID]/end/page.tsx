"use client";

import React from 'react';
import { jsPDF } from 'jspdf';
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
        doc.text(`Reservation Details`, 10, 10);
        doc.text(`Name: ${name}`, 10, 20);
        doc.text(`Surname: ${surname}`, 10, 30);
        doc.text(`Phone Number: ${phoneNumber}`, 10, 40);
        doc.text(`Email: ${email}`, 10, 50);
        doc.text(`Gender: ${gender}`, 10, 60);
        doc.text(`Date of Birth: ${dateOfBirth.toISOString().split('T')[0]}`, 10, 70);
        doc.text(`Reservation From: ${reservationFrom}`, 10, 80);
        doc.text(`Reservation To: ${reservationTo}`, 10, 90);
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
                <p className={"underline mb-5"}>Downloading documents</p>
                <button onClick={generatePDF} className="p-2 bg-blue-500 text-white rounded">Download PDF</button>
                <div className="max-custom-tablet:w-">
                    <GoToMainPageButton text="Go back to the main page"/>
                </div>
            </div>
        </Layout>
    );
}

export default Stage4Page;