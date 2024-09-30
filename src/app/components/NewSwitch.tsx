import{motion} from 'framer-motion'
import React, { useState } from 'react';
import classNames from "classnames";
import maleIcon from '@/assets/sex/male.svg';
import femaleIcon from '@/assets/sex/female.svg';


const GenderSwitch = () => {
    const [isMale, setIsMale] = useState<boolean>(false); // По умолчанию — мужчина

    const handleToggle = () => {
        setIsMale(prevIsMale => !prevIsMale); // Меняем состояние на противоположное
    };

    {
        return (
            <div className="flex justify-center items-center flex-col">
                <h1
                    className="lg:text-7xl md:text-6xl sm:text-5xl text-4xl font-normal text-black  text-center">
                    {isMale ? 'Boys\' room' : 'Girls\' room'}
                </h1>

                <div
                    className={classNames(
                        "rounded-3xl  py-6 flex h-52 w-[452px] items-center bg-[#FEF9F6] mx-auto shadow-2xl mt-16",
                    )}
                >

                    <div className={classNames(
                        " flex items-center gap-20 px-5 mx-10 h-full w-full bg-red-400",
                        {
                            "justify-end": isMale, "justify-start": !isMale
                        })}>

                        <motion.div
                            onClick={handleToggle}
                            className={classNames(
                            "bg-amber-500 h-32 w-32"

                        )}>
                        </motion.div >

                        <motion.div
                            onClick={handleToggle}
                            className={classNames(
                            "bg-amber-500 h-32 w-32"
                        )}>
                        </motion.div>

                        <motion.div className="absolute h-32 w-32 bg-black">

                        </motion.div>

                    </div>

                </div>
                </div>
                );

                }
                }

                export default GenderSwitch;