import { nanoid } from 'nanoid'
import type { BioBlock } from '~/types/bio'
import type { RoomConfig, RoomObject } from '~/types/room'
import { DEFAULT_OPENING_DAYS } from '~/types/bio'
import type { PageTemplate } from './pageTemplates'
import { COFFEE_TABLE_TOP, DESK_TOP, SAMPLE_ADDRESS, SAMPLE_PHONE, album, links, look, menu, photo, room, social, withIndex } from './templateKit'

// More starter pages, for the kinds of small businesses and moments that use
// a one-page site most in Vietnam. Sample text is written in English with its
// Vietnamese next to it: `s(en, vi)` returns the English and registers the
// translation that localizeTemplateContent swaps in for Vietnamese users.

export const MORE_VI: Record<string, string> = {}
function s(en: string, vi: string) {
  MORE_VI[en] = vi
  return en
}

type Blocks = Omit<BioBlock, 'index' | 'hidden'>[]

function reviews(...items: [string, string, string?][]) {
  return items.map(([quote, author, detail]) => ({ id: nanoid(6), quote, author, detail, rating: 5 }))
}

function hours(open: string, close: string, closedDays: number[] = []) {
  return DEFAULT_OPENING_DAYS.map(d => ({ ...d, open, close, closed: closedDays.includes(d.day) }))
}

const booking = (date = true, time = true, guests = false) =>
  ({ phone: true, email: false, date, time, guests, message: true })

// ---- 3D rooms, reused with each template's colours ----

type Obj = Omit<RoomObject, 'id' | 'scale'>

/** A shop or salon: counter, shelves and a lit sign that links somewhere */
function shopRoom(wall: string, floor: string, accent: string, label: string, extra: Obj[] = []) {
  return room({ wallColor: wall, floorColor: floor, floorMaterial: 'wood', trimColor: '#ffffff' }, [
    { type: 'neon-sign', position: [0.2, 2.1, -3], rotation: 0, wall: 'back', color: accent, link: { label, url: '' } },
    { type: 'cabinet', position: [0.2, 0, -2.6], rotation: 0, color: accent },
    { type: 'bookshelf', position: [-1.9, 0, -2.8], rotation: 0 },
    { type: 'bookshelf', position: [2.2, 0, -2.8], rotation: 0 },
    { type: 'wall-lamp', position: [-3, 1.8, -0.6], rotation: 0, wall: 'left' },
    { type: 'picture-frame', position: [-3, 1.6, 0.8], rotation: 0, wall: 'left', color: accent },
    { type: 'plant', position: [2.5, 0, 1.6], rotation: 0 },
    { type: 'plant', position: [-2.5, 0, 2.2], rotation: 0 },
    { type: 'rug', position: [0, 0, 0.6], rotation: 0, color: accent },
    ...extra,
  ])
}

/** A calm lounge: sofa, low table with candles, warm lamps */
function loungeRoom(wall: string, floor: string, accent: string, label: string, extra: Obj[] = []) {
  return room({ wallColor: wall, floorColor: floor, floorMaterial: 'wood', trimColor: '#f5f0e8' }, [
    { type: 'picture-frame', position: [0, 1.7, -3], rotation: 0, wall: 'back', color: accent, link: { label, url: '' } },
    { type: 'string-lights', position: [0, 2.6, -3], rotation: 0, wall: 'back', color: '#ffe8a3' },
    { type: 'sofa', position: [0, 0, -2.3], rotation: 0, color: accent },
    { type: 'coffee-table', position: [0, 0, -1.1], rotation: 0 },
    { type: 'candle', position: [-0.15, COFFEE_TABLE_TOP, -1.1], rotation: 0 },
    { type: 'candle', position: [0.15, COFFEE_TABLE_TOP, -1.05], rotation: 0 },
    { type: 'floor-lamp', position: [-2.4, 0, -2.4], rotation: 0 },
    { type: 'plant', position: [2.4, 0, -2.4], rotation: 0 },
    { type: 'plant', position: [-2.5, 0, 2.2], rotation: 0 },
    { type: 'rug', position: [0, 0, -0.6], rotation: 0, color: accent },
    ...extra,
  ])
}

/** A workroom: desk, laptop with a link, books and frames */
function studioRoom(wall: string, floor: string, accent: string, label: string, extra: Obj[] = []) {
  return room({ wallColor: wall, floorColor: floor, floorMaterial: 'wood', trimColor: '#ffffff' }, [
    { type: 'window', position: [0.8, 1.6, -3], rotation: 0, wall: 'back' },
    { type: 'desk', position: [0.8, 0, -2.6], rotation: 0 },
    { type: 'chair', position: [0.8, 0, -1.8], rotation: 180 },
    { type: 'laptop', position: [0.65, DESK_TOP, -2.6], rotation: 0, link: { label, url: '' } },
    { type: 'desk-lamp', position: [1.35, DESK_TOP, -2.7], rotation: 0, color: accent },
    { type: 'bookshelf', position: [-1.8, 0, -2.8], rotation: 0 },
    { type: 'picture-frame', position: [-3, 1.7, -0.4], rotation: 0, wall: 'left', color: accent },
    { type: 'wall-clock', position: [2.3, 2.2, -3], rotation: 0, wall: 'back' },
    { type: 'plant', position: [2.5, 0, 0.8], rotation: 0 },
    { type: 'rug', position: [0, 0, 0.6], rotation: 0, color: accent },
    ...extra,
  ])
}

/** A night spot: neon, string lights, a bar of low tables */
function nightRoom(wall: string, accent: string, label: string, extra: Obj[] = []) {
  return room({ wallColor: wall, floorColor: '#2b2b30', floorMaterial: 'concrete', trimColor: '#44444c' }, [
    { type: 'neon-sign', position: [0.4, 2, -3], rotation: 0, wall: 'back', color: accent, link: { label, url: '' } },
    { type: 'string-lights', position: [-3, 2.5, 0], rotation: 0, wall: 'left', color: accent },
    { type: 'cabinet', position: [0.4, 0, -2.6], rotation: 0, color: '#1f1f24' },
    { type: 'coffee-table', position: [-1.3, 0, 0], rotation: 0, color: '#1f1f24' },
    { type: 'chair', position: [-2.1, 0, 0], rotation: 90 },
    { type: 'candle', position: [-1.3, COFFEE_TABLE_TOP, 0], rotation: 0 },
    { type: 'coffee-table', position: [1.4, 0, 0.8], rotation: 0, color: '#1f1f24' },
    { type: 'chair', position: [2.2, 0, 0.8], rotation: 270 },
    { type: 'candle', position: [1.4, COFFEE_TABLE_TOP, 0.8], rotation: 0 },
    { type: 'wall-lamp', position: [-3, 1.8, -1.6], rotation: 0, wall: 'left', color: accent },
    ...extra,
  ])
}

/**
 * A gift room: opens straight in 3D with music on, framed photos on the
 * walls and the guestbook on, so friends leave wishes and gifts in front of it
 */
function giftRoom(wall: string, floor: string, accent: string, sign: string, photos: string[], mode: 'day' | 'night', trackId: string, extra: Obj[] = []): RoomConfig {
  const base = room({ wallColor: wall, floorColor: floor, floorMaterial: 'wood', trimColor: '#ffffff' }, [
    { type: 'neon-sign', position: [0.9, 2.05, -3], rotation: 0, wall: 'back', color: accent, link: { label: sign, url: '' } },
    { type: 'string-lights', position: [0, 2.65, -3], rotation: 0, wall: 'back', color: '#ffe8a3' },
    { type: 'string-lights', position: [-3, 2.65, 0], rotation: 0, wall: 'left', color: '#ffe8a3' },
    ...photos.map((name, i): Obj => ({ type: 'picture-frame', position: i === 0 ? [-1.1, 1.55, -3] : [-3, 1.55, -1.2 + (i - 1) * 1.4], rotation: 0, wall: i === 0 ? 'back' : 'left', color: '#ffffff', image: photo(name) })),
    { type: 'sofa', position: [0.6, 0, -2.3], rotation: 0, color: accent },
    { type: 'coffee-table', position: [0.6, 0, -1.1], rotation: 0, color: '#fff7ed' },
    { type: 'candle', position: [0.45, COFFEE_TABLE_TOP, -1.1], rotation: 0 },
    { type: 'candle', position: [0.75, COFFEE_TABLE_TOP, -1.05], rotation: 0 },
    { type: 'floor-lamp', position: [2.4, 0, -2.4], rotation: 0 },
    { type: 'plant', position: [-2.5, 0, -2.5], rotation: 0 },
    { type: 'plant', position: [2.5, 0, 1.6], rotation: 0 },
    { type: 'rug', position: [0.4, 0, -0.4], rotation: 0, color: accent },
    ...extra,
  ])
  return {
    ...base,
    land: 'sakura',
    environment: { ...base.environment, mode },
    music: { trackId, volume: 0.5, autoplay: true },
    guestbook: true,
  }
}

const GIFT_TEMPLATES: PageTemplate[] = [
  {
    id: 'gift-birthday',
    name: 'Birthday surprise room',
    category: 'gifts',
    description: 'A 3D room full of wishes and gifts from friends. Share the link on the big day.',
    icon: 'i-lucide-gift',
    preview: { bg: '#FFE4EF', accent: '#E8457A' },
    build: () => ({
      title: s('Happy birthday, Linh! 🎂', 'Chúc mừng sinh nhật Linh! 🎂'),
      bio: s('Your friends filled this room with wishes. Tap 💌 to add yours.', 'Bạn bè đã gửi lời chúc vào căn phòng này. Bấm 💌 để gửi lời chúc của bạn.'),
      avatarUrl: photo('birthday-avatar'),
      themeConfig: {
        ...look({
          bg: '#FFE4EF', text: '#5B1A3A', accent: '#E8457A', onAccent: '#FFFFFF', surface: '#FFFFFF', radius: 999, shadow: 'md',
          nameFont: 'Pacifico, cursive', nameWeight: '400', nameSize: '2.1rem', bodyFont: 'Nunito, sans-serif',
          header: 'banner-circle', banner: photo('birthday-cover'), link: 'centered', social: 'filled',
        }),
        pageMode: '3d',
      },
      blocks: withIndex([
        { name: 'text', data: { title: s('A little note', 'Vài lời gửi bạn'), content: s('Happy birthday! We made you a little room on the internet. Walk around, open the photos, and read what everyone wrote for you. 💛', 'Chúc mừng sinh nhật! Tụi mình làm tặng bạn một căn phòng nhỏ trên mạng. Đi một vòng, xem ảnh và đọc lời chúc mọi người gửi nhé. 💛'), align: 'center', style: 'plain' } },
        { name: 'birthday-countdown', data: { birthDate: '2027-03-15', theme: 'party', showAge: false, label: s('Birthday in', 'Còn bao lâu đến sinh nhật') } },
        { name: 'image-album', data: { title: s('Memories', 'Kỷ niệm'), images: album('birthday-1', 'birthday-2'), layout: 'grid' } },
      ] as Blocks),
      room: giftRoom('#ffe4ef', '#e8c4a0', '#e8457a', s('Happy birthday!', 'Chúc mừng sinh nhật!'), ['birthday-avatar', 'birthday-1', 'birthday-2'], 'day', 'playful-kids'),
    }),
  },
  {
    id: 'gift-love',
    name: 'Love room',
    category: 'gifts',
    description: 'Surprise your partner with a 3D room of your photos, music and a love letter.',
    icon: 'i-lucide-heart',
    preview: { bg: '#2A1220', accent: '#FF5C8A' },
    build: () => ({
      title: s('For you, Minh ❤️', 'Gửi Minh của em ❤️'),
      bio: s('One year together, and many more to come.', 'Một năm bên nhau, và còn thật nhiều năm nữa.'),
      avatarUrl: photo('event-avatar'),
      themeConfig: {
        ...look({
          bg: '#2A1220', text: '#FFE9F0', accent: '#FF5C8A', onAccent: '#FFFFFF', surface: '#3A1A2C', radius: 16, shadow: 'md',
          nameFont: 'Cormorant Garamond, serif', nameWeight: '600', nameSize: '2.25rem', bodyFont: 'Nunito, sans-serif',
          header: 'banner-circle', banner: photo('event-cover'), link: 'centered', social: 'soft',
        }),
        pageMode: '3d',
      },
      blocks: withIndex([
        { name: 'text', data: { title: s('A letter for you', 'Thư gửi anh'), content: s('Thank you for every ordinary day that felt special with you. I made this room to keep our favourite moments in one place. Look around, and leave me a message. ❤️', 'Cảm ơn anh vì những ngày bình thường mà ở bên anh lại thành đặc biệt. Em làm căn phòng này để giữ những khoảnh khắc mình thích nhất. Anh đi một vòng xem nhé, rồi để lại cho em một lời nhắn. ❤️'), align: 'center', style: 'plain' } },
        { name: 'birthday-countdown', data: { birthDate: '2027-02-14', theme: 'elegant', showAge: false, label: s('Our anniversary in', 'Còn bao lâu đến ngày kỷ niệm') } },
        { name: 'image-album', data: { title: s('Us', 'Chúng mình'), images: album('event-1', 'event-2', 'event-3', 'event-4'), layout: 'grid' } },
      ] as Blocks),
      room: giftRoom('#3a1a2c', '#8a5a44', '#ff5c8a', s('Love you', 'Yêu anh'), ['event-avatar', 'event-1', 'event-2'], 'night', 'fairytale-quest'),
    }),
  },
]

// ─── Personal blog ───────────────────────────────────────────────
const BLOG_TEMPLATE: PageTemplate = {
  id: 'blog',
  name: 'Personal blog',
  category: 'personal',
  description: 'Your writing up front: an intro, your latest posts and a blog board in your 3D room.',
  icon: 'i-lucide-newspaper',
  preview: { bg: '#FBF8F3', accent: '#B5543B' },
  build: () => ({
    title: s('Your Name', 'Tên của bạn'),
    bio: s('Notes on books, travel and slow living.', 'Ghi chép về sách, những chuyến đi và sống chậm.'),
    avatarUrl: photo('personal-avatar'),
    themeConfig: look({
      bg: '#FBF8F3', text: '#1F1B16', accent: '#B5543B', onAccent: '#FFFFFF',
      surface: '#FFFFFF', radius: 18,
      nameFont: 'Cormorant Garamond, serif', nameWeight: '600', nameSize: '2.25rem', tracking: '-0.01em',
      header: 'centered', link: 'centered', social: 'plain',
    }),
    blocks: withIndex([
      { name: 'text', data: { title: s('Hello, I\'m glad you\'re here', 'Chào bạn, rất vui vì bạn ghé'), content: s('I write about the books I read, the places I go and the small things that make a day good. New posts every week.', 'Mình viết về những cuốn sách đã đọc, những nơi đã đi và những điều nhỏ làm nên một ngày đẹp. Mỗi tuần một bài mới.'), align: 'center', style: 'plain' } },
      { name: 'blog', data: { title: s('Latest posts', 'Bài viết mới'), count: 5 } },
      { name: 'social', data: { links: social('instagram', 'threads', 'facebook') } },
    ] as Blocks),
    room: room({ wallColor: '#efe6d8', floorColor: '#8a6a4a', floorMaterial: 'wood', trimColor: '#ffffff' }, [
      { type: 'blog-board', position: [0.4, 1.7, -3], rotation: 0, wall: 'back', color: '#B5543B' },
      { type: 'bookshelf', position: [-1.9, 0, -2.8], rotation: 0 },
      { type: 'bookshelf', position: [2.2, 0, -2.8], rotation: 0 },
      { type: 'desk', position: [-3, 0, 0.4], rotation: 90, color: '#6b4a32' },
      { type: 'laptop', position: [-3, DESK_TOP, 0.4], rotation: 90 },
      { type: 'desk-lamp', position: [-3.05, DESK_TOP, -0.2], rotation: 90, color: '#B5543B' },
      { type: 'sofa', position: [0.6, 0, 0.9], rotation: 180, color: '#c9b79c' },
      { type: 'rug', position: [0.4, 0, 0.2], rotation: 0, color: '#B5543B' },
      { type: 'floor-lamp', position: [2.5, 0, 1.4], rotation: 0 },
      { type: 'plant', position: [2.5, 0, -1.6], rotation: 0 },
      { type: 'coffee-table', position: [0.4, 0, -0.3], rotation: 0, color: '#6b4a32' },
      { type: 'mug', position: [0.4, COFFEE_TABLE_TOP, -0.3], rotation: 0 },
    ]),
  }),
}

export const MORE_PAGE_TEMPLATES: PageTemplate[] = [
  ...GIFT_TEMPLATES,
  BLOG_TEMPLATE,
  // ─── Beauty ───────────────────────────────────────────────────
  {
    id: 'spa',
    name: 'Spa & massage',
    category: 'beauty',
    description: 'Treatments with prices, opening hours and online booking.',
    icon: 'i-lucide-flower-2',
    preview: { bg: '#EEF1EA', accent: '#6B7F65' },
    build: () => ({
      title: s('Your Spa', 'Spa của bạn'),
      bio: s('A quiet place to slow down. Massage, facials and body care.', 'Nơi yên tĩnh để chậm lại. Massage, chăm sóc da mặt và cơ thể.'),
      avatarUrl: photo('spa-avatar'),
      themeConfig: look({
        bg: '#EEF1EA', text: '#2F3A2F', accent: '#6B7F65', onAccent: '#FFFFFF', surface: '#F8F9F5', radius: 20,
        nameFont: 'Cormorant Garamond, serif', nameWeight: '600', nameSize: '2.25rem', bodyFont: 'Josefin Sans, sans-serif',
        header: 'banner-circle', banner: photo('spa-cover'), link: 'centered', social: 'outline', gap: 'relaxed',
      }),
      blocks: withIndex([
        { name: 'text', data: { title: s('Welcome', 'Chào mừng'), content: s('Natural oils, warm stones and therapists with ten years of experience. Every visit starts with a cup of herbal tea.', 'Tinh dầu thiên nhiên, đá nóng và kỹ thuật viên hơn mười năm kinh nghiệm. Mỗi lần ghé đều bắt đầu bằng một tách trà thảo mộc.'), align: 'center', style: 'plain' } },
        { name: 'menu', data: { title: s('Treatments', 'Liệu trình'), currency: '₫', layout: 'cards', sections: menu([
          { name: '', items: [
            [s('Aroma massage', 'Massage tinh dầu'), '450,000', s('60 minutes, full body', '60 phút, toàn thân'), s('Popular', 'Bán chạy')],
            [s('Hot stone massage', 'Massage đá nóng'), '600,000', s('90 minutes', '90 phút')],
            [s('Facial care', 'Chăm sóc da mặt'), '380,000', s('Cleanse, mask and massage', 'Làm sạch, đắp mặt nạ và massage')],
            [s('Foot reflexology', 'Bấm huyệt chân'), '250,000', s('45 minutes', '45 phút')],
          ] },
        ]) } },
        { name: 'image-album', data: { images: album('spa-1', 'spa-2', 'spa-3'), layout: 'carousel' } },
        { name: 'hours', data: { title: s('Opening hours', 'Giờ mở cửa'), days: hours('09:00', '21:00'), note: s('Last booking one hour before closing.', 'Nhận khách cuối trước giờ đóng cửa một tiếng.') } },
        { name: 'form', data: { title: s('Book a treatment', 'Đặt lịch'), description: s('We’ll confirm your time by phone.', 'Chúng tôi sẽ gọi xác nhận giờ hẹn.'), kind: 'booking', fields: booking(true, true, true) } },
        { name: 'testimonials', data: { title: s('From our guests', 'Khách nói gì'), items: reviews(
          [s('The calmest hour of my month. Lovely staff.', 'Một tiếng thư thái nhất trong tháng. Nhân viên rất dễ thương.'), 'Thu Hà', s('Google review', 'Đánh giá Google')],
          [s('Best hot stone massage in town.', 'Massage đá nóng ngon nhất thành phố.'), 'Minh Anh'],
        ) } },
        { name: 'contact', data: { title: s('Visit the spa', 'Ghé spa'), address: SAMPLE_ADDRESS, phone: SAMPLE_PHONE } },
        { name: 'social', data: { links: social('facebook', 'instagram', 'zalo') } },
      ] as Blocks),
      room: loungeRoom('#e3e8dc', '#c9b79c', '#6b7f65', s('Book a treatment', 'Đặt lịch')),
    }),
  },
  {
    id: 'nail',
    name: 'Nail salon',
    category: 'beauty',
    description: 'Price list, nail art gallery and appointments.',
    icon: 'i-lucide-sparkles',
    preview: { bg: '#FFE4F1', accent: '#EC4899' },
    build: () => ({
      title: s('Your Nail Studio', 'Tiệm nail của bạn'),
      bio: s('Gel, nail art and pedicure. Clean tools, cute designs.', 'Sơn gel, vẽ móng và chăm sóc chân. Dụng cụ sạch, mẫu xinh.'),
      avatarUrl: photo('nail-avatar'),
      themeConfig: look({
        bg: '#FFE9F3', text: '#5B1340', accent: '#EC4899', onAccent: '#FFFFFF', surface: '#FFFFFF', radius: 999,
        nameFont: 'Comfortaa, sans-serif', nameWeight: '700', nameSize: '1.875rem', bodyFont: 'Nunito, sans-serif',
        header: 'banner-circle', banner: photo('nail-cover'), link: 'centered', social: 'filled',
      }),
      blocks: withIndex([
        { name: 'menu', data: { title: s('Price list', 'Bảng giá'), currency: '₫', layout: 'list', sections: menu([
          { name: s('Hands', 'Tay'), items: [[s('Basic manicure', 'Cắt da, sơn thường'), '80,000'], [s('Gel polish', 'Sơn gel'), '150,000', '', s('Popular', 'Bán chạy')], [s('Nail art (per nail)', 'Vẽ móng (mỗi móng)'), '20,000']] },
          { name: s('Feet', 'Chân'), items: [[s('Pedicure', 'Chăm sóc chân'), '120,000'], [s('Gel pedicure', 'Sơn gel chân'), '180,000']] },
        ]) } },
        { name: 'image-album', data: { title: s('Recent designs', 'Mẫu mới làm'), images: album('nail-1', 'nail-2', 'nail-3'), layout: 'grid' } },
        { name: 'form', data: { title: s('Book a seat', 'Đặt lịch làm móng'), kind: 'booking', fields: booking() } },
        { name: 'hours', data: { title: s('Opening hours', 'Giờ mở cửa'), days: hours('09:00', '20:30') } },
        { name: 'contact', data: { address: SAMPLE_ADDRESS, phone: SAMPLE_PHONE } },
        { name: 'social', data: { links: social('instagram', 'tiktok', 'facebook', 'zalo') } },
      ] as Blocks),
      room: shopRoom('#ffd6e8', '#e8c4a0', '#ec4899', s('See our designs', 'Xem mẫu móng')),
    }),
  },
  {
    id: 'barber',
    name: 'Hair salon & barber',
    category: 'beauty',
    description: 'Services, stylists’ work, hours and booking.',
    icon: 'i-lucide-scissors',
    preview: { bg: '#18181B', accent: '#D4A373' },
    build: () => ({
      title: s('Your Salon', 'Salon tóc của bạn'),
      bio: s('Cuts, colour and styling for everyone. Walk-ins welcome.', 'Cắt, nhuộm và tạo kiểu cho mọi người. Khách vãng lai luôn được chào đón.'),
      avatarUrl: photo('hair-avatar'),
      themeConfig: look({
        bg: '#18181B', text: '#F4F4F5', accent: '#D4A373', onAccent: '#18181B', surface: '#27272A', border: '#3F3F46', radius: 6,
        nameFont: 'Space Grotesk, sans-serif', nameWeight: '700', nameSize: '1.875rem', tracking: '-0.02em', bodyFont: 'Inter, sans-serif',
        header: 'banner-square', banner: photo('hair-cover'), avatar: 'rounded', link: 'centered', social: 'outline', titleAlign: 'left',
      }),
      blocks: withIndex([
        { name: 'menu', data: { title: s('Services', 'Dịch vụ'), currency: '₫', layout: 'list', sections: menu([
          { name: '', items: [
            [s('Haircut', 'Cắt tóc'), '120,000', s('Wash and style included', 'Gồm gội và tạo kiểu')],
            [s('Colour', 'Nhuộm'), '450,000', s('From, depending on length', 'Từ, tùy độ dài')],
            [s('Perm', 'Uốn'), '550,000'],
            [s('Beard trim', 'Tỉa râu'), '60,000'],
          ] },
        ]) } },
        { name: 'image-album', data: { title: s('Our work', 'Tác phẩm'), images: album('hair-1', 'hair-2', 'hair-3'), layout: 'grid' } },
        { name: 'form', data: { title: s('Book a chair', 'Đặt lịch'), kind: 'booking', fields: booking() } },
        { name: 'hours', data: { title: s('Opening hours', 'Giờ mở cửa'), days: hours('08:30', '20:00', [1]) } },
        { name: 'contact', data: { address: SAMPLE_ADDRESS, phone: SAMPLE_PHONE } },
        { name: 'social', data: { links: social('instagram', 'tiktok', 'facebook') } },
      ] as Blocks),
      room: shopRoom('#2a2a30', '#5c4a3a', '#d4a373', s('Book a chair', 'Đặt lịch')),
    }),
  },

  // ─── Health ───────────────────────────────────────────────────
  {
    id: 'gym',
    name: 'Gym & personal trainer',
    category: 'health',
    description: 'Membership plans, results and a free trial sign-up.',
    icon: 'i-lucide-dumbbell',
    preview: { bg: '#0B0B0F', accent: '#A3E635' },
    build: () => ({
      title: s('Your Gym', 'Phòng gym của bạn'),
      bio: s('Strength, cardio and coaching. Train with people who care.', 'Tập tạ, cardio và huấn luyện 1 kèm 1. Tập cùng những người tận tâm.'),
      avatarUrl: photo('gym-avatar'),
      themeConfig: look({
        bg: '#0B0B0F', text: '#F4F4F5', accent: '#A3E635', onAccent: '#0B0B0F', surface: '#18181B', radius: 10,
        nameFont: 'Montserrat, sans-serif', nameWeight: '700', nameSize: '1.875rem', tracking: '-0.02em',
        header: 'banner-square', banner: photo('gym-cover'), avatar: 'rounded', link: 'centered', social: 'outline',
      }),
      blocks: withIndex([
        { name: 'menu', data: { title: s('Membership', 'Gói tập'), currency: '₫', priceSuffix: s(' / month', ' / tháng'), layout: 'cards', sections: menu([
          { name: '', items: [
            [s('Basic', 'Cơ bản'), '450,000', s('Gym floor, 6am to 10pm', 'Khu tập tự do, 6h đến 22h')],
            [s('Plus', 'Nâng cao'), '750,000', s('Gym and group classes', 'Gym và các lớp nhóm'), s('Best value', 'Đáng tiền nhất')],
            [s('Personal training', 'Huấn luyện cá nhân'), '3,500,000', s('12 sessions with a coach', '12 buổi với huấn luyện viên')],
          ] },
        ]) } },
        { name: 'form', data: { title: s('Book a free trial', 'Đăng ký tập thử miễn phí'), description: s('One free session, no card needed.', 'Một buổi miễn phí, không cần trả trước.'), kind: 'booking', fields: booking(true, true), submitLabel: s('Claim my trial', 'Nhận buổi tập thử') } },
        { name: 'image-album', data: { images: album('gym-1', 'gym-2', 'gym-3'), layout: 'carousel' } },
        { name: 'testimonials', data: { title: s('Member results', 'Kết quả hội viên'), items: reviews(
          [s('Lost 8 kg in four months with my coach. Never felt stronger.', 'Giảm 8 kg sau bốn tháng tập với HLV. Chưa bao giờ thấy khỏe như vậy.'), 'Quang Huy'],
          [s('Clean, friendly and open early.', 'Sạch sẽ, thân thiện và mở cửa sớm.'), 'Lan Phương'],
        ) } },
        { name: 'hours', data: { title: s('Opening hours', 'Giờ mở cửa'), days: hours('06:00', '22:00') } },
        { name: 'contact', data: { address: SAMPLE_ADDRESS, phone: SAMPLE_PHONE } },
        { name: 'social', data: { links: social('facebook', 'instagram', 'tiktok', 'zalo') } },
      ] as Blocks),
      room: nightRoom('#1c1c22', '#a3e635', s('Book a free trial', 'Đăng ký tập thử miễn phí')),
    }),
  },
  {
    id: 'dental',
    name: 'Dental & clinic',
    category: 'health',
    description: 'Treatments, prices, opening hours and appointments.',
    icon: 'i-lucide-stethoscope',
    preview: { bg: '#F3F6FA', accent: '#0369A1' },
    build: () => ({
      title: s('Your Dental Clinic', 'Nha khoa của bạn'),
      bio: s('Gentle care for the whole family, with modern equipment.', 'Chăm sóc răng nhẹ nhàng cho cả gia đình, trang thiết bị hiện đại.'),
      avatarUrl: photo('dental-avatar'),
      themeConfig: look({
        bg: '#F3F6FA', text: '#0F2A43', accent: '#0369A1', onAccent: '#FFFFFF', surface: '#FFFFFF', radius: 14, shadow: 'sm',
        nameFont: 'Be Vietnam Pro, sans-serif', nameWeight: '700', nameSize: '1.875rem', bodyFont: 'Be Vietnam Pro, sans-serif',
        header: 'banner-circle', banner: photo('dental-cover'), link: 'centered', social: 'soft',
      }),
      blocks: withIndex([
        { name: 'text', data: { title: s('About the clinic', 'Về phòng khám'), content: s('Licensed dentists, sterilised tools and clear prices before any treatment.', 'Bác sĩ có chứng chỉ hành nghề, dụng cụ tiệt trùng và báo giá rõ ràng trước khi điều trị.'), align: 'center', style: 'plain' } },
        { name: 'menu', data: { title: s('Treatments & prices', 'Dịch vụ'), currency: '₫', layout: 'list', sections: menu([
          { name: '', items: [
            [s('Check-up and cleaning', 'Khám và lấy cao răng'), '300,000'],
            [s('Whitening', 'Tẩy trắng răng'), '2,500,000'],
            [s('Filling', 'Trám răng'), '400,000', s('Per tooth', 'Mỗi răng')],
            [s('Braces consultation', 'Tư vấn niềng răng'), '0', s('Free', 'Miễn phí')],
          ] },
        ]) } },
        { name: 'form', data: { title: s('Book an appointment', 'Đặt lịch khám'), kind: 'booking', fields: booking() } },
        { name: 'hours', data: { title: s('Clinic hours', 'Giờ làm việc'), days: hours('08:00', '19:00', [0]) } },
        { name: 'image-album', data: { images: album('dental-1', 'dental-2'), layout: 'grid' } },
        { name: 'testimonials', data: { items: reviews(
          [s('Painless and very clear about costs.', 'Không đau và báo giá rất rõ ràng.'), 'Hoàng Nam', s('Google review', 'Đánh giá Google')],
        ) } },
        { name: 'contact', data: { address: SAMPLE_ADDRESS, phone: SAMPLE_PHONE } },
        { name: 'social', data: { links: social('facebook', 'zalo') } },
      ] as Blocks),
      room: studioRoom('#e8f1f8', '#c7d2dc', '#0369a1', s('Book an appointment', 'Đặt lịch khám')),
    }),
  },

  // ─── Education ────────────────────────────────────────────────
  {
    id: 'tutor',
    name: 'Tutor & learning centre',
    category: 'education',
    description: 'Courses, fees, parent reviews and sign-up.',
    icon: 'i-lucide-graduation-cap',
    preview: { bg: '#FFF9E6', accent: '#2563EB' },
    build: () => ({
      title: s('Your Learning Centre', 'Trung tâm của bạn'),
      bio: s('English and maths for ages 6 to 15. Small classes, real progress.', 'Tiếng Anh và Toán cho bé 6 đến 15 tuổi. Lớp nhỏ, tiến bộ thật.'),
      avatarUrl: photo('tutor-avatar'),
      themeConfig: look({
        bg: '#FFF9E6', text: '#1E3A8A', accent: '#2563EB', onAccent: '#FFFFFF', surface: '#FFFFFF', radius: 16, shadow: 'sm',
        nameFont: 'Nunito, sans-serif', nameWeight: '800', nameSize: '1.875rem', bodyFont: 'Nunito, sans-serif',
        header: 'banner-circle', banner: photo('tutor-cover'), link: 'centered', social: 'filled',
      }),
      blocks: withIndex([
        { name: 'menu', data: { title: s('Courses', 'Khóa học'), currency: '₫', priceSuffix: s(' / month', ' / tháng'), layout: 'cards', sections: menu([
          { name: '', items: [
            [s('English for kids', 'Tiếng Anh thiếu nhi'), '1,200,000', s('8 lessons, max 8 students', '8 buổi, tối đa 8 học viên'), s('New term', 'Khai giảng')],
            [s('Maths booster', 'Toán nâng cao'), '1,000,000', s('8 lessons', '8 buổi')],
            [s('One-to-one tutoring', 'Gia sư 1 kèm 1'), '300,000', s('Per hour, at home or online', 'Mỗi giờ, tại nhà hoặc online')],
          ] },
        ]) } },
        { name: 'testimonials', data: { title: s('What parents say', 'Phụ huynh nói gì'), items: reviews(
          [s('My son went from shy to confident in one term.', 'Con tôi từ rụt rè trở nên tự tin chỉ sau một khóa.'), s('Ms Hạnh', 'Chị Hạnh'), s('Parent', 'Phụ huynh')],
          [s('Teachers send notes after every class.', 'Giáo viên gửi nhận xét sau mỗi buổi học.'), s('Mr Tuấn', 'Anh Tuấn'), s('Parent', 'Phụ huynh')],
        ) } },
        { name: 'form', data: { title: s('Book a free placement test', 'Đăng ký kiểm tra đầu vào miễn phí'), kind: 'contact', fields: { phone: true, email: false, date: false, time: false, guests: false, message: true }, submitLabel: s('Send', 'Gửi đăng ký') } },
        { name: 'image-album', data: { images: album('tutor-1', 'tutor-2'), layout: 'grid' } },
        { name: 'contact', data: { address: SAMPLE_ADDRESS, phone: SAMPLE_PHONE } },
        { name: 'social', data: { links: social('facebook', 'zalo', 'youtube') } },
      ] as Blocks),
      room: studioRoom('#fff4cc', '#d9b98c', '#2563eb', s('See our courses', 'Xem khóa học')),
    }),
  },

  // ─── Food & drink ─────────────────────────────────────────────
  {
    id: 'bakery',
    name: 'Bakery & cake shop',
    category: 'food',
    description: 'Today’s bakes with photos, prices and pre-orders.',
    icon: 'i-lucide-croissant',
    preview: { bg: '#FFF7E6', accent: '#D98E04' },
    build: () => ({
      title: s('Your Bakery', 'Tiệm bánh của bạn'),
      bio: s('Fresh bread every morning, cakes made to order.', 'Bánh mì nóng mỗi sáng, bánh kem làm theo yêu cầu.'),
      avatarUrl: photo('bakery-avatar'),
      themeConfig: look({
        bg: '#FFF7E6', text: '#5A3A1A', accent: '#D98E04', onAccent: '#FFFFFF', surface: '#FFFFFF', radius: 18, shadow: 'sm',
        nameFont: 'Lora, serif', nameWeight: '600', nameSize: '2.25rem', bodyFont: 'Nunito, sans-serif',
        header: 'banner-circle', banner: photo('bakery-cover'), link: 'centered', social: 'soft',
      }),
      blocks: withIndex([
        { name: 'menu', data: { title: s('Today’s bakes', 'Bánh hôm nay'), currency: '₫', layout: 'cards', sections: menu([
          { name: '', items: [
            [s('Butter croissant', 'Croissant bơ'), '35,000', '', s('Top seller', 'Bán chạy')],
            [s('Sourdough loaf', 'Bánh mì men tự nhiên'), '90,000'],
            [s('Tiramisu slice', 'Tiramisu'), '55,000'],
            [s('Birthday cake (16 cm)', 'Bánh sinh nhật (16 cm)'), '350,000', s('Order two days ahead', 'Đặt trước hai ngày')],
          ] },
        ]) } },
        { name: 'image-album', data: { images: album('bakery-1', 'bakery-2', 'bakery-3'), layout: 'carousel' } },
        { name: 'form', data: { title: s('Order a cake', 'Đặt bánh'), description: s('Tell us the size, flavour and the name to write.', 'Cho chúng tôi biết cỡ bánh, vị và tên cần viết.'), kind: 'booking', fields: { phone: true, email: false, date: true, time: true, guests: false, message: true }, submitLabel: s('Send order', 'Gửi đơn') } },
        { name: 'hours', data: { title: s('Opening hours', 'Giờ mở cửa'), days: hours('06:30', '20:00') } },
        { name: 'contact', data: { address: SAMPLE_ADDRESS, phone: SAMPLE_PHONE } },
        { name: 'social', data: { links: social('facebook', 'instagram', 'zalo') } },
      ] as Blocks),
      room: shopRoom('#fdeccb', '#c99a6b', '#d98e04', s('Order a cake', 'Đặt bánh')),
    }),
  },
  {
    id: 'street-food',
    name: 'Street food stall',
    category: 'food',
    description: 'A short menu, evening hours and pay by bank QR.',
    icon: 'i-lucide-soup',
    preview: { bg: '#FFF4D6', accent: '#DC2626' },
    build: () => ({
      title: s('Your Food Stall', 'Quán ăn vặt của bạn'),
      bio: s('Grilled rice paper, banh mi and cold drinks. Open every evening.', 'Bánh tráng nướng, bánh mì và nước mát. Mở cửa mỗi tối.'),
      avatarUrl: photo('street-avatar'),
      themeConfig: look({
        bg: '#FFF4D6', text: '#3B1D0E', accent: '#DC2626', onAccent: '#FFFFFF', surface: '#FFFFFF', radius: 14, shadow: 'md',
        nameFont: 'Lobster, cursive', nameWeight: '400', nameSize: '2.25rem', bodyFont: 'Be Vietnam Pro, sans-serif',
        header: 'banner-circle', banner: photo('street-cover'), link: 'centered', social: 'filled',
      }),
      blocks: withIndex([
        { name: 'menu', data: { title: s('Menu', 'Thực đơn'), currency: '₫', layout: 'list', sections: menu([
          { name: s('Snacks', 'Món ăn'), items: [
            [s('Grilled rice paper', 'Bánh tráng nướng'), '25,000', s('Egg, pork floss, spring onion', 'Trứng, ruốc, hành lá'), s('Must try', 'Phải thử')],
            [s('Banh mi with pâté', 'Bánh mì pate'), '20,000'],
            [s('Fried fish balls', 'Cá viên chiên'), '30,000'],
          ] },
          { name: s('Drinks', 'Đồ uống'), items: [[s('Kumquat iced tea', 'Trà tắc'), '15,000'], [s('Sugarcane juice', 'Nước mía'), '15,000']] },
        ]) } },
        { name: 'vietqr', data: {} },
        { name: 'hours', data: { title: s('Open', 'Giờ bán'), days: hours('16:00', '23:00') } },
        { name: 'image-album', data: { images: album('street-1', 'street-2', 'street-3'), layout: 'grid' } },
        { name: 'contact', data: { title: s('Find us', 'Địa chỉ'), address: SAMPLE_ADDRESS, phone: SAMPLE_PHONE } },
        { name: 'social', data: { links: social('tiktok', 'facebook', 'zalo') } },
      ] as Blocks),
      room: nightRoom('#3a1f1a', '#fbbf24', s('See the menu', 'Xem thực đơn')),
    }),
  },
  {
    id: 'bar',
    name: 'Bar & lounge',
    category: 'food',
    description: 'Cocktail list, night hours and table reservations.',
    icon: 'i-lucide-martini',
    preview: { bg: '#0E0E0E', accent: '#C9A45C' },
    build: () => ({
      title: s('Your Bar', 'Quán bar của bạn'),
      bio: s('Signature cocktails, vinyl and late nights.', 'Cocktail đặc trưng, nhạc vinyl và những đêm muộn.'),
      avatarUrl: photo('bar-avatar'),
      themeConfig: look({
        bg: '#0E0E0E', text: '#F2EDE4', accent: '#C9A45C', onAccent: '#0E0E0E', surface: '#0E0E0E', border: '#3A3326', radius: 2,
        nameFont: 'Cormorant Garamond, serif', nameWeight: '500', nameSize: '2.5rem', tracking: '0.04em', bodyFont: 'Josefin Sans, sans-serif',
        header: 'banner-circle', banner: photo('bar-cover'), link: 'centered', social: 'plain', gap: 'relaxed',
      }),
      blocks: withIndex([
        { name: 'menu', data: { title: s('Cocktail list', 'Cocktail'), currency: '₫', layout: 'list', sections: menu([
          { name: s('Signatures', 'Đặc trưng'), items: [
            [s('Saigon Sour', 'Saigon Sour'), '180,000', s('Rum, passion fruit, lime', 'Rum, chanh dây, chanh'), s('House pick', 'Gợi ý')],
            [s('Lotus Martini', 'Lotus Martini'), '200,000', s('Gin, lotus tea, vermouth', 'Gin, trà sen, vermouth')],
          ] },
          { name: s('Classics', 'Cổ điển'), items: [[s('Negroni', 'Negroni'), '170,000'], [s('Old Fashioned', 'Old Fashioned'), '170,000']] },
        ]) } },
        { name: 'image-album', data: { images: album('bar-1', 'bar-2', 'bar-3'), layout: 'grid' } },
        { name: 'form', data: { title: s('Reserve a table', 'Đặt bàn'), kind: 'booking', fields: booking(true, true, true) } },
        { name: 'hours', data: { title: s('Opening hours', 'Giờ mở cửa'), days: hours('18:00', '01:00') } },
        { name: 'contact', data: { address: SAMPLE_ADDRESS, phone: SAMPLE_PHONE } },
        { name: 'social', data: { links: social('instagram', 'facebook') } },
      ] as Blocks),
      room: nightRoom('#141414', '#c9a45c', s('Reserve a table', 'Đặt bàn')),
    }),
  },

  // ─── Shops ────────────────────────────────────────────────────
  {
    id: 'florist',
    name: 'Flower shop',
    category: 'shop',
    description: 'Bouquets with prices, a gallery and orders by date.',
    icon: 'i-lucide-flower',
    preview: { bg: '#FDF2F4', accent: '#5B8C51' },
    build: () => ({
      title: s('Your Flower Shop', 'Tiệm hoa của bạn'),
      bio: s('Fresh bouquets for birthdays, openings and just because.', 'Hoa tươi cho sinh nhật, khai trương và những ngày bình thường.'),
      avatarUrl: photo('florist-avatar'),
      themeConfig: look({
        bg: '#FDF2F4', text: '#3F1D2B', accent: '#5B8C51', onAccent: '#FFFFFF', surface: '#FFFFFF', border: '#F3C6D2', radius: 18,
        nameFont: 'Playfair Display, serif', nameWeight: '600', nameSize: '2.25rem', bodyFont: 'Be Vietnam Pro, sans-serif',
        header: 'banner-circle', banner: photo('florist-cover'), link: 'centered', social: 'outline',
      }),
      blocks: withIndex([
        { name: 'menu', data: { title: s('Bouquets', 'Bó hoa'), currency: '₫', layout: 'cards', sections: menu([
          { name: '', items: [
            [s('Pastel bouquet', 'Bó hoa pastel'), '450,000', s('Roses and baby’s breath', 'Hồng và baby')],
            [s('Sunflower bunch', 'Bó hướng dương'), '350,000', '', s('Popular', 'Bán chạy')],
            [s('Opening flower stand', 'Kệ hoa khai trương'), '1,500,000', s('Order a day ahead', 'Đặt trước một ngày')],
          ] },
        ]) } },
        { name: 'image-album', data: { title: s('From the shop', 'Ở tiệm'), images: album('florist-1', 'florist-2', 'florist-3'), layout: 'grid' } },
        { name: 'form', data: { title: s('Order flowers', 'Đặt hoa'), description: s('Tell us the date, budget and who they are for.', 'Cho chúng tôi biết ngày nhận, ngân sách và người nhận.'), kind: 'booking', fields: { phone: true, email: false, date: true, time: true, guests: false, message: true }, submitLabel: s('Send order', 'Gửi đơn') } },
        { name: 'hours', data: { title: s('Opening hours', 'Giờ mở cửa'), days: hours('07:00', '21:00') } },
        { name: 'contact', data: { address: SAMPLE_ADDRESS, phone: SAMPLE_PHONE } },
        { name: 'social', data: { links: social('facebook', 'instagram', 'zalo') } },
      ] as Blocks),
      room: shopRoom('#fbe4ea', '#d8b49a', '#5b8c51', s('Order flowers', 'Đặt hoa'), [
        { type: 'plant', position: [1.2, 0, -1.6], rotation: 0, color: '#f472b6' },
        { type: 'plant', position: [-1.2, 0, -1.6], rotation: 0, color: '#fbbf24' },
      ]),
    }),
  },
  {
    id: 'online-shop',
    name: 'Online shop',
    category: 'shop',
    description: 'Links to your stores, best sellers and a lookbook.',
    icon: 'i-lucide-shopping-bag',
    preview: { bg: '#FAFAFA', accent: '#0A0A0A' },
    build: () => ({
      title: s('Your Shop', 'Shop của bạn'),
      bio: s('Everyday clothes in soft colours. New drops every Friday.', 'Quần áo hằng ngày tông màu dịu. Hàng mới mỗi thứ Sáu.'),
      avatarUrl: photo('shop-avatar'),
      themeConfig: look({
        bg: '#FAFAFA', text: '#0A0A0A', accent: '#0A0A0A', onAccent: '#FFFFFF', surface: '#FFFFFF', border: '#E5E5E5', radius: 0,
        nameFont: 'Josefin Sans, sans-serif', nameWeight: '700', nameSize: '1.875rem', tracking: '0.04em', bodyFont: 'Inter, sans-serif',
        header: 'banner-square', banner: photo('shop-cover'), avatar: 'square', link: 'centered', social: 'plain',
      }),
      blocks: withIndex([
        { name: 'links', data: { items: links([s('Shop on Shopee', 'Mua trên Shopee'), ''], [s('Shop on TikTok Shop', 'Mua trên TikTok Shop'), ''], [s('Size guide', 'Bảng size'), '']) } },
        { name: 'menu', data: { title: s('Best sellers', 'Bán chạy'), currency: '₫', layout: 'cards', sections: menu([
          { name: '', items: [
            [s('Linen shirt', 'Áo sơ mi linen'), '320,000'],
            [s('Wide-leg trousers', 'Quần ống rộng'), '380,000', '', s('New', 'Mới')],
            [s('Knit cardigan', 'Áo khoác len'), '450,000'],
          ] },
        ]) } },
        { name: 'image-album', data: { title: s('Lookbook', 'Lookbook'), images: album('shop-1', 'shop-2', 'shop-3'), layout: 'masonry' } },
        { name: 'contact', data: { title: s('Questions?', 'Cần tư vấn?'), phone: SAMPLE_PHONE } },
        { name: 'social', data: { links: social('instagram', 'tiktok', 'facebook', 'zalo') } },
      ] as Blocks),
      room: shopRoom('#f0eeea', '#bfb6aa', '#0a0a0a', s('Shop now', 'Mua ngay')),
    }),
  },

  // ─── Business ─────────────────────────────────────────────────
  {
    id: 'real-estate',
    name: 'Real estate agent',
    category: 'business',
    description: 'Featured listings, photos and a viewing request form.',
    icon: 'i-lucide-house',
    preview: { bg: '#F5F1E8', accent: '#1B2A41' },
    build: () => ({
      title: s('Your Name · Real Estate', 'Tên bạn · Bất động sản'),
      bio: s('Apartments and houses in the city. Honest advice, fast viewings.', 'Căn hộ và nhà phố trong thành phố. Tư vấn thật, xem nhà nhanh.'),
      avatarUrl: photo('realestate-avatar'),
      themeConfig: look({
        bg: '#F5F1E8', text: '#1B2A41', accent: '#1B2A41', onAccent: '#F5F1E8', surface: '#FFFFFF', radius: 6,
        nameFont: 'Noto Serif, serif', nameWeight: '600', nameSize: '1.875rem', bodyFont: 'Inter, sans-serif',
        header: 'banner-square', banner: photo('realestate-cover'), avatar: 'rounded', link: 'centered', social: 'filled', titleAlign: 'left',
      }),
      blocks: withIndex([
        { name: 'menu', data: { title: s('Featured listings', 'Căn nổi bật'), currency: '₫', layout: 'cards', sections: menu([
          { name: '', items: [
            [s('2-bed apartment, river view', 'Căn hộ 2 phòng ngủ, view sông'), '4.2 tỷ', s('75 m², District 2', '75 m², Quận 2'), s('New', 'Mới')],
            [s('Townhouse with garden', 'Nhà phố có sân vườn'), '9.8 tỷ', s('4 floors, 5 bedrooms', '4 tầng, 5 phòng ngủ')],
            [s('Studio for rent', 'Studio cho thuê'), '8 triệu/tháng', s('Furnished, near the centre', 'Đầy đủ nội thất, gần trung tâm')],
          ] },
        ]) } },
        { name: 'image-album', data: { images: album('realestate-1', 'realestate-2', 'realestate-3'), layout: 'carousel' } },
        { name: 'form', data: { title: s('Request a viewing', 'Đặt lịch xem nhà'), kind: 'booking', fields: booking(true, true) } },
        { name: 'testimonials', data: { items: reviews(
          [s('Found our flat in two weeks. Very patient.', 'Tìm được căn hộ chỉ sau hai tuần. Rất kiên nhẫn.'), 'Gia đình anh Phúc'],
        ) } },
        { name: 'contact', data: { phone: SAMPLE_PHONE, email: 'hello@yourname.vn' } },
        { name: 'social', data: { links: social('facebook', 'zalo', 'youtube') } },
      ] as Blocks),
      room: loungeRoom('#ece6da', '#a98a6a', '#1b2a41', s('See listings', 'Xem nhà')),
    }),
  },

  // ─── Creative ─────────────────────────────────────────────────
  {
    id: 'wedding-photo',
    name: 'Wedding photographer',
    category: 'creative',
    description: 'Portfolio gallery, packages and date enquiries.',
    icon: 'i-lucide-camera',
    preview: { bg: '#FBF8F2', accent: '#2C2620' },
    build: () => ({
      title: s('Your Studio', 'Studio của bạn'),
      bio: s('Wedding and pre-wedding photos with a natural, film-like feel.', 'Ảnh cưới và pre-wedding phong cách tự nhiên, màu phim.'),
      avatarUrl: photo('photo-avatar'),
      themeConfig: look({
        bg: '#FBF8F2', text: '#2C2620', accent: '#2C2620', onAccent: '#FBF8F2', surface: '#FBF8F2', border: '#D9CFC1', radius: 2,
        nameFont: 'Cormorant Garamond, serif', nameWeight: '500', nameSize: '2.5rem', bodyFont: 'Lora, serif',
        header: 'banner-circle', banner: photo('photo-cover'), link: 'centered', social: 'plain', gap: 'relaxed',
      }),
      blocks: withIndex([
        { name: 'image-album', data: { title: s('Our portfolio', 'Tác phẩm'), images: album('photo-1', 'photo-2', 'photo-3', 'photo-4'), layout: 'masonry' } },
        { name: 'menu', data: { title: s('Packages', 'Gói chụp'), currency: '₫', layout: 'list', sections: menu([
          { name: '', items: [
            [s('Pre-wedding', 'Pre-wedding'), '8,000,000', s('One location, 60 edited photos', 'Một địa điểm, 60 ảnh chỉnh sửa')],
            [s('Wedding day', 'Ngày cưới'), '12,000,000', s('Ceremony and party, full gallery', 'Lễ và tiệc, trọn bộ ảnh'), s('Most booked', 'Được chọn nhiều')],
            [s('Album add-on', 'Album in'), '3,000,000', s('30 × 30 cm, 40 pages', '30 × 30 cm, 40 trang')],
          ] },
        ]) } },
        { name: 'testimonials', data: { title: s('Kind words', 'Lời cảm ơn'), items: reviews(
          [s('We cried looking at the photos. Thank you!', 'Hai đứa đã khóc khi xem ảnh. Cảm ơn bạn rất nhiều!'), 'Linh & Đức'],
        ) } },
        { name: 'form', data: { title: s('Check your date', 'Hỏi lịch trống'), kind: 'booking', fields: { phone: true, email: true, date: true, time: false, guests: false, message: true }, submitLabel: s('Ask about my date', 'Gửi câu hỏi') } },
        { name: 'social', data: { links: social('instagram', 'facebook', 'tiktok') } },
      ] as Blocks),
      room: studioRoom('#f3ede4', '#c8a27a', '#2c2620', s('See the portfolio', 'Xem tác phẩm')),
    }),
  },
  {
    id: 'musician',
    name: 'Musician & DJ',
    category: 'creative',
    description: 'Latest release, upcoming shows and booking.',
    icon: 'i-lucide-music',
    preview: { bg: '#12002B', accent: '#F472B6' },
    build: () => ({
      title: s('Your Artist Name', 'Nghệ danh của bạn'),
      bio: s('DJ and producer. House, disco and late-night sets.', 'DJ và nhà sản xuất âm nhạc. House, disco và những set nhạc đêm.'),
      avatarUrl: photo('dj-avatar'),
      themeConfig: look({
        bg: '#12002B', text: '#FDF4FF', accent: '#F472B6', onAccent: '#12002B', surface: '#12002B', border: '#F472B6', radius: 14,
        nameFont: 'Space Grotesk, sans-serif', nameWeight: '700', nameSize: '2.25rem', tracking: '-0.02em',
        header: 'banner-circle', banner: photo('dj-cover'), link: 'centered', social: 'outline',
      }),
      blocks: withIndex([
        { name: 'social', data: { links: social('spotify', 'youtube', 'instagram', 'tiktok') } },
        { name: 'video', data: { title: s('Latest set', 'Set nhạc mới nhất'), url: '' } },
        { name: 'links', data: { items: links([s('Listen on Spotify', 'Nghe trên Spotify'), ''], [s('Press kit', 'Hồ sơ nghệ sĩ'), '']) } },
        { name: 'menu', data: { title: s('Upcoming shows', 'Lịch diễn sắp tới'), currency: '', layout: 'list', sections: menu([
          { name: '', items: [
            [s('Saturday · Rooftop Club', 'Thứ Bảy · Rooftop Club'), '22:00', s('Ho Chi Minh City', 'TP. Hồ Chí Minh')],
            [s('Next Friday · Beach Festival', 'Thứ Sáu tới · Lễ hội biển'), '20:00', s('Da Nang', 'Đà Nẵng'), s('Tickets', 'Có vé')],
          ] },
        ]) } },
        { name: 'image-album', data: { images: album('dj-1', 'dj-2', 'dj-3'), layout: 'grid' } },
        { name: 'form', data: { title: s('Book me', 'Mời biểu diễn'), kind: 'booking', fields: { phone: true, email: true, date: true, time: false, guests: true, message: true } } },
      ] as Blocks),
      room: nightRoom('#1a0638', '#f472b6', s('Latest set', 'Set nhạc mới nhất')),
    }),
  },

  // ─── Events & community ───────────────────────────────────────
  {
    id: 'birthday',
    name: 'Birthday party',
    category: 'events',
    description: 'Countdown, plan for the day, place and RSVP.',
    icon: 'i-lucide-cake',
    preview: { bg: '#FFF1C1', accent: '#F43F5E' },
    build: () => ({
      title: s('Mai turns 30!', 'Mai tròn 30 tuổi!'),
      bio: s('Come celebrate with cake, games and good friends.', 'Đến chung vui cùng bánh kem, trò chơi và bạn bè nhé.'),
      avatarUrl: photo('birthday-avatar'),
      themeConfig: look({
        bg: '#FFF1C1', text: '#4C1D95', accent: '#F43F5E', onAccent: '#FFFFFF', surface: '#FFFFFF', radius: 999, shadow: 'md',
        nameFont: 'Pacifico, cursive', nameWeight: '400', nameSize: '2.25rem', bodyFont: 'Nunito, sans-serif',
        header: 'banner-circle', banner: photo('birthday-cover'), link: 'centered', social: 'filled',
      }),
      blocks: withIndex([
        { name: 'birthday-countdown', data: { birthDate: '2027-03-15', theme: 'party', showAge: false, label: s('Party starts in', 'Còn bao lâu nữa') } },
        { name: 'menu', data: { title: s('The plan', 'Lịch trình'), currency: '', layout: 'list', sections: menu([
          { name: '', items: [[s('Welcome drinks', 'Đón khách'), '18:00'], [s('Dinner', 'Ăn tối'), '19:00'], [s('Cake and games', 'Cắt bánh và trò chơi'), '20:30']] },
        ]) } },
        { name: 'contact', data: { title: s('Where', 'Địa điểm'), address: SAMPLE_ADDRESS } },
        { name: 'form', data: { title: s('Are you coming?', 'Bạn có đến không?'), kind: 'booking', fields: { phone: true, email: false, date: false, time: false, guests: true, message: true }, submitLabel: s('I’ll be there', 'Mình sẽ đến') } },
        { name: 'image-album', data: { images: album('birthday-1', 'birthday-2'), layout: 'grid' } },
      ] as Blocks),
      room: loungeRoom('#ffe4ef', '#e8c4a0', '#f43f5e', s('RSVP', 'Xác nhận tham dự')),
    }),
  },
  {
    id: 'charity',
    name: 'Fundraiser & charity',
    category: 'community',
    description: 'Your cause, a bank QR for donations and updates.',
    icon: 'i-lucide-hand-heart',
    preview: { bg: '#EEF3E2', accent: '#7A9A3B' },
    build: () => ({
      title: s('Warm Winter Fund', 'Quỹ Áo Ấm Mùa Đông'),
      bio: s('Warm clothes and school supplies for children in the mountains.', 'Áo ấm và đồ dùng học tập cho trẻ em vùng cao.'),
      avatarUrl: photo('charity-avatar'),
      themeConfig: look({
        bg: '#EEF3E2', text: '#2E3B1F', accent: '#7A9A3B', onAccent: '#FFFFFF', surface: '#FFFFFF', radius: 16,
        nameFont: 'Be Vietnam Pro, sans-serif', nameWeight: '700', nameSize: '1.875rem', bodyFont: 'Be Vietnam Pro, sans-serif',
        header: 'banner-circle', banner: photo('charity-cover'), link: 'centered', social: 'soft',
      }),
      blocks: withIndex([
        { name: 'text', data: { title: s('Our goal', 'Mục tiêu'), content: s('500 coats and 300 school bags before December. Every gift is photographed and reported back.', '500 áo ấm và 300 cặp sách trước tháng Mười Hai. Mọi phần quà đều được chụp ảnh và báo cáo lại.'), align: 'center', style: 'plain' } },
        { name: 'vietqr', data: {} },
        { name: 'menu', data: { title: s('What your gift buys', 'Số tiền bạn góp'), currency: '₫', layout: 'list', sections: menu([
          { name: '', items: [[s('One warm coat', 'Một chiếc áo ấm'), '150,000'], [s('A school bag with books', 'Một cặp sách kèm vở'), '200,000'], [s('A winter kit', 'Một bộ quà mùa đông'), '500,000']] },
        ]) } },
        { name: 'image-album', data: { title: s('Last trip', 'Chuyến đi trước'), images: album('charity-1', 'charity-2'), layout: 'grid' } },
        { name: 'links', data: { items: links([s('Monthly report', 'Báo cáo hằng tháng'), ''], [s('Volunteer with us', 'Đăng ký tình nguyện'), '']) } },
        { name: 'social', data: { links: social('facebook', 'zalo', 'youtube') } },
      ] as Blocks),
      room: studioRoom('#e6eed6', '#b9a37f', '#7a9a3b', s('Donate', 'Ủng hộ')),
    }),
  },
]
