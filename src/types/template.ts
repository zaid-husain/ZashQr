import type { QRType, ModuleStyle, FinderStyle } from './index';
export type { QRType, ModuleStyle, FinderStyle };

export type CategoryType =
  | 'Flyers'
  | 'Posters'
  | 'Business Cards'
  | 'Restaurant Menu'
  | 'Cafe & Bakery'
  | 'Event Invitation'
  | 'Wedding Invitation'
  | 'Birthday Invitation'
  | 'Concert & Festival'
  | 'Corporate & Conference'
  | 'Marketing & Sales'
  | 'Product Label'
  | 'Product Packaging'
  | 'Instagram Post'
  | 'Instagram Story'
  | 'WhatsApp Poster'
  | 'Facebook Post'
  | 'LinkedIn Banner'
  | 'YouTube Thumbnail'
  | 'Resume QR'
  | 'Portfolio QR'
  | 'Education & School'
  | 'Certificate'
  | 'Real Estate'
  | 'Healthcare & Clinic'
  | 'Travel & Hotel'
  | 'Retail & Tags'
  | 'Table Tent'
  | 'QR Sticker'
  | 'Coupon'
  | 'Tickets & Passes';

export type TemplateStyle =
  | 'Minimal'
  | 'Corporate'
  | 'Modern'
  | 'Creative'
  | 'Luxury'
  | 'Bold'
  | 'Retro'
  | 'Vintage'
  | 'Elegant'
  | 'Dark'
  | 'Light'
  | 'Colorful'
  | 'Glassmorphism'
  | 'Monochrome'
  | 'Geometric'
  | 'Editorial'
  | 'Abstract'
  | 'Tech';

export type ShapeType =
  | 'rectangle'
  | 'rounded-rectangle'
  | 'circle'
  | 'line'
  | 'triangle'
  | 'hexagon'
  | 'star'
  | 'blob'
  | 'badge';

export type ElementType = 'text' | 'qr' | 'shape' | 'icon' | 'image';

export interface BaseElement {
  id: string;
  type: ElementType;
  name: string;
  x: number; // in pixels relative to canvas
  y: number; // in pixels relative to canvas
  width: number;
  height: number;
  rotation: number; // in degrees 0-360
  opacity: number; // 0 to 1
  zIndex: number;
  isLocked?: boolean;
  isHidden?: boolean;
  shadow?: {
    color: string;
    blur: number;
    offsetX: number;
    offsetY: number;
  };
}

export interface TextElement extends BaseElement {
  type: 'text';
  text: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: '300' | '400' | '500' | '600' | '700' | '800' | '900';
  fontStyle?: 'normal' | 'italic';
  color: string;
  textAlign: 'left' | 'center' | 'right' | 'justify';
  lineHeight: number; // e.g. 1.2
  letterSpacing?: number; // in px
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  backgroundColor?: string; // background badge/highlight
  padding?: number;
  borderRadius?: number;
  strokeColor?: string;
  strokeWidth?: number;
}

export interface QRElement extends BaseElement {
  type: 'qr';
  qrType: QRType;
  value: string;
  raw: {
    url?: string;
    text?: string;
    email?: { to: string; subject: string; body: string };
    phone?: string;
    wifi?: { ssid: string; pass: string; encryption: 'WPA' | 'WEP' | 'nopass' };
    vcard?: { name: string; title?: string; org?: string; phone?: string; email?: string; url?: string };
    social?: { platform: string; username: string; url: string };
  };
  fgColor: string;
  bgColor: string;
  isTransparentBg?: boolean;
  moduleStyle: ModuleStyle;
  finderStyle: FinderStyle;
  logoUrl?: string;
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
  padding: number; // Quiet zone
  borderRadius: number;
  borderWidth?: number;
  borderColor?: string;
}

export interface ShapeElement extends BaseElement {
  type: 'shape';
  shapeType: ShapeType;
  fill: string;
  gradient?: {
    type: 'linear' | 'radial';
    colors: string[];
    angle: number;
  };
  stroke: string;
  strokeWidth: number;
  strokeStyle: 'solid' | 'dashed' | 'dotted';
  borderRadius: number;
}

export interface IconElement extends BaseElement {
  type: 'icon';
  iconName: string;
  color: string;
}

export interface ImageElement extends BaseElement {
  type: 'image';
  src: string;
  alt?: string;
  objectFit: 'cover' | 'contain' | 'fill';
  borderRadius: number;
  borderColor?: string;
  borderWidth?: number;
  flipHorizontal?: boolean;
  flipVertical?: boolean;
}

export type TemplateElement =
  | TextElement
  | QRElement
  | ShapeElement
  | IconElement
  | ImageElement;

export interface GradientBackground {
  type: 'gradient';
  gradientType: 'linear' | 'radial';
  colors: string[];
  angle: number; // in degrees
}

export interface SolidBackground {
  type: 'solid';
  color: string;
}

export interface PatternBackground {
  type: 'pattern';
  patternName: 'dots' | 'grid' | 'diagonal-lines' | 'waves' | 'mesh' | 'topography';
  bgColor: string;
  patternColor: string;
  scale: number;
  opacity: number;
}

export interface ImageBackground {
  type: 'image';
  src: string;
  objectFit: 'cover' | 'contain';
  overlayColor?: string;
  overlayOpacity?: number;
}

export type CanvasBackground =
  | SolidBackground
  | GradientBackground
  | PatternBackground
  | ImageBackground;

export interface CanvasDimensions {
  width: number;
  height: number;
  label?: string;
  aspectRatio?: string;
}

export interface TemplateDocument {
  id: string;
  name: string;
  category: CategoryType;
  style: TemplateStyle;
  tags: string[];
  width: number;
  height: number;
  background: CanvasBackground;
  elements: TemplateElement[];
  createdAt: number;
  updatedAt: number;
  isCustom?: boolean;
  isFavorite?: boolean;
  thumbnailUrl?: string;
}

export interface BrandKit {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  textColor: string;
  backgroundColor: string;
  fontFamily: string;
  logoUrl?: string;
}

export type CanvasTool = 'select' | 'hand' | 'text' | 'qr' | 'shape' | 'icon' | 'image';

export interface EditorHistoryState {
  past: TemplateDocument[];
  present: TemplateDocument;
  future: TemplateDocument[];
}
