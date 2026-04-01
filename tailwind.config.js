/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/presentation/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--bg-base)",
        foreground: "var(--text-primary)",
        brand: {
          focus: "#E85D3F",
          break: "#4ECCA3",
          long: "#6C8EBF",
        },
        surface: {
          base: "var(--bg-base)",
          card: "var(--bg-card)",
          elevated: "var(--bg-elevated)",
          input: "var(--bg-input)",
        },
        border: {
          default: "var(--border-default)",
          subtle: "var(--border-subtle)",
        },
      },
      fontFamily: {
        display: ["Sora", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      fontSize: {
        timer: ["72px", { lineHeight: "1", fontWeight: "500" }],
      },
      borderRadius: {
        pill: "999px",
        card: "20px",
      },
      boxShadow: {
        card: "var(--shadow-card)",
        "glow-focus": "0 0 40px rgba(232,93,63,0.15)",
        "glow-break": "0 0 40px rgba(78,204,163,0.15)",
        "glow-long": "0 0 40px rgba(108,142,191,0.15)",
      },
    },
  },
  plugins: [],
};
