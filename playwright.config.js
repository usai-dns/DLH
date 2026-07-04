const { defineConfig } = require('@playwright/test');

// PW_BASE_URL lets the same contract suite run against any card URL:
//   local public/ (default), a template dir, or a deployed card at /{slug}/.
// When PW_BASE_URL is set, no local server is started.
const baseURL = process.env.PW_BASE_URL || 'http://localhost:8080';

// Remote targets in sandboxed environments may require an egress proxy.
const proxyServer = process.env.PW_BASE_URL && !/localhost|127\.0\.0\.1/.test(baseURL)
  ? process.env.HTTPS_PROXY || process.env.https_proxy
  : undefined;

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30000,
  use: {
    baseURL,
    headless: true,
    screenshot: 'only-on-failure',
    ...(proxyServer ? { proxy: { server: proxyServer }, ignoreHTTPSErrors: true } : {}),
  },
  webServer: process.env.PW_BASE_URL
    ? undefined
    : {
        command: 'npx serve public -l 8080',
        port: 8080,
        reuseExistingServer: true,
      },
});
