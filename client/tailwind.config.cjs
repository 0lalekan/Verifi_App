/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      brand: {
          50: '#ecfdf5',
          100: '#d1fae5',
          400: '#34d399', // <--- Added this line (Emerald 400)
          500: '#10b981', // Emerald 500
          600: '#059669',
          900: '#064e3b',
          glow: '#34d399',
        },

      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Cabinet Grotesk', 'Inter', 'sans-serif'], // Suggestion: Add a display font later
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        // Custom Verifi Brand Colors
        brand: {
          50: '#ecfdf5',
          100: '#d1fae5',
          500: '#10b981', // Emerald
          600: '#059669',
          900: '#064e3b',
          glow: '#34d399',
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      backgroundImage: {
        'gradient-mesh': "radial-gradient(at 40% 20%, hsla(150,100%,90%,0.3) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(220,100%,90%,0.3) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(300,100%,90%,0.3) 0px, transparent 50%)",
        'gradient-mesh-dark': "radial-gradient(at 40% 20%, hsla(150,100%,10%,0.3) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(220,100%,10%,0.3) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(300,100%,10%,0.3) 0px, transparent 50%)",
      },
      animation: {
        'accordion-down': "accordion-down 0.2s ease-out",
        'accordion-up': "accordion-up 0.2s ease-out",
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
};