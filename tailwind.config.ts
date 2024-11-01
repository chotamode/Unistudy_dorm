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
                'bg-form-adaptive': "url('/images/form-adaptive-bg.svg')",
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
                'admin-large': '150px',
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
                'zfold': '280px',
                'phonese': '350px',
                'phonexs': '390px',
                'phone14': '430px',
                'phonepixel': '411px',

                'ipadmini': '768px',
                'tablet': '620px',
                'surface': '912px',
                'custom-tablet': '517px',

                'laptop': '1024px',

                'minibook': '1100px',

                'mdsuperbook': '1208px',

                'desktop': '1280px',

                'desktopxl': '1480px',

                'desktopxxl': '1670px',

                'medium-desktop': '1720px',

                'large-desktop': '2150px'
            },
        },
    },
    plugins: [],

};
export default config;
