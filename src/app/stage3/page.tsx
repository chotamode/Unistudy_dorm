"use client";

import React, { useState } from 'react';
import Layout from "@/app/components/Layout";

const FeedbackForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        phoneNumber: '',
        email: '',
        gender: '',
        dateOfBirth: '',
        consent: false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission
        console.log(formData);
    };

    return (
        <form onSubmit={handleSubmit}
              className="flex flex-col gap-4 w-1/2 bg-[#0F478D] rounded-2xl p-8 px-20 h-full mr-16 justify-evenly">
            <div className={"flex flex-row gap-4 w-full"}>
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
                    type="tel"
                    name="phoneNumber"
                    placeholder="Phone Number"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="p-2 border rounded-xl w-full h-14"
                    required
                />
            </div>
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
                <option value="other">Other</option>
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
            <div className={"flex flex-row justify-center items-center h-screen bg-blue-100 rounded-3xl mx-20 py-24"}>
                <div
                    className={"flex flex-col w-1/2 justify-center items-center text-white bg-bg-stage3 bg-[length:105%_100%] bg-no-repeat h-full bg-left"}>
                    <h1 className=" mb-4 text-5xl font-medium">Here you can leave your</h1>
                    <h1 className=" mb-4 text-5xl font-medium">details for feedback!</h1>
                </div>
                <FeedbackForm />
            </div>
        </Layout>
    );
}

export default Stage3Page;