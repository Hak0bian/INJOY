/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        main: "#131621",
        secondary: '#292C35',
        btn : "#0677E8",
        black: "#141416",
        maintext: "#FFFFFF",
        graytext: "#9A9B9E"       
      },

      screens: {
        xs: '480px',
        smx: '740px',
        mdx: '900px'
      },
    },
  },
  plugins: [],
}