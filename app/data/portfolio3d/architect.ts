import type { PortfolioTopic } from './types'

// "3D architecture portfolio": architects and interior designers, whose work
// is space, showing it as a page and as a room to walk into
export const ARCHITECT_TOPIC: PortfolioTopic = {
  id: 'architect',
  path: { en: 'architect', vi: 'kien-truc-su' },
  demo: 'architect',
  templates: ['interior-design', 'personal', 'creative-agency'],
  updated: '2026-11-06',
  readMinutes: 7,
  en: {
    seoTitle: '3D Architecture Portfolio for Architects | Perlink',
    description: 'Make a 3D architecture portfolio without code: project sheets, renders and built work on a clean page, plus a 3D room clients walk into. Free to start.',
    eyebrow: '3D portfolio for architects',
    title: 'A 3D architecture portfolio that feels like walking into your work',
    intro: 'Architects and interior designers sell space, yet most portfolios flatten it into a PDF. With Perlink you publish a fast portfolio page with your projects, drawings and contact, and the same page as a small 3D room people can walk around, with your renders and photos framed on the walls. No modelling software and no code.',
    demoTitle: 'Walk into an architect’s room',
    demoText: 'Drag to look around, zoom in, and tap a frame to see the project large. This is the kind of room you set up in the editor.',
    sections: [
      {
        title: 'Why a room suits spatial work',
        paragraphs: [
          'A client or a hiring partner looking at your portfolio is trying to answer one question: can this person make a space I would want to be in? A grid of thumbnails answers it slowly. A room answers it the way your work does, by putting the visitor inside something.',
          'The Perlink room is not a model of your building, and it shouldn’t pretend to be. Think of it as a small gallery or studio: your strongest projects on the walls, a desk with a link to your full project sheets, and a mood (land, light, time of day) that matches how you design. It sets the tone in a few seconds, and the page underneath carries the detail.',
        ],
      },
      {
        title: 'What to show: renders, built work and drawings',
        paragraphs: [
          'Most architecture portfolios mix three kinds of images. Be clear about which is which, because clients and studios read them differently.',
        ],
        bullets: [
          'Photos of built work: the strongest proof. Lead with them if you have them, and say what your role was.',
          'Renders and visualisations: fine for unbuilt or competition work. Label them as renders so nobody feels misled later.',
          'Drawings and diagrams: plans, sections, concept sketches. One clear plan often says more than five renders.',
          'Process: models, site photos, material boards. Studios hiring juniors often want to see how you think, not only the final image.',
        ],
      },
      {
        title: 'One project, one sheet',
        paragraphs: [
          'For each project, give visitors the same short set of facts so they can compare quickly: name and place, year, type (house, café fit-out, office, competition), size, your role, and two or three lines on the idea. Then the images.',
          'On a Perlink page that is a text block for the facts and an image album for the pictures, one pair per project. Choose the masonry layout for mixed portrait and landscape shots, the carousel when you want one image at a time, or the grid for drawings of the same size. In the room, hang the hero image of each project in a frame; visitors tap it to see it full size.',
        ],
      },
      {
        title: 'Keep render files light',
        paragraphs: [
          'Renders straight out of a visualisation tool are often 8–20 MB each, far more than a phone needs. A portfolio that takes ten seconds to load on mobile data loses the client before the first image.',
        ],
        bullets: [
          'Export at around 2000 px on the long side; that is sharp on any screen.',
          'Use JPEG or WebP at 75–85% quality rather than PNG for photos and renders.',
          'Keep PDFs of full project books for people who ask, and link to them, instead of putting every page on the site.',
          'Pick five to eight projects. A short, strong selection reads as confidence.',
        ],
      },
      {
        title: 'For interior designers',
        paragraphs: [
          'Interior work is the easiest to translate into a room, because the room itself is the medium. Choose wall and floor colours and materials close to your style, add the furniture and lamps that suit it, and frame before-and-after photos side by side on one wall.',
          'If you charge by project or by square metre, the priced list block lets you show packages clearly, and the booking form collects consultation requests with a date. The interior design template comes with this layout already set up.',
        ],
      },
      {
        title: 'Being found by the right clients',
        paragraphs: [
          'Your portfolio page is a real web page, so give it a title and description that say what and where you design, for example “Residential architect in Da Nang”. Set a share image so links on Zalo, Facebook or LinkedIn show your best project rather than a blank card.',
          'Print the QR code on your business card or project boards at exhibitions, and add the link to your email signature. On the Plus plan you can connect your studio’s own domain; your perlink.to address keeps working too.',
        ],
      },
    ],
    table: {
      title: 'PDF portfolio, plain website or a 3D portfolio',
      columns: ['', 'PDF portfolio', 'Perlink 3D portfolio'],
      rows: [
        ['Opens on a phone', 'Slow, needs zooming', 'Fast page, made for phones'],
        ['Feeling of space', 'None', 'A room visitors walk around'],
        ['Updating a project', 'Re-export and resend', 'Edit online, live at once'],
        ['Found on Google', 'Rarely', 'Own title, description and address'],
        ['Contact or booking', 'An email at the end', 'Form and booking on the page'],
      ],
    },
    stepsTitle: 'Make your architecture portfolio',
    steps: [
      { title: 'Choose your address and a template', text: 'Pick perlink.to/yourname and start from the interior design or personal portfolio template.' },
      { title: 'Add five to eight projects', text: 'A text block with the facts and an album with the images, for each project. Label renders as renders.' },
      { title: 'Set up the room', text: 'Choose a land and the light, set wall and floor materials close to your style, and frame your hero images.' },
      { title: 'Link the full project books', text: 'Put a link on the laptop or a frame to your detailed PDFs or drawings for people who want more.' },
      { title: 'Add contact and booking', text: 'A contact form for studios, a booking form with dates for clients who want a consultation.' },
      { title: 'Publish and share', text: 'Set the SEO title and share image, then put the link and QR code on your card, CV and email signature.' },
    ],
    faq: [
      { q: 'Do I need to model my building in 3D?', a: 'No. The Perlink room is a gallery for your work, not a model of a project. You hang your renders, photos and drawings in it and arrange furniture from the catalogue. Nothing to model, no Blender or SketchUp export.' },
      { q: 'Can I upload my own renders and drawings?', a: 'Yes. Upload images to albums on the page and to picture frames in the room. Visitors tap a frame to see the image large. For large project books, link to a PDF.' },
      { q: 'Will it be slow with lots of high-resolution images?', a: 'It depends on what you upload. Export renders at around 2000 px and in JPEG or WebP, and the page stays quick. The 3D room adjusts its quality to the visitor’s device.' },
      { q: 'Is it suitable for applying to architecture firms?', a: 'Yes. Many studios still ask for a PDF; send it, and add your portfolio link in the email and on your CV. The link shows your selection quickly and the room shows you care about how work is presented.' },
      { q: 'Can I use my studio’s own domain?', a: 'Yes, on the Plus plan (3 domains) or Max (20). Your perlink.to address keeps working after you connect it.' },
      { q: 'Is it free?', a: 'You can make and publish one site with the page, the 3D room and 30 days of analytics on the free plan, with no time limit. Paid plans add more sites, Pro themes, longer analytics and custom domains.' },
      { q: 'Does it work for interior designers too?', a: 'Very well. Choose room materials and furniture that match your style, show before-and-after photos, list packages by project or square metre and take consultation bookings.' },
    ],
    ctaTitle: 'Let clients step into your work',
    ctaText: 'Pick your address and put your projects on the walls. Free to start, ready in an afternoon.',
  },
  vi: {
    seoTitle: 'Portfolio 3D cho kiến trúc sư, không cần code | Perlink',
    description: 'Tạo portfolio 3D cho kiến trúc sư và thiết kế nội thất: dự án, phối cảnh, ảnh công trình trên trang web gọn gàng và một căn phòng 3D để khách bước vào.',
    eyebrow: 'Portfolio 3D cho kiến trúc sư',
    title: 'Portfolio 3D cho kiến trúc sư: để khách bước vào công trình của bạn',
    intro: 'Kiến trúc sư và người làm nội thất bán không gian, nhưng phần lớn portfolio lại ép không gian đó thành một file PDF phẳng. Với Perlink, bạn có một trang portfolio tải nhanh với dự án, bản vẽ và thông tin liên hệ, cùng chính trang đó dưới dạng một căn phòng 3D để khách dạo quanh, phối cảnh và ảnh công trình treo trên tường. Không cần dựng mô hình, không cần code.',
    demoTitle: 'Dạo thử phòng của một kiến trúc sư',
    demoText: 'Kéo để nhìn quanh, phóng to, chạm vào khung tranh để xem dự án cỡ lớn. Đây là kiểu căn phòng bạn tự sắp xếp trong trình chỉnh sửa.',
    sections: [
      {
        title: 'Vì sao căn phòng hợp với nghề làm không gian',
        paragraphs: [
          'Chủ đầu tư hay văn phòng kiến trúc xem portfolio của bạn để trả lời một câu: người này có làm ra được không gian mà tôi muốn ở trong đó không? Một lưới ảnh nhỏ trả lời câu đó chậm. Một căn phòng trả lời theo đúng cách công việc của bạn vẫn làm: đặt người xem vào bên trong.',
          'Phòng trên Perlink không phải mô hình công trình của bạn, và cũng không nên giả làm thế. Hãy coi nó như một phòng trưng bày hay góc studio nhỏ: những dự án mạnh nhất treo trên tường, bàn làm việc có link tới hồ sơ dự án đầy đủ, và một không khí (vùng đất, ánh sáng, ngày hay đêm) hợp với phong cách thiết kế của bạn. Căn phòng tạo ấn tượng trong vài giây, còn trang web bên dưới giữ phần chi tiết.',
        ],
      },
      {
        title: 'Nên đưa gì vào: phối cảnh, công trình thật và bản vẽ',
        paragraphs: [
          'Portfolio kiến trúc thường có ba loại hình ảnh. Hãy ghi rõ loại nào là loại nào, vì khách hàng và văn phòng đọc chúng rất khác nhau.',
        ],
        bullets: [
          'Ảnh công trình đã xây: bằng chứng thuyết phục nhất. Có thì đưa lên đầu, và ghi rõ vai trò của bạn trong dự án.',
          'Phối cảnh, diễn họa: phù hợp cho dự án chưa xây hoặc bài thi. Ghi chú là phối cảnh để không ai thấy bị hiểu lầm về sau.',
          'Bản vẽ và sơ đồ: mặt bằng, mặt cắt, phác thảo ý tưởng. Một mặt bằng rõ ràng nhiều khi nói được hơn năm tấm phối cảnh.',
          'Quá trình: mô hình, ảnh hiện trạng, bảng vật liệu. Văn phòng tuyển kiến trúc sư trẻ thường muốn thấy cách bạn suy nghĩ, không chỉ tấm ảnh cuối cùng.',
        ],
      },
      {
        title: 'Mỗi dự án một “tờ thông tin”',
        paragraphs: [
          'Với mỗi dự án, hãy cho người xem cùng một bộ thông tin ngắn để họ so sánh nhanh: tên và địa điểm, năm, loại công trình (nhà ở, cải tạo quán cà phê, văn phòng, bài thi), diện tích, vai trò của bạn, và hai ba dòng về ý tưởng. Sau đó mới tới hình ảnh.',
          'Trên trang Perlink, đó là một khối văn bản cho phần thông tin và một album ảnh cho hình, mỗi dự án một cặp. Chọn kiểu masonry khi ảnh dọc ngang lẫn lộn, kiểu trượt khi muốn xem từng ảnh một, kiểu lưới cho các bản vẽ cùng khổ. Trong phòng, treo ảnh đại diện của từng dự án vào khung; khách chạm vào là xem được cỡ lớn.',
        ],
      },
      {
        title: 'Giữ file phối cảnh thật nhẹ',
        paragraphs: [
          'Ảnh xuất thẳng từ phần mềm diễn họa thường nặng 8–20 MB mỗi tấm, quá thừa cho điện thoại. Một portfolio mất mười giây mới mở được bằng 4G là đã mất khách trước cả tấm ảnh đầu tiên.',
        ],
        bullets: [
          'Xuất ảnh khoảng 2000 px ở cạnh dài, đủ nét trên mọi màn hình.',
          'Dùng JPEG hoặc WebP chất lượng 75–85% thay vì PNG cho ảnh chụp và phối cảnh.',
          'Hồ sơ dự án đầy đủ thì để ở file PDF và gắn link, thay vì đưa từng trang lên web.',
          'Chọn năm đến tám dự án. Một bộ chọn lọc ngắn mà chắc thể hiện sự tự tin.',
        ],
      },
      {
        title: 'Với người làm thiết kế nội thất',
        paragraphs: [
          'Nội thất là lĩnh vực dễ chuyển thành căn phòng nhất, vì chính căn phòng là chất liệu của bạn. Chọn màu và vật liệu tường, sàn gần với phong cách của mình, thêm đồ nội thất và đèn phù hợp, treo ảnh trước và sau khi thi công cạnh nhau trên một bức tường.',
          'Nếu bạn báo giá theo gói hoặc theo mét vuông, khối bảng giá giúp trình bày rõ ràng, còn biểu mẫu đặt lịch nhận yêu cầu tư vấn kèm ngày hẹn. Mẫu thiết kế nội thất trên Perlink đã có sẵn bố cục này.',
        ],
      },
      {
        title: 'Để đúng khách hàng tìm thấy bạn',
        paragraphs: [
          'Trang portfolio là một trang web thật, nên hãy đặt tiêu đề và mô tả nói rõ bạn thiết kế gì và ở đâu, ví dụ “Kiến trúc sư nhà ở tại Đà Nẵng”. Chọn ảnh chia sẻ để khi gửi link qua Zalo, Facebook hay LinkedIn, khung xem trước hiện dự án đẹp nhất của bạn thay vì một ô trống.',
          'In mã QR lên danh thiếp hoặc pano dự án ở triển lãm, và gắn link vào chữ ký email. Với gói Plus, bạn nối được tên miền riêng của văn phòng; địa chỉ perlink.to vẫn tiếp tục hoạt động.',
        ],
      },
    ],
    table: {
      title: 'Portfolio PDF hay portfolio 3D',
      columns: ['', 'Portfolio PDF', 'Portfolio 3D trên Perlink'],
      rows: [
        ['Mở trên điện thoại', 'Chậm, phải phóng to', 'Trang nhanh, làm cho điện thoại'],
        ['Cảm giác không gian', 'Không có', 'Căn phòng để khách dạo quanh'],
        ['Cập nhật dự án', 'Xuất lại file rồi gửi lại', 'Sửa trực tuyến, cập nhật ngay'],
        ['Tìm thấy trên Google', 'Hiếm khi', 'Có tiêu đề, mô tả và địa chỉ riêng'],
        ['Liên hệ, đặt lịch', 'Một dòng email ở trang cuối', 'Biểu mẫu và đặt lịch ngay trên trang'],
      ],
    },
    stepsTitle: 'Làm portfolio kiến trúc của bạn',
    steps: [
      { title: 'Chọn địa chỉ và mẫu', text: 'Chọn perlink.to/tên-bạn và bắt đầu từ mẫu thiết kế nội thất hoặc portfolio cá nhân.' },
      { title: 'Thêm năm đến tám dự án', text: 'Mỗi dự án một khối thông tin và một album ảnh. Ghi chú rõ đâu là phối cảnh.' },
      { title: 'Sắp xếp căn phòng', text: 'Chọn vùng đất và ánh sáng, chỉnh vật liệu tường sàn theo phong cách của bạn, treo ảnh đại diện từng dự án.' },
      { title: 'Gắn link hồ sơ đầy đủ', text: 'Đặt link trên laptop hoặc khung tranh tới file PDF, bản vẽ chi tiết cho ai muốn xem thêm.' },
      { title: 'Thêm liên hệ và đặt lịch', text: 'Biểu mẫu liên hệ cho văn phòng tuyển dụng, biểu mẫu đặt lịch có ngày hẹn cho khách cần tư vấn.' },
      { title: 'Đăng và chia sẻ', text: 'Đặt tiêu đề SEO và ảnh chia sẻ, rồi đưa link và mã QR lên danh thiếp, CV và chữ ký email.' },
    ],
    faq: [
      { q: 'Tôi có phải dựng mô hình 3D công trình không?', a: 'Không. Phòng trên Perlink là phòng trưng bày tác phẩm, không phải mô hình dự án. Bạn treo phối cảnh, ảnh và bản vẽ vào đó, rồi sắp xếp đồ nội thất có sẵn. Không phải dựng hình, không cần xuất file từ SketchUp hay Blender.' },
      { q: 'Tôi có đưa phối cảnh và bản vẽ của mình lên được không?', a: 'Được. Tải ảnh lên album trên trang và vào các khung tranh trong phòng. Khách chạm vào khung là xem ảnh cỡ lớn. Hồ sơ dự án dài thì gắn link tới file PDF.' },
      { q: 'Nhiều ảnh độ phân giải cao thì có chậm không?', a: 'Tùy vào ảnh bạn tải lên. Xuất phối cảnh khoảng 2000 px, định dạng JPEG hoặc WebP là trang vẫn nhanh. Phòng 3D tự điều chỉnh chất lượng theo máy của người xem.' },
      { q: 'Dùng để nộp hồ sơ vào văn phòng kiến trúc có ổn không?', a: 'Ổn. Nhiều nơi vẫn yêu cầu PDF; bạn cứ gửi, rồi thêm link portfolio vào email và CV. Link cho họ xem nhanh bộ dự án chọn lọc, còn căn phòng cho thấy bạn chăm chút cách trình bày.' },
      { q: 'Tôi có dùng tên miền riêng của văn phòng được không?', a: 'Được, với gói Plus (3 tên miền, 500.000đ/tháng) hoặc Max (20 tên miền). Địa chỉ perlink.to vẫn hoạt động sau khi bạn nối tên miền.' },
      { q: 'Có miễn phí không?', a: 'Gói miễn phí cho bạn làm và đăng một trang, có phòng 3D và thống kê 30 ngày, không giới hạn thời gian. Gói trả phí có thêm trang, theme Pro, thống kê dài hơn và tên miền riêng.' },
      { q: 'Người làm thiết kế nội thất dùng có hợp không?', a: 'Rất hợp. Chọn vật liệu và đồ nội thất trong phòng theo phong cách của bạn, đưa ảnh trước và sau thi công, báo giá theo gói hoặc theo mét vuông và nhận lịch tư vấn.' },
    ],
    ctaTitle: 'Để khách bước vào công trình của bạn',
    ctaText: 'Chọn địa chỉ và treo dự án lên tường. Miễn phí để bắt đầu, xong trong một buổi chiều.',
  },
}
