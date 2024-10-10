import type { Config } from "tailwindcss";

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
                'bgmpage': "url('/images/mpage_hero.svg')",
                "roomcardbg": 'url("/images/rommbg.png")',
                "roomcardmb": 'url("/images/room_mobile.svg")'

            },
            fontFamily: {
                // montserrat: ["Montserrat", "sans-serif"],
                sans: ["Montserrat", "sans-serif"]
            },
            borderRadius: {
                DEFAULT: '4px',
                'large': '45px',
                'xl': '10px',
                'xxl': '17px',
            },
            colors: {
                'main-text': '#A6D0FF',
            },
            minHeight: {
                '120': '30rem',
            },

            maxHeight:{
                'mlg': '21rem'
            },
            maxWidth:{
                '110': '25.75rem',
                'mlg': '23rem'
            },
            width:{
                '110': '25.75rem',
                'mlg': '23rem'
            },
            fontSize: {
                xs: ['0.7rem','0.9rem'],
                adxs:['0.9rem','1.1rem'],
                sm: ['1rem', '1.25rem'],
                base: ['1rem', '1.5rem'],
                lg: ['1rem', '1.3rem'],
                bold: ['1.2rem', '1.4rem'],
                xl: ['1.4rem', '1.75rem'],
                xxl:['1.6rem','1.9rem'],
                xxxl:['6rem','6.75rem'],
            },
            screens: {
                'phone': '500px',
                'phonexs': '390px',

                'tablet': '620px',
                // => @media (min-width: 640px) { ... }

                'laptop': '1024px',
                // => @media (min-width: 1024px) { ... }

                'minibook': '1100px',

                'desktop': '1280px',
                // => @media (min-width: 1280px) { ... }
                'large-desktop': '2150px'
            },
        },
    },
    plugins: [],

};
export default config;
