"use client";

import React, { useState, useEffect } from 'react';
import Layout from '@/app/components/Layout';
import {
    getReservations,
    updateReservationStatus,
    updateReservationDates,
    getRooms,
    updateRoomDetails,
    getBedsByRoomId,
    updateBedCost,
    uploadPhotoAndAddToRoom,
    deletePhotoFromRoom,
    login,
    isAdmin, changePassword
} from '@/app/api/rooms';
import { Reservation, Room } from '@/app/types';
import Image from "next/image";
import { Plan } from "@/app/components/Plan";
import { Bed as PlanBed } from '@/app/components/Plan';
import { Bed as TypesBed } from '@/app/types';
import freeBed from '../../assets/beds/free_bed.svg';
import deleteimg from '../../assets/delete.svg';
import ReservationCard from "@/app/components/ReservationCard";
import ReservationTable from "@/app/components/ReservationTable";

const AdminPage = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdminUser, setIsAdminUser] = useState(false);
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
    const [newBedCost, setNewBedCost] = useState<number | null>(null);
    const [planBeds, setPlanBeds] = useState<PlanBed[]>([]);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [photoToDelete, setPhotoToDelete] = useState<string | null>(null);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');


    const [activeDormitory, setActiveDormitory] = useState<string | null>(null);

    const groupRoomsByDormitory = (rooms: Room[]) => {
        return rooms.reduce((acc, room) => {
            if (!acc[room.dorm]) {
                acc[room.dorm] = [];
            }
            acc[room.dorm].push(room);
            return acc;
        }, {} as Record<string, Room[]>);
    };

    const roomsByDormitory = groupRoomsByDormitory(rooms);
    if (roomsByDormitory['castle']) {
        roomsByDormitory['castle'].reverse();
    }

    const updateReservationInState = (updatedReservation: Reservation) => {
        setReservations(prevReservations =>
            prevReservations.map(reservation =>
                reservation.id === updatedReservation.id ? updatedReservation : reservation
            )
        );
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await changePassword(username, oldPassword, newPassword, confirmPassword);
        if (result.success) {
            alert('Password changed successfully');
        } else {
            alert(result.error);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setSelectedFiles(Array.from(event.target.files));
        }
    };

    const handleUploadPhoto = async () => {
        if (editRoomId !== null && selectedFiles.length > 0) {
            for (const file of selectedFiles) {
                await uploadPhotoAndAddToRoom(editRoomId, file);
            }

            setSelectedFiles([]);

            const updatedRooms = await getRooms();
            setRooms(updatedRooms);
        }
    };

    const handleDeletePhoto = async (photoUrl: string) => {
        if (editRoomId !== null) {
            await deletePhotoFromRoom(editRoomId, photoUrl);
            setPhotoToDelete(null);
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
            const beds = bedsData.flat();
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
            const sortedRooms = data.sort((a: Room, b: Room) => a.name.localeCompare(b.name));
            setRooms(sortedRooms);
        };

        if (isLoggedIn && isAdminUser) {
            fetchReservations();
            fetchRooms();
        }
    }, [isLoggedIn, isAdminUser]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        const user = await login(username, password);
        if (user) {
            const adminCheck = await isAdmin(user.user.id);
            if (adminCheck) {
                setIsLoggedIn(true);
                setIsAdminUser(true);
            } else {
                alert('You do not have admin privileges');
            }
        } else {
            alert('Invalid credentials');
        }
    };

    const handleEditRoom = async (room: Room) => {
        if (editRoomId === room.id) {
            setEditRoomId(null);
        } else {
            setEditRoomId(room.id);
            setNewRoomDetails(room);
            const bedsData = await getBedsByRoomId(room.id);
            setBeds(bedsData);
        }
    };

    const handleSaveRoomDetails = async () => {
        if (editRoomId !== null) {
            await updateRoomDetails(
                editRoomId, newRoomDetails);
            setRooms(rooms.map(room =>
                room.id === editRoomId ? { ...room, ...newRoomDetails } : room
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
                bed.id === editBedId ? { ...bed, cost: newBedCost } : bed
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

    return (
        <Layout>
            <div className="flex flex-col px-16 py-8">
                {isLoggedIn && isAdminUser ? (
                    <>
                        <h1 className="text-4xl font-bold mb-4">Admin Dashboard</h1>
                        <p>Welcome to the admin dashboard. Here you can manage rooms, beds, and reservations.</p>
                        {/*change password form*/}
                        <form onSubmit={handleChangePassword} className="max-w-sm mx-auto">
                            <h1 className="text-4xl font-bold mb-4">Change Password</h1>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="oldPassword">
                                    Old Password
                                </label>
                                <input
                                    type="password"
                                    id="oldPassword"
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newPassword">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    id="newPassword"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            <div className="mb-6">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <button
                                    type="submit"
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                >
                                    Change Password
                                </button>
                            </div>
                        </form>
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
                            <div className="mt-10">
                                <ReservationTable reservations={reservations} roomToBedsMap={roomToBedsMap}/>
                            </div>
                        )}
                        {activeTab === 'rooms' && (
                            <div>
                                <h2 className="text-2xl font-bold mt-8">Rooms</h2>
                                <div className="flex space-x-4 mt-4">
                                    {Object.keys(roomsByDormitory).map(dormitory => (
                                        <button
                                            key={dormitory}
                                            onClick={() => setActiveDormitory(dormitory)}
                                            className={`px-4 py-2 rounded ${activeDormitory === dormitory ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                                        >
                                            {dormitory}
                                        </button>
                                    ))}
                                </div>
                                {activeDormitory && (
                                    <ul>
                                        {roomsByDormitory[activeDormitory].map(room => (
                                            <RoomListItem
                                                key={room.id}
                                                room={room}
                                                editRoomId={editRoomId}
                                                newRoomDetails={newRoomDetails}
                                                beds={roomToBedsMap[room.id] ?? []}
                                                editBedId={editBedId}
                                                newBedCost={newBedCost}
                                                handleEditRoom={handleEditRoom}
                                                handleDeletePhoto={handleDeletePhoto}
                                                handleFileChange={handleFileChange}
                                                handleUploadPhoto={handleUploadPhoto}
                                                handleSaveRoomDetails={handleSaveRoomDetails}
                                                handleEditBed={handleEditBed}
                                                handleSaveBedDetails={handleSaveBedDetails}
                                                setNewRoomDetails={setNewRoomDetails}
                                                setNewBedCost={setNewBedCost}
                                            />
                                        ))}
                                    </ul>
                                )}
                            </div>
                        )}
                    </>
                ) : (
                    <LoginForm
                        username={username}
                        password={password}
                        setUsername={setUsername}
                        setPassword={setPassword}
                        handleLogin={handleLogin}
                    />
                )}
            </div>
        </Layout>
    );
};

export default AdminPage;

interface LoginFormProps {
    username: string;
    password: string;
    setUsername: (username: string) => void;
    setPassword: (password: string) => void;
    handleLogin: (e: React.FormEvent) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({username, password, setUsername, setPassword, handleLogin}) => {
    return (
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
    );
};

interface RoomListItemProps {
    room: any;
    editRoomId: number | null;
    newRoomDetails: any;
    beds: any[];
    editBedId: number | null;
    newBedCost: number | null;
    handleEditRoom: (room: any) => void;
    handleDeletePhoto: (url: string) => void;
    handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleUploadPhoto: () => void;
    handleSaveRoomDetails: () => void;
    handleEditBed: (bed: any) => void;
    handleSaveBedDetails: () => void;
    setNewRoomDetails: (details: any) => void;
    setNewBedCost: (cost: number) => void;
}

const RoomListItem: React.FC<RoomListItemProps> = ({
    room,
    editRoomId,
    newRoomDetails,
    beds,
    editBedId,
    newBedCost,
    handleEditRoom,
    handleDeletePhoto,
    handleFileChange,
    handleUploadPhoto,
    handleSaveRoomDetails,
    handleEditBed,
    handleSaveBedDetails,
    setNewRoomDetails,
    setNewBedCost,
}) => {
    return (
        <li key={room.id} className="mb-4 p-4 border bg-[#DBE9FB] rounded-3xl">
            <p className="font-bold mt-4 ml-3">{room.name}</p>
            <button
                onClick={() => handleEditRoom(room)}
                className="bg-[#0F478D] font-bold my-6 text-white p-4 px-10 rounded-[9px] ml-2"
            >
                Edit Room
            </button>
            {editRoomId === room.id && (
                <div className="mt-2 flex justify-center items-center flex-row">
                    <div className="bg-white rounded-2xl p-8">
                        <div className=" h-[400px] overflow-y-auto">
                            <h3 className="text-xl mb-6 font-bold ">Photos</h3>
                            <ul className="grid grid-cols-3 gap-2 max-w-[600px]">
                                {room.image_urls != null && Array.isArray(JSON.parse(room.image_urls)) && JSON.parse(room.image_urls).map((url: string) => (
                                    <li key={url} className="mb-2 p-2">
                                        <img src={url} alt="Room Photo"
                                             className="w-[197px] h-[173px] rounded-2xl object-cover"/>
                                        <button
                                            onClick={() => handleDeletePhoto(url)}
                                            className=" relative text-white px-4 py-2 rounded ml-2">
                                            <div
                                                className="absolute w-8 h-8 bottom-40 left-32   ">
                                                <Image
                                                    src={deleteimg}
                                                    alt="delete-img"
                                                    objectFit="cover"
                                                    width={70}
                                                    height={70}/>
                                            </div>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="mt-4 relative">
                            <label
                                className="hidden text-lg font-semibold mb-2 text-gray-700">
                                Upload Photo:
                            </label>
                            <div className="flex flex-row">
                                <div
                                    className="flex items-center justify-center w-full sm:w-auto bg-[#0F478D] text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-2xl transform transition duration-300 ease-in-out hover:scale-105 cursor-pointer"
                                >
                                    <input
                                        type="file"
                                        multiple
                                        onChange={handleFileChange}
                                        className="absolute z-20 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    Choose Files
                                </div>
                                <button
                                    onClick={handleUploadPhoto}
                                    className="mt-4 w-full sm:w-auto bg-[#0F478D]  text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-2xl transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ml-4"
                                >
                                    Upload
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col ml-40 w-[550px] gap-4">
                        <div className="flex flex-col gap-2 desktopxxl:flex-row">
                            <div>
                                <label className=" ml-2 desktopxxl:ml-4">
                                    Name:
                                    <input
                                        type="text"
                                        value={newRoomDetails.name ?? ''}
                                        onChange={(e) => setNewRoomDetails({
                                            ...newRoomDetails,
                                            name: e.target.value
                                        })}
                                        className="ml-2 p-2 w-96 border rounded-lg"
                                    />
                                </label>
                            </div>
                            <div>
                                <label className="ml-4">
                                    Floor:
                                    <input
                                        type="number"
                                        value={newRoomDetails.floor ?? ''}
                                        onChange={(e) => setNewRoomDetails({
                                            ...newRoomDetails,
                                            floor: Number(e.target.value)
                                        })}
                                        className="ml-2 p-2 border rounded-lg"
                                    />
                                </label>
                            </div>
                        </div>
                        <div>
                            <label className="ml-4">
                                Description:
                                <textarea
                                    value={newRoomDetails.description ?? ''}
                                    onChange={(e) => setNewRoomDetails({
                                        ...newRoomDetails,
                                        description: e.target.value
                                    })}
                                    className="ml-2 p-2 w-5/6 h-32 border rounded-lg"
                                />
                            </label>
                        </div>
                        <div className="flex mt-4 justify-center items-center  ">
                            <button
                                onClick={handleSaveRoomDetails}
                                className="bg-[#0F478D] text-white px-4 py-2 flex-grow  rounded-xl "
                            >
                                Save
                            </button>
                        </div>
                        <h3 className="text-xl font-bold mt-4">Beds</h3>
                        <div className="flex flex-row gap-4">
                            {beds.map(bed => (
                                <BedItem
                                    key={bed.id}
                                    bed={bed}
                                    editBedId={editBedId}
                                    newBedCost={newBedCost}
                                    handleEditBed={handleEditBed}
                                    handleSaveBedDetails={handleSaveBedDetails}
                                    setNewBedCost={setNewBedCost}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </li>
    );
};

interface BedItemProps {
    bed: {
        id: number;
        cost: number;
        room: number;
    };
    editBedId: number | null;
    newBedCost: number | null;
    handleEditBed: (bed: any) => void;
    handleSaveBedDetails: () => void;
    setNewBedCost: (cost: number) => void;
}

const BedItem: React.FC<BedItemProps> = ({
                                             bed,
                                             editBedId,
                                             newBedCost,
                                             handleEditBed,
                                             handleSaveBedDetails,
                                             setNewBedCost,
                                         }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div key={bed.id} className="mb-2 w-42 flex flex-col gap-1 p-2 border rounded">
            <div
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="relative"
            >
                <Image
                    src={freeBed}
                    alt="Bed"
                    objectFit="cover"
                    width={75}
                    height={75}
                />
                {isHovered && (
                    <div className="absolute w-80 h-60 mt-2 bg-white border-2 border-gray-800 shadow-lg z-10" style={{ left: '-20rem' }}>
                        <Plan beds={[bed]} takenBedId={bed.id} id={bed.room} />
                    </div>
                )}
            </div>
            <p><strong>Bed ID:</strong> {bed.id}</p>
            <p><strong>Cost:</strong> {bed.cost}</p>
            <button
                onClick={() => handleEditBed(bed)}
                className="bg-[#0F478D] text-white px-4 py-2 rounded-xl"
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
                        className="bg-[#0F478D] mt-3 text-white px-4 py-2 rounded-xl ml-4"
                    >
                        Save
                    </button>
                </div>
            )}
        </div>
    );
};

