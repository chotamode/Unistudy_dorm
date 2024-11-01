import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import maleIcon from '@/assets/sex/male.svg';
import femaleIcon from '@/assets/sex/female.svg';

interface IconSwitchProps {
    activeIndex: number;
    onClick: (gender: 'male' | 'female') => void;
}

const IconSwitch: React.FC<IconSwitchProps> = ({ activeIndex, onClick }) => {
    const [positions, setPositions] = useState<string[]>(['0rem', '0rem']);
    const buttonRefs = useRef<HTMLButtonElement[]>([]);
    const [buttonSize, setButtonSize] = useState({ width: 0, height: 0 });

    const handleClick = (index: number) => {
        onClick(index === 0 ? 'male' : 'female');
    };

    const updatePositionsAndSizes = () => {
        if (buttonRefs.current[0]) {
            const { offsetWidth, offsetHeight } = buttonRefs.current[0];
            setButtonSize({ width: offsetWidth, height: offsetHeight });
        }
        const newPositions = buttonRefs.current.map(button => `${button.offsetLeft}px`);
        setPositions(newPositions);
    };

    useEffect(() => {
        updatePositionsAndSizes();
        window.addEventListener('resize', updatePositionsAndSizes);
        return () => window.removeEventListener('resize', updatePositionsAndSizes);
    }, []);

    return (
        <div className="flex flex-col items-center">
            <h1 className="text-7xl font-normal text-black mb-8 text-center">
                {activeIndex === 0 ? 'Boys\' room' : 'Girls\' room'}
            </h1>
            <div
                className="rounded-3xl bg-white flex justify-center items-center w-[360px] h-[200px] laptop:w-[450px] laptop:h-[240px]"
                style={{ boxShadow: '0 0px 15px rgba(0, 0, 0, 0.4)' }}>
                <div className="relative flex mx-auto">
                    {['female', 'male'].map((gender, index) => (
                        <div key={gender}>
                            <button
                                ref={el => {
                                    buttonRefs.current[index] = el!;
                                }}
                                className="w-[120px] h-[120px] laptop:w-36 laptop:h-36 rounded-lg flex items-center justify-center relative transition-all duration-300 z-10"
                                onClick={() => handleClick(index)}
                            >
                                <Image src={gender === 'female' ? maleIcon : femaleIcon}
                                       alt={`Только для ${gender === 'male' ? 'мальчиков' : 'девочек'}`}
                                       className="w-full h-full p-6" />
                            </button>
                            <p className="text-lg font-normal text-center mt-4">
                                {gender === 'male' ? 'I\'m a girl' : 'I\'m a boy'}
                            </p>
                        </div>
                    ))}
                    <div
                        className="absolute top-0 rounded-3xl transition-transform duration-300 bg-white z-0"
                        style={{
                            boxShadow: '0 0px 15px rgba(0, 0, 0, 0.4)',
                            transform: `translateX(${positions[activeIndex]})`,
                            width: `${buttonSize.width}px`,
                            height: `${buttonSize.height}px`
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default IconSwitch;