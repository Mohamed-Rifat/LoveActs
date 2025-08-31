/** @type {import('tailwindcss').Config} */
export default {
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: { 
     fontFamily: {
        script: ["'Qwitcher Grypen'", "cursive"], 
        dancing: ['"Dancing Script"', 'cursive'],
      },},
  },
  plugins: [],
}

