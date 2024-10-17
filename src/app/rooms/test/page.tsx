import React from 'react';
import backgroundSvg from '../../../assets/room_plans/sokol_plan1.svg';
import insideSvg from '../../../assets/beds/free_bed.svg';

const TestPage: React.FC = () => {
    return (
        <div className="relative w-full h-screen">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
                <image href={backgroundSvg.src} width="100%" height="100%" />
                <image href={insideSvg.src} x="20" y="30" width="10" height="10" />
                <image href={insideSvg.src} x="50" y="50" width="10" height="10" />
                <image href={insideSvg.src} x="70" y="80" width="10" height="10" />
            </svg>
        </div>
    );
};

export default TestPage;