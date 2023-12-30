import type { Config } from "tailwindcss";
const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");

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
    },
    fontFamily: {
      sans: ["Poppins", ...defaultTheme.fontFamily.sans],
    },
    colors: {
      transparent: "transparent",
      current: "currentColor",
      black: colors.black,
      zinc: colors.zinc,
      dark: colors.dark,
      indigo: colors.indigo,
      red: colors.red,
      emerald: colors.emerald,
      white: "#ffffff",
      stone: { 300: "#9A9AA1", },
      

      blue: {
        600: "#6174EE",
        700: "#4A5BC6",
      },
      gray: {
        100: "#FBFBFF",
        200: "#E5E9FF",
        300: "#C5C1C1",
        400: "#908B8B",
        500: "#656675",
        600: "#707290",
      },
    },
  },
  plugins: [],
};
export default config;