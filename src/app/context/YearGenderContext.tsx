"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface YearGenderContextProps {
    year: number;
    gender: 'male' | 'female';
    setYear: (year: number) => void;
    setGender: (gender: 'male' | 'female') => void;
}

const YearGenderContext = createContext<YearGenderContextProps | undefined>(undefined);

export const YearGenderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [gender, setGender] = useState<'male' | 'female'>('female');

    return (
        <YearGenderContext.Provider value={{ year, gender, setYear, setGender }}>
            {children}
        </YearGenderContext.Provider>
    );
};

export const useYearGender = () => {
    const context = useContext(YearGenderContext);
    if (!context) {
        throw new Error('useYearGender must be used within a YearGenderProvider');
    }
    return context;
};