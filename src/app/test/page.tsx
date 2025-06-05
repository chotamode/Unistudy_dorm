"use client";

import React, { useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const TestPage = () => {
    const [phone, setPhone] = useState('');
    const [submittedPhone, setSubmittedPhone] = useState('');

    const handlePhoneChange = (value: string, data: any, event: any, formattedValue: string) => {
        setPhone(formattedValue);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmittedPhone(phone);
        console.log('Phone number submitted:', phone);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-2xl font-bold mb-4">Phone Input Test</h1>
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
                        Phone Number
                    </label>
                    <PhoneInput
                        country={'us'}
                        value={phone}
                        onChange={handlePhoneChange}
                        inputProps={{
                            name: 'phone',
                            required: true,
                            autoFocus: true,
                        }}
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    Submit
                </button>
            </form>
            {submittedPhone && (
                <div className="mt-4">
                    <p className="text-lg">Submitted Phone Number: {submittedPhone}</p>
                </div>
            )}
        </div>
    );
};

export default TestPage;