import React, { useState, useRef, useEffect } from 'react';

interface YearSwitchProps {
    activeIndex: number;
    onClick: (year: number) => void;
}

const YearSwitch: React.FC<YearSwitchProps> = ({ activeIndex, onClick }) => {
    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;
    const [positions, setPositions] = useState<string[]>(['0rem', '0rem']);
    const buttonRefs = useRef<HTMLButtonElement[]>([]);
    const [buttonSize, setButtonSize] = useState({ width: 0, height: 0 });

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
            <div
                className="relative rounded-3xl flex bg-[#FEF9F6] w-fit mx-auto shadow-2xl mt-16"
                style={{ boxShadow: '0 0px 30px rgba(0, 0, 0, 0.4)' }}>
                {[currentYear, nextYear].map((year, index) => (
                    <div key={year}>
                        <button
                            ref={el => buttonRefs.current[index] = el!}
                            className="rounded-lg flex items-center justify-center relative transition-all duration-300 z-10 w-40"
                            onClick={() => onClick(index === 0 ? currentYear : nextYear)}
                        >
                            <span className="text-2xl">{`${year} • ${year + 1}`}</span>
                        </button>
                    </div>
                ))}
                <div
                    className="absolute top-0  rounded-3xl transition-transform duration-300 bg-[#FEF9F6] z-0"
                    style={{
                        boxShadow: '0 0px 30px rgba(0, 0, 0, 0.4)',
                        transform: `translateX(${positions[activeIndex]})`,
                        width: `${buttonSize.width}px`,
                        height: `${buttonSize.height}px`
                    }}
                />
            </div>
        </div>
    );
};

export default YearSwitch;