import { nanoid } from 'nanoid'
import type { ProductItem, ProductOption } from '~/types/bio'
import type { PageTemplate } from '../pageTemplates'
import { SAMPLE_ADDRESS, SAMPLE_PHONE, album, look, menu, photo, social, withIndex } from '../templateKit'
import { type Blocks, booking, hours, loungeRoom, reviews, shopRoom, studioRoom } from '../pageTemplatesMore'

// Businesses, health and shops. Sample text in English with its Vietnamese next to it:
// `s(en, vi)` returns the English and registers the translation.

export const BUSINESS_HEALTH_SHOP_VI: Record<string, string> = {}
function s(en: string, vi: string) {
  BUSINESS_HEALTH_SHOP_VI[en] = vi
  return en
}

/** Products for sale on the page: [name, price in đồng, photo, description?, tag?, price before a discount?] */
function products(...items: [string, number, string, string?, string?, number?][]): ProductItem[] {
  return items.map(([name, price, image, description, tag, comparePrice]) => ({
    id: nanoid(6), name, price, imageUrl: photo(image), description, tag, comparePrice,
  }))
}

const step = (date: string, title: string, text?: string) => ({ id: nanoid(6), date, title, text })

/** A product option, e.g. opt('Size', 'S', 'M') or opt('Colour', ['Sand', '#d8c3a5']) */
function opt(name: string, ...values: (string | [string, string])[]): ProductOption {
  return { id: nanoid(6), name, values: values.map(v => (Array.isArray(v) ? { id: nanoid(6), label: v[0], color: v[1] } : { id: nanoid(6), label: v })) }
}

/** The questions every owner answers again and again, as one card */
const faq = (title: string, content: string) => ({ name: 'text' as const, data: { title, content, align: 'left' as const, style: 'card' as const } })

/** Extra fields for the products made by products(), in the same order */
function withDetails(items: ProductItem[], ...details: Partial<ProductItem>[]): ProductItem[] {
  return items.map((item, i) => ({ ...item, ...details[i] }))
}

export const BUSINESS_HEALTH_SHOP_TEMPLATES: PageTemplate[] = [
  // ─── Business ─────────────────────────────────────────────────
  {
    id: 'creative-agency',
    name: 'Creative agency',
    category: 'business',
    description: 'A loud, poster-like page for a design or marketing studio: services, case studies, how you work and a project brief.',
    icon: 'i-lucide-pen-tool',
    preview: { bg: '#FFF4D6', accent: '#FF4D2E' },
    build: () => ({
      title: s('Pixel & Punch Studio', 'Pixel & Punch Studio'),
      bio: s('Brands, campaigns and websites that refuse to be boring.', 'Thương hiệu, chiến dịch và website không chịu nhàm chán.'),
      avatarUrl: photo('agency-avatar'),
      themeConfig: {
        ...look({
          bg: '#FFF4D6', text: '#111111', accent: '#FF4D2E', onAccent: '#FFFFFF', surface: '#FFFFFF', border: '#111111', radius: 4, shadow: 'hard',
          nameFont: 'Space Grotesk, sans-serif', nameWeight: '700', nameSize: '2.4rem', tracking: '-0.03em', headingFont: 'Space Grotesk, sans-serif', bodyFont: 'Inter Tight, sans-serif',
          header: 'banner-square', banner: photo('agency-cover'), avatar: 'square', link: 'horizontal-left', social: 'filled', titleAlign: 'left',
        }),
        background: { type: 'solid', color: '#FFF4D6', pattern: { id: 'grid', color: '#111111' } },
      },
      blocks: withIndex([
        { name: 'text', data: { title: s('We make brands loud', 'Chúng tôi làm thương hiệu “lên tiếng”'), content: s('A team of eight designers, writers and developers in Saigon. We’ve launched 120+ brands for cafés, fashion labels and tech startups.', 'Tám người: designer, copywriter và lập trình viên ở Sài Gòn. Đã ra mắt hơn 120 thương hiệu cho quán cà phê, thương hiệu thời trang và startup công nghệ.'), align: 'left', style: 'card' } },
        { name: 'menu', data: { title: s('What we do', 'Chúng tôi làm gì'), currency: '₫', layout: 'list', sections: menu([
          { name: '', items: [
            [s('Brand identity', 'Nhận diện thương hiệu'), s('from 25,000,000', 'từ 25.000.000'), s('Logo, colours, type, guidelines', 'Logo, màu sắc, font chữ, bộ quy chuẩn')],
            [s('Social campaign', 'Chiến dịch mạng xã hội'), s('from 15,000,000', 'từ 15.000.000'), s('Concept, 30 posts, short videos', 'Ý tưởng, 30 bài đăng, video ngắn'), s('Most requested', 'Được yêu cầu nhiều')],
            [s('Website design & build', 'Thiết kế & làm website'), s('from 40,000,000', 'từ 40.000.000'), s('Design, build and launch in 6 weeks', 'Thiết kế, lập trình và ra mắt trong 6 tuần')],
          ] },
        ]) } },
        { name: 'image-album', data: { title: s('Recent work', 'Dự án gần đây'), images: album('agency-1', 'agency-3', 'agency-2', 'creator-art-1'), layout: 'masonry' } },
        { name: 'timeline', data: { title: s('How we work', 'Cách chúng tôi làm việc'), items: [
          step('01', s('Brief', 'Brief'), s('A 45-minute call to understand the goal, not just the logo.', 'Một cuộc gọi 45 phút để hiểu mục tiêu, không chỉ cái logo.')),
          step('02', s('Strategy', 'Chiến lược'), s('Audience, voice and the one idea worth remembering.', 'Khách hàng, giọng nói và một ý tưởng đáng nhớ.')),
          step('03', s('Design sprint', 'Thiết kế'), s('Two directions, two rounds of feedback.', 'Hai hướng thiết kế, hai vòng góp ý.')),
          step('04', s('Launch', 'Ra mắt'), s('Files, guidelines and a launch plan you can run.', 'Bàn giao file, bộ quy chuẩn và kế hoạch ra mắt.')),
        ] } },
        { name: 'testimonials', data: { title: s('Clients say', 'Khách hàng nói'), items: reviews(
          [s('They turned our tiny café into a brand people queue for.', 'Họ biến quán cà phê nhỏ của tôi thành thương hiệu khách xếp hàng chờ.'), 'Linh Trần', s('Founder, Mây Coffee', 'Nhà sáng lập, Mây Coffee')],
          [s('Fast, sharp and honest about what wouldn’t work.', 'Nhanh, sắc sảo và thẳng thắn với những gì không hiệu quả.'), 'David Lee', s('CMO, Finly', 'CMO, Finly')],
        ) } },
        faq(s('Before we start', 'Trước khi bắt đầu'), s('💬 The first call is free and there’s no pitch deck\n🧾 A fixed quote within 48 hours, paid in three milestones\n🔁 Two rounds of changes are included in every package\n📁 You own every file, including the source files', '💬 Cuộc gọi đầu tiên miễn phí, không cần chuẩn bị gì\n🧾 Báo giá trọn gói trong 48 giờ, thanh toán ba đợt\n🔁 Mỗi gói đã gồm hai vòng chỉnh sửa\n📁 Bàn giao toàn bộ file, kể cả file gốc')),
        { name: 'form', data: { title: s('Start a project', 'Bắt đầu dự án'), description: s('Pick a service, tell us what you’re making and your budget. We reply within a day.', 'Chọn dịch vụ, kể cho chúng tôi bạn đang làm gì và ngân sách. Chúng tôi trả lời trong một ngày.'), kind: 'contact', fields: { phone: true, email: true, date: false, time: false, guests: false, message: true, service: true }, submitLabel: s('Send the brief', 'Gửi brief') } },
        { name: 'social', data: { links: social('behance', 'instagram', 'linkedin', 'facebook') } },
      ] as Blocks),
      room: studioRoom('#fff4d6', '#c9b38e', '#ff4d2e', s('Start a project', 'Bắt đầu dự án'), [
        { type: 'neon-sign', position: [-0.9, 2.1, -3], rotation: 0, wall: 'back', color: '#ff4d2e', link: { label: s('Our work', 'Dự án'), url: '' } },
        { type: 'picture-frame', position: [-3, 1.6, 1.2], rotation: 0, wall: 'left', color: '#111111', image: photo('agency-1') },
      ]),
    }),
  },
  {
    id: 'interior-design',
    name: 'Interior design studio',
    category: 'business',
    description: 'A quiet, magazine-like page for an interior studio: projects in a carousel, services by the square metre and a consultation booking.',
    icon: 'i-lucide-sofa',
    preview: { bg: '#F3EEE7', accent: '#A4683F' },
    build: () => ({
      title: s('Atelier Mộc · Interiors', 'Atelier Mộc · Nội thất'),
      bio: s('Warm, calm homes made of wood, linen and light.', 'Những ngôi nhà ấm và tĩnh, làm từ gỗ, vải lanh và ánh sáng.'),
      avatarUrl: photo('interior-cover'),
      themeConfig: look({
        bg: '#F3EEE7', text: '#2B2622', accent: '#A4683F', onAccent: '#FFFFFF', surface: '#FBF8F3', border: '#E2D8CA', radius: 2, shadow: 'none',
        nameFont: 'Cormorant Garamond, serif', nameWeight: '500', nameSize: '2.6rem', tracking: '0.01em', headingFont: 'Cormorant Garamond, serif', bodyFont: 'Josefin Sans, sans-serif',
        header: 'cover', link: 'vertical', social: 'outline', gap: 'relaxed',
      }),
      blocks: withIndex([
        { name: 'text', data: { title: s('Homes that feel like you', 'Ngôi nhà mang dáng dấp của bạn'), content: s('We design apartments, townhouses and small cafés across Vietnam, from the first sketch to the last cushion. Every project starts with how you live, not with a style.', 'Chúng tôi thiết kế căn hộ, nhà phố và quán cà phê nhỏ khắp Việt Nam, từ nét phác đầu tiên đến chiếc gối cuối cùng. Mỗi dự án bắt đầu từ cách bạn sống, không phải từ một phong cách.'), align: 'center', style: 'plain' } },
        { name: 'image-album', data: { title: s('Selected projects', 'Dự án tiêu biểu'), images: album('interior-1', 'interior-3', 'interior-2', 'interior-4'), layout: 'carousel' } },
        { name: 'menu', data: { title: s('Services', 'Dịch vụ'), currency: '₫', layout: 'list', sections: menu([
          { name: '', items: [
            [s('Concept design', 'Thiết kế ý tưởng'), s('250,000 / m²', '250.000 / m²'), s('Layout, mood board, 3D renders', 'Mặt bằng, mood board, phối cảnh 3D')],
            [s('Full design & build', 'Thiết kế & thi công trọn gói'), s('from 6,500,000 / m²', 'từ 6.500.000 / m²'), s('One team from drawings to handover', 'Một đội từ bản vẽ đến bàn giao'), s('Most chosen', 'Được chọn nhiều')],
            [s('Styling refresh', 'Làm mới không gian'), '12,000,000', s('Furniture, lighting and decor for one room', 'Nội thất rời, đèn và đồ trang trí cho một phòng')],
          ] },
        ]) } },
        { name: 'timeline', data: { title: s('From sketch to handover', 'Từ bản phác đến bàn giao'), items: [
          step(s('Week 1', 'Tuần 1'), s('Site visit & brief', 'Khảo sát & lắng nghe')),
          step(s('Weeks 2–4', 'Tuần 2–4'), s('Concept & 3D renders', 'Ý tưởng & phối cảnh 3D')),
          step(s('Weeks 5–12', 'Tuần 5–12'), s('Build & furnish', 'Thi công & hoàn thiện')),
          step(s('Week 13', 'Tuần 13'), s('Keys in your hand', 'Trao chìa khoá'), s('Plus a year of free fixes.', 'Kèm một năm bảo hành miễn phí.')),
        ] } },
        { name: 'testimonials', data: { items: reviews(
          [s('Our 70 m² flat feels twice the size, and finally like home.', 'Căn hộ 70 m² rộng gấp đôi cảm giác, và cuối cùng cũng thật sự là nhà.'), 'Hà & Quân', s('Apartment, Thao Dien', 'Căn hộ Thảo Điền')],
          [s('On budget, on time, and they hid every cable.', 'Đúng ngân sách, đúng hẹn, giấu gọn từng sợi dây điện.'), 'Chị Thảo', s('Townhouse, Gò Vấp', 'Nhà phố Gò Vấp')],
        ) } },
        faq(s('Common questions', 'Câu hỏi thường gặp'), s('📐 The site visit and first ideas are free within the city\n💰 Most apartments land between 300 and 600 million đồng, all in\n🗓️ Concept in 3 weeks, build in 8–10 weeks\n🛠️ One year of free fixes after handover', '📐 Khảo sát và ý tưởng ban đầu miễn phí trong nội thành\n💰 Đa số căn hộ trọn gói từ 300 đến 600 triệu đồng\n🗓️ Ý tưởng trong 3 tuần, thi công 8–10 tuần\n🛠️ Bảo hành miễn phí một năm sau bàn giao')),
        { name: 'form', data: { title: s('Book a free consultation', 'Đặt lịch tư vấn miễn phí'), kind: 'booking', fields: booking(true, true, false), submitLabel: s('Book a visit', 'Đặt lịch khảo sát') } },
        { name: 'hours', data: { title: s('Studio hours', 'Giờ làm việc'), days: hours('08:30', '18:00', [0]) } },
        { name: 'contact', data: { title: s('The studio', 'Studio'), address: SAMPLE_ADDRESS, phone: SAMPLE_PHONE, quickBar: true } },
        { name: 'social', data: { links: social('instagram', 'pinterest', 'facebook', 'googlemaps') } },
      ] as Blocks),
      room: loungeRoom('#efe7dc', '#b48a62', '#a4683f', s('Our projects', 'Dự án'), [
        { type: 'bookshelf', position: [2.3, 0, -2.8], rotation: 0 },
        { type: 'picture-frame', position: [-3, 1.6, 0.4], rotation: 0, wall: 'left', color: '#ffffff', image: photo('interior-1') },
      ]),
    }),
  },
  {
    id: 'consulting',
    name: 'Consulting & law firm',
    category: 'business',
    description: 'A sober navy-and-gold page for consultants, lawyers and accountants: practice areas with fees, how it works and a consultation booking.',
    icon: 'i-lucide-scale',
    preview: { bg: '#0E1A2B', accent: '#C9A45C' },
    build: () => ({
      title: s('Nguyen & Partners', 'Nguyễn & Cộng sự'),
      bio: s('Business setup, tax and contracts for small companies. Clear advice, fixed fees.', 'Thành lập doanh nghiệp, thuế và hợp đồng cho công ty nhỏ. Tư vấn rõ ràng, phí cố định.'),
      avatarUrl: photo('consult-avatar'),
      themeConfig: look({
        bg: '#0E1A2B', text: '#E8EDF5', accent: '#C9A45C', onAccent: '#0E1A2B', surface: '#15243A', border: '#24385A', radius: 10, shadow: 'sm',
        nameFont: 'Playfair Display, serif', nameWeight: '600', nameSize: '2.1rem', headingFont: 'Playfair Display, serif', bodyFont: 'Inter Tight, sans-serif',
        header: 'banner-circle', banner: photo('consult-cover'), link: 'horizontal-left', social: 'outline',
      }),
      blocks: withIndex([
        { name: 'text', data: { title: s('Who we help', 'Chúng tôi giúp ai'), content: s('Founders, family businesses and foreign investors opening in Vietnam. 15 years of practice, 600+ companies set up.', 'Nhà sáng lập, doanh nghiệp gia đình và nhà đầu tư nước ngoài mở công ty tại Việt Nam. 15 năm hành nghề, hơn 600 doanh nghiệp đã thành lập.'), align: 'left', style: 'card' } },
        { name: 'menu', data: { title: s('Practice areas', 'Lĩnh vực tư vấn'), currency: '₫', layout: 'list', sections: menu([
          { name: '', items: [
            [s('Company setup', 'Thành lập công ty'), '6,000,000', s('Licence, seal, bank account in 7 days', 'Giấy phép, con dấu, tài khoản ngân hàng trong 7 ngày')],
            [s('Tax & bookkeeping', 'Thuế & kế toán'), s('2,500,000 / month', '2.500.000 / tháng'), s('Monthly filings and a yearly report', 'Kê khai hằng tháng và báo cáo năm'), s('Most chosen', 'Được chọn nhiều')],
            [s('Contract review', 'Rà soát hợp đồng'), '3,000,000', s('Written notes within 48 hours', 'Nhận xét bằng văn bản trong 48 giờ')],
          ] },
        ]) } },
        { name: 'timeline', data: { title: s('Working with us', 'Quy trình làm việc'), items: [
          step('1', s('A free 30-minute call', 'Gọi tư vấn miễn phí 30 phút')),
          step('2', s('A fixed-fee proposal', 'Báo giá trọn gói'), s('No hourly surprises.', 'Không phát sinh theo giờ.')),
          step('3', s('We do the paperwork', 'Chúng tôi lo giấy tờ')),
          step('4', s('A clear written report', 'Báo cáo rõ ràng bằng văn bản')),
        ] } },
        { name: 'testimonials', data: { items: reviews(
          [s('They set up our company in a week and still answer our questions on Zalo.', 'Họ lập công ty cho chúng tôi trong một tuần và vẫn trả lời câu hỏi qua Zalo.'), 'Minh Khoa', s('Founder, Lumi Tea', 'Nhà sáng lập, Lumi Tea')],
          [s('The only accountants who explained our taxes in plain words.', 'Đơn vị kế toán duy nhất giải thích thuế cho chúng tôi bằng lời dễ hiểu.'), 'Sarah Kim', s('Director, Kim Trading', 'Giám đốc, Kim Trading')],
        ) } },
        faq(s('What to prepare', 'Cần chuẩn bị gì'), s('🪪 ID or passport of every founder\n🏢 The office address and its lease\n📝 Your business lines; we help pick the right codes\n🌏 Foreign investors: proof of funds, translated by us', '🪪 CCCD hoặc hộ chiếu của các thành viên sáng lập\n🏢 Địa chỉ trụ sở và hợp đồng thuê\n📝 Ngành nghề kinh doanh; chúng tôi giúp chọn mã ngành phù hợp\n🌏 Nhà đầu tư nước ngoài: chứng minh tài chính, chúng tôi dịch giúp')),
        { name: 'form', data: { title: s('Book a consultation', 'Đặt lịch tư vấn'), kind: 'booking', fields: booking(true, true, false), submitLabel: s('Request a call', 'Yêu cầu gọi lại') } },
        { name: 'hours', data: { title: s('Office hours', 'Giờ làm việc'), days: hours('08:30', '17:30', [0, 6]) } },
        { name: 'contact', data: { title: s('Our office', 'Văn phòng'), address: SAMPLE_ADDRESS, phone: SAMPLE_PHONE, email: 'hello@example.com', quickBar: true } },
        { name: 'social', data: { links: social('linkedin', 'zalo', 'facebook') } },
      ] as Blocks),
      room: studioRoom('#15243a', '#5a4632', '#c9a45c', s('Book a consultation', 'Đặt lịch tư vấn'), [
        { type: 'bookshelf', position: [2.3, 0, -2.8], rotation: 0 },
      ]),
    }),
  },

  // ─── Health ───────────────────────────────────────────────────
  {
    id: 'yoga-studio',
    name: 'Yoga studio',
    category: 'health',
    description: 'A soft, slow page for a yoga studio: class passes, the week’s schedule, photos, a free trial class and calm music.',
    icon: 'i-lucide-flower-2',
    preview: { bg: '#F4EEE5', accent: '#7E8F6A' },
    build: () => ({
      title: s('Lotus Flow Yoga', 'Lotus Flow Yoga'),
      bio: s('Breathe in, slow down. Small classes for every body.', 'Hít sâu, sống chậm. Lớp nhỏ cho mọi cơ thể.'),
      avatarUrl: photo('yoga-avatar'),
      themeConfig: {
        ...look({
          bg: '#F4EEE5', text: '#3D3A33', accent: '#7E8F6A', onAccent: '#FFFFFF', surface: '#FFFFFF', radius: 28, shadow: 'sm',
          nameFont: 'Birthstone, cursive', nameWeight: '400', nameSize: '3rem', headingFont: 'Cormorant Garamond, serif', bodyFont: 'Quicksand, sans-serif',
          header: 'banner-circle', banner: photo('yoga-cover'), link: 'centered', social: 'soft', gap: 'relaxed',
        }),
        background: { type: 'gradient', color: '#F4EEE5', gradient: { style: 'mesh', from: '#F6EFE6', via: '#E7EFE6', to: '#F4E4D8' } },
        music: { trackId: 'love-acoustic' },
      },
      blocks: withIndex([
        { name: 'menu', data: { title: s('Class passes', 'Gói tập'), currency: '₫', layout: 'cards', sections: menu([
          { name: '', items: [
            [s('Drop-in class', 'Buổi lẻ'), '180,000', s('Any class, any day', 'Lớp bất kỳ, ngày bất kỳ')],
            [s('10-class pass', 'Thẻ 10 buổi'), '1,500,000', s('Valid for 3 months', 'Dùng trong 3 tháng'), s('Best value', 'Đáng giá nhất')],
            [s('Unlimited month', 'Không giới hạn 1 tháng'), '2,200,000', s('Mat and towel included', 'Có sẵn thảm và khăn')],
          ] },
        ]) } },
        { name: 'timeline', data: { title: s('This week', 'Lịch tuần này'), items: [
          step(s('Mon · Wed · Fri 6:00', 'T2 · T4 · T6 6:00'), s('Sunrise flow', 'Flow đón bình minh'), s('Gentle vinyasa to wake up.', 'Vinyasa nhẹ để bắt đầu ngày.')),
          step(s('Tue · Thu 18:30', 'T3 · T5 18:30'), s('Hatha & breath', 'Hatha & hơi thở')),
          step(s('Sat 9:00', 'T7 9:00'), s('Yin & sound bath', 'Yin & tắm âm thanh'), s('90 minutes of deep rest.', '90 phút thả lỏng sâu.')),
        ] } },
        { name: 'image-album', data: { title: s('Inside the studio', 'Bên trong studio'), images: album('yoga-1', 'yoga-2', 'yoga-3', 'blog-wellness-2'), layout: 'carousel' } },
        { name: 'testimonials', data: { items: reviews(
          [s('My back pain is gone and my mornings feel lighter.', 'Hết đau lưng, buổi sáng thấy nhẹ nhõm hẳn.'), 'Thu Hà', s('Member for a year', 'Học viên một năm')],
          [s('I’d never done yoga. Nobody made me feel slow.', 'Mình chưa tập yoga bao giờ. Không ai làm mình thấy mình chậm.'), 'Minh Khang', s('Beginner', 'Người mới')],
        ) } },
        faq(s('First class?', 'Buổi đầu tiên?'), s('🧘 Beginners welcome in every class except Advanced Flow\n🧺 Mats, blocks and towels are here; just bring water\n🍽️ Eat lightly two hours before\n🔁 Cancel up to 4 hours before and keep your class', '🧘 Người mới học được mọi lớp, trừ Advanced Flow\n🧺 Có sẵn thảm, gạch và khăn, chỉ cần mang nước\n🍽️ Ăn nhẹ trước hai tiếng\n🔁 Huỷ trước 4 tiếng không mất buổi')),
        { name: 'form', data: { title: s('Your first class is free', 'Buổi đầu tiên miễn phí'), kind: 'booking', fields: booking(true, true, false), submitLabel: s('Save my mat', 'Giữ chỗ cho tôi') } },
        { name: 'hours', data: { title: s('Studio hours', 'Giờ mở cửa'), days: hours('06:00', '20:30') } },
        { name: 'contact', data: { title: s('Find the studio', 'Đường đến studio'), address: SAMPLE_ADDRESS, phone: SAMPLE_PHONE, quickBar: true } },
        { name: 'social', data: { links: social('instagram', 'facebook', 'zalo', 'googlemaps') } },
      ] as Blocks),
      room: loungeRoom('#efe8dc', '#c8ad8a', '#7e8f6a', s('Book a class', 'Đặt lớp'), [
        { type: 'plant', position: [1.4, 0, -2.4], rotation: 0, color: '#7e8f6a' },
      ]),
    }),
  },
  {
    id: 'clinic',
    name: 'Family clinic',
    category: 'health',
    description: 'A clean, reassuring page for a clinic or family doctor: services with prices, opening hours, appointments and one-tap call.',
    icon: 'i-lucide-stethoscope',
    preview: { bg: '#F2F9F8', accent: '#0E9F8E' },
    build: () => ({
      title: s('An Tâm Family Clinic', 'Phòng khám Gia đình An Tâm'),
      bio: s('Dr. Trần Minh Đức and team. Care for the whole family, without the long wait.', 'BS. Trần Minh Đức và cộng sự. Chăm sóc cả gia đình, không phải chờ lâu.'),
      avatarUrl: photo('clinic-avatar'),
      themeConfig: {
        ...look({
          bg: '#F2F9F8', text: '#0F3B3A', accent: '#0E9F8E', onAccent: '#FFFFFF', surface: '#FFFFFF', border: '#D3EAE7', radius: 16, shadow: 'sm',
          nameFont: 'Be Vietnam Pro, sans-serif', nameWeight: '700', nameSize: '1.9rem', tracking: '-0.02em', bodyFont: 'Be Vietnam Pro, sans-serif',
          header: 'banner-square', banner: photo('clinic-cover'), avatar: 'rounded', link: 'horizontal-left', social: 'soft', titleAlign: 'left',
        }),
        background: { type: 'solid', color: '#F2F9F8', pattern: { id: 'dots', color: '#0E9F8E' } },
      },
      blocks: withIndex([
        { name: 'menu', data: { title: s('Services & prices', 'Dịch vụ & bảng giá'), currency: '₫', layout: 'list', sections: menu([
          { name: s('Check-ups', 'Khám bệnh'), items: [
            [s('General consultation', 'Khám tổng quát'), '300,000'],
            [s('Children’s check-up', 'Khám nhi'), '250,000', s('Up to 15 years old', 'Trẻ dưới 15 tuổi')],
            [s('Home visit', 'Khám tại nhà'), '600,000', s('Within District 1 and 3', 'Trong Quận 1 và Quận 3')],
          ] },
          { name: s('Tests', 'Xét nghiệm'), items: [
            [s('Basic blood test', 'Xét nghiệm máu cơ bản'), '350,000', s('Results in 2 hours', 'Có kết quả sau 2 giờ'), s('Most booked', 'Được đặt nhiều')],
            [s('Yearly health package', 'Gói khám sức khoẻ năm'), '1,800,000'],
          ] },
        ]) } },
        { name: 'form', data: { title: s('Book an appointment', 'Đặt lịch khám'), description: s('Pick a time; we confirm by phone within 15 minutes.', 'Chọn giờ khám, chúng tôi gọi xác nhận trong 15 phút.'), kind: 'booking', fields: booking(true, true, false), submitLabel: s('Book my visit', 'Đặt lịch') } },
        { name: 'hours', data: { title: s('Opening hours', 'Giờ mở cửa'), days: hours('07:00', '20:00', [0]), note: s('Sunday mornings for emergencies only.', 'Sáng Chủ nhật chỉ nhận ca cấp cứu.') } },
        { name: 'testimonials', data: { items: reviews(
          [s('Kind doctors, no rushing, and they explain everything to my kids.', 'Bác sĩ tận tình, không vội vàng, giải thích kỹ cho cả con tôi.'), 'Ngọc Anh', s('Google review', 'Đánh giá Google')],
          [s('In and out in 30 minutes with test results.', 'Khám và có kết quả xét nghiệm chỉ trong 30 phút.'), 'Peter W.', s('Google review', 'Đánh giá Google')],
        ) } },
        { name: 'image-album', data: { title: s('Our clinic', 'Phòng khám'), images: album('clinic-1', 'clinic-2', 'clinic-3'), layout: 'grid' } },
        faq(s('Before your visit', 'Trước khi đến khám'), s('🪪 Bring your ID and any recent test results\n💳 Private insurance accepted: Bảo Việt, PVI, Liberty\n🧒 A play corner and a paediatrician every afternoon\n🩺 Results by Zalo, with the doctor’s notes', '🪪 Mang CCCD và kết quả xét nghiệm gần nhất (nếu có)\n💳 Nhận bảo hiểm tư nhân: Bảo Việt, PVI, Liberty\n🧒 Có góc chơi cho bé, bác sĩ nhi khám mỗi chiều\n🩺 Gửi kết quả qua Zalo kèm lời dặn của bác sĩ')),
        { name: 'contact', data: { title: s('Visit the clinic', 'Đến phòng khám'), address: SAMPLE_ADDRESS, phone: SAMPLE_PHONE, quickBar: true } },
        { name: 'social', data: { links: social('zalo', 'facebook', 'googlemaps') } },
      ] as Blocks),
      room: studioRoom('#eef8f6', '#c9d6d2', '#0e9f8e', s('Book an appointment', 'Đặt lịch khám'), [
        { type: 'cabinet', position: [-1.9, 0, -2.6], rotation: 0, color: '#ffffff' },
      ]),
    }),
  },
  {
    id: 'nutritionist',
    name: 'Nutritionist & meal plans',
    category: 'health',
    description: 'A fresh, colourful page for a nutritionist: meal plans to order, how it works, client results and a consultation.',
    icon: 'i-lucide-salad',
    preview: { bg: '#FFF8EC', accent: '#FF7A3D' },
    build: () => ({
      title: s('Eat Well with Mai', 'Ăn lành cùng Mai'),
      bio: s('Nutritionist · Meal plans that taste good and fit your week.', 'Chuyên gia dinh dưỡng · Thực đơn ngon miệng, vừa với tuần của bạn.'),
      avatarUrl: photo('nutri-avatar'),
      themeConfig: {
        ...look({
          bg: '#FFF8EC', text: '#23301F', accent: '#FF7A3D', onAccent: '#FFFFFF', surface: '#FFFFFF', radius: 22, shadow: 'md',
          nameFont: 'Poppins, sans-serif', nameWeight: '700', nameSize: '2rem', tracking: '-0.02em', headingFont: 'Poppins, sans-serif', bodyFont: 'Nunito, sans-serif',
          header: 'banner-circle', banner: photo('nutri-cover'), link: 'centered', social: 'filled',
        }),
        background: { type: 'gradient', color: '#FFF8EC', gradient: { angle: 165, from: '#FFF8EC', to: '#E8F5DF' } },
      },
      blocks: withIndex([
        { name: 'products', data: { title: s('Meal plans', 'Gói thực đơn'), layout: 'grid', ordering: true, askAddress: true, payment: 'both', items: products(
          [s('7-day lean plan', 'Gói giữ dáng 7 ngày'), 1450000, 'nutri-2', s('14 meals, delivered fresh every morning', '14 bữa, giao tươi mỗi sáng'), s('Best seller', 'Bán chạy'), 1650000],
          [s('Muscle gain week', 'Tuần tăng cơ'), 1690000, 'nutri-3', s('High protein, 2 meals a day', 'Giàu đạm, 2 bữa mỗi ngày')],
          [s('Green salad box', 'Hộp salad xanh'), 89000, 'nutri-1', s('Single meal, order by 9 pm', 'Bữa lẻ, đặt trước 21 giờ')],
          [s('1:1 consultation', 'Tư vấn 1:1'), 500000, 'blog-food-cover', s('60 minutes and a personal plan', '60 phút và thực đơn riêng')],
        ) } },
        { name: 'timeline', data: { title: s('How it works', 'Bắt đầu thế nào'), items: [
          step('1', s('Tell me your goal', 'Cho mình biết mục tiêu'), s('Lose weight, gain energy or eat cleaner.', 'Giảm cân, khoẻ hơn hay ăn sạch hơn.')),
          step('2', s('Get your plan', 'Nhận thực đơn'), s('Built around food you actually like.', 'Dựa trên những món bạn thật sự thích.')),
          step('3', s('Meals at your door', 'Bữa ăn giao tận cửa'), s('Fresh every morning in Saigon.', 'Giao tươi mỗi sáng ở Sài Gòn.')),
        ] } },
        { name: 'testimonials', data: { title: s('Real results', 'Kết quả thật'), items: reviews(
          [s('Down 6 kg in two months and I never felt hungry.', 'Giảm 6 kg trong hai tháng mà chưa từng thấy đói.'), 'Hoàng Yến', s('Lean plan', 'Gói giữ dáng')],
          [s('Finally lunches I look forward to at the office.', 'Cuối cùng cũng có bữa trưa văn phòng đáng mong chờ.'), 'Bảo Long', s('Muscle gain week', 'Tuần tăng cơ')],
        ) } },
        faq(s('Delivery & meals', 'Giao hàng & bữa ăn'), s('🛵 Free delivery before 8 am in Districts 1, 3, 7, Bình Thạnh and Phú Nhuận\n🥜 Tell us your allergies; every box is labelled\n❄️ Keeps 2 days in the fridge, microwave-safe boxes\n⏸️ Pause your plan any day with a message by 6 pm', '🛵 Giao miễn phí trước 8 giờ sáng ở Quận 1, 3, 7, Bình Thạnh, Phú Nhuận\n🥜 Báo trước nếu dị ứng; hộp nào cũng ghi rõ thành phần\n❄️ Bảo quản tủ lạnh 2 ngày, hộp dùng được lò vi sóng\n⏸️ Tạm dừng gói bất cứ ngày nào, nhắn trước 18 giờ')),
        { name: 'form', data: { title: s('Book a free 15-minute call', 'Đặt cuộc gọi miễn phí 15 phút'), kind: 'booking', fields: booking(true, true, false), submitLabel: s('Book my call', 'Đặt lịch gọi') } },
        { name: 'social', data: { links: social('instagram', 'tiktok', 'zalo', 'facebook') } },
        { name: 'vietqr', data: {} },
      ] as Blocks),
      room: shopRoom('#fff3df', '#d9b88f', '#ff7a3d', s('Order a plan', 'Đặt thực đơn'), [
        { type: 'plant', position: [1.2, 0, -1.6], rotation: 0, color: '#6ab04c' },
      ]),
    }),
  },

  // ─── Shops ────────────────────────────────────────────────────
  {
    id: 'fashion-boutique',
    name: 'Fashion boutique',
    category: 'shop',
    description: 'A black-and-white, editorial page for a local clothing brand: new drops with sale prices, a lookbook and links to your stores.',
    icon: 'i-lucide-shirt',
    preview: { bg: '#F7F3EF', accent: '#141414' },
    build: () => ({
      title: s('MÂY STUDIO', 'MÂY STUDIO'),
      bio: s('Made in Saigon. New drop every Friday at 8 pm.', 'Sản xuất tại Sài Gòn. Hàng mới 20 giờ thứ Sáu hằng tuần.'),
      avatarUrl: photo('boutique-avatar'),
      themeConfig: look({
        bg: '#F7F3EF', text: '#141414', accent: '#141414', onAccent: '#F7F3EF', surface: '#FFFFFF', border: '#141414', radius: 0, shadow: 'none',
        nameFont: 'Josefin Sans, sans-serif', nameWeight: '700', nameSize: '2.2rem', tracking: '0.2em', headingFont: 'Josefin Sans, sans-serif', bodyFont: 'Inter Tight, sans-serif',
        header: 'cover', link: 'vertical', social: 'plain',
      }),
      blocks: withIndex([
        { name: 'products', data: { title: s('New drop', 'Hàng mới về'), layout: 'grid', ordering: true, askAddress: true, payment: 'both', items: withDetails(products(
          [s('Linen wrap dress', 'Đầm lanh quấn'), 590000, 'boutique-2', s('Washed linen, relaxed fit', 'Lanh giặt mềm, dáng suông'), s('New', 'Mới')],
          [s('Plaid mini skirt', 'Chân váy kẻ caro'), 390000, 'boutique-3', '', s('Sale', 'Giảm giá'), 490000],
          [s('Everyday shirt', 'Sơ mi hằng ngày'), 450000, 'boutique-1', s('Cotton poplin', 'Cotton poplin')],
          [s('The weekend set', 'Set cuối tuần'), 790000, 'boutique-cover', s('Top and wide trousers', 'Áo và quần ống rộng'), s('Best seller', 'Bán chạy')],
        ),
          { options: [opt(s('Size', 'Size'), 'S', 'M', 'L'), opt(s('Colour', 'Màu'), [s('Sand', 'Màu cát'), '#d8c3a5'], [s('Black', 'Đen'), '#1c1c1c'])] },
          { options: [opt(s('Size', 'Size'), 'S', 'M', 'L')], stock: 3 },
          { options: [opt(s('Size', 'Size'), 'S', 'M', 'L', 'XL'), opt(s('Colour', 'Màu'), [s('White', 'Trắng'), '#f5f3ee'], [s('Sky', 'Xanh trời'), '#a9c7e3'])] },
          { options: [opt(s('Size', 'Size'), 'S', 'M', 'L'), opt(s('Colour', 'Màu'), [s('Cream', 'Kem'), '#efe6d6'], [s('Olive', 'Xanh ô liu'), '#7c7a52'])] },
        ) } },
        { name: 'image-album', data: { title: s('Lookbook · Autumn', 'Lookbook · Thu'), images: album('blog-fashion-1', 'blog-fashion-2', 'blog-fashion-3'), layout: 'masonry' } },
        faq(s('Size & exchange', 'Size & đổi trả'), s('📏 S: 45–50 kg · M: 50–56 kg · L: 56–62 kg · XL: 62–68 kg\n💬 Unsure? Message your height and weight and we’ll pick for you\n🔁 Free exchange within 7 days, tags on\n🚚 Free shipping from 500,000₫, COD nationwide', '📏 S: 45–50 kg · M: 50–56 kg · L: 56–62 kg · XL: 62–68 kg\n💬 Phân vân? Nhắn chiều cao, cân nặng để được chọn size giúp\n🔁 Đổi miễn phí trong 7 ngày, còn nguyên tag\n🚚 Miễn phí giao hàng từ 500.000₫, COD toàn quốc')),
        { name: 'testimonials', data: { title: s('Worn by you', 'Khách mặc thật'), items: reviews(
          [s('The linen dress is even softer than it looks. Ordered a second colour.', 'Đầm lanh mềm hơn cả trong ảnh. Đã đặt thêm màu thứ hai.'), 'Thanh Vy', s('Linen wrap dress · M', 'Đầm lanh quấn · M')],
          [s('They picked my size from a message and it fits perfectly.', 'Shop chọn size giúp qua tin nhắn mà mặc vừa in.'), 'Ngọc Mai', s('Everyday shirt · S', 'Sơ mi hằng ngày · S')],
        ) } },
        { name: 'vietqr', data: {} },
        { name: 'hours', data: { title: s('Showroom', 'Showroom'), days: hours('10:00', '21:30') } },
        { name: 'contact', data: { title: s('Visit the showroom', 'Ghé showroom'), address: SAMPLE_ADDRESS, phone: SAMPLE_PHONE } },
        { name: 'social', data: { links: social('instagram', 'tiktok', 'facebook', 'zalo', 'shopee', 'tiktokshop') } },
      ] as Blocks),
      room: shopRoom('#f2eee9', '#9c948a', '#141414', s('Shop the drop', 'Xem hàng mới'), [
        { type: 'picture-frame', position: [-3, 1.6, -1.6], rotation: 0, wall: 'left', color: '#141414', image: photo('boutique-3') },
      ]),
    }),
  },
  {
    id: 'handmade-shop',
    name: 'Handmade & ceramics shop',
    category: 'shop',
    description: 'An earthy, warm page for a handmade shop: pieces to order, a pottery workshop with seats to book and the studio story.',
    icon: 'i-lucide-hand',
    preview: { bg: '#EFE4D6', accent: '#B65E3C' },
    build: () => ({
      title: s('Đất Lành Ceramics', 'Gốm Đất Lành'),
      bio: s('Handmade cups, plates and vases from a small studio in Bát Tràng.', 'Cốc, đĩa và bình gốm làm tay từ một xưởng nhỏ ở Bát Tràng.'),
      avatarUrl: photo('craft-avatar'),
      themeConfig: {
        ...look({
          bg: '#EFE4D6', text: '#3B2A1E', accent: '#B65E3C', onAccent: '#FFF8F0', surface: '#F8F1E7', border: '#DCC7AE', radius: 30, shadow: 'none',
          nameFont: 'Dancing Script, cursive', nameWeight: '700', nameSize: '2.6rem', headingFont: 'Lora, serif', bodyFont: 'Lora, serif',
          header: 'banner-circle', banner: photo('craft-cover'), link: 'centered', social: 'soft', gap: 'relaxed',
        }),
        background: { type: 'solid', color: '#EFE4D6', pattern: { id: 'waves', color: '#B65E3C' } },
        music: { trackId: 'love-acoustic' },
      },
      blocks: withIndex([
        { name: 'products', data: { title: s('From the kiln', 'Mới ra lò'), layout: 'grid', ordering: true, askAddress: true, payment: 'both', items: products(
          [s('Speckled mug', 'Cốc men lấm tấm'), 220000, 'craft-avatar', s('350 ml, each one a little different', '350 ml, mỗi chiếc một khác'), s('Best seller', 'Bán chạy')],
          [s('Dinner plate set', 'Bộ đĩa ăn'), 680000, 'craft-1', s('Four plates, 24 cm', 'Bốn đĩa, 24 cm')],
          [s('Rice bowls', 'Bát cơm'), 360000, 'craft-2', s('Set of two', 'Bộ hai chiếc')],
          [s('Glazed vase', 'Bình men màu'), 450000, 'craft-3', s('Each glaze is one of a kind', 'Mỗi lớp men là duy nhất'), s('Last pieces', 'Sắp hết')],
        ).map((item, i) => (i === 3 ? { ...item, stock: 2, options: [opt(s('Glaze', 'Màu men'), [s('Celadon', 'Men ngọc'), '#9fbfae'], [s('Rust', 'Men gỉ'), '#a5552f'])] } : item)) } },
        { name: 'event', data: { name: s('Pottery workshop', 'Workshop làm gốm'), date: '2026-11-29', startTime: '14:00', endTime: '17:00', venue: s('Đất Lành studio', 'Xưởng Đất Lành'), address: SAMPLE_ADDRESS, note: s('550,000 ₫ per person, clay and firing included. Take home what you make.', '550.000 ₫ một người, gồm đất và nung. Mang về sản phẩm bạn làm.') } },
        { name: 'form', data: { title: s('Book a workshop seat', 'Giữ chỗ workshop'), kind: 'booking', fields: booking(true, false, true, false), submitLabel: s('Book my seat', 'Giữ chỗ') } },
        { name: 'text', data: { title: s('Our story', 'Câu chuyện của xưởng'), content: s('Two sisters, one kiln and clay from the Red River. Everything is thrown by hand and glazed in small batches.', 'Hai chị em, một lò nung và đất từ sông Hồng. Mọi sản phẩm đều vuốt tay và tráng men theo mẻ nhỏ.'), align: 'center', style: 'plain' } },
        { name: 'testimonials', data: { title: s('In your kitchens', 'Gốm trong bếp nhà bạn'), items: reviews(
          [s('My morning coffee tastes better in this mug. I’m sure of it.', 'Cà phê sáng uống bằng cốc này ngon hơn hẳn. Chắc chắn luôn.'), 'Hải Yến', s('Speckled mug', 'Cốc men lấm tấm')],
          [s('The workshop was the calmest three hours of my month.', 'Buổi workshop là ba tiếng thư thái nhất trong tháng của mình.'), 'Duy Anh', s('Pottery workshop', 'Workshop làm gốm')],
        ) } },
        faq(s('Shipping & care', 'Giao hàng & bảo quản'), s('📦 Packed in rice husk and double boxes; breakage replaced free\n🎁 Custom names or logos from 20 pieces\n🍽️ Dishwasher and microwave safe\n🚚 2–4 days nationwide', '📦 Gói bằng trấu và hai lớp hộp; vỡ được đổi mới miễn phí\n🎁 Khắc tên, logo theo yêu cầu từ 20 sản phẩm\n🍽️ Dùng được máy rửa bát và lò vi sóng\n🚚 Giao toàn quốc 2–4 ngày')),
        { name: 'hours', data: { title: s('Studio open days', 'Giờ mở xưởng'), days: hours('09:00', '17:30', [1]) } },
        { name: 'vietqr', data: {} },
        { name: 'social', data: { links: social('instagram', 'facebook', 'tiktok', 'shopee', 'googlemaps') } },
      ] as Blocks),
      room: shopRoom('#efe2d1', '#a87b56', '#b65e3c', s('Shop ceramics', 'Mua gốm'), [
        { type: 'plant', position: [1.2, 0, -1.6], rotation: 0, color: '#8a9a5b' },
      ]),
    }),
  },
  {
    id: 'skincare-shop',
    name: 'Skincare brand',
    category: 'shop',
    description: 'A soft, glowing pastel page for a skincare brand: products with bundle prices, a morning routine, reviews and a free skin consult.',
    icon: 'i-lucide-sparkles',
    preview: { bg: '#F6F0FF', accent: '#7C5CFF' },
    build: () => ({
      title: s('Glow Lab', 'Glow Lab'),
      bio: s('Gentle skincare for humid days. Dermatologist-tested, made in Vietnam.', 'Chăm sóc da dịu nhẹ cho ngày nồm ẩm. Đã kiểm nghiệm da liễu, sản xuất tại Việt Nam.'),
      avatarUrl: photo('skin-avatar'),
      themeConfig: {
        ...look({
          bg: '#F6F0FF', text: '#2E1F47', accent: '#7C5CFF', onAccent: '#FFFFFF', surface: '#FFFFFF', radius: 24, shadow: 'glow',
          nameFont: 'Comfortaa, sans-serif', nameWeight: '700', nameSize: '2.2rem', headingFont: 'Comfortaa, sans-serif', bodyFont: 'Nunito, sans-serif',
          header: 'banner-circle', banner: photo('skin-1'), link: 'centered', social: 'soft',
        }),
        background: { type: 'effect', effectId: 'aurora', color: '#F6F0FF' },
      },
      blocks: withIndex([
        { name: 'products', data: { title: s('Bestsellers', 'Sản phẩm bán chạy'), layout: 'grid', ordering: true, askAddress: true, payment: 'both', items: products(
          [s('Calm serum', 'Serum dịu da'), 390000, 'skin-cover', s('Niacinamide 5% · 30 ml', 'Niacinamide 5% · 30 ml'), s('Best seller', 'Bán chạy')],
          [s('Cloud cleanser', 'Sữa rửa mặt Cloud'), 260000, 'skin-avatar', s('Low pH, for every skin type', 'pH thấp, cho mọi loại da')],
          [s('Daily sunscreen SPF 50', 'Kem chống nắng SPF 50'), 320000, 'skin-2', s('No white cast', 'Không vệt trắng')],
          [s('Glow routine set', 'Bộ chu trình Glow'), 890000, 'skin-3', s('Cleanser, serum, sunscreen', 'Sữa rửa mặt, serum, chống nắng'), s('Save 10%', 'Tiết kiệm 10%'), 970000],
        ).map((item, i) => (i === 0 ? { ...item, options: [opt(s('Volume', 'Dung tích'), '30 ml', '50 ml')] } : i === 3 ? { ...item, stock: 4 } : item)) } },
        { name: 'timeline', data: { title: s('Your morning routine', 'Chu trình buổi sáng'), items: [
          step(s('Step 1', 'Bước 1'), s('Cleanse', 'Làm sạch'), s('A pea-sized drop of Cloud cleanser.', 'Một lượng nhỏ sữa rửa mặt Cloud.')),
          step(s('Step 2', 'Bước 2'), s('Treat', 'Đặc trị'), s('Three drops of Calm serum, pat in.', 'Ba giọt serum dịu da, vỗ nhẹ.'), ),
          step(s('Step 3', 'Bước 3'), s('Protect', 'Bảo vệ'), s('Sunscreen, even when it rains.', 'Chống nắng, kể cả ngày mưa.')),
        ] } },
        { name: 'testimonials', data: { title: s('Glowing reviews', 'Khách khen'), items: reviews(
          [s('My redness calmed down in two weeks.', 'Da bớt ửng đỏ chỉ sau hai tuần.'), 'Phương Linh', s('Calm serum', 'Serum dịu da')],
          [s('The first sunscreen that doesn’t sting my eyes.', 'Kem chống nắng đầu tiên không làm cay mắt.'), 'Tú Anh', s('Daily sunscreen', 'Kem chống nắng')],
        ) } },
        faq(s('Is it right for me?', 'Có hợp với da mình không?'), s('🌿 Fragrance-free and alcohol-free, tested on sensitive skin\n🤰 Safe during pregnancy (no retinol, no salicylic acid)\n🧪 Patch test on your jaw for 24 hours first\n↩️ Opened and didn’t suit you? Return within 14 days', '🌿 Không hương liệu, không cồn, đã thử trên da nhạy cảm\n🤰 Dùng được khi mang thai (không retinol, không BHA)\n🧪 Thử trước ở vùng quai hàm 24 giờ\n↩️ Đã mở mà không hợp? Đổi trả trong 14 ngày')),
        { name: 'form', data: { title: s('Free skin consult', 'Tư vấn da miễn phí'), description: s('Tell us your skin type and concerns; we reply with a routine.', 'Cho chúng tôi biết loại da và vấn đề, chúng tôi gửi bạn chu trình phù hợp.'), kind: 'contact', fields: { phone: true, email: false, date: false, time: false, guests: false, message: true }, submitLabel: s('Get my routine', 'Nhận chu trình') } },
        { name: 'vietqr', data: {} },
        { name: 'social', data: { links: social('instagram', 'tiktok', 'facebook', 'shopee', 'tiktokshop', 'lazada') } },
      ] as Blocks),
      room: shopRoom('#f3ecff', '#d9cbe8', '#7c5cff', s('Shop Glow Lab', 'Mua Glow Lab'), [
        { type: 'plant', position: [1.2, 0, -1.6], rotation: 0, color: '#c4b5fd' },
      ]),
    }),
  },
]
