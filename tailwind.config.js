/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        seccondColor: "#48ACF0",
        thirdColor: "#93A3BC",
      },
    },
    plugins: [
      function ({ addUtilities }) {
        addUtilities({
          ".text-shadow-red": {
            textShadow: "2px 2px 10px rgba(251, 44, 54, 0.8)",
          },
          ".text-shadow-yellow": {
            textShadow: "2px 2px 10px rgba(, 177, 0, 0.8)",
          },
          ".text-shadow-green": {
            textShadow: "2px 2px 10px rgba(0, 201, 81, 0.8)",
          },
        });
      },
    ],
  },
};
