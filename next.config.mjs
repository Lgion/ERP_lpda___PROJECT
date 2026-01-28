/** @type {import('next').NextConfig} */
const nextConfig = {
    distDir: '.next',
    webpack: (config, { isServer }) => {
        if (isServer) {
            config.resolve.fallback = {
                ...config.resolve.fallback,
                crypto: false, // Fix for edge runtime
                stream: false,
                util: false
            };
        }
        return config;
    },
    // experimental: {
    //     nodeMiddleware: true,
    // },
};

export default nextConfig;
