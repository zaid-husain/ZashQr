export const createOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Zashly",
  "url": "https://qrstudio.zashly.com",
  "logo": "https://qrstudio.zashly.com/logo.png",
  "sameAs": [
    "https://github.com/zashly"
  ]
});

export const createSoftwareAppSchema = () => ({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "QR Studio",
  "operatingSystem": "Web",
  "applicationCategory": "DesignApplication",
  "description": "Free online QR code generator that lets you create, customize, and download beautiful QR codes.",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "author": {
    "@type": "Organization",
    "name": "Zashly"
  }
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
