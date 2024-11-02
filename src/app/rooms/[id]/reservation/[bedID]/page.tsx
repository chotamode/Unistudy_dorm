"use client";

import React, { useState } from 'react';
import Layout from "@/app/components/Layout";
import {useParams, useRouter} from "next/navigation";
import {createReservation} from '@/app/api/rooms';
import Link from "next/link";
import {useFormData} from "@/app/context/ReservationContext";
// import BlueBackground  from "@/app/components/BlueBackground";
import ReservationBackground from "@/app/components/ReservationBackground";

const FeedbackForm = () => {
    const { bedID, id } = useParams();
    const router = useRouter();
    const today = new Date().toISOString().split('T')[0];
    const consent = true;

    const {
        name, surname, phoneNumber, email, gender, dateOfBirth,
        setName, setSurname, setPhoneNumber, setEmail, setGender, setDateOfBirth, setConsent,
        reservationFrom, reservationTo
    } = useFormData();

    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
            setConsent(e.target.checked);
        } else if (type === 'date') {
            if (value <= today) {
                setDateOfBirth(new Date(value));
            } else {
                console.warn('Date cannot be in the future');
            }
        } else {
            switch (name) {
                case 'name':
                    setName(value);
                    break;
                case 'surname':
                    setSurname(value);
                    break;
                case 'phoneNumber':
                    setPhoneNumber(value);
                    break;
                case 'email':
                    setEmail(value);
                    break;
                case 'gender':
                    setGender(value as 'male' | 'female');
                    break;
                default:
                    break;
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Submitting form with data:", { name, surname, phoneNumber, email, gender, dateOfBirth });

        try {
            const result = await createReservation(
                name,
                surname,
                phoneNumber,
                gender,
                email,
                dateOfBirth.toISOString(),
                Number(id), // roomId
                Number(bedID), // bedId
                reservationFrom,
                reservationTo
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
              className="flex flex-col gap-4 laptop:gap-6 w-full laptop:w-[528px] bg-[#0F478D] rounded-2xl p-6 laptop:p-8 px-5 laptop:px-12 py-14 laptop:py-10 mt-20 ipadmini:mt-10 laptop:mt-0  mr-4 laptop:mr-16 mx-0 laptop:mx-auto justify-center laptop:justify-evenly">
            <div className={"flex flex-col desktop:flex-row gap-4 w-full z-20"}>
                <label className="block text-sm font-medium -mb-2 text-white" htmlFor="name">
                    First Name<span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={name}
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
                    value={surname}
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
                value={phoneNumber}
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
                value={email}
                onChange={handleChange}
                className="p-2 border rounded-xl w-full h-12"
                required
            />
            <label className="block text-sm font-medium -mb-2 text-white" htmlFor="name">
                What is your gender?<span className="text-red-500">*</span>
            </label>
            <select
                name="gender"
                value={gender}
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
                value={dateOfBirth.toISOString().split('T')[0]}
                onChange={handleChange}
                className="p-2 border rounded-xl w-full h-12"
                max={today}
                required
            />
            <label className="flex items-center text-white">
                <input
                    type="checkbox"
                    name="consent"
                    checked={consent}
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
                {/*<BlueBackground/>*/}
                <ReservationBackground/>
                <div className={"flex flex-col laptop:flex-row justify-center items-center h-full laptop:h-screen bg-blue-100 rounded-3xl mx-0 laptop:mx-20 py-16 laptop:py-24 px-7 laptop:px-0 gap-1 laptop:gap-0 pt-6 laptop:pt-0"}>

                {/* Контейнер с текстом, поверх фона */}
                    <div
                    className={"relative  flex flex-col w-full md:w-full justify-center pb-10 laptop:pb-0 items-center text-white h-full md:bg-transparent "}>
                    {/*Синий фон для десктопов*/}
                        <div
                            className="hidden md:flex flex-col w-full justify-center items-center text-white bg-bg-stage3 bg-[length:115%_120%] bg-no-repeat h-full bg-left mx-auto">
                        </div>
                        <h1 className="static laptop:absolute laptop:pb-20 laptop:mb-4 mt-10 text-2xl zfold:text-xl phone14:text-3xl minibook:text-3xl desktop2:text-5xl font-medium z-10">
                        Here you can leave your
                        </h1>
                        <h1 className="static laptop:absolute laptop:pt-20 laptop:mb-4 text-2xl zfold:text-xl phone14:text-3xl minibook:text-3xl desktop2:text-5xl font-medium z-10">
                            details for feedback!
                        </h1>
                    </div>
                    {/* Поля формы для обратной связи */}
                    <div className={"w-full ml-3 laptop:ml-0 ipadmini:w-[80vw] laptop:w-1/2 flex justify-center items-center laptop:items-start z-30"}>
                        <FeedbackForm/>
                    </div>
                </div>
            </Layout>
        </div>
);
}

export default Stage3Page;