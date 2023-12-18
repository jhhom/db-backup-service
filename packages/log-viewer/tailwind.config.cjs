/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        "o-sm": "0 0 2px 0 rgba(0, 0, 0, 0.05)",
        "o-md":
          "0 0 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        "o-lg":
          "0 0 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        "o-xl":
          "0 0 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        "o-2xl": "0 0 50px -12px rgba(0, 0, 0, 0.25)",
        "o-3xl": "0 0 60px -15px rgba(0, 0, 0, 0.3)",
      },
      animation: {
        "dialog-hide": "dialogContentHide 300ms ease-in forwards",
        "dialog-show": "dialogContentShow 300ms ease-out",
        "select-hide": "selectContentHide 250ms ease-in forwards",
        "select-show": "selectContentShow 250ms ease-out",
        "slide-down": "slideDown 300ms ease-out",
        "slide-up": "slideUp 300ms ease-out",
      },
      keyframes: {
        dialogContentShow: {
          from: {
            opacity: "0",
            transform: "scale(0.96)",
          },
          to: {
            opacity: "1",
            transform: "scale(1)",
          },
        },
        dialogContentHide: {
          from: {
            opacity: "1",
            transform: "scale(1)",
          },
          to: {
            opacity: "0",
            transform: "scale(0.96)",
          },
        },
        slideDown: {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-collapsible-content-height)",
          },
        },
        slideUp: {
          from: {
            height: "var(--radix-collapsible-content-height)",
          },
          to: {
            height: "0",
          },
        },
        selectContentShow: {
          from: {
            opacity: "0",
            transform: `translateY(-8px)`,
          },
          to: {
            opacity: "1",
            transform: `translateY(0)`,
          },
        },
        selectContentHide: {
          from: {
            opacity: "1",
            transform: `translateY(0)`,
          },
          to: {
            opacity: "0",
            transform: `translateY(-8px)`,
          },
        },
      },
    },
  },
  plugins: [],
};
