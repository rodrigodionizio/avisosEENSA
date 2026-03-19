/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removido output: 'export' para permitir rotas dinâmicas (/aviso/[id])
  trailingSlash: false,
  images: { unoptimized: true },
};

module.exports = nextConfig;
