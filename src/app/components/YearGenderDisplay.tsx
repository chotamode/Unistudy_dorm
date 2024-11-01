import React from 'react';
import { useFormData } from '@/app/context/YearGenderContext';

const YearGenderDisplay: React.FC = () => {
    const { year, gender } = useFormData();

    if (year === undefined || gender === undefined) {
        return null;
    }

    return (
        <div className="year-gender-display">
            <p>Year: {year}</p>
            <p>Gender: {gender}</p>
        </div>
    );
};

export default YearGenderDisplay;