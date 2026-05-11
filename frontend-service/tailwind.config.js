export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}


// 1 npm create vite@latest my-react-app -- --template react-ts
// 2 npm install -D tailwindcss postcss autoprefixer

// 3 create filte tailwind.config.js
// export default {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//   ],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }

// 4 create postcss.config.js
// export default {
//   plugins: {
//     "@tailwindcss/postcss": {},
//     autoprefixer: {},
//   },
// }

// 5 include index.css @import "tailwindcss";

// 6 npm install -D @tailwindcss/postcss
