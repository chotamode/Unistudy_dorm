"use client";

import React, { useState, useEffect } from 'react';
import Layout from '@/app/components/Layout';
import { getReservations, updateReservationStatus } from '@/app/api/rooms';

const AdminPage = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [reservations, setReservations] = useState([]);

    useEffect(() => {
        const fetchReservations = async () => {
            const data = await getReservations();
            setReservations(data);
        };

        if (isLoggedIn) {
            fetchReservations();
        }
    }, [isLoggedIn]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (username === 'admin' && password === 'password') {
            setIsLoggedIn(true);
        } else {
            alert('Invalid credentials');
        }
    };

    const handleUpdateReservation = async (reservationId: number, confirmed: boolean) => {
        await updateReservationStatus(reservationId, confirmed);
        setReservations(reservations.map(reservation =>
            reservation.id === reservationId ? { ...reservation, confirmed } : reservation
        ));
    };

    return (
        <Layout>
            <div className="px-16 py-8">
                {isLoggedIn ? (
                    <>
                        <h1 className="text-4xl font-bold mb-4">Admin Dashboard</h1>
                        <p>Welcome to the admin dashboard. Here you can manage rooms, beds, and reservations.</p>
                        <h2 className="text-2xl font-bold mt-8">Reservations</h2>
                        <ul>
                            {reservations.map(reservation => (
                                <li key={reservation.id} className="mb-4 p-4 border rounded">
                                    <p><strong>Tenant:</strong> {reservation.tenant.name} {reservation.surname}</p>
                                    <p><strong>Email:</strong> {reservation.email}</p>
                                    <p><strong>Room ID:</strong> {reservation.roomId}</p>
                                    <p><strong>Bed ID:</strong> {reservation.bedId}</p>
                                    <p><strong>From:</strong> {reservation.from}</p>
                                    <p><strong>To:</strong> {reservation.to}</p>
                                    <p><strong>Status:</strong> {reservation.confirmed ? 'Confirmed' : 'Pending'}</p>
                                    <button
                                        onClick={() => handleUpdateReservation(reservation.id, true)}
                                        className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                                    >
                                        Confirm
                                    </button>
                                    <button
                                        onClick={() => handleUpdateReservation(reservation.id, false)}
                                        className="bg-red-500 text-white px-4 py-2 rounded"
                                    >
                                        Decline
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </>
                ) : (
                    <form onSubmit={handleLogin} className="max-w-sm mx-auto">
                        <h1 className="text-4xl font-bold mb-4">Admin Login</h1>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                                Username
                            </label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Login
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </Layout>
    );
};

export default AdminPage;