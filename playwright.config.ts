import { defineConfig } from '@playwright/test'

const PORT = 4318
// Uses the system Chrome; set CHROME_PATH to override. SwiftShader gives WebGL in headless CI.
const launchOptions = {
  executablePath: process.env.CHROME_PATH ?? '/usr/bin/google-chrome',
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
}

export default defineConfig({
  testDir: 'e2e',
  timeout: 30_000,
  // Every browser renders the WebGL formation on the CPU (SwiftShader); a few at a time keeps timings honest.
  workers: 2,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  reporter: 'list',
  use: { baseURL: `http://localhost:${PORT}`, launchOptions },
  projects: [
    { name: 'laptop', use: { viewport: { width: 1440, height: 900 } } },
    { name: 'phone', use: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true } },
  ],
  webServer: {
    command: `npm run build && npx vite preview --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: false,
    timeout: 120_000,
  },
})
