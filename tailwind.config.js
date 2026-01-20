import lineClamp from "@tailwindcss/line-clamp";

export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      boxShadow: {
        soft: "0 20px 45px -30px rgba(15, 23, 42, 0.35)",
        luxe: "0 22px 70px -40px rgba(15, 23, 42, 0.45)"
      }
    }
  },
  plugins: [lineClamp]
};
