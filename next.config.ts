const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
})

// next.config.js
module.exports = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,  // เลิกหยุด build เมื่อเจอ error ของ ESLint
  },
};