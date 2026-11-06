import { nanoid } from 'nanoid'
import type { LandId } from '~/types/room'
import type { PageTemplate } from '../pageTemplates'
import { album, look, noteCopy, photo, withIndex } from '../templateKit'
import { type Blocks, type Obj, RSVP_FIELDS, giftRoom } from '../pageTemplatesMore'

// Wedding invitations in the styles Vietnamese couples ask for most: Song Hỷ,
// dragon and phoenix, áo dài, lotus, Korean, minimal, vintage, beach, a
// black-and-gold evening, a bilingual card and one link for two families
// (blocks marked side: 'groom' | 'bride' show on that family's tab). Each
// has its own 3D room to hang the pre-wedding photos in. Sample text in
// English with its Vietnamese next to it: `s(en, vi)`.

export const WEDDINGS_VI: Record<string, string> = {}
function s(en: string, vi: string) {
  WEDDINGS_VI[en] = vi
  noteCopy(en, vi)
  return en
}

const step = (date: string, title: string, text?: string) => ({ id: nanoid(6), date, title, text })

/** The gift room, on its own land */
function weddingRoom(land: LandId, wall: string, floor: string, accent: string, sign: string, photos: string[], mode: 'day' | 'night', trackId: string, extra: Obj[] = []) {
  return { ...giftRoom(wall, floor, accent, sign, photos, mode, trackId, extra), land }
}

const rsvp = (title: string, description: string, submitLabel: string) =>
  ({ name: 'form' as const, data: { title, description, kind: 'rsvp' as const, fields: RSVP_FIELDS, submitLabel } })

export const WEDDING_TEMPLATES: PageTemplate[] = [
  // ─── Song Hỷ: red and gold, traditional ──────────────────────────────
  {
    id: 'wedding-song-hy',
    name: 'Song Hỷ wedding invitation',
    category: 'events',
    description: 'The classic red and gold “double happiness” card: both families, the lunar date, the ceremony and the party, RSVP and a QR for wedding gifts.',
    icon: 'i-lucide-heart-handshake',
    preview: { bg: '#A3141B', accent: '#F2C35B' },
    build: () => ({
      title: s('Minh Châu 囍 Hoàng Long', 'Minh Châu 囍 Hoàng Long'),
      bio: s('Sunday, 27 December 2026 · the 19th day of the 11th lunar month', 'Chủ Nhật, 27.12.2026 · tức ngày 19 tháng 11 năm Bính Ngọ'),
      avatarUrl: photo('vn-wedding-avatar'),
      themeConfig: {
        ...look({
          bg: '#A3141B', text: '#FFF1D6', accent: '#F2C35B', onAccent: '#6B0A0F', surface: '#B3222A', border: '#E0AE4C', radius: 10, shadow: 'none',
          nameFont: 'Dancing Script, cursive', nameWeight: '700', nameSize: '2.5rem', headingFont: 'Cinzel, serif', bodyFont: 'Noto Serif, serif',
          header: 'banner-circle', banner: photo('vn-wedding-cover'), link: 'centered', social: 'outline', gap: 'relaxed',
        }),
        background: { type: 'gradient', color: '#A3141B', gradient: { angle: 180, from: '#B5161E', to: '#7A0C12' }, pattern: { id: 'diagonal', color: '#F2C35B' } },
        music: { trackId: 'romantic-piano' },
      },
      blocks: withIndex([
        { name: 'letter', data: { to: s('our honoured guest', 'quý khách'), body: s('Our two families are happy to announce the wedding of our children, Minh Châu and Hoàng Long.\nYour presence would bring joy and honour to our families on this happy day.', 'Gia đình chúng tôi trân trọng báo tin vui lễ thành hôn của hai con: Minh Châu và Hoàng Long.\nSự hiện diện của quý khách là niềm vinh hạnh cho gia đình chúng tôi trong ngày vui này.'), from: s('Minh Châu & Hoàng Long', 'Minh Châu & Hoàng Long'), sealed: true, paper: 'blush', personal: true } },
        { name: 'text', data: { title: s('囍 Our families', '囍 Hai gia đình'), content: s('The groom’s family\nMr Trần Văn Bình · Mrs Lê Thị Hoa\nThái Bình\n\nThe bride’s family\nMr Phạm Quốc Huy · Mrs Đỗ Thị Mai\nHải Phòng', 'Nhà trai\nÔng Trần Văn Bình · Bà Lê Thị Hoa\nThái Bình\n\nNhà gái\nÔng Phạm Quốc Huy · Bà Đỗ Thị Mai\nHải Phòng'), align: 'center', style: 'card' } },
        { name: 'birthday-countdown', data: { birthDate: '2026-12-27', theme: 'card', showAge: false, label: s('Our wedding day in', 'Còn bao lâu đến ngày vui'), mode: 'until', repeat: false } },
        { name: 'event', data: { name: s('Wedding ceremony (Lễ Thành Hôn)', 'Lễ Thành Hôn'), date: '2026-12-27', startTime: '09:00', endTime: '10:00', venue: s('The groom’s family home', 'Tư gia nhà trai'), address: s('12 Le Loi Street, Thai Binh', '12 Lê Lợi, TP. Thái Bình') } },
        { name: 'event', data: { name: s('Wedding party', 'Tiệc cưới'), date: '2026-12-27', startTime: '11:00', endTime: '14:00', venue: s('Hoàng Gia Wedding Hall, Hall 2', 'Trung tâm tiệc cưới Hoàng Gia, sảnh 2'), address: s('168 Ly Bon Street, Thai Binh', '168 Lý Bôn, TP. Thái Bình'), note: s('Guests are welcomed from 10:30.', 'Đón khách từ 10 giờ 30.') } },
        { name: 'image-album', data: { title: s('Wedding photos', 'Album ảnh cưới'), images: album('vn-wedding-1', 'vn-wedding-3', 'vn-wedding-2', 'vn-wedding-4'), layout: 'grid' } },
        rsvp(s('Will you come?', 'Quý khách sẽ đến chung vui chứ?'), s('Please let us know by 20 December.', 'Vui lòng xác nhận giúp gia đình trước ngày 20/12.'), s('Send my reply', 'Gửi xác nhận')),
        { name: 'vietqr', data: {} },
      ] as Blocks),
      room: weddingRoom('crimson', '#a3141b', '#5c2a14', '#f2c35b', s('囍 Double happiness', '囍 Song Hỷ'), ['vn-wedding-avatar', 'vn-wedding-1', 'vn-wedding-3'], 'night', 'romantic-piano'),
    }),
  },

  // ─── Dragon & phoenix: formal, from both sets of parents ────────────
  {
    id: 'wedding-dragon-phoenix',
    name: 'Dragon & phoenix wedding invitation',
    category: 'events',
    description: 'A formal card in deep red and gold, sent by both sets of parents: the bride’s send-off, the wedding ceremony and the party, each on its family’s tab.',
    icon: 'i-lucide-crown',
    preview: { bg: '#5E0A0F', accent: '#D4A84B' },
    build: () => ({
      title: s('Thanh Hằng ❦ Quốc Bảo', 'Thanh Hằng ❦ Quốc Bảo'),
      bio: s('Saturday, 28 November 2026 · the 20th day of the 10th lunar month', 'Thứ Bảy, 28.11.2026 · tức ngày 20 tháng 10 năm Bính Ngọ'),
      avatarUrl: photo('vn-wedding-4'),
      themeConfig: {
        ...look({
          bg: '#5E0A0F', text: '#F7E3B5', accent: '#D4A84B', onAccent: '#3E0609', surface: '#6E1218', border: '#B88A35', radius: 2, shadow: 'none',
          nameFont: 'Cinzel, serif', nameWeight: '600', nameSize: '2.1rem', tracking: '0.04em', headingFont: 'Cinzel, serif', bodyFont: 'Cormorant Garamond, serif',
          header: 'image-overlay', banner: photo('vn-wedding-1'), link: 'centered', social: 'outline', gap: 'relaxed',
        }),
        background: { type: 'gradient', color: '#5E0A0F', gradient: { angle: 160, from: '#6E1218', to: '#3E0609' } },
        music: { trackId: 'romantic-piano' },
      },
      blocks: withIndex([
        { name: 'text', data: { title: s('Our families respectfully invite you', 'Trân trọng kính mời'), content: s('Mr Nguyễn Đình Khang · Mrs Vũ Thị Thu\n(the bride’s parents, Bắc Ninh)\n\nMr Lương Văn Đức · Mrs Hoàng Thị Nga\n(the groom’s parents, Hà Nội)\n\nrequest the honour of your presence at the wedding of our children', 'Ông Nguyễn Đình Khang · Bà Vũ Thị Thu\n(thân sinh cô dâu, Bắc Ninh)\n\nÔng Lương Văn Đức · Bà Hoàng Thị Nga\n(thân sinh chú rể, Hà Nội)\n\nTrân trọng kính mời quý khách đến dự lễ thành hôn của các con chúng tôi'), align: 'center', style: 'plain' } },
        { name: 'letter', data: { to: s('our honoured guest', 'quý khách'), body: s('NGUYỄN THANH HẰNG\nand\nLƯƠNG QUỐC BẢO\n\nThe wedding will be held on Saturday, 28 November 2026,\nthat is the 20th day of the 10th month of the year of the Horse.\nYour presence is an honour to our families.', 'NGUYỄN THANH HẰNG\nvà\nLƯƠNG QUỐC BẢO\n\nHôn lễ được cử hành vào Thứ Bảy, ngày 28 tháng 11 năm 2026,\ntức ngày 20 tháng 10 năm Bính Ngọ.\nSự hiện diện của quý khách là niềm vinh hạnh cho gia đình chúng tôi.'), from: s('The two families', 'Hai gia đình'), sealed: true, paper: 'cream', personal: true } },
        { name: 'birthday-countdown', data: { birthDate: '2026-11-28', theme: 'elegant', showAge: false, label: s('The ceremony begins in', 'Hôn lễ sẽ diễn ra sau'), mode: 'until', repeat: false } },
        { name: 'event', side: 'bride', data: { name: s('The bride’s send-off (Lễ Vu Quy)', 'Lễ Vu Quy'), date: '2026-11-28', startTime: '08:00', endTime: '09:30', venue: s('The bride’s family home', 'Tư gia nhà gái'), address: s('5 Ly Thai To Street, Bac Ninh', '5 Lý Thái Tổ, TP. Bắc Ninh') } },
        { name: 'event', side: 'bride', data: { name: s('Party at the bride’s family', 'Tiệc cưới nhà gái'), date: '2026-11-27', startTime: '17:30', endTime: '20:30', venue: s('Kinh Bắc Restaurant', 'Nhà hàng Kinh Bắc'), address: s('22 Ngo Gia Tu Street, Bac Ninh', '22 Ngô Gia Tự, TP. Bắc Ninh'), note: s('The evening before the send-off.', 'Tối trước ngày Vu Quy.') } },
        { name: 'event', side: 'groom', data: { name: s('Wedding ceremony (Lễ Thành Hôn)', 'Lễ Thành Hôn'), date: '2026-11-28', startTime: '10:30', endTime: '11:30', venue: s('The groom’s family home', 'Tư gia nhà trai'), address: s('41 Hang Chuoi Street, Hai Ba Trung, Hanoi', '41 Hàng Chuối, Hai Bà Trưng, Hà Nội') } },
        { name: 'event', side: 'groom', data: { name: s('Party at the groom’s family', 'Tiệc cưới nhà trai'), date: '2026-11-28', startTime: '12:00', endTime: '14:30', venue: s('Long Phụng Palace, Phoenix Hall', 'Cung tiệc Long Phụng, sảnh Phượng Hoàng'), address: s('99 Tran Khat Chan, Hai Ba Trung, Hanoi', '99 Trần Khát Chân, Hai Bà Trưng, Hà Nội'), dressCode: s('Formal', 'Trang phục lịch sự') } },
        { name: 'image-album', data: { title: s('Wedding photos', 'Album ảnh cưới'), images: album('vn-wedding-4', 'vn-wedding-2', 'vn-wedding-3', 'vn-wedding-avatar'), layout: 'masonry' } },
        rsvp(s('Kindly reply', 'Xác nhận tham dự'), s('So our families can welcome you properly.', 'Để gia đình đón tiếp quý khách được chu đáo.'), s('Confirm', 'Xác nhận')),
        { name: 'vietqr', data: {} },
      ] as Blocks),
      room: weddingRoom('crimson', '#5e0a0f', '#3b2314', '#d4a84b', s('Dragon & phoenix', 'Long Phụng sum vầy'), ['vn-wedding-4', 'vn-wedding-2', 'vn-wedding-avatar'], 'night', 'romantic-piano'),
    }),
  },

  // ─── Minimal: white, black type ─────────────────────────────────────
  {
    id: 'wedding-minimal',
    name: 'Minimal wedding invitation',
    category: 'events',
    description: 'White space and black type, nothing more: the date, the place, the plan of the day and an RSVP.',
    icon: 'i-lucide-minus',
    preview: { bg: '#FFFFFF', accent: '#111111' },
    build: () => ({
      title: s('AN & KHOA', 'AN & KHOA'),
      bio: s('16 . 01 . 2027 — Saigon', '16 . 01 . 2027 — Sài Gòn'),
      avatarUrl: photo('photo-3'),
      themeConfig: {
        ...look({
          bg: '#FFFFFF', text: '#111111', accent: '#111111', onAccent: '#FFFFFF', surface: '#FFFFFF', border: '#E6E6E6', radius: 0, shadow: 'none',
          nameFont: 'Inter Tight, sans-serif', nameWeight: '300', nameSize: '2.4rem', tracking: '0.35em', headingFont: 'Inter Tight, sans-serif', bodyFont: 'Inter, sans-serif',
          header: 'centered', link: 'centered', social: 'plain', gap: 'relaxed',
        }),
        music: { trackId: 'romantic-date' },
      },
      blocks: withIndex([
        { name: 'text', data: { content: s('We’re getting married.\nCome celebrate with us.', 'Chúng mình kết hôn.\nMời bạn đến chung vui.'), align: 'center', style: 'plain' } },
        { name: 'birthday-countdown', data: { birthDate: '2027-01-16', theme: 'minimal', showAge: false, label: s('Days to go', 'Còn lại'), mode: 'until', repeat: false } },
        { name: 'event', data: { name: s('Ceremony & dinner', 'Lễ cưới & tiệc tối'), date: '2027-01-16', startTime: '18:00', endTime: '21:30', venue: s('The White Hall', 'The White Hall'), address: s('29 Ton Duc Thang, District 1, Ho Chi Minh City', '29 Tôn Đức Thắng, Quận 1, TP. Hồ Chí Minh'), dressCode: s('Black or white', 'Đen hoặc trắng') } },
        { name: 'timeline', data: { title: s('The evening', 'Buổi tối'), items: [
          step('18:00', s('Welcome', 'Đón khách')),
          step('18:45', s('Ceremony', 'Làm lễ')),
          step('19:15', s('Dinner', 'Tiệc tối')),
          step('21:00', s('Dancing', 'Khiêu vũ')),
        ] } },
        { name: 'image-album', data: { images: album('photo-3', 'photo-1', 'photo-4'), layout: 'carousel' } },
        rsvp(s('RSVP', 'Xác nhận'), s('By 1 January.', 'Trước ngày 01/01.'), s('Send', 'Gửi')),
        { name: 'vietqr', data: {} },
      ] as Blocks),
      room: weddingRoom('winter', '#f5f5f5', '#d6d3cd', '#111111', s('A & K', 'A & K'), ['photo-3', 'photo-1', 'photo-4'], 'day', 'romantic-date'),
    }),
  },

  // ─── Korean: soft beige, film photos ────────────────────────────────
  {
    id: 'wedding-korean',
    name: 'Korean-style wedding invitation',
    category: 'events',
    description: 'Soft beige, film-grain photos and gentle type, like a Seoul studio card: your story, the day and an RSVP.',
    icon: 'i-lucide-camera',
    preview: { bg: '#F3ECE2', accent: '#9C8064' },
    build: () => ({
      title: s('Yến & Duy', 'Yến & Duy'),
      bio: s('our little forever starts on 05.12.2026', 'hành trình mãi mãi bắt đầu từ 05.12.2026'),
      avatarUrl: photo('garden-3'),
      themeConfig: {
        ...look({
          bg: '#F3ECE2', text: '#5A4A3C', accent: '#9C8064', onAccent: '#FFFFFF', surface: '#FBF8F3', radius: 22, shadow: 'sm',
          nameFont: 'Sacramento, cursive', nameWeight: '400', nameSize: '3rem', headingFont: 'Quicksand, sans-serif', bodyFont: 'Quicksand, sans-serif',
          header: 'cover', banner: photo('photo-3'), avatar: 'rounded', link: 'centered', social: 'soft', gap: 'relaxed',
        }),
        music: { trackId: 'cozy-love-lofi' },
      },
      blocks: withIndex([
        { name: 'letter', data: { to: s('you', 'bạn'), body: s('Through every season, we found our way to each other.\nNow we want to start the next one with the people we love most. Will you be there?', 'Đi qua bao mùa, cuối cùng chúng mình đã tìm thấy nhau.\nGiờ chúng mình muốn bắt đầu mùa tiếp theo cùng những người thương nhất. Bạn đến nhé?'), from: s('Yến & Duy', 'Yến & Duy'), sealed: true, paper: 'cream', personal: true } },
        { name: 'timeline', data: { title: s('Our story', 'Chuyện của chúng mình'), items: [
          { ...step('2020', s('Same café, every morning', 'Cùng một quán cà phê, mỗi sáng'), s('He always ordered what she had.', 'Anh luôn gọi đúng món cô vừa gọi.')), imageUrl: photo('love-1') },
          step('2022', s('First trip to the sea', 'Chuyến biển đầu tiên'), s('Sunburnt and happy.', 'Cháy nắng mà vui.')),
          { ...step('2026', s('A yes in Seoul', 'Lời đồng ý ở Seoul'), s('Under the first snow.', 'Dưới trận tuyết đầu mùa.')), imageUrl: photo('photo-4') },
        ] } },
        { name: 'birthday-countdown', data: { birthDate: '2026-12-05', theme: 'card', showAge: false, label: s('See you in', 'Hẹn gặp bạn sau'), mode: 'until', repeat: false } },
        { name: 'event', data: { name: s('Wedding ceremony & lunch', 'Lễ cưới & tiệc trưa'), date: '2026-12-05', startTime: '11:00', endTime: '14:00', venue: s('Maison Lumière', 'Maison Lumière'), address: s('17 Thao Dien Street, Thu Duc, Ho Chi Minh City', '17 Thảo Điền, TP. Thủ Đức, TP. Hồ Chí Minh'), dressCode: s('Cream, beige, soft brown', 'Kem, be, nâu nhạt') } },
        { name: 'image-album', data: { title: s('Film roll', 'Cuộn phim'), images: album('photo-3', 'garden-3', 'photo-4', 'love-7'), layout: 'masonry' } },
        rsvp(s('Will you come?', 'Bạn sẽ đến chứ?'), s('Tell us by 25 November.', 'Báo chúng mình trước 25/11 nhé.'), s('Send', 'Gửi')),
        { name: 'vietqr', data: {} },
      ] as Blocks),
      room: weddingRoom('fairy', '#f3ece2', '#c9b39a', '#9c8064', s('Yến ♡ Duy', 'Yến ♡ Duy'), ['photo-3', 'garden-3', 'photo-4'], 'day', 'cozy-love-lofi'),
    }),
  },

  // ─── Vintage: sepia, an old letter ──────────────────────────────────
  {
    id: 'wedding-vintage',
    name: 'Vintage wedding invitation',
    category: 'events',
    description: 'Sepia paper and an old-fashioned letter, sealed in wax: the invitation, the date, the venue and a reply card.',
    icon: 'i-lucide-scroll-text',
    preview: { bg: '#EADBC2', accent: '#7A4E2D' },
    build: () => ({
      title: s('Phương Thảo & Gia Huy', 'Phương Thảo & Gia Huy'),
      bio: s('Saturday, the 21st of November, 2026', 'Thứ Bảy, ngày 21 tháng 11 năm 2026'),
      avatarUrl: photo('letters-cover'),
      themeConfig: {
        ...look({
          bg: '#EADBC2', text: '#4A3221', accent: '#7A4E2D', onAccent: '#F6EBD9', surface: '#F4EAD8', border: '#C9AE87', radius: 6, shadow: 'sm',
          nameFont: 'Parisienne, cursive', nameWeight: '400', nameSize: '2.6rem', headingFont: 'Playfair Display, serif', bodyFont: '"Times New Roman", Times, serif',
          header: 'banner-circle', banner: photo('letters-cover'), link: 'centered', social: 'outline', gap: 'relaxed',
        }),
        background: { type: 'solid', color: '#EADBC2', pattern: { id: 'lines', color: '#C9AE87' } },
        music: { trackId: 'romantic-piano' },
      },
      blocks: withIndex([
        { name: 'letter', data: { to: s('Dear friend', 'Bạn thân mến'), cover: s('A letter for you, sealed with love', 'Một lá thư gửi bạn, niêm phong bằng yêu thương'), body: s('Some stories are written slowly, one letter at a time.\nOurs has reached its happiest page, and we would be so glad to have you there when we turn it.\nWith love, and hoping to see you soon.', 'Có những câu chuyện được viết chậm rãi, từng lá thư một.\nChuyện của chúng mình đã đến trang hạnh phúc nhất, và thật vui nếu có bạn ở đó khi chúng mình lật sang trang mới.\nThương gửi, mong sớm gặp bạn.'), from: s('Thảo & Huy', 'Thảo & Huy'), sealed: true, paper: 'cream', personal: true } },
        { name: 'event', data: { name: s('Wedding ceremony & reception', 'Lễ cưới & tiệc chiêu đãi'), date: '2026-11-21', startTime: '17:00', endTime: '21:00', venue: s('Villa Song, the old French villa', 'Biệt thự Song, căn villa Pháp cổ'), address: s('197/2 Nguyen Van Huong, Thao Dien, Thu Duc', '197/2 Nguyễn Văn Hưởng, Thảo Điền, TP. Thủ Đức'), dressCode: s('Vintage, earth tones', 'Phong cách cổ điển, tông màu đất') } },
        { name: 'birthday-countdown', data: { birthDate: '2026-11-21', theme: 'classic', showAge: false, label: s('Until we say “I do”', 'Đến ngày chúng mình nói “Đồng ý”'), mode: 'until', repeat: false } },
        { name: 'image-album', data: { title: s('Old photographs', 'Những tấm ảnh cũ'), images: album('letters-1', 'event-1', 'love-6', 'event-4'), layout: 'grid' } },
        rsvp(s('The reply card', 'Phiếu hồi âm'), s('Kindly reply before the 10th of November.', 'Xin hồi âm trước ngày 10 tháng 11.'), s('Post my reply', 'Gửi hồi âm')),
        { name: 'vietqr', data: {} },
      ] as Blocks),
      room: weddingRoom('autumn', '#eadbc2', '#7a4e2d', '#b07a45', s('Thảo & Huy · 1926 style', 'Thảo & Huy · thư tay'), ['letters-cover', 'event-1', 'love-6'], 'day', 'romantic-piano'),
    }),
  },

  // ─── Áo dài: modern Vietnamese ──────────────────────────────────────
  {
    id: 'wedding-ao-dai',
    name: 'Áo dài wedding invitation',
    category: 'events',
    description: 'Modern Vietnamese in ivory and rose: áo dài photos, the family ceremony and the party, a lunar date and an RSVP.',
    icon: 'i-lucide-flower',
    preview: { bg: '#FBF3EE', accent: '#B23A48' },
    build: () => ({
      title: s('Ngọc Anh & Tuấn Kiệt', 'Ngọc Anh & Tuấn Kiệt'),
      bio: s('Sunday, 3 January 2027 · the 26th day of the 11th lunar month', 'Chủ Nhật, 03.01.2027 · tức ngày 26 tháng 11 năm Bính Ngọ'),
      avatarUrl: photo('vn-wedding-2'),
      themeConfig: {
        ...look({
          bg: '#FBF3EE', text: '#4A1E24', accent: '#B23A48', onAccent: '#FFFFFF', surface: '#FFFFFF', border: '#EBCFCF', radius: 16, shadow: 'sm',
          nameFont: 'Alex Brush, cursive', nameWeight: '400', nameSize: '2.8rem', headingFont: 'Be Vietnam Pro, sans-serif', bodyFont: 'Be Vietnam Pro, sans-serif',
          header: 'banner-square', banner: photo('vn-wedding-3'), avatar: 'rounded', link: 'centered', social: 'soft', gap: 'relaxed',
        }),
        music: { trackId: 'love-acoustic' },
      },
      blocks: withIndex([
        { name: 'letter', data: { to: s('our dear guest', 'quý khách'), body: s('In our áo dài, before our ancestors and both families, we will make our promise.\nWe would love you to be there, to share a meal and a happy day with us.', 'Trong tà áo dài, trước tổ tiên và hai bên gia đình, chúng mình sẽ trao nhau lời hứa.\nRất mong bạn đến chung vui, cùng chúng mình dùng bữa cơm thân mật trong ngày hạnh phúc.'), from: s('Ngọc Anh & Tuấn Kiệt', 'Ngọc Anh & Tuấn Kiệt'), sealed: true, paper: 'blush', personal: true } },
        { name: 'birthday-countdown', data: { birthDate: '2027-01-03', theme: 'rose', showAge: false, label: s('Our wedding day in', 'Còn bao lâu đến ngày cưới'), mode: 'until', repeat: false } },
        { name: 'timeline', data: { title: s('The day', 'Lịch trình'), items: [
          step('07:30', s('Betrothal procession (Lễ Rước Dâu)', 'Lễ rước dâu'), s('The groom’s family arrives at the bride’s home.', 'Nhà trai đến tư gia nhà gái.')),
          step('09:30', s('Ancestral ceremony (Lễ Gia Tiên)', 'Lễ gia tiên'), s('At the groom’s home, with close family.', 'Tại nhà trai, cùng gia đình hai bên.')),
          step('11:00', s('Welcome & photos', 'Đón khách & chụp ảnh')),
          step('11:30', s('Wedding lunch', 'Tiệc cưới')),
        ] } },
        { name: 'event', data: { name: s('Wedding lunch', 'Tiệc cưới'), date: '2027-01-03', startTime: '11:00', endTime: '14:00', venue: s('White Palace, Lotus Hall', 'White Palace, sảnh Sen'), address: s('194 Hoang Van Thu, Phu Nhuan, Ho Chi Minh City', '194 Hoàng Văn Thụ, Phú Nhuận, TP. Hồ Chí Minh'), dressCode: s('Áo dài welcome', 'Khuyến khích mặc áo dài') } },
        { name: 'image-album', data: { title: s('In our áo dài', 'Trong tà áo dài'), images: album('vn-wedding-2', 'vn-wedding-3', 'vn-wedding-4', 'vn-wedding-1'), layout: 'masonry' } },
        rsvp(s('Will you join us?', 'Bạn sẽ đến chung vui chứ?'), s('Please reply by 25 December.', 'Bạn xác nhận giúp trước 25/12 nhé.'), s('Send my reply', 'Gửi xác nhận')),
        { name: 'vietqr', data: {} },
      ] as Blocks),
      room: weddingRoom('sakura', '#fbf3ee', '#c89b8c', '#b23a48', s('Ngọc Anh ♥ Tuấn Kiệt', 'Ngọc Anh ♥ Tuấn Kiệt'), ['vn-wedding-2', 'vn-wedding-3', 'vn-wedding-4'], 'day', 'love-acoustic'),
    }),
  },

  // ─── Lotus: pink and green ──────────────────────────────────────────
  {
    id: 'wedding-lotus',
    name: 'Lotus wedding invitation',
    category: 'events',
    description: 'Lotus pink on leaf green, calm and graceful: a letter, the ceremony and the party, photos, RSVP and a gift QR.',
    icon: 'i-lucide-flower-2',
    preview: { bg: '#EAF2E6', accent: '#D9668A' },
    build: () => ({
      title: s('Hà My & Trung Hiếu', 'Hà My & Trung Hiếu'),
      bio: s('Sunday, 13 December 2026 · the 5th day of the 11th lunar month', 'Chủ Nhật, 13.12.2026 · tức ngày 05 tháng 11 năm Bính Ngọ'),
      avatarUrl: photo('vn-wedding-avatar'),
      themeConfig: {
        ...look({
          bg: '#EAF2E6', text: '#24402E', accent: '#D9668A', onAccent: '#FFFFFF', surface: '#FFFFFF', border: '#CFE0C7', radius: 24, shadow: 'sm',
          nameFont: 'Allura, cursive', nameWeight: '400', nameSize: '3rem', headingFont: 'Lora, serif', bodyFont: 'Lora, serif',
          header: 'banner-circle', banner: photo('garden-2'), link: 'centered', social: 'soft', gap: 'relaxed',
        }),
        background: { type: 'gradient', color: '#EAF2E6', gradient: { angle: 180, from: '#F7E4EA', to: '#E1EEDB' } },
        music: { trackId: 'love-acoustic' },
      },
      blocks: withIndex([
        { name: 'letter', data: { to: s('our dear guest', 'quý khách'), body: s('Like a lotus that blooms in its own season, our love has found its time.\nWe would be honoured to have you with us on our wedding day.', 'Như đóa sen nở đúng mùa, tình yêu của chúng mình cũng đã đến ngày đơm hoa.\nThật vinh hạnh nếu được đón bạn trong ngày cưới của chúng mình.'), from: s('Hà My & Trung Hiếu', 'Hà My & Trung Hiếu'), sealed: true, paper: 'blush', personal: true } },
        { name: 'text', data: { title: s('Our families', 'Hai gia đình'), content: s('The groom’s family: Mr Đặng Văn Tâm · Mrs Ngô Thị Sen\nThe bride’s family: Mr Bùi Minh Lộc · Mrs Trịnh Thị Liên', 'Nhà trai: Ông Đặng Văn Tâm · Bà Ngô Thị Sen\nNhà gái: Ông Bùi Minh Lộc · Bà Trịnh Thị Liên'), align: 'center', style: 'card' } },
        { name: 'birthday-countdown', data: { birthDate: '2026-12-13', theme: 'card', showAge: false, label: s('Our wedding day in', 'Còn bao lâu đến ngày cưới'), mode: 'until', repeat: false } },
        { name: 'event', data: { name: s('Wedding ceremony (Lễ Tân Hôn)', 'Lễ Tân Hôn'), date: '2026-12-13', startTime: '09:00', endTime: '10:00', venue: s('The groom’s family home', 'Tư gia nhà trai'), address: s('8 Dao Duy Tu, Hue', '8 Đào Duy Từ, TP. Huế') } },
        { name: 'event', data: { name: s('Wedding lunch', 'Tiệc cưới'), date: '2026-12-13', startTime: '11:00', endTime: '14:00', venue: s('Sen Hồ Tịnh Tâm Garden', 'Vườn sen Hồ Tịnh Tâm'), address: s('Dinh Tien Hoang Street, Hue', 'Đường Đinh Tiên Hoàng, TP. Huế'), note: s('Outdoor, by the lotus lake.', 'Tiệc ngoài trời, bên hồ sen.') } },
        { name: 'image-album', data: { title: s('Wedding photos', 'Ảnh cưới'), images: album('vn-wedding-avatar', 'garden-2', 'vn-wedding-1', 'florist-1'), layout: 'grid' } },
        rsvp(s('Will you come?', 'Bạn sẽ đến chứ?'), s('Please reply by 5 December.', 'Vui lòng xác nhận trước 05/12.'), s('Send my reply', 'Gửi xác nhận')),
        { name: 'vietqr', data: {} },
      ] as Blocks),
      room: weddingRoom('zen', '#eaf2e6', '#8fae84', '#d9668a', s('Hà My ❀ Trung Hiếu', 'Hà My ❀ Trung Hiếu'), ['vn-wedding-avatar', 'garden-2', 'vn-wedding-1'], 'day', 'love-acoustic'),
    }),
  },

  // ─── Beach / destination ────────────────────────────────────────────
  {
    id: 'wedding-beach',
    name: 'Beach wedding invitation',
    category: 'events',
    description: 'A destination wedding by the sea: getting there, where to stay, a sunset ceremony, the after-party and an RSVP.',
    icon: 'i-lucide-palmtree',
    preview: { bg: '#E6F4F5', accent: '#E07A5F' },
    build: () => ({
      title: s('Vy & Nhân', 'Vy & Nhân'),
      bio: s('Barefoot on the beach · Phú Quốc · 20–21 March 2027', 'Chân trần trên cát · Phú Quốc · 20–21.03.2027'),
      avatarUrl: photo('love-7'),
      themeConfig: {
        ...look({
          bg: '#E6F4F5', text: '#1F3D4A', accent: '#E07A5F', onAccent: '#FFFFFF', surface: '#FFFFFF', radius: 28, shadow: 'md',
          nameFont: 'Satisfy, cursive', nameWeight: '400', nameSize: '2.8rem', headingFont: 'Josefin Sans, sans-serif', bodyFont: 'Nunito, sans-serif',
          header: 'cover', banner: photo('love-cover'), link: 'centered', social: 'filled', gap: 'normal',
        }),
        background: { type: 'gradient', color: '#E6F4F5', gradient: { angle: 180, from: '#FFF3E6', to: '#D4EEF1' }, pattern: { id: 'waves', color: '#9FD3DA' } },
        music: { trackId: 'marimba-travel' },
      },
      blocks: withIndex([
        { name: 'letter', data: { to: s('you', 'bạn'), body: s('Sand, sea and the people we love: that’s all we want on our wedding day.\nPack light, bring sunscreen and come celebrate with us on the island.', 'Cát, biển và những người chúng mình thương: ngày cưới chỉ cần vậy thôi.\nMang ít đồ, nhớ kem chống nắng, và ra đảo chung vui với chúng mình nhé.'), from: s('Vy & Nhân', 'Vy & Nhân'), sealed: true, paper: 'cream', personal: true } },
        { name: 'birthday-countdown', data: { birthDate: '2027-03-20', theme: 'modern', showAge: false, label: s('Island time in', 'Còn bao lâu ra đảo'), mode: 'until', repeat: false } },
        { name: 'event', data: { name: s('Welcome drinks', 'Tiệc chào mừng'), date: '2027-03-20', startTime: '19:00', endTime: '22:00', venue: s('Sunset Bar', 'Sunset Bar'), address: s('Ong Lang Beach, Phu Quoc', 'Bãi Ông Lang, Phú Quốc') } },
        { name: 'event', data: { name: s('Sunset ceremony & dinner', 'Lễ cưới hoàng hôn & tiệc tối'), date: '2027-03-21', startTime: '16:30', endTime: '22:30', venue: s('Coral Bay Resort, the beach lawn', 'Coral Bay Resort, bãi cỏ sát biển'), address: s('Ong Lang Beach, Phu Quoc', 'Bãi Ông Lang, Phú Quốc'), dressCode: s('Beach formal, linen, no heels', 'Lịch sự đi biển, vải linen, không giày cao gót') } },
        { name: 'text', data: { title: s('Getting there & staying', 'Di chuyển & lưu trú'), content: s('Fly to Phú Quốc (PQC); the resort is 25 minutes by car and we run shuttles on the 20th.\nWe’ve held rooms at Coral Bay at a guest rate: tell us in your RSVP and we’ll book for you.', 'Bay đến Phú Quốc (PQC); resort cách sân bay 25 phút đi xe, ngày 20 có xe đưa đón.\nChúng mình đã giữ phòng tại Coral Bay với giá ưu đãi: ghi chú trong phần xác nhận để chúng mình đặt giúp bạn.'), align: 'left', style: 'card' } },
        { name: 'image-album', data: { title: s('Us and the sea', 'Chúng mình và biển'), images: album('love-2', 'love-7', 'villa-cover', 'love-cover'), layout: 'carousel' } },
        rsvp(s('Are you coming to the island?', 'Bạn ra đảo cùng chúng mình chứ?'), s('Please reply by 1 February so we can book flights and rooms.', 'Xác nhận trước 01/02 để chúng mình kịp đặt vé và phòng nhé.'), s('Count me in', 'Mình sẽ đến')),
        { name: 'vietqr', data: {} },
      ] as Blocks),
      room: weddingRoom('tropical', '#e6f4f5', '#e9d8b8', '#e07a5f', s('Vy + Nhân · Phú Quốc', 'Vy + Nhân · Phú Quốc'), ['love-7', 'love-2', 'love-cover'], 'day', 'marimba-travel', [
        { type: 'window', position: [-3, 1.5, 1.7], rotation: 0, wall: 'left' },
      ]),
    }),
  },

  // ─── Night: black and gold, evening reception ───────────────────────
  {
    id: 'wedding-night-gold',
    name: 'Black & gold evening wedding',
    category: 'events',
    description: 'An evening reception in black and gold: the dinner, the programme, a dress code, photos, RSVP and a gift QR.',
    icon: 'i-lucide-sparkles',
    preview: { bg: '#0E0D0B', accent: '#D4AF37' },
    build: () => ({
      title: s('Khánh Linh & Đăng Khoa', 'Khánh Linh & Đăng Khoa'),
      bio: s('An evening to remember · Saturday, 19 December 2026', 'Một buổi tối thật đáng nhớ · Thứ Bảy, 19.12.2026'),
      avatarUrl: photo('photo-4'),
      themeConfig: {
        ...look({
          bg: '#0E0D0B', text: '#F2E6C9', accent: '#D4AF37', onAccent: '#0E0D0B', surface: '#1A1814', border: '#3B3323', radius: 12, shadow: 'none',
          nameFont: 'Great Vibes, cursive', nameWeight: '400', nameSize: '2.8rem', headingFont: 'Cinzel, serif', bodyFont: 'Montserrat, sans-serif',
          header: 'image-overlay', banner: photo('gala-3'), link: 'centered', social: 'outline', gap: 'relaxed',
        }),
        background: { type: 'gradient', color: '#0E0D0B', gradient: { angle: 180, from: '#1A1814', to: '#050505' } },
        music: { trackId: 'romantic-date' },
      },
      blocks: withIndex([
        { name: 'letter', data: { to: s('our dear guest', 'quý khách'), body: s('Candlelight, champagne and the people we love.\nJoin us for an evening of vows, dinner and dancing under the lights.', 'Ánh nến, ly vang và những người chúng mình thương.\nMời bạn đến với buổi tối của lời hứa, bữa tiệc và những điệu nhảy dưới ánh đèn.'), from: s('Khánh Linh & Đăng Khoa', 'Khánh Linh & Đăng Khoa'), sealed: true, paper: 'night', personal: true } },
        { name: 'birthday-countdown', data: { birthDate: '2026-12-19', theme: 'night', showAge: false, label: s('The evening begins in', 'Buổi tối bắt đầu sau'), mode: 'until', repeat: false } },
        { name: 'event', data: { name: s('Evening reception', 'Tiệc cưới tối'), date: '2026-12-19', startTime: '18:00', endTime: '22:30', venue: s('Gem Center, Grand Ballroom', 'Gem Center, sảnh Grand'), address: s('8 Nguyen Binh Khiem, District 1, Ho Chi Minh City', '8 Nguyễn Bỉnh Khiêm, Quận 1, TP. Hồ Chí Minh'), dressCode: s('Black tie · black, gold, champagne', 'Trang phục dạ tiệc · đen, vàng, sâm panh') } },
        { name: 'timeline', data: { title: s('The programme', 'Chương trình'), items: [
          step('18:00', s('Champagne welcome', 'Đón khách & champagne')),
          step('19:00', s('The ceremony', 'Nghi lễ')),
          step('19:30', s('Dinner is served', 'Khai tiệc')),
          step('21:00', s('First dance & party', 'Điệu nhảy đầu tiên & tiệc')),
        ] } },
        { name: 'image-album', data: { title: s('Moments', 'Khoảnh khắc'), images: album('photo-4', 'gala-3', 'event-4', 'gala-cover'), layout: 'grid' } },
        rsvp(s('Kindly reply', 'Xác nhận tham dự'), s('By 10 December, please.', 'Vui lòng phản hồi trước 10/12.'), s('Reply', 'Gửi phản hồi')),
        { name: 'vietqr', data: {} },
      ] as Blocks),
      room: weddingRoom('city', '#16140f', '#2b241a', '#d4af37', s('Khánh Linh & Đăng Khoa', 'Khánh Linh & Đăng Khoa'), ['photo-4', 'gala-3', 'event-4'], 'night', 'romantic-date'),
    }),
  },

  // ─── Bilingual: Vietnamese and English side by side ─────────────────
  {
    id: 'wedding-bilingual',
    name: 'Bilingual wedding invitation (Vietnamese–English)',
    category: 'events',
    description: 'Vietnamese and English side by side, for families and friends from both sides of the world: letter, events, RSVP and gifts.',
    icon: 'i-lucide-languages',
    preview: { bg: '#F6F1EA', accent: '#2F5D62' },
    build: () => ({
      title: s('Thu Hà & James', 'Thu Hà & James'),
      bio: s('Thứ Bảy, 23.01.2027 · Saturday, 23 January 2027 · Hội An', 'Thứ Bảy, 23.01.2027 · Saturday, 23 January 2027 · Hội An'),
      avatarUrl: photo('photo-1'),
      themeConfig: {
        ...look({
          bg: '#F6F1EA', text: '#23383B', accent: '#2F5D62', onAccent: '#FFFFFF', surface: '#FFFFFF', border: '#DCD3C4', radius: 14, shadow: 'none',
          nameFont: 'Tangerine, cursive', nameWeight: '700', nameSize: '3.2rem', headingFont: 'Playfair Display, serif', bodyFont: 'Lato, sans-serif',
          header: 'banner-circle', banner: photo('tour-cover'), link: 'centered', social: 'outline', gap: 'relaxed',
        }),
        music: { trackId: 'love-acoustic' },
      },
      blocks: withIndex([
        { name: 'letter', data: { to: s('our family and friends · gia đình và bạn bè', 'gia đình và bạn bè · our family and friends'), body: s('Chúng mình sắp về chung một nhà, và rất mong có bạn ở bên trong ngày đặc biệt này.\nWe’re getting married, and we would love you to be with us on our special day.\n\nĐồ ăn Việt, nhạc sống và những chiếc đèn lồng Hội An đang chờ bạn.\nVietnamese food, live music and the lanterns of Hội An are waiting for you.', 'Chúng mình sắp về chung một nhà, và rất mong có bạn ở bên trong ngày đặc biệt này.\nWe’re getting married, and we would love you to be with us on our special day.\n\nĐồ ăn Việt, nhạc sống và những chiếc đèn lồng Hội An đang chờ bạn.\nVietnamese food, live music and the lanterns of Hội An are waiting for you.'), from: s('Thu Hà & James', 'Thu Hà & James'), sealed: true, paper: 'cream', personal: true } },
        { name: 'birthday-countdown', data: { birthDate: '2027-01-23', theme: 'card', showAge: false, label: s('Còn lại · Days to go', 'Còn lại · Days to go'), mode: 'until', repeat: false } },
        { name: 'event', data: { name: s('Lễ gia tiên · Tea ceremony', 'Lễ gia tiên · Tea ceremony'), date: '2027-01-23', startTime: '09:00', endTime: '10:30', venue: s('Nhà gái · The bride’s family home', 'Nhà gái · The bride’s family home'), address: s('34 Tran Phu, Hoi An', '34 Trần Phú, Hội An'), note: s('Gia đình hai bên · Close family only', 'Gia đình hai bên · Close family only') } },
        { name: 'event', data: { name: s('Tiệc cưới · Wedding party', 'Tiệc cưới · Wedding party'), date: '2027-01-23', startTime: '17:30', endTime: '22:00', venue: s('Riverside Garden · Vườn ven sông', 'Vườn ven sông · Riverside Garden'), address: s('An Hoi Islet, Hoi An', 'Cồn An Hội, Hội An'), dressCode: s('Áo dài or smart casual · Áo dài hoặc lịch sự', 'Áo dài hoặc lịch sự · Áo dài or smart casual') } },
        { name: 'text', data: { title: s('Đi lại · Getting here', 'Đi lại · Getting here'), content: s('Bay đến Đà Nẵng (DAD), 45 phút đi xe đến Hội An.\nFly into Da Nang (DAD), then 45 minutes by car to Hội An.', 'Bay đến Đà Nẵng (DAD), 45 phút đi xe đến Hội An.\nFly into Da Nang (DAD), then 45 minutes by car to Hội An.'), align: 'center', style: 'card' } },
        { name: 'image-album', data: { title: s('Ảnh cưới · Our photos', 'Ảnh cưới · Our photos'), images: album('photo-1', 'photo-cover', 'garden-1', 'tour-1'), layout: 'masonry' } },
        rsvp(s('Bạn sẽ đến chứ? · Will you come?', 'Bạn sẽ đến chứ? · Will you come?'), s('Trước 01/01 · By 1 January', 'Trước 01/01 · By 1 January'), s('Gửi · Send', 'Gửi · Send')),
        { name: 'vietqr', data: {} },
      ] as Blocks),
      room: weddingRoom('sakura', '#f6f1ea', '#c8b08a', '#2f5d62', s('Thu Hà ♥ James', 'Thu Hà ♥ James'), ['photo-1', 'photo-cover', 'garden-1'], 'night', 'love-acoustic'),
    }),
  },

  // ─── Two families: one link, a tab for each side ────────────────────
  {
    id: 'wedding-two-families',
    name: 'Wedding invitation for both families',
    category: 'events',
    description: 'One link with a tab for the groom’s side and one for the bride’s: each family’s ceremony, party, time and address, with shared photos, RSVP and gifts.',
    icon: 'i-lucide-users-round',
    preview: { bg: '#FFF7F0', accent: '#C0392B' },
    build: () => ({
      title: s('Bảo Ngọc & Minh Quân', 'Bảo Ngọc & Minh Quân'),
      bio: s('26–27 December 2026 · the 18th–19th day of the 11th lunar month', '26–27.12.2026 · tức ngày 18–19 tháng 11 năm Bính Ngọ'),
      avatarUrl: photo('vn-wedding-avatar'),
      themeConfig: {
        ...look({
          bg: '#FFF7F0', text: '#4B1D17', accent: '#C0392B', onAccent: '#FFFFFF', surface: '#FFFFFF', border: '#F0D7C6', radius: 18, shadow: 'sm',
          nameFont: 'Great Vibes, cursive', nameWeight: '400', nameSize: '2.7rem', headingFont: 'Playfair Display, serif', bodyFont: 'Be Vietnam Pro, sans-serif',
          header: 'banner-circle', banner: photo('vn-wedding-cover'), link: 'centered', social: 'soft', gap: 'relaxed',
        }),
        background: { type: 'solid', color: '#FFF7F0', pattern: { id: 'dots', color: '#E8B4A0' } },
        music: { trackId: 'romantic-piano' },
      },
      blocks: withIndex([
        { name: 'letter', data: { to: s('our dear guest', 'quý khách'), body: s('Our two families are delighted to invite you to the wedding of Bảo Ngọc and Minh Quân.\nPick your family’s tab above for the time and the place.', 'Hai gia đình chúng tôi trân trọng kính mời quý khách đến dự lễ cưới của Bảo Ngọc và Minh Quân.\nQuý khách chọn thẻ Nhà trai hoặc Nhà gái ở trên để xem giờ và địa điểm.'), from: s('Bảo Ngọc & Minh Quân', 'Bảo Ngọc & Minh Quân'), sealed: true, paper: 'blush', personal: true } },
        { name: 'birthday-countdown', data: { birthDate: '2026-12-26', theme: 'card', showAge: false, label: s('Our wedding in', 'Còn bao lâu đến ngày vui'), mode: 'until', repeat: false } },

        // The bride's side (nhà gái, Nam Định)
        { name: 'text', side: 'bride', data: { title: s('The bride’s family', 'Nhà gái'), content: s('Mr Vũ Văn Thắng · Mrs Nguyễn Thị Huệ\nNam Định', 'Ông Vũ Văn Thắng · Bà Nguyễn Thị Huệ\nTP. Nam Định'), align: 'center', style: 'card' } },
        { name: 'event', side: 'bride', data: { name: s('Party at the bride’s family', 'Tiệc cưới nhà gái'), date: '2026-12-26', startTime: '11:00', endTime: '14:00', venue: s('Thiên Trường Restaurant', 'Nhà hàng Thiên Trường'), address: s('120 Tran Hung Dao, Nam Dinh', '120 Trần Hưng Đạo, TP. Nam Định') } },
        { name: 'event', side: 'bride', data: { name: s('The bride’s send-off (Lễ Vu Quy)', 'Lễ Vu Quy'), date: '2026-12-27', startTime: '07:00', endTime: '08:30', venue: s('The bride’s family home', 'Tư gia nhà gái'), address: s('15 Hang Thao, Nam Dinh', '15 Hàng Thao, TP. Nam Định') } },

        // The groom's side (nhà trai, Hà Nội)
        { name: 'text', side: 'groom', data: { title: s('The groom’s family', 'Nhà trai'), content: s('Mr Đỗ Minh Tiến · Mrs Phan Thị Lan\nHà Nội', 'Ông Đỗ Minh Tiến · Bà Phan Thị Lan\nHà Nội'), align: 'center', style: 'card' } },
        { name: 'event', side: 'groom', data: { name: s('Wedding ceremony (Lễ Thành Hôn)', 'Lễ Thành Hôn'), date: '2026-12-27', startTime: '10:30', endTime: '11:30', venue: s('The groom’s family home', 'Tư gia nhà trai'), address: s('27 Doi Can, Ba Dinh, Hanoi', '27 Đội Cấn, Ba Đình, Hà Nội') } },
        { name: 'event', side: 'groom', data: { name: s('Party at the groom’s family', 'Tiệc cưới nhà trai'), date: '2026-12-27', startTime: '12:00', endTime: '14:30', venue: s('Trống Đồng Palace, Hall A', 'Trống Đồng Palace, sảnh A'), address: s('65 Quan Thanh, Ba Dinh, Hanoi', '65 Quán Thánh, Ba Đình, Hà Nội'), note: s('Parking in the basement.', 'Gửi xe dưới tầng hầm.') } },

        { name: 'image-album', data: { title: s('Wedding photos', 'Album ảnh cưới'), images: album('vn-wedding-1', 'vn-wedding-3', 'vn-wedding-2', 'vn-wedding-4'), layout: 'grid' } },
        rsvp(s('Will you come?', 'Quý khách sẽ đến chung vui chứ?'), s('Tell us which family’s party you’ll join.', 'Quý khách cho biết sẽ dự tiệc nhà trai hay nhà gái nhé.'), s('Send my reply', 'Gửi xác nhận')),
        { name: 'vietqr', data: {} },
      ] as Blocks),
      room: weddingRoom('sakura', '#fff1e8', '#b5835a', '#c0392b', s('Bảo Ngọc ♥ Minh Quân', 'Bảo Ngọc ♥ Minh Quân'), ['vn-wedding-avatar', 'vn-wedding-1', 'vn-wedding-3'], 'day', 'romantic-piano'),
    }),
  },
]
