import React from "react";

interface ButtonProps {
    backgroundColor: string;
    textColor: string;
    children: React.ReactNode;
    textSize: string;
}

const Button = ({
    backgroundColor,
    textColor,
    textSize,
    children
}: ButtonProps) => {
    return (
        <button
            className={`px-12 py-2 rounded-full h-fit ${backgroundColor} ${textColor} inline-flex items-center justify-center text-${textSize}`}
        >
            {children}
        </button>
    );
};

export default Button;