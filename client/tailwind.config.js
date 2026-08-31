/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./utils/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "var(--bg)",
        nav: "var(--nav-bg)",
        surface: {
          DEFAULT: "var(--surface)",
          sunken: "var(--surface-sunken)",
          accent: "var(--surface-accent)",
        },
        hairline: {
          DEFAULT: "var(--border)",
          strong: "var(--border-strong)",
        },
        rule: "var(--rule)",
        ink: {
          DEFAULT: "var(--text)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
          faint: "var(--text-faint)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          ink: "var(--accent-ink)",
          border: "var(--accent-border)",
        },
        danger: {
          DEFAULT: "var(--danger)",
          bg: "var(--danger-bg)",
          border: "var(--danger-border)",
          solid: "var(--danger-solid)",
          "solid-ink": "var(--danger-solid-ink)",
        },
      },
      fontFamily: {
        sans: ["var(--font-sora)", "ui-sans-serif", "system-ui", "sans-serif"],
        sora: ["var(--font-sora)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-plex-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      borderRadius: {
        sm: "6px",
        DEFAULT: "7px",
        md: "8px",
        lg: "10px",
        xl: "12px",
      },
      boxShadow: {
        menu: "var(--shadow-menu)",
        dialog: "var(--shadow-dialog)",
        tile: "var(--shadow-tile)",
      },
      maxWidth: {
        hero: "880px",
        generate: "940px",
        library: "1060px",
        prose: "840px",
        subscription: "620px",
      },
      spacing: {
        4.5: "18px",
        5.5: "22px",
        6.5: "26px",
        13: "52px",
        19: "76px",
        23: "92px",
      },
      transitionTimingFunction: {
        flip: "cubic-bezier(0.2, 0.8, 0.2, 1)",
      },
    },
  },
  plugins: [],
};
