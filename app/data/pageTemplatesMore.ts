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

export type Blocks = Omit<BioBlock, 'index' | 'hidden'>[]

export function reviews(...items: [string, string, string?][]) {
  return items.map(([quote, author, detail]) => ({ id: nanoid(6), quote, author, detail, rating: 5 }))
}

export function hours(open: string, close: string, closedDays: number[] = []) {
  return DEFAULT_OPENING_DAYS.map(d => ({ ...d, open, close, closed: closedDays.includes(d.day) }))
}

export const booking = (date = true, time = true, guests = false, service = true) =>
  ({ phone: true, email: false, date, time, guests, message: true, service })

// ---- 3D rooms, reused with each template's colours ----

export type Obj = Omit<RoomObject, 'id' | 'scale'>

/** A shop or salon: counter, shelves and a lit sign that links somewhere */
export function shopRoom(wall: string, floor: string, accent: string, label: string, extra: Obj[] = []) {
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
export function loungeRoom(wall: string, floor: string, accent: string, label: string, extra: Obj[] = []) {
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
export function studioRoom(wall: string, floor: string, accent: string, label: string, extra: Obj[] = []) {
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
export function nightRoom(wall: string, accent: string, label: string, extra: Obj[] = []) {
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
export function giftRoom(wall: string, floor: string, accent: string, sign: string, photos: string[], mode: 'day' | 'night', trackId: string, extra: Obj[] = []): RoomConfig {
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
      title: s('Happy birthday, Lily! 🎂', 'Chúc mừng sinh nhật Lily! 🎂'),
      bio: s('Your friends filled this room with wishes. Tap 💌 to add yours.', 'Bạn bè đã gửi lời chúc vào căn phòng này. Bấm 💌 để gửi lời chúc của bạn.'),
      avatarUrl: photo('birthday-avatar'),
      themeConfig: {
        ...look({
          bg: '#FFE4EF', text: '#5B1A3A', accent: '#E8457A', onAccent: '#FFFFFF', surface: '#FFFFFF', radius: 24, shadow: 'md',
          nameFont: 'Pacifico, cursive', nameWeight: '400', nameSize: '2.1rem', bodyFont: 'Nunito, sans-serif',
          header: 'banner-circle', banner: photo('birthday-cover'), link: 'centered', social: 'filled',
        }),
        pageMode: '3d',
      },
      blocks: withIndex([
        { name: 'letter', data: { to: s('Lily', 'Lily'), body: s('Happy birthday!\nWe made you a little room on the internet: walk around, open the photos, and read what everyone wrote for you.\nThank you for every laugh this year. Here’s to many more. 💛', 'Chúc mừng sinh nhật!\nTụi mình làm tặng bạn một căn phòng nhỏ trên mạng: đi một vòng, xem ảnh và đọc lời chúc mọi người gửi nhé.\nCảm ơn bạn vì bao nhiêu tiếng cười năm qua. Chúc bạn tuổi mới thật rực rỡ. 💛'), from: s('Your best friends', 'Hội bạn thân'), sealed: true, paper: 'blush' } },
        { name: 'birthday-countdown', data: { birthDate: '2001-03-15', theme: 'party', showAge: true, label: s('Next birthday in', 'Còn bao lâu đến sinh nhật'), mode: 'until', repeat: true } },
        { name: 'timeline', data: { title: s('Our best moments', 'Kỷ niệm đáng nhớ'), items: [
          { id: nanoid(6), date: s('Spring', 'Mùa xuân'), title: s('The road trip', 'Chuyến đi phượt'), text: s('Four people, one tiny car and too many snacks.', 'Bốn đứa, một chiếc xe bé xíu và quá nhiều đồ ăn vặt.') },
          { id: nanoid(6), date: s('Summer', 'Mùa hè'), title: s('Karaoke night', 'Đêm karaoke'), text: s('You sang every song. Every single one.', 'Bạn hát hết mọi bài. Không chừa bài nào.'), imageUrl: photo('birthday-1') },
          { id: nanoid(6), date: s('Today', 'Hôm nay'), title: s('Your birthday!', 'Sinh nhật bạn!'), text: s('Leave a wish in the room. 🎈', 'Để lại một lời chúc trong phòng nhé. 🎈') },
        ] } },
        { name: 'image-album', data: { title: s('Memories', 'Kỷ niệm'), images: album('birthday-2', 'birthday-cover'), layout: 'grid' } },
      ] as Blocks),
      room: giftRoom('#ffe4ef', '#e8c4a0', '#e8457a', s('Happy birthday!', 'Chúc mừng sinh nhật!'), ['birthday-avatar', 'birthday-1', 'birthday-2'], 'day', 'playful-kids'),
    }),
  },
  {
    id: 'gift-love',
    name: 'Love room',
    category: 'gifts',
    description: 'Surprise your partner: a love letter, the days you’ve been together, your story and your photos, in a 3D room.',
    icon: 'i-lucide-heart',
    preview: { bg: '#24101E', accent: '#FF5C8A' },
    build: () => ({
      title: s('For you, Ethan ❤️', 'Gửi Ethan của em ❤️'),
      bio: s('Every day with you is my favourite day.', 'Mỗi ngày bên anh đều là ngày em thích nhất.'),
      avatarUrl: photo('love-avatar'),
      themeConfig: {
        ...look({
          bg: '#24101E', text: '#FFE9F0', accent: '#FF5C8A', onAccent: '#FFFFFF', surface: '#33182B', radius: 22, shadow: 'md',
          nameFont: 'Dancing Script, cursive', nameWeight: '700', nameSize: '2.5rem', bodyFont: 'Nunito, sans-serif',
          header: 'banner-circle', banner: photo('love-cover'), link: 'centered', social: 'soft', gap: 'relaxed',
        }),
        pageMode: '3d',
      },
      blocks: withIndex([
        { name: 'letter', data: { to: s('Ethan', 'anh'), body: s('Thank you for every ordinary day that felt special with you.\nI made this little room to keep our favourite moments in one place. Walk around, open the photos, and leave me a message.\nI love you, today and every day after.', 'Cảm ơn anh vì những ngày bình thường mà ở bên anh lại thành đặc biệt.\nEm làm căn phòng nhỏ này để giữ những khoảnh khắc mình thích nhất. Anh đi một vòng, xem ảnh rồi để lại cho em một lời nhắn nhé.\nEm yêu anh, hôm nay và cả những ngày sau nữa.'), from: s('Love, Mia', 'Thương anh, Mia'), sealed: true, paper: 'blush' } },
        { name: 'birthday-countdown', data: { birthDate: '2024-02-14', theme: 'card', showAge: false, label: s('Together for', 'Mình đã bên nhau'), mode: 'since' } },
        { name: 'timeline', data: { title: s('Our love story', 'Chuyện của chúng mình'), items: [
          { id: nanoid(6), date: s('Feb 2024', 'Tháng 2, 2024'), title: s('The first coffee', 'Ly cà phê đầu tiên'), text: s('You were late, and I didn’t mind at all.', 'Anh đến trễ, mà em chẳng giận chút nào.'), imageUrl: photo('love-1') },
          { id: nanoid(6), date: s('Summer 2024', 'Hè 2024'), title: s('Our first trip', 'Chuyến đi đầu tiên'), text: s('Sunburn, street food and a sunset we still talk about.', 'Cháy nắng, ăn vặt và một hoàng hôn tới giờ vẫn nhắc.'), imageUrl: photo('love-2') },
          { id: nanoid(6), date: s('Dec 2024', 'Tháng 12, 2024'), title: s('Our first Christmas', 'Giáng sinh đầu tiên'), text: s('Fairy lights, hot cocoa and your terrible singing.', 'Đèn lấp lánh, ca cao nóng và giọng hát “khó nghe” của anh.'), imageUrl: photo('love-5') },
          { id: nanoid(6), date: s('Today', 'Hôm nay'), title: s('Still choosing you', 'Vẫn chọn anh'), text: s('And tomorrow, and the day after.', 'Ngày mai, và mãi về sau.') },
        ] } },
        { name: 'image-album', data: { title: s('Us', 'Chúng mình'), images: album('love-6', 'love-7', 'love-4', 'love-3'), layout: 'grid' } },
        { name: 'links', data: { title: s('Our song', 'Bài hát của tụi mình'), items: links([s('Play our song 🎵', 'Nghe bài hát của tụi mình 🎵'), 'https://open.spotify.com']) } },
      ] as Blocks),
      room: giftRoom('#3a1a2c', '#8a5a44', '#ff5c8a', s('Love you', 'Yêu anh'), ['love-avatar', 'love-2', 'love-6'], 'night', 'fairytale-quest'),
    }),
  },
  {
    id: 'wedding-invite',
    name: 'Wedding invitation',
    category: 'events',
    description: 'An online wedding invitation: a letter to your guests, the countdown, the day’s plan, the venue, RSVP and a QR for wedding gifts.',
    icon: 'i-lucide-mail-heart',
    preview: { bg: '#FBF7F1', accent: '#A8834F' },
    build: () => ({
      title: s('Linh & Nam', 'Linh & Nam'),
      bio: s('We’re getting married · Saturday, 12 December 2026', 'Chúng mình về chung một nhà · Thứ Bảy, 12.12.2026'),
      avatarUrl: photo('event-avatar'),
      themeConfig: look({
        bg: '#FBF7F1', text: '#3D3027', accent: '#A8834F', onAccent: '#FFFFFF',
        surface: '#FFFFFF', border: '#EADFCC', radius: 18, shadow: 'sm',
        nameFont: 'Great Vibes, cursive', nameWeight: '400', nameSize: '3rem', headingFont: 'Cormorant Garamond, serif', bodyFont: 'Lora, serif',
        header: 'banner-circle', banner: photo('event-cover'), link: 'centered', social: 'soft', gap: 'relaxed',
      }),
      blocks: withIndex([
        { name: 'letter', data: { to: s('our family and friends', 'gia đình và bạn bè'), body: s('With joy in our hearts, we invite you to celebrate our wedding.\nIt would mean the world to have you with us as we start this new chapter: a day of vows, good food, music and a garden full of flowers.\nPlease let us know if you can come by 30 November.', 'Với niềm hạnh phúc, chúng mình trân trọng mời bạn đến chung vui trong ngày cưới.\nSự hiện diện của bạn là niềm vinh hạnh lớn khi chúng mình bắt đầu một chặng đường mới: một ngày của lời hứa, bữa tiệc ấm cúng, âm nhạc và thật nhiều hoa.\nBạn xác nhận tham dự giúp chúng mình trước ngày 30/11 nhé.'), from: s('Linh & Nam', 'Linh & Nam'), sealed: true, paper: 'cream' } },
        { name: 'birthday-countdown', data: { birthDate: '2026-12-12', theme: 'card', showAge: false, label: s('The big day in', 'Còn bao lâu đến ngày cưới'), mode: 'until', repeat: false } },
        { name: 'timeline', data: { title: s('The day', 'Lịch trình ngày cưới'), items: [
          { id: nanoid(6), date: '09:00', title: s('Family ceremony', 'Lễ gia tiên'), text: s('At the bride’s home, with close family.', 'Tại nhà gái, cùng gia đình hai bên.') },
          { id: nanoid(6), date: '11:00', title: s('Welcome & photos', 'Đón khách & chụp ảnh'), text: s('Drinks in the garden.', 'Tiệc nhẹ ngoài vườn.') },
          { id: nanoid(6), date: '12:00', title: s('Wedding lunch', 'Tiệc cưới'), text: s('Grand ballroom, Rose Garden Hotel.', 'Sảnh chính, khách sạn Rose Garden.') },
          { id: nanoid(6), date: '14:00', title: s('Music & dancing', 'Âm nhạc & giao lưu') },
        ] } },
        { name: 'contact', data: { title: s('Where', 'Địa điểm'), address: s('Rose Garden Hotel, 8 Lake Road', 'Khách sạn Rose Garden, 8 Đường Hồ') } },
        { name: 'form', data: { title: s('Will you come?', 'Bạn sẽ đến chứ?'), kind: 'booking', fields: { phone: true, email: false, date: false, time: false, guests: true, message: true }, submitLabel: s('Count me in', 'Mình sẽ đến') } },
        { name: 'image-album', data: { title: s('Our photos', 'Ảnh cưới'), images: album('photo-1', 'photo-2', 'photo-avatar', 'photo-cover'), layout: 'grid' } },
        { name: 'vietqr', data: {} },
      ] as Blocks),
      room: giftRoom('#fbf3e6', '#d8c3a5', '#a8834f', s('Just married', 'Hạnh phúc'), ['event-avatar', 'photo-2', 'photo-cover'], 'day', 'fairytale-quest'),
    }),
  },
]

// ─── Love pages ───────────────────────────────────────────────────────────
// Pages that open in 2D, with music from the first tap and the 3D room one
// tap away

export const RSVP_FIELDS = { phone: true, email: false, date: false, time: false, guests: true, message: true }

const LOVE_TEMPLATES: PageTemplate[] = [
  {
    id: 'love-valentine',
    name: 'Will you be my Valentine?',
    category: 'gifts',
    description: 'Ask the question: the “no” button runs away, “yes” fills the page with hearts. With a love letter and your photos.',
    icon: 'i-lucide-heart',
    preview: { bg: '#FFE3EC', accent: '#E63962' },
    build: () => ({
      title: s('Hey Lan, a question for you…', 'Lan ơi, anh hỏi cái này…'),
      bio: s('Read to the end. No pressure (there’s only one right answer).', 'Đọc đến cuối nha. Không ép đâu (chỉ có một đáp án đúng thôi).'),
      avatarUrl: photo('val-avatar'),
      themeConfig: {
        ...look({
          bg: '#FFE3EC', text: '#5A1430', accent: '#E63962', onAccent: '#FFFFFF', surface: '#FFFFFF', radius: 26, shadow: 'md',
          nameFont: 'Pacifico, cursive', nameWeight: '400', nameSize: '2rem', headingFont: 'Pacifico, cursive', bodyFont: 'Quicksand, sans-serif',
          header: 'banner-circle', banner: photo('val-cover'), link: 'centered', social: 'soft', gap: 'relaxed',
        }),
        background: { type: 'effect', effectId: 'rose', color: '#FFE3EC' },
        music: { trackId: 'cozy-love-lofi' },
        roomButton: true,
      },
      blocks: withIndex([
        { name: 'question', data: { question: s('Will you be my Valentine?', 'Làm người yêu anh nhé?'), yesLabel: s('Yes! 💘', 'Đồng ý! 💘'), noLabel: s('No', 'Không'), answer: s('I knew it! Saturday, 7 pm. I’ll pick you up 🌹', 'Biết ngay mà! Tối thứ Bảy, 7 giờ anh qua đón nhé 🌹'), playful: true } },
        { name: 'letter', data: { to: s('Lan', 'Lan'), body: s('I’ve wanted to ask you this since the day we got lost looking for that tiny café.\nYou make ordinary days feel like something I want to remember. So I made you a page, because a text message felt too small.', 'Anh muốn hỏi em câu này từ hôm hai đứa lạc đường đi tìm quán cà phê bé xíu đó.\nỞ cạnh em, ngày bình thường cũng thành ngày đáng nhớ. Nên anh làm cho em một trang web, vì tin nhắn thì nhỏ quá.'), from: s('Yours, Minh', 'Minh của em'), sealed: true, paper: 'blush' } },
        { name: 'image-album', data: { title: s('Us, so far', 'Tụi mình đến giờ'), images: album('val-1', 'val-2', 'val-3', 'love-6'), layout: 'grid' } },
        { name: 'links', data: { title: s('Our playlist', 'Playlist của tụi mình'), items: links([s('Songs that remind me of you 🎧', 'Những bài làm anh nhớ em 🎧'), 'https://open.spotify.com']) } },
      ] as Blocks),
      room: giftRoom('#ffe3ec', '#e8c4a0', '#e63962', s('Be mine?', 'Yêu anh nhé?'), ['val-avatar', 'val-1', 'val-3'], 'night', 'cozy-love-lofi'),
    }),
  },
  {
    id: 'love-anniversary',
    name: 'Wedding anniversary',
    category: 'gifts',
    description: 'For your husband or wife: the years you’ve been married, a timeline of your years together, a letter and your wedding photos.',
    icon: 'i-lucide-gem',
    preview: { bg: '#15120F', accent: '#D8B98A' },
    build: () => ({
      title: s('Five years, my love', 'Năm năm rồi, mình nhỉ'),
      bio: s('Happy anniversary. I’d marry you all over again.', 'Chúc mừng kỷ niệm ngày cưới. Nếu được chọn lại, em vẫn chọn anh.'),
      avatarUrl: photo('photo-avatar'),
      themeConfig: {
        ...look({
          bg: '#15120F', text: '#F3E9DA', accent: '#D8B98A', onAccent: '#15120F', surface: '#1F1A15', border: '#3A3026', radius: 16, shadow: 'none',
          nameFont: 'Great Vibes, cursive', nameWeight: '400', nameSize: '2.8rem', headingFont: 'Cormorant Garamond, serif', bodyFont: 'Lora, serif',
          header: 'image-overlay', banner: photo('photo-3'), link: 'centered', social: 'outline', gap: 'relaxed',
        }),
        music: { trackId: 'romantic-piano' },
        roomButton: true,
      },
      blocks: withIndex([
        { name: 'birthday-countdown', data: { birthDate: '2021-11-20', theme: 'card', showAge: false, label: s('Married for', 'Mình đã cưới nhau được'), mode: 'since' } },
        { name: 'letter', data: { to: s('my husband', 'chồng yêu'), body: s('Five years ago you promised to make me laugh every day. You kept your word, even on the hard days.\nThank you for the coffee in bed, for holding my hand at every check-up, for being the calm in our house.\nHere’s to the next fifty.', 'Năm năm trước anh hứa ngày nào cũng làm em cười. Anh giữ lời, kể cả những ngày khó khăn nhất.\nCảm ơn anh vì ly cà phê mỗi sáng, vì luôn nắm tay em mỗi lần đi khám, vì là sự bình yên của nhà mình.\nCòn năm mươi năm nữa nhé.'), from: s('Always yours, Hà', 'Mãi là của anh, Hà'), sealed: true, paper: 'night' } },
        { name: 'timeline', data: { title: s('Our five years', 'Năm năm của tụi mình'), items: [
          { id: nanoid(6), date: '2021', title: s('The wedding', 'Ngày cưới'), text: s('It rained in the morning and cleared up just in time.', 'Sáng mưa, rồi tạnh vừa kịp giờ làm lễ.'), imageUrl: photo('photo-avatar') },
          { id: nanoid(6), date: '2022', title: s('Our first home', 'Căn nhà đầu tiên'), text: s('Two chairs, one table and a lot of plans.', 'Hai cái ghế, một cái bàn và thật nhiều dự định.') },
          { id: nanoid(6), date: '2023', title: s('The trip by the sea', 'Chuyến đi biển'), text: s('Where we said we’d come back every year.', 'Nơi mình hẹn năm nào cũng quay lại.'), imageUrl: photo('photo-1') },
          { id: nanoid(6), date: '2025', title: s('Our little one', 'Thiên thần nhỏ'), text: s('And suddenly our house got louder and happier.', 'Và nhà mình bỗng ồn ào và vui hơn hẳn.') },
          { id: nanoid(6), date: '2026', title: s('Five years', 'Năm năm'), text: s('Still choosing you, every morning.', 'Sáng nào em cũng vẫn chọn anh.') },
        ] } },
        { name: 'image-album', data: { title: s('From our wedding album', 'Từ album cưới'), images: album('photo-2', 'photo-cover', 'event-1', 'photo-4'), layout: 'grid' } },
      ] as Blocks),
      room: giftRoom('#2a221b', '#6b4f3a', '#d8b98a', s('5 years', '5 năm'), ['photo-avatar', 'photo-2', 'photo-1'], 'night', 'romantic-piano'),
    }),
  },
  {
    id: 'love-open-when',
    name: '“Open when…” letters',
    category: 'gifts',
    description: 'A stack of sealed letters for the moments you can’t be there: open when you miss me, when you can’t sleep, on your birthday.',
    icon: 'i-lucide-mails',
    preview: { bg: '#F4EDE1', accent: '#B5523B' },
    build: () => ({
      title: s('Letters for you, Mai', 'Thư cho em, Mai'),
      bio: s('One for each moment. Open only when it’s time (I’ll know if you cheat).', 'Mỗi lá cho một khoảnh khắc. Đến lúc mới được mở nha (mở trước là anh biết đó).'),
      avatarUrl: photo('letters-avatar'),
      themeConfig: {
        ...look({
          bg: '#F4EDE1', text: '#3B2F2A', accent: '#B5523B', onAccent: '#FFFFFF', surface: '#FFFDF8', border: '#E6D9C3', radius: 14, shadow: 'sm',
          nameFont: 'Dancing Script, cursive', nameWeight: '700', nameSize: '2.4rem', headingFont: 'Dancing Script, cursive', bodyFont: 'Lora, serif',
          header: 'banner-circle', banner: photo('letters-cover'), link: 'centered', social: 'soft', gap: 'relaxed',
        }),
        background: { type: 'solid', color: '#F4EDE1', pattern: { id: 'lines', color: '#B5523B' } },
        music: { trackId: 'love-acoustic' },
      },
      blocks: withIndex([
        { name: 'letter', data: { cover: s('Open when you miss me', 'Mở khi em nhớ anh'), to: s('Mai', 'Mai'), body: s('Close your eyes and count to ten. That’s about how long it takes me to think of you again.\nCall me. Whatever time it is, I’ll pick up.', 'Nhắm mắt lại, đếm đến mười. Chừng đó là đủ để anh lại nghĩ về em rồi.\nGọi anh đi. Mấy giờ anh cũng nghe máy.'), from: s('Minh', 'Minh'), sealed: true, paper: 'cream' } },
        { name: 'letter', data: { cover: s('Open when you can’t sleep', 'Mở khi em không ngủ được'), to: s('Mai', 'Mai'), body: s('Put on the playlist below, drink some warm milk, and remember: tomorrow is a new page.\nYou did enough today. Rest.', 'Mở playlist bên dưới, uống ly sữa ấm, và nhớ rằng ngày mai là một trang mới.\nHôm nay em đã cố gắng đủ rồi. Ngủ ngon nha.'), from: s('Minh', 'Minh'), sealed: true, paper: 'night' } },
        { name: 'letter', data: { cover: s('Open when we’ve had a fight', 'Mở khi mình giận nhau'), to: s('Mai', 'Mai'), body: s('I’m probably being stubborn right now. I’m sorry.\nWhatever it was, it’s smaller than us. Come here.', 'Chắc giờ anh đang cứng đầu lắm. Anh xin lỗi.\nChuyện gì thì cũng nhỏ hơn tụi mình. Lại đây nào.'), from: s('Minh', 'Minh'), sealed: true, paper: 'blush' } },
        { name: 'letter', data: { cover: s('Open on your birthday', 'Mở vào sinh nhật em'), to: s('Mai', 'Mai'), body: s('Happy birthday to my favourite person.\nCheck the drawer under your desk. 🎁', 'Chúc mừng sinh nhật người anh thương nhất.\nMở ngăn kéo dưới bàn làm việc ra xem nhé. 🎁'), from: s('Minh', 'Minh'), sealed: true, paper: 'cream' } },
        { name: 'links', data: { title: s('For sleepless nights', 'Cho những đêm khó ngủ'), items: links([s('Our sleepy playlist 🌙', 'Playlist ru ngủ 🌙'), 'https://open.spotify.com']) } },
      ] as Blocks),
      room: giftRoom('#f4ede1', '#c9a27e', '#b5523b', s('Open when…', 'Mở khi…'), ['letters-avatar', 'letters-1', 'love-1'], 'day', 'love-acoustic'),
    }),
  },
  {
    id: 'love-long-distance',
    name: 'Long-distance love',
    category: 'gifts',
    description: 'For a love far away: the days until you meet again, the times you’ve met, a letter and the photos from your last trip.',
    icon: 'i-lucide-plane',
    preview: { bg: '#0F1433', accent: '#B9A7FF' },
    build: () => ({
      title: s('Hanoi ✈ Saigon', 'Hà Nội ✈ Sài Gòn'),
      bio: s('1,137 km apart, and still the closest person to me.', 'Cách nhau 1.137 km, mà vẫn là người gần anh nhất.'),
      avatarUrl: photo('ld-avatar'),
      themeConfig: {
        ...look({
          bg: '#0F1433', text: '#ECE8FF', accent: '#B9A7FF', onAccent: '#15183A', surface: '#1A2050', radius: 20, shadow: 'glow',
          nameFont: 'Dancing Script, cursive', nameWeight: '700', nameSize: '2.4rem', headingFont: 'Quicksand, sans-serif', bodyFont: 'Quicksand, sans-serif',
          header: 'banner-circle', banner: photo('ld-cover'), link: 'centered', social: 'soft', gap: 'relaxed',
        }),
        background: { type: 'effect', effectId: 'snow', color: '#0F1433' },
        music: { trackId: 'romantic-date' },
        roomButton: true,
      },
      blocks: withIndex([
        { name: 'birthday-countdown', data: { birthDate: '2026-12-24', theme: 'card', showAge: false, label: s('Until I see you again', 'Còn bao lâu nữa mình gặp nhau'), mode: 'until', repeat: false } },
        { name: 'letter', data: { to: s('my faraway girl', 'cô gái ở xa của anh'), body: s('Every night at ten, when we say goodnight on video, I count one day less.\nDistance is just a test, and we’re passing it. See you at the arrivals gate. I’ll be the one with the flowers.', 'Mỗi tối mười giờ, lúc mình chúc ngủ ngon qua video, anh lại gạch đi một ngày.\nKhoảng cách chỉ là bài kiểm tra, và tụi mình đang qua bài rất tốt. Hẹn em ở cổng đến. Người cầm hoa là anh đó.'), from: s('Your Huy', 'Huy của em'), sealed: true, paper: 'night' } },
        { name: 'timeline', data: { title: s('Every time we met', 'Những lần mình gặp nhau'), items: [
          { id: nanoid(6), date: s('March', 'Tháng 3'), title: s('The first flight', 'Chuyến bay đầu tiên'), text: s('Three days in Hanoi, and I missed my flight home on purpose.', 'Ba ngày ở Hà Nội, và anh cố tình lỡ chuyến bay về.'), imageUrl: photo('ld-2') },
          { id: nanoid(6), date: s('June', 'Tháng 6'), title: s('Summer in Saigon', 'Mùa hè Sài Gòn'), text: s('Rain every afternoon, and we didn’t mind.', 'Chiều nào cũng mưa, mà hai đứa chẳng ai phàn nàn.') },
          { id: nanoid(6), date: s('September', 'Tháng 9'), title: s('Halfway, in Da Nang', 'Gặp nhau ở Đà Nẵng'), text: s('We met in the middle, by the sea.', 'Mỗi người đi một nửa đường, gặp nhau bên biển.'), imageUrl: photo('ld-1') },
          { id: nanoid(6), date: s('Christmas', 'Giáng sinh'), title: s('Next stop: you', 'Điểm đến tiếp theo: em'), text: s('Ticket booked. ✈', 'Vé đã đặt rồi. ✈') },
        ] } },
        { name: 'image-album', data: { title: s('Our last trip', 'Chuyến đi gần nhất'), images: album('love-2', 'love-7', 'love-4', 'love-cover'), layout: 'grid' } },
      ] as Blocks),
      room: giftRoom('#1a2050', '#3b3f6b', '#b9a7ff', s('See you soon', 'Sắp gặp rồi'), ['ld-avatar', 'ld-2', 'ld-1'], 'night', 'romantic-date'),
    }),
  },
  {
    id: 'love-sorry',
    name: 'Make up after a fight',
    category: 'gifts',
    description: 'Say sorry properly: an apology letter, your promises, the good times and a “forgive me?” question with a runaway “no”.',
    icon: 'i-lucide-heart-handshake',
    preview: { bg: '#FFF1E6', accent: '#FF7A59' },
    build: () => ({
      title: s('I’m sorry, Vy 🥺', 'Anh xin lỗi, Vy 🥺'),
      bio: s('I was wrong. Here’s my whole apology, with pictures.', 'Anh sai rồi. Đây là lời xin lỗi đầy đủ, có cả hình minh hoạ.'),
      avatarUrl: photo('sorry-avatar'),
      themeConfig: {
        ...look({
          bg: '#FFF1E6', text: '#4A2A22', accent: '#FF7A59', onAccent: '#FFFFFF', surface: '#FFFFFF', radius: 24, shadow: 'md',
          nameFont: 'Pacifico, cursive', nameWeight: '400', nameSize: '2rem', headingFont: 'Quicksand, sans-serif', bodyFont: 'Quicksand, sans-serif',
          header: 'banner-circle', banner: photo('sorry-cover'), link: 'centered', social: 'soft', gap: 'relaxed',
        }),
        background: { type: 'gradient', color: '#FFF1E6', gradient: { style: 'mesh', from: '#FFD6C9', via: '#FFF1E6', to: '#FFE0EC' } },
        music: { trackId: 'cozy-love-lofi' },
      },
      blocks: withIndex([
        { name: 'letter', data: { to: s('Vy', 'Vy'), body: s('I shouldn’t have raised my voice, and I shouldn’t have gone quiet after.\nYou were right to be upset. I’m not making excuses, I’m making it right.', 'Anh không nên lớn tiếng, càng không nên im lặng sau đó.\nEm giận là đúng. Anh không biện minh đâu, anh sẽ sửa.'), from: s('Your (very sorry) Khoa', 'Khoa (biết lỗi rồi) của em'), sealed: true, paper: 'blush' } },
        { name: 'timeline', data: { title: s('What I promise', 'Anh hứa'), items: [
          { id: nanoid(6), date: '01', title: s('Listen first', 'Nghe em nói hết'), text: s('Before I answer, and without checking my phone.', 'Trước khi trả lời, và không cầm điện thoại.') },
          { id: nanoid(6), date: '02', title: s('Never go to sleep angry', 'Không giận qua đêm'), text: s('We talk it out, even if it takes a while.', 'Nói chuyện cho xong, lâu mấy cũng được.') },
          { id: nanoid(6), date: '03', title: s('Milk tea, every Friday', 'Trà sữa mỗi thứ Sáu'), text: s('Full sugar, extra pearls. As long as you like.', 'Đủ đường, thêm trân châu. Đến khi nào em chán thì thôi.') },
        ] } },
        { name: 'image-album', data: { title: s('Remember how happy we are?', 'Nhớ tụi mình vui thế này không?'), images: album('sorry-1', 'val-2', 'love-6', 'sorry-2'), layout: 'grid' } },
        { name: 'question', data: { question: s('Forgive me?', 'Tha thứ cho anh nhé?'), yesLabel: s('Okay, fine 🙂', 'Thôi được rồi 🙂'), noLabel: s('No', 'Không'), answer: s('Thank you! Milk tea is on its way 🧋', 'Cảm ơn em! Trà sữa đang trên đường tới 🧋'), playful: true } },
      ] as Blocks),
      room: giftRoom('#fff1e6', '#e8c4a0', '#ff7a59', s('Sorry!', 'Xin lỗi!'), ['sorry-avatar', 'sorry-1', 'val-2'], 'day', 'cozy-love-lofi'),
    }),
  },
]

// ─── Invitations ──────────────────────────────────────────────────────────

const INVITE_TEMPLATES: PageTemplate[] = [
  {
    id: 'invite-wedding-red',
    name: 'Traditional wedding invitation',
    category: 'events',
    description: 'A Vietnamese wedding invitation in red and gold: both families, the engagement and the wedding party, RSVP and a QR for wedding gifts.',
    icon: 'i-lucide-heart',
    preview: { bg: '#7E1016', accent: '#E9C46A' },
    build: () => ({
      title: s('Thu Trang ❤ Đức Anh', 'Thu Trang ❤ Đức Anh'),
      bio: s('Together with our families, we invite you to our wedding.', 'Trân trọng kính mời bạn đến dự lễ thành hôn của chúng mình.'),
      avatarUrl: photo('vn-wedding-avatar'),
      themeConfig: {
        ...look({
          bg: '#7E1016', text: '#FCEBD0', accent: '#E9C46A', onAccent: '#5E0B10', surface: '#8E1A20', border: '#C9A04E', radius: 14, shadow: 'none',
          nameFont: 'Great Vibes, cursive', nameWeight: '400', nameSize: '2.6rem', headingFont: 'Playfair Display, serif', bodyFont: 'Lora, serif',
          header: 'banner-circle', banner: photo('vn-wedding-cover'), link: 'centered', social: 'outline', gap: 'relaxed',
        }),
        background: { type: 'gradient', color: '#7E1016', gradient: { angle: 180, from: '#8E1B1F', to: '#5E0B10' } },
        music: { trackId: 'romantic-piano' },
      },
      blocks: withIndex([
        { name: 'letter', data: { to: s('our dear guest', 'quý khách'), body: s('Our families are delighted to announce the marriage of our children, Thu Trang and Đức Anh.\nWe would be honoured to have you with us to share this happy day.', 'Hai gia đình chúng tôi trân trọng báo tin vui lễ thành hôn của con chúng tôi: Thu Trang và Đức Anh.\nSự hiện diện của quý khách là niềm vinh hạnh cho gia đình chúng tôi.'), from: s('Thu Trang & Đức Anh', 'Thu Trang & Đức Anh'), sealed: true, paper: 'cream', personal: true } },
        { name: 'text', data: { title: s('Our families', 'Hai gia đình'), content: s('The bride’s family\nMr Nguyễn Văn Hùng · Mrs Trần Thị Lan\nHanoi\n\nThe groom’s family\nMr Lê Minh Tuấn · Mrs Phạm Thu Hà\nNam Định', 'Nhà gái\nÔng Nguyễn Văn Hùng · Bà Trần Thị Lan\nHà Nội\n\nNhà trai\nÔng Lê Minh Tuấn · Bà Phạm Thu Hà\nNam Định'), align: 'center', style: 'card' } },
        { name: 'birthday-countdown', data: { birthDate: '2026-12-20', theme: 'card', showAge: false, label: s('Our wedding day in', 'Còn bao lâu đến ngày vui'), mode: 'until', repeat: false } },
        { name: 'event', data: { name: s('Engagement ceremony', 'Lễ Vu Quy'), date: '2026-12-20', startTime: '08:00', venue: s('The bride’s home', 'Tư gia nhà gái'), address: s('25 Hang Bac Street, Hoan Kiem, Hanoi', '25 Hàng Bạc, Hoàn Kiếm, Hà Nội') } },
        { name: 'event', data: { name: s('Wedding party', 'Tiệc cưới'), date: '2026-12-20', startTime: '11:00', endTime: '14:00', venue: s('Golden Lotus Restaurant, Hall A', 'Nhà hàng Sen Vàng, sảnh A'), address: s('88 Tran Hung Dao, Hoan Kiem, Hanoi', '88 Trần Hưng Đạo, Hoàn Kiếm, Hà Nội'), note: s('Guests are welcomed from 10:30.', 'Đón khách từ 10 giờ 30.') } },
        { name: 'image-album', data: { title: s('Our wedding photos', 'Album ảnh cưới'), images: album('vn-wedding-1', 'vn-wedding-2', 'vn-wedding-3', 'vn-wedding-4'), layout: 'grid' } },
        { name: 'form', data: { title: s('Will you join us?', 'Bạn sẽ đến chung vui chứ?'), kind: 'rsvp', fields: RSVP_FIELDS, submitLabel: s('Send my reply', 'Gửi xác nhận') } },
        { name: 'vietqr', data: {} },
      ] as Blocks),
      room: giftRoom('#8e1b1f', '#6b3a1f', '#e9c46a', s('Happy wedding', 'Song hỷ'), ['vn-wedding-avatar', 'vn-wedding-1', 'vn-wedding-2'], 'day', 'romantic-piano'),
    }),
  },
  {
    id: 'invite-wedding-garden',
    name: 'Garden wedding invitation',
    category: 'events',
    description: 'A light, modern wedding invitation in sage green: ceremony and reception, your story, dress code, RSVP and photos.',
    icon: 'i-lucide-flower-2',
    preview: { bg: '#EEF1EA', accent: '#5F7F63' },
    build: () => ({
      title: s('Chloe & Daniel', 'Chloe & Daniel'),
      bio: s('Saturday, 9 January 2027 · The Olive Garden, Da Lat', 'Thứ Bảy, 09.01.2027 · Vườn Ô Liu, Đà Lạt'),
      avatarUrl: photo('garden-avatar'),
      themeConfig: {
        ...look({
          bg: '#EEF1EA', text: '#2E3A2F', accent: '#5F7F63', onAccent: '#FFFFFF', surface: '#FFFFFF', border: '#D9E0D3', radius: 4, shadow: 'none',
          nameFont: 'Birthstone, cursive', nameWeight: '400', nameSize: '3rem', headingFont: 'Cormorant Garamond, serif', bodyFont: 'Josefin Sans, sans-serif',
          header: 'cover', banner: photo('garden-cover'), link: 'centered', social: 'outline', gap: 'relaxed',
        }),
        music: { trackId: 'love-acoustic' },
      },
      blocks: withIndex([
        { name: 'text', data: { title: s('You’re invited', 'Trân trọng kính mời'), content: s('We’re getting married under the olive trees, and we’d love you to be there. Expect flowers, a long table, good wine and dancing until late.', 'Chúng mình sẽ cưới dưới hàng cây ô liu, và rất mong có bạn ở đó. Sẽ có hoa, một bàn tiệc dài, rượu ngon và nhảy đến khuya.'), align: 'center', style: 'plain' } },
        { name: 'event', data: { name: s('Ceremony', 'Lễ cưới'), date: '2027-01-09', startTime: '16:00', endTime: '17:00', venue: s('The Olive Garden', 'Vườn Ô Liu'), address: s('12 Hoa Hong Street, Ward 4, Da Lat', '12 Hoa Hồng, Phường 4, Đà Lạt'), dressCode: s('Garden formal, soft colours', 'Lịch sự, tông màu nhẹ') } },
        { name: 'event', data: { name: s('Dinner & dancing', 'Tiệc tối & khiêu vũ'), date: '2027-01-09', startTime: '18:00', endTime: '22:30', venue: s('The Glasshouse', 'Nhà kính'), address: s('12 Hoa Hong Street, Ward 4, Da Lat', '12 Hoa Hồng, Phường 4, Đà Lạt'), note: s('Da Lat gets cold at night: bring a jacket.', 'Đà Lạt về đêm khá lạnh, bạn mang theo áo khoác nhé.') } },
        { name: 'timeline', data: { title: s('How we got here', 'Hành trình của chúng mình'), items: [
          { id: nanoid(6), date: '2019', title: s('A rainy bookshop', 'Hiệu sách ngày mưa'), text: s('Same book, same shelf, same moment.', 'Cùng một cuốn sách, cùng một kệ, cùng một lúc.') },
          { id: nanoid(6), date: '2023', title: s('Moving in', 'Về chung nhà'), text: s('Two cats, three plants, one tiny flat.', 'Hai con mèo, ba chậu cây, một căn hộ bé xíu.') },
          { id: nanoid(6), date: '2026', title: s('The question', 'Lời cầu hôn'), text: s('Under the same olive tree we’re getting married beneath.', 'Dưới chính cây ô liu nơi chúng mình sẽ làm lễ.'), imageUrl: photo('garden-2') },
        ] } },
        { name: 'image-album', data: { title: s('Photos', 'Ảnh của chúng mình'), images: album('garden-1', 'garden-3', 'photo-2', 'florist-1'), layout: 'masonry' } },
        { name: 'form', data: { title: s('Kindly reply by 15 December', 'Vui lòng xác nhận trước 15/12'), kind: 'rsvp', fields: RSVP_FIELDS, submitLabel: s('Send reply', 'Gửi phản hồi') } },
        { name: 'vietqr', data: {} },
      ] as Blocks),
      room: giftRoom('#eef1ea', '#c8b48f', '#5f7f63', s('Chloe + Daniel', 'Chloe + Daniel'), ['garden-avatar', 'garden-1', 'garden-2'], 'day', 'love-acoustic'),
    }),
  },
  {
    id: 'invite-kids-birthday',
    name: 'Kid’s birthday invitation',
    category: 'events',
    description: 'A bright invitation to a first birthday or a kid’s party: countdown, the party plan, the place, RSVP and photos.',
    icon: 'i-lucide-cake',
    preview: { bg: '#FFF6D8', accent: '#3FA7D6' },
    build: () => ({
      title: s('Bông is turning one! 🎈', 'Bé Bông tròn 1 tuổi! 🎈'),
      bio: s('Come and celebrate with cake, balloons and lots of giggles.', 'Mời cô chú, anh chị đến chung vui cùng bé: bánh kem, bóng bay và thật nhiều tiếng cười.'),
      avatarUrl: photo('kids-avatar'),
      themeConfig: {
        ...look({
          bg: '#FFF6D8', text: '#3A3A52', accent: '#3FA7D6', onAccent: '#FFFFFF', surface: '#FFFFFF', radius: 28, shadow: 'md',
          nameFont: 'Pacifico, cursive', nameWeight: '400', nameSize: '2.1rem', headingFont: 'Comfortaa, sans-serif', bodyFont: 'Quicksand, sans-serif',
          header: 'banner-circle', banner: photo('kids-cover'), link: 'centered', social: 'filled', gap: 'normal',
        }),
        background: { type: 'solid', color: '#FFF6D8', pattern: { id: 'dots', color: '#F4A259' } },
        music: { trackId: 'happy-birthday' },
      },
      blocks: withIndex([
        { name: 'birthday-countdown', data: { birthDate: '2026-12-06', theme: 'party', showAge: false, label: s('Party starts in', 'Còn bao lâu đến tiệc'), mode: 'until', repeat: false } },
        { name: 'event', data: { name: s('Bông’s first birthday', 'Sinh nhật đầu tiên của Bông'), date: '2026-12-06', startTime: '10:00', endTime: '13:00', venue: s('Sunny Kids Café', 'Sunny Kids Café'), address: s('45 Nguyen Van Huong, Thao Dien, Thu Duc', '45 Nguyễn Văn Hưởng, Thảo Điền, Thủ Đức'), note: s('There’s a play area, so bring socks for the little ones.', 'Có khu vui chơi, các bé nhớ mang tất nhé.') } },
        { name: 'timeline', data: { title: s('The plan', 'Chương trình'), items: [
          { id: nanoid(6), date: '10:00', title: s('Welcome & games', 'Đón khách & trò chơi') },
          { id: nanoid(6), date: '10:45', title: s('The first-birthday pick', 'Bé bốc thôi nôi'), text: s('Will it be the pen, the book or the stethoscope?', 'Bé sẽ chọn bút, sách hay ống nghe?') },
          { id: nanoid(6), date: '11:15', title: s('Cake & candles', 'Cắt bánh & thổi nến') },
          { id: nanoid(6), date: '11:30', title: s('Lunch', 'Ăn trưa') },
        ] } },
        { name: 'image-album', data: { title: s('One year of Bông', 'Một năm của Bông'), images: album('kids-1', 'kids-2', 'kids-avatar', 'kids-cover'), layout: 'grid' } },
        { name: 'form', data: { title: s('Will you come?', 'Gia đình bạn sẽ đến chứ?'), kind: 'rsvp', fields: RSVP_FIELDS, submitLabel: s('We’ll be there', 'Gửi xác nhận') } },
      ] as Blocks),
      room: giftRoom('#fff6d8', '#e8c4a0', '#3fa7d6', s('Happy 1st!', 'Mừng 1 tuổi!'), ['kids-avatar', 'kids-1', 'kids-2'], 'day', 'happy-birthday'),
    }),
  },
  {
    id: 'invite-grand-opening',
    name: 'Grand opening invitation',
    category: 'events',
    description: 'Invite customers and partners to your opening: the day’s programme, opening offers, map and directions, RSVP.',
    icon: 'i-lucide-store',
    preview: { bg: '#121212', accent: '#D4AF37' },
    build: () => ({
      title: s('Mộc Coffee · Grand opening', 'Mộc Coffee · Khai trương'),
      bio: s('Our doors open on Saturday 28 November. Come for the first cup on us.', 'Thứ Bảy 28/11, Mộc chính thức mở cửa. Ghé uống ly đầu tiên, Mộc mời.'),
      avatarUrl: photo('cafe-avatar'),
      themeConfig: {
        ...look({
          bg: '#121212', text: '#F5EFE6', accent: '#D4AF37', onAccent: '#121212', surface: '#1C1C1C', border: '#3A3220', radius: 6, shadow: 'none',
          nameFont: 'Playfair Display, serif', nameWeight: '600', nameSize: '2rem', tracking: '0.02em', headingFont: 'Playfair Display, serif', bodyFont: 'Be Vietnam Pro, sans-serif',
          header: 'image-overlay', banner: photo('opening-cover'), link: 'centered', social: 'outline', gap: 'normal',
        }),
        music: { trackId: 'party-celebration' },
      },
      blocks: withIndex([
        { name: 'event', data: { name: s('Grand opening', 'Lễ khai trương'), date: '2026-11-28', startTime: '08:00', endTime: '21:00', venue: 'Mộc Coffee', address: s('120 Le Loi, Ben Thanh, District 1, HCMC', '120 Lê Lợi, Bến Thành, Quận 1, TP.HCM'), note: s('Ribbon cutting at 8:30 with a lion dance.', 'Cắt băng lúc 8 giờ 30, có múa lân.') } },
        { name: 'text', data: { title: s('Opening offers', 'Ưu đãi khai trương'), content: s('☕ Your first drink is free, all day\n🎁 30% off every drink until 5 December\n🍪 A tote bag for the first 100 guests', '☕ Ly đầu tiên miễn phí, cả ngày\n🎁 Giảm 30% mọi đồ uống đến hết 5/12\n🍪 Tặng túi vải cho 100 khách đầu tiên'), align: 'center', style: 'card' } },
        { name: 'timeline', data: { title: s('Programme', 'Chương trình'), items: [
          { id: nanoid(6), date: '08:00', title: s('Doors open', 'Mở cửa đón khách') },
          { id: nanoid(6), date: '08:30', title: s('Ribbon cutting & lion dance', 'Cắt băng khánh thành & múa lân'), imageUrl: photo('opening-1') },
          { id: nanoid(6), date: '15:00', title: s('Latte art show', 'Biểu diễn latte art') },
          { id: nanoid(6), date: '19:00', title: s('Acoustic night', 'Đêm nhạc acoustic') },
        ] } },
        { name: 'image-album', data: { title: s('A first look', 'Không gian quán'), images: album('cafe-1', 'cafe-2', 'cafe-3', 'cafe-4'), layout: 'grid' } },
        { name: 'form', data: { title: s('Let us know you’re coming', 'Báo trước để Mộc giữ chỗ'), kind: 'rsvp', fields: RSVP_FIELDS, submitLabel: s('I’ll come', 'Tôi sẽ đến') } },
        { name: 'contact', data: { title: s('Find us', 'Đường đến quán'), address: s('120 Le Loi, Ben Thanh, District 1, HCMC', '120 Lê Lợi, Bến Thành, Quận 1, TP.HCM'), phone: SAMPLE_PHONE, quickBar: true } },
      ] as Blocks),
      room: loungeRoom('#1c1c1c', '#5b4636', '#d4af37', s('Grand opening', 'Khai trương')),
    }),
  },
  {
    id: 'invite-year-end-party',
    name: 'Year-end party invitation',
    category: 'events',
    description: 'A company year-end party or gala: countdown, the evening’s programme, dress code, RSVP and last year’s photos.',
    icon: 'i-lucide-sparkles',
    preview: { bg: '#0B1026', accent: '#E8C26A' },
    build: () => ({
      title: s('Year-end Gala 2026', 'Tiệc Tất Niên 2026'),
      bio: s('Thank you for an amazing year. Let’s celebrate it together.', 'Cảm ơn một năm tuyệt vời. Cùng nhau ăn mừng nhé!'),
      avatarUrl: photo('gala-2'),
      themeConfig: {
        ...look({
          bg: '#0B1026', text: '#F2EEE3', accent: '#E8C26A', onAccent: '#0B1026', surface: '#141B3D', border: '#2B3366', radius: 12, shadow: 'glow',
          nameFont: 'Playfair Display, serif', nameWeight: '700', nameSize: '2.2rem', headingFont: 'Playfair Display, serif', bodyFont: 'Be Vietnam Pro, sans-serif',
          header: 'image-overlay', banner: photo('gala-cover'), link: 'centered', social: 'outline', gap: 'normal',
        }),
        background: { type: 'effect', effectId: 'snow', color: '#0B1026' },
        music: { trackId: 'party-celebration' },
      },
      blocks: withIndex([
        { name: 'birthday-countdown', data: { birthDate: '2027-01-22', theme: 'card', showAge: false, label: s('The party starts in', 'Còn bao lâu đến tiệc'), mode: 'until', repeat: false } },
        { name: 'event', data: { name: s('Year-end Gala', 'Tiệc Tất Niên'), date: '2027-01-22', startTime: '18:00', endTime: '22:00', venue: s('Riverside Palace, Grand Ballroom', 'Riverside Palace, sảnh Grand'), address: s('360D Ben Van Don, District 4, HCMC', '360D Bến Vân Đồn, Quận 4, TP.HCM'), dressCode: s('Black & gold', 'Đen & vàng ánh kim') } },
        { name: 'timeline', data: { title: s('Tonight', 'Chương trình'), items: [
          { id: nanoid(6), date: '18:00', title: s('Check-in & photo wall', 'Check-in & chụp ảnh') },
          { id: nanoid(6), date: '18:45', title: s('Opening speech', 'Phát biểu khai mạc') },
          { id: nanoid(6), date: '19:15', title: s('Dinner & team awards', 'Tiệc tối & vinh danh tập thể') },
          { id: nanoid(6), date: '20:30', title: s('Lucky draw', 'Bốc thăm may mắn'), text: s('First prize: a trip for two to Phu Quoc.', 'Giải nhất: chuyến du lịch Phú Quốc cho hai người.') },
          { id: nanoid(6), date: '21:00', title: s('Music & dancing', 'Văn nghệ & giao lưu') },
        ] } },
        { name: 'form', data: { title: s('Please reply by 15 January', 'Vui lòng xác nhận trước 15/01'), kind: 'rsvp', fields: { ...RSVP_FIELDS, guests: false }, submitLabel: s('Send reply', 'Gửi xác nhận') } },
        { name: 'image-album', data: { title: s('Last year’s party', 'Tất niên năm ngoái'), images: album('gala-1', 'gala-3', 'gala-2', 'bar-1'), layout: 'grid' } },
      ] as Blocks),
      room: loungeRoom('#141b3d', '#3a2f24', '#e8c26a', s('Cheers to 2026', 'Mừng năm 2026')),
    }),
  },
]

// ─── Personal blog ───────────────────────────────────────────────
const BLOG_TEMPLATE: PageTemplate = {
  id: 'blog',
  name: 'Personal blog',
  category: 'blog',
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
      { name: 'blog', data: { title: s('Latest posts', 'Bài viết mới'), count: 5, samples: [{ title: s('The books that got me through this year', 'Những cuốn sách đưa mình qua năm nay'), coverUrl: photo('personal-work-1'), minutes: 6 }, { title: s('Notes from a slow week in Da Lat', 'Ghi chép một tuần chậm ở Đà Lạt'), coverUrl: photo('personal-work-2'), minutes: 5 }, { title: s('Why I started writing again', 'Vì sao mình bắt đầu viết lại'), coverUrl: photo('personal-work-3'), minutes: 4 }] } },
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

// ─── Blogger templates ───────────────────────────────────────────
// One per kind of blog, each with its own photos, type and background
// (photo banner, gradient, mesh or a moving effect) and a room with the
// blog board on the wall.

const BLOGGER_TEMPLATES: PageTemplate[] = [
  // Travel: a lake at dawn, airy sky gradient, an elegant serif
  {
    id: 'blog-travel', name: 'Travel blog', category: 'blog',
    description: 'Big landscapes, a photo strip of your trips and your latest stories.',
    icon: 'i-lucide-plane', preview: { bg: '#E0F2FE', accent: '#0E7490' },
    build: () => ({
      title: s('Emma · On the road', 'Emma · Trên đường đi'),
      bio: s('42 countries, one backpack. Honest guides, slow travel and the food I find on the way.', '42 quốc gia, một chiếc ba lô. Kinh nghiệm thật, du lịch chậm và những món ngon dọc đường.'),
      avatarUrl: photo('blog-travel-avatar'),
      themeConfig: {
        ...look({
          bg: '#F0F9FF', text: '#0F2A3D', accent: '#0E7490', onAccent: '#FFFFFF',
          surface: '#FFFFFFD9', radius: 20, shadow: 'md',
          nameFont: 'Playfair Display, serif', nameWeight: '700', nameSize: '2.25rem', tracking: '-0.01em',
          header: 'banner-circle', banner: photo('blog-travel-cover'), link: 'centered', social: 'soft',
        }),
        background: { type: 'gradient', color: '#F0F9FF', gradient: { angle: 180, from: '#E0F2FE', via: '#FFF7ED', to: '#FDE68A' } },
      },
      blocks: withIndex([
        { name: 'blog', data: { title: s('Latest from the road', 'Mới nhất từ những chuyến đi'), count: 5, samples: [{ title: s('Three days around Lago di Braies on a budget', '3 ngày quanh hồ Braies với chi phí tiết kiệm'), coverUrl: photo('blog-travel-1'), minutes: 6 }, { title: s('Sunrise balloons over Cappadocia: what to know', 'Ngắm khinh khí cầu ở Cappadocia: cần biết gì'), coverUrl: photo('blog-travel-2'), minutes: 5 }, { title: s('Machu Picchu without the crowds', 'Machu Picchu vắng người: đi lúc nào?'), coverUrl: photo('blog-travel-3'), minutes: 7 }] } },
        { name: 'image-album', data: { images: album('blog-travel-1', 'blog-travel-2', 'blog-travel-3'), layout: 'carousel' } },
        { name: 'links', data: { items: links([s('My packing list', 'Danh sách đồ mang theo'), ''], [s('Work with me', 'Hợp tác cùng mình'), '']) } },
        { name: 'social', data: { links: social('instagram', 'youtube', 'tiktok') } },
      ] as Blocks),
      room: { ...room({ wallColor: '#e8f4fb', floorColor: '#b08968', floorMaterial: 'wood', trimColor: '#ffffff' }, [
        { type: 'blog-board', position: [0.4, 1.7, -3], rotation: 0, wall: 'back', color: '#0E7490' },
        { type: 'picture-frame', position: [-3, 1.6, -0.8], rotation: 0, wall: 'left', color: '#0E7490' },
        { type: 'picture-frame', position: [-3, 1.6, 0.6], rotation: 0, wall: 'left', color: '#f59e0b' },
        { type: 'sofa', position: [0.6, 0, 0.9], rotation: 180, color: '#e9d8a6' },
        { type: 'rug', position: [0.4, 0, 0.2], rotation: 0, color: '#0E7490' },
        { type: 'plant', position: [2.5, 0, -2.4], rotation: 0 },
        { type: 'plant', position: [-2.4, 0, 2.2], rotation: 0 },
        { type: 'floor-lamp', position: [2.5, 0, 1.4], rotation: 0 },
      ]), land: 'island' },
    }),
  },
  // Food: a feast from above, warm cream with dots, a bookish serif
  {
    id: 'blog-food', name: 'Food blog', category: 'blog',
    description: 'Recipes and food stories, with mouth-watering photos up top.',
    icon: 'i-lucide-chef-hat', preview: { bg: '#FFF8F0', accent: '#C2410C' },
    build: () => ({
      title: s('Mia\'s Kitchen', 'Bếp của Mia'),
      bio: s('Home cooking, street food and the stories behind every dish.', 'Món nhà nấu, món ăn đường phố và câu chuyện sau mỗi món.'),
      avatarUrl: photo('blog-food-avatar'),
      themeConfig: {
        ...look({
          bg: '#FFF8F0', text: '#3B2416', accent: '#C2410C', onAccent: '#FFFFFF',
          surface: '#FFFFFF', border: '#F3E3D3', radius: 18,
          nameFont: 'Lora, serif', nameWeight: '700', nameSize: '2.25rem',
          header: 'banner-circle', banner: photo('blog-food-cover'), link: 'centered', social: 'soft',
        }),
        background: { type: 'solid', color: '#FFF8F0', pattern: { id: 'dots', color: '#E9C9AE' } },
      },
      blocks: withIndex([
        { name: 'blog', data: { title: s('New recipes', 'Công thức mới'), count: 5, samples: [{ title: s('Crispy banh xeo at home, step by step', 'Bánh xèo giòn tại nhà, từng bước một'), coverUrl: photo('street-2'), minutes: 8 }, { title: s('The croissant I baked 20 times', 'Chiếc croissant mình nướng 20 lần'), coverUrl: photo('bakery-1'), minutes: 6 }, { title: s('Saigon street snacks under 30k', 'Món ăn vặt Sài Gòn dưới 30 nghìn'), coverUrl: photo('street-1'), minutes: 4 }] } },
        { name: 'image-album', data: { images: album('street-1', 'bakery-1', 'cafe-2', 'street-2'), layout: 'grid' } },
        { name: 'text', data: { title: s('Cook along', 'Nấu cùng Mia'), content: s('Every Sunday a new recipe, tested three times in my small kitchen. Ask me anything in the comments.', 'Mỗi Chủ nhật một công thức mới, đã thử ba lần trong căn bếp nhỏ. Có gì thắc mắc cứ hỏi Mia nhé.'), align: 'center', style: 'plain' } },
        { name: 'social', data: { links: social('instagram', 'tiktok', 'youtube', 'facebook') } },
      ] as Blocks),
      room: room({ wallColor: '#f6e7d8', floorColor: '#9c6644', floorMaterial: 'tile', trimColor: '#ffffff' }, [
        { type: 'blog-board', position: [0.4, 1.7, -3], rotation: 0, wall: 'back', color: '#C2410C' },
        { type: 'cabinet', position: [-1.6, 0, -2.6], rotation: 0, color: '#e9c46a' },
        { type: 'coffee-table', position: [0.6, 0, 0.2], rotation: 0, color: '#9c6644' },
        { type: 'chair', position: [0.6, 0, 1.0], rotation: 180 },
        { type: 'chair', position: [0.6, 0, -0.6], rotation: 0 },
        { type: 'plant', position: [2.5, 0, -2.4], rotation: 0 },
        { type: 'string-lights', position: [-3, 2.5, 0], rotation: 0, wall: 'left', color: '#fbbf24' },
      ]),
    }),
  },
  // Tech: dark with a flickering grid, neon cyan, a geometric sans
  {
    id: 'blog-tech', name: 'Tech & code blog', category: 'blog',
    description: 'Dark, techy and sharp: tutorials, notes and side projects.',
    icon: 'i-lucide-code-xml', preview: { bg: '#0B1020', accent: '#22D3EE' },
    build: () => ({
      title: s('Alex.dev', 'Alex.dev'),
      bio: s('Notes on web development, AI tools and building things on weekends.', 'Ghi chép về lập trình web, công cụ AI và những dự án làm vào cuối tuần.'),
      avatarUrl: photo('blog-tech-avatar'),
      themeConfig: {
        ...look({
          bg: '#0B1020', text: '#E2E8F0', accent: '#22D3EE', onAccent: '#0B1020',
          surface: '#111827E6', border: '#1F2A44', radius: 14,
          nameFont: 'Space Grotesk, sans-serif', nameWeight: '700', nameSize: '2.25rem', tracking: '-0.03em',
          header: 'banner-square', banner: photo('blog-tech-cover'), avatar: 'rounded', link: 'centered', social: 'outline',
        }),
        background: { type: 'effect', effectId: 'neural', color: '#0B1020' },
      },
      blocks: withIndex([
        { name: 'blog', data: { title: s('Latest posts', 'Bài mới'), count: 5, samples: [{ title: s('Building a blog with Nuxt in a weekend', 'Dựng blog bằng Nuxt trong một cuối tuần'), coverUrl: photo('blog-tech-1'), minutes: 9 }, { title: s('My 2026 dev setup', 'Bộ đồ nghề lập trình 2026 của mình'), coverUrl: photo('blog-tech-2'), minutes: 5 }, { title: s('Prompting tips that actually save time', 'Mẹo dùng AI thật sự tiết kiệm thời gian'), coverUrl: photo('blog-tech-cover'), minutes: 6 }] } },
        { name: 'links', data: { items: links(['GitHub', 'https://github.com'], [s('My dev setup', 'Bộ đồ nghề của mình'), ''], [s('Newsletter', 'Bản tin hàng tuần'), '']) } },
        { name: 'image-album', data: { images: album('blog-tech-1', 'blog-tech-2'), layout: 'grid' } },
        { name: 'social', data: { links: social('github', 'linkedin', 'youtube') } },
      ] as Blocks),
      room: { ...room({ wallColor: '#141a2e', floorColor: '#22283d', floorMaterial: 'concrete', trimColor: '#334155' }, [
        { type: 'blog-board', position: [-0.6, 1.7, -3], rotation: 0, wall: 'back', color: '#22D3EE' },
        { type: 'neon-sign', position: [1.6, 2.0, -3], rotation: 0, wall: 'back', color: '#22D3EE', link: { label: 'GitHub', url: 'https://github.com' } },
        { type: 'desk', position: [1.4, 0, -2.6], rotation: 0, color: '#1f2937' },
        { type: 'chair', position: [1.4, 0, -1.8], rotation: 180 },
        { type: 'laptop', position: [1.25, DESK_TOP, -2.6], rotation: 0 },
        { type: 'desk-lamp', position: [1.9, DESK_TOP, -2.7], rotation: 0, color: '#22D3EE' },
        { type: 'string-lights', position: [-3, 2.5, 0], rotation: 0, wall: 'left', color: '#a78bfa' },
        { type: 'rug', position: [0, 0, 0.4], rotation: 0, color: '#1e293b' },
        { type: 'plant', position: [-2.4, 0, 2.2], rotation: 0 },
      ]), land: 'city' },
    }),
  },
  // Fashion: pink mesh, high-contrast serif, editorial photos
  {
    id: 'blog-fashion', name: 'Fashion & beauty blog', category: 'blog',
    description: 'Editorial and dreamy: lookbooks, beauty notes and outfit diaries.',
    icon: 'i-lucide-shirt', preview: { bg: '#FFE4EF', accent: '#BE185D' },
    build: () => ({
      title: s('Chloe Muse', 'Chloe Muse'),
      bio: s('Outfits, skincare and the little rituals that make me feel like me.', 'Phối đồ, chăm da và những thói quen nhỏ giúp mình là chính mình.'),
      avatarUrl: photo('blog-fashion-avatar'),
      themeConfig: {
        ...look({
          bg: '#FFF5FA', text: '#2A1A1F', accent: '#BE185D', onAccent: '#FFFFFF',
          surface: '#FFFFFFCC', radius: 24, shadow: 'sm',
          nameFont: 'Cormorant Garamond, serif', nameWeight: '700', nameSize: '2.75rem', tracking: '-0.01em',
          header: 'banner-circle', banner: photo('blog-fashion-cover'), link: 'centered', social: 'plain',
        }),
        background: { type: 'gradient', color: '#FFF5FA', gradient: { style: 'mesh', from: '#FFC6E0', via: '#E9D5FF', to: '#FFE4CC' } },
      },
      blocks: withIndex([
        { name: 'image-album', data: { images: album('blog-fashion-1', 'blog-fashion-2', 'blog-fashion-3'), layout: 'carousel' } },
        { name: 'blog', data: { title: s('Journal', 'Nhật ký'), count: 5, samples: [{ title: s('10 pieces, 30 outfits: my capsule wardrobe', '10 món đồ, 30 bộ: tủ đồ tối giản của mình'), coverUrl: photo('blog-fashion-1'), minutes: 5 }, { title: s('A 5-minute morning skincare routine', 'Chăm da buổi sáng chỉ 5 phút'), coverUrl: photo('blog-fashion-3'), minutes: 4 }, { title: s('Wearing red, without overthinking it', 'Mặc đồ đỏ mà không ngại'), coverUrl: photo('blog-fashion-2'), minutes: 3 }] } },
        { name: 'links', data: { items: links([s('Shop my looks', 'Mua đồ mình mặc'), ''], [s('Collaborations', 'Hợp tác'), '']) } },
        { name: 'social', data: { links: social('instagram', 'tiktok', 'threads') } },
      ] as Blocks),
      room: { ...room({ wallColor: '#fde2ef', floorColor: '#f5e6ea', floorMaterial: 'carpet', trimColor: '#ffffff' }, [
        { type: 'blog-board', position: [0.4, 1.7, -3], rotation: 0, wall: 'back', color: '#BE185D' },
        { type: 'picture-frame', position: [-3, 1.6, -0.6], rotation: 0, wall: 'left', color: '#f9a8d4' },
        { type: 'sofa', position: [0.6, 0, 0.9], rotation: 180, color: '#f9a8d4' },
        { type: 'rug', position: [0.4, 0, 0.2], rotation: 0, color: '#fbcfe8' },
        { type: 'floor-lamp', position: [2.5, 0, 1.4], rotation: 0 },
        { type: 'plant', position: [2.5, 0, -2.4], rotation: 0 },
        { type: 'string-lights', position: [-3, 2.5, 0], rotation: 0, wall: 'left', color: '#f9a8d4' },
      ]), land: 'sakura' },
    }),
  },
  // Wellness: soft aurora, sage green, a light rounded sans
  {
    id: 'blog-wellness', name: 'Wellness blog', category: 'blog',
    description: 'Calm and fresh: yoga, mindful living and healthy habits.',
    icon: 'i-lucide-leaf', preview: { bg: '#F1F7EE', accent: '#4D7C0F' },
    build: () => ({
      title: s('Slow Mornings', 'Buổi sáng chậm'),
      bio: s('Yoga, breathing and gentle routines for a calmer life.', 'Yoga, hít thở và những thói quen nhẹ nhàng cho cuộc sống bình yên hơn.'),
      avatarUrl: photo('blog-wellness-avatar'),
      themeConfig: {
        ...look({
          bg: '#F7FBF4', text: '#22301C', accent: '#4D7C0F', onAccent: '#FFFFFF',
          surface: '#FFFFFFCC', radius: 28,
          nameFont: 'Josefin Sans, sans-serif', nameWeight: '600', nameSize: '2.25rem', tracking: '0.02em',
          header: 'banner-circle', banner: photo('blog-wellness-cover'), link: 'centered', social: 'soft',
        }),
        background: { type: 'effect', effectId: 'aurora', color: '#F4FAF1' },
      },
      blocks: withIndex([
        { name: 'text', data: { title: s('Breathe in', 'Hít một hơi thật sâu'), content: s('Short practices you can do before breakfast, and what I learned from ten years on the mat.', 'Những bài tập ngắn làm trước bữa sáng, và điều mình học được sau mười năm tập yoga.'), align: 'center', style: 'plain' } },
        { name: 'blog', data: { title: s('From the journal', 'Từ nhật ký'), count: 5, samples: [{ title: s('A 10-minute yoga flow for busy mornings', 'Bài yoga 10 phút cho buổi sáng bận rộn'), coverUrl: photo('blog-wellness-2'), minutes: 4 }, { title: s('Breathing to fall asleep faster', 'Hít thở để ngủ ngon hơn'), coverUrl: photo('blog-wellness-1'), minutes: 3 }, { title: s('What a month without sugar taught me', 'Một tháng không đường dạy mình điều gì'), coverUrl: photo('blog-wellness-cover'), minutes: 6 }] } },
        { name: 'image-album', data: { images: album('blog-wellness-1', 'blog-wellness-2'), layout: 'grid' } },
        { name: 'social', data: { links: social('instagram', 'youtube', 'spotify') } },
      ] as Blocks),
      room: { ...room({ wallColor: '#eef5e9', floorColor: '#c9b28f', floorMaterial: 'wood', trimColor: '#ffffff' }, [
        { type: 'blog-board', position: [0.4, 1.7, -3], rotation: 0, wall: 'back', color: '#4D7C0F' },
        { type: 'rug', position: [0.2, 0, 0.2], rotation: 0, color: '#a3b18a' },
        { type: 'plant', position: [-2.4, 0, -2.4], rotation: 0 },
        { type: 'plant', position: [2.5, 0, -2.4], rotation: 0 },
        { type: 'plant', position: [2.5, 0, 2.2], rotation: 0 },
        { type: 'candle', position: [-0.4, 0, 0.6], rotation: 0 },
        { type: 'window', position: [-3, 1.5, 0], rotation: 0, wall: 'left' },
      ]), land: 'island' },
    }),
  },
  // Family: pastel candy gradient, rounded friendly type
  {
    id: 'blog-family', name: 'Family & parenting blog', category: 'blog',
    description: 'Warm and playful: family life, milestones and honest parenting tips.',
    icon: 'i-lucide-baby', preview: { bg: '#FFF1F7', accent: '#EC4899' },
    build: () => ({
      title: s('Little Ones at Home', 'Nhà có em bé'),
      bio: s('A mum of two writing about sleepless nights, first steps and everything in between.', 'Mẹ hai bé kể chuyện những đêm mất ngủ, bước đi đầu tiên và mọi thứ ở giữa.'),
      avatarUrl: photo('blog-family-avatar'),
      themeConfig: {
        ...look({
          bg: '#FFF7FB', text: '#3F2A3A', accent: '#EC4899', onAccent: '#FFFFFF',
          surface: '#FFFFFFD9', radius: 26, shadow: 'sm',
          nameFont: 'Comfortaa, sans-serif', nameWeight: '700', nameSize: '2.1rem',
          header: 'banner-circle', banner: photo('blog-family-cover'), link: 'centered', social: 'soft',
        }),
        background: { type: 'gradient', color: '#FFF7FB', gradient: { style: 'mesh', from: '#FBCFE8', via: '#BAE6FD', to: '#FEF3C7' } },
      },
      blocks: withIndex([
        { name: 'blog', data: { title: s('Our latest stories', 'Chuyện nhà mới nhất'), count: 5, samples: [{ title: s('Surviving the 4-month sleep regression', 'Vượt qua giai đoạn khủng hoảng ngủ 4 tháng'), coverUrl: photo('blog-family-1'), minutes: 7 }, { title: s('First foods: our baby-led weaning week', 'Tuần đầu ăn dặm tự chỉ huy của bé'), coverUrl: photo('blog-family-2'), minutes: 5 }, { title: s('Packing for a trip with two kids', 'Đi du lịch cùng hai bé cần mang gì'), coverUrl: photo('blog-family-cover'), minutes: 6 }] } },
        { name: 'image-album', data: { images: album('blog-family-1', 'blog-family-2'), layout: 'grid' } },
        { name: 'links', data: { items: links([s('Baby gear I love', 'Đồ cho bé mình tin dùng'), ''], [s('Join our parents group', 'Tham gia nhóm bố mẹ'), '']) } },
        { name: 'social', data: { links: social('facebook', 'instagram', 'tiktok') } },
      ] as Blocks),
      room: room({ wallColor: '#fde7f1', floorColor: '#f1e4d3', floorMaterial: 'carpet', trimColor: '#ffffff' }, [
        { type: 'blog-board', position: [0.4, 1.7, -3], rotation: 0, wall: 'back', color: '#EC4899' },
        { type: 'bed', position: [-2, 0, -1.8], rotation: 90, color: '#bae6fd' },
        { type: 'rug', position: [0.6, 0, 0.6], rotation: 0, color: '#fbcfe8' },
        { type: 'sofa', position: [1.2, 0, 1.4], rotation: 180, color: '#fde68a' },
        { type: 'plant', position: [2.5, 0, -2.4], rotation: 0 },
        { type: 'string-lights', position: [-3, 2.5, 0.6], rotation: 0, wall: 'left', color: '#f9a8d4' },
      ]),
    }),
  },
  // Personal finance & growth: paper with a grid, deep green, a sturdy serif
  {
    id: 'blog-growth', name: 'Money & growth blog', category: 'blog',
    description: 'Clean and trustworthy: personal finance, productivity and books.',
    icon: 'i-lucide-trending-up', preview: { bg: '#F7F7F2', accent: '#166534' },
    build: () => ({
      title: s('Daniel · Notes on money', 'Daniel · Ghi chép tài chính'),
      bio: s('Saving, investing and building good habits, explained without jargon.', 'Tiết kiệm, đầu tư và xây thói quen tốt, giải thích không thuật ngữ.'),
      avatarUrl: photo('blog-growth-avatar'),
      themeConfig: {
        ...look({
          bg: '#F7F7F2', text: '#1C2B22', accent: '#166534', onAccent: '#FFFFFF',
          surface: '#FFFFFF', border: '#E4E4DA', radius: 12,
          nameFont: 'Merriweather, serif', nameWeight: '700', nameSize: '2rem',
          header: 'banner-square', banner: photo('blog-growth-cover'), avatar: 'rounded', link: 'centered', social: 'outline', titleAlign: 'left',
        }),
        background: { type: 'solid', color: '#F7F7F2', pattern: { id: 'grid', color: '#DADACB' } },
      },
      blocks: withIndex([
        { name: 'text', data: { title: s('Start here', 'Bắt đầu từ đây'), content: s('New to personal finance? Read these first: budgeting, an emergency fund and your first investment.', 'Mới tìm hiểu tài chính cá nhân? Đọc mấy bài này trước: lập ngân sách, quỹ dự phòng và khoản đầu tư đầu tiên.'), align: 'left', style: 'plain' } },
        { name: 'blog', data: { title: s('Latest posts', 'Bài mới'), count: 10, samples: [{ title: s('The 50/30/20 budget, done the simple way', 'Quy tắc ngân sách 50/30/20 làm cho đơn giản'), coverUrl: photo('blog-growth-1'), minutes: 6 }, { title: s('How much should your emergency fund be?', 'Quỹ dự phòng nên có bao nhiêu?'), coverUrl: photo('blog-growth-cover'), minutes: 5 }, { title: s('5 books that changed how I spend', '5 cuốn sách thay đổi cách mình tiêu tiền'), coverUrl: photo('blog-growth-1'), minutes: 7 }] } },
        { name: 'links', data: { items: links([s('Free budget template', 'Mẫu ngân sách miễn phí'), ''], [s('Books I recommend', 'Sách nên đọc'), '']) } },
        { name: 'social', data: { links: social('linkedin', 'facebook', 'youtube') } },
      ] as Blocks),
      room: room({ wallColor: '#ecefe6', floorColor: '#7c5c45', floorMaterial: 'wood', trimColor: '#ffffff' }, [
        { type: 'blog-board', position: [0.4, 1.7, -3], rotation: 0, wall: 'back', color: '#166534' },
        { type: 'bookshelf', position: [-1.9, 0, -2.8], rotation: 0 },
        { type: 'bookshelf', position: [2.2, 0, -2.8], rotation: 0 },
        { type: 'desk', position: [-3, 0, 0.4], rotation: 90, color: '#3f4e3a' },
        { type: 'laptop', position: [-3, DESK_TOP, 0.4], rotation: 90 },
        { type: 'chair', position: [-2.2, 0, 0.4], rotation: 270 },
        { type: 'plant', position: [2.5, 0, 1.6], rotation: 0 },
        { type: 'wall-clock', position: [-3, 2.0, -1.4], rotation: 0, wall: 'left', color: '#166534' },
      ]),
    }),
  },
  // Photo diary: night-black with stars, amber accent, street photos
  {
    id: 'blog-diary', name: 'Photo diary', category: 'blog',
    description: 'Moody and cinematic: street photography and stories from the city.',
    icon: 'i-lucide-camera', preview: { bg: '#0F0F10', accent: '#F59E0B' },
    build: () => ({
      title: s('Streets & Film', 'Phố & Phim'),
      bio: s('Film photos and short stories from the streets of Saigon and Hanoi.', 'Ảnh phim và những câu chuyện ngắn từ phố Sài Gòn, Hà Nội.'),
      avatarUrl: photo('blog-diary-avatar'),
      themeConfig: {
        ...look({
          bg: '#0F0F10', text: '#F5F5F4', accent: '#F59E0B', onAccent: '#0F0F10',
          surface: '#1C1917E6', border: '#2A2622', radius: 6,
          nameFont: 'Playfair Display, serif', nameWeight: '700', nameSize: '2.5rem', tracking: '0.01em',
          header: 'banner-square', banner: photo('blog-diary-cover'), avatar: 'rounded', link: 'centered', social: 'plain',
        }),
        background: { type: 'effect', effectId: 'stars', color: '#0F0F10' },
      },
      blocks: withIndex([
        { name: 'image-album', data: { images: album('blog-diary-1', 'blog-diary-2', 'blog-diary-3'), layout: 'grid' } },
        { name: 'blog', data: { title: s('Stories', 'Câu chuyện'), count: 5, samples: [{ title: s('A rainy night on Bui Vien, on film', 'Một đêm mưa ở Bùi Viện, chụp phim'), coverUrl: photo('blog-diary-2'), minutes: 4 }, { title: s("The motorbikes of Hanoi's Old Quarter", 'Những chiếc xe máy phố cổ Hà Nội'), coverUrl: photo('blog-diary-1'), minutes: 5 }, { title: s('Plastic stools and late-night conversations', 'Ghế nhựa và những câu chuyện đêm khuya'), coverUrl: photo('blog-diary-3'), minutes: 4 }] } },
        { name: 'links', data: { items: links([s('Prints for sale', 'Bán ảnh in'), ''], [s('Photo walks', 'Dạo phố chụp ảnh'), '']) } },
        { name: 'social', data: { links: social('instagram', 'threads') } },
      ] as Blocks),
      room: { ...room({ wallColor: '#1c1917', floorColor: '#2a2420', floorMaterial: 'concrete', trimColor: '#44403c' }, [
        { type: 'blog-board', position: [0.4, 1.7, -3], rotation: 0, wall: 'back', color: '#F59E0B' },
        { type: 'picture-frame', position: [-3, 1.6, -1.2], rotation: 0, wall: 'left', color: '#78716c' },
        { type: 'picture-frame', position: [-3, 1.6, 0], rotation: 0, wall: 'left', color: '#a8a29e' },
        { type: 'picture-frame', position: [-3, 1.6, 1.2], rotation: 0, wall: 'left', color: '#57534e' },
        { type: 'sofa', position: [0.8, 0, 1.0], rotation: 180, color: '#44403c' },
        { type: 'floor-lamp', position: [2.5, 0, 1.6], rotation: 0 },
        { type: 'string-lights', position: [0, 2.6, -3], rotation: 0, wall: 'back', color: '#fbbf24' },
        { type: 'rug', position: [0.4, 0, 0.3], rotation: 0, color: '#78350f' },
      ]), land: 'city' },
    }),
  },
]

export const MORE_PAGE_TEMPLATES: PageTemplate[] = [
  ...GIFT_TEMPLATES,
  ...LOVE_TEMPLATES,
  ...INVITE_TEMPLATES,
  BLOG_TEMPLATE,
  ...BLOGGER_TEMPLATES,
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
          [s('The calmest hour of my month. Lovely staff.', 'Một tiếng thư thái nhất trong tháng. Nhân viên rất dễ thương.'), 'Sarah K.', s('Google review', 'Đánh giá Google')],
          [s('Best hot stone massage in town.', 'Massage đá nóng ngon nhất thành phố.'), 'Anna L.'],
        ) } },
        { name: 'contact', data: { title: s('Visit the spa', 'Ghé spa'), address: SAMPLE_ADDRESS, phone: SAMPLE_PHONE } },
        { name: 'social', data: { links: social('facebook', 'instagram', 'zalo', 'googlemaps') } },
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
        { name: 'social', data: { links: social('instagram', 'tiktok', 'facebook', 'zalo', 'googlemaps') } },
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
      bio: s('Cuts, color and styling for everyone. Walk-ins welcome.', 'Cắt, nhuộm và tạo kiểu cho mọi người. Khách vãng lai luôn được chào đón.'),
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
            [s('Color', 'Nhuộm'), '450,000', s('From, depending on length', 'Từ, tùy độ dài')],
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
          [s('Lost 8 kg in four months with my coach. Never felt stronger.', 'Giảm 8 kg sau bốn tháng tập với HLV. Chưa bao giờ thấy khỏe như vậy.'), 'Ryan M.'],
          [s('Clean, friendly and open early.', 'Sạch sẽ, thân thiện và mở cửa sớm.'), 'Grace T.'],
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
          [s('Painless and very clear about costs.', 'Không đau và báo giá rất rõ ràng.'), 'James P.', s('Google review', 'Đánh giá Google')],
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
          [s('My son went from shy to confident in one term.', 'Con tôi từ rụt rè trở nên tự tin chỉ sau một khóa.'), s('Ms Laura', 'Chị Laura'), s('Parent', 'Phụ huynh')],
          [s('Teachers send notes after every class.', 'Giáo viên gửi nhận xét sau mỗi buổi học.'), s('Mr David', 'Anh David'), s('Parent', 'Phụ huynh')],
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
        { name: 'social', data: { links: social('facebook', 'instagram', 'zalo', 'grabfood', 'shopeefood') } },
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
        { name: 'social', data: { links: social('tiktok', 'facebook', 'zalo', 'grabfood', 'shopeefood') } },
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
        { name: 'form', data: { title: s('Reserve a table', 'Đặt bàn'), kind: 'booking', fields: booking(true, true, true, false) } },
        { name: 'hours', data: { title: s('Opening hours', 'Giờ mở cửa'), days: hours('18:00', '01:00') } },
        { name: 'contact', data: { address: SAMPLE_ADDRESS, phone: SAMPLE_PHONE } },
        { name: 'social', data: { links: social('instagram', 'facebook', 'googlemaps') } },
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
        { name: 'social', data: { links: social('facebook', 'instagram', 'zalo', 'shopee') } },
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
      bio: s('Everyday clothes in soft colors. New drops every Friday.', 'Quần áo hằng ngày tông màu dịu. Hàng mới mỗi thứ Sáu.'),
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
        { name: 'social', data: { links: social('instagram', 'tiktok', 'facebook', 'zalo', 'shopee', 'tiktokshop', 'lazada') } },
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
          [s('We cried looking at the photos. Thank you!', 'Hai đứa đã khóc khi xem ảnh. Cảm ơn bạn rất nhiều!'), 'Lily & Ben'],
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
      title: s('Mia turns 30!', 'Mia tròn 30 tuổi!'),
      bio: s('Come celebrate with cake, games and good friends.', 'Đến chung vui cùng bánh kem, trò chơi và bạn bè nhé.'),
      avatarUrl: photo('party-avatar'),
      themeConfig: look({
        bg: '#FFF1C1', text: '#4C1D95', accent: '#F43F5E', onAccent: '#FFFFFF', surface: '#FFFFFF', radius: 999, shadow: 'md',
        nameFont: 'Pacifico, cursive', nameWeight: '400', nameSize: '2.25rem', bodyFont: 'Nunito, sans-serif',
        header: 'banner-circle', banner: photo('party-cover'), link: 'centered', social: 'filled',
      }),
      blocks: withIndex([
        { name: 'birthday-countdown', data: { birthDate: '2027-03-15', theme: 'party', showAge: false, label: s('Party starts in', 'Còn bao lâu nữa') } },
        { name: 'menu', data: { title: s('The plan', 'Lịch trình'), currency: '', layout: 'list', sections: menu([
          { name: '', items: [[s('Welcome drinks', 'Đón khách'), '18:00'], [s('Dinner', 'Ăn tối'), '19:00'], [s('Cake and games', 'Cắt bánh và trò chơi'), '20:30']] },
        ]) } },
        { name: 'contact', data: { title: s('Where', 'Địa điểm'), address: SAMPLE_ADDRESS } },
        { name: 'form', data: { title: s('Are you coming?', 'Bạn có đến không?'), kind: 'booking', fields: { phone: true, email: false, date: false, time: false, guests: true, message: true }, submitLabel: s('I’ll be there', 'Mình sẽ đến') } },
        { name: 'image-album', data: { images: album('birthday-1', 'birthday-2', 'birthday-cover', 'birthday-avatar'), layout: 'grid' } },
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
