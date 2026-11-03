import { nanoid } from 'nanoid'
import type { MenuSection } from '~/types/bio'
import type { PageTemplate } from '../pageTemplates'
import { SAMPLE_PHONE, album, links, look, menu, noteCopy, photo, social, withIndex } from '../templateKit'
import { type Blocks, RSVP_FIELDS, booking, giftRoom, hours, loungeRoom, nightRoom, reviews, studioRoom } from '../pageTemplatesMore'

// Stays, travel, schools and communities. Sample text in English with its
// Vietnamese next to it: `s(en, vi)` returns the English and registers the
// translation.

export const PLACES_LEARNING_VI: Record<string, string> = {}
function s(en: string, vi: string) {
  PLACES_LEARNING_VI[en] = vi
  noteCopy(en, vi)
  return en
}

/** One step of a timeline */
const step = (date: string, title: string, text?: string, imageUrl?: string) => ({ id: nanoid(6), date, title, text, imageUrl })

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

export const PLACES_LEARNING_TEMPLATES: PageTemplate[] = [
  // ─── Hotel & travel ───────────────────────────────────────────────────
  {
    id: 'homestay',
    name: 'Pine forest homestay',
    category: 'hospitality',
    description: 'A cosy homestay in the hills: rooms with nightly prices, a day at the house, guest reviews and booking by date.',
    icon: 'i-lucide-trees',
    preview: { bg: '#F1ECE2', accent: '#3F5B45' },
    build: () => ({
      title: s('Mây Homestay · Đà Lạt', 'Mây Homestay · Đà Lạt'),
      bio: s('Five wooden rooms among the pines, ten minutes from the city. Wake up above the clouds.', 'Năm căn phòng gỗ giữa rừng thông, cách trung tâm mười phút. Thức dậy trên những tầng mây.'),
      avatarUrl: photo('stay-avatar'),
      themeConfig: {
        ...look({
          bg: '#F1ECE2', text: '#2E2A24', accent: '#3F5B45', onAccent: '#FFFFFF', surface: '#FFFDF8', border: '#E2D8C6', radius: 16, shadow: 'sm',
          nameFont: 'Playfair Display, serif', nameWeight: '600', nameSize: '2.2rem', headingFont: 'Playfair Display, serif', bodyFont: 'Lora, serif',
          header: 'banner-square', banner: photo('stay-cover'), avatar: 'rounded', link: 'centered', social: 'outline', gap: 'relaxed',
        }),
        background: { type: 'gradient', color: '#F1ECE2', gradient: { angle: 180, from: '#F1ECE2', to: '#E3EBE1' } },
        music: { trackId: 'love-acoustic' },
        roomButton: true,
      },
      blocks: withIndex([
        { name: 'text', data: { title: s('Slow mornings, wood fires', 'Sáng chậm rãi, tối bên bếp lửa'), content: s('Fresh coffee on the porch at sunrise, pine-scented air all day, a bonfire and hot pot when the evening turns cold. We keep it simple and quiet.', 'Cà phê nóng trên hiên lúc mặt trời lên, cả ngày thơm mùi lá thông, tối se lạnh thì đốt lửa trại và ăn lẩu. Ở đây đơn giản và yên tĩnh.'), align: 'center', style: 'card' } },
        { name: 'menu', data: { title: s('Our rooms', 'Các phòng'), currency: '₫', priceSuffix: s(' / night', ' / đêm'), layout: 'cards', sections: priced([
          { name: '', items: [
            [s('Pine view double', 'Phòng đôi view rừng thông'), '690,000', s('Queen bed, balcony over the forest, breakfast for two', 'Giường queen, ban công nhìn ra rừng, bữa sáng cho hai người'), undefined, 'stay-2'],
            [s('Cloud attic', 'Gác mái săn mây'), '890,000', s('Glass roof for stargazing, bathtub, heater', 'Mái kính ngắm sao, bồn tắm, máy sưởi'), s('Most loved', 'Được yêu thích'), 'stay-3'],
            [s('Twin room with garden', 'Phòng hai giường nhìn ra vườn'), '750,000', s('Two single beds, garden view, for friends travelling together', 'Hai giường đơn, nhìn ra vườn, hợp nhóm bạn đi cùng'), undefined, 'hotel-room-1'],
            [s('Family cabin', 'Nhà gỗ gia đình'), '1,450,000', s('Two bedrooms, kitchen and a garden, sleeps 5', 'Hai phòng ngủ, bếp và vườn, ở được 5 người'), undefined, 'stay-1'],
          ] },
        ]) } },
        { name: 'timeline', data: { title: s('A day at Mây', 'Một ngày ở Mây'), items: [
          step('05:30', s('Chase the clouds', 'Săn mây'), s('From the hill behind the house, with a blanket and hot tea.', 'Trên đồi sau nhà, có chăn và trà nóng.')),
          step('07:30', s('Breakfast on the porch', 'Ăn sáng trên hiên'), s('Bánh mì, eggs and Đà Lạt coffee.', 'Bánh mì, trứng ốp và cà phê Đà Lạt.')),
          step('16:00', s('Walk the pine trail', 'Dạo đường mòn rừng thông'), s('A 40-minute loop starts at our gate.', 'Cung đường 40 phút bắt đầu ngay cổng nhà.')),
          step('19:00', s('Bonfire & hot pot', 'Lửa trại & lẩu'), s('Bring a jacket. We bring the marshmallows.', 'Nhớ mang áo khoác. Kẹo nướng có sẵn.')),
        ] } },
        { name: 'testimonials', data: { title: s('Guests say', 'Khách nói gì'), items: reviews(
          [s('We woke up above the clouds. The attic room is pure magic.', 'Thức dậy là thấy biển mây. Căn gác mái đẹp như mơ.'), 'Thảo Nguyễn', s('Stayed in October', 'Ở vào tháng 10')],
          [s('Quiet, spotless and the hosts feel like family.', 'Yên tĩnh, sạch sẽ, chủ nhà thân như người nhà.'), 'Daniel K.', 'Google'],
        ) } },
        faq(s('Good to know', 'Thông tin cần biết'), s('🕑 Check-in from 14:00, check-out by 12:00\n🚐 Pick-up from Đà Lạt bus station: 100,000₫\n🛵 Motorbikes to rent: 120,000₫ a day\n🐾 Small pets welcome in the family cabin\n💳 A 30% deposit holds your room; free cancellation up to 7 days before', '🕑 Nhận phòng từ 14:00, trả phòng trước 12:00\n🚐 Đón ở bến xe Đà Lạt: 100.000₫\n🛵 Thuê xe máy: 120.000₫ một ngày\n🐾 Thú cưng nhỏ được ở cùng tại nhà gỗ gia đình\n💳 Cọc 30% để giữ phòng; huỷ miễn phí trước 7 ngày')),
        { name: 'form', data: { title: s('Check your dates', 'Kiểm tra phòng trống'), kind: 'stay', fields: { phone: true, email: false, date: true, time: false, guests: true, message: true, service: true, checkout: true }, submitLabel: s('Ask for a room', 'Hỏi phòng') } },
        { name: 'text', data: { title: s('Holding your room', 'Đặt cọc giữ phòng'), content: s('Once we confirm your dates, transfer the 30% deposit here with your name and dates in the note.', 'Khi Mây xác nhận ngày, bạn chuyển 30% tiền cọc qua mã dưới đây, ghi tên và ngày ở trong nội dung.'), align: 'center', style: 'plain' } },
        { name: 'vietqr', data: {} },
        { name: 'contact', data: { title: s('Finding us', 'Đường đến Mây'), address: s('12 Pine Hill Road, Ward 10, Đà Lạt', '12 Đồi Thông, Phường 10, Đà Lạt'), phone: SAMPLE_PHONE, quickBar: true } },
        { name: 'social', data: { links: social('facebook', 'instagram', 'zalo', 'googlemaps') } },
      ] as Blocks),
      room: { ...loungeRoom('#e9dcc6', '#8a6a4a', '#3f5b45', s('Book a room', 'Đặt phòng')), land: 'autumn' },
    }),
  },
  {
    id: 'villa-resort',
    name: 'Luxury pool villa',
    category: 'hospitality',
    description: 'Dark and elegant for private pool villas and resorts: villas with prices, the stay, a gallery and booking.',
    icon: 'i-lucide-waves',
    preview: { bg: '#0E2A35', accent: '#D9B779' },
    build: () => ({
      title: s('Azure Villas Phú Quốc', 'Azure Villas Phú Quốc'),
      bio: s('Private pool villas on the quiet north coast. Barefoot luxury, sunset included.', 'Biệt thự hồ bơi riêng ở bờ bắc yên tĩnh. Sang trọng chân trần, kèm hoàng hôn.'),
      avatarUrl: photo('villa-avatar'),
      themeConfig: {
        ...look({
          bg: '#0E2A35', text: '#F4EFE6', accent: '#D9B779', onAccent: '#0E2A35', surface: '#133643', border: '#2A5464', radius: 4, shadow: 'none',
          nameFont: 'Cormorant Garamond, serif', nameWeight: '500', nameSize: '2.6rem', tracking: '0.04em', headingFont: 'Cormorant Garamond, serif', bodyFont: 'Josefin Sans, sans-serif',
          header: 'image-overlay', link: 'vertical', social: 'outline', gap: 'relaxed',
        }),
        music: { trackId: 'romantic-piano' },
        roomButton: true,
      },
      blocks: withIndex([
        { name: 'text', data: { title: s('Where the island slows down', 'Nơi hòn đảo chậm lại'), content: s('Twelve villas, each with its own pool, a butler on call and the sea twenty steps away.', 'Mười hai căn biệt thự, mỗi căn một hồ bơi riêng, quản gia luôn sẵn sàng và biển chỉ cách hai mươi bước chân.'), align: 'center', style: 'plain' } },
        { name: 'menu', data: { title: s('The villas', 'Các biệt thự'), currency: '₫', priceSuffix: s(' / night', ' / đêm'), layout: 'cards', sections: priced([
          { name: '', items: [
            [s('Ocean Pool Villa', 'Biệt thự hồ bơi hướng biển'), '6,500,000', s('One bedroom, 40 m² pool, sunset terrace', 'Một phòng ngủ, hồ bơi 40 m², sân hiên ngắm hoàng hôn'), undefined, 'villa-1'],
            [s('Two-bedroom Garden Villa', 'Biệt thự vườn hai phòng ngủ'), '9,800,000', s('For families, tropical garden, outdoor shower', 'Cho gia đình, vườn nhiệt đới, sen tắm ngoài trời'), s('Family pick', 'Gia đình chọn'), 'villa-3'],
            [s('Beachfront Residence', 'Dinh thự sát biển'), '15,000,000', s('Three bedrooms, private chef, steps to the sand', 'Ba phòng ngủ, đầu bếp riêng, bước ra là cát'), undefined, 'villa-4'],
          ] },
        ]) } },
        { name: 'image-album', data: { title: s('The island, our way', 'Hòn đảo theo cách của chúng tôi'), images: album('villa-cover', 'villa-2', 'hotel-room-3'), layout: 'masonry' } },
        { name: 'timeline', data: { title: s('Your stay', 'Kỳ nghỉ của bạn'), items: [
          step(s('Arrival', 'Khi đến'), s('Private airport pick-up', 'Đón riêng tại sân bay'), s('Cold towels and coconut water on the way.', 'Khăn lạnh và nước dừa trên đường về.')),
          step(s('Evening', 'Buổi tối'), s('Sunset dinner on the sand', 'Bữa tối hoàng hôn trên cát'), s('Fresh seafood from the morning market.', 'Hải sản tươi từ chợ sáng.')),
          step(s('Every day', 'Mỗi ngày'), s('Floating breakfast', 'Bữa sáng trên hồ bơi'), s('Served in your pool, whenever you wake up.', 'Phục vụ ngay trong hồ bơi, lúc nào bạn thức dậy.')),
        ] } },
        { name: 'testimonials', data: { title: s('Notes from our guests', 'Khách gửi lời'), items: reviews(
          [s('The most peaceful five days of our lives. The floating breakfast is a dream.', 'Năm ngày bình yên nhất đời. Bữa sáng trên hồ bơi đẹp như mơ.'), 'Sophie & Marc', s('Honeymoon', 'Tuần trăng mật')],
          [s('Impeccable service, and the sunset from our pool was unreal.', 'Phục vụ hoàn hảo, hoàng hôn nhìn từ hồ bơi đẹp không thật.'), 'Minh Anh', 'Booking.com'],
        ) } },
        faq(s('Before you book', 'Trước khi đặt'), s('✈️ Airport transfer included for stays of 3 nights or more\n🕒 Check-in 15:00, late check-out on request\n👶 Cots, high chairs and a kids’ club for little ones\n💳 50% deposit to confirm; free cancellation up to 14 days before', '✈️ Miễn phí đưa đón sân bay khi ở từ 3 đêm\n🕒 Nhận phòng 15:00, trả phòng muộn theo yêu cầu\n👶 Có nôi, ghế ăn và câu lạc bộ cho bé\n💳 Cọc 50% để xác nhận; huỷ miễn phí trước 14 ngày')),
        { name: 'form', data: { title: s('Reserve your villa', 'Đặt biệt thự'), kind: 'stay', fields: { phone: true, email: true, date: true, time: false, guests: true, message: true, service: true, checkout: true }, submitLabel: s('Request availability', 'Gửi yêu cầu đặt') } },
        { name: 'vietqr', data: {} },
        { name: 'contact', data: { title: s('Concierge', 'Lễ tân'), address: s('Bãi Dài, Gành Dầu, Phú Quốc', 'Bãi Dài, Gành Dầu, Phú Quốc'), phone: SAMPLE_PHONE, quickBar: true } },
        { name: 'social', data: { links: social('instagram', 'facebook', 'whatsapp', 'googlemaps') } },
      ] as Blocks),
      room: { ...loungeRoom('#133643', '#c8b28a', '#d9b779', s('Reserve', 'Đặt phòng')), land: 'tropical' },
    }),
  },
  {
    id: 'hostel',
    name: 'Backpacker hostel',
    category: 'hospitality',
    description: 'Loud and friendly for hostels: beds with prices, what’s free, this week’s pub crawl and reviews from travellers.',
    icon: 'i-lucide-backpack',
    preview: { bg: '#FFE14D', accent: '#FF4F2E' },
    build: () => ({
      title: s('Bunk & Banh Mi Hostel', 'Bunk & Bánh Mì Hostel'),
      bio: s('Beds from 180k, free breakfast and the best rooftop in Hội An’s old town.', 'Giường từ 180k, ăn sáng miễn phí và sân thượng đẹp nhất phố cổ Hội An.'),
      avatarUrl: photo('hostel-avatar'),
      themeConfig: {
        ...look({
          bg: '#FFE14D', text: '#111111', accent: '#FF4F2E', onAccent: '#FFFFFF', surface: '#FFFFFF', border: '#111111', radius: 14, shadow: 'hard',
          nameFont: 'Space Grotesk, sans-serif', nameWeight: '700', nameSize: '2.2rem', tracking: '-0.02em', bodyFont: 'Space Grotesk, sans-serif',
          header: 'banner-square', banner: photo('hostel-cover'), avatar: 'square', link: 'horizontal-left', social: 'filled', titleAlign: 'left',
        }),
        background: { type: 'solid', color: '#FFE14D', pattern: { id: 'dots', color: '#111111' } },
        music: { trackId: 'party-celebration' },
        roomButton: true,
      },
      blocks: withIndex([
        { name: 'links', data: { title: s('Quick links', 'Đường tắt'), items: links(
          [s('Also on Hostelworld 🛏️', 'Có trên Hostelworld 🛏️'), 'https://www.hostelworld.com'],
          [s('Join the travellers’ WhatsApp group 💬', 'Vào nhóm WhatsApp của khách 💬'), 'https://chat.whatsapp.com'],
        ) } },
        { name: 'menu', data: { title: s('Beds & rooms', 'Giường & phòng'), currency: '₫', priceSuffix: s(' / night', ' / đêm'), layout: 'list', sections: priced([
          { name: '', items: [
            [s('6-bed mixed dorm', 'Phòng tập thể 6 giường'), '180,000', s('Curtains, lockers, reading light', 'Rèm riêng, tủ khoá, đèn đọc sách'), undefined, 'hostel-3'],
            [s('4-bed female dorm', 'Phòng nữ 4 giường'), '220,000', s('With its own bathroom', 'Có phòng tắm riêng'), s('Guests’ pick', 'Đắt khách'), 'hostel-1'],
            [s('Private double', 'Phòng đôi riêng'), '450,000', s('Balcony over the old town', 'Ban công nhìn ra phố cổ'), undefined, 'hotel-room-2'],
          ] },
        ]) } },
        { name: 'form', data: { title: s('Grab a bed', 'Giữ giường'), description: s('Pick your bed and dates; we reply on WhatsApp within the hour.', 'Chọn giường và ngày ở, tụi mình trả lời qua WhatsApp trong vòng một giờ.'), kind: 'stay', fields: { phone: true, email: false, date: true, time: false, guests: true, message: false, service: true, checkout: true }, submitLabel: s('Hold my bed', 'Giữ giường cho mình') } },
        { name: 'text', data: { title: s('Free, every day', 'Miễn phí mỗi ngày'), content: s('🍳 Breakfast till 10:00\n🚲 Bikes to borrow\n🍺 Free beer hour, 19:00–20:00\n🗺️ Walking tour of the old town', '🍳 Ăn sáng đến 10 giờ\n🚲 Mượn xe đạp\n🍺 Giờ bia miễn phí, 19:00–20:00\n🗺️ Tour đi bộ phố cổ'), align: 'left', style: 'card' } },
        { name: 'event', data: { name: s('Friday pub crawl', 'Pub crawl tối thứ Sáu'), date: '2026-11-13', startTime: '20:00', endTime: '01:00', venue: s('Meet on the rooftop', 'Tập trung trên sân thượng'), address: s('48 Tran Phu, Hội An', '48 Trần Phú, Hội An'), dressCode: s('Whatever you packed', 'Mặc gì cũng được'), note: s('Three bars, one free shot at each.', 'Ba quán bar, mỗi quán một shot miễn phí.') } },
        { name: 'image-album', data: { title: s('Life at the hostel', 'Ở hostel vui thế nào'), images: album('hostel-2', 'blog-diary-1', 'blog-diary-3', 'tour-2'), layout: 'grid' } },
        faq(s('House rules & help', 'Nội quy & tiện ích'), s('🧳 Free luggage storage before check-in and after check-out\n🌙 24-hour reception, late arrivals are fine\n🧺 Laundry 40,000₫ a load, ready the same day\n🎟️ We book buses to Huế, Đà Nẵng and Hà Giang at local prices\n🔞 Dorms are for guests 18 and over', '🧳 Gửi hành lý miễn phí trước giờ nhận và sau giờ trả phòng\n🌙 Lễ tân 24 giờ, đến khuya vẫn nhận phòng\n🧺 Giặt đồ 40.000₫ một mẻ, lấy trong ngày\n🎟️ Đặt giúp vé xe đi Huế, Đà Nẵng, Hà Giang theo giá gốc\n🔞 Phòng tập thể dành cho khách từ 18 tuổi')),
        { name: 'testimonials', data: { title: s('Backpackers say', 'Dân phượt nói gì'), items: reviews(
          [s('Came for two nights, stayed for a week. The rooftop crew is family now.', 'Định ở hai đêm, ở luôn một tuần. Hội sân thượng giờ thành gia đình.'), 'Jonas', 'Hostelworld'],
          [s('Cleanest dorm in Vietnam, and the free beer hour is dangerous.', 'Phòng tập thể sạch nhất Việt Nam, giờ bia miễn phí thì nguy hiểm thật.'), 'Linh', 'Google'],
        ) } },
        { name: 'contact', data: { title: s('Find us', 'Tìm chúng mình'), address: s('48 Tran Phu, Hội An', '48 Trần Phú, Hội An'), phone: SAMPLE_PHONE, quickBar: true } },
        { name: 'social', data: { links: social('instagram', 'tiktok', 'whatsapp', 'googlemaps') } },
      ] as Blocks),
      room: { ...nightRoom('#2a2433', '#ff4f2e', s('Book a bed', 'Đặt giường')), land: 'city' },
    }),
  },
  {
    id: 'tour-guide',
    name: 'Tours & travel guide',
    category: 'hospitality',
    description: 'For tour guides and small travel agencies: tours with prices, a day’s itinerary, photos, reviews and booking.',
    icon: 'i-lucide-map',
    preview: { bg: '#E9F5F1', accent: '#0F7B6C' },
    build: () => ({
      title: s('Hạ Long Explorer', 'Hạ Long Explorer'),
      bio: s('Small-group tours with a local guide: bays, rice terraces and the north’s best food.', 'Tour nhóm nhỏ cùng hướng dẫn viên địa phương: vịnh, ruộng bậc thang và đồ ăn ngon nhất miền Bắc.'),
      avatarUrl: photo('tour-avatar'),
      themeConfig: {
        ...look({
          bg: '#E9F5F1', text: '#0F2E2A', accent: '#0F7B6C', onAccent: '#FFFFFF', surface: '#FFFFFF', radius: 22, shadow: 'md',
          nameFont: 'Montserrat, sans-serif', nameWeight: '800', nameSize: '2.2rem', tracking: '-0.02em', bodyFont: 'Be Vietnam Pro, sans-serif',
          header: 'banner-circle', banner: photo('tour-cover'), link: 'horizontal-right', social: 'filled',
        }),
        background: { type: 'solid', color: '#E9F5F1', pattern: { id: 'waves', color: '#0F7B6C' } },
        music: { trackId: 'marimba-travel' },
        roomButton: true,
      },
      blocks: withIndex([
        { name: 'menu', data: { title: s('Our tours', 'Các tour'), currency: '₫', priceSuffix: s(' / person', ' / người'), layout: 'cards', sections: priced([
          { name: '', items: [
            [s('Hạ Long Bay day cruise', 'Du thuyền vịnh Hạ Long trong ngày'), '1,250,000', s('Kayaking, Titop island, seafood lunch on board', 'Chèo kayak, đảo Titop, ăn trưa hải sản trên tàu'), s('Best seller', 'Bán chạy'), 'tour-4'],
            [s('Ninh Bình by boat & bike', 'Ninh Bình bằng thuyền & xe đạp'), '990,000', s('Tràng An caves, Múa peak, rice fields', 'Hang Tràng An, núi Múa, cánh đồng lúa'), undefined, 'tour-3'],
            [s('Sa Pa trek, 2 days', 'Trekking Sa Pa 2 ngày'), '2,400,000', s('Homestay with a Hmong family, terraced valleys', 'Ngủ nhà người Mông, thung lũng ruộng bậc thang'), undefined, 'tour-1'],
            [s('Hội An lantern evening', 'Hội An đêm đèn lồng'), '650,000', s('Old town walk, river boat, street food tasting', 'Dạo phố cổ, thuyền thả đèn, ăn vặt đường phố'), s('New', 'Mới'), 'tour-2'],
          ] },
        ]) } },
        { name: 'timeline', data: { title: s('A day on Hạ Long Bay', 'Một ngày trên vịnh Hạ Long'), items: [
          step('08:00', s('Pick-up in Hanoi’s Old Quarter', 'Đón tại phố cổ Hà Nội')),
          step('12:00', s('Board the boat, lunch on deck', 'Lên tàu, ăn trưa trên boong'), s('Grilled squid, clams and fresh fruit.', 'Mực nướng, nghêu hấp và trái cây tươi.')),
          step('13:30', s('Kayak through Luồn cave', 'Chèo kayak qua hang Luồn')),
          step('15:00', s('Swim and climb Titop island', 'Tắm biển, leo đảo Titop'), s('The view from the top is the photo everyone wants.', 'Cảnh từ trên đỉnh là tấm ảnh ai cũng muốn có.')),
          step('19:30', s('Back in Hanoi', 'Về đến Hà Nội')),
        ] } },
        faq(s('What’s included', 'Giá tour đã gồm'), s('🚐 Hotel pick-up in Hanoi’s Old Quarter\n🍲 Lunch, water and entrance tickets\n🧑‍🦱 An English- or Vietnamese-speaking guide\n🛡️ Travel insurance\n👶 Children under 10 pay 70%; free cancellation up to 48 hours before', '🚐 Đón trả tại khách sạn khu phố cổ Hà Nội\n🍲 Bữa trưa, nước uống và vé tham quan\n🧑‍🦱 Hướng dẫn viên tiếng Anh hoặc tiếng Việt\n🛡️ Bảo hiểm du lịch\n👶 Trẻ dưới 10 tuổi tính 70%; huỷ miễn phí trước 48 giờ')),
        { name: 'testimonials', data: { title: s('Travellers say', 'Du khách nói gì'), items: reviews(
          [s('Huy knew every hidden corner. Best day of our trip to Vietnam.', 'Huy biết từng góc khuất. Ngày đẹp nhất chuyến đi Việt Nam của tụi mình.'), 'Emma & Tom', 'Tripadvisor'],
          [s('Small group, no rush, and the food stops were incredible.', 'Nhóm nhỏ, không vội vàng, mấy điểm ăn uống tuyệt vời.'), 'Phương Vy', 'Google'],
        ) } },
        { name: 'form', data: { title: s('Book a tour', 'Đặt tour'), kind: 'booking', fields: { phone: true, email: true, date: true, time: false, guests: true, message: true, service: true }, submitLabel: s('Check dates', 'Kiểm tra lịch') } },
        { name: 'text', data: { title: s('Confirm with a deposit', 'Xác nhận bằng tiền cọc'), content: s('A 30% deposit holds your seats. Put your name and tour date in the transfer note.', 'Cọc 30% để giữ chỗ. Ghi tên và ngày đi trong nội dung chuyển khoản.'), align: 'center', style: 'plain' } },
        { name: 'vietqr', data: {} },
        { name: 'contact', data: { title: s('Talk to us', 'Liên hệ'), address: s('22 Hàng Bè, Hoàn Kiếm, Hanoi', '22 Hàng Bè, Hoàn Kiếm, Hà Nội'), phone: SAMPLE_PHONE, quickBar: true } },
        { name: 'social', data: { links: social('facebook', 'instagram', 'whatsapp', 'zalo', 'googlemaps') } },
      ] as Blocks),
      room: { ...studioRoom('#dcefe9', '#a88b66', '#0f7b6c', s('Book a tour', 'Đặt tour')), land: 'island' },
    }),
  },

  // ─── Education ────────────────────────────────────────────────────────
  {
    id: 'language-center',
    name: 'English centre',
    category: 'education',
    description: 'For language centres: courses with fees, the road to IELTS, student results, an open day and a free placement test.',
    icon: 'i-lucide-languages',
    preview: { bg: '#F3F6FF', accent: '#2F5BEA' },
    build: () => ({
      title: s('Bright English', 'Bright English'),
      bio: s('Speak with confidence. Small classes, native and Vietnamese teachers, results you can see.', 'Tự tin nói tiếng Anh. Lớp nhỏ, giáo viên bản ngữ và Việt Nam, tiến bộ thấy rõ.'),
      avatarUrl: photo('lang-avatar'),
      themeConfig: {
        ...look({
          bg: '#F3F6FF', text: '#14213D', accent: '#2F5BEA', onAccent: '#FFFFFF', surface: '#FFFFFF', border: '#DCE4FA', radius: 18, shadow: 'sm',
          nameFont: 'Nunito, sans-serif', nameWeight: '800', nameSize: '2.3rem', bodyFont: 'Nunito, sans-serif',
          header: 'banner-circle', banner: photo('lang-cover'), link: 'centered', social: 'soft',
        }),
        background: { type: 'solid', color: '#F3F6FF', pattern: { id: 'grid', color: '#2F5BEA' } },
        music: { trackId: 'puzzle-casual' },
      },
      blocks: withIndex([
        { name: 'menu', data: { title: s('Courses', 'Khoá học'), currency: '₫', layout: 'list', sections: menu([
          { name: s('Kids & teens', 'Thiếu nhi & thiếu niên'), items: [
            [s('Kids English, ages 6–11', 'Tiếng Anh thiếu nhi 6–11 tuổi'), '1,800,000', s('Per month · games, songs and phonics', 'Mỗi tháng · học qua trò chơi, bài hát, phát âm')],
            [s('Cambridge KET/PET', 'Luyện thi Cambridge KET/PET'), '2,200,000', s('Per month · ages 11–15', 'Mỗi tháng · 11–15 tuổi')],
          ] },
          { name: s('Adults', 'Người lớn'), items: [
            [s('IELTS 6.5+ in 12 weeks', 'IELTS 6.5+ trong 12 tuần'), '7,900,000', s('Full course · score guarantee', 'Trọn khoá · cam kết đầu ra'), s('Most popular', 'Học nhiều nhất')],
            [s('English for work', 'Tiếng Anh công sở'), '2,400,000', s('Per month · evening classes', 'Mỗi tháng · lớp buổi tối')],
          ] },
        ]) } },
        { name: 'timeline', data: { title: s('Your road to IELTS 6.5', 'Lộ trình lên IELTS 6.5'), items: [
          step('01', s('Free placement test', 'Kiểm tra đầu vào miễn phí'), s('45 minutes, with a speaking check.', '45 phút, có phần kiểm tra nói.')),
          step('02', s('Foundation, 4 weeks', 'Nền tảng, 4 tuần'), s('Grammar and vocabulary that matter.', 'Ngữ pháp và từ vựng thật sự cần.')),
          step('03', s('Skills, 6 weeks', 'Kỹ năng, 6 tuần'), s('Listening, reading, writing, speaking.', 'Nghe, đọc, viết, nói.')),
          step('04', s('Mock tests, 2 weeks', 'Thi thử, 2 tuần'), s('Real exam conditions, marked feedback.', 'Như thi thật, có chấm và nhận xét.')),
        ] } },
        { name: 'testimonials', data: { title: s('Our students', 'Học viên của chúng tôi'), items: reviews(
          [s('From 5.0 to 7.0 in three months. The speaking club changed everything.', 'Từ 5.0 lên 7.0 sau ba tháng. Câu lạc bộ nói thay đổi tất cả.'), 'Ngọc Hân', 'IELTS 7.0'],
          [s('My son now begs to go to English class.', 'Con tôi giờ đòi đi học tiếng Anh.'), s('Mrs Lan', 'Chị Lan'), s('Parent', 'Phụ huynh')],
        ) } },
        { name: 'event', data: { name: s('Open day & free test', 'Ngày hội mở cửa & thi thử miễn phí'), date: '2026-11-21', startTime: '08:30', endTime: '11:30', venue: 'Bright English', address: s('15 Nguyen Trai, District 1, HCMC', '15 Nguyễn Trãi, Quận 1, TP.HCM'), note: s('Meet the teachers and get a study plan on the spot.', 'Gặp giáo viên và nhận lộ trình học ngay tại chỗ.') } },
        { name: 'image-album', data: { title: s('In class', 'Trong lớp học'), images: album('lang-1', 'lang-2', 'lang-3', 'tutor-1'), layout: 'grid' } },
        faq(s('Parents often ask', 'Phụ huynh hay hỏi'), s('👩‍🏫 8–12 students a class, always with a teaching assistant\n🔁 Missed a lesson? Join another class the same week for free\n📊 A progress report every month, by Zalo\n💸 Pay monthly or by course; 5% off when siblings join', '👩‍🏫 Lớp 8–12 học viên, luôn có trợ giảng\n🔁 Nghỉ buổi nào được học bù miễn phí ở lớp khác trong tuần\n📊 Báo cáo tiến bộ hằng tháng qua Zalo\n💸 Đóng theo tháng hoặc theo khoá; anh chị em học cùng giảm 5%')),
        { name: 'form', data: { title: s('Book a free placement test', 'Đăng ký kiểm tra đầu vào miễn phí'), kind: 'booking', fields: booking(true, true, false), submitLabel: s('Book my test', 'Đăng ký') } },
        { name: 'hours', data: { title: s('Office hours', 'Giờ làm việc'), days: hours('08:00', '21:00') } },
        { name: 'vietqr', data: {} },
        { name: 'contact', data: { title: s('Visit the centre', 'Ghé trung tâm'), address: s('15 Nguyen Trai, District 1, HCMC', '15 Nguyễn Trãi, Quận 1, TP.HCM'), phone: SAMPLE_PHONE, quickBar: true } },
        { name: 'social', data: { links: social('facebook', 'youtube', 'tiktok', 'zalo') } },
      ] as Blocks),
      room: { ...studioRoom('#e3eafc', '#b89b7a', '#2f5bea', s('Free test', 'Thi thử miễn phí')), land: 'island' },
    }),
  },
  {
    id: 'online-course',
    name: 'Online course',
    category: 'education',
    description: 'Dark and modern for course creators: the course for sale, what you’ll learn week by week, results and a sign-up deadline.',
    icon: 'i-lucide-graduation-cap',
    preview: { bg: '#0D0D14', accent: '#8B5CF6' },
    build: () => ({
      title: s('UI Design in 30 Days', 'Thiết kế UI trong 30 ngày'),
      bio: s('By Mai Trần, product designer. 2,000+ students. Learn by building real apps.', 'Cùng Mai Trần, product designer. Hơn 2.000 học viên. Học bằng cách làm app thật.'),
      avatarUrl: photo('course-avatar'),
      themeConfig: {
        ...look({
          bg: '#0D0D14', text: '#F2F2F7', accent: '#8B5CF6', onAccent: '#FFFFFF', surface: '#17171F', border: '#2A2A38', radius: 16, shadow: 'glow',
          nameFont: 'Space Grotesk, sans-serif', nameWeight: '700', nameSize: '2.3rem', tracking: '-0.03em', bodyFont: 'Inter Tight, sans-serif',
          header: 'left', avatar: 'rounded', link: 'horizontal-left', social: 'soft', titleAlign: 'left',
        }),
        background: { type: 'effect', effectId: 'aurora', color: '#0D0D14' },
        music: { trackId: 'game-background' },
      },
      blocks: withIndex([
        { name: 'birthday-countdown', data: { birthDate: '2026-12-01', theme: 'card', showAge: false, label: s('Early-bird price ends in', 'Giá ưu đãi kết thúc sau'), mode: 'until', repeat: false } },
        { name: 'products', data: { title: s('Enrol', 'Đăng ký học'), layout: 'list', ordering: true, askAddress: false, payment: 'transfer', items: [
          { id: nanoid(6), name: s('UI Design in 30 Days · full course', 'Thiết kế UI trong 30 ngày · trọn khoá'), price: 1290000, comparePrice: 2490000, imageUrl: photo('course-cover'), description: s('42 lessons, Figma files, lifetime access', '42 bài học, file Figma, học trọn đời'), tag: s('Early bird', 'Ưu đãi sớm') },
          { id: nanoid(6), name: s('Course + 1:1 portfolio review', 'Khoá học + review portfolio 1:1'), price: 2190000, imageUrl: photo('course-3'), description: s('Two 45-minute calls with Mai', 'Hai buổi gọi 45 phút cùng Mai') },
        ] } },
        { name: 'timeline', data: { title: s('What you’ll learn', 'Bạn sẽ học gì'), items: [
          step(s('Week 1', 'Tuần 1'), s('See like a designer', 'Nhìn như một designer'), s('Layout, spacing, type and colour.', 'Bố cục, khoảng cách, chữ và màu.')),
          step(s('Week 2', 'Tuần 2'), s('Figma, properly', 'Figma bài bản'), s('Auto layout, components, variables.', 'Auto layout, component, biến.')),
          step(s('Week 3', 'Tuần 3'), s('Design a real app', 'Thiết kế một app thật'), undefined, photo('course-2')),
          step(s('Week 4', 'Tuần 4'), s('Portfolio & job hunt', 'Portfolio & tìm việc'), s('Case study, CV and interview practice.', 'Case study, CV và luyện phỏng vấn.')),
        ] } },
        { name: 'testimonials', data: { title: s('Students now work at', 'Học viên giờ đang làm ở'), items: reviews(
          [s('I landed my first design job six weeks after finishing.', 'Mình có công việc thiết kế đầu tiên sáu tuần sau khi học xong.'), 'Quang Huy', 'UI designer, MoMo'],
          [s('Clear, practical and Mai actually answers every question.', 'Dễ hiểu, thực tế, và chị Mai trả lời mọi câu hỏi.'), 'Thu Trang', s('Career switcher', 'Chuyển ngành')],
        ) } },
        faq(s('Before you enrol', 'Trước khi đăng ký'), s('♾️ Lifetime access, including future updates\n💬 Feedback on your homework within 48 hours\n🖥️ Free Figma plan is enough to follow along\n🎓 A certificate when you finish the final project\n↩️ Full refund within 7 days if it’s not for you', '♾️ Học trọn đời, kể cả các bài cập nhật sau này\n💬 Nhận xét bài tập trong 48 giờ\n🖥️ Dùng Figma miễn phí là đủ để học\n🎓 Có chứng nhận khi hoàn thành dự án cuối khoá\n↩️ Hoàn tiền 100% trong 7 ngày nếu thấy không hợp')),
        { name: 'links', data: { title: s('Try before you buy', 'Học thử trước'), items: links(
          [s('Free lesson on YouTube ▶', 'Bài học miễn phí trên YouTube ▶'), 'https://youtube.com'],
          [s('Join the community on Discord', 'Vào cộng đồng trên Discord'), 'https://discord.com'],
        ) } },
        { name: 'form', data: { title: s('Questions about the course?', 'Thắc mắc về khoá học?'), kind: 'contact', fields: { phone: false, email: true, date: false, time: false, guests: false, message: true }, submitLabel: s('Ask Mai', 'Hỏi chị Mai') } },
        { name: 'vietqr', data: {} },
        { name: 'social', data: { links: social('youtube', 'tiktok', 'discord', 'facebook') } },
      ] as Blocks),
      room: { ...studioRoom('#1b1b26', '#3a3346', '#8b5cf6', s('Enrol now', 'Đăng ký ngay')), land: 'city' },
    }),
  },
  {
    id: 'kindergarten',
    name: 'Kindergarten',
    category: 'education',
    description: 'Soft and playful for preschools: a day at school, monthly fees, parents’ words, an open day and visit booking.',
    icon: 'i-lucide-baby',
    preview: { bg: '#FFF7EA', accent: '#FF8A3D' },
    build: () => ({
      title: s('Little Sprouts Preschool', 'Mầm Non Hạt Mầm'),
      bio: s('Where little ones learn through play, art and lots of fresh air. Ages 18 months to 6.', 'Nơi các bé học qua vui chơi, vẽ tranh và thật nhiều nắng gió. Từ 18 tháng đến 6 tuổi.'),
      avatarUrl: photo('kinder-avatar'),
      themeConfig: {
        ...look({
          bg: '#FFF7EA', text: '#3B3355', accent: '#FF8A3D', onAccent: '#FFFFFF', surface: '#FFFFFF', radius: 28, shadow: 'md',
          nameFont: 'Comfortaa, sans-serif', nameWeight: '700', nameSize: '2.1rem', headingFont: 'Comfortaa, sans-serif', bodyFont: 'Nunito, sans-serif',
          header: 'banner-circle', banner: photo('kinder-cover'), link: 'centered', social: 'filled', gap: 'relaxed',
        }),
        background: { type: 'gradient', color: '#FFF7EA', gradient: { style: 'mesh', from: '#FFE1C2', via: '#FFF7EA', to: '#D6F0FF' } },
        music: { trackId: 'playful-kids' },
      },
      blocks: withIndex([
        { name: 'text', data: { title: s('Learning through play 🌱', 'Học mà chơi, chơi mà học 🌱'), content: s('Small classes of 15, two teachers in every room, organic lunches cooked in our own kitchen and a garden to get muddy in.', 'Lớp nhỏ 15 bé, mỗi lớp hai cô, bữa trưa hữu cơ nấu tại bếp trường và một khu vườn cho các bé nghịch đất.'), align: 'center', style: 'card' } },
        { name: 'timeline', data: { title: s('A day at Little Sprouts', 'Một ngày ở Hạt Mầm'), items: [
          step('07:00', s('Hello & breakfast', 'Đón bé & ăn sáng')),
          step('08:30', s('Circle time & songs', 'Vòng tròn buổi sáng & hát')),
          step('09:30', s('Art, blocks or garden', 'Vẽ, xếp hình hoặc làm vườn'), undefined, photo('kinder-1')),
          step('11:00', s('Lunch & nap', 'Ăn trưa & ngủ trưa')),
          step('15:00', s('Outdoor play', 'Chơi ngoài trời'), s('Rain or shine, in the right boots.', 'Nắng hay mưa, có ủng là chơi.')),
          step('16:30', s('Home time', 'Ba mẹ đón')),
        ] } },
        { name: 'menu', data: { title: s('Fees', 'Học phí'), currency: '₫', priceSuffix: s(' / month', ' / tháng'), layout: 'list', sections: menu([
          { name: '', items: [
            [s('Half day (7:00–11:30)', 'Bán trú buổi sáng (7:00–11:30)'), '3,200,000', s('Breakfast and snack included', 'Đã gồm ăn sáng và ăn nhẹ')],
            [s('Full day (7:00–16:30)', 'Cả ngày (7:00–16:30)'), '4,800,000', s('Three meals, nap and outdoor play', 'Ba bữa ăn, ngủ trưa và chơi ngoài trời'), s('Most families', 'Đa số chọn')],
            [s('English & music add-on', 'Thêm tiếng Anh & âm nhạc'), '600,000', s('Twice a week', 'Hai buổi mỗi tuần')],
          ] },
        ]) } },
        { name: 'image-album', data: { title: s('Our little artists', 'Các hoạ sĩ nhí'), images: album('kinder-2', 'kinder-3', 'kids-2'), layout: 'grid' } },
        { name: 'testimonials', data: { title: s('Parents say', 'Phụ huynh chia sẻ'), items: reviews(
          [s('My daughter cried when we had to leave on the first day, because she wanted to stay.', 'Ngày đầu con gái mình khóc vì… không muốn về.'), s('Mrs Hương', 'Chị Hương'), s('Mum of Bông, 4', 'Mẹ bé Bông, 4 tuổi')],
          [s('Warm teachers and real food. We see the difference at home.', 'Cô giáo ấm áp, đồ ăn tử tế. Về nhà thấy con khác hẳn.'), s('Mr Tuấn', 'Anh Tuấn'), s('Dad of Bin, 3', 'Bố bé Bin, 3 tuổi')],
        ) } },
        { name: 'event', data: { name: s('Open day for families', 'Ngày hội tham quan cho gia đình'), date: '2026-11-22', startTime: '08:30', endTime: '11:00', venue: 'Little Sprouts', address: s('7 Thảo Điền, Thủ Đức, HCMC', '7 Thảo Điền, Thủ Đức, TP.HCM'), note: s('Kids welcome: there will be painting and pancakes.', 'Các bé đi cùng nhé: có vẽ tranh và bánh kếp.') } },
        faq(s('What parents ask us', 'Ba mẹ thường hỏi'), s('📹 Live classroom cameras for parents, on your phone\n🍲 Weekly menus sent every Sunday; allergies always respected\n🧸 A free trial week before you decide\n🚌 School bus within 3 km of Thảo Điền', '📹 Camera lớp học xem trực tiếp trên điện thoại\n🍲 Thực đơn tuần gửi mỗi Chủ nhật; luôn lưu ý bé dị ứng\n🧸 Học thử miễn phí một tuần trước khi quyết định\n🚌 Xe đưa đón trong bán kính 3 km quanh Thảo Điền')),
        { name: 'form', data: { title: s('Book a school visit', 'Đặt lịch tham quan trường'), kind: 'booking', fields: booking(true, true, false), submitLabel: s('Book a visit', 'Đặt lịch') } },
        { name: 'hours', data: { title: s('School hours', 'Giờ đón trẻ'), days: hours('07:00', '17:00', [0, 6]), note: s('Saturday morning care on request.', 'Sáng thứ Bảy nhận trông bé theo đăng ký.') } },
        { name: 'contact', data: { title: s('Our school', 'Trường của chúng mình'), address: s('7 Thảo Điền, Thủ Đức, HCMC', '7 Thảo Điền, Thủ Đức, TP.HCM'), phone: SAMPLE_PHONE, quickBar: true } },
        { name: 'social', data: { links: social('facebook', 'zalo', 'youtube') } },
      ] as Blocks),
      room: { ...loungeRoom('#ffe9cf', '#e8c4a0', '#ff8a3d', s('Book a school visit', 'Đặt lịch tham quan trường')), land: 'fairy' },
    }),
  },
  {
    id: 'music-school',
    name: 'Music school',
    category: 'education',
    description: 'Ivory and piano red, on staff-line paper: lessons with prices, the winter recital, students’ photos and a free trial.',
    icon: 'i-lucide-music',
    preview: { bg: '#FAF6F0', accent: '#B3261E' },
    build: () => ({
      title: s('Allegro Music School', 'Trường nhạc Allegro'),
      bio: s('Piano, guitar and voice for ages 5 to 75. Your first lesson is on us.', 'Piano, guitar và thanh nhạc cho mọi lứa tuổi từ 5 đến 75. Buổi đầu tiên miễn phí.'),
      avatarUrl: photo('music-avatar'),
      themeConfig: {
        ...look({
          bg: '#FAF6F0', text: '#1B1B1B', accent: '#B3261E', onAccent: '#FFFFFF', surface: '#FFFFFF', border: '#EADFD2', radius: 10, shadow: 'sm',
          nameFont: 'Playfair Display, serif', nameWeight: '700', nameSize: '2.3rem', headingFont: 'Playfair Display, serif', bodyFont: 'Lora, serif',
          header: 'banner-square', banner: photo('music-cover'), avatar: 'rounded', link: 'vertical', social: 'outline',
        }),
        background: { type: 'solid', color: '#FAF6F0', pattern: { id: 'lines', color: '#1B1B1B' } },
        music: { trackId: 'romantic-piano' },
        roomButton: true,
      },
      blocks: withIndex([
        { name: 'menu', data: { title: s('Lessons', 'Khoá học'), currency: '₫', priceSuffix: s(' / 8 lessons', ' / 8 buổi'), layout: 'cards', sections: priced([
          { name: '', items: [
            [s('Piano for kids', 'Piano thiếu nhi'), '1,600,000', s('Ages 5–12 · 45 minutes, one to one', '5–12 tuổi · 45 phút, học kèm 1-1'), s('Most booked', 'Đông học viên'), 'music-1'],
            [s('Guitar from zero', 'Guitar cho người mới'), '1,400,000', s('Acoustic, chords and your first songs', 'Acoustic, hợp âm và những bài hát đầu tiên'), undefined, 'music-2'],
            [s('Voice & singing', 'Thanh nhạc'), '1,800,000', s('Breathing, pitch and stage confidence', 'Hơi thở, cao độ và tự tin trên sân khấu')],
          ] },
        ]) } },
        { name: 'event', data: { name: s('Winter recital', 'Đêm nhạc mùa đông'), date: '2026-12-20', startTime: '18:30', endTime: '20:30', venue: s('Allegro concert hall', 'Phòng hoà nhạc Allegro'), address: s('9 Phan Đình Phùng, Ba Đình, Hanoi', '9 Phan Đình Phùng, Ba Đình, Hà Nội'), dressCode: s('Something festive', 'Trang phục ấm áp, rực rỡ'), note: s('Our students play Chopin, the Beatles and Trịnh Công Sơn. Free entry.', 'Học viên biểu diễn Chopin, The Beatles và Trịnh Công Sơn. Vào cửa tự do.') } },
        { name: 'timeline', data: { title: s('Your first month', 'Tháng đầu tiên'), items: [
          step(s('Lesson 1', 'Buổi 1'), s('Free trial & level check', 'Học thử miễn phí & xếp trình độ')),
          step(s('Week 2', 'Tuần 2'), s('Your first full song', 'Bài hát trọn vẹn đầu tiên'), undefined, photo('music-3')),
          step(s('Week 4', 'Tuần 4'), s('Play for family on video', 'Quay video đàn tặng gia đình'), s('We film it for you.', 'Trung tâm quay giúp bạn.')),
        ] } },
        { name: 'testimonials', data: { title: s('Students & parents', 'Học viên & phụ huynh'), items: reviews(
          [s('I started piano at 52. Six months later I played at my daughter’s wedding.', 'Tôi bắt đầu học piano năm 52 tuổi. Sáu tháng sau tôi đàn trong đám cưới con gái.'), s('Mr Bình', 'Chú Bình'), s('Piano student', 'Học viên piano')],
          [s('Patient teachers, and my son practises without being asked.', 'Thầy cô kiên nhẫn, con tôi tự giác tập đàn.'), s('Mrs Mai', 'Chị Mai'), s('Parent', 'Phụ huynh')],
        ) } },
        faq(s('Good to know', 'Thông tin cần biết'), s('🎹 No piano at home? Practise in our rooms for free, any afternoon\n🔁 Lessons missed with 24 hours’ notice are moved, not lost\n🏅 ABRSM and Trinity exam preparation for older students\n👨‍👩‍👧 Parents can sit in on the first lesson', '🎹 Chưa có đàn ở nhà? Tập miễn phí tại phòng tập mọi buổi chiều\n🔁 Báo nghỉ trước 24 giờ được dời buổi, không mất buổi\n🏅 Luyện thi chứng chỉ ABRSM, Trinity cho học viên lớn\n👨‍👩‍👧 Phụ huynh được dự buổi học đầu tiên')),
        { name: 'form', data: { title: s('Book a free trial lesson', 'Đăng ký học thử miễn phí'), kind: 'booking', fields: booking(true, true, false), submitLabel: s('Book my trial', 'Đăng ký học thử') } },
        { name: 'hours', data: { title: s('School hours', 'Giờ học'), days: hours('09:00', '21:00', [1]) } },
        { name: 'vietqr', data: {} },
        { name: 'contact', data: { title: s('The school', 'Trường nhạc'), address: s('9 Phan Đình Phùng, Ba Đình, Hanoi', '9 Phan Đình Phùng, Ba Đình, Hà Nội'), phone: SAMPLE_PHONE, quickBar: true } },
        { name: 'social', data: { links: social('youtube', 'facebook', 'tiktok') } },
      ] as Blocks),
      room: { ...studioRoom('#f3ebe1', '#6b4a3a', '#b3261e', s('Free trial', 'Học thử miễn phí')), land: 'sakura' },
    }),
  },

  // ─── Community ────────────────────────────────────────────────────────
  {
    id: 'pet-rescue',
    name: 'Pet rescue & adoption',
    category: 'community',
    description: 'Warm and hopeful for animal rescues: pets looking for a home, how adoption works, donations by QR and an adoption form.',
    icon: 'i-lucide-paw-print',
    preview: { bg: '#FFF3E8', accent: '#F2762E' },
    build: () => ({
      title: s('Paws Rescue Saigon', 'Paws Rescue Sài Gòn'),
      bio: s('We rescue, heal and rehome street dogs and cats. 640 found a family so far.', 'Cứu hộ, chữa trị và tìm nhà cho chó mèo đường phố. Đã có 640 bé tìm được gia đình.'),
      avatarUrl: photo('pets-avatar'),
      themeConfig: {
        ...look({
          bg: '#FFF3E8', text: '#3A2416', accent: '#F2762E', onAccent: '#FFFFFF', surface: '#FFFFFF', radius: 22, shadow: 'sm',
          nameFont: 'Lobster, cursive', nameWeight: '400', nameSize: '2.5rem', headingFont: 'Quicksand, sans-serif', bodyFont: 'Quicksand, sans-serif',
          header: 'banner-circle', banner: photo('pets-cover'), link: 'centered', social: 'filled', gap: 'relaxed',
        }),
        background: { type: 'solid', color: '#FFF3E8', pattern: { id: 'dots', color: '#F2762E' } },
        music: { trackId: 'puzzle-casual' },
        roomButton: true,
      },
      blocks: withIndex([
        { name: 'menu', data: { title: s('Looking for a home', 'Đang tìm nhà'), currency: '', layout: 'cards', sections: priced([
          { name: '', items: [
            [s('Mít · 2-year-old dog', 'Mít · chó 2 tuổi'), '', s('Gentle, loves kids, vaccinated and neutered', 'Hiền, thích trẻ con, đã tiêm và triệt sản'), s('Ready now', 'Sẵn sàng'), 'pets-4'],
            [s('Mây · 1-year-old cat', 'Mây · mèo 1 tuổi'), '', s('Grey tabby, chatty, sleeps on your laptop', 'Mèo mướp xám, nói nhiều, thích nằm lên laptop'), undefined, 'pets-1'],
            [s('Bơ & Sữa · kittens', 'Bơ & Sữa · mèo con'), '', s('Two sisters, adopted together', 'Hai chị em, nhận nuôi cùng nhau'), s('Pair', 'Đi theo cặp'), 'pets-2'],
          ] },
        ]) } },
        { name: 'timeline', data: { title: s('How adoption works', 'Quy trình nhận nuôi'), items: [
          step('01', s('Fill in the form', 'Điền đơn nhận nuôi'), s('Tell us about your home and routine.', 'Kể về nhà và lịch sinh hoạt của bạn.')),
          step('02', s('Meet your match', 'Gặp bé'), s('Visit the shelter, take your time.', 'Đến trạm, cứ từ từ làm quen.')),
          step('03', s('Home visit', 'Thăm nhà'), s('A friendly check, not an exam.', 'Ghé thăm thân thiện, không phải kiểm tra.')),
          step('04', s('Welcome home', 'Về nhà mới'), s('We stay in touch for the first months.', 'Trạm vẫn theo dõi trong những tháng đầu.'), photo('pets-3')),
        ] } },
        faq(s('Adoption, honestly', 'Nhận nuôi, nói thật'), s('💉 Every pet is vaccinated, dewormed and neutered before going home\n💚 Adoption is free; a 500,000₫ donation is welcome but not required\n🏠 Renting? Fine, as long as your landlord agrees\n🔁 If it doesn’t work out, bring them back to us, never to the street', '💉 Bé nào về nhà cũng đã tiêm phòng, tẩy giun và triệt sản\n💚 Nhận nuôi miễn phí; ủng hộ 500.000₫ thì trạm rất cảm ơn, không bắt buộc\n🏠 Ở nhà thuê vẫn được, miễn chủ nhà đồng ý\n🔁 Nếu không hợp, hãy mang bé về trạm, đừng bỏ ra đường')),
        { name: 'form', data: { title: s('Adoption form', 'Đơn nhận nuôi'), description: s('Pick a friend and a day to visit; we’ll call to confirm.', 'Chọn bé và ngày bạn muốn ghé, trạm sẽ gọi xác nhận.'), kind: 'booking', serviceLabel: s('Which friend would you like to meet?', 'Bạn muốn gặp bé nào?'), fields: { phone: true, email: true, date: true, time: false, guests: false, message: true, service: true }, submitLabel: s('Send my application', 'Gửi đơn') } },
        { name: 'text', data: { title: s('Can’t adopt? You can still help', 'Chưa nhận nuôi được? Vẫn giúp được'), content: s('200,000₫ feeds a dog for a month. 500,000₫ pays for a sterilisation. Every transfer is posted in our monthly report.', '200.000₫ nuôi một bé trong một tháng. 500.000₫ cho một ca triệt sản. Mọi khoản ủng hộ đều được công khai trong báo cáo hằng tháng.'), align: 'center', style: 'card' } },
        { name: 'vietqr', data: {} },
        { name: 'testimonials', data: { title: s('Happy endings', 'Những cái kết đẹp'), items: reviews(
          [s('Mít sleeps at the foot of our bed now. Best decision we ever made.', 'Giờ Mít ngủ dưới chân giường tụi mình. Quyết định đúng nhất từ trước tới nay.'), s('The Nguyễn family', 'Gia đình anh Nguyên'), s('Adopted in 2025', 'Nhận nuôi năm 2025')],
        ) } },
        { name: 'hours', data: { title: s('Visiting the shelter', 'Giờ thăm trạm'), days: hours('09:00', '17:00', [1, 2, 3, 4, 5]), note: s('Weekdays by appointment; message us first.', 'Ngày thường theo hẹn, nhắn trạm trước nhé.') } },
        { name: 'contact', data: { title: s('The shelter', 'Trạm cứu hộ'), address: s('120/4 Nguyễn Xiển, Thủ Đức, HCMC', '120/4 Nguyễn Xiển, Thủ Đức, TP.HCM'), phone: SAMPLE_PHONE, quickBar: true } },
        { name: 'social', data: { links: social('facebook', 'instagram', 'tiktok') } },
      ] as Blocks),
      room: { ...loungeRoom('#ffe8d4', '#c9a27e', '#f2762e', s('Adopt', 'Nhận nuôi')), land: 'fairy' },
    }),
  },
  {
    id: 'running-club',
    name: 'Running club',
    category: 'community',
    description: 'Neon on black for running and sports clubs: the next group run, race countdown, weekly schedule and sign-ups.',
    icon: 'i-lucide-footprints',
    preview: { bg: '#0F1115', accent: '#C6FF3D' },
    build: () => ({
      title: s('Sunrise Runners Hà Nội', 'Sunrise Runners Hà Nội'),
      bio: s('Free group runs around West Lake, every pace welcome. See you at 5:30.', 'Chạy nhóm miễn phí quanh Hồ Tây, tốc độ nào cũng chào đón. Hẹn 5 giờ 30.'),
      avatarUrl: photo('run-avatar'),
      themeConfig: {
        ...look({
          bg: '#0F1115', text: '#F5F7FA', accent: '#C6FF3D', onAccent: '#0F1115', surface: '#1A1D23', border: '#2A2F38', radius: 12, shadow: 'glow',
          nameFont: 'Inter Tight, sans-serif', nameWeight: '800', nameSize: '2.4rem', tracking: '-0.03em', bodyFont: 'Inter Tight, sans-serif',
          header: 'image-overlay', link: 'horizontal-left', social: 'outline', titleAlign: 'left',
        }),
        background: { type: 'solid', color: '#0F1115', pattern: { id: 'diagonal', color: '#C6FF3D' } },
        music: { trackId: 'happy-runner' },
      },
      blocks: withIndex([
        { name: 'event', data: { name: s('Sunday long run · 15 km', 'Chạy dài Chủ nhật · 15 km'), date: '2026-11-08', startTime: '05:30', endTime: '07:30', venue: s('West Lake, Thanh Niên Road', 'Hồ Tây, đường Thanh Niên'), address: s('Thanh Niên, Ba Đình, Hanoi', 'Đường Thanh Niên, Ba Đình, Hà Nội'), note: s('Three pace groups: 5:30, 6:15 and 7:00 per km.', 'Ba nhóm tốc độ: 5:30, 6:15 và 7:00 mỗi km.') } },
        { name: 'birthday-countdown', data: { birthDate: '2026-12-13', theme: 'card', showAge: false, label: s('Hanoi Marathon in', 'Còn đến Hanoi Marathon'), mode: 'until', repeat: false } },
        { name: 'timeline', data: { title: s('Every week', 'Lịch hằng tuần'), items: [
          step(s('Tue 05:30', 'Thứ 3 · 05:30'), s('Tempo run', 'Chạy tempo'), s('8 km around Trúc Bạch.', '8 km quanh hồ Trúc Bạch.')),
          step(s('Thu 18:00', 'Thứ 5 · 18:00'), s('Track intervals', 'Interval trên sân'), s('Hàng Đẫy stadium.', 'Sân vận động Hàng Đẫy.')),
          step(s('Sun 05:30', 'CN · 05:30'), s('Long run & phở', 'Chạy dài & phở'), s('Coffee and phở together after the run.', 'Chạy xong cùng đi ăn phở, uống cà phê.')),
        ] } },
        faq(s('New here?', 'Lần đầu tham gia?'), s('🏃 All paces welcome: we split into three groups and nobody runs alone\n🎒 Free bag drop at the meeting point\n💧 Water and electrolytes at the 8 km mark\n🆓 Group runs are free; just say you’re coming', '🏃 Tốc độ nào cũng được: chia ba nhóm, không ai chạy một mình\n🎒 Gửi đồ miễn phí tại điểm tập trung\n💧 Có nước và điện giải ở km thứ 8\n🆓 Chạy nhóm miễn phí, chỉ cần báo là sẽ đến')),
        { name: 'form', data: { title: s('Join Sunday’s run', 'Đăng ký chạy Chủ nhật'), kind: 'rsvp', fields: { ...RSVP_FIELDS, guests: false, message: false }, submitLabel: s('I’m in', 'Mình tham gia') } },
        { name: 'image-album', data: { title: s('Mornings with the club', 'Những buổi sáng cùng CLB'), images: album('run-2', 'run-3', 'run-4', 'run-cover'), layout: 'grid' } },
        { name: 'products', data: { title: s('Club kit', 'Đồ CLB'), layout: 'grid', ordering: true, askAddress: false, payment: 'cod', items: [
          { id: nanoid(6), name: s('Sunrise club tee', 'Áo CLB Sunrise'), price: 199000, imageUrl: photo('run-1'), description: s('Quick-dry, reflective logo. Pick it up at the Sunday run.', 'Vải khô nhanh, logo phản quang. Nhận áo ở buổi chạy Chủ nhật.'), tag: s('Members', 'Thành viên'), options: [
            { id: nanoid(6), name: s('Size', 'Size'), values: ['S', 'M', 'L', 'XL'].map(label => ({ id: nanoid(6), label })) },
            { id: nanoid(6), name: s('Colour', 'Màu'), values: [{ id: nanoid(6), label: s('Lime', 'Xanh chanh'), color: '#c6ff3d' }, { id: nanoid(6), label: s('Black', 'Đen'), color: '#111111' }] },
          ] },
        ] } },
        { name: 'links', data: { title: s('Club links', 'Liên kết CLB'), items: links(
          [s('Strava club 🧡', 'Club trên Strava 🧡'), 'https://www.strava.com'],
          [s('16-week marathon plan', 'Giáo án marathon 16 tuần'), 'https://drive.google.com'],
        ) } },
        { name: 'social', data: { links: social('facebook', 'instagram', 'tiktok') } },
      ] as Blocks),
      room: { ...nightRoom('#14171d', '#c6ff3d', s('Join the run', 'Chạy cùng nhau')), land: 'city' },
    }),
  },
  {
    id: 'class-reunion',
    name: 'Class reunion',
    category: 'community',
    description: 'A reunion page on notebook paper: an invitation letter, the countdown, the evening, then-and-now memories, RSVP and the class fund.',
    icon: 'i-lucide-school',
    preview: { bg: '#F6F0E3', accent: '#1E6B52' },
    build: () => ({
      title: s('Class 12A1 · 10 years on', 'Họp lớp 12A1 · 10 năm'),
      bio: s('Chu Văn An High School, class of 2016. Same faces, more stories.', 'Trường THPT Chu Văn An, khoá 2013–2016. Vẫn những gương mặt ấy, thêm nhiều chuyện để kể.'),
      avatarUrl: photo('reunion-avatar'),
      themeConfig: {
        ...look({
          bg: '#F6F0E3', text: '#263238', accent: '#1E6B52', onAccent: '#FFFFFF', surface: '#FFFFFF', border: '#E3D9C4', radius: 6, shadow: 'sm',
          nameFont: 'Dancing Script, cursive', nameWeight: '700', nameSize: '2.6rem', headingFont: 'Dancing Script, cursive', bodyFont: 'Lora, serif',
          header: 'banner-circle', banner: photo('reunion-cover'), link: 'centered', social: 'soft', gap: 'relaxed',
        }),
        background: { type: 'solid', color: '#F6F0E3', pattern: { id: 'lines', color: '#1E6B52' } },
        music: { trackId: 'love-acoustic' },
        roomButton: true,
      },
      blocks: withIndex([
        { name: 'letter', data: { cover: s('An invitation from 12A1', 'Thư mời họp lớp 12A1'), to: s('our classmate', 'bạn cùng lớp'), body: s('Ten years since the last bell, the last photo on the school steps and the promise to stay in touch.\nLet’s keep it. One evening, all of us, the old songs and too many stories.\nTeacher Hoa is coming too.', 'Mười năm kể từ tiếng trống cuối cùng, tấm ảnh trên bậc thềm trường và lời hẹn sẽ giữ liên lạc.\nGiờ là lúc giữ lời. Một buổi tối, đủ cả lớp, những bài hát cũ và thật nhiều chuyện để kể.\nCô Hoa chủ nhiệm cũng sẽ đến.'), from: s('The class committee', 'Ban liên lạc lớp'), sealed: true, paper: 'cream', personal: true } },
        { name: 'birthday-countdown', data: { birthDate: '2026-12-27', theme: 'card', showAge: false, label: s('We meet again in', 'Còn bao lâu nữa gặp lại'), mode: 'until', repeat: false } },
        { name: 'event', data: { name: s('Reunion dinner', 'Tiệc họp lớp'), date: '2026-12-27', startTime: '18:00', endTime: '22:00', venue: s('Sen Tây Hồ Restaurant', 'Nhà hàng Sen Tây Hồ'), address: s('614 Lạc Long Quân, Tây Hồ, Hanoi', '614 Lạc Long Quân, Tây Hồ, Hà Nội'), dressCode: s('White shirts, like old times', 'Áo sơ mi trắng như ngày xưa') } },
        { name: 'timeline', data: { title: s('Then and now', 'Ngày ấy – bây giờ'), items: [
          step('2013', s('First day of year 10', 'Ngày đầu vào lớp 10'), s('Forty-two strangers, one very strict form teacher.', 'Bốn mươi hai người lạ và một cô chủ nhiệm rất nghiêm.')),
          step('2015', s('The camping trip', 'Chuyến cắm trại Ba Vì'), s('It rained all night. Best trip ever.', 'Mưa cả đêm. Chuyến đi vui nhất.'), photo('reunion-1')),
          step('2016', s('Graduation', 'Ra trường'), s('Tears, signed shirts and big plans.', 'Nước mắt, áo ký tên và bao nhiêu dự định.')),
          step('2026', s('Ten years on', 'Mười năm sau'), s('Doctors, engineers, parents, one chef. Same class.', 'Bác sĩ, kỹ sư, có người làm bố mẹ, có một đầu bếp. Vẫn là một lớp.')),
        ] } },
        { name: 'image-album', data: { title: s('Old photos, new memories', 'Ảnh cũ, kỷ niệm mới'), images: album('reunion-2', 'reunion-3', 'reunion-4'), layout: 'masonry' } },
        { name: 'form', data: { title: s('Will you be there?', 'Bạn có đến không?'), kind: 'rsvp', fields: RSVP_FIELDS, submitLabel: s('Send my reply', 'Gửi xác nhận') } },
        faq(s('For the evening', 'Cho buổi tối hôm ấy'), s('📸 Bring one old photo; we’re making a wall of 2013–2016\n👔 White shirts, like the old days\n💑 Partners and kids are welcome; tell us how many in your reply\n🎤 Karaoke after dinner, the class song is non-negotiable', '📸 Mang theo một tấm ảnh cũ, lớp làm bức tường kỷ niệm 2013–2016\n👔 Áo sơ mi trắng như ngày xưa\n💑 Đưa vợ chồng, con cái đi cùng thoải mái; ghi số người khi xác nhận\n🎤 Ăn xong đi hát, bài “ca khúc của lớp” là bắt buộc')),
        { name: 'text', data: { title: s('Class fund', 'Quỹ lớp'), content: s('500,000₫ each covers dinner and a gift for Teacher Hoa. Transfer with your name in the note.', 'Mỗi bạn 500.000₫ cho bữa tối và quà tặng cô Hoa. Chuyển khoản ghi rõ tên nhé.'), align: 'center', style: 'card' } },
        { name: 'vietqr', data: {} },
        { name: 'links', data: { title: s('Stay in touch', 'Giữ liên lạc'), items: links([s('The class Zalo group 💬', 'Nhóm Zalo của lớp 💬'), 'https://zalo.me']) } },
      ] as Blocks),
      room: giftRoom('#f6f0e3', '#c9a27e', '#1e6b52', s('10 years', '10 năm'), ['reunion-avatar', 'reunion-1', 'reunion-3'], 'day', 'love-acoustic'),
    }),
  },
  {
    id: 'volunteer-group',
    name: 'Volunteer group',
    category: 'community',
    description: 'Fresh ocean colours for volunteer groups and charities: your impact in numbers, the next activity, sign-ups and donations.',
    icon: 'i-lucide-hand-heart',
    preview: { bg: '#E8F6F4', accent: '#0FA3A3' },
    build: () => ({
      title: s('Green Wave Volunteers', 'Nhóm tình nguyện Sóng Xanh'),
      bio: s('Weekend clean-ups, meals for night workers and Christmas for kids. Come as you are.', 'Dọn rác cuối tuần, suất ăn cho người lao động đêm và Giáng sinh cho các em nhỏ. Cứ đến là được.'),
      avatarUrl: photo('volunteer-avatar'),
      themeConfig: {
        ...look({
          bg: '#E8F6F4', text: '#0E3B43', accent: '#0FA3A3', onAccent: '#FFFFFF', surface: '#FFFFFF', radius: 20, shadow: 'sm',
          nameFont: 'Josefin Sans, sans-serif', nameWeight: '700', nameSize: '2.2rem', tracking: '0.01em', bodyFont: 'Be Vietnam Pro, sans-serif',
          header: 'banner-square', banner: photo('volunteer-cover'), link: 'centered', social: 'filled',
        }),
        background: { type: 'solid', color: '#E8F6F4', pattern: { id: 'waves', color: '#0FA3A3' } },
        music: { trackId: 'marimba-travel' },
      },
      blocks: withIndex([
        { name: 'text', data: { title: s('Our impact so far', 'Những gì đã làm được'), content: s('🌊 2.4 tonnes of rubbish picked up\n🍱 1,800 meals shared\n🙌 320 volunteers, and counting', '🌊 2,4 tấn rác đã nhặt\n🍱 1.800 suất ăn đã trao\n🙌 320 tình nguyện viên và còn tăng'), align: 'center', style: 'card' } },
        { name: 'event', data: { name: s('Beach clean-up at Cần Giờ', 'Dọn rác biển Cần Giờ'), date: '2026-11-15', startTime: '06:00', endTime: '11:00', venue: s('30/4 Beach, Cần Giờ', 'Bãi biển 30/4, Cần Giờ'), address: s('Cần Giờ, Ho Chi Minh City', 'Cần Giờ, TP. Hồ Chí Minh'), dressCode: s('Hat, sunscreen, closed shoes', 'Mũ, kem chống nắng, giày kín mũi'), note: s('Gloves, bags, water and lunch are on us.', 'Găng tay, bao rác, nước và cơm trưa đã có nhóm lo.') } },
        { name: 'timeline', data: { title: s('Coming up', 'Sắp diễn ra'), items: [
          step('15/11', s('Beach clean-up', 'Dọn rác biển'), s('Cần Giờ, all day.', 'Cần Giờ, cả ngày.')),
          step('06/12', s('Night meals', 'Suất ăn đêm'), s('Hot food for street sweepers and drivers.', 'Cơm nóng cho cô chú lao công và tài xế.'), photo('volunteer-2')),
          step('24/12', s('Christmas with the kids', 'Giáng sinh cùng các em'), s('Gifts and games at Thảo Đàn shelter.', 'Quà và trò chơi ở mái ấm Thảo Đàn.')),
        ] } },
        { name: 'form', data: { title: s('Join the next activity', 'Đăng ký tham gia'), kind: 'rsvp', fields: { ...RSVP_FIELDS, guests: true }, submitLabel: s('Count me in', 'Mình tham gia') } },
        { name: 'image-album', data: { title: s('On the ground', 'Hình ảnh hoạt động'), images: album('volunteer-1', 'volunteer-3', 'volunteer-4', 'charity-1'), layout: 'grid' } },
        faq(s('Before your first activity', 'Trước buổi đầu tiên'), s('🙋 No experience needed, we brief everyone on the day\n👨‍👩‍👧 Under 16? Come with a parent\n📜 We sign volunteer-hour certificates for students\n🚌 Shared bus from District 1 for out-of-town activities', '🙋 Không cần kinh nghiệm, nhóm hướng dẫn ngay tại chỗ\n👨‍👩‍👧 Dưới 16 tuổi đi cùng phụ huynh nhé\n📜 Có xác nhận giờ tình nguyện cho học sinh, sinh viên\n🚌 Có xe chung từ Quận 1 cho hoạt động ở xa')),
        { name: 'testimonials', data: { title: s('Why we come back', 'Vì sao mọi người quay lại'), items: reviews(
          [s('I came alone, left with twenty friends and a sunburn.', 'Mình đến một mình, về với hai mươi người bạn và một làn da cháy nắng.'), 'Khánh Linh', s('Volunteer since 2024', 'Tình nguyện viên từ 2024')],
        ) } },
        { name: 'text', data: { title: s('Support our work', 'Đồng hành cùng nhóm'), content: s('Every 50,000₫ buys one hot meal. We publish all spending each month.', 'Mỗi 50.000₫ là một suất cơm nóng. Mọi khoản chi được công khai hằng tháng.'), align: 'center', style: 'plain' } },
        { name: 'vietqr', data: {} },
        { name: 'social', data: { links: social('facebook', 'instagram', 'tiktok', 'zalo') } },
      ] as Blocks),
      room: { ...loungeRoom('#d9f0ec', '#c8b28a', '#0fa3a3', s('Volunteer with us', 'Tình nguyện cùng nhóm')), land: 'tropical' },
    }),
  },
]
