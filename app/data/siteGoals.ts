import type { TemplateCategory } from './pageTemplates'

// What a new site is for: the first step of the create flow. Each goal
// gathers the template categories it suggests, and gives the next step
// examples in the owner's language.

export type SiteGoalId = 'personal' | 'food' | 'shop' | 'beauty' | 'hospitality' | 'business' | 'events' | 'gifts' | 'blog'

interface Copy { label: string; hint: string; title: string; bio: string }

export interface SiteGoal {
  id: SiteGoalId
  icon: string
  categories: TemplateCategory[]
  en: Copy
  vi: Copy
}

export const SITE_GOALS: SiteGoal[] = [
  {
    id: 'personal',
    icon: 'i-lucide-user-round',
    categories: ['personal', 'creative'],
    en: { label: 'Me & my work', hint: 'Portfolio, creator, link in bio', title: 'Minh Anh', bio: 'Designer in Saigon. I make calm, friendly websites.' },
    vi: { label: 'Cá nhân & công việc', hint: 'Portfolio, KOL, link bio', title: 'Minh Anh', bio: 'Designer ở Sài Gòn, làm những trang web gọn gàng, dễ thương.' },
  },
  {
    id: 'food',
    icon: 'i-lucide-utensils',
    categories: ['food'],
    en: { label: 'Restaurant & café', hint: 'Menu, opening hours, table booking', title: 'Mây Coffee', bio: 'Specialty coffee and homemade cakes in District 3.' },
    vi: { label: 'Nhà hàng & cà phê', hint: 'Thực đơn, giờ mở cửa, đặt bàn', title: 'Mây Coffee', bio: 'Cà phê đặc sản và bánh nhà làm ở Quận 3.' },
  },
  {
    id: 'shop',
    icon: 'i-lucide-shopping-bag',
    categories: ['shop'],
    en: { label: 'Shop', hint: 'Products, prices, where to buy', title: 'Linen Studio', bio: 'Soft linen clothes, made in Hanoi. New drops every Friday.' },
    vi: { label: 'Cửa hàng', hint: 'Sản phẩm, giá, nơi mua', title: 'Linen Studio', bio: 'Quần áo linen mềm mại, may tại Hà Nội. Hàng mới mỗi thứ Sáu.' },
  },
  {
    id: 'beauty',
    icon: 'i-lucide-sparkles',
    categories: ['beauty', 'health'],
    en: { label: 'Beauty & wellness', hint: 'Salon, spa, gym, clinic', title: 'Lumi Spa', bio: 'Facials and massages in a quiet garden house.' },
    vi: { label: 'Làm đẹp & sức khoẻ', hint: 'Salon, spa, gym, phòng khám', title: 'Lumi Spa', bio: 'Chăm sóc da và massage trong một ngôi nhà vườn yên tĩnh.' },
  },
  {
    id: 'hospitality',
    icon: 'i-lucide-bed-double',
    categories: ['hospitality'],
    en: { label: 'Hotel & homestay', hint: 'Rooms, prices, booking', title: 'Sea Breeze Homestay', bio: 'Five rooms, two minutes from the beach.' },
    vi: { label: 'Khách sạn & homestay', hint: 'Phòng, giá, đặt phòng', title: 'Sea Breeze Homestay', bio: 'Năm phòng nhỏ, cách biển hai phút đi bộ.' },
  },
  {
    id: 'business',
    icon: 'i-lucide-briefcase',
    categories: ['business', 'education', 'community'],
    en: { label: 'Business & services', hint: 'Services, classes, communities', title: 'Bright English', bio: 'English classes for kids and adults, online and in person.' },
    vi: { label: 'Doanh nghiệp & dịch vụ', hint: 'Dịch vụ, lớp học, cộng đồng', title: 'Bright English', bio: 'Lớp tiếng Anh cho trẻ em và người lớn, online và tại lớp.' },
  },
  {
    id: 'events',
    icon: 'i-lucide-party-popper',
    categories: ['events'],
    en: { label: 'Event or wedding', hint: 'Schedule, venue, RSVP', title: 'Linh & Nam', bio: 'We’re getting married! 12 December, Da Lat.' },
    vi: { label: 'Sự kiện & đám cưới', hint: 'Lịch trình, địa điểm, xác nhận tham dự', title: 'Linh & Nam', bio: 'Chúng mình cưới rồi! 12 tháng 12, Đà Lạt.' },
  },
  {
    id: 'gifts',
    icon: 'i-lucide-gift',
    categories: ['gifts'],
    en: { label: 'A gift for someone', hint: 'A 3D birthday or love room', title: 'Happy birthday, Lily!', bio: 'A little room full of wishes from your friends.' },
    vi: { label: 'Quà tặng ai đó', hint: 'Phòng 3D sinh nhật, tình yêu', title: 'Chúc mừng sinh nhật Lily!', bio: 'Một căn phòng nhỏ đầy lời chúc từ bạn bè.' },
  },
  {
    id: 'blog',
    icon: 'i-lucide-newspaper',
    categories: ['blog'],
    en: { label: 'Blog', hint: 'Posts, stories, travel notes', title: 'Notes from the road', bio: 'Travel stories, slow mornings and good food.' },
    vi: { label: 'Blog', hint: 'Bài viết, câu chuyện, ghi chép du lịch', title: 'Ghi chép trên đường', bio: 'Chuyện du lịch, những buổi sáng chậm và món ngon.' },
  },
]

/** The goal a template belongs to, for a flow that starts from a template */
export function goalForCategory(category: TemplateCategory): SiteGoalId {
  return SITE_GOALS.find(goal => goal.categories.includes(category))?.id ?? 'personal'
}

/** A web address from a name: no accents, lowercase, hyphens between words */
export function addressFromName(name: string) {
  return name
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 30)
    .replace(/-+$/g, '')
}
