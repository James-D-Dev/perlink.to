import type { PageMode, RoomConfig } from './room';

export interface BioLink {
  id: string;
  title: string;
  subtitle?: string;
  url: string;
  icon?: string;
  imageUrl?: string;
  order: number;
  isActive: boolean;
}

export interface SocialLink {
  id: string;
  url: string;
  index: number;
  provider: string;
  clicks?: number;
}

export type SocialProvider =
  | "facebook"
  | "twitter"
  | "instagram"
  | "linkedin"
  | "youtube"
  | "tiktok"
  | "github"
  | "telegram"
  | "whatsapp"
  | "discord"
  | "spotify"
  | "threads"
  | "snapchat"
  | "twitch"
  | "pinterest"
  | "reddit"
  | "zalo"
  | "website"
  | "email"
  | "phone";

export interface SocialProviderInfo {
  key: SocialProvider;
  label: string;
  icon: string;
  color: string;
  placeholder: string;
  prefix?: string;
}

// Legacy type for migration
export interface SocialLinks {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
  tiktok?: string;
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  third: string;
}

export type ThemeBackgroundType =
  | "solid"
  | "gradient"
  | "image"
  | "video"
  | "effect";

export interface ThemeBackground {
  type: ThemeBackgroundType;
  color?: string;
  gradient?: {
    angle?: number;
    from?: string;
    to?: string;
    via?: string;
  };
  imageUrl?: string;
  imageOverlay?: string;
  videoUrl?: string;
  effectId?: string;
}

export type ThemeShadow = "none" | "sm" | "md" | "lg";

export type AnimateAppear =
  | "none"
  | "fadeIn"
  | "fadeInDown"
  | "fadeInUp"
  | "fadeInLeft"
  | "fadeInRight"
  | "zoomIn"
  | "zoomInDown"
  | "zoomInUp"
  | "bounceIn"
  | "bounceInDown"
  | "bounceInUp"
  | "slideInDown"
  | "slideInUp"
  | "slideInLeft"
  | "slideInRight"
  | "backInDown"
  | "backInUp"
  | "backInLeft"
  | "backInRight"
  | "flipInX"
  | "flipInY"
  | "lightSpeedInRight"
  | "lightSpeedInLeft"
  | "rotateIn";

export type AnimateHover =
  | "none"
  | "pulse"
  | "bounce"
  | "rubberBand"
  | "shakeX"
  | "shakeY"
  | "headShake"
  | "swing"
  | "tada"
  | "wobble"
  | "jello"
  | "heartBeat"
  | "flash"
  | "flip";

export type AnimateDuration = "faster" | "fast" | "normal" | "slow" | "slower";

export type ThemeBackdropBlur = "none" | "sm" | "md" | "lg" | "xl";

export interface ThemeCard {
  style: "filled" | "outline" | "ghost" | "soft";
  cornerRadius: number;
  transparency: number;
  shadow: ThemeShadow;
  backdropBlur?: ThemeBackdropBlur;
  outlineColor?: string;
  /** Surface colour. When set, cards use it instead of a tint of the primary colour */
  backgroundColor?: string;
  textColor?: string;
  animationAppear?: AnimateAppear;
  animationHover?: AnimateHover;
  animationDuration?: AnimateDuration;
}

export interface ThemeButton {
  style: "filled" | "outline" | "ghost" | "soft";
  cornerRadius: number;
  shadow: ThemeShadow;
  textColor?: string;
  animationAppear?: AnimateAppear;
  animationHover?: AnimateHover;
  animationDuration?: AnimateDuration;
}

export type ThemeHeaderLayout =
  | "centered"
  | "left"
  | "cover"
  | "banner-circle"
  | "banner-square"
  | "image-overlay";

export interface ThemeHeader {
  alignment: "left" | "center" | "right";
  spacing: "compact" | "normal" | "spacious";
  layout?: ThemeHeaderLayout;
  bannerUrl?: string;
  fontFamily?: string;
  fontSize?: string;
  /** CSS font-weight for the name, e.g. "400" */
  fontWeight?: string;
  /** CSS letter-spacing for the name, e.g. "-0.02em" */
  letterSpacing?: string;
  textColor?: string;
}

export interface ThemeAvatar {
  shape: "circle" | "square" | "rounded";
  size: "sm" | "md" | "lg" | "xl";
  border: boolean;
  borderColor?: string;
  animationAppear?: AnimateAppear;
  animationHover?: AnimateHover;
  animationDuration?: AnimateDuration;
}

export type LinkCardLayout =
  | "vertical"
  | "horizontal-left"
  | "horizontal-right"
  | "centered";

export interface ThemeLink {
  layout: LinkCardLayout;
}

export interface ThemeTypography {
  nameFont: string;
  headingFont: string;
  paragraphFont: string;
  nameSize: "sm" | "md" | "lg" | "xl";
  paragraphSize: "xs" | "sm" | "md";
  bioFontFamily?: string;
  bioFontSize?: string;
  bioTextColor?: string;
  /** Default colour for text outside cards */
  textColor?: string;
}

export interface ThemeSocial {
  style: "soft" | "filled" | "outline" | "plain";
}

/** How the site appears in search results and shared links */
export interface ThemeSeo {
  title?: string;
  description?: string;
  /** One of the site's own photos; empty picks banner, then avatar */
  imageUrl?: string;
}

export interface ThemePage {
  /** Space between blocks */
  blockGap: "compact" | "normal" | "relaxed";
  /** Alignment of block titles */
  titleAlign: "left" | "center";
}

export interface ThemeConfig {
  colors: ThemeColors;
  background: ThemeBackground;
  card: ThemeCard;
  button: ThemeButton;
  header: ThemeHeader;
  avatar: ThemeAvatar;
  typography: ThemeTypography;
  link: ThemeLink;
  social?: ThemeSocial;
  page?: ThemePage;
  /** Language of the words visitors see, e.g. "vi" (see utils/siteI18n) */
  language?: string;
  seo?: ThemeSeo;
  showShare?: boolean;
  /** '3d' shows the page as an interactive mini room */
  pageMode?: PageMode;
  room?: RoomConfig;
}

// ==================== Bio Blocks ====================
export type BlockName =
  | 'links'
  | 'social'
  | 'image-album'
  | 'vietqr'
  | 'text'
  | 'birthday-countdown'
  | 'menu'
  | 'hours'
  | 'contact';

export interface BaseBlock {
  /** Unique per page, so a page can hold several blocks of one type. Older pages get one on load */
  id?: string;
  name: BlockName;
  index: number;
  hidden: boolean;
}

export interface LinksBlock extends BaseBlock {
  name: 'links';
  data: {
    title?: string;
    items: BioLink[];
  };
}

export interface SocialBlock extends BaseBlock {
  name: 'social';
  data: {
    links: SocialLink[];
  };
}

export interface ImageAlbumBlock extends BaseBlock {
  name: 'image-album';
  data: {
    title?: string;
    images: { id: string; url: string; alt?: string }[];
    layout: 'grid' | 'masonry' | 'carousel';
  };
}

export interface VietQRBlock extends BaseBlock {
  name: 'vietqr';
  data: VietQRInfo;
}

export interface ThemeConfigBlock {
  config: ThemeConfig;
}

export interface HeaderConfig {
  layout: 'stacked' | 'split' | 'minimal';
  showAvatar: boolean;
  showBio: boolean;
}

export interface AnalyticsConfig {
  showViewCount: boolean;
  showLinkClicks: boolean;
  showSocialClicks: boolean;
}

export interface TextBlock extends BaseBlock {
  name: 'text';
  data: {
    title?: string;
    content: string;
    align: 'left' | 'center' | 'right';
    /** 'card' puts the text on a card surface */
    style?: 'plain' | 'card';
  };
}

export interface BirthdayCountdownBlock extends BaseBlock {
  name: 'birthday-countdown';
  data: {
    birthDate: string; // ISO date string YYYY-MM-DD
    theme: 'classic' | 'modern' | 'minimal' | 'party' | 'elegant';
    showAge: boolean;
    label: string;
  };
}

// Menu: dishes for a restaurant/café, or rooms for a hotel (cards layout)
export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price?: string;
  imageUrl?: string;
  tag?: string;
}

export interface MenuSection {
  id: string;
  name: string;
  items: MenuItem[];
}

export interface MenuBlock extends BaseBlock {
  name: 'menu';
  data: {
    title: string;
    currency: string;
    /** Shown after the price, e.g. "/night" */
    priceSuffix?: string;
    layout: 'list' | 'cards';
    sections: MenuSection[];
  };
}

export interface OpeningDay {
  /** 0 = Sunday ... 6 = Saturday */
  day: number;
  open: string; // HH:MM
  close: string; // HH:MM
  closed: boolean;
}

export interface HoursBlock extends BaseBlock {
  name: 'hours';
  data: {
    title: string;
    days: OpeningDay[];
    note?: string;
  };
}

export interface ContactBlock extends BaseBlock {
  name: 'contact';
  data: {
    title: string;
    address?: string;
    mapUrl?: string;
    phone?: string;
    email?: string;
    bookingUrl?: string;
    bookingLabel?: string;
    /** Sticky Call / Directions / chat buttons at the bottom of the page */
    quickBar?: boolean;
  };
}

export type BioBlock =
  | LinksBlock
  | SocialBlock
  | ImageAlbumBlock
  | VietQRBlock
  | TextBlock
  | BirthdayCountdownBlock
  | MenuBlock
  | HoursBlock
  | ContactBlock;

export const DEFAULT_OPENING_DAYS: OpeningDay[] = [1, 2, 3, 4, 5, 6, 0].map(day => ({
  day,
  open: '08:00',
  close: '22:00',
  closed: false,
}));

export const DEFAULT_THEME: ThemeConfig = {
  colors: {
    primary: "#7C3AED",
    secondary: "#A78BFA",
    third: "#EDE9FE",
  },
  background: {
    type: "solid",
    color: "#FFFFFF",
  },
  card: {
    style: "filled",
    cornerRadius: 12,
    transparency: 1,
    shadow: "sm",
  },
  button: {
    style: "filled",
    cornerRadius: 12,
    shadow: "none",
  },
  header: {
    alignment: "center",
    spacing: "normal",
  },
  avatar: {
    shape: "circle",
    size: "lg",
    border: false,
  },
  link: {
    layout: "vertical",
  },
  typography: {
    nameFont: "Inter, system-ui, sans-serif",
    headingFont: "Inter, system-ui, sans-serif",
    paragraphFont: "Inter, system-ui, sans-serif",
    nameSize: "lg",
    paragraphSize: "sm",
  },
  social: { style: "soft" },
  page: { blockGap: "normal", titleAlign: "center" },
  showShare: true,
};

export interface VietQRInfo {
  bankId?: string;
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
  amount?: string;
  note?: string;
  theme?: string;
  qrString?: string;
}

export interface ImageAlbumImage {
  id: string;
  url: string;
  alt?: string;
  index?: number;
}

export type ImageAlbumLayout = "vertical" | "carousel" | "grid" | "masonry";

export interface ImageAlbumBlock {
  title?: string;
  images: ImageAlbumImage[];
  layout: ImageAlbumLayout;
  maxImages?: number;
}

export interface BioData {
  title: string;
  bio: string;
  avatarUrl: string;
  templateId: string;
  themeConfig: ThemeConfig;
  blocks: BioBlock[];
}

export interface Template {
  id: string;
  name: string;
  description: string;
  previewClass: string;
  avatarClass: string;
  lineClass: string;
  buttonClass: string;
}

// Social provider definitions
export const SOCIAL_PROVIDERS: SocialProviderInfo[] = [
  {
    key: "facebook",
    label: "Facebook",
    icon: "i-logos-facebook",
    color: "#1877F2",
    placeholder: "https://facebook.com/username",
  },
  {
    key: "twitter",
    label: "Twitter",
    icon: "i-prime-twitter",
    color: "#000000",
    placeholder: "username",
    prefix: "https://x.com/",
  },
  {
    key: "instagram",
    label: "Instagram",
    icon: "i-skill-icons-instagram",
    color: "#E4405F",
    placeholder: "username",
    prefix: "https://instagram.com/",
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    icon: "i-skill-icons-linkedin",
    color: "#0A66C2",
    placeholder: "https://linkedin.com/in/username",
  },
  {
    key: "youtube",
    label: "YouTube",
    icon: "i-logos-youtube-icon",
    color: "#FF0000",
    placeholder: "https://youtube.com/@username",
  },
  {
    key: "tiktok",
    label: "TikTok",
    icon: "i-logos-tiktok-icon",
    color: "#000000",
    placeholder: "username",
    prefix: "https://tiktok.com/@",
  },
  {
    key: "github",
    label: "GitHub",
    icon: "i-mingcute-github-line",
    color: "#181717",
    placeholder: "https://github.com/username",
  },
  {
    key: "telegram",
    label: "Telegram",
    icon: "i-logos-telegram",
    color: "#26A5E4",
    placeholder: "username",
    prefix: "https://t.me/",
  },
  {
    key: "whatsapp",
    label: "WhatsApp",
    icon: "i-logos-whatsapp-icon",
    color: "#25D366",
    placeholder: "https://wa.me/1234567890",
  },
  {
    key: "discord",
    label: "Discord",
    icon: "i-logos-discord-icon",
    color: "#5865F2",
    placeholder: "https://discord.com/channels/invite",
  },
  {
    key: "spotify",
    label: "Spotify",
    icon: "i-logos-spotify-icon",
    color: "#1DB954",
    placeholder: "https://open.spotify.com/user/username",
  },
  {
    key: "threads",
    label: "Threads",
    icon: "i-simple-icons-threads",
    color: "#000000",
    placeholder: "username",
    prefix: "https://threads.com/@",
  },
  {
    key: "snapchat",
    label: "Snapchat",
    icon: "i-simple-icons-snapchat",
    color: "#FFFC00",
    placeholder: "username",
    prefix: "https://snapchat.com/add/",
  },
  {
    key: "twitch",
    label: "Twitch",
    icon: "i-simple-icons-twitch",
    color: "#9146FF",
    placeholder: "username",
    prefix: "https://twitch.tv/",
  },
  {
    key: "pinterest",
    label: "Pinterest",
    icon: "i-simple-icons-pinterest",
    color: "#BD081C",
    placeholder: "username",
    prefix: "https://pinterest.com/",
  },
  {
    key: "reddit",
    label: "Reddit",
    icon: "i-simple-icons-reddit",
    color: "#FF4500",
    placeholder: "https://reddit.com/user/username",
  },
  {
    key: "zalo",
    label: "Zalo",
    icon: "custom:zalo",
    color: "#0068FF",
    placeholder: "https://zalo.me/phone",
  },

  {
    key: "website",
    label: "Website",
    icon: "i-lucide-globe",
    color: "#6B7280",
    placeholder: "https://example.com",
  },
  {
    key: "email",
    label: "Email",
    icon: "i-lucide-mail",
    color: "#6B7280",
    placeholder: "email@example.com",
  },
  {
    key: "phone",
    label: "Phone",
    icon: "i-lucide-phone",
    color: "#6B7280",
    placeholder: "+1234567890",
  },
];
