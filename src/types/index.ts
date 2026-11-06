export type QRType = 'url' | 'text' | 'email' | 'phone' | 'wifi';

export interface QRData {
  type: QRType;
  value: string; // The formatted string to encode
  raw: {
    url: string;
    text: string;
    email: { to: string; subject: string; body: string };
    phone: string;
    wifi: { ssid: string; pass: string; encryption: 'WPA' | 'WEP' | 'nopass' };
  };
}

export type ModuleStyle = 'square' | 'rounded' | 'dots';
export type FinderStyle = 'square' | 'rounded';

export interface QRCodeOptions {
  fgColor: string;
  bgColor: string;
  moduleStyle: ModuleStyle;
  finderStyle: FinderStyle;
  finderColor?: string;
  logoUrl?: string;
  logoEnabled?: boolean;
  logoScale?: number;
  logoPadding?: number;
  quietZone?: number;
  size: number;
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
}
