/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        // Custom Text Color
        textYellow: "#FCC40D",
        loaderGray: "#9CA3AF",
        loaderWhite: "#ffffff",
        // Custom Background Color
        bgGameTab: "#4F557759",
        bgYellow: "#FCC40D",
        background: "hsl(var(--background))",
        componentBgPrimary: "#222843",
        componentBgSecondary: "#243254",
        redBgColor: "#91001F99",
        backgroundSecondaryColor: "#C9A33D",
        backgroundV2Color: "#ffe116",
        formBgColor: "rgba(255, 255, 255, 0.3)",
        AffiliatePrimaryBg: "#212335",
        bottomNavBgColor: "#2a3254",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          primaryColorTwo: "#191e32",
          primaryColor: "#111421",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        textSecondaryColor: "#C9A33D",
        textSecondaryColorTwo: "#d7b533",
        textSecondaryColorThree: "#ffe116",
        textRedColor: "#ff086b",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
      },
      backgroundImage: {
        tabGradient: "linear-gradient(10deg, #ffffff 0%, #ffff7f 100%)",
        "white-to-darkblue":
          "linear-gradient(to right, #2a3254 0%, #445187 15%, #445187 30%, #2a3254 55%, #2a3254 100%)",
        "white-to-gold":
          "linear-gradient(to right, rgba(255,255,255,0.2), #C9A33Dcc)",
        "gold-gradient":
          "linear-gradient(to right, #d4b665, #a46c0d 50%, #C9A33D)",
      },
    },
  },

  plugins: [],
};
