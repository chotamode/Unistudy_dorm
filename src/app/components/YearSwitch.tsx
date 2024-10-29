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

            <div className=" flex justify-center items-center mt-8 w-[360px] h-[60px] laptop:w-[450px] laptop:h-[110px] rounded-2xl laptop:rounded-3xl"
                style={{boxShadow: '0 0px 30px rgba(0, 0, 0, 0.4)'}}>

                <div className="relative flex mx-auto">
                    {[currentYear, nextYear].map((year, index) => (
                        <div key={year}>
                            <button
                                ref={el => buttonRefs.current[index] = el!}
                                className="rounded-lg flex items-center justify-center relative transition-all duration-300 z-10 w-40"
                                onClick={() => onClick(index === 0 ? currentYear : nextYear)}
                            >
                                <span className="laptop:p-3 laptop:text-2xl">{`${year} • ${year + 1}`}</span>
                            </button>
                        </div>
                    ))}
                    <div
                        className="absolute top-0 rounded-lg laptop:rounded-xl transition-transform duration-300 bg-[#FEF9F6] z-0"
                        style={{
                            boxShadow: '0 0px 30px rgba(0, 0, 0, 0.4)',
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

export default YearSwitch;