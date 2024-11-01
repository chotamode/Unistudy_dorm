import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Plan } from '@/app/components/Plan';
import { Reservation, Bed } from '@/app/types';

interface ReservationCardProps {
    reservation: Reservation;
    handleSaveDates: () => void;
    handleUpdateReservation: (reservationId: number, confirmed: boolean) => void;
    roomToBedsMap: Record<number, Bed[]>;
}

const ReservationCard: React.FC<ReservationCardProps> = ({
    reservation,
    handleSaveDates,
    handleUpdateReservation,
    roomToBedsMap
}) => {
    const [newFromDate, setNewFromDate] = useState(reservation.from);
    const [newToDate, setNewToDate] = useState(reservation.to);

    useEffect(() => {
        setNewFromDate(reservation.from);
        setNewToDate(reservation.to);
    }, [reservation]);

    return (
        <div key={reservation.id}
             className=" mb-4 w-[740px] flex flex-col gap-5 items-center rounded-admin-large h-[1080px] bg-[#EAF1F9] p-4  border ">

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
                </div>
                <div>
                    <p className="border-[#32648B] text-xs rounded-xl flex pl-5 justify-start items-center h-10 border-[1px]">
                        {reservation.bed?.room ? `Room ID: ${reservation.bed.room}` : 'No bed assigned'}
                    </p>
                </div>
            </div>

            <div className="flex flex-row justify-between my-5 items-center  w-[540px]">
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
                                onClick={handleSaveDates}
                                className="bg-[#0F478D] text-white px-4 py-2 rounded ml-4"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
                {reservation.bed && (
                    <div className="w-80 h-60 mt-10">
                        <Plan beds={roomToBedsMap[reservation.bed.room] ?? []}
                              takenBedId={reservation.bed.id}
                              id={reservation.bed.room}/>
                    </div>
                )}
            </div>

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
            </div>
        </div>
    );
};

export default ReservationCard;