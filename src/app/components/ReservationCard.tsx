import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Plan } from '@/app/components/Plan';
import { Reservation, Bed, Room } from '@/app/types';
import { getRoomById, updateReservationDates, updateReservationStatus, deleteReservation } from '@/app/api/rooms';

interface ReservationCardProps {
    reservation: Reservation;
    roomToBedsMap: Record<number, Bed[]>;
}

const ReservationCard: React.FC<ReservationCardProps> = ({ reservation, roomToBedsMap }) => {
    const [isDeleted, setIsDeleted] = useState(false);

    const useReservation = (initialReservation: Reservation) => {
        const [reservation, setReservation] = useState(initialReservation);
        const [newFromDate, setNewFromDate] = useState(initialReservation.from);
        const [newToDate, setNewToDate] = useState(initialReservation.to);
        const [room, setRoom] = useState<Room | null>(null);

        useEffect(() => {
            setNewFromDate(initialReservation.from);
            setNewToDate(initialReservation.to);
        }, [initialReservation]);

        useEffect(() => {
            const fetchRoomDetails = async () => {
                if (reservation.bed?.room) {
                    const roomDetails = await getRoomById(reservation.bed.room);
                    setRoom(roomDetails);
                }
            };
            fetchRoomDetails();
        }, [reservation.bed?.room]);

        const saveDates = async () => {
            await updateReservationDates(reservation.id, newFromDate, newToDate);
            setReservation({ ...reservation, from: newFromDate, to: newToDate });
        };

        const handleUpdateReservation = async (confirmed: boolean) => {
            await updateReservationStatus(reservation.id, confirmed);
            setReservation({ ...reservation, confirmed });
        };

        const handleDeleteReservation = async () => {
            await deleteReservation(reservation.id);
            setIsDeleted(true);
        };

        return {
            reservation,
            newFromDate,
            newToDate,
            room,
            setNewFromDate,
            setNewToDate,
            saveDates,
            handleUpdateReservation,
            handleDeleteReservation,
        };
    };

    const {
        reservation: updatedReservation,
        newFromDate,
        newToDate,
        room,
        setNewFromDate,
        setNewToDate,
        saveDates,
        handleUpdateReservation,
        handleDeleteReservation,
    } = useReservation(reservation);

    if (isDeleted) {
        return null;
    }

    return (
        <div key={updatedReservation.id}
             className="mb-4 w-[740px] flex flex-col gap-5 items-center rounded-admin-large h-fit pb-14 bg-[#EAF1F9] p-4 border relative">
            <button
                onClick={handleDeleteReservation}
                className="absolute top-24 right-24 text-red-500"
            >
                &#x2715;
            </button>

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
                            {updatedReservation.tenant.name} {updatedReservation.tenant.surname}
                        </p>
                        <p className="border-[#32648B] text-xs w-[50%] rounded-xl flex pl-5 justify-start items-center h-10 border-[1px]">
                            {updatedReservation.confirmed ? 'Confirmed' : 'Pending'}
                        </p>
                    </div>
                </div>
                <div>
                    <p className="border-[#32648B] text-xs rounded-xl flex pl-5 justify-start items-center h-10 border-[1px]">
                        {updatedReservation.tenant.phone}
                    </p>
                </div>
                <div>
                    <p className="border-[#32648B] text-xs rounded-xl flex pl-5 justify-start items-center h-10 border-[1px]">
                        {updatedReservation.tenant.email}
                    </p>
                </div>
                <div>
                    <p className="border-[#32648B] text-xs rounded-xl flex pl-5 justify-start items-center h-10 border-[1px]">
                        {updatedReservation.tenant.gender}
                    </p>
                </div>
                <div>
                    <p className="border-[#32648B] text-xs rounded-xl flex pl-5 justify-start items-center h-10 border-[1px]">
                        {updatedReservation.tenant.date_of_birth}
                    </p>
                </div>
                {room && (
                    <>
                        <div>
                            <p className="border-[#32648B] text-xs rounded-xl flex pl-5 justify-start items-center h-10 border-[1px]">
                                Room Name: {room.name}
                            </p>
                        </div>
                        <div>
                            <p className="border-[#32648B] text-xs rounded-xl flex pl-5 justify-start items-center h-10 border-[1px]">
                                Room Address: {room.address}
                            </p>
                        </div>
                    </>
                )}
            </div>

            <div className="flex flex-row justify-between my-5 items-center w-[540px]">
                <div className="flex flex-col gap-4">
                    Reservation period
                    <div className="bg-[#FFFFFF] rounded-2xl mr-4 p-2">
                        <div className="flex w-60 gap-2 justify-center items-center flex-col mt-4">
                            <label>
                                From:
                                <input
                                    type="date"
                                    value={newFromDate}
                                    onChange={(e) => setNewFromDate(e.target.value)}
                                    className="ml-2 p-2 border rounded"
                                    max="9999-12-31"
                                    min="1900-01-01"
                                />
                            </label>
                            <label className="ml-6">
                                To:
                                <input
                                    type="date"
                                    value={newToDate}
                                    onChange={(e) => setNewToDate(e.target.value)}
                                    className="ml-2 p-2 border rounded"
                                    max="9999-12-31"
                                    min="1900-01-01"
                                />
                            </label>
                            <button
                                onClick={saveDates}
                                className="bg-[#0F478D] text-white px-4 py-2 rounded ml-4"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
                {updatedReservation.bed && (
                    <div className="w-80 h-60 mt-10">
                        <Plan beds={roomToBedsMap[updatedReservation.bed.room] ?? []}
                              takenBedId={updatedReservation.bed.id}
                              id={updatedReservation.bed.room}/>
                    </div>
                )}
            </div>

            <div className="flex flex-row flex-wrap justify-center w-[540px] gap-4">
                <button
                    onClick={() => handleUpdateReservation(true)}
                    className="bg-[#0F478D] w-64 h-16 text-white px-4 py-2 rounded-xl mr-2"
                >
                    Confirm reservation
                </button>
                <button
                    onClick={() => handleUpdateReservation(false)}
                    className="bg-[#0F478D] w-64 h-16 text-white px-14 py-2 rounded-xl"
                >
                    Cancel reservation
                </button>
            </div>
        </div>
    );
};

export default ReservationCard;