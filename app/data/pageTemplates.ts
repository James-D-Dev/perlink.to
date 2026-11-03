import { nanoid } from 'nanoid'
import type { BioBlock, MenuSection, ThemeConfig } from '~/types/bio'
import { DEFAULT_OPENING_DAYS } from '~/types/bio'
import type { RoomConfig } from '~/types/room'
import { MORE_PAGE_TEMPLATES, MORE_VI, RSVP_FIELDS, reviews } from './pageTemplatesMore'
import { PERSONAL_CREATIVE_TEMPLATES } from './templatesExtra/personalCreative'
import { PLACES_LEARNING_TEMPLATES } from './templatesExtra/placesLearning'
import { BUSINESS_HEALTH_SHOP_TEMPLATES } from './templatesExtra/businessHealthShop'
import { COFFEE_TABLE_TOP, DESK_TOP, SAMPLE_ADDRESS, SAMPLE_PHONE, album, links, look, menu, photo, room, social, withIndex } from './templateKit'

// Starter pages by industry. Applying a template fills the page with sample
// content, a matching theme and a matching 3D room (used if 3D mode is on).

// Newer sample text carries its Vietnamese with it, like the other template
// files (the older strings are translated in templateCopyVi)
function s(en: string, vi: string) {
  MORE_VI[en] = vi
  return en
}

/** Photos for the items of a price list, in order; '' leaves an item without one */
function withPhotos(sections: MenuSection[], ...names: string[]): MenuSection[] {
  let i = 0
  return sections.map(section => ({
    ...section,
    items: section.items.map((item) => {
      const name = names[i++]
      return name ? { ...item, imageUrl: photo(name) } : item
    }),
  }))
}

/** A dated step of a timeline */
const step = (date: string, title: string, text?: string, image?: string) =>
  ({ id: nanoid(6), date, title, text, imageUrl: image ? photo(image) : undefined })

export interface PageTemplateContent {
  title: string
  bio: string
  /** Sample photo, used only when the page has no avatar yet */
  avatarUrl?: string
  blocks: BioBlock[]
  themeConfig: ThemeConfig
  room: RoomConfig
}

export type TemplateCategory = 'gifts' | 'blog' | 'personal' | 'food' | 'beauty' | 'health' | 'shop' | 'education' | 'hospitality' | 'business' | 'creative' | 'events' | 'community'

export const TEMPLATE_CATEGORIES: { id: TemplateCategory; label: string; icon: string }[] = [
  { id: 'gifts', label: 'Gifts', icon: 'i-lucide-gift' },
  { id: 'blog', label: 'Blog', icon: 'i-lucide-newspaper' },
  { id: 'personal', label: 'Personal', icon: 'i-lucide-user-round' },
  { id: 'food', label: 'Food & drink', icon: 'i-lucide-utensils' },
  { id: 'beauty', label: 'Beauty', icon: 'i-lucide-sparkles' },
  { id: 'health', label: 'Health & fitness', icon: 'i-lucide-heart-pulse' },
  { id: 'shop', label: 'Shops', icon: 'i-lucide-shopping-bag' },
  { id: 'education', label: 'Education', icon: 'i-lucide-graduation-cap' },
  { id: 'hospitality', label: 'Hotel & travel', icon: 'i-lucide-bed-double' },
  { id: 'business', label: 'Business', icon: 'i-lucide-briefcase' },
  { id: 'creative', label: 'Creative', icon: 'i-lucide-palette' },
  { id: 'events', label: 'Events', icon: 'i-lucide-party-popper' },
  { id: 'community', label: 'Community', icon: 'i-lucide-hand-heart' },
]

export interface PageTemplate {
  id: string
  name: string
  category: TemplateCategory
  description: string
  icon: string
  /** Swatch colors for the picker card */
  preview: { bg: string; accent: string }
  build: () => PageTemplateContent
}


const BASE_TEMPLATES: PageTemplate[] = [
  {
    id: 'personal',
    name: 'Personal portfolio',
    category: 'personal',
    description: 'Introduce yourself, your work and where to find you.',
    icon: 'i-lucide-user-round',
    preview: { bg: '#F7F5F2', accent: '#1C1A17' },
    build: () => ({
      title: 'Your Name',
      bio: 'Designer & developer. I build friendly products for the web.',
      avatarUrl: photo('personal-avatar'),
      themeConfig: look({
        bg: '#F7F5F2', text: '#1C1A17', accent: '#1C1A17', onAccent: '#FFFFFF',
        surface: '#FFFFFF', border: '#E8E4DF', radius: 10,
        nameFont: 'Inter Tight, sans-serif', nameWeight: '500', nameSize: '1.875rem', tracking: '-0.03em',
        header: 'centered', link: 'centered', social: 'outline', titleAlign: 'left',
      }),
      blocks: withIndex([
        { name: 'social', data: { links: social('instagram', 'linkedin', 'github', 'email') } },
        { name: 'links', data: { items: links(['Portfolio', ''], ['Latest project', ''], ['Book a call', '']) } },
        { name: 'text', data: { title: 'About', content: 'I design and build calm, useful software. Eight years across startups and studios, now independent and open to new projects.', align: 'left', style: 'plain' } },
        { name: 'image-album', data: { title: 'Selected work', images: album('personal-work-1', 'personal-work-2', 'personal-work-3', 'personal-work-4'), layout: 'grid' } },
        { name: 'timeline', data: { title: s('Experience', 'Kinh nghiệm'), items: [
          step(s('2023 – now', '2023 – nay'), s('Independent designer', 'Thiết kế độc lập'), s('Product design and front-end for startups in Saigon and Singapore.', 'Thiết kế sản phẩm và front-end cho các startup ở Sài Gòn và Singapore.')),
          step('2019 – 2023', s('Lead product designer, Lumen Labs', 'Trưởng nhóm thiết kế, Lumen Labs'), s('Grew the design team from 2 to 9 and rebuilt the booking app used by 1 million people.', 'Đưa nhóm thiết kế từ 2 lên 9 người và làm lại ứng dụng đặt lịch cho 1 triệu người dùng.')),
          step('2016 – 2019', s('Designer, Nova Studio', 'Nhà thiết kế, Nova Studio'), s('Websites and brands for cafés, hotels and local shops.', 'Website và thương hiệu cho quán cà phê, khách sạn và cửa hàng địa phương.')),
        ] } },
        { name: 'testimonials', data: { title: s('Kind words', 'Khách hàng nói gì'), items: reviews(
          [s('Calm, quick and full of good ideas. Our sign-ups went up 40% after the redesign.', 'Điềm tĩnh, nhanh và nhiều ý tưởng hay. Lượt đăng ký tăng 40% sau khi làm lại.'), 'Minh T.', s('Founder, Bếp Nhà app', 'Nhà sáng lập, ứng dụng Bếp Nhà')],
          [s('The rare designer who also ships the code.', 'Hiếm có nhà thiết kế nào tự tay làm luôn phần code.'), 'Sarah L.', s('Product lead, Singapore', 'Trưởng sản phẩm, Singapore')],
        ) } },
        { name: 'form', data: { title: s('Let’s work together', 'Cùng làm việc nhé'), description: s('Tell me what you’re building and your timeline. I reply within two days.', 'Kể mình nghe bạn đang làm gì và thời gian dự kiến. Mình trả lời trong hai ngày.'), kind: 'contact', fields: { phone: false, email: true, date: false, time: false, guests: false, message: true }, submitLabel: s('Send it over', 'Gửi cho mình') } },
      ] as Omit<BioBlock, 'index' | 'hidden'>[]),
      room: room({ wallColor: '#f3ede4', floorColor: '#c8a27a', floorMaterial: 'wood' }, [
        { type: 'window', position: [0.6, 1.6, -3], rotation: 0, wall: 'back' },
        { type: 'desk', position: [1.4, 0, -2.6], rotation: 0 },
        { type: 'chair', position: [1.4, 0, -1.8], rotation: 180 },
        { type: 'laptop', position: [1.25, DESK_TOP, -2.6], rotation: 0, link: { label: 'My portfolio', url: '' } },
        { type: 'desk-lamp', position: [1.9, DESK_TOP, -2.7], rotation: 0 },
        { type: 'bookshelf', position: [-1.7, 0, -2.8], rotation: 0 },
        { type: 'picture-frame', position: [-3, 1.7, -0.6], rotation: 0, wall: 'left', link: { label: 'Instagram', url: '' } },
        { type: 'picture-frame', position: [-3, 1.5, 0.5], rotation: 0, wall: 'left', color: '#e76f51' },
        { type: 'wall-clock', position: [-0.8, 2.3, -3], rotation: 0, wall: 'back' },
        { type: 'rug', position: [0, 0, 0.4], rotation: 0 },
        { type: 'plant', position: [2.5, 0, 0.6], rotation: 0 },
        { type: 'floor-lamp', position: [-2.5, 0, 1.6], rotation: 0 },
      ]),
    }),
  },
  {
    id: 'restaurant',
    name: 'Restaurant menu',
    category: 'food',
    description: 'Menu with prices, opening hours and table booking.',
    icon: 'i-lucide-utensils',
    preview: { bg: '#F4EEE6', accent: '#9A3B1C' },
    build: () => ({
      title: 'Your Restaurant',
      bio: 'Fresh, seasonal cooking in the heart of the city.',
      avatarUrl: photo('restaurant-avatar'),
      themeConfig: look({
        bg: '#F4EEE6', text: '#2B1D14', accent: '#9A3B1C', onAccent: '#FFF7EF',
        surface: '#FFFBF6', border: '#E6D9C8', radius: 8,
        nameFont: 'Playfair Display, serif', nameWeight: '500', nameSize: '2.25rem',
        header: 'banner-circle', banner: photo('restaurant-cover'), link: 'centered', social: 'soft',
      }),
      blocks: withIndex([
        { name: 'text', data: { title: 'Our story', content: 'Family recipes, market produce and a charcoal grill. We cook what is in season and change the menu every month.', align: 'center', style: 'plain' } },
        {
          name: 'menu',
          data: {
            title: 'Menu',
            currency: '₫',
            layout: 'list',
            sections: withPhotos(menu([
              { name: 'Starters', items: [['Spring rolls', '65,000', 'Crispy rolls with herbs and dipping sauce', 'Popular'], ['Green papaya salad', '75,000', 'Shrimp, peanuts, lime dressing'], [s('Crispy Saigon pancake', 'Bánh xèo Sài Gòn'), '89,000', s('Shrimp, pork belly, bean sprouts, wrapped in mustard greens', 'Tôm, ba chỉ, giá, cuốn cải bẹ xanh')]] },
              { name: 'Mains', items: [['Grilled pork with rice', '95,000', 'Charcoal grilled, pickled vegetables'], ['Beef pho', '85,000', 'Slow-cooked broth, rice noodles', 'Chef’s pick'], [s('Family set for four', 'Mâm gia đình 4 người'), '520,000', s('Pho, spring rolls, grilled pork, salad and four drinks', 'Phở, chả giò, thịt nướng, gỏi và bốn ly nước'), s('Great for groups', 'Hợp đi nhóm')]] },
              { name: 'Drinks', items: [['Iced milk coffee', '35,000'], ['Fresh coconut', '40,000']] },
            ]), '', 'nutri-1', 'street-2', '', '', 'nutri-3'),
          },
        },
        { name: 'testimonials', data: { title: s('What diners say', 'Thực khách nói gì'), items: reviews(
          [s('The broth tastes like my grandmother’s. We come every Sunday.', 'Nước dùng y như bà nội nấu. Chủ nhật nào nhà mình cũng ghé.'), 'Hương N.', s('Google review', 'Đánh giá Google')],
          [s('Best bánh xèo in District 1, and the staff remember our order.', 'Bánh xèo ngon nhất Quận 1, nhân viên còn nhớ cả món quen.'), 'Daniel K.', s('Regular since 2022', 'Khách quen từ 2022')],
          [s('Booked a table for 12 on the page; everything was ready when we arrived.', 'Đặt bàn 12 người ngay trên trang, đến nơi là mọi thứ đã sẵn sàng.'), 'Thảo V.', s('Birthday dinner', 'Tiệc sinh nhật')],
        ) } },
        { name: 'hours', data: { title: 'Opening hours', days: DEFAULT_OPENING_DAYS.map(d => ({ ...d, open: '10:00', close: '22:00' })), note: 'Last orders 30 minutes before closing.' } },
        { name: 'form', data: { title: 'Book a table', description: 'We’ll confirm by phone within the hour.', kind: 'booking', fields: { phone: true, email: false, date: true, time: true, guests: true, message: true }, submitLabel: s('Request a table', 'Gửi yêu cầu đặt bàn') } },
        { name: 'contact', data: { title: 'Find us', address: SAMPLE_ADDRESS, phone: SAMPLE_PHONE, quickBar: true } },
        { name: 'social', data: { links: social('facebook', 'instagram', 'tiktok', 'zalo', 'grabfood', 'shopeefood', 'googlemaps') } },
      ] as Omit<BioBlock, 'index' | 'hidden'>[]),
      room: room({ wallColor: '#7a4b3a', floorColor: '#9c6b46', floorMaterial: 'wood', trimColor: '#3b2a22' }, [
        { type: 'neon-sign', position: [0.2, 2.1, -3], rotation: 0, wall: 'back', color: '#ffb347', link: { label: 'See our menu', url: '' } },
        { type: 'string-lights', position: [0, 2.6, -3], rotation: 0, wall: 'back' },
        { type: 'wall-lamp', position: [-3, 1.8, -1.2], rotation: 0, wall: 'left' },
        { type: 'wall-lamp', position: [-3, 1.8, 1.2], rotation: 0, wall: 'left' },
        { type: 'coffee-table', position: [-1.2, 0, -1.2], rotation: 0 },
        { type: 'chair', position: [-1.2, 0, -2], rotation: 0 },
        { type: 'chair', position: [-1.2, 0, -0.4], rotation: 180 },
        { type: 'candle', position: [-1.2, COFFEE_TABLE_TOP, -1.2], rotation: 0 },
        { type: 'coffee-table', position: [1.3, 0, 0.6], rotation: 0 },
        { type: 'chair', position: [0.5, 0, 0.6], rotation: 90 },
        { type: 'chair', position: [2.1, 0, 0.6], rotation: 270 },
        { type: 'candle', position: [1.3, COFFEE_TABLE_TOP, 0.6], rotation: 0 },
        { type: 'plant', position: [2.5, 0, -2.5], rotation: 0 },
        { type: 'plant', position: [-2.5, 0, 2.4], rotation: 0 },
      ]),
    }),
  },
  {
    id: 'hotel',
    name: 'Hotel & homestay',
    category: 'hospitality',
    description: 'Rooms with nightly prices, contact and booking.',
    icon: 'i-lucide-bed-double',
    preview: { bg: '#F3F1EC', accent: '#1F4E5F' },
    build: () => ({
      title: 'Your Homestay',
      bio: 'A quiet place to stay, five minutes from the beach.',
      avatarUrl: photo('hotel-avatar'),
      themeConfig: look({
        bg: '#F3F1EC', text: '#1F2A2E', accent: '#1F4E5F', onAccent: '#FFFFFF',
        surface: '#FFFFFF', radius: 10, shadow: 'sm',
        nameFont: 'Cormorant Garamond, serif', nameWeight: '500', nameSize: '2.25rem',
        header: 'banner-square', banner: photo('hotel-cover'), avatar: 'rounded', link: 'centered', social: 'outline',
      }),
      blocks: withIndex([
        { name: 'text', data: { title: 'The house', content: 'Six rooms around a garden courtyard, with breakfast on the terrace and bikes to borrow.', align: 'center', style: 'plain' } },
        {
          name: 'menu',
          data: {
            title: 'Rooms',
            currency: '₫',
            priceSuffix: ' / night',
            layout: 'cards',
            sections: withPhotos(menu([
              { name: '', items: [['Standard double', '650,000', 'Queen bed, garden view, breakfast included'], ['Deluxe sea view', '950,000', 'King bed, balcony, sea view', 'Best seller'], ['Family suite', '1,400,000', 'Two bedrooms, sleeps 4']] },
            ]), 'hotel-room-2', 'hotel-room-1', 'hotel-room-3'),
          },
        },
        { name: 'text', data: { title: s('Included in every stay', 'Đã gồm trong giá phòng'), content: s('🍳 Breakfast on the terrace\n🚲 Bikes and beach towels\n📶 Fast Wi-Fi in every room\n🛵 Airport pick-up on request', '🍳 Bữa sáng trên hiên\n🚲 Xe đạp và khăn đi biển\n📶 Wi-Fi nhanh mọi phòng\n🛵 Đón sân bay theo yêu cầu'), align: 'left', style: 'card' } },
        { name: 'form', data: { title: 'Ask about your dates', description: s('Pick your room and dates; we confirm on Zalo within an hour.', 'Chọn phòng và ngày ở, chúng tôi xác nhận qua Zalo trong vòng một giờ.'), kind: 'stay', fields: { phone: true, email: true, date: true, time: false, guests: true, message: true, service: true, checkout: true }, submitLabel: 'Check availability' } },
        { name: 'image-album', data: { title: s('Around the house', 'Quanh nhà'), images: album('villa-4', 'tour-2', 'love-7'), layout: 'carousel' } },
        { name: 'testimonials', data: { title: s('Guests say', 'Khách lưu trú nói gì'), items: reviews(
          [s('Spotless rooms, the best breakfast of our trip and a two-minute walk to the sand.', 'Phòng sạch tinh, bữa sáng ngon nhất chuyến đi, đi bộ hai phút là tới biển.'), 'Julia M.', s('Booking.com, 9.6', 'Booking.com, 9,6')],
          [s('The owners lent us bikes and drew us a map of their favourite food stalls.', 'Chủ nhà cho mượn xe đạp và vẽ cả bản đồ các quán ngon họ hay ăn.'), 'Quang & Vy', s('Stayed 4 nights', 'Ở 4 đêm')],
        ) } },
        { name: 'contact', data: { title: 'Contact & booking', address: SAMPLE_ADDRESS, phone: SAMPLE_PHONE, quickBar: true } },
        { name: 'hours', data: { title: 'Reception', days: DEFAULT_OPENING_DAYS.map(d => ({ ...d, open: '07:00', close: '23:00' })), note: 'Check-in from 14:00, check-out before 12:00.' } },
        { name: 'social', data: { links: social('facebook', 'instagram', 'whatsapp', 'googlemaps') } },
      ] as Omit<BioBlock, 'index' | 'hidden'>[]),
      room: room({ wallColor: '#ece4d8', floorColor: '#b89b7a', floorMaterial: 'wood' }, [
        { type: 'window', position: [1.6, 1.6, -3], rotation: 0, wall: 'back', link: { label: 'Book your stay', url: '' } },
        { type: 'bed', position: [-1.2, 0, -1.9], rotation: 0 },
        { type: 'wall-lamp', position: [-2.3, 1.3, -3], rotation: 0, wall: 'back' },
        { type: 'wall-lamp', position: [-0.1, 1.3, -3], rotation: 0, wall: 'back' },
        { type: 'picture-frame', position: [-3, 1.7, -1.4], rotation: 0, wall: 'left', color: '#2a9d8f' },
        { type: 'cabinet', position: [-2.7, 0, 1.2], rotation: 90 },
        { type: 'candle', position: [-2.7, 0.8, 1.4], rotation: 0 },
        { type: 'sofa', position: [1.6, 0, 1.4], rotation: 270 },
        { type: 'rug', position: [0.4, 0, 1], rotation: 90 },
        { type: 'plant', position: [2.5, 0, -1.6], rotation: 0 },
        { type: 'floor-lamp', position: [2.5, 0, 2.6], rotation: 0 },
      ]),
    }),
  },
  {
    id: 'cafe',
    name: 'Café & shop',
    category: 'food',
    description: 'Drinks or products, opening hours and where to find you.',
    icon: 'i-lucide-coffee',
    preview: { bg: '#EDF0E8', accent: '#3F6B4B' },
    build: () => ({
      title: 'Your Café',
      bio: 'Specialty coffee, homemade cakes and good music.',
      avatarUrl: photo('cafe-avatar'),
      themeConfig: look({
        bg: '#EDF0E8', text: '#223326', accent: '#3F6B4B', onAccent: '#FFFFFF',
        surface: '#F9FAF6', border: '#D9E0D1', radius: 12,
        nameFont: 'Poppins, sans-serif', nameWeight: '600', nameSize: '1.875rem', tracking: '-0.03em',
        header: 'left', link: 'centered', social: 'filled', titleAlign: 'left',
      }),
      blocks: withIndex([
        { name: 'social', data: { links: social('instagram', 'tiktok', 'facebook', 'grabfood', 'shopeefood', 'googlemaps') } },
        {
          name: 'menu',
          data: {
            title: 'Our menu',
            currency: '₫',
            layout: 'list',
            sections: menu([
              { name: 'Coffee', items: [['Espresso', '35,000'], ['Salted cream coffee', '45,000', 'Our signature', 'Signature'], ['Cold brew', '50,000']] },
              { name: 'Cakes', items: [['Banana bread', '40,000'], ['Cheesecake', '55,000'], [s('Butter croissant', 'Croissant bơ'), '38,000', s('Baked every morning at 6', 'Nướng mỗi sáng lúc 6 giờ'), s('Fresh', 'Mới ra lò')]] },
            ]),
          },
        },
        { name: 'image-album', data: { title: 'Inside the café', images: album('cafe-1', 'cafe-2', 'cafe-3', 'cafe-4'), layout: 'grid' } },
        { name: 'testimonials', data: { title: s('Regulars say', 'Khách quen nói gì'), items: reviews(
          [s('The salted cream coffee is worth crossing the city for.', 'Cà phê muối ở đây đáng để băng qua cả thành phố.'), 'Linh P.', s('Google review', 'Đánh giá Google')],
          [s('Quiet in the mornings, good Wi-Fi and plugs at every table. My office now.', 'Buổi sáng yên tĩnh, Wi-Fi mạnh, bàn nào cũng có ổ cắm. Giờ là văn phòng của mình.'), 'Tom R.', s('Remote worker', 'Làm việc từ xa')],
        ) } },
        { name: 'hours', data: { title: 'Opening hours', days: DEFAULT_OPENING_DAYS.map(d => ({ ...d, open: '07:00', close: '21:30' })), note: s('Kitchen closes at 20:30.', 'Bếp nhận món đến 20:30.') } },
        { name: 'form', data: { title: s('Reserve for a group', 'Đặt chỗ cho nhóm'), description: s('Birthdays, workshops or a team meeting: tell us when and how many.', 'Sinh nhật, workshop hay họp nhóm: cho quán biết thời gian và số người.'), kind: 'booking', fields: { phone: true, email: false, date: true, time: true, guests: true, message: true }, submitLabel: s('Hold the tables', 'Giữ bàn cho mình') } },
        { name: 'contact', data: { title: 'Visit us', address: SAMPLE_ADDRESS, phone: SAMPLE_PHONE, quickBar: true } },
      ] as Omit<BioBlock, 'index' | 'hidden'>[]),
      room: room({ wallColor: '#dfe7d6', floorColor: '#b08968', floorMaterial: 'wood', trimColor: '#f8f4ec' }, [
        { type: 'string-lights', position: [0, 2.5, -3], rotation: 0, wall: 'back' },
        { type: 'neon-sign', position: [-3, 1.9, -0.4], rotation: 0, wall: 'left', color: '#ff6b6b', link: { label: 'Instagram', url: '' } },
        { type: 'bookshelf', position: [1.6, 0, -2.8], rotation: 0 },
        { type: 'coffee-table', position: [-1.3, 0, -1.4], rotation: 0 },
        { type: 'chair', position: [-1.3, 0, -2.2], rotation: 0 },
        { type: 'chair', position: [-0.5, 0, -1.4], rotation: 270 },
        { type: 'mug', position: [-1.15, COFFEE_TABLE_TOP, -1.35], rotation: 0 },
        { type: 'mug', position: [-1.45, COFFEE_TABLE_TOP, -1.5], rotation: 120, color: '#2a9d8f' },
        { type: 'coffee-table', position: [1, 0, 1.2], rotation: 0 },
        { type: 'chair', position: [1, 0, 2], rotation: 180 },
        { type: 'mug', position: [1, COFFEE_TABLE_TOP, 1.2], rotation: 0 },
        { type: 'plant', position: [-2.5, 0, 2.3], rotation: 0 },
        { type: 'plant', position: [2.6, 0, 0], rotation: 0 },
      ]),
    }),
  },
  {
    id: 'creator',
    name: 'Creator & artist',
    category: 'creative',
    description: 'Show your work as a gallery with links to shop or commission.',
    icon: 'i-lucide-palette',
    preview: { bg: '#111015', accent: '#CDB4FF' },
    build: () => ({
      title: 'Your Studio',
      bio: 'Illustration, prints and commissions.',
      avatarUrl: photo('creator-avatar'),
      themeConfig: look({
        bg: '#111015', text: '#F3EFE8', accent: '#CDB4FF', onAccent: '#17122B',
        surface: '#1B1A21', border: '#2C2A33', radius: 10,
        nameFont: 'Inter Tight, sans-serif', nameWeight: '400', nameSize: '2.25rem', tracking: '-0.03em',
        header: 'banner-circle', banner: photo('creator-cover'), link: 'centered', social: 'plain',
      }),
      blocks: withIndex([
        { name: 'image-album', data: { title: 'Recent work', images: album('creator-art-1', 'creator-art-2'), layout: 'masonry' } },
        { name: 'products', data: { title: s('Prints', 'Tranh in'), layout: 'grid', ordering: true, askAddress: true, payment: 'both', items: [
          { id: nanoid(6), name: s('“Summer bloom” giclée print', 'Tranh in “Hoa mùa hạ”'), price: 450000, imageUrl: photo('creator-art-3'), description: s('Archival paper, signed and numbered', 'Giấy mỹ thuật, có chữ ký và số thứ tự'), tag: s('Limited', 'Giới hạn'), stock: 8,
            options: [{ id: nanoid(6), name: s('Print size', 'Khổ tranh'), values: [{ id: nanoid(6), label: 'A4' }, { id: nanoid(6), label: 'A3' }] }] },
          { id: nanoid(6), name: s('“Tide” giclée print', 'Tranh in “Thủy triều”'), price: 450000, imageUrl: photo('creator-art-4'), description: s('Archival paper, signed and numbered', 'Giấy mỹ thuật, có chữ ký và số thứ tự'), stock: 3,
            options: [{ id: nanoid(6), name: s('Print size', 'Khổ tranh'), values: [{ id: nanoid(6), label: 'A4' }, { id: nanoid(6), label: 'A3' }] }] },
        ] } },
        { name: 'menu', data: { title: s('Commissions', 'Nhận đặt vẽ'), currency: '₫', layout: 'list', sections: menu([
          { name: '', items: [[s('Portrait, A4', 'Chân dung khổ A4'), '1,200,000', s('From your photo, delivered in 10 days', 'Vẽ từ ảnh của bạn, giao sau 10 ngày'), 'Popular'], [s('Pet portrait', 'Chân dung thú cưng'), '900,000', s('Your cat or dog, in colour', 'Mèo hoặc cún của bạn, vẽ màu')], [s('Wall mural', 'Vẽ tranh tường'), s('By quote', 'Báo giá riêng'), s('Cafés, homes and offices', 'Quán cà phê, nhà ở và văn phòng')]] },
        ]) } },
        { name: 'form', data: { title: s('Request a commission', 'Đặt vẽ riêng'), description: s('Pick a commission, tell me the idea and when you need it.', 'Chọn loại tranh, kể ý tưởng và thời gian bạn cần.'), kind: 'contact', fields: { phone: true, email: true, date: false, time: false, guests: false, message: true, service: true }, submitLabel: s('Send my idea', 'Gửi ý tưởng') } },
        { name: 'social', data: { links: social('instagram', 'behance', 'tiktok', 'pinterest') } },
      ] as Omit<BioBlock, 'index' | 'hidden'>[]),
      room: room({ wallColor: '#2b2d42', floorColor: '#4a4e69', floorMaterial: 'concrete', trimColor: '#8d99ae' }, [
        { type: 'picture-frame', position: [-1.6, 1.7, -3], rotation: 0, wall: 'back', color: '#e76f51', link: { label: 'Shop prints', url: '' } },
        { type: 'picture-frame', position: [-0.6, 1.5, -3], rotation: 0, wall: 'back', color: '#2a9d8f' },
        { type: 'picture-frame', position: [0.4, 1.8, -3], rotation: 0, wall: 'back', color: '#e9c46a' },
        { type: 'picture-frame', position: [-3, 1.6, -1.2], rotation: 0, wall: 'left', color: '#8338ec', link: { label: 'Commission me', url: '' } },
        { type: 'picture-frame', position: [-3, 1.7, 0.2], rotation: 0, wall: 'left', color: '#ff006e' },
        { type: 'neon-sign', position: [1.8, 1.9, -3], rotation: 0, wall: 'back', color: '#a855f7' },
        { type: 'string-lights', position: [-3, 2.6, 0], rotation: 0, wall: 'left', color: '#c4b5fd' },
        { type: 'sofa', position: [0.4, 0, 1.4], rotation: 180 },
        { type: 'coffee-table', position: [0.4, 0, 0.2], rotation: 0 },
        { type: 'candle', position: [0.4, COFFEE_TABLE_TOP, 0.2], rotation: 0 },
        { type: 'floor-lamp', position: [2.4, 0, -2.3], rotation: 0 },
        { type: 'plant', position: [-2.5, 0, 2.4], rotation: 0 },
        { type: 'rug', position: [0.4, 0, 0.6], rotation: 0, color: '#6d597a' },
      ]),
    }),
  },
  {
    id: 'link-in-bio',
    name: 'Link in bio',
    category: 'personal',
    description: 'A clean, dark page with your socials and top links.',
    icon: 'i-lucide-link',
    preview: { bg: '#0C0B0A', accent: '#F5F3F1' },
    build: () => ({
      title: 'Your Name',
      bio: 'Creator · sharing what I make and love.',
      avatarUrl: photo('link-avatar'),
      themeConfig: look({
        bg: '#0C0B0A', text: '#F5F3F1', accent: '#F5F3F1', onAccent: '#0C0B0A',
        surface: '#1A1917', radius: 12,
        nameFont: 'Inter Tight, sans-serif', nameWeight: '500', nameSize: '1.5rem', tracking: '-0.02em',
        header: 'centered', link: 'centered', social: 'plain', gap: 'compact',
      }),
      blocks: withIndex([
        { name: 'social', data: { links: social('instagram', 'tiktok', 'youtube', 'threads', 'tiktokshop') } },
        { name: 'links', data: { items: links(['Latest video', ''], ['My newsletter', ''], ['Shop my picks', ''], ['Work with me', '']) } },
        { name: 'form', data: { title: s('Brand partnerships', 'Hợp tác nhãn hàng'), description: s('Send your brief; I reply within three days with my rates.', 'Gửi brief cho mình, mình trả lời kèm báo giá trong ba ngày.'), kind: 'contact', fields: { phone: false, email: true, date: false, time: false, guests: false, message: true }, submitLabel: s('Send brief', 'Gửi brief') } },
      ] as Omit<BioBlock, 'index' | 'hidden'>[]),
      room: room({ wallColor: '#1f1f24', floorColor: '#3a3a42', floorMaterial: 'concrete', trimColor: '#55555f' }, [
        { type: 'neon-sign', position: [0.6, 1.9, -3], rotation: 0, wall: 'back', color: '#8b5cf6', link: { label: 'Latest video', url: '' } },
        { type: 'string-lights', position: [-3, 2.5, 0], rotation: 0, wall: 'left', color: '#c4b5fd' },
        { type: 'desk', position: [1.4, 0, -2.6], rotation: 0, color: '#2f2f36' },
        { type: 'chair', position: [1.4, 0, -1.8], rotation: 180 },
        { type: 'laptop', position: [1.25, DESK_TOP, -2.6], rotation: 0 },
        { type: 'desk-lamp', position: [1.9, DESK_TOP, -2.7], rotation: 0, color: '#8b5cf6' },
        { type: 'sofa', position: [-1.6, 0, 0.6], rotation: 90, color: '#3d3d46' },
        { type: 'plant', position: [2.5, 0, 0.8], rotation: 0 },
        { type: 'rug', position: [0, 0, 0.4], rotation: 0, color: '#4c4c58' },
      ]),
    }),
  },
  {
    id: 'services',
    name: 'Freelancer & services',
    category: 'business',
    description: 'Services with prices, booking and opening hours.',
    icon: 'i-lucide-briefcase',
    preview: { bg: '#FFFFFF', accent: '#18181B' },
    build: () => ({
      title: 'Your Studio',
      bio: 'Photography, design and video for small businesses.',
      avatarUrl: photo('services-avatar'),
      themeConfig: look({
        bg: '#FFFFFF', text: '#18181B', accent: '#18181B', onAccent: '#FFFFFF',
        surface: '#F4F4F5', radius: 10,
        nameFont: 'Inter Tight, sans-serif', nameWeight: '600', nameSize: '1.875rem', tracking: '-0.03em',
        header: 'left', avatar: 'rounded', link: 'centered', social: 'outline', titleAlign: 'left',
      }),
      blocks: withIndex([
        { name: 'text', data: { title: 'What I do', content: 'I help small businesses look their best online: brand photos, simple identities and short videos for social media.', align: 'left', style: 'plain' } },
        {
          name: 'menu',
          data: {
            title: 'Services',
            currency: '₫',
            layout: 'cards',
            sections: withPhotos(menu([
              { name: '', items: [['Brand photo shoot', '3,500,000', 'Half day, 30 edited photos', 'Popular'], ['Logo & identity', '8,000,000', 'Logo, colors, typography'], ['Short promo video', '6,000,000', '30–60 second edit']] },
            ]), 'bakery-cover', 'shop-avatar', 'cafe-4'),
          },
        },
        { name: 'testimonials', data: { title: s('What clients say', 'Khách hàng nói gì'), items: reviews(
          [s('Our menu photos finally look as good as the food. Orders on GrabFood went up the next week.', 'Ảnh thực đơn cuối cùng cũng ngon như món thật. Tuần sau đơn GrabFood tăng hẳn.'), 'Bếp Mẹ Hiền', s('Restaurant, District 3', 'Nhà hàng, Quận 3')],
          [s('Clear prices, on time, and the logo still feels right two years later.', 'Giá rõ ràng, đúng hẹn, logo dùng hai năm vẫn thấy hợp.'), 'Lá Studio', s('Flower shop', 'Tiệm hoa')],
        ) } },
        { name: 'form', data: { title: s('Book a shoot or a free call', 'Đặt lịch chụp hoặc gọi tư vấn miễn phí'), description: s('Pick a service and a time that suits you; I’ll confirm by email.', 'Chọn dịch vụ và giờ phù hợp, tôi sẽ xác nhận qua email.'), kind: 'booking', fields: { phone: true, email: true, date: true, time: true, guests: false, message: true, service: true }, submitLabel: s('Request a slot', 'Gửi yêu cầu đặt lịch') } },
        { name: 'hours', data: { title: 'Availability', days: DEFAULT_OPENING_DAYS.map(d => ({ ...d, open: '09:00', close: '18:00', closed: d.day === 0 || d.day === 6 })), note: 'Replies within one business day.' } },
        { name: 'contact', data: { title: s('Studio', 'Studio'), email: 'hello@yourstudio.com', phone: SAMPLE_PHONE, address: SAMPLE_ADDRESS } },
        { name: 'social', data: { links: social('linkedin', 'instagram', 'behance') } },
      ] as Omit<BioBlock, 'index' | 'hidden'>[]),
      room: room({ wallColor: '#e7e5e4', floorColor: '#a8a29e', floorMaterial: 'tile', trimColor: '#f5f5f4' }, [
        { type: 'window', position: [0.8, 1.6, -3], rotation: 0, wall: 'back' },
        { type: 'desk', position: [0.8, 0, -2.6], rotation: 0 },
        { type: 'chair', position: [0.8, 0, -1.8], rotation: 180 },
        { type: 'laptop', position: [0.65, DESK_TOP, -2.6], rotation: 0, link: { label: 'Book a free call', url: '' } },
        { type: 'bookshelf', position: [-1.8, 0, -2.8], rotation: 0 },
        { type: 'picture-frame', position: [-3, 1.7, -0.4], rotation: 0, wall: 'left', color: '#0f172a' },
        { type: 'wall-clock', position: [2.2, 2.2, -3], rotation: 0, wall: 'back' },
        { type: 'sofa', position: [1.6, 0, 1.6], rotation: 270, color: '#64748b' },
        { type: 'coffee-table', position: [0.4, 0, 1.6], rotation: 0 },
        { type: 'mug', position: [0.4, COFFEE_TABLE_TOP, 1.6], rotation: 0 },
        { type: 'plant', position: [-2.5, 0, 2.4], rotation: 0 },
        { type: 'floor-lamp', position: [-2.5, 0, 0.8], rotation: 0 },
      ]),
    }),
  },
  {
    id: 'event',
    name: 'Wedding & event',
    category: 'events',
    description: 'Schedule, venue, RSVP and photo gallery for your big day.',
    icon: 'i-lucide-heart',
    preview: { bg: '#FBF4F0', accent: '#8C4A62' },
    build: () => ({
      title: s('Anna & Mark', 'Lan & Minh'),
      bio: 'We’re getting married! Saturday, 12 June 2027.',
      avatarUrl: photo('event-avatar'),
      themeConfig: {
        ...look({
        bg: '#FBF4F0', text: '#3A2530', accent: '#8C4A62', onAccent: '#FFFFFF',
        surface: '#FFFFFF', border: '#F0DCD6', radius: 10,
        nameFont: 'Cormorant Garamond, serif', nameWeight: '500', nameSize: '2.25rem',
        header: 'banner-circle', banner: photo('event-cover'), link: 'centered', social: 'soft', gap: 'relaxed',
      }),
        music: { trackId: 'romantic-piano' },
      },
      blocks: withIndex([
        { name: 'letter', data: { to: s('you', 'bạn'), body: 'We would love to celebrate with you. Dinner, dancing and a garden full of flowers. Please let us know if you can come by 1 May.', from: s('Anna & Mark', 'Lan & Minh'), sealed: true, paper: 'cream', personal: true } },
        { name: 'birthday-countdown', data: { birthDate: '2027-06-12', theme: 'card', showAge: false, label: s('Until we say “I do”', 'Còn bao lâu đến ngày chung đôi'), mode: 'until', repeat: false } },
        { name: 'event', data: { name: 'Ceremony', date: '2027-06-12', startTime: '15:00', endTime: '16:00', venue: 'Garden terrace', address: 'Rose Garden Hotel, 8 Lake Road', dressCode: s('Garden formal, pastel colours', 'Lịch sự, tông pastel') } },
        { name: 'event', data: { name: 'Dinner & party', date: '2027-06-12', startTime: '18:00', endTime: '23:00', venue: 'Grand ballroom', address: 'Rose Garden Hotel, 8 Lake Road', note: s('Free parking at the hotel. Shuttle back to the city at 23:00.', 'Gửi xe miễn phí tại khách sạn. Có xe đưa về trung tâm lúc 23:00.') } },
        { name: 'timeline', data: { title: 'Schedule', items: [
          step('15:00', 'Ceremony', 'Garden terrace'),
          step('16:30', 'Cocktails', s('Drinks and photos by the lake', 'Tiệc nhẹ và chụp ảnh bên hồ')),
          step('18:00', 'Dinner & party', 'Grand ballroom'),
          step('21:00', s('First dance & cake', 'Điệu nhảy đầu tiên & cắt bánh')),
        ] } },
        { name: 'form', data: { title: s('Will you celebrate with us?', 'Bạn sẽ đến chung vui chứ?'), description: s('Please reply by 1 May.', 'Bạn trả lời giúp trước ngày 1/5 nhé.'), kind: 'rsvp', fields: RSVP_FIELDS, submitLabel: s('Send my reply', 'Gửi xác nhận') } },
        { name: 'image-album', data: { title: 'Us', images: album('event-1', 'event-2', 'event-3', 'event-4'), layout: 'grid' } },
      ] as Omit<BioBlock, 'index' | 'hidden'>[]),
      room: room({ wallColor: '#fde2e4', floorColor: '#e8c4a0', floorMaterial: 'wood', trimColor: '#ffffff' }, [
        { type: 'string-lights', position: [0, 2.6, -3], rotation: 0, wall: 'back', color: '#ffe8a3' },
        { type: 'string-lights', position: [-3, 2.6, 0], rotation: 0, wall: 'left', color: '#ffe8a3' },
        { type: 'picture-frame', position: [0, 1.6, -3], rotation: 0, wall: 'back', color: '#f97316', link: { label: 'RSVP', url: '' } },
        { type: 'coffee-table', position: [0, 0, -0.6], rotation: 0, color: '#fff7ed' },
        { type: 'candle', position: [-0.15, COFFEE_TABLE_TOP, -0.6], rotation: 0 },
        { type: 'candle', position: [0.15, COFFEE_TABLE_TOP, -0.55], rotation: 0 },
        { type: 'chair', position: [-0.8, 0, -0.6], rotation: 90, color: '#f5f5f2' },
        { type: 'chair', position: [0.8, 0, -0.6], rotation: 270, color: '#f5f5f2' },
        { type: 'plant', position: [-2.5, 0, -2.5], rotation: 0, color: '#6a994e' },
        { type: 'plant', position: [2.5, 0, -2.5], rotation: 0, color: '#6a994e' },
        { type: 'rug', position: [0, 0, 0.6], rotation: 0, color: '#f4acb7' },
      ]),
    }),
  },
]

export const PAGE_TEMPLATES: PageTemplate[] = [
  ...BASE_TEMPLATES,
  ...MORE_PAGE_TEMPLATES,
  ...PERSONAL_CREATIVE_TEMPLATES,
  ...PLACES_LEARNING_TEMPLATES,
  ...BUSINESS_HEALTH_SHOP_TEMPLATES,
]
