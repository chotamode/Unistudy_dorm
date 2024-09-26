import React from "react";

interface Button2Props {
    children: React.ReactNode;
    className?: string;
}

const Button2 = ({
                     children,
                    className,
                 }: Button2Props) => {
    return (
        <button
            className={`px-8 py-3 rounded-xl text-xl inline-flex items-center justify-center bg-[#0F478D] text-white ${className}`}
        >
            {children}
        </button>
    );
};

export default Button2;