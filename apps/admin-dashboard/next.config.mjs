/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración recomendada para producción
  reactStrictMode: true,
  
  // Solo activa estas líneas si tienes muchos errores y quieres deploy rápido (no recomendado a largo plazo)
  // typescript: { ignoreBuildErrors: true },
  // eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
