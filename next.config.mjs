import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
      config.resolve.alias = {
        ...config.resolve.alias,
        // Map require('crypto') to the browser's native Web Crypto API
        // so that crypto.subtle.digest() works for Web3Auth's encryption
        crypto: path.resolve(__dirname, "src/lib/crypto-shim.js"),
        // MetaMask SDK tries to import React Native storage — stub it out
        "@react-native-async-storage/async-storage": false,
      };
    }
    config.externals.push("pino-pretty", "encoding");
    return config;
  },
  // Backend proxy is handled by src/app/api/backend/[...path]/route.ts
  // with session verification, NOT via rewrites (which bypass middleware).
};

export default nextConfig;
