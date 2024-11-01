import React from 'react';
import { useFormData } from '@/app/context/ReservationContext';

const ReservationContextDisplay: React.FC = () => {
    const { year, gender, name, surname, phoneNumber, email, dateOfBirth, reservationFrom, reservationTo } = useFormData();

    if (year === undefined || gender === undefined) {
        return null;
    }

    return (
        <div className="year-gender-display">
            <p>Year: {year}</p>
            <p>Gender: {gender}</p>
            <p>Name: {name}</p>
            <p>Surname: {surname}</p>
            <p>Phone number: {phoneNumber}</p>
            <p>Email: {email}</p>
            <p>Date of birth: {dateOfBirth.toDateString()}</p>
            <p>Reservation from: {reservationFrom.toDateString()}</p>
            <p>Reservation to: {reservationTo.toDateString()}</p>
        </div>
    );
};

export default ReservationContextDisplay;