/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Custom Text Color
        textYellow: "#FCC40D",
        loaderGray:"#9CA3AF",
        loaderWhite:"#ffffff",
        // Custom Background Color
        bgGameTab:"#4F557759",
        bgYellow: "#FCC40D",
      },
      // Custom Background Images
      backgroundImage: {
        // 'gradient-gold': 'linear-gradient(to right, #ffd700, #ffa500)'
        tabGradient:"linear-gradient(10deg, #ffffff 0%, #ffff7f 100%)"
      },
    },
  },
  plugins: [],
};
