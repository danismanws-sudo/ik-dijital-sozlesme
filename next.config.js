const { execSync } = require('child_process');
const { version } = require('./package.json');

// Shown at the bottom of the form so it is easy to tell which build is live.
// Vercel provides the commit; locally it is read from git.
const commit = (() => {
  if (process.env.VERCEL_GIT_COMMIT_SHA) return process.env.VERCEL_GIT_COMMIT_SHA.slice(0, 7);
  try {
    return execSync('git rev-parse --short HEAD').toString().trim();
  } catch {
    return 'yerel';
  }
})();
const builtAt = new Intl.DateTimeFormat('tr-TR', {
  timeZone: 'Europe/Istanbul',
  dateStyle: 'short',
  timeStyle: 'short',
}).format(new Date());

/** @type {import('next').NextConfig} */
module.exports = {
  env: {
    NEXT_PUBLIC_BUILD_INFO: `v${version} · ${commit} · ${builtAt}`,
  },
  experimental: {
    // The submit API reads these files from disk at runtime; make sure Vercel ships them.
    outputFileTracingIncludes: {
      '/api/submit': ['./public/belgeler/**/*', './lib/fonts/**/*'],
    },
  },
};
