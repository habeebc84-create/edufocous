/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#3B82F6", // Electric Blue
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#8B5CF6", // Violet
          foreground: "#FFFFFF",
        },
        dark: {
          navy: "#0F172A", // Deep Navy
          charcoal: "#1E293B", // Charcoal
          surface: "rgba(30, 41, 59, 0.7)", // Glassmorphism
        },
        accent: {
          blue: "#60A5FA",
          violet: "#A78BFA",
        }
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
      }
    },
  },
  plugins: [],
}
