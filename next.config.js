/** @type {import('next').NextConfig} */
module.exports = {
  experimental: {
    // The submit API reads these files from disk at runtime; make sure Vercel ships them.
    outputFileTracingIncludes: {
      '/api/submit': ['./public/belgeler/**/*', './lib/fonts/**/*'],
    },
  },
};
