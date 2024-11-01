import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import freeBed from '../../assets/beds/free_bed.svg';
import { getBedsByRoomId } from '@/app/api/rooms';

interface Bed {
    id: number;
    occupied: boolean;
    cost: number;
}

interface BedCardProps {
    bed: Bed;
    year: number;
    roomId: number;
}

const BedCard: React.FC<BedCardProps> = ({ bed, year, roomId }) => {
    const [availability, setAvailability] = useState<string | null>(null);

    useEffect(() => {
        const fetchAvailability = async () => {
            const beds = await getBedsByRoomId(roomId, year);
            const currentBed = beds.find(b => b.id === bed.id);
            console.log("currentBed", currentBed);
            if (currentBed) {
                const freePeriod = currentBed.availability;
                setAvailability(freePeriod ? freePeriod : 'Not available');
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
            <div className="flex text-xs gap-4 flex-row mt-4">
                <p className="text-xs">{availability}</p>
                <p>{bed.cost} kč</p>
            </div>
        </div>
    );
};

export default BedCard;