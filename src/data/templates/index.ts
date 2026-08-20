import type { CategoryType, TemplateDocument } from '../../types/template';
import { flyerTemplates } from './flyers';
import { posterTemplates } from './posters';
import { businessCardTemplates } from './businessCards';
import { restaurantTemplates } from './restaurant';
import { invitationTemplates } from './invitations';
import { marketingSalesTemplates } from './marketingSales';
import { productTemplates } from './products';
import { socialMediaTemplates } from './socialMedia';
import { resumePortfolioTemplates } from './resumesPortfolios';
import { tableStickerTemplates } from './tablesStickers';
import { certificateCouponTemplates } from './certificatesCoupons';
import { realEstateHealthcareTemplates } from './realEstateHealthcare';
import { megaTemplates } from './megaTemplates';

export const ALL_CATEGORIES: CategoryType[] = [
  'Flyers',
  'Posters',
  'Business Cards',
  'Restaurant Menu',
  'Cafe & Bakery',
  'Event Invitation',
  'Wedding Invitation',
  'Birthday Invitation',
  'Marketing & Sales',
  'Product Label',
  'Product Packaging',
  'Instagram Post',
  'Instagram Story',
  'WhatsApp Poster',
  'Facebook Post',
  'LinkedIn Banner',
  'YouTube Thumbnail',
  'Resume QR',
  'Portfolio QR',
  'Education & School',
  'Certificate',
  'Healthcare & Clinic',
  'Travel & Hotel',
  'Retail & Tags',
  'Table Tent',
  'QR Sticker',
  'Coupon',
  'Tickets & Passes'
];

// Deduplicate templates by ID
const rawTemplates: TemplateDocument[] = [
  ...flyerTemplates,
  ...posterTemplates,
  ...businessCardTemplates,
  ...restaurantTemplates,
  ...invitationTemplates,
  ...marketingSalesTemplates,
  ...productTemplates,
  ...socialMediaTemplates,
  ...resumePortfolioTemplates,
  ...tableStickerTemplates,
  ...certificateCouponTemplates,
  ...realEstateHealthcareTemplates,
  ...megaTemplates
];

const templateMap = new Map<string, TemplateDocument>();
rawTemplates.forEach(template => {
  if (!templateMap.has(template.id)) {
    templateMap.set(template.id, template);
  }
});

export const ALL_TEMPLATES: TemplateDocument[] = Array.from(templateMap.values());

export const getTemplateById = (id: string): TemplateDocument | undefined => {
  return ALL_TEMPLATES.find(t => t.id === id);
};

export const getTemplatesByCategory = (category: CategoryType): TemplateDocument[] => {
  return ALL_TEMPLATES.filter(t => t.category === category);
};
