import { nanoid } from 'nanoid'
import type { MenuSection } from '~/types/bio'
import type { PageTemplate } from '../pageTemplates'
import { SAMPLE_PHONE, album, links, look, menu, noteCopy, photo, social, withIndex } from '../templateKit'
import { type Blocks, booking, hours, loungeRoom, nightRoom, reviews, shopRoom, studioRoom } from '../pageTemplatesMore'

// Personal pages, creatives and beauty. Sample text in English with its
// Vietnamese next to it: `s(en, vi)` returns the English and registers the
// translation.

export const PERSONAL_CREATIVE_VI: Record<string, string> = {}
function s(en: string, vi: string) {
  PERSONAL_CREATIVE_VI[en] = vi
  noteCopy(en, vi)
  return en
}

/** A price list whose items can carry a photo: [name, price, description?, tag?, photo?] */
function priced(sections: { name: string; items: [string, string, string?, string?, string?][] }[]): MenuSection[] {
  return sections.map(section => ({
    id: nanoid(6),
    name: section.name,
    items: section.items.map(([name, price, description, tag, image]) => ({ id: nanoid(6), name, price, description, tag, imageUrl: image ? photo(image) : undefined })),
  }))
}

/** The questions every owner answers again and again, as one card */
const faq = (title: string, content: string) => ({ name: 'text' as const, data: { title, content, align: 'left' as const, style: 'card' as const } })

export const PERSONAL_CREATIVE_TEMPLATES: PageTemplate[] = [
  // ─── Personal ───────────────────────────────────────────────────────────
  {
    id: 'personal-neon',
    name: 'Neon developer',
    category: 'personal',
    description: 'A dark, glowing page for developers and tech creators: projects on a timeline, code links and an aurora sky.',
    icon: 'i-lucide-terminal',
    preview: { bg: '#07070D', accent: '#00F0FF' },
    build: () => ({
      title: s('Minh Tran', 'Trần Minh'),
      bio: s('Creative developer. I build fast web apps, playful 3D and tools people actually enjoy.', 'Creative developer. Mình làm web app nhanh, 3D vui mắt và những công cụ mà người dùng thật sự thích.'),
      avatarUrl: photo('neon-avatar'),
      themeConfig: {
        ...look({
          bg: '#07070D', text: '#E8F1FF', accent: '#00F0FF', onAccent: '#07070D', surface: '#10111C', border: '#1E2A44', radius: 14, shadow: 'glow',
          nameFont: 'Space Grotesk, sans-serif', nameWeight: '700', nameSize: '2.3rem', tracking: '-0.02em', bodyFont: 'Space Grotesk, sans-serif',
          header: 'banner-circle', banner: photo('neon-cover'), link: 'horizontal-left', social: 'outline', titleAlign: 'left',
        }),
        background: { type: 'effect', effectId: 'aurora', color: '#07070D' },
        music: { trackId: 'game-background' },
        roomButton: true,
      },
      blocks: withIndex([
        { name: 'text', data: { title: s('Now', 'Hiện tại'), content: s('Building a realtime design tool at a small studio in Saigon. Open to freelance work from January.', 'Đang làm công cụ thiết kế realtime ở một studio nhỏ tại Sài Gòn. Nhận dự án freelance từ tháng 1.'), align: 'left', style: 'card' } },
        { name: 'links', data: { title: s('Ship log', 'Sản phẩm đã ra mắt'), items: links(
          [s('Pixel Garden: a 3D habit tracker', 'Pixel Garden: app theo dõi thói quen 3D'), 'https://github.com'],
          [s('Open-source UI kit (2.4k stars)', 'Bộ UI mã nguồn mở (2.4k sao)'), 'https://github.com'],
          [s('Talk: WebGL on cheap phones', 'Bài nói: WebGL trên điện thoại rẻ'), 'https://youtube.com'],
        ) } },
        { name: 'timeline', data: { title: s('The path so far', 'Chặng đường'), items: [
          { id: nanoid(6), date: '2026', title: s('Lead developer, Lumen Studio', 'Lead developer, Lumen Studio'), text: s('Realtime collaboration, WebGL, a team of six.', 'Cộng tác realtime, WebGL, đội sáu người.'), imageUrl: photo('neon-2') },
          { id: nanoid(6), date: '2024', title: s('Indie hacker year', 'Một năm làm sản phẩm riêng'), text: s('Launched three tiny apps; one paid my rent.', 'Ra mắt ba app nhỏ; một cái đủ trả tiền nhà.') },
          { id: nanoid(6), date: '2021', title: s('First job, first bug in production', 'Công việc đầu tiên, bug production đầu tiên'), text: s('Learned more that night than in four years of school.', 'Học được trong đêm đó nhiều hơn bốn năm đại học.') },
        ] } },
        { name: 'image-album', data: { title: s('Desk & late nights', 'Góc làm việc & những đêm muộn'), images: album('neon-1', 'neon-3', 'blog-tech-1', 'blog-tech-2'), layout: 'masonry' } },
        { name: 'menu', data: { title: s('Work with me', 'Làm việc cùng mình'), currency: '₫', layout: 'list', sections: menu([
          { name: '', items: [
            [s('Landing page that loads in 1 second', 'Landing page tải dưới 1 giây'), s('from 15,000,000', 'từ 15.000.000'), s('Design to launch in 2 weeks', 'Từ thiết kế đến lên sóng trong 2 tuần')],
            [s('3D product viewer', 'Trình xem sản phẩm 3D'), s('from 25,000,000', 'từ 25.000.000'), s('Three.js, works on cheap phones', 'Three.js, chạy mượt cả trên máy yếu'), s('Often chosen', 'Hay được chọn')],
            [s('Code review & mentoring', 'Review code & kèm cặp'), s('800,000 / hour', '800.000 / giờ'), s('For juniors and small teams', 'Cho bạn mới vào nghề và nhóm nhỏ')],
          ] },
        ]) } },
        { name: 'testimonials', data: { title: s('From clients', 'Khách hàng nói'), items: reviews(
          [s('Shipped our 3D configurator two weeks early, and it flies on old Androids.', 'Bàn giao trình cấu hình 3D sớm hai tuần, chạy mượt cả trên Android cũ.'), 'Quỳnh Anh', s('PM, Nội thất Gỗ Việt', 'PM, Nội thất Gỗ Việt')],
          [s('Clear estimates, daily updates, zero drama.', 'Báo giá rõ ràng, cập nhật mỗi ngày, không rắc rối.'), 'Daniel P.', s('Founder, Kite Labs', 'Nhà sáng lập, Kite Labs')],
        ) } },
        { name: 'form', data: { title: s('Got a project?', 'Có dự án cần làm?'), description: s('Pick what you need and tell me what you’re building. I reply within two days.', 'Chọn dịch vụ và kể mình nghe bạn đang làm gì. Mình trả lời trong hai ngày.'), kind: 'contact', fields: { phone: false, email: true, date: false, time: false, guests: false, message: true, service: true }, submitLabel: s('Send it', 'Gửi đi') } },
        { name: 'social', data: { links: social('github', 'linkedin', 'twitter', 'youtube') } },
      ] as Blocks),
      room: nightRoom('#0b0b14', '#00f0ff', s('Hire me', 'Thuê mình')),
    }),
  },
  {
    id: 'personal-editorial',
    name: 'Editorial portfolio',
    category: 'personal',
    description: 'A magazine-style page for models, stylists and creative directors: a full-bleed portrait, campaigns and a bookings form.',
    icon: 'i-lucide-book-open',
    preview: { bg: '#F4EFE9', accent: '#B3122E' },
    build: () => ({
      title: s('Lena Vo', 'Lena Võ'),
      bio: s('Model & creative director · Saigon / Paris', 'Người mẫu & giám đốc sáng tạo · Sài Gòn / Paris'),
      avatarUrl: photo('edit-avatar'),
      themeConfig: {
        ...look({
          bg: '#F4EFE9', text: '#141414', accent: '#B3122E', onAccent: '#FFFFFF', surface: '#FFFFFF', border: '#141414', radius: 0, shadow: 'hard',
          nameFont: 'Playfair Display, serif', nameWeight: '700', nameSize: '3.2rem', tracking: '-0.03em', headingFont: 'Playfair Display, serif', bodyFont: 'Josefin Sans, sans-serif',
          header: 'cover', link: 'horizontal-right', social: 'plain', gap: 'relaxed', titleAlign: 'left',
        }),
        music: { trackId: 'romantic-date' },
      },
      blocks: withIndex([
        { name: 'text', data: { title: s('As seen in', 'Xuất hiện trên'), content: 'VOGUE · ELLE · HARPER’S BAZAAR · L’OFFICIEL', align: 'left', style: 'plain' } },
        { name: 'text', data: { title: s('Measurements', 'Số đo'), content: s('Height 176 · Bust 82 · Waist 60 · Hips 89\nShoes 39 · Hair dark brown · Eyes brown\nLanguages: Vietnamese, English, French', 'Chiều cao 176 · Ngực 82 · Eo 60 · Hông 89\nGiày 39 · Tóc nâu đậm · Mắt nâu\nNgôn ngữ: Tiếng Việt, Tiếng Anh, Tiếng Pháp'), align: 'left', style: 'card' } },
        { name: 'image-album', data: { title: s('Recent editorials', 'Bộ ảnh gần đây'), images: album('edit-cover', 'edit-2', 'edit-1', 'edit-3', 'edit-4'), layout: 'masonry' } },
        { name: 'timeline', data: { title: s('Campaigns', 'Chiến dịch'), items: [
          { id: nanoid(6), date: s('Spring 2026', 'Xuân 2026'), title: s('“Red Season”, lead model', '“Mùa Đỏ”, người mẫu chính'), text: s('A capsule shot in one day in an empty theatre.', 'Bộ sưu tập chụp trong một ngày ở một nhà hát trống.') },
          { id: nanoid(6), date: s('Autumn 2025', 'Thu 2025'), title: s('Creative direction, Silk & Stone', 'Chỉ đạo sáng tạo, Silk & Stone'), text: s('Concept, casting and set design for a jewellery launch.', 'Ý tưởng, casting và dựng cảnh cho buổi ra mắt trang sức.') },
          { id: nanoid(6), date: '2024', title: s('Paris Fashion Week', 'Tuần lễ thời trang Paris'), text: s('Four shows, one very long week.', 'Bốn show, một tuần rất dài.') },
        ] } },
        { name: 'links', data: { title: s('Agency & comp card', 'Agency & comp card'), items: links(
          [s('Download comp card (PDF)', 'Tải comp card (PDF)'), 'https://example.com'],
          [s('Represented by Muse Models', 'Đại diện bởi Muse Models'), 'https://example.com'],
        ) } },
        { name: 'testimonials', data: { title: s('Worked with', 'Đã hợp tác'), items: reviews(
          [s('Lena brings the idea to the set, not just the pose. Our best campaign this year.', 'Lena mang ý tưởng đến trường quay, không chỉ là dáng chụp. Chiến dịch tốt nhất năm của chúng tôi.'), 'Hà Trần', s('Creative lead, Silk & Stone', 'Trưởng nhóm sáng tạo, Silk & Stone')],
        ) } },
        { name: 'form', data: { title: s('Bookings', 'Đặt lịch làm việc'), description: s('Shoots, campaigns and creative direction.', 'Chụp ảnh, chiến dịch và chỉ đạo sáng tạo.'), kind: 'contact', fields: { phone: true, email: true, date: true, time: false, guests: false, message: true }, submitLabel: s('Send a request', 'Gửi yêu cầu') } },
        { name: 'social', data: { links: social('instagram', 'tiktok', 'pinterest') } },
      ] as Blocks),
      room: studioRoom('#f4efe9', '#2b2b2b', '#b3122e', s('Bookings', 'Đặt lịch làm việc')),
    }),
  },
  {
    id: 'personal-resume',
    name: 'Online CV',
    category: 'personal',
    description: 'A clean CV to send with job applications: experience on a timeline, skills, recommendations and a CV download.',
    icon: 'i-lucide-file-user',
    preview: { bg: '#F5F7FB', accent: '#2453FF' },
    build: () => ({
      title: s('Nguyen Thu Ha', 'Nguyễn Thu Hà'),
      bio: s('Marketing executive · 6 years in growth and content · Hanoi, open to remote', 'Chuyên viên marketing · 6 năm growth & content · Hà Nội, nhận làm từ xa'),
      avatarUrl: photo('cv-avatar'),
      themeConfig: {
        ...look({
          bg: '#F5F7FB', text: '#10203A', accent: '#2453FF', onAccent: '#FFFFFF', surface: '#FFFFFF', border: '#E3E8F2', radius: 12, shadow: 'sm',
          nameFont: 'Be Vietnam Pro, sans-serif', nameWeight: '700', nameSize: '1.9rem', tracking: '-0.01em', bodyFont: 'Be Vietnam Pro, sans-serif',
          header: 'left', avatar: 'rounded', link: 'horizontal-left', social: 'soft', titleAlign: 'left',
        }),
        background: { type: 'solid', color: '#F5F7FB', pattern: { id: 'grid', color: '#2453FF' } },
      },
      blocks: withIndex([
        { name: 'links', data: { items: links(
          [s('Download my CV (PDF)', 'Tải CV của tôi (PDF)'), 'https://example.com'],
          [s('Case study: +180% organic traffic', 'Case study: tăng 180% traffic tự nhiên'), 'https://example.com'],
        ) } },
        { name: 'text', data: { title: s('In short', 'Tóm tắt'), content: s('I grow brands with content people actually read. I’ve led SEO, social and paid campaigns for e-commerce and edtech, and I love turning data into clear decisions.', 'Tôi phát triển thương hiệu bằng nội dung người ta thật sự muốn đọc. Đã phụ trách SEO, mạng xã hội và quảng cáo cho thương mại điện tử và edtech, và thích biến dữ liệu thành quyết định rõ ràng.'), align: 'left', style: 'card' } },
        { name: 'timeline', data: { title: s('Experience', 'Kinh nghiệm'), items: [
          { id: nanoid(6), date: s('2024 – now', '2024 – nay'), title: s('Senior marketing executive, Lumen Edu', 'Chuyên viên marketing cấp cao, Lumen Edu'), text: s('Led a team of 4; grew sign-ups 2.3× in a year.', 'Dẫn dắt nhóm 4 người; tăng lượt đăng ký 2,3 lần trong một năm.') },
          { id: nanoid(6), date: '2021 – 2024', title: s('Content marketer, Nova Shop', 'Content marketer, Nova Shop'), text: s('SEO, email and TikTok content for 1,200 products.', 'SEO, email và nội dung TikTok cho 1.200 sản phẩm.') },
          { id: nanoid(6), date: '2016 – 2020', title: s('BA in Marketing, Foreign Trade University', 'Cử nhân Marketing, Đại học Ngoại thương'), text: s('Graduated with distinction.', 'Tốt nghiệp loại giỏi.') },
        ] } },
        { name: 'text', data: { title: s('What I’m looking for', 'Vị trí tôi đang tìm'), content: s('Marketing lead or senior growth role · Hanoi or remote · Available from January 2027', 'Trưởng nhóm marketing hoặc growth cấp cao · Hà Nội hoặc làm từ xa · Có thể bắt đầu từ tháng 1/2027'), align: 'left', style: 'card' } },
        { name: 'image-album', data: { title: s('Campaign snapshots', 'Một vài chiến dịch'), images: album('cv-1', 'cv-2', 'personal-work-3'), layout: 'grid' } },
        { name: 'text', data: { title: s('Skills', 'Kỹ năng'), content: s('SEO & content strategy · Meta & TikTok ads · Google Analytics 4 · Email automation · Figma · English (IELTS 7.5)', 'Chiến lược SEO & nội dung · Quảng cáo Meta & TikTok · Google Analytics 4 · Email tự động · Figma · Tiếng Anh (IELTS 7.5)'), align: 'left', style: 'card' } },
        { name: 'testimonials', data: { title: s('Recommendations', 'Nhận xét từ đồng nghiệp'), items: reviews(
          [s('Ha turns vague goals into plans that work. The best marketer I’ve managed.', 'Hà biến những mục tiêu mơ hồ thành kế hoạch chạy được. Người làm marketing giỏi nhất tôi từng quản lý.'), 'Tuan Pham', s('Head of Growth, Lumen Edu', 'Trưởng phòng Growth, Lumen Edu')],
          [s('Reliable, curious and great with data.', 'Đáng tin, ham học hỏi và rất giỏi số liệu.'), 'Linh Do', s('Former teammate', 'Đồng nghiệp cũ')],
        ) } },
        { name: 'form', data: { title: s('Let’s talk', 'Liên hệ với tôi'), description: s('Recruiters and hiring managers welcome.', 'Rất hoan nghênh nhà tuyển dụng liên hệ.'), kind: 'contact', fields: { phone: true, email: true, date: false, time: false, guests: false, message: true }, submitLabel: s('Send message', 'Gửi tin nhắn') } },
        { name: 'social', data: { links: social('linkedin', 'email', 'phone') } },
      ] as Blocks),
      room: studioRoom('#eef2fb', '#c9b79c', '#2453ff', s('My CV', 'CV của tôi')),
    }),
  },
  {
    id: 'personal-nomad',
    name: 'Digital nomad',
    category: 'personal',
    description: 'For remote workers and travellers: days on the road, the places you’ve worked from, field notes and your gear.',
    icon: 'i-lucide-compass',
    preview: { bg: '#F2EBDD', accent: '#E0662B' },
    build: () => ({
      title: s('Khoa on the road', 'Khoa trên đường'),
      bio: s('Product designer working from wherever the Wi-Fi is good. 23 countries and counting.', 'Product designer làm việc ở bất cứ đâu có Wi-Fi tốt. Đã qua 23 nước và chưa dừng.'),
      avatarUrl: photo('nomad-avatar'),
      themeConfig: {
        ...look({
          bg: '#F2EBDD', text: '#1F2A24', accent: '#E0662B', onAccent: '#FFFFFF', surface: '#FFFDF8', border: '#E2D6C0', radius: 20, shadow: 'md',
          nameFont: 'Josefin Sans, sans-serif', nameWeight: '700', nameSize: '2.2rem', tracking: '0.04em', bodyFont: 'Nunito, sans-serif',
          header: 'image-overlay', link: 'centered', social: 'filled', gap: 'relaxed',
        }),
        background: { type: 'solid', color: '#F2EBDD', pattern: { id: 'waves', color: '#E0662B' } },
        music: { trackId: 'marimba-travel' },
      },
      blocks: withIndex([
        { name: 'birthday-countdown', data: { birthDate: '2023-03-01', theme: 'card', showAge: false, label: s('Living out of a backpack for', 'Sống cùng chiếc ba lô được'), mode: 'since' } },
        { name: 'timeline', data: { title: s('Where I’ve worked from', 'Những nơi mình đã làm việc'), items: [
          { id: nanoid(6), date: s('Now', 'Hiện tại'), title: s('Ha Giang, Vietnam', 'Hà Giang, Việt Nam'), text: s('Mountain passes by day, Figma by night.', 'Ngày chạy đèo, tối mở Figma.'), imageUrl: photo('nomad-3') },
          { id: nanoid(6), date: '2025', title: s('Chiang Mai, Thailand', 'Chiang Mai, Thái Lan'), text: s('The café-to-desk ratio is perfect.', 'Tỉ lệ quán cà phê trên bàn làm việc là hoàn hảo.'), imageUrl: photo('nomad-1') },
          { id: nanoid(6), date: '2024', title: s('Lisbon, Portugal', 'Lisbon, Bồ Đào Nha'), text: s('Hills, tiles and very fast internet.', 'Đồi dốc, gạch men và mạng cực nhanh.') },
          { id: nanoid(6), date: '2023', title: s('Day one: Bali', 'Ngày đầu tiên: Bali'), text: s('Quit the office, kept the laptop.', 'Bỏ văn phòng, giữ lại laptop.') },
        ] } },
        { name: 'image-album', data: { title: s('Recent frames', 'Khung hình gần đây'), images: album('nomad-cover', 'nomad-4', 'blog-travel-2'), layout: 'carousel' } },
        { name: 'blog', data: { title: s('Field notes', 'Ghi chép dọc đường'), count: 5, samples: [
          { title: s('How I find coworking spaces in a new city', 'Cách mình tìm chỗ coworking ở thành phố mới'), coverUrl: photo('nomad-2'), minutes: 5 },
          { title: s('My one-bag packing list', 'Danh sách đồ gói gọn trong một ba lô'), coverUrl: photo('blog-travel-1'), minutes: 4 },
          { title: s('Working across 7 time zones without burning out', 'Làm việc lệch 7 múi giờ mà không kiệt sức'), coverUrl: photo('blog-travel-3'), minutes: 7 },
        ] } },
        { name: 'products', data: { title: s('Tools I made', 'Đồ mình tự làm'), layout: 'grid', ordering: true, askAddress: false, payment: 'transfer', items: [
          { id: nanoid(6), name: s('Nomad Notion planner', 'Notion planner cho dân du mục'), price: 99000, imageUrl: photo('personal-work-1'), description: s('Budgets, visas and coworkings in one place', 'Ngân sách, visa và chỗ coworking trong một trang'), tag: s('Best seller', 'Bán chạy') },
          { id: nanoid(6), name: s('1:1 call: going remote', 'Gọi 1:1: bắt đầu làm từ xa'), price: 450000, imageUrl: photo('personal-work-3'), description: s('45 minutes, your questions, my honest answers', '45 phút, bạn hỏi gì mình trả lời thật') },
        ] } },
        { name: 'vietqr', data: {} },
        { name: 'links', data: { title: s('Useful things', 'Đồ nghề hữu ích'), items: links(
          [s('My remote work gear', 'Bộ đồ nghề làm việc từ xa'), 'https://example.com'],
        ) } },
        { name: 'form', data: { title: s('Say hi or pitch a collab', 'Chào hỏi hoặc rủ hợp tác'), kind: 'contact', fields: { phone: false, email: true, date: false, time: false, guests: false, message: true }, submitLabel: s('Send', 'Gửi') } },
        { name: 'social', data: { links: social('instagram', 'youtube', 'tiktok') } },
      ] as Blocks),
      room: studioRoom('#f2ebdd', '#b98b5e', '#e0662b', s('Field notes', 'Ghi chép dọc đường')),
    }),
  },
  {
    id: 'personal-aesthetic',
    name: 'Pastel aesthetic',
    category: 'personal',
    description: 'A soft, sticker-bold page for Gen Z creators: pastel gradient, pill links, presets and prints to sell, lo-fi music.',
    icon: 'i-lucide-sparkles',
    preview: { bg: '#FFE4F1', accent: '#FF7AB8' },
    build: () => ({
      title: s('lily.mp4 ✿', 'lily.mp4 ✿'),
      bio: s('film photos, soft edits & tiny vlogs ☁️ new preset every month', 'ảnh film, chỉnh màu dịu & vlog nho nhỏ ☁️ preset mới mỗi tháng'),
      avatarUrl: photo('aes-avatar'),
      themeConfig: {
        ...look({
          bg: '#FFE4F1', text: '#4A2B5C', accent: '#FF7AB8', onAccent: '#FFFFFF', surface: '#FFF7FB', border: '#4A2B5C', radius: 26, shadow: 'hard',
          nameFont: 'Pacifico, cursive', nameWeight: '400', nameSize: '2.3rem', headingFont: 'Quicksand, sans-serif', bodyFont: 'Quicksand, sans-serif',
          header: 'banner-circle', banner: photo('val-cover'), link: 'centered', social: 'filled', gap: 'relaxed',
        }),
        background: { type: 'gradient', color: '#FFE4F1', gradient: { style: 'mesh', from: '#FFD6EC', via: '#E8DDFF', to: '#D6F5FF' } },
        music: { trackId: 'cozy-love-lofi' },
      },
      blocks: withIndex([
        { name: 'links', data: { items: links(
          [s('✿ my pastel lightroom presets', '✿ preset lightroom tông pastel'), 'https://example.com'],
          [s('☁️ film diary (new!)', '☁️ nhật ký film (mới!)'), 'https://example.com'],
          [s('🎧 my study playlist', '🎧 playlist học bài của mình'), 'https://open.spotify.com'],
        ) } },
        { name: 'products', data: { title: s('little shop', 'tiệm nhỏ'), layout: 'grid', ordering: true, askAddress: true, payment: 'transfer', items: [
          { id: nanoid(6), name: s('Pastel preset pack (12)', 'Bộ preset pastel (12 cái)'), price: 99000, imageUrl: photo('aes-3'), tag: s('best seller', 'bán chạy') },
          { id: nanoid(6), name: s('Film print set', 'Bộ ảnh in film'), price: 149000, comparePrice: 189000, imageUrl: photo('aes-2') },
          { id: nanoid(6), name: s('Phone wallpapers', 'Hình nền điện thoại'), price: 39000, imageUrl: photo('aes-1') },
        ] } },
        { name: 'text', data: { title: s('how to get your preset ♡', 'nhận preset thế nào ♡'), content: s('order → transfer with your order code → the download link arrives in your inbox within the hour ☁️', 'đặt hàng → chuyển khoản ghi mã đơn → link tải về hộp thư trong vòng một giờ ☁️'), align: 'center', style: 'card' } },
        { name: 'vietqr', data: {} },
        { name: 'image-album', data: { title: s('camera roll', 'cuộn phim'), images: album('blog-fashion-cover', 'creator-art-2'), layout: 'grid' } },
        { name: 'form', data: { title: s('collabs ♡', 'hợp tác ♡'), description: s('I work with soft, kind brands: skincare, stationery, slow fashion.', 'Mình hợp tác với các thương hiệu dịu dàng: skincare, văn phòng phẩm, thời trang chậm.'), kind: 'contact', fields: { phone: false, email: true, date: false, time: false, guests: false, message: true }, submitLabel: s('send ♡', 'gửi ♡') } },
        { name: 'social', data: { links: social('tiktok', 'instagram', 'pinterest', 'spotify') } },
      ] as Blocks),
      room: studioRoom('#ffe4f1', '#e8c4a0', '#ff7ab8', s('little shop', 'tiệm nhỏ')),
    }),
  },

  // ─── Creative ───────────────────────────────────────────────────────────
  {
    id: 'photographer',
    name: 'Photographer',
    category: 'creative',
    description: 'A gallery-first page for photographers: a dark frame for your work, packages with prices and a booking form.',
    icon: 'i-lucide-camera',
    preview: { bg: '#0E0E0E', accent: '#F2F2F2' },
    build: () => ({
      title: s('Dat Nguyen Photography', 'Đạt Nguyễn Photography'),
      bio: s('Landscapes, portraits and quiet places. Based in Da Lat, shooting everywhere.', 'Phong cảnh, chân dung và những nơi yên tĩnh. Ở Đà Lạt, chụp khắp nơi.'),
      avatarUrl: photo('photog-avatar'),
      themeConfig: {
        ...look({
          bg: '#0E0E0E', text: '#F2F2F2', accent: '#F2F2F2', onAccent: '#0E0E0E', surface: '#161616', border: '#2A2A2A', radius: 0, shadow: 'none',
          nameFont: 'Cormorant Garamond, serif', nameWeight: '500', nameSize: '2.6rem', tracking: '0.02em', bodyFont: 'Inter Tight, sans-serif',
          header: 'banner-square', banner: photo('photog-cover'), avatar: 'square', link: 'horizontal-left', social: 'outline', gap: 'relaxed', titleAlign: 'left',
        }),
        music: { trackId: 'game-background' },
      },
      blocks: withIndex([
        { name: 'image-album', data: { title: s('Recent work', 'Tác phẩm chọn lọc'), images: album('photog-1', 'photog-4', 'blog-travel-cover', 'blog-travel-3'), layout: 'masonry' } },
        { name: 'menu', data: { title: s('Sessions & prints', 'Gói chụp & ảnh in'), currency: '₫', layout: 'cards', sections: priced([
          { name: '', items: [
            [s('Portrait session', 'Chụp chân dung'), '1,500,000', s('1 hour, 25 edited photos', '1 giờ, 25 ảnh đã chỉnh'), undefined, 'photog-2'],
            [s('Couple & pre-wedding', 'Ảnh đôi & pre-wedding'), '4,500,000', s('Half a day in Da Lat, 60 photos', 'Nửa ngày ở Đà Lạt, 60 ảnh'), s('Most chosen', 'Được chọn nhiều'), 'photo-2'],
            [s('Fine-art print, 40×60', 'Ảnh in fine-art 40×60'), '600,000', s('Museum paper, signed', 'Giấy bảo tàng, có chữ ký'), undefined, 'photog-3'],
          ] },
        ]) } },
        faq(s('Before your shoot', 'Trước buổi chụp'), s('📅 Edited photos in 7 days, in a private online gallery\n👗 Outfit and location ideas sent a week before\n🌧️ Rain? We move the date for free\n💳 30% deposit to hold the date', '📅 Nhận ảnh đã chỉnh sau 7 ngày, trong album online riêng\n👗 Gửi gợi ý trang phục và địa điểm trước một tuần\n🌧️ Trời mưa được dời lịch miễn phí\n💳 Cọc 30% để giữ ngày')),
        { name: 'testimonials', data: { title: s('Words from clients', 'Lời khách gửi'), items: reviews(
          [s('He found light where we saw fog. Our favourite photos ever.', 'Anh ấy tìm ra ánh sáng giữa màn sương. Bộ ảnh tụi mình thích nhất.'), 'Mai & Huy', s('Pre-wedding, 2025', 'Pre-wedding, 2025')],
          [s('Calm, patient and so good with nervous people.', 'Điềm tĩnh, kiên nhẫn và rất biết cách giúp người ngại chụp.'), 'Anna L.', s('Portrait session', 'Chụp chân dung')],
        ) } },
        { name: 'form', data: { title: s('Book a shoot', 'Đặt lịch chụp'), description: s('Tell me the date and the kind of photos you want.', 'Cho mình biết ngày và kiểu ảnh bạn muốn.'), kind: 'booking', fields: booking(true, false, false) } },
        { name: 'vietqr', data: {} },
        { name: 'social', data: { links: social('instagram', 'pinterest', 'youtube') } },
      ] as Blocks),
      room: studioRoom('#141414', '#3a3a3a', '#f2f2f2', s('Book a shoot', 'Đặt lịch chụp')),
    }),
  },
  {
    id: 'tattoo-studio',
    name: 'Tattoo studio',
    category: 'creative',
    description: 'Bold and dark for tattoo artists: flash and healed work, prices, aftercare, and booking a consultation.',
    icon: 'i-lucide-pen-tool',
    preview: { bg: '#0B0B0B', accent: '#C8102E' },
    build: () => ({
      title: 'INK & IRON',
      bio: s('Custom fine-line, blackwork and colour. Walk-ins Fridays.', 'Hình xăm thiết kế riêng: fine-line, blackwork và màu. Nhận khách vãng lai thứ Sáu.'),
      avatarUrl: photo('tattoo-avatar'),
      themeConfig: {
        ...look({
          bg: '#0B0B0B', text: '#EDE6DA', accent: '#C8102E', onAccent: '#FFFFFF', surface: '#141210', border: '#3A2F2A', radius: 4, shadow: 'none',
          nameFont: 'Bebas Neue, sans-serif', nameWeight: '400', nameSize: '3.4rem', tracking: '0.08em', headingFont: 'Space Grotesk, sans-serif', bodyFont: 'Be Vietnam Pro, sans-serif',
          header: 'image-overlay', link: 'horizontal-left', social: 'outline', titleAlign: 'left',
        }),
        background: { type: 'solid', color: '#0B0B0B', pattern: { id: 'diagonal', color: '#C8102E' } },
        music: { trackId: 'pixel-plains' },
      },
      blocks: withIndex([
        { name: 'image-album', data: { title: s('Fresh & healed', 'Hình mới & đã lành'), images: album('tattoo-cover', 'tattoo-1', 'tattoo-2', 'tattoo-3'), layout: 'grid' } },
        { name: 'menu', data: { title: s('Prices', 'Bảng giá'), currency: '₫', layout: 'list', sections: menu([
          { name: '', items: [
            [s('Small piece (under 5 cm)', 'Hình nhỏ (dưới 5 cm)'), '800,000', s('Fine-line or minimal', 'Fine-line hoặc tối giản')],
            [s('Medium (hand-sized)', 'Hình vừa (cỡ bàn tay)'), '2,500,000', s('Custom design included', 'Đã gồm thiết kế riêng')],
            [s('Full day session', 'Phiên xăm cả ngày'), '7,000,000', s('Sleeves and back pieces', 'Kín tay, kín lưng')],
            [s('Cover-up consultation', 'Tư vấn xăm che'), s('Free', 'Miễn phí'), s('By appointment', 'Theo lịch hẹn')],
          ] },
        ]) } },
        { name: 'text', data: { title: s('Aftercare', 'Chăm sóc sau xăm'), content: s('Keep the film on for 2 days, wash gently twice a day, a thin layer of balm, no sun or swimming for 2 weeks. Questions? Message us anytime.', 'Giữ màng bọc 2 ngày, rửa nhẹ ngày hai lần, thoa mỏng kem dưỡng, tránh nắng và bơi trong 2 tuần. Có thắc mắc cứ nhắn cho tụi mình.'), align: 'left', style: 'card' } },
        faq(s('Studio rules', 'Quy định của studio'), s('🪪 18+ only, bring your ID\n🧼 Single-use needles and vegan inks, always\n💳 A 500,000₫ deposit books your session and goes towards the price\n✏️ Free touch-up within 3 months', '🪪 Chỉ nhận khách từ 18 tuổi, mang theo CCCD\n🧼 Kim dùng một lần, mực thuần chay\n💳 Cọc 500.000₫ để giữ lịch, trừ vào giá hình\n✏️ Dặm lại miễn phí trong 3 tháng')),
        { name: 'form', data: { title: s('Book a consultation', 'Đặt lịch tư vấn'), description: s('Send your idea, size and placement. We reply with a sketch plan.', 'Gửi ý tưởng, kích thước và vị trí. Tụi mình sẽ trả lời kèm hướng phác thảo.'), kind: 'booking', fields: booking(true, false, false) } },
        { name: 'vietqr', data: {} },
        { name: 'hours', data: { title: s('Studio hours', 'Giờ làm việc'), days: hours('12:00', '21:00', [1]), note: s('By appointment; walk-ins on Fridays.', 'Theo lịch hẹn; thứ Sáu nhận khách vãng lai.') } },
        { name: 'contact', data: { title: s('The studio', 'Studio'), address: s('41 Phan Xich Long, Phu Nhuan, HCMC', '41 Phan Xích Long, Phú Nhuận, TP.HCM'), phone: SAMPLE_PHONE, quickBar: true } },
        { name: 'social', data: { links: social('instagram', 'tiktok', 'facebook', 'googlemaps') } },
      ] as Blocks),
      room: nightRoom('#120d0b', '#c8102e', s('Book a consultation', 'Đặt lịch tư vấn')),
    }),
  },

  // ─── Beauty ─────────────────────────────────────────────────────────────
  {
    id: 'hair-salon',
    name: 'Hair salon',
    category: 'beauty',
    description: 'A warm, colourful page for hair salons: services with prices, before & after, reviews and online booking.',
    icon: 'i-lucide-scissors',
    preview: { bg: '#FFF4EE', accent: '#E2463B' },
    build: () => ({
      title: s('Rouge Hair Studio', 'Rouge Hair Studio'),
      bio: s('Colour specialists. Balayage, vivid shades and cuts that grow out beautifully.', 'Chuyên màu tóc. Balayage, màu nổi và những kiểu cắt để dài vẫn đẹp.'),
      avatarUrl: photo('salon-avatar'),
      themeConfig: {
        ...look({
          bg: '#FFF4EE', text: '#3A1F1A', accent: '#E2463B', onAccent: '#FFFFFF', surface: '#FFFFFF', radius: 22, shadow: 'md',
          nameFont: 'Lobster, cursive', nameWeight: '400', nameSize: '2.5rem', headingFont: 'Poppins, sans-serif', bodyFont: 'Nunito, sans-serif',
          header: 'banner-circle', banner: photo('salon-cover'), link: 'horizontal-left', social: 'filled',
        }),
        background: { type: 'solid', color: '#FFF4EE', pattern: { id: 'waves', color: '#E2463B' } },
        music: { trackId: 'puzzle-casual' },
      },
      blocks: withIndex([
        { name: 'menu', data: { title: s('Services & prices', 'Dịch vụ & bảng giá'), currency: '₫', layout: 'cards', sections: menu([
          { name: s('Cut & style', 'Cắt & tạo kiểu'), items: [
            [s('Women’s cut & blow-dry', 'Cắt & sấy tạo kiểu nữ'), '250,000'],
            [s('Men’s cut', 'Cắt tóc nam'), '150,000'],
          ] },
          { name: s('Colour services', 'Nhuộm'), items: [
            [s('Single colour', 'Nhuộm một màu'), '650,000', s('From, depends on length', 'Từ, tuỳ độ dài tóc')],
            [s('Balayage', 'Balayage'), '1,500,000', s('Hand-painted, includes toner', 'Vẽ tay, đã gồm phủ màu'), s('Signature', 'Đặc trưng')],
            [s('Vivid colours (pink, red, blue…)', 'Màu nổi (hồng, đỏ, xanh…)'), '1,800,000'],
          ] },
          { name: s('Care', 'Phục hồi'), items: [
            [s('Keratin treatment', 'Phục hồi keratin'), '1,200,000', s('Smooth and shiny for 3 months', 'Mượt bóng suốt 3 tháng')],
          ] },
        ]) } },
        { name: 'image-album', data: { title: s('Fresh from the chair', 'Vừa rời ghế salon'), images: album('salon-1', 'salon-2', 'salon-3', 'hair-1'), layout: 'carousel' } },
        { name: 'testimonials', data: { title: s('Happy heads', 'Khách nói gì'), items: reviews(
          [s('Finally a pink that didn’t fade in a week!', 'Cuối cùng cũng có màu hồng không phai sau một tuần!'), 'Trang N.', s('Google review', 'Đánh giá Google')],
          [s('They listened, then did even better than my photo.', 'Các bạn lắng nghe rồi làm còn đẹp hơn ảnh mẫu.'), 'Phuong L.', s('Regular since 2023', 'Khách quen từ 2023')],
        ) } },
        faq(s('Before you come', 'Trước khi đến'), s('⏱️ Balayage and vivid colours take 3–4 hours: book a morning slot\n📸 Bring a photo of the look you love\n🧴 Free aftercare shampoo with every colour\n⏰ Running late? We hold your chair for 15 minutes', '⏱️ Balayage và màu nổi mất 3–4 tiếng, nên đặt buổi sáng\n📸 Mang theo ảnh kiểu tóc bạn thích\n🧴 Tặng dầu gội giữ màu khi nhuộm\n⏰ Đến trễ? Salon giữ chỗ 15 phút')),
        { name: 'form', data: { title: s('Book your chair', 'Đặt lịch làm tóc'), description: s('Pick a time; we’ll confirm on Zalo.', 'Chọn giờ, tụi mình sẽ xác nhận qua Zalo.'), kind: 'booking', fields: booking(true, true, false) } },
        { name: 'hours', data: { title: s('Opening hours', 'Giờ mở cửa'), days: hours('09:00', '20:00', [1]) } },
        { name: 'contact', data: { title: s('Come see us', 'Ghé salon'), address: s('18 Ly Tu Trong, District 1, HCMC', '18 Lý Tự Trọng, Quận 1, TP.HCM'), phone: SAMPLE_PHONE, quickBar: true } },
        { name: 'social', data: { links: social('instagram', 'tiktok', 'zalo', 'facebook', 'googlemaps') } },
      ] as Blocks),
      room: shopRoom('#fff4ee', '#d9b8a0', '#e2463b', s('Book your chair', 'Đặt lịch làm tóc')),
    }),
  },
  {
    id: 'makeup-artist',
    name: 'Makeup artist',
    category: 'beauty',
    description: 'An elegant page for makeup artists: bridal and event packages, a lookbook, reviews from brides and checking a date.',
    icon: 'i-lucide-brush',
    preview: { bg: '#1A1116', accent: '#E9B4C8' },
    build: () => ({
      title: s('Bao Ngan Makeup', 'Bảo Ngân Makeup'),
      bio: s('Bridal & event makeup that still looks like you. Hanoi, travels for weddings.', 'Trang điểm cô dâu & sự kiện mà vẫn là chính bạn. Hà Nội, nhận đi tỉnh.'),
      avatarUrl: photo('makeup-avatar'),
      themeConfig: {
        ...look({
          bg: '#1A1116', text: '#F8E9EF', accent: '#E9B4C8', onAccent: '#1A1116', surface: '#24171E', border: '#3A2730', radius: 18, shadow: 'glow',
          nameFont: 'Great Vibes, cursive', nameWeight: '400', nameSize: '2.9rem', headingFont: 'Cormorant Garamond, serif', bodyFont: 'Lora, serif',
          header: 'banner-circle', banner: photo('makeup-cover'), link: 'centered', social: 'soft', gap: 'relaxed',
        }),
        background: { type: 'gradient', color: '#1A1116', gradient: { angle: 180, from: '#1A1116', to: '#2B1622' } },
        music: { trackId: 'romantic-piano' },
      },
      blocks: withIndex([
        { name: 'menu', data: { title: s('Makeup packages', 'Gói trang điểm'), currency: '₫', layout: 'cards', sections: priced([
          { name: '', items: [
            [s('Bridal makeup & hair', 'Trang điểm & làm tóc cô dâu'), '2,500,000', s('Trial included, touch-ups all day', 'Đã gồm thử trước, dặm lại cả ngày'), s('Top pick', 'Đặt nhiều nhất'), 'makeup-1'],
            [s('Engagement day', 'Lễ ăn hỏi, vu quy'), '1,800,000', s('Ao dai look, hair styling', 'Phong cách áo dài, búi tóc'), undefined, 'vn-wedding-4'],
            [s('Event & party', 'Sự kiện & tiệc'), '900,000', s('90 minutes', '90 phút')],
            [s('Personal makeup class', 'Lớp tự trang điểm 1-1'), '1,500,000', s('3 hours, your own products', '3 giờ, dùng mỹ phẩm của bạn')],
          ] },
        ]) } },
        { name: 'image-album', data: { title: s('Lookbook', 'Lookbook'), images: album('makeup-4', 'makeup-3', 'makeup-2'), layout: 'masonry' } },
        { name: 'testimonials', data: { title: s('From my brides', 'Cô dâu nói gì'), items: reviews(
          [s('I cried twice and my makeup didn’t move. Magic.', 'Mình khóc hai lần mà lớp trang điểm vẫn y nguyên. Như phép thuật.'), 'Thao V.', s('Bride, October 2025', 'Cô dâu, tháng 10/2025')],
          [s('Soft, glowing and exactly me, just better.', 'Nhẹ nhàng, rạng rỡ, vẫn là mình mà đẹp hơn.'), 'Hanh P.', s('Engagement day look', 'Lễ ăn hỏi')],
        ) } },
        faq(s('Brides often ask', 'Cô dâu hay hỏi'), s('🚗 Outside Hanoi? Travel is 300,000₫ plus transport\n🌅 Early ceremonies welcome, from 4:30 am\n💄 High-end, skin-friendly products; tell me about allergies\n💳 A 30% deposit holds your date', '🚗 Ngoài Hà Nội: phụ phí 300.000₫ cộng chi phí đi lại\n🌅 Nhận lễ sớm, từ 4 giờ 30 sáng\n💄 Mỹ phẩm cao cấp, dịu da; dị ứng gì nhớ báo trước\n💳 Cọc 30% để giữ ngày')),
        { name: 'form', data: { title: s('Check my date', 'Kiểm tra lịch trống'), description: s('Wedding season fills up fast. Send your date and I’ll confirm within a day.', 'Mùa cưới kín lịch rất nhanh. Gửi ngày của bạn, mình xác nhận trong một ngày.'), kind: 'booking', fields: booking(true, true, false), submitLabel: s('See if I’m free', 'Kiểm tra lịch') } },
        { name: 'vietqr', data: {} },
        { name: 'social', data: { links: social('instagram', 'tiktok', 'facebook', 'zalo') } },
      ] as Blocks),
      room: loungeRoom('#24171e', '#6b4a52', '#e9b4c8', s('Bridal', 'Cô dâu')),
    }),
  },
]
