const isProd = process.env.NODE_ENV === 'production';
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true, // Disable default image optimization
  },
  assetPrefix: isProd ? '/red-black/' : '',
  basePath: isProd ? '/red-black' : '',
  output: 'export'
};

export default nextConfig;
