import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: 'var(--bg-primary)',
          secondary: 'var(--bg-secondary)',
          tertiary: 'var(--bg-tertiary)',
          card: 'var(--bg-card)',
          sidebar: 'var(--bg-sidebar)',
          hover: 'var(--bg-hover)',
          active: 'var(--bg-active)',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          tertiary: 'var(--text-tertiary)',
          inverse: 'var(--text-inverse)',
        },
        border: {
          primary: 'var(--border-primary)',
          secondary: 'var(--border-secondary)',
        },
        accent: {
          blue: 'var(--accent-blue)',
          'blue-light': 'var(--accent-blue-light)',
          'blue-dark': 'var(--accent-blue-dark)',
          green: 'var(--accent-green)',
          'green-light': 'var(--accent-green-light)',
          amber: 'var(--accent-amber)',
          'amber-light': 'var(--accent-amber-light)',
          red: 'var(--accent-red)',
          'red-light': 'var(--accent-red-light)',
          purple: 'var(--accent-purple)',
          'purple-light': 'var(--accent-purple-light)',
        },
      },
      boxShadow: {
        'card': 'var(--shadow-sm)',
        'card-hover': 'var(--shadow-md)',
        'elevated': 'var(--shadow-lg)',
      },
      borderRadius: {
        'card': 'var(--radius)',
        'card-lg': 'var(--radius-lg)',
        'card-xl': 'var(--radius-xl)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
