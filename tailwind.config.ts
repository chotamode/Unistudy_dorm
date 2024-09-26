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
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "roomcardbg": 'url("/images/rommbg.png")',
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

      width:{
        '110': '25.75rem',
      },

      fontSize: {
        sm: ['1rem', '1.25rem'],
        base: ['1rem', '1.5rem'],
        lg: ['1rem', '1.3rem'],
        bold: ['1.2rem', '1.4rem'],
        xl: ['1.4rem', '1.75rem'],
        xxl:['1.6rem','1.9rem'],
        xxxl:['6rem','6.75rem'],
      }
    },
  },
  plugins: [],
};
export default config;
