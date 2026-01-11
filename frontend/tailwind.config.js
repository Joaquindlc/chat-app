import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    // IMPORTANTE: Pon "light" y "dark" explícitamente si quieres que existan
    themes: ["forest", "retro", "aqua", "pastel", "luxury", "light", "dark"], 
    darkTheme: "forest", 
    base: true,
    utils: true,
    logs: false,
    themeRoot: ":root", // Esto obliga a DaisyUI a poner las variables en el lugar correcto
  },
};