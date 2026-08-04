import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Canonical and Open Graph tags need an absolute URL, and hard-coding one is how
 * they end up pointing at the wrong place. Resolve it at build time instead:
 *   1. VITE_SITE_URL, if you set it explicitly
 *   2. the production domain Vercel injects into its own builds
 *   3. localhost, for `npm run dev`
 */
function resolveSiteUrl() {
  if (process.env.VITE_SITE_URL) return process.env.VITE_SITE_URL.replace(/\/$/, '')
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  }
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return 'http://localhost:5173'
}

function siteUrlPlugin() {
  const siteUrl = resolveSiteUrl()
  return {
    name: 'inject-site-url',
    transformIndexHtml(html) {
      return html.replaceAll('__SITE_URL__', siteUrl)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), siteUrlPlugin()],
})
