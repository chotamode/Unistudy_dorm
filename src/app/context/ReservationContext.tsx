"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ReservationContextProps {
    year: number;
    gender: 'male' | 'female';
    setYear: (year: number) => void;
    setGender: (gender: 'male' | 'female') => void;

    name: string;
    surname: string;
    phoneNumber: string;
    email: string;
    dateOfBirth: Date;
    reservationFrom: Date;
    reservationTo: Date;
    consent: boolean;

    setName: (name: string) => void;
    setSurname: (surname: string) => void;
    setPhoneNumber: (phoneNumber: string) => void;
    setEmail: (email: string) => void;
    setDateOfBirth: (dateOfBirth: Date) => void; // Updated to Date
    setReservationFrom: (reservationFrom: Date) => void;
    setReservationTo: (reservationTo: Date) => void;
    setConsent: (consent: boolean) => void;
}

const ReservationContext = createContext<ReservationContextProps | undefined>(undefined);

export const ReservationContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [gender, setGender] = useState<'male' | 'female'>('female');
    const [name, setName] = useState<string>('');
    const [surname, setSurname] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [dateOfBirth, setDateOfBirth] = useState<Date>(new Date());
    const [reservationFrom, setReservationFrom] = useState<Date>(new Date());
    const [reservationTo, setReservationTo] = useState<Date>(new Date());
    const [consent, setConsent] = useState<boolean>(false);

    return (
        <ReservationContext.Provider value={{ year, gender, name, surname, phoneNumber, email, dateOfBirth, reservationFrom, reservationTo, consent,
            setYear, setGender, setName, setSurname, setPhoneNumber, setEmail, setDateOfBirth, setReservationFrom, setReservationTo, setConsent }}>
            {children}
        </ReservationContext.Provider>
    );
};

export const useFormData = () => {
    const context = useContext(ReservationContext);
    if (!context) {
        throw new Error('useYearGender must be used within a YearGenderProvider');
    }
    return context;
};