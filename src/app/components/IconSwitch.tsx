import React, { useState } from 'react';
import Image from 'next/image';
import maleIcon from '@/assets/sex/male.svg';
import femaleIcon from '@/assets/sex/female.svg';
import{motion} from 'framer-motion'

const IconSwitch = () => {
    const [activeIndex, setActiveIndex] = useState<number>(0);

    const handleClick = (index: number) => {
        setActiveIndex(index);
    };

    return (
        <div>
            <h1 className="lg:text-7xl md:text-6xl sm:text-5xl text-4xl font-normal text-black mb-8 text-center">
                {activeIndex === 0 ? 'Boys\' room' : 'Girls\' room'}
            </h1>
            <div
                className="relative rounded-3xl px-14 py-6 flex justify-center lg:space-x-8 md:space-x-12 bg-[#FEF9F6] w-fit mx-auto shadow-2xl mt-16"
                style={{boxShadow: '0 0px 30px rgba(0, 0, 0, 0.4)'}}>
                {['female', 'male'].map((gender, index) => (
                    <div key={gender}>
                        <button
                            className={`lg:w-36 lg:h-36 md:w-28 md:h-28 rounded-lg flex items-center justify-center relative transition-all duration-300 z-10`}
                            onClick={() => handleClick(index)}
                        >
                            <Image src={gender === 'female' ? maleIcon : femaleIcon}
                                   alt={`Только для ${gender === 'male' ? 'мальчиков' : 'девочек'}`}
                                   className="w-full h-full p-6"/>
                        </button>
                        <p className="text-lg font-normal text-center mt-4">
                            {gender === 'male' ? 'I\'m a girl' : 'I\'m a boy'}
                        </p>
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

export default IconSwitch;