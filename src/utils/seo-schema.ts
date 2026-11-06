import { SITE, CREATOR } from '../config/site';

const SITE_URL = SITE.url;

export const PERSON_ID = `${SITE_URL}/#person`;
export const APP_ID = `${SITE_URL}/#app`;
export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

export const createPersonSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": PERSON_ID,
  "name": CREATOR.name,
  "url": `${SITE_URL}/about/zaid-husain`,
  "sameAs": [
    CREATOR.portfolio,
    CREATOR.linkedin,
    CREATOR.github,
    CREATOR.githubRepo
  ]
});

export const createOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": ORG_ID,
  "name": "Zashly",
  "url": "https://zashly.vercel.app/",
  "description": "Zashly is a growing ecosystem of modern digital products created by Zaid Husain, including ZashQr, Zashub, Zashio, and ZashBiz."
});

export const createWebSiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  "name": "ZashQr",
  "alternateName": "Zash QR",
  "url": SITE_URL,
  "description": "Free QR code generator and QR template designer with logo support, customization, and high-quality exports.",
  "publisher": { "@id": ORG_ID }
});

export const createSoftwareAppSchema = () => ({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "@id": APP_ID,
  "name": "ZashQr",
  "alternateName": "Zash QR",
  "url": SITE_URL,
  "applicationCategory": "DesignApplication",
  "operatingSystem": "Web",
  "description": "ZashQr is a free online QR code generator and template designer. Create, customize, and download high-quality QR codes with logo embedding, custom colors, patterns, and professional templates.",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "creator": { "@id": PERSON_ID },
  "author": { "@id": PERSON_ID },
  "publisher": { "@id": ORG_ID },
  "isPartOf": { "@id": WEBSITE_ID }
});

export const createProfilePageSchema = () => ({
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "url": `${SITE_URL}/about/zaid-husain`,
  "mainEntity": { "@id": PERSON_ID }
});

export const createFAQSchema = (faqs: { question: string; answer: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map((faq) => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
});

export const createBreadcrumbSchema = (items: { name: string; item: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.item
  }))
});
