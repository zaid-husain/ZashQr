/**
 * Centralized site & brand configuration.
 * Update URLs here — they propagate to SEO metadata, schema, footer, and pages.
 */

export const SITE = {
  name: 'ZashQr',
  url: 'https://zashqr.vercel.app',
  repo: 'https://github.com/zaid-husain/ZashQr',
  ogImage: 'https://zashqr.vercel.app/og-image.svg'
} as const;

export const CREATOR = {
  name: 'Zaid Husain',
  portfolio: 'https://www.zaidhusain.me/',
  linkedin: 'https://www.linkedin.com/in/zaid-husain/',
  github: 'https://github.com/zaid-husain/',
  githubRepo: 'https://github.com/zaid-husain/ZashQr'
} as const;

/**
 * Temporary destination for "Zashly Ecosystem" links while the dedicated
 * ecosystem website is under development. Replace with the official URL
 * when it launches.
 */
export const ECOSYSTEM_URL = CREATOR.portfolio;

export const ECOSYSTEM_PRODUCTS = [
  { name: 'Zashly', tagline: 'Real-Time Chat & Social Networking', url: 'https://zashly.vercel.app/' },
  { name: 'Zashub', tagline: 'Local Community Platform', url: 'https://zashub.vercel.app/' },
  { name: 'Zashio', tagline: 'AI-Powered Campus Placement & Recruitment', url: 'https://zashio.vercel.app/' },
  { name: 'ZashBiz', tagline: 'AI-Powered Shop Management System', url: 'https://zashbiz.vercel.app/' },
  { name: 'ZashQr', tagline: 'QR Code Generator & Template Designer', url: SITE.url, internal: true }
] as const;
