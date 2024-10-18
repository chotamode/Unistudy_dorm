"use client";

import React, { useState, useEffect } from 'react';
import Layout from '@/app/components/Layout';
import { getReservations, updateReservationStatus, updateReservationDates, getRooms, updateRoomDetails, getBedsByRoomId, updateBedCost } from '@/app/api/rooms';
import { Reservation, Room, Bed } from '@/app/types';

const AdminPage = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [activeTab, setActiveTab] = useState<'reservations' | 'rooms'>('reservations');
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [beds, setBeds] = useState<Bed[]>([]);
    const [editReservationId, setEditReservationId] = useState<number | null>(null);
    const [newFromDate, setNewFromDate] = useState<string>('');
    const [newToDate, setNewToDate] = useState<string>('');
    const [editRoomId, setEditRoomId] = useState<number | null>(null);
    const [newRoomDetails, setNewRoomDetails] = useState<Partial<Room>>({});
    const [editBedId, setEditBedId] = useState<number | null>(null);
    const [newBedCost, setNewBedCost] = useState<number | null>(null);

    useEffect(() => {
        const fetchReservations = async () => {
            const data = await getReservations();
            setReservations(data);
        };

        const fetchRooms = async () => {
            const data = await getRooms();
            setRooms(data);
        };

        if (isLoggedIn) {
            fetchReservations();
            fetchRooms();
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

    const handleEditDates = (reservation: Reservation) => {
        setEditReservationId(reservation.id);
        setNewFromDate(reservation.from);
        setNewToDate(reservation.to);
    };

    const handleSaveDates = async () => {
        if (editReservationId !== null) {
            await updateReservationDates(editReservationId, newFromDate, newToDate);
            setReservations(reservations.map(reservation =>
                reservation.id === editReservationId ? { ...reservation, from: newFromDate, to: newToDate } : reservation
            ));
            setEditReservationId(null);
        }
    };

    const handleEditRoom = async (room: Room) => {
        setEditRoomId(room.id);
        setNewRoomDetails(room);
        const bedsData = await getBedsByRoomId(room.id);
        setBeds(bedsData);
    };

    const handleSaveRoomDetails = async () => {
        if (editRoomId !== null) {
            await updateRoomDetails(editRoomId, newRoomDetails);
            setRooms(rooms.map(room =>
                room.id === editRoomId ? { ...room, ...newRoomDetails } : room
            ));
            setEditRoomId(null);
        }
    };

    const handleEditBed = (bed: Bed) => {
        setEditBedId(bed.id);
        setNewBedCost(bed.cost);
    };

    const handleSaveBedDetails = async () => {
        if (editBedId !== null && newBedCost !== null) {
            await updateBedCost(editBedId, newBedCost);
            setBeds(beds.map(bed =>
                bed.id === editBedId ? { ...bed, cost: newBedCost } : bed
            ));
            setEditBedId(null);
        }
    };

    return (
        <Layout>
            <div className="px-16 py-8">
                {isLoggedIn ? (
                    <>
                        <h1 className="text-4xl font-bold mb-4">Admin Dashboard</h1>
                        <p>Welcome to the admin dashboard. Here you can manage rooms, beds, and reservations.</p>
                        <div className="flex space-x-4 mt-8">
                            <button
                                onClick={() => setActiveTab('reservations')}
                                className={`px-4 py-2 rounded ${activeTab === 'reservations' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                            >
                                Reservations
                            </button>
                            <button
                                onClick={() => setActiveTab('rooms')}
                                className={`px-4 py-2 rounded ${activeTab === 'rooms' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                            >
                                Rooms
                            </button>
                        </div>
                        {activeTab === 'reservations' && (
                            <div>
                                <h2 className="text-2xl font-bold mt-8">Reservations</h2>
                                <ul>
                                    {reservations.map(reservation => (
                                        <li key={reservation.id} className="mb-4 p-4 border rounded">
                                            <p><strong>Tenant:</strong> {reservation.tenant.name} {reservation.tenant.surname}</p>
                                            <p><strong>Email:</strong> {reservation.tenant.email}</p>
                                            <p><strong>Room ID:</strong> {reservation.bed ? reservation.bed.room : 'N/A'}</p>
                                            <p><strong>Bed ID:</strong> {reservation.bed ? reservation.bed.id : 'N/A'}</p>
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
                                            <button
                                                onClick={() => handleEditDates(reservation)}
                                                className="bg-blue-500 text-white px-4 py-2 rounded ml-2"
                                            >
                                                Edit Dates
                                            </button>
                                            {editReservationId === reservation.id && (
                                                <div className="mt-4">
                                                    <label>
                                                        From:
                                                        <input
                                                            type="date"
                                                            value={newFromDate}
                                                            onChange={(e) => setNewFromDate(e.target.value)}
                                                            className="ml-2 p-2 border rounded"
                                                        />
                                                    </label>
                                                    <label className="ml-4">
                                                        To:
                                                        <input
                                                            type="date"
                                                            value={newToDate}
                                                            onChange={(e) => setNewToDate(e.target.value)}
                                                            className="ml-2 p-2 border rounded"
                                                        />
                                                    </label>
                                                    <button
                                                        onClick={handleSaveDates}
                                                        className="bg-green-500 text-white px-4 py-2 rounded ml-4"
                                                    >
                                                        Save
                                                    </button>
                                                </div>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {activeTab === 'rooms' && (
                            <div>
                                <h2 className="text-2xl font-bold mt-8">Rooms</h2>
                                <ul>
                                    {rooms.map(room => (
                                        <li key={room.id} className="mb-4 p-4 border rounded">
                                            <p><strong>Room ID:</strong> {room.id}</p>
                                            <p><strong>Name:</strong> {room.name}</p>
                                            <p><strong>Address:</strong> {room.address}</p>
                                            <p><strong>Mini Description:</strong> {room.mini_description}</p>
                                            <p><strong>Floor:</strong> {room.floor}</p>
                                            <p><strong>Area:</strong> {room.area}</p>
                                            <p><strong>Description:</strong> {room.description}</p>
                                            <button
                                                onClick={() => handleEditRoom(room)}
                                                className="bg-blue-500 text-white px-4 py-2 rounded ml-2"
                                            >
                                                Edit Room
                                            </button>
                                            {editRoomId === room.id && (
                                                <div className="mt-4">
                                                    <label>
                                                        Name:
                                                        <input
                                                            type="text"
                                                            value={newRoomDetails.name ?? ''}
                                                            onChange={(e) => setNewRoomDetails({ ...newRoomDetails, name: e.target.value })}
                                                            className="ml-2 p-2 border rounded"
                                                        />
                                                    </label>
                                                    <label className="ml-4">
                                                        Address:
                                                        <input
                                                            type="text"
                                                            value={newRoomDetails.address ?? ''}
                                                            onChange={(e) => setNewRoomDetails({ ...newRoomDetails, address: e.target.value })}
                                                            className="ml-2 p-2 border rounded"
                                                        />
                                                    </label>
                                                    <label className="ml-4">
                                                        Mini Description:
                                                        <input
                                                            type="text"
                                                            value={newRoomDetails.mini_description ?? ''}
                                                            onChange={(e) => setNewRoomDetails({ ...newRoomDetails, mini_description: e.target.value })}
                                                            className="ml-2 p-2 border rounded"
                                                        />
                                                    </label>
                                                    <label className="ml-4">
                                                        Floor:
                                                        <input
                                                            type="number"
                                                            value={newRoomDetails.floor ?? ''}
                                                            onChange={(e) => setNewRoomDetails({ ...newRoomDetails, floor: Number(e.target.value) })}
                                                            className="ml-2 p-2 border rounded"
                                                        />
                                                    </label>
                                                    <label className="ml-4">
                                                        Area:
                                                        <input
                                                            type="number"
                                                            value={newRoomDetails.area ?? ''}
                                                            onChange={(e) => setNewRoomDetails({ ...newRoomDetails, area: Number(e.target.value) })}
                                                            className="ml-2 p-2 border rounded"
                                                        />
                                                    </label>
                                                    <label className="ml-4">
                                                        Description:
                                                        <input
                                                            type="text"
                                                            value={newRoomDetails.description ?? ''}
                                                            onChange={(e) => setNewRoomDetails({ ...newRoomDetails, description: e.target.value })}
                                                            className="ml-2 p-2 border rounded"
                                                        />
                                                    </label>
                                                    <button
                                                        onClick={handleSaveRoomDetails}
                                                        className="bg-green-500 text-white px-4 py-2 rounded ml-4"
                                                    >
                                                        Save
                                                    </button>
                                                    <h3 className="text-xl font-bold mt-4">Beds</h3>
                                                    <ul>
                                                        {beds.map(bed => (
                                                            <li key={bed.id} className="mb-2 p-2 border rounded">
                                                                <p><strong>Bed ID:</strong> {bed.id}</p>
                                                                <p><strong>Cost:</strong> {bed.cost}</p>
                                                                <button
                                                                    onClick={() => handleEditBed(bed)}
                                                                    className="bg-blue-500 text-white px-4 py-2 rounded ml-2"
                                                                >
                                                                    Edit Bed
                                                                </button>
                                                                {editBedId === bed.id && (
                                                                    <div className="mt-2">
                                                                        <label>
                                                                            Cost:
                                                                            <input
                                                                                type="number"
                                                                                value={newBedCost ?? ''}
                                                                                onChange={(e) => setNewBedCost(Number(e.target.value))}
                                                                                className="ml-2 p-2 border rounded"
                                                                            />
                                                                        </label>
                                                                        <button
                                                                            onClick={handleSaveBedDetails}
                                                                            className="bg-green-500 text-white px-4 py-2 rounded ml-4"
                                                                        >
                                                                            Save
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
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