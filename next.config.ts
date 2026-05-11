import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    optimizePackageImports: ['framer-motion', 'lucide-react'],
  },
  async headers() {
    // Content Security Policy — strict but compatible with Next.js +
    // framer-motion + Cloudflare Turnstile (CAPTCHA) + Google Fonts.
    // Dev mode requires 'unsafe-eval' for React error overlay / sourcemaps.
    const isDev = process.env.NODE_ENV !== 'production';
    const devScriptExtras = isDev ? " 'unsafe-eval'" : '';

    const csp = [
      "default-src 'self'",
      // 'unsafe-inline' required for Next.js hydration + framer-motion animations
      // challenges.cloudflare.com required for Turnstile script
      `script-src 'self' 'unsafe-inline'${devScriptExtras} https://challenges.cloudflare.com`,
      // Google Fonts stylesheets
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: blob:",
      // Google Fonts font files
      "font-src 'self' data: https://fonts.gstatic.com",
      // Turnstile calls /siteverify and loads its widget from challenges.cloudflare.com
      "connect-src 'self' https://challenges.cloudflare.com",
      // Turnstile renders inside an iframe
      "frame-src https://challenges.cloudflare.com",
      "frame-ancestors 'none'",
      "form-action 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      'upgrade-insecure-requests',
    ].join('; ');

    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          { key: 'Content-Security-Policy', value: csp },
          {
            key: 'Permissions-Policy',
            value:
              'camera=(), microphone=(), geolocation=(), interest-cohort=(), payment=(), usb=(), magnetometer=(), accelerometer=(), gyroscope=()',
          },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
        ],
      },
    ];
  },
};

export default nextConfig;
