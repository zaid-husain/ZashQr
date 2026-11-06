import React from 'react';
import { Helmet } from 'react-helmet-async';
import { SITE } from '../../config/site';

interface SEOProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  ogImage?: string;
  structuredData?: Record<string, any> | Record<string, any>[];
  type?: 'website' | 'article';
}

export const SEO: React.FC<SEOProps> = ({
  title = 'ZashQr – Free QR Code Generator',
  description = 'ZashQr is a free online QR code generator that lets you create, customize, and download beautiful QR codes. Design QR posters, flyers, business cards, menus, invitations, and more with professional templates. Built by Zashly.',
  canonicalUrl,
  ogImage = SITE.ogImage,
  structuredData,
  type = 'website'
}) => {
  const url = canonicalUrl || SITE.url;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="ZashQr" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={ogImage} />

      {/* Canonical Link */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Structured Data (JSON-LD) */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};
