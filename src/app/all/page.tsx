"use client";

import React from 'react';
import { Plan } from '@/app/components/Plan';
import { plansMapping } from '@/app/components/Plan';

const AllRoomPlans: React.FC = () => {
    const roomIds = Object.keys(plansMapping);

    return (
        <div className="all-room-plans">
            {roomIds.map((roomId) => (
                <div key={roomId} className="room-plan h-[700px] border-gray-800 border-2">
                    {/*<h2 className="room-title">Room {roomId}</h2>*/}
                    <Plan id={Number(roomId)} beds={[]} />
                </div>
            ))}
        </div>
    );
};

export default AllRoomPlans;