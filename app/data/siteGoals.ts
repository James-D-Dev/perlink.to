import type { AppLanguage } from '#shared/language'
import type { TemplateCategory } from './pageTemplates'

// What a new site is for: the first step of the create flow. Each goal
// gathers the template categories it suggests, and gives the next step
// examples in the owner's language.

export type SiteGoalId = 'personal' | 'food' | 'shop' | 'beauty' | 'hospitality' | 'business' | 'events' | 'gifts' | 'blog'

interface Copy { label: string; hint: string; title: string; bio: string }

// The words for each language sit under its code (goal.en, goal.vi, goal.zh…)
export interface SiteGoal extends Record<AppLanguage, Copy> {
  id: SiteGoalId
  icon: string
  categories: TemplateCategory[]
}

export const SITE_GOALS: SiteGoal[] = [
  {
    id: 'personal',
    icon: 'i-lucide-user-round',
    categories: ['personal', 'creative'],
    en: { label: 'Me & my work', hint: 'Portfolio, creator, link in bio', title: 'Minh Anh', bio: 'Designer in Saigon. I make calm, friendly websites.' },
    vi: { label: 'Cá nhân & công việc', hint: 'Portfolio, KOL, link bio', title: 'Minh Anh', bio: 'Designer ở Sài Gòn, làm những trang web gọn gàng, dễ thương.' },
    zh: { label: '个人与作品', hint: '作品集、创作者、主页链接', title: '林小雨', bio: '上海的设计师，做安静又友好的网站。' },
    ja: { label: '自分と仕事', hint: 'ポートフォリオ、クリエイター、リンクまとめ', title: '佐藤 美咲', bio: '東京のデザイナー。落ち着いた、やさしいウェブサイトを作っています。' },
    ko: { label: '나와 나의 작업', hint: '포트폴리오, 크리에이터, 링크 인 바이오', title: '김지은', bio: '서울에서 활동하는 디자이너예요. 차분하고 따뜻한 웹사이트를 만들어요.' },
  },
  {
    id: 'food',
    icon: 'i-lucide-utensils',
    categories: ['food'],
    en: { label: 'Restaurant & café', hint: 'Menu, opening hours, table booking', title: 'Mây Coffee', bio: 'Specialty coffee and homemade cakes in District 3.' },
    vi: { label: 'Nhà hàng & cà phê', hint: 'Thực đơn, giờ mở cửa, đặt bàn', title: 'Mây Coffee', bio: 'Cà phê đặc sản và bánh nhà làm ở Quận 3.' },
    zh: { label: '餐厅与咖啡馆', hint: '菜单、营业时间、订座', title: '云朵咖啡', bio: '精品咖啡和手工蛋糕，就在静安区。' },
    ja: { label: 'レストラン・カフェ', hint: 'メニュー、営業時間、席の予約', title: 'くもカフェ', bio: '下北沢のスペシャルティコーヒーと手作りケーキのお店です。' },
    ko: { label: '식당 & 카페', hint: '메뉴, 영업시간, 테이블 예약', title: '구름 커피', bio: '연남동의 스페셜티 커피와 수제 케이크.' },
  },
  {
    id: 'shop',
    icon: 'i-lucide-shopping-bag',
    categories: ['shop'],
    en: { label: 'Shop', hint: 'Products, prices, where to buy', title: 'Linen Studio', bio: 'Soft linen clothes, made in Hanoi. New drops every Friday.' },
    vi: { label: 'Cửa hàng', hint: 'Sản phẩm, giá, nơi mua', title: 'Linen Studio', bio: 'Quần áo linen mềm mại, may tại Hà Nội. Hàng mới mỗi thứ Sáu.' },
    zh: { label: '店铺', hint: '商品、价格、购买渠道', title: 'Linen Studio', bio: '柔软的亚麻衣物，杭州制作。每周五上新。' },
    ja: { label: 'ショップ', hint: '商品、価格、購入方法', title: 'Linen Studio', bio: 'やわらかなリネンの服を京都で作っています。毎週金曜に新作が入荷します。' },
    ko: { label: '쇼핑몰', hint: '상품, 가격, 구매처', title: 'Linen Studio', bio: '부드러운 린넨 옷, 서울에서 만들어요. 매주 금요일 신상품 입고.' },
  },
  {
    id: 'beauty',
    icon: 'i-lucide-sparkles',
    categories: ['beauty', 'health'],
    en: { label: 'Beauty & wellness', hint: 'Salon, spa, gym, clinic', title: 'Lumi Spa', bio: 'Facials and massages in a quiet garden house.' },
    vi: { label: 'Làm đẹp & sức khoẻ', hint: 'Salon, spa, gym, phòng khám', title: 'Lumi Spa', bio: 'Chăm sóc da và massage trong một ngôi nhà vườn yên tĩnh.' },
    zh: { label: '美容与健康', hint: '美发、水疗、健身房、诊所', title: 'Lumi Spa', bio: '在安静的花园小屋里做面部护理和按摩。' },
    ja: { label: '美容・ウェルネス', hint: 'サロン、スパ、ジム、クリニック', title: 'Lumi Spa', bio: '静かな庭のある一軒家で、フェイシャルとマッサージを。' },
    ko: { label: '뷰티 & 웰니스', hint: '살롱, 스파, 헬스장, 클리닉', title: 'Lumi Spa', bio: '조용한 정원 집에서 받는 페이셜 케어와 마사지.' },
  },
  {
    id: 'hospitality',
    icon: 'i-lucide-bed-double',
    categories: ['hospitality'],
    en: { label: 'Hotel & homestay', hint: 'Rooms, prices, booking', title: 'Sea Breeze Homestay', bio: 'Five rooms, two minutes from the beach.' },
    vi: { label: 'Khách sạn & homestay', hint: 'Phòng, giá, đặt phòng', title: 'Sea Breeze Homestay', bio: 'Năm phòng nhỏ, cách biển hai phút đi bộ.' },
    zh: { label: '酒店与民宿', hint: '房间、价格、预订', title: '海风民宿', bio: '五间客房，步行两分钟就到海边。' },
    ja: { label: 'ホテル・民泊', hint: '客室、料金、予約', title: '海風ゲストハウス', bio: '全5室、ビーチまで歩いて2分です。' },
    ko: { label: '호텔 & 스테이', hint: '객실, 요금, 예약', title: '바닷바람 스테이', bio: '객실 다섯 개, 해변까지 걸어서 2분.' },
  },
  {
    id: 'business',
    icon: 'i-lucide-briefcase',
    categories: ['business', 'education', 'community'],
    en: { label: 'Business & services', hint: 'Services, classes, communities', title: 'Bright English', bio: 'English classes for kids and adults, online and in person.' },
    vi: { label: 'Doanh nghiệp & dịch vụ', hint: 'Dịch vụ, lớp học, cộng đồng', title: 'Bright English', bio: 'Lớp tiếng Anh cho trẻ em và người lớn, online và tại lớp.' },
    zh: { label: '企业与服务', hint: '服务、课程、社群', title: 'Bright English', bio: '面向儿童和成人的英语课程，线上线下都有。' },
    ja: { label: 'ビジネス・サービス', hint: 'サービス、教室、コミュニティ', title: 'Bright English', bio: '子どもから大人までの英会話教室。オンラインと対面で開講しています。' },
    ko: { label: '비즈니스 & 서비스', hint: '서비스, 클래스, 커뮤니티', title: 'Bright English', bio: '어린이와 성인을 위한 영어 수업, 온라인과 오프라인 모두 가능해요.' },
  },
  {
    id: 'events',
    icon: 'i-lucide-party-popper',
    categories: ['events'],
    en: { label: 'Event or wedding', hint: 'Schedule, venue, RSVP', title: 'Linh & Nam', bio: 'We’re getting married! 12 December, Da Lat.' },
    vi: { label: 'Sự kiện & đám cưới', hint: 'Lịch trình, địa điểm, xác nhận tham dự', title: 'Linh & Nam', bio: 'Chúng mình cưới rồi! 12 tháng 12, Đà Lạt.' },
    zh: { label: '活动或婚礼', hint: '日程、地点、回复出席', title: '小林 & 阿杰', bio: '我们要结婚啦！12 月 12 日，大理。' },
    ja: { label: 'イベント・結婚式', hint: 'スケジュール、会場、出欠確認', title: '健太 & 美咲', bio: '私たち、結婚します！12月12日、軽井沢にて。' },
    ko: { label: '행사 & 결혼식', hint: '일정, 장소, 참석 여부', title: '민준 & 지은', bio: '저희 결혼해요! 12월 12일, 제주에서.' },
  },
  {
    id: 'gifts',
    icon: 'i-lucide-gift',
    categories: ['gifts'],
    en: { label: 'A gift for someone', hint: 'A 3D birthday or love room', title: 'Happy birthday, Lily!', bio: 'A little room full of wishes from your friends.' },
    vi: { label: 'Quà tặng ai đó', hint: 'Phòng 3D sinh nhật, tình yêu', title: 'Chúc mừng sinh nhật Lily!', bio: 'Một căn phòng nhỏ đầy lời chúc từ bạn bè.' },
    zh: { label: '送给某人的礼物', hint: '3D 生日或爱情房间', title: '小美，生日快乐！', bio: '一个装满朋友们祝福的小房间。' },
    ja: { label: '誰かへのプレゼント', hint: '誕生日や恋人に贈る3Dルーム', title: 'ゆいちゃん、誕生日おめでとう！', bio: '友だちからのお祝いメッセージがいっぱいの小さな部屋です。' },
    ko: { label: '누군가를 위한 선물', hint: '생일, 사랑을 담은 3D 방', title: '서연아, 생일 축하해!', bio: '친구들의 축하 메시지로 가득한 작은 방.' },
  },
  {
    id: 'blog',
    icon: 'i-lucide-newspaper',
    categories: ['blog'],
    en: { label: 'Blog', hint: 'Posts, stories, travel notes', title: 'Notes from the road', bio: 'Travel stories, slow mornings and good food.' },
    vi: { label: 'Blog', hint: 'Bài viết, câu chuyện, ghi chép du lịch', title: 'Ghi chép trên đường', bio: 'Chuyện du lịch, những buổi sáng chậm và món ngon.' },
    zh: { label: '博客', hint: '文章、故事、旅行笔记', title: '在路上的笔记', bio: '旅行故事、慢悠悠的早晨和美食。' },
    ja: { label: 'ブログ', hint: '記事、ストーリー、旅の記録', title: '旅の途中のノート', bio: '旅の話、ゆっくりした朝、おいしいごはん。' },
    ko: { label: '블로그', hint: '글, 이야기, 여행 기록', title: '길 위의 기록', bio: '여행 이야기, 느긋한 아침, 그리고 맛있는 음식.' },
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
