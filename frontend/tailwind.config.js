/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*/.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    dark: '#062d1a',
                    emerald: '#0c4a28',
                    red: '#4a0c0c',
                }
            }
        },
    },
    plugins: [],
}