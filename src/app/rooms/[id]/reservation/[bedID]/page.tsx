"use client";

import React, { useState } from 'react';
import Layout from "@/app/components/Layout";
import {useParams, useRouter} from "next/navigation";
import { createDefaultReservation } from '@/app/api/rooms';
import Link from "next/link";
import BlueBackground  from "@/app/components/BlueBackground";

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
                formData.phoneNumber,
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
              className="flex flex-col gap-4 md:gap-6 w-full md:w-[528px] bg-[#0F478D] rounded-2xl p-6 md:p-8 px-5 md:px-12 py-14 md:py-10 mt-20 md:mt-0  mr-4 md:mr-16 mx-auto md:mx-auto justify-center md:justify-evenly h-4/6">
            <div className={"flex flex-col md:flex-row gap-4 w-full z-20"}>
                <label className="block text-sm font-medium -mb-2 text-white" htmlFor="name">
                    First Name<span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="p-2 border rounded-xl w-full h-12"
                    required
                />
                <label className="block text-sm font-medium -mb-2 text-white" htmlFor="name">
                    Surname<span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    name="surname"
                    placeholder="Surname"
                    value={formData.surname}
                    onChange={handleChange}
                    className="p-2 border rounded-xl w-full h-12"
                    required
                />
            </div>
            <label className="block text-sm font-medium -mb-2 text-white" htmlFor="name">
                Phone Number<span className="text-red-500">*</span>
            </label>
            <input
                type="tel"
                name="phoneNumber"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="p-2 border rounded-xl w-full h-12"
                required
            />
            <label className="block text-sm font-medium -mb-2 text-white" htmlFor="name">
                Email<span className="text-red-500">*</span>
            </label>
            <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="p-2 border rounded-xl w-full h-12"
                required
            />
            <label className="block text-sm font-medium -mb-2 text-white" htmlFor="name">
                What is your gender?<span className="text-red-500">*</span>
            </label>
            <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="p-2 border rounded-xl w-full h-12"
                required
            >
                <option value="" disabled>Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
            </select>
            <label className="block text-sm font-medium -mb-2 text-white" htmlFor="name">
                Your date of birth<span className="text-red-500">*</span>
            </label>
            <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="p-2 border rounded-xl w-full h-12"
                required
            />
            <label className="flex items-center text-white">
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
        <div className={"relative"}>
            <Layout>
                <BlueBackground/>
                <div className={"flex flex-col md:flex-row justify-center items-center h-full md:h-screen bg-blue-100 rounded-3xl mx-0 md:mx-20 py-16 md:py-24 px-7 md:px-0 gap-1 md:gap-0 pt-6 md:pt-0"}>

                {/* Контейнер с текстом, поверх фона */}
                    <div
                    className={"relative  flex flex-col w-full md:w-full justify-center pb-10 md:pb-0 items-center text-white h-full md:bg-transparent "}>
                    {/*Синий фон для десктопов*/}
                        <div className={" hidden md:flex flex-col w-full justify-center items-center text-white bg-bg-stage3 bg-[length:115%_120%] bg-no-repeat h-full bg-left"}></div>
                        <h1 className="static md:absolute md:pb-20 md:mb-4 mt-10 text-2xl md:text-5xl font-medium z-10">
                            Here you can leave your
                        </h1>
                        <h1 className="static md:absolute md:pt-20 md:mb-4 text-2xl md:text-5xl font-medium z-10">
                            details for feedback!
                        </h1>
                    </div>
                    {/* Поля формы для обратной связи */}
                    <div className={"w-full ml-3 md:ml-0 md:w-1/2 flex justify-center items-center md:items-start"}>
                        <FeedbackForm/>
                    </div>
                </div>
            </Layout>
        </div>
);
}

export default Stage3Page;