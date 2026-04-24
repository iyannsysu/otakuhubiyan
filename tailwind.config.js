/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#0a0a14",
          soft: "#11111e",
          card: "#161627",
          elevated: "#1d1d33",
        },
        brand: {
          DEFAULT: "#ff3d8a",
          50: "#fff0f6",
          100: "#ffd5e6",
          200: "#ffadcc",
          300: "#ff7fae",
          400: "#ff5398",
          500: "#ff3d8a",
          600: "#e02274",
          700: "#a8195a",
          800: "#741140",
          900: "#3f0922",
        },
        accent: {
          DEFAULT: "#7c5cff",
          400: "#9b85ff",
          500: "#7c5cff",
          600: "#5e3eea",
        },
      },
      fontFamily: {
        display: ["'Plus Jakarta Sans'", "system-ui", "sans-serif"],
        body: ["'Inter'", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 40px -10px rgba(255, 61, 138, 0.55)",
        soft: "0 10px 30px -10px rgba(0,0,0,0.5)",
      },
      backgroundImage: {
        "hero-grad":
          "radial-gradient(60% 80% at 20% 10%, rgba(124,92,255,0.35), transparent 60%), radial-gradient(50% 70% at 90% 20%, rgba(255,61,138,0.35), transparent 65%), linear-gradient(180deg,#0a0a14 0%,#0a0a14 100%)",
      },
      keyframes: {
        floaty: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
      },
      animation: {
        floaty: "floaty 4s ease-in-out infinite",
        shimmer: "shimmer 1.6s linear infinite",
      },
    },
  },
  plugins: [],
};
