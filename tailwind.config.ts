import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: "#1E4D2B",
        ink: "#0F2A1A",
        sun: "#E08A1E",
        sand: "#F2EADA",
        bone: "#FBF8F1",
      },
      fontFamily: {
        heading: ["var(--font-outfit)", "sans-serif"],
        body: ["var(--font-source-sans)", "sans-serif"],
      },
      borderRadius: {
        control: "8px",
        card: "14px",
      },
    },
  },
  plugins: [],
};

export default config;

