export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    extend: {
      colors: {
        primary: "#7c3aed",
        success: "#22c55e", 
        background: "#09090b",
        card: "#18181b",
        border: "#27272a",

        background: "#09090b",
        card: "#18181b",
        border: "#27272a",

        surface: "#111111",
        muted: "#71717a",
        
 
      },

      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },

      boxShadow: {
        card: "0 4px 20px rgba(0,0,0,0.25)",
      },

      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },

  plugins: [],
};