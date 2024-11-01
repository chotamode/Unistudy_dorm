"use client";

import React, {useState, useEffect} from 'react';
import Layout from '@/app/components/Layout';
import {
    getReservations,
    updateReservationStatus,
    updateReservationDates,
    getRooms,
    updateRoomDetails,
    getBedsByRoomId,
    updateBedCost, uploadPhotoAndAddToRoom, deletePhotoFromRoom
} from '@/app/api/rooms';
import {Reservation, Room} from '@/app/types';
import Image from "next/image";
import {Plan} from "@/app/components/Plan";
import {Bed as PlanBed} from '@/app/components/Plan';
import {Bed as TypesBed} from '@/app/types';

// git pls work
const AdminPage = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [activeTab, setActiveTab] = useState<'reservations' | 'rooms'>('reservations');
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [beds, setBeds] = useState<TypesBed[]>([]);
    const [editReservationId, setEditReservationId] = useState<number | null>(null);
    const [newFromDate, setNewFromDate] = useState<string>('');
    const [newToDate, setNewToDate] = useState<string>('');
    const [editRoomId, setEditRoomId] = useState<number | null>(null);
    const [newRoomDetails, setNewRoomDetails] = useState<Partial<Room>>({});
    const [editBedId, setEditBedId] = useState<number | null>(null);
    const [newBedCost, setNewBedCost] = useState<number | null>(null)
    const [planBeds, setPlanBeds] = useState<PlanBed[]>([]);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [photoToDelete, setPhotoToDelete] = useState<string | null>(null);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);


    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setSelectedFiles(Array.from(event.target.files));
        }
    };

    rooms.map(room => {
        console.log(
            room.image_urls
        )

    })

    const handleUploadPhoto = async () => {
        if (editRoomId !== null && selectedFiles.length > 0) {
            for (const file of selectedFiles) {
                await uploadPhotoAndAddToRoom(editRoomId, file);
            }

            setSelectedFiles([]);

            // Refresh room data after upload
            const updatedRooms = await getRooms();
            setRooms(updatedRooms);
        }
    };

    const handleDeletePhoto = async (photoUrl: string) => {
        if (editRoomId !== null) {
            await deletePhotoFromRoom(editRoomId, photoUrl);
            setPhotoToDelete(null);
            // Refresh room data after deletion
            const updatedRooms = await getRooms();
            setRooms(updatedRooms);
        }
    };

    useEffect(() => {
        const fetchBedsForReservations = async () => {
            const bedsData = await Promise.all(
                reservations.map(async (reservation) => {
                    if (reservation.bed) {
                        return getBedsByRoomId(reservation.bed.room);
                    }
                    return [];
                })
            );
            setBeds(bedsData.flat());
        };

        if (reservations.length > 0) {
            fetchBedsForReservations();
        }
    }, [reservations]);

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
            reservation.id === reservationId ? {...reservation, confirmed} : reservation
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
                reservation.id === editReservationId ? {...reservation, from: newFromDate, to: newToDate} : reservation
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
                room.id === editRoomId ? {...room, ...newRoomDetails} : room
            ));
            setEditRoomId(null);
        }
    };

    const handleEditBed = (bed: TypesBed) => {
        setEditBedId(bed.id);
        setNewBedCost(bed.cost);
    };

    const handleSaveBedDetails = async () => {
        if (editBedId !== null && newBedCost !== null) {
            await updateBedCost(editBedId, newBedCost);
            setBeds(beds.map(bed =>
                bed.id === editBedId ? {...bed, cost: newBedCost} : bed
            ));
            setEditBedId(null);
        }
    };

    const roomToBedsMap = beds.reduce((acc, bed) => {
        if (!acc[bed.room]) {
            acc[bed.room] = [];
        }
        acc[bed.room].push(bed);
        return acc;
    }, {} as Record<number, TypesBed[]>);

    console.log(roomToBedsMap);

    return (
        <Layout>
            <div className="flex flex-col px-16 py-8">
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
                            <div className="flex flex-row flex-wrap gap-5 ">


                                <div className="flex justify-center flex-wrap mt-10 gap-5">
                                    {reservations.map(reservation => (
                                        <div key={reservation.id}
                                             className=" mb-4 w-[740px] flex flex-col gap-5 items-center rounded-admin-large h-[940px] bg-[#EAF1F9] p-4 border ">


                                            <div className="w-[132px] mt-6 h-[132px]">
                                                <Image
                                                    src="/images/profile-icon-admin.svg"
                                                    alt="Background"
                                                    objectFit="cover"
                                                    width={132}
                                                    height={132}
                                                />

                                            </div>

                                            <div className="flex gap-6 mt-4 flex-col w-96 ">


                                                <div>
                                                    <div className="flex flex-row gap-2">

                                                        <p className="border-[#32648B] text-xs w-[50%] rounded-xl flex pl-5 justify-start items-center h-10 border-[1px]">
                                                            {reservation.tenant.name} {reservation.tenant.surname}
                                                        </p>

                                                        <p className="border-[#32648B] text-xs w-[50%] rounded-xl flex pl-5 justify-start items-center h-10 border-[1px]">
                                                            {reservation.confirmed ? 'Confirmed' : 'Pending'}
                                                        </p>

                                                    </div>

                                                </div>

                                                <div>

                                                    <p className="border-[#32648B] text-xs rounded-xl flex pl-5 justify-start items-center h-10 border-[1px]">
                                                        {reservation.tenant.phone}
                                                    </p>

                                                </div>

                                                <div>

                                                    <p className="border-[#32648B] text-xs rounded-xl flex pl-5 justify-start items-center h-10 border-[1px]">
                                                        {reservation.tenant.email}
                                                    </p>

                                                </div>

                                                <div>

                                                    <p className="border-[#32648B] text-xs rounded-xl flex pl-5 justify-start items-center h-10 border-[1px]">
                                                        {reservation.tenant.gender}
                                                    </p>

                                                </div>

                                                <div>

                                                    <p className="border-[#32648B] text-xs rounded-xl flex pl-5 justify-start items-center h-10 border-[1px]">
                                                        {reservation.tenant.date_of_birth}
                                                    </p>

                                                </div>

                                                <div>

                                                    <p className="border-[#32648B] text-xs rounded-xl flex pl-5 justify-start items-center h-10 border-[1px]">
                                                        {reservation.bed ? `Bed ID: ${reservation.bed.id}` : 'No bed assigned'}
                                                    </p>

                                                    <p className="border-[#32648B] text-xs rounded-xl flex pl-5 justify-start items-center h-10 border-[1px]">
                                                        {reservation.bed?.room ? `Room ID: ${reservation.bed.room}` : 'No bed assigned'}
                                                    </p>

                                                </div>

                                            </div>


                                            <div className="flex flex-row justify-between my-5 items-center  w-[540px]">

                                                <div className="flex flex-col gap-4">

                                                    Reservation period

                                                    <div className="bg-[#FFFFFF] flex flex-col gap-2 rounded-2xl p-5">
                                                        {/*<p className="font-medium text-adxs">*/}
                                                        {/*  <strong>From:</strong>  {reservation.from}*/}
                                                        {/*</p>*/}

                                                        {/*<p className="font-medium text-adxs">*/}
                                                        {/*  <strong>To:</strong> {reservation.to}*/}
                                                        {/*</p>*/}
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

                                                    </div>

                                                </div>


                                                {reservation.bed && (
                                                    <div className="w-80 h-44 border-solid border-4">
                                                        <Plan beds={roomToBedsMap[reservation.bed.room] ?? []}
                                                              takenBedId={reservation.bed.id}
                                                              id={reservation.bed.room}/>
                                                    </div>
                                                )}

                                            </div>


                                            {/*

                                            <div>
                                                <strong>Room ID:</strong> {reservation.bed ? reservation.bed.room : 'N/A'}
                                            </div>

                                            <div>
                                                <strong>Bed ID:</strong> {reservation.bed ? reservation.bed.id : 'N/A'}
                                            </div>

                                            */}


                                            <div className="flex flex-row flex-wrap justify-center w-[540px] gap-4">
                                                <button
                                                    onClick={() => handleUpdateReservation(reservation.id, true)}
                                                    className="bg-[#0F478D]  w-64 h-16 text-white px-4 py-2 rounded-xl mr-2"
                                                >
                                                    Confirm reservation
                                                </button>
                                                <button
                                                    onClick={() => handleUpdateReservation(reservation.id, false)}
                                                    className="bg-[#0F478D] w-64 h-16 text-white px-4 py-2 rounded-xl"
                                                >
                                                    Cancel reservation
                                                </button>
                                                {/*<button*/}
                                                {/*    onClick={() => handleEditDates(reservation)}*/}
                                                {/*    className="bg-[#0F478D] w-64 h-16 text-white px-4 py-2 rounded-xl ml-2"*/}
                                                {/*>*/}
                                                {/*    Сhange the date*/}
                                                {/*</button>*/}
                                            </div>

                                            {/*{editReservationId === reservation.id && (*/}
                                            {/*    <div className="mt-4">*/}
                                            {/*        <label>*/}
                                            {/*            From:*/}
                                            {/*            <input*/}
                                            {/*                type="date"*/}
                                            {/*                value={newFromDate}*/}
                                            {/*                onChange={(e) => setNewFromDate(e.target.value)}*/}
                                            {/*                className="ml-2 p-2 border rounded"*/}
                                            {/*            />*/}
                                            {/*        </label>*/}
                                            {/*        <label className="ml-4">*/}
                                            {/*            To:*/}
                                            {/*            <input*/}
                                            {/*                type="date"*/}
                                            {/*                value={newToDate}*/}
                                            {/*                onChange={(e) => setNewToDate(e.target.value)}*/}
                                            {/*                className="ml-2 p-2 border rounded"*/}
                                            {/*            />*/}
                                            {/*        </label>*/}
                                            {/*        <button*/}
                                            {/*            onClick={handleSaveDates}*/}
                                            {/*            className="bg-green-500 text-white px-4 py-2 rounded ml-4"*/}
                                            {/*        >*/}
                                            {/*            Save*/}
                                            {/*        </button>*/}
                                            {/*    </div>*/}
                                            {/*)}*/}
                                        </div>
                                    ))}
                                </div>
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
                                                            onChange={(e) => setNewRoomDetails({
                                                                ...newRoomDetails,
                                                                name: e.target.value
                                                            })}
                                                            className="ml-2 p-2 border rounded"
                                                        />
                                                    </label>
                                                    <label className="ml-4">
                                                        Address:
                                                        <input
                                                            type="text"
                                                            value={newRoomDetails.address ?? ''}
                                                            onChange={(e) => setNewRoomDetails({
                                                                ...newRoomDetails,
                                                                address: e.target.value
                                                            })}
                                                            className="ml-2 p-2 border rounded"
                                                        />
                                                    </label>
                                                    <label className="ml-4">
                                                        Mini Description:
                                                        <input
                                                            type="text"
                                                            value={newRoomDetails.mini_description ?? ''}
                                                            onChange={(e) => setNewRoomDetails({
                                                                ...newRoomDetails,
                                                                mini_description: e.target.value
                                                            })}
                                                            className="ml-2 p-2 border rounded"
                                                        />
                                                    </label>
                                                    <label className="ml-4">
                                                        Floor:
                                                        <input
                                                            type="number"
                                                            value={newRoomDetails.floor ?? ''}
                                                            onChange={(e) => setNewRoomDetails({
                                                                ...newRoomDetails,
                                                                floor: Number(e.target.value)
                                                            })}
                                                            className="ml-2 p-2 border rounded"
                                                        />
                                                    </label>
                                                    <label className="ml-4">
                                                        Area:
                                                        <input
                                                            type="number"
                                                            value={newRoomDetails.area ?? ''}
                                                            onChange={(e) => setNewRoomDetails({
                                                                ...newRoomDetails,
                                                                area: Number(e.target.value)
                                                            })}
                                                            className="ml-2 p-2 border rounded"
                                                        />
                                                    </label>
                                                    <label className="ml-4">
                                                        Description:
                                                        <input
                                                            type="text"
                                                            value={newRoomDetails.description ?? ''}
                                                            onChange={(e) => setNewRoomDetails({
                                                                ...newRoomDetails,
                                                                description: e.target.value
                                                            })}
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
                                                    <div className="mt-4">
                                                        <label>
                                                            Upload Photo:
                                                            <input
                                                                type="file"
                                                                multiple
                                                                onChange={handleFileChange}
                                                                className="ml-2 p-2 border rounded"
                                                            />
                                                        </label>
                                                        <button
                                                            onClick={handleUploadPhoto}
                                                            className="bg-green-500 text-white px-4 py-2 rounded ml-4"
                                                        >
                                                            Upload
                                                        </button>
                                                    </div>
                                                    <div className="mt-4">
                                                        <h3 className="text-xl font-bold">Photos</h3>
                                                        <ul>
                                                            {room.image_urls != null && Array.isArray(JSON.parse(room.image_urls)) && JSON.parse(room.image_urls).map((url: string) => (
                                                                <li key={url} className="mb-2 p-2 border rounded">
                                                                    <img src={url} alt="Room Photo"
                                                                         className="w-32 h-32 object-cover"/>
                                                                    <button
                                                                        onClick={() => handleDeletePhoto(url)}
                                                                        className="bg-red-500 text-white px-4 py-2 rounded ml-2"
                                                                    >
                                                                        Delete
                                                                    </button>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
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

// // reservation plan by id
// const ReservationPlan = ({id, takenBedId}: { id: number, takenBedId: number | undefined }) => {
//     const
//     return (
//         <div className="w-80 h-44 border-solid border-4">
//             {/*<Plan beds={getBedsByRoomId(id)} takenBedId={undefined}/>*/}
//         </div>
//     );
// }

export default AdminPage;