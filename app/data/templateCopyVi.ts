import type { BioBlock } from '~/types/bio'
import type { PageTemplateContent } from './pageTemplates'
import { MORE_VI } from './pageTemplatesMore'

// Vietnamese sample content for the page templates. Templates are written in
// English; for Vietnamese users every sample string is swapped for its
// translation here (exact match), the site language is set to Vietnamese and
// dollar prices become đồng.

const VI: Record<string, string> = {
  // Personal
  'Your Name': 'Tên của bạn',
  'Designer & developer. I build friendly products for the web.': 'Nhà thiết kế & lập trình viên. Tôi làm ra những sản phẩm web thân thiện.',
  'Portfolio': 'Hồ sơ năng lực',
  'Latest project': 'Dự án mới nhất',
  'Book a call': 'Đặt lịch gọi',
  'About': 'Giới thiệu',
  'I design and build calm, useful software. Eight years across startups and studios, now independent and open to new projects.': 'Tôi thiết kế và xây dựng phần mềm gọn gàng, hữu ích. Tám năm làm ở startup và studio, giờ làm tự do và sẵn sàng cho dự án mới.',
  'Selected work': 'Tác phẩm tiêu biểu',

  // Restaurant
  'Your Restaurant': 'Nhà hàng của bạn',
  'Fresh, seasonal cooking in the heart of the city.': 'Món ăn tươi ngon theo mùa giữa lòng thành phố.',
  'Our story': 'Câu chuyện của chúng tôi',
  'Family recipes, market produce and a charcoal grill. We cook what is in season and change the menu every month.': 'Công thức gia truyền, nguyên liệu từ chợ và bếp than hồng. Chúng tôi nấu theo mùa và đổi thực đơn mỗi tháng.',
  'Menu': 'Thực đơn',
  'Starters': 'Khai vị',
  'Mains': 'Món chính',
  'Drinks': 'Đồ uống',
  'Spring rolls': 'Chả giò',
  'Crispy rolls with herbs and dipping sauce': 'Chả giò giòn, ăn kèm rau sống và nước chấm',
  'Popular': 'Bán chạy',
  'Green papaya salad': 'Gỏi đu đủ',
  'Shrimp, peanuts, lime dressing': 'Tôm, đậu phộng, nước trộn chanh',
  'Grilled pork with rice': 'Cơm thịt nướng',
  'Charcoal grilled, pickled vegetables': 'Nướng than, kèm đồ chua',
  'Beef pho': 'Phở bò',
  'Slow-cooked broth, rice noodles': 'Nước dùng ninh lâu, bánh phở',
  'Chef’s pick': 'Bếp trưởng gợi ý',
  'Iced milk coffee': 'Cà phê sữa đá',
  'Fresh coconut': 'Dừa tươi',
  'Opening hours': 'Giờ mở cửa',
  'Last orders 30 minutes before closing.': 'Nhận món cuối 30 phút trước giờ đóng cửa.',
  'Find us': 'Địa chỉ',
  '12 Riverside Street, District 1': '12 Nguyễn Huệ, Quận 1',
  'Book a table': 'Đặt bàn',
  'We’ll confirm by phone within the hour.': 'Chúng tôi sẽ gọi xác nhận trong vòng một giờ.',

  // Homestay
  'Your Homestay': 'Homestay của bạn',
  'A quiet place to stay, five minutes from the beach.': 'Chốn nghỉ yên tĩnh, cách biển năm phút.',
  'The house': 'Ngôi nhà',
  'Six rooms around a garden courtyard, with breakfast on the terrace and bikes to borrow.': 'Sáu phòng quanh khoảng sân vườn, bữa sáng trên hiên và xe đạp cho mượn.',
  'Rooms': 'Phòng',
  ' / night': ' / đêm',
  'Standard double': 'Phòng đôi tiêu chuẩn',
  'Queen bed, garden view, breakfast included': 'Giường đôi lớn, nhìn ra vườn, kèm bữa sáng',
  'Deluxe sea view': 'Phòng deluxe hướng biển',
  'King bed, balcony, sea view': 'Giường king, ban công, hướng biển',
  'Best seller': 'Được chọn nhiều',
  'Family suite': 'Phòng gia đình',
  'Two bedrooms, sleeps 4': 'Hai phòng ngủ, cho 4 người',
  'Contact & booking': 'Liên hệ & đặt phòng',
  'Book your stay': 'Đặt phòng',
  'Ask about your dates': 'Hỏi phòng trống',
  'Check availability': 'Kiểm tra phòng trống',
  'Reception': 'Lễ tân',
  'Check-in from 14:00, check-out before 12:00.': 'Nhận phòng từ 14:00, trả phòng trước 12:00.',

  // Café
  'Your Café': 'Quán cà phê của bạn',
  'Specialty coffee, homemade cakes and good music.': 'Cà phê đặc sản, bánh nhà làm và nhạc hay.',
  'Our menu': 'Thực đơn',
  'Coffee': 'Cà phê',
  'Espresso': 'Espresso',
  'Salted cream coffee': 'Cà phê muối',
  'Our signature': 'Món đặc trưng của quán',
  'Signature': 'Đặc trưng',
  'Cold brew': 'Cold brew',
  'Cakes': 'Bánh',
  'Banana bread': 'Bánh chuối',
  'Cheesecake': 'Bánh phô mai',
  'Inside the café': 'Bên trong quán',
  'Visit us': 'Ghé quán',

  // Creator
  'Your Studio': 'Studio của bạn',
  'Illustration, prints and commissions.': 'Minh họa, tranh in và nhận đặt vẽ.',
  'Recent work': 'Tác phẩm gần đây',
  'Shop & commissions': 'Cửa hàng & đặt vẽ',
  'Shop prints': 'Mua tranh in',
  'Commission me': 'Đặt vẽ riêng',

  // Link in bio
  'Creator · sharing what I make and love.': 'Nhà sáng tạo · chia sẻ những điều mình làm và yêu thích.',
  'Latest video': 'Video mới nhất',
  'My newsletter': 'Bản tin của mình',
  'Shop my picks': 'Đồ mình hay dùng',
  'Work with me': 'Hợp tác với mình',

  // Services
  'Photography, design and video for small businesses.': 'Chụp ảnh, thiết kế và quay video cho doanh nghiệp nhỏ.',
  'What I do': 'Tôi làm gì',
  'I help small businesses look their best online: brand photos, simple identities and short videos for social media.': 'Tôi giúp doanh nghiệp nhỏ thật nổi bật trên mạng: ảnh thương hiệu, bộ nhận diện đơn giản và video ngắn cho mạng xã hội.',
  'Services': 'Dịch vụ',
  'Brand photo shoot': 'Chụp ảnh thương hiệu',
  'Half day, 30 edited photos': 'Nửa ngày, 30 ảnh đã chỉnh',
  'Logo & identity': 'Logo & nhận diện',
  'Logo, colors, typography': 'Logo, màu sắc, kiểu chữ',
  'Short promo video': 'Video quảng cáo ngắn',
  '30–60 second edit': 'Dựng 30–60 giây',
  'Book a free call': 'Đặt cuộc gọi miễn phí',
  'Tell me about your project': 'Kể cho tôi về dự án của bạn',
  'Send message': 'Gửi tin nhắn',
  'Availability': 'Lịch làm việc',
  'Replies within one business day.': 'Phản hồi trong một ngày làm việc.',

  // Wedding & event
  'Anna & Minh': 'Lan & Minh',
  'We’re getting married! Saturday, 12 June 2027.': 'Chúng mình kết hôn rồi! Thứ Bảy, 12 tháng 6, 2027.',
  'Join us': 'Mời bạn đến chung vui',
  'We would love to celebrate with you. Dinner, dancing and a garden full of flowers. Please let us know if you can come by 1 May.': 'Chúng mình rất mong được chung vui cùng bạn: tiệc tối, khiêu vũ và một khu vườn đầy hoa. Bạn báo giúp chúng mình trước ngày 1 tháng 5 nhé.',
  'Schedule': 'Lịch trình',
  'The day': 'Ngày cưới',
  'Ceremony': 'Lễ thành hôn',
  'Garden terrace': 'Sân vườn',
  'Cocktails': 'Tiệc nhẹ',
  'Dinner & party': 'Tiệc tối',
  'Grand ballroom': 'Sảnh tiệc lớn',
  'Venue': 'Địa điểm',
  'Rose Garden Hotel, 8 Lake Road': 'Khách sạn Vườn Hồng, 8 đường Ven Hồ',
  'RSVP': 'Xác nhận tham dự',
  'Us': 'Chúng mình',
}

// Freelancer prices in dollars, in đồng for Vietnamese users
const VND_PRICES: Record<string, string> = { '250': '2,500,000', '600': '6,000,000', '450': '4,500,000' }

function translate<T>(value: T): T {
  if (typeof value === 'string') return (VI[value] ?? MORE_VI[value] ?? value) as T
  if (Array.isArray(value)) return value.map(translate) as T
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, inner]) =>
      // ids and links stay as they are
      [key, key === 'id' || key === 'url' || key === 'imageUrl' ? inner : translate(inner)],
    )) as T
  }
  return value
}

/** Template content for a language; English is returned unchanged */
export function localizeTemplateContent(content: PageTemplateContent, lang: string): PageTemplateContent {
  if (lang !== 'vi') return content
  const blocks = (content.blocks.map((block) => {
    const data = translate(block.data) as any
    if (block.name === 'menu' && data.currency === '$') {
      data.currency = '₫'
      for (const section of data.sections ?? []) {
        for (const item of section.items ?? []) item.price = VND_PRICES[item.price] ?? item.price
      }
    }
    return { ...block, data }
  })) as BioBlock[]
  return {
    ...content,
    title: translate(content.title),
    bio: translate(content.bio),
    blocks,
    themeConfig: { ...content.themeConfig, language: 'vi' },
  }
}
