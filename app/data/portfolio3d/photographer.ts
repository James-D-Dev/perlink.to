import type { PortfolioTopic } from './types'

// "3D photography portfolio": photographers who sell shoots, prints or both
export const PHOTOGRAPHER_TOPIC: PortfolioTopic = {
  id: 'photographer',
  path: { en: 'photographer', vi: 'nhiep-anh-gia' },
  demo: 'photographer',
  templates: ['photographer', 'wedding-photo', 'personal-editorial'],
  updated: '2026-11-06',
  readMinutes: 6,
  en: {
    seoTitle: '3D Photography Portfolio: Your Own Gallery | Perlink',
    description: 'Make a 3D photography portfolio: your best photos on a gallery wall visitors walk past, a fast page with packages and booking, and tips to prepare images.',
    eyebrow: '3D photography portfolio',
    title: 'A 3D photography portfolio that feels like your own gallery',
    intro: 'Photos are made to be seen large, and most portfolio sites shrink them into a grid. A 3D portfolio gives your work a wall: visitors walk through a small gallery room and tap any frame to see the photo full size. Next to it sits a fast page with your packages, prices and a booking form, so a visit can turn into a shoot.',
    demoTitle: 'A photographer’s gallery room, live',
    demoText: 'Drag to walk your eyes along the walls, scroll or pinch to zoom, and tap a frame to see the photo large.',
    sections: [
      {
        title: 'What clients look for in a photographer’s portfolio',
        paragraphs: [
          'A couple choosing a wedding photographer, a brand looking for product shots and an editor hiring for a story all ask the same first question: will my photos look like this? They want to see the kind of shoot they are planning, in a consistent style, and then they want to know the price and whether you are free on their date.',
        ],
        bullets: [
          'Your style, consistent across the set: light, colour and the way you frame people',
          'Full stories, not only highlights: a whole wedding, a whole product launch',
          'The kind of work you want more of, shown first',
          'Clear packages and prices, or at least a starting price',
          'An easy way to ask for a date',
        ],
      },
      {
        title: 'Curate hard: how many photos to show',
        paragraphs: [
          'Show fewer photos than you think. Fifteen to thirty strong images across three to five galleries is better than two hundred good ones. Every average photo next to a great one makes the great one look less special.',
          'Group them by the kind of shoot clients book: weddings, portraits, products, events, travel. If you shoot weddings, add one complete wedding from start to end, because couples want to know you can tell the whole day, not just make a few beautiful frames.',
        ],
      },
      {
        title: 'Prepare your files for the web',
        paragraphs: [
          'A gallery that loads slowly loses visitors before they see your best photo. Prepare your files once, and they will look sharp and load fast on the page and in the room.',
        ],
        bullets: [
          'Export at 2000 to 2500 px on the long side, in sRGB colour',
          'Use JPEG at good quality or WebP; very large originals only slow the page down',
          'Choose a consistent orientation for the photos that hang together on one wall',
          'Add a small, quiet watermark only if you need it; large ones distract from the photo',
          'Write a short caption and alt text: where, who or what, so search engines understand it',
        ],
      },
      {
        title: 'Why a gallery room works for photography',
        paragraphs: [
          'Photographers already know the effect of an exhibition: the same photo feels bigger and more considered on a wall than on a phone screen. The 3D room brings a little of that to your link.',
          'On Perlink, picture frames show your own photos and visitors tap a frame to view it large. Hang a series along the side wall like a small exhibition, keep your signature shot alone on the back wall, and light the room to match your work: warm daylight for weddings and families, the city at night for street and editorial work, winter or zen for quiet landscape series.',
          'A frame can link to the full gallery on the page, to a print you sell, or to your booking form. Then record a vertical tour of your room in the editor and post it as a Reel or TikTok: a slow walk past your best photos is a different kind of post than another single image.',
        ],
      },
      {
        title: 'Turn visits into bookings',
        paragraphs: [
          'The page is where the business happens. Put these within easy reach of your gallery:',
        ],
        bullets: [
          'Packages with prices in a priced list: what is included, hours, number of edited photos',
          'A booking form that asks for the date, the kind of shoot and a message',
          'Testimonials from real clients, with their first name and the kind of shoot',
          'Prints or presets for sale as products, if you sell them',
          'A QR code on your business card and at events, leading to the same page',
        ],
      },
      {
        title: 'Mistakes that cost photographers bookings',
        paragraphs: [
          'These are common, and most of them are about what is missing rather than what is there.',
        ],
        bullets: [
          'Mixing every genre you have ever shot, so no client sees their own shoot',
          'Photos edited in very different styles side by side',
          'No price at all, so people assume you are too expensive and leave',
          'Only an Instagram link, with no way to ask for a date directly',
          'Full-resolution files that take ages to open on a phone',
        ],
      },
    ],
    table: {
      title: 'Instagram grid or your own 3D portfolio',
      columns: ['', 'Instagram grid', 'Perlink 3D portfolio'],
      rows: [
        ['Order and curation', 'Newest first, mixed with everything else', 'Galleries in the order you choose'],
        ['Photos seen large', 'Cropped to the feed', 'Tap a frame or open the album'],
        ['Packages, prices, booking', 'In captions and messages', 'Priced list and booking form on the page'],
        ['Found on Google', 'Rarely', 'A real page with its own title and description'],
        ['Your own address', 'A profile on Instagram', 'perlink.to/yourname or your own domain'],
      ],
    },
    stepsTitle: 'Make your photography portfolio in six steps',
    steps: [
      { title: 'Pick a photography template', text: 'Photographer, wedding photographer or editorial: each has a gallery-first page and a matching room.' },
      { title: 'Choose your galleries', text: 'Three to five sets, fifteen to thirty photos in all, grouped the way clients book.' },
      { title: 'Prepare the files', text: 'Around 2000 px, sRGB, a short caption for each. Upload them to image albums.' },
      { title: 'Hang the gallery wall', text: 'Put your best photos in the room’s frames, choose the land and the light.' },
      { title: 'Add packages and booking', text: 'A priced list of packages, a booking form and a few client testimonials.' },
      { title: 'Share and post the tour', text: 'Put perlink.to/yourname in your bio, print the QR code, and post a video of the room.' },
    ],
    faq: [
      { q: 'Will my photos lose quality in the 3D room?', a: 'In the room, photos are shown in frames at a size that suits the device. Tap a frame and the photo opens large, and the page albums show your images in full.' },
      { q: 'How many photos can I show?', a: 'As many as you need in the page’s image albums, and as many frames as you want in the room. For clients, fifteen to thirty strong photos usually work better than hundreds.' },
      { q: 'Can clients book a shoot from the page?', a: 'Yes. Add a booking form that asks for the date and a message, and a priced list of your packages. Requests reach your inbox.' },
      { q: 'Can I sell prints or presets?', a: 'Yes. Add them as products on the page, with prices and photos, and link a frame in the room to a product.' },
      { q: 'Does it replace Instagram?', a: 'No, it works with it. Instagram brings people in; your portfolio is where they see your work in order, check your prices and book. Put your Perlink address in your Instagram bio.' },
      { q: 'Is it free?', a: 'Yes. One site with the page, the 3D room and 30 days of analytics is free with no time limit. Paid plans add more sites, Pro themes and longer analytics.' },
      { q: 'Can I use my own domain?', a: 'Yes, on the Plus plan ($20 a month, up to 3 domains) or Max. Your perlink.to address keeps working too.' },
    ],
    ctaTitle: 'Give your photos a wall',
    ctaText: 'Claim your address, pick a photography template and hang your first gallery today. Free to start.',
  },
  vi: {
    seoTitle: 'Portfolio 3D nhiếp ảnh: phòng triển lãm riêng | Perlink',
    description: 'Tạo portfolio 3D cho nhiếp ảnh gia: ảnh đẹp nhất treo trên tường phòng triển lãm, trang tải nhanh có bảng giá và form đặt lịch, kèm mẹo chuẩn bị ảnh.',
    eyebrow: 'Portfolio 3D nhiếp ảnh',
    title: 'Portfolio 3D nhiếp ảnh, như một phòng triển lãm của riêng bạn',
    intro: 'Ảnh sinh ra để được xem lớn, vậy mà hầu hết trang portfolio lại thu nhỏ chúng vào một lưới ô vuông. Portfolio 3D cho tác phẩm của bạn một bức tường: khách dạo qua căn phòng triển lãm nhỏ và chạm vào khung nào cũng xem được ảnh cỡ lớn. Bên cạnh là một trang tải nhanh có gói chụp, bảng giá và form đặt lịch, để một lượt ghé thăm có thể thành một buổi chụp.',
    demoTitle: 'Phòng triển lãm của một nhiếp ảnh gia, xem trực tiếp',
    demoText: 'Kéo để đưa mắt dọc theo các bức tường, cuộn hoặc chụm hai ngón để phóng to, chạm vào khung để xem ảnh lớn.',
    sections: [
      {
        title: 'Khách hàng tìm gì trong portfolio nhiếp ảnh',
        paragraphs: [
          'Một cặp đôi đang chọn thợ chụp cưới, một thương hiệu cần ảnh sản phẩm, một biên tập viên cần người chụp phóng sự, ai cũng hỏi cùng một câu đầu tiên: ảnh của mình có được như thế này không? Họ muốn thấy đúng kiểu buổi chụp mình đang lên kế hoạch, với phong cách nhất quán, rồi muốn biết giá và bạn có rảnh vào ngày đó không.',
        ],
        bullets: [
          'Phong cách nhất quán trong cả bộ: ánh sáng, màu sắc, cách bạn bắt khoảnh khắc người',
          'Trọn câu chuyện chứ không chỉ ảnh đẹp nhất: cả một đám cưới, cả một buổi ra mắt sản phẩm',
          'Kiểu việc bạn muốn nhận nhiều hơn, đặt lên đầu',
          'Gói chụp và giá rõ ràng, ít nhất là giá khởi điểm',
          'Một cách dễ dàng để hỏi lịch',
        ],
      },
      {
        title: 'Chọn lọc thật kỹ: nên đưa bao nhiêu ảnh',
        paragraphs: [
          'Hãy đưa ít ảnh hơn bạn nghĩ. Mười lăm đến ba mươi tấm thật mạnh, chia thành ba đến năm bộ, tốt hơn hai trăm tấm khá. Mỗi tấm bình thường đặt cạnh một tấm xuất sắc sẽ làm tấm xuất sắc bớt đặc biệt.',
          'Nhóm ảnh theo kiểu buổi chụp mà khách hay đặt: cưới, chân dung, sản phẩm, sự kiện, du lịch. Nếu bạn chụp cưới, hãy có một đám cưới trọn vẹn từ đầu đến cuối, vì các cặp đôi muốn biết bạn kể được cả ngày của họ, chứ không chỉ có vài khung hình đẹp.',
        ],
      },
      {
        title: 'Chuẩn bị ảnh cho web',
        paragraphs: [
          'Một bộ ảnh tải chậm sẽ mất khách trước khi họ thấy tấm đẹp nhất. Chuẩn bị tệp một lần cho đúng, ảnh sẽ sắc nét và tải nhanh cả trên trang lẫn trong phòng.',
        ],
        bullets: [
          'Xuất ảnh 2000 đến 2500 px ở cạnh dài, hệ màu sRGB',
          'Dùng JPEG chất lượng tốt hoặc WebP; ảnh gốc quá lớn chỉ làm trang chậm',
          'Các ảnh treo chung một bức tường nên cùng hướng dọc hoặc ngang',
          'Chỉ đóng dấu nhỏ, kín đáo nếu thật cần; dấu lớn làm người xem mất tập trung',
          'Viết chú thích và alt text ngắn: ở đâu, ai hoặc cái gì, để công cụ tìm kiếm hiểu ảnh',
        ],
      },
      {
        title: 'Vì sao phòng triển lãm hợp với nhiếp ảnh',
        paragraphs: [
          'Người làm ảnh đều biết hiệu ứng của một buổi triển lãm: cùng một tấm ảnh, treo trên tường trông lớn và có chủ ý hơn hẳn khi lướt trên màn hình điện thoại. Căn phòng 3D mang một chút cảm giác đó vào đường link của bạn.',
          'Trên Perlink, khung tranh hiển thị ảnh của chính bạn, khách chạm vào khung để xem ảnh lớn. Treo một bộ ảnh dọc tường bên như một triển lãm nhỏ, để tấm ảnh tâm đắc nhất một mình ở tường chính, và chọn ánh sáng hợp với tác phẩm: nắng ấm cho ảnh cưới và gia đình, thành phố về đêm cho ảnh đường phố và thời trang, mùa đông hay vườn thiền cho loạt phong cảnh tĩnh lặng.',
          'Mỗi khung có thể dẫn tới bộ ảnh đầy đủ trên trang, tới bản in bạn bán, hoặc tới form đặt lịch. Sau đó quay một video dọc dạo quanh phòng ngay trong trình chỉnh sửa và đăng thành Reel hay TikTok: một lượt đi chậm qua những tấm ảnh đẹp nhất là kiểu bài đăng khác hẳn một tấm ảnh đơn.',
        ],
      },
      {
        title: 'Biến lượt xem thành lịch chụp',
        paragraphs: [
          'Trang portfolio là nơi diễn ra việc kinh doanh. Hãy đặt những thứ sau ngay gần bộ ảnh:',
        ],
        bullets: [
          'Gói chụp kèm giá trong bảng giá: gồm những gì, bao nhiêu giờ, bao nhiêu ảnh chỉnh',
          'Form đặt lịch hỏi ngày, kiểu buổi chụp và lời nhắn',
          'Nhận xét của khách thật, kèm tên và kiểu buổi chụp',
          'Ảnh in hoặc preset bày bán dưới dạng sản phẩm, nếu bạn có bán',
          'Mã QR trên danh thiếp và ở các sự kiện, dẫn về cùng một trang',
        ],
      },
      {
        title: 'Những lỗi khiến nhiếp ảnh gia mất khách',
        paragraphs: [
          'Các lỗi này rất phổ biến, và phần lớn là do thiếu một thứ gì đó chứ không phải do thừa.',
        ],
        bullets: [
          'Trộn mọi thể loại từng chụp, nên khách không thấy đúng kiểu buổi chụp của mình',
          'Ảnh chỉnh màu theo nhiều phong cách khác hẳn nhau đặt cạnh nhau',
          'Không có giá, khách đoán là quá đắt rồi rời đi',
          'Chỉ có link Instagram, không có cách hỏi lịch trực tiếp',
          'Ảnh độ phân giải gốc, mở trên điện thoại rất lâu',
        ],
      },
    ],
    table: {
      title: 'Lưới ảnh Instagram hay portfolio 3D riêng',
      columns: ['', 'Lưới ảnh Instagram', 'Portfolio 3D trên Perlink'],
      rows: [
        ['Sắp xếp và chọn lọc', 'Mới nhất lên đầu, lẫn với mọi thứ khác', 'Các bộ ảnh theo thứ tự bạn chọn'],
        ['Xem ảnh cỡ lớn', 'Bị cắt theo khung bảng tin', 'Chạm vào khung hoặc mở album'],
        ['Gói chụp, giá, đặt lịch', 'Trong chú thích và tin nhắn', 'Bảng giá và form đặt lịch ngay trên trang'],
        ['Tìm thấy trên Google', 'Hiếm khi', 'Một trang thật có tiêu đề và mô tả riêng'],
        ['Địa chỉ riêng', 'Một hồ sơ trên Instagram', 'perlink.to/tên-bạn hoặc tên miền riêng'],
      ],
    },
    stepsTitle: 'Làm portfolio nhiếp ảnh trong sáu bước',
    steps: [
      { title: 'Chọn mẫu nhiếp ảnh', text: 'Nhiếp ảnh gia, chụp ảnh cưới hoặc editorial: mẫu nào cũng ưu tiên bộ ảnh và có phòng đi kèm.' },
      { title: 'Chọn các bộ ảnh', text: 'Ba đến năm bộ, tổng cộng mười lăm đến ba mươi tấm, nhóm theo kiểu khách hay đặt.' },
      { title: 'Chuẩn bị tệp ảnh', text: 'Khoảng 2000 px, sRGB, mỗi tấm một chú thích ngắn. Tải lên các album ảnh.' },
      { title: 'Treo bức tường triển lãm', text: 'Đưa những tấm đẹp nhất vào khung tranh trong phòng, chọn vùng đất và ánh sáng.' },
      { title: 'Thêm gói chụp và đặt lịch', text: 'Bảng giá các gói, form đặt lịch và vài nhận xét của khách.' },
      { title: 'Chia sẻ và đăng video', text: 'Đặt perlink.to/tên-bạn vào bio, in mã QR, và đăng video dạo quanh căn phòng.' },
    ],
    faq: [
      { q: 'Ảnh có bị giảm chất lượng trong phòng 3D không?', a: 'Trong phòng, ảnh hiển thị trong khung ở kích thước hợp với thiết bị. Chạm vào khung là ảnh mở lớn, còn album trên trang hiển thị ảnh đầy đủ.' },
      { q: 'Tôi đưa được bao nhiêu ảnh?', a: 'Bao nhiêu cũng được trong các album ảnh trên trang, và bao nhiêu khung tùy bạn trong phòng. Với khách hàng, mười lăm đến ba mươi tấm thật mạnh thường hiệu quả hơn hàng trăm tấm.' },
      { q: 'Khách có đặt lịch chụp ngay trên trang được không?', a: 'Được. Thêm form đặt lịch hỏi ngày và lời nhắn, cùng bảng giá các gói. Yêu cầu sẽ về hộp thư của bạn.' },
      { q: 'Tôi bán ảnh in hay preset được không?', a: 'Được. Thêm chúng thành sản phẩm trên trang kèm giá và ảnh, rồi gắn link một khung tranh trong phòng tới sản phẩm đó.' },
      { q: 'Có thay được Instagram không?', a: 'Không, nó đi cùng Instagram. Instagram kéo người ta tới; portfolio là nơi họ xem tác phẩm theo thứ tự, xem giá và đặt lịch. Hãy đặt địa chỉ Perlink vào bio Instagram.' },
      { q: 'Có miễn phí không?', a: 'Có. Một trang gồm portfolio, phòng 3D và thống kê 30 ngày, miễn phí không giới hạn thời gian. Gói trả phí có thêm trang, theme Pro và thống kê dài hơn.' },
      { q: 'Tôi dùng tên miền riêng được không?', a: 'Được, với gói Plus (20 USD một tháng, tối đa 3 tên miền) hoặc Max. Địa chỉ perlink.to vẫn hoạt động song song.' },
    ],
    ctaTitle: 'Cho ảnh của bạn một bức tường',
    ctaText: 'Giữ địa chỉ của bạn, chọn một mẫu nhiếp ảnh và treo bộ ảnh đầu tiên ngay hôm nay. Bắt đầu miễn phí.',
  },
}
