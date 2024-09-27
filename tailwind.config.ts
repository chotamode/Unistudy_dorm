import type {Config} from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
                'bg-stage3': "url('/images/bg_stage3.svg')",
                'bg-mpage': "url('/images/mpage_hero.svg')",
            },
            fontFamily: {
                // montserrat: ["Montserrat", "sans-serif"],
                sans: ["Montserrat", "sans-serif"]
            },
            borderRadius: {
                DEFAULT: '4px',
                'large': '45px',
                'xl': '10px',
            }
        },
    },
    plugins: [],
};
export default config;
