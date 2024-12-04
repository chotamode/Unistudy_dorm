import React, { useState } from 'react';
import { Reservation, Bed, Room } from '@/app/types';
import { getRoomById, updateReservationDates, updateReservationStatus, deleteReservation } from '@/app/api/rooms';
import { Plan } from '@/app/components/Plan';

interface ReservationTableProps {
    reservations: Reservation[];
    roomToBedsMap: Record<number, Bed[]>;
}

const useReservation = (initialReservation: Reservation) => {
    const [reservation, setReservation] = React.useState(initialReservation);
    const [newFromDate, setNewFromDate] = React.useState(initialReservation.from);
    const [newToDate, setNewToDate] = React.useState(initialReservation.to);
    const [room, setRoom] = React.useState<Room | null>(null);

    React.useEffect(() => {
        setNewFromDate(initialReservation.from);
        setNewToDate(initialReservation.to);
    }, [initialReservation]);

    React.useEffect(() => {
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
        setReservation({ ...reservation, deleted: true });
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

const ReservationRow: React.FC<{ initialReservation: Reservation, roomToBedsMap: Record<number, Bed[]> }> = ({ initialReservation, roomToBedsMap }) => {
    const [isHovered, setIsHovered] = useState(false);
    const {
        reservation,
        newFromDate,
        newToDate,
        room,
        setNewFromDate,
        setNewToDate,
        saveDates,
        handleUpdateReservation,
        handleDeleteReservation,
    } = useReservation(initialReservation);

    return (
        !reservation.deleted && (
            <tr key={reservation.id} className={
                reservation.confirmed ? 'bg-green-100 hover:bg-green-200' : 'bg-yellow-100 hover:bg-yellow-200'}>
                <td className="border text-center">
                    <button onClick={handleDeleteReservation} className="text-red-500 text-xl font-bold">&times;</button>
                </td>
                <td className="border px-4 py-2">{reservation.tenant.name} {reservation.tenant.surname}</td>
                <td className="border px-4 py-2">{reservation.tenant.phone}</td>
                <td className="border px-4 py-2">{reservation.tenant.email}</td>
                <td className="border px-4 py-2">{reservation.tenant.gender}</td>
                <td className="border px-4 py-2">{reservation.tenant.date_of_birth}</td>
                <td className="border px-4 py-2">{room?.name}</td>
                <td className="border px-4 py-2">{room?.address}</td>
                <td className="border px-0 py-0" colSpan={2}>
                    <div className="flex flex-row items-center h-full">
                        <div className="flex h-full">
                            <button onClick={saveDates}
                                    className="bg-blue-500 text-white rounded h-full">Save Date
                            </button>
                            <input
                                type="date"
                                value={newFromDate}
                                onChange={(e) => setNewFromDate(e.target.value)}
                                className="p-2 rounded-l h-full"
                                max="9999-12-31"
                                min="1900-01-01"
                            />
                            <input
                                type="date"
                                value={newToDate}
                                onChange={(e) => setNewToDate(e.target.value)}
                                className="p-2 border-l rounded-r h-full"
                                max="9999-12-31"
                                min="1900-01-01"
                            />
                        </div>
                    </div>
                </td>
                <td
                    className={`border px-4 py-2 cursor-pointer ${reservation.confirmed ? 'bg-green-200' : 'bg-yellow-200'} hover:bg-blue-200 text-center rounded-lg`}
                    onClick={() => handleUpdateReservation(!reservation.confirmed)}
                    style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px', backgroundColor: reservation.confirmed ? '#4CAF50' : '#FFC107', color: 'white', cursor: 'pointer' }}
                >
                    {reservation.confirmed ? 'Confirmed' : 'Pending'}
                </td>
                <td className="border px-4 py-2 relative">
                    {reservation.bed && (
                        <div
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                        >
                            <button className="bg-gray-300 text-black px-4 py-2 rounded">Show Plan</button>
                            {isHovered && (
                                <div className="absolute w-80 h-60 mt-2 bg-white border-2 border-gray-800 shadow-lg z-10" style={{ left: '-20rem' }}>
                                    <Plan beds={roomToBedsMap[reservation.bed.room] ?? []}
                                          takenBedId={reservation.bed.id}
                                          id={reservation.bed.room}/>
                                </div>
                            )}
                        </div>
                    )}
                </td>
            </tr>
        )
    );
};

const ReservationTable: React.FC<ReservationTableProps> = ({ reservations, roomToBedsMap }) => {
    const [selectedDormitory, setSelectedDormitory] = useState<string | null>(null);

    const dormitories = ["castle", "sokol", "kamycka"];

    const filteredReservations = selectedDormitory
        ? reservations.filter(reservation => reservation.bed?.dorm === selectedDormitory && !reservation.deleted)
        : reservations.filter(reservation => !reservation.deleted);


    return (
        <div>
            <div className="flex space-x-4 mb-4">
                {dormitories.map(dormitory => (
                    <button
                        key={dormitory}
                        onClick={() => setSelectedDormitory(dormitory)}
                        className={`px-4 py-2 rounded ${selectedDormitory === dormitory ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    >
                        {dormitory}
                    </button>
                ))}
                <button
                    onClick={() => setSelectedDormitory(null)}
                    className={`px-4 py-2 rounded ${selectedDormitory === null ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                    All
                </button>
            </div>
            <table className="min-w-full bg-white text-xs sm:text-sm md:text-base">
                <thead>
                    <tr>
                        <th className="py-0">Actions</th>
                        <th className="py-0">Name</th>
                        <th className="py-0">Phone</th>
                        <th className="py-0">Email</th>
                        <th className="py-0">Gender</th>
                        <th className="py-0">Date of Birth</th>
                        <th className="py-0">Room Name</th>
                        <th className="py-0">Room Address</th>
                        <th className="py-0" colSpan={2}>Reservation Period</th>
                        <th className="py-0">Status</th>
                        <th className="py-0">Plan</th>
                    </tr>
                </thead>
                <tbody className="text-xs sm:text-sm md:text-base">
                    {filteredReservations.filter(reservation => !reservation.deleted).map((initialReservation) => (
                        <ReservationRow key={initialReservation.id} initialReservation={initialReservation} roomToBedsMap={roomToBedsMap} />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ReservationTable;