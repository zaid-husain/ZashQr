export interface IconCategory {
  name: string;
  icons: string[];
}

export const ICON_CATEGORIES: IconCategory[] = [
  {
    name: 'Business',
    icons: [
      'Briefcase', 'Building2', 'TrendingUp', 'DollarSign', 'Award',
      'Target', 'Users', 'CreditCard', 'BarChart3', 'ShieldCheck',
      'BadgeCheck', 'FileText', 'CheckCircle2', 'Crown', 'Lightbulb'
    ]
  },
  {
    name: 'Social',
    icons: [
      'Globe', 'Instagram', 'Twitter', 'Facebook', 'Linkedin',
      'Youtube', 'MessageCircle', 'Send', 'Share2', 'Sparkles',
      'Heart', 'ThumbsUp', 'AtSign', 'Hash', 'Bookmark'
    ]
  },
  {
    name: 'Restaurant',
    icons: [
      'Utensils', 'Coffee', 'Pizza', 'Wine', 'Beer',
      'Cake', 'CupSoda', 'Sandwich', 'Apple', 'Flame',
      'Cookie', 'Soup', 'Croissant', 'Fish', 'Beef'
    ]
  },
  {
    name: 'Location',
    icons: [
      'MapPin', 'Navigation', 'Compass', 'Map', 'Building',
      'Store', 'Home', 'Flag', 'LocateFixed', 'LandPlot'
    ]
  },
  {
    name: 'Phone & Mail',
    icons: [
      'Phone', 'PhoneCall', 'Smartphone', 'Mail', 'Inbox',
      'MessageSquare', 'SendHorizontal', 'Contact', 'Headphones', 'Bell'
    ]
  },
  {
    name: 'Calendar & Time',
    icons: [
      'Calendar', 'CalendarCheck', 'Clock', 'Timer', 'Hourglass',
      'CalendarDays', 'Watch', 'History', 'AlarmClock'
    ]
  },
  {
    name: 'Arrows',
    icons: [
      'ArrowRight', 'ArrowUpRight', 'ArrowLeft', 'ArrowDown', 'ChevronRight',
      'CornerDownRight', 'MoveRight', 'ExternalLink', 'RefreshCw', 'Zap'
    ]
  },
  {
    name: 'Shopping & Offers',
    icons: [
      'ShoppingBag', 'ShoppingCart', 'Tag', 'Percent', 'Gift',
      'Package', 'Receipt', 'Sparkle', 'Star', 'BadgePercent'
    ]
  },
  {
    name: 'QR & Tech',
    icons: [
      'QrCode', 'Scan', 'Wifi', 'Cpu', 'Laptop',
      'Shield', 'Key', 'Fingerprint', 'Lock', 'Radio'
    ]
  }
];
