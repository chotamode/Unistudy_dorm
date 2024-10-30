import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import freeBed from '../../assets/beds/free_bed.svg';
import { checkBedAvailability } from '@/app/api/rooms';

interface Bed {
    id: number;
    occupied: boolean;
    cost: number;
}

interface BedCardProps {
    bed: Bed;
    year: number;
}

const BedCard: React.FC<BedCardProps> = ({ bed, year }) => {
    const [availability, setAvailability] = useState<string | null>(null);

    useEffect(() => {
        const fetchAvailability = async () => {
            const from = new Date(year, 8, 1); // September 1st of the given year
            const to = new Date(year + 1, 7, 31); // August 31st of the next year
            const freePeriod = await checkBedAvailability(bed.id, from, to);
            if (freePeriod) {
                const fromDate = new Date(freePeriod.from).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: '2-digit'
                }).replace(/\//g, '.');
                const toDate = new Date(freePeriod.to).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: '2-digit'
                }).replace(/\//g, '.');
                setAvailability(`${fromDate} • ${toDate}`);
            } else {
                setAvailability('Not available');
            }
        };

        fetchAvailability();
    }, [bed.id, year]);

    return (
        <div key={bed.id} className="mb-2 p-4 flex bg-[#DBE9FB] flex-col rounded-xl">
            <div>
                <Image
                    src={freeBed}
                    alt="Background"
                    objectFit="cover"
                    width={75}
                    height={75}
                />
            </div>
            <p className="text-xs">{bed.id}</p>
            <div className="flex text-xs gap-4 flex-row">
                <p className="text-xs">{availability}</p>
                <p>{bed.cost} kč</p>
            </div>
        </div>
    );
};

export default BedCard;