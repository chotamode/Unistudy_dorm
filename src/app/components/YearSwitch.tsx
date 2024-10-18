import React, { useState } from 'react';

const YearSwitch = () => {
    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;
    const [activeIndex, setActiveIndex] = useState<number>(0);

    const handleClick = (index: number) => {
        setActiveIndex(index);
    };

    return (
        <div>
            <div
                className="relative rounded-3xl px-14 py-6 flex justify-center lg:space-x-8 md:space-x-12 bg-[#FEF9F6] w-fit mx-auto shadow-2xl mt-16"
                style={{boxShadow: '0 0px 30px rgba(0, 0, 0, 0.4)'}}>
                {[currentYear, nextYear].map((year, index) => (
                    <div key={year}>
                        <button
                            className={`lg:w-36 lg:h-36 md:w-28 md:h-28 rounded-lg flex items-center justify-center relative transition-all duration-300 z-10`}
                            onClick={() => handleClick(index)}
                        >
                            <span className="text-2xl">{year}</span>
                        </button>
                    </div>
                ))}
                <div
                    className="absolute lg:mt-6 md:mt-8 top-0 lg:w-36 lg:h-36 md:w-28 md:h-28 rounded-3xl transition-transform duration-300 bg-[#FEF9F6] z-0 p-12"
                    style={{
                        boxShadow: '0 0px 30px rgba(0, 0, 0, 0.4)',
                        transform: `translateX(calc(${activeIndex} * 11rem - 6.5rem))`
                    }}
                />
            </div>
        </div>
    );
};

export default YearSwitch;