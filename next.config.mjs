/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  webpack: (config, { isServer, webpack }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        canvas: false,
        fs: false,
        path: false,
        crypto: false,
        stream: false,
        http: false,
        https: false,
        zlib: false,
        url: false,
        util: false,
      };

      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(
          /^node:/,
          (resource) => {
            resource.request = resource.request.replace(/^node:/, "");
          }
        )
      );
    }
    // Handle canvas module externally
    config.externals.push({ canvas: 'canvas' });
    return config;
  },
};

export default nextConfig;
