import type { QRData } from '../types';

export const formatQRValue = (data: QRData['raw'], type: QRData['type']): string => {
  switch (type) {
    case 'url':
      return data.url || 'https://';
    case 'text':
      return data.text || '';
    case 'email':
      const { to, subject, body } = data.email;
      if (!to) return '';
      let mailto = `mailto:${to}`;
      const params = new URLSearchParams();
      if (subject) params.append('subject', subject);
      if (body) params.append('body', body);
      const qs = params.toString();
      if (qs) mailto += `?${qs}`;
      return mailto;
    case 'phone':
      return data.phone ? `tel:${data.phone}` : '';
    case 'wifi':
      const { ssid, pass, encryption } = data.wifi;
      if (!ssid) return '';
      return `WIFI:T:${encryption};S:${ssid};P:${pass};H:;`;
    default:
      return '';
  }
};
