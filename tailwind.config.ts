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
      colors: {
        'aiesec-blue': '#037EF3',
        'gv-red': '#F85A40',
        'gte-orange': '#F48924',
        'gta-green': '#0CB9C1',
        'white': '#FFFFFF',
        'gray': '#555',
        'light-gray': '#F5F5F5',
        'green': '#00c16e',
        'red': '#F85A40',
        'yellow': '#ffc845',
      }
    },
  },
  plugins: [],
};
export default config;
