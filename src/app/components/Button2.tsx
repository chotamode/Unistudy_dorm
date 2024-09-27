import React from "react";

interface Button2Props {
    children: React.ReactNode;
    className?: string;
    color?: string;
}

const Button2 = ({
                     children,
                    className,
    color='bg-[#0F478D]',
                 }: Button2Props) => {
    return (
        <button
            className={`px-8 py-3 rounded-xl text-xl inline-flex items-center justify-center ${color} text-white ${className}`}
        >
            {children}
        </button>
    );
};

export default Button2;