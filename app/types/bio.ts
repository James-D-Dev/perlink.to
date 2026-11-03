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
  | "messenger"
  | "behance"
  | "shopee"
  | "lazada"
  | "tiktokshop"
  | "grabfood"
  | "shopeefood"
  | "googlemaps"
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
    /** "mesh": soft blobs of the three colours instead of a straight blend */
    style?: "linear" | "mesh";
  };
  /** A fine pattern drawn over a solid or gradient background */
  pattern?: {
    id: "dots" | "grid" | "lines" | "checker" | "diagonal" | "waves";
    /** Defaults to the page text colour, faintly */
    color?: string;
  };
  imageUrl?: string;
  imageOverlay?: string;
  videoUrl?: string;
  effectId?: string;
}

/** "hard": a solid offset shadow (neo-brutalist); "glow": a soft halo in the accent colour */
export type ThemeShadow = "none" | "sm" | "md" | "lg" | "hard" | "glow";

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
  /** Border thickness in px; 0 or unset keeps the style's own border */
  borderWidth?: number;
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
  /** The name filled with a gradient of the accent colours */
  textGradient?: boolean;
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
  /** The ready-made theme last picked, for showing its name */
  presetId?: string;
  /** '3d' shows the page as an interactive mini room */
  pageMode?: PageMode;
  /** On a page that opens in 2D: a "3D room" button that opens the room */
  roomButton?: boolean;
  room?: RoomConfig;
  /** Background music on the page (the 3D room has its own); plays from the visitor's first tap */
  music?: { trackId: string | null };
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
  | 'contact'
  | 'form'
  | 'video'
  | 'testimonials'
  | 'products'
  | 'blog'
  | 'timeline'
  | 'letter'
  | 'event'
  | 'question';

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
    /** 'card' takes the page's own card look; the rest are colour washes */
    theme: 'classic' | 'modern' | 'minimal' | 'party' | 'elegant' | 'card' | 'rose' | 'night';
    showAge: boolean;
    label: string;
    /** Count down to the date (a birthday, a wedding), or up from it ("together for") */
    mode?: 'until' | 'since';
    /** Counting down: to the next yearly return of the date (birthdays, the default), or to that one day */
    repeat?: boolean;
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
  /** Shown greyed out with a "Sold out" label */
  soldOut?: boolean;
}

export interface MenuSection {
  id: string;
  name: string;
  items: MenuItem[];
  /** Overrides the list's suffix for this section, e.g. "/ month" for memberships */
  priceSuffix?: string;
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
    /** Temporarily closed (holidays, renovation); ends by itself after `until` */
    pause?: { enabled: boolean; until?: string; message?: string };
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

// Booking / contact form; requests land in the site's inbox
export interface FormFields {
  phone: boolean;
  email: boolean;
  date: boolean;
  time: boolean;
  guests: boolean;
  message: boolean;
  /** Pick a service from the page's own price list or products (free text without one) */
  service?: boolean;
  /** A check-out date after the date (stays); shows the number of nights */
  checkout?: boolean;
}

export interface FormBlock extends BaseBlock {
  name: 'form';
  data: {
    title?: string;
    description?: string;
    /** 'rsvp': guests say whether they're coming, for invitations; 'stay': a room booking with check-in and check-out; 'subscribe': an email for a newsletter */
    kind: 'booking' | 'contact' | 'rsvp' | 'stay' | 'subscribe';
    fields: FormFields;
    submitLabel?: string;
    successMessage?: string;
    /** The service picker's own words, e.g. "Pick a package" */
    serviceLabel?: string;
  };
}

// The site's latest blog posts, linking to perlink.to/<site>/blog
export interface BlogBlock extends BaseBlock {
  name: 'blog';
  data: {
    title?: string;
    /** How many posts to show */
    count?: number;
    /** Example posts a template comes with: shown in previews until real posts exist */
    samples?: { title: string; coverUrl?: string; minutes?: number }[];
  };
}

// YouTube, Vimeo or TikTok video
export interface VideoBlock extends BaseBlock {
  name: 'video';
  data: {
    title?: string;
    url: string;
    caption?: string;
  };
}

// What customers say
export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  /** e.g. "Google review" or "Regular since 2019" */
  detail?: string;
  rating?: number;
}

// A story told in dated steps: how two people met, a wedding day's plan, a
// company's milestones
export interface TimelineItem {
  id: string;
  /** Free text, e.g. "Feb 2023" or "15:00" */
  date: string;
  title: string;
  text?: string;
  imageUrl?: string;
}

export interface TimelineBlock extends BaseBlock {
  name: 'timeline';
  data: {
    title?: string;
    items: TimelineItem[];
  };
}

// A handwritten-style letter, in a sealed envelope the visitor taps to open
export interface LetterBlock extends BaseBlock {
  name: 'letter';
  data: {
    /** Who it's for, on the envelope */
    to?: string;
    /** Words on the envelope instead of "For …", e.g. "Open when you miss me" */
    cover?: string;
    body: string;
    /** The signature under the letter */
    from?: string;
    /** In an envelope that opens on tap (default), or open from the start */
    sealed?: boolean;
    paper?: 'cream' | 'blush' | 'night';
    /** The envelope greets the guest named in the link (?to=Name) */
    personal?: boolean;
  };
}

// When and where: a wedding ceremony, a party, an opening. Visitors can add
// it to their calendar and get directions
export interface EventBlock extends BaseBlock {
  name: 'event';
  data: {
    /** What happens, e.g. "Wedding reception" */
    name?: string;
    /** YYYY-MM-DD */
    date: string;
    /** HH:MM, both optional; no start time makes it an all-day event */
    startTime?: string;
    endTime?: string;
    venue?: string;
    address?: string;
    mapUrl?: string;
    dressCode?: string;
    note?: string;
  };
}

// A question with two answers, e.g. "Will you be my Valentine?". The "no"
// button runs away; "yes" sets off hearts and shows a message
export interface QuestionBlock extends BaseBlock {
  name: 'question';
  data: {
    question: string;
    yesLabel?: string;
    noLabel?: string;
    /** Shown once they say yes */
    answer?: string;
    /** The "no" button dodges the finger (default) */
    playful?: boolean;
  };
}

export interface TestimonialsBlock extends BaseBlock {
  name: 'testimonials';
  data: {
    title?: string;
    items: Testimonial[];
  };
}

// Things for sale: bought on another store (Shopee, TikTok Shop...) or
// ordered right on the page (orders land in the site's inbox)
export interface ProductItem {
  id: string;
  name: string;
  /** VND */
  price?: number;
  /** Price before a discount, shown struck through */
  comparePrice?: number;
  imageUrl?: string;
  description?: string;
  /** Short label, e.g. "Best seller" */
  tag?: string;
  soldOut?: boolean;
  /** Buy on another store instead of ordering here */
  url?: string;
  /** Choices the buyer makes before ordering, e.g. Size: S, M, L and Colour */
  options?: ProductOption[];
  /** Units left; unset means not counted. Few left shows a badge, 0 is sold out */
  stock?: number;
}

export interface ProductOptionValue {
  id: string;
  label: string;
  /** A colour swatch, e.g. "#e8dcc8" */
  color?: string;
  /**
   * VND: this choice costs this much instead of the product's price (e.g. a
   * 20 cm cake). When choices in several groups set a price, the last group
   * (in the product's order) with a priced choice wins
   */
  price?: number;
}

export interface ProductOption {
  id: string;
  /** e.g. "Size" or "Colour" */
  name: string;
  values: ProductOptionValue[];
}

export type ProductPayment = 'cod' | 'transfer' | 'both';

export interface ProductsBlock extends BaseBlock {
  name: 'products';
  data: {
    title?: string;
    layout: 'grid' | 'list';
    items: ProductItem[];
    /** Products without a store link can be ordered on the page */
    ordering: boolean;
    /** Ask for a delivery address */
    askAddress: boolean;
    /** Transfer uses the bank account of the site's VietQR block */
    payment: ProductPayment;
  };
}

export type BioBlock =
  | ProductsBlock
  | LinksBlock
  | SocialBlock
  | ImageAlbumBlock
  | VietQRBlock
  | TextBlock
  | BirthdayCountdownBlock
  | MenuBlock
  | HoursBlock
  | ContactBlock
  | FormBlock
  | VideoBlock
  | BlogBlock
  | TestimonialsBlock
  | TimelineBlock
  | LetterBlock
  | EventBlock
  | QuestionBlock;

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
  /** Public pages: false when the owner's plan removes the Perlink badge */
  showBranding?: boolean;
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
    label: "X (Twitter)",
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
    key: "messenger",
    label: "Messenger",
    icon: "i-simple-icons-messenger",
    color: "#0084FF",
    placeholder: "username",
    prefix: "https://m.me/",
  },
  {
    key: "behance",
    label: "Behance",
    icon: "i-simple-icons-behance",
    color: "#1769FF",
    placeholder: "username",
    prefix: "https://www.behance.net/",
  },
  // Where people buy, order food or find the place: shown as buttons
  {
    key: "shopee",
    label: "Shopee",
    icon: "i-simple-icons-shopee",
    color: "#EE4D2D",
    placeholder: "https://shopee.vn/yourshop",
  },
  {
    key: "lazada",
    label: "Lazada",
    icon: "i-lucide-shopping-bag",
    color: "#0F146D",
    placeholder: "https://www.lazada.vn/shop/yourshop",
  },
  {
    key: "tiktokshop",
    label: "TikTok Shop",
    icon: "i-simple-icons-tiktok",
    color: "#000000",
    placeholder: "https://www.tiktok.com/@yourshop",
  },
  {
    key: "grabfood",
    label: "GrabFood",
    icon: "i-simple-icons-grab",
    color: "#00B14F",
    placeholder: "https://food.grab.com/vn/vi/restaurant/...",
  },
  {
    key: "shopeefood",
    label: "ShopeeFood",
    icon: "i-lucide-utensils",
    color: "#EE4D2D",
    placeholder: "https://shopeefood.vn/...",
  },
  {
    key: "googlemaps",
    label: "Google Maps",
    icon: "i-simple-icons-googlemaps",
    color: "#34A853",
    placeholder: "https://maps.app.goo.gl/...",
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
