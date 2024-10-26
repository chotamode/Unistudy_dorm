"use client";

import React, { useState } from 'react';
import Layout from "@/app/components/Layout";
import {useParams, useRouter} from "next/navigation";
import { createDefaultReservation } from '@/app/api/rooms';
import Link from "next/link";
import BlueBackground  from "@/app/contacts/BlueBackground";

const FeedbackForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        phoneNumber: '',
        email: '',
        gender: '',
        dateOfBirth: '',
        consent: false,
    });

    const { bedID, id } = useParams();
    const [isSubmitted, setIsSubmitted] = useState(false);
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
            setFormData({
                ...formData,
                [name]: e.target.checked,
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Submitting form with data:", formData);

        try {
            const result = await createDefaultReservation(
                formData.name,
                formData.surname,
                formData.gender,
                formData.email,
                formData.dateOfBirth,
                Number(id), // roomId
                Number(bedID), // bedId
            );
            router.push(`/rooms/${id}/reservation/${bedID}/end`);

            console.log("Reservation result:", result);

            if (result) {
                setIsSubmitted(true);
                console.log("Redirecting to:", `/rooms/${id}/reservation/${bedID}/end`);
                router.push(`/rooms/${id}/reservation/${bedID}/end`);
            } else {
                console.error("Reservation failed");
            }
        } catch (error) {
            console.error("Error during reservation:", error);
        }
    };

    if (isSubmitted) {
        return <p>Thank you for your reservation!</p>;
    }

    return (
        <form onSubmit={handleSubmit}
              className="flex flex-col gap-4 w-full md:w-1/2 bg-[#0F478D] rounded-2xl p-6 md:p-8 md:px-20 py-7 md:py-0 px-7 h-full mr-4 md:mr-16 mx-auto justify-center md:justify-evenly shadow-lg ">

            <div className={"flex flex-col md:flex-row gap-4 w-full"}>
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="p-2 border rounded-xl w-full h-14"
                    required
                />
                <input
                    type="text"
                    name="surname"
                    placeholder="Surname"
                    value={formData.surname}
                    onChange={handleChange}
                    className="p-2 border rounded-xl w-full h-14"
                    required
                />
            </div>
            <input
                type="tel"
                name="phoneNumber"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="p-2 border rounded-xl w-full h-14"
                required
            />
            <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="p-2 border rounded-xl w-full h-14"
                required
            />
            <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="p-2 border rounded-xl w-full h-14"
                required
            >
                <option value="" disabled>Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
            </select>
            <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="p-2 border rounded-xl w-full h-14"
                required
            />
            <label className="flex items-center">
                <input
                    type="checkbox"
                    name="consent"
                    checked={formData.consent}
                    onChange={handleChange}
                    className="mr-2"
                    required
                />
                I consent to data processing
            </label>
            <button type="submit" className="hidden md:block p-2 bg-blue-500 text-white rounded">Confirm</button>
            <button type="submit" className="md:hidden p-2 w-1/2 bg-white text-black font-bold rounded-3xl">Confirm
            </button>
        </form>
    );
};


const Stage3Page = () => {
    return (
        <div>
            <div
                className="absolute top-0 left-0 w-full h-screen bg-bg-stage3 bg-[length:115%_110%] bg-no-repeat bg-left z-10 md:hidden"/>
            <Layout>
                {/* Ебучий синий фон на мобилках */}

                <div
                    className="relative flex flex-col md:flex-row justify-center items-center h-screen bg-blue-100 rounded-3xl px-10 md:px-5 md:mx-10 py-16">



                {/* Контейнер с текстом, поверх фона */}
                <div className="relative z-10 flex flex-col w-1/2 justify-center items-center text-white h-full ">
                    {/*Синий фон для десктопов*/}
                    <div
                        className={"hidden md:block top-0  absolute w-full h-full justify-center items-center text-white bg-bg-stage3 bg-[length:115%_110%] bg-no-repeat bg-bottom left-0 z-0"}></div>
                    <h1 className="mb-4 text-3xl md:text-5xl font-medium z-10">Here you can leave your</h1>
                    <h1 className="mb-4 text-3xl md:text-5xl font-medium z-10">details for feedback!</h1>
                </div>

                {/* Форма обратной связи */}
                <FeedbackForm/>

            </div>
        </Layout>
        </div>
    );
};


export default Stage3Page;