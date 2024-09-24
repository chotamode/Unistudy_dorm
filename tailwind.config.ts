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
      },
      fontFamily: {
        // montserrat: ["Montserrat", "sans-serif"],
        sans: ["Montserrat", "sans-serif"]
      },
      borderRadius: {
        DEFAULT: '4px',
        'large': '45px',
        'xl': '10px',
      },
      fontSize: {
        sm: ['14px', '20px'],
        base: ['16px', '24px'],
        lg: ['17px', '21px'],
        bold: ['18.5px', '22.5px'],
        xl: ['23px', '28px'],
        xxl:['25px','30.5px']
      }
    },
  },
  plugins: [],
};
export default config;
