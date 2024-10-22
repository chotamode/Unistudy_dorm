"use client";

import React, { useState } from 'react';
import Layout from "@/app/components/Layout";
import {useParams, useRouter} from "next/navigation";
import { createDefaultReservation } from '@/app/api/rooms';
import Link from "next/link";

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
              className="flex flex-col gap-4 w-full md:w-1/2 bg-[#0F478D] rounded-2xl p-4 md:p-8 py-7 md:py-0 px-10 h-full mr-4 md:mr-16 justify-evenly">
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
            <button type="submit" className="p-2 bg-blue-500 text-white rounded">Confirm</button>
        </form>
    );
};


const Stage3Page = () => {
    return (
        <Layout>
            <div className={"relative flex flex-col md:flex-row justify-center items-center h-screen bg-blue-100 rounded-3xl mx-10 md:mx-20 py-24"}>
                <div className={"bg-bg-stage3 bg-[length:105%_200%] bg-no-repeat h-full bg-left z-10 left-0 top-0 "}>
                    <div
                        className={"relative flex flex-col w-full md:w-1/2 justify-center items-center text-center text-white "}>
                        <h1 className="mb-4 text-2xl md:text-5xl font-medium">Here you can leave your</h1>
                        <h1 className="mb-4 text-2xl md:text-5xl font-medium">details for feedback!</h1>
                    </div>
                </div>

                <FeedbackForm/>
            </div>
        </Layout>
    );
}

export default Stage3Page;