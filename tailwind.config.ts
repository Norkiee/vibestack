import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-dm-sans)", "sans-serif"],
        serif: ["var(--font-newsreader)", "serif"],
      },
      colors: {
        primary: "var(--text-primary)",
        secondary: "var(--text-secondary)",
        muted: "var(--text-muted)",
        faint: "var(--text-faint)",
        ghost: "var(--text-ghost)",
        border: "var(--border-default)",
        "border-light": "var(--border-light)",
        "border-faint": "var(--border-faint)",
        "bg-page": "var(--bg-page)",
        "bg-hover": "var(--bg-hover)",
        "bg-pill": "var(--bg-pill)",
        "accent-green": "var(--accent-green)",
      },
      maxWidth: {
        page: "760px",
      },
      spacing: {
        "header-top": "44px",
        "search-top": "44px",
        "search-bottom": "28px",
        "pills-bottom": "28px",
        "footer-top": "52px",
      },
    },
  },
  plugins: [],
};

export default config;
