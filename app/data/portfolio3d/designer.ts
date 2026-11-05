import type { PortfolioTopic } from './types'

// "3D portfolio for designers": graphic, UI/UX, product and brand designers
export const DESIGNER_TOPIC: PortfolioTopic = {
  id: 'designer',
  path: { en: 'designer', vi: 'designer' },
  demo: 'designer',
  templates: ['creator', 'creative-agency', 'personal', 'personal-aesthetic'],
  updated: '2026-11-06',
  readMinutes: 6,
  en: {
    seoTitle: '3D Portfolio for Designers, No Code | Perlink',
    description: 'How to make a 3D portfolio as a designer: what to show, how to write case studies, and how a walkable room helps clients remember your work. Free to start.',
    eyebrow: '3D portfolio for designers',
    title: 'A 3D portfolio for designers that shows how you think',
    intro: 'A designer’s portfolio is judged in a minute or two, and most of them look alike: a grid of polished mockups. A 3D portfolio gives you a second way in. Your case studies live on a clean, fast page, and the same work hangs on the walls of a small room people can walk around, so you are the designer they remember.',
    demoTitle: 'A designer’s room, live',
    demoText: 'Drag to look around, scroll or pinch to zoom, and tap a frame to see the work large. This is the room that comes with the designer templates.',
    sections: [
      {
        title: 'What people hiring designers actually look for',
        paragraphs: [
          'Art directors, design leads and clients rarely read a portfolio from top to bottom. They scan for three things: whether your taste fits their work, whether you can explain your decisions, and whether you finish things. Final mockups only answer the first question.',
          'That is why the strongest design portfolios read like short stories: the problem, what you tried, what you chose and why, and what changed after. A 3D room does not replace that story. It gets people curious enough to read it.',
        ],
        bullets: [
          'Taste: a few projects that look like the work you want to be hired for',
          'Thinking: sketches, flows, rejected options and the reason behind the final one',
          'Results: what happened after launch, even if it is a small, honest result',
          'Range, but not noise: two or three kinds of work, not ten',
        ],
      },
      {
        title: 'How many projects to show',
        paragraphs: [
          'Four to six projects is enough for most designers. Lead with the one closest to the job or client you want next, not the one you are proudest of from years ago. If you are moving from graphic design into UI/UX, put the product work first, even if it is a personal project.',
          'Every project you add makes the others a little weaker if it is not as good. Cutting a project is usually the fastest way to improve a portfolio.',
        ],
      },
      {
        title: 'A case study structure that works on a phone',
        paragraphs: [
          'Many reviewers open your link from a message or an email on their phone. Long scrolling PDFs and huge images are hard to read there. Keep each case study short and in this order:',
        ],
        bullets: [
          'One line on the problem and who it was for',
          'Your role, the team and the time it took',
          'Two or three process images: sketches, wireframes, a user flow',
          'The final design, with one sentence on the key decision',
          'The outcome: a number if you have one, or what the client or users said',
        ],
      },
      {
        title: 'Where the 3D room helps a designer',
        paragraphs: [
          'Designers are expected to have an eye for presentation, so the way you show your work is part of the work. A room you can walk into says that before anyone reads a word.',
          'On Perlink, picture frames show your own images, and visitors tap a frame to see it large. Hang your best piece on the back wall, process shots on the side wall, and put a neon sign with your name or your discipline above the desk. A frame or the laptop can link to the full case study, your Behance or your Dribbble.',
          'Pick a land and light that match your style: a calm zen garden for minimal work, a city at night for bold brand work, sakura for something soft. Then record a short vertical tour of the room in the editor and post it on Instagram, TikTok or LinkedIn. A moving room gets more attention in a feed than another static mockup.',
        ],
      },
      {
        title: 'Prepare your images before you upload',
        paragraphs: [
          'Good images make a portfolio feel finished. A few habits help on both the page and in the room:',
        ],
        bullets: [
          'Export at around 2000 px on the long side; larger files only slow the page down',
          'Use the same background colour or mockup style across one project',
          'Crop to the interesting part; nobody needs a full browser window around a button',
          'Write a short alt text and caption, so search engines and screen readers know what it is',
        ],
      },
      {
        title: 'Common mistakes in design portfolios',
        paragraphs: [
          'Most weak design portfolios fail in the same ways, and all of them are easy to fix.',
        ],
        bullets: [
          'Only final shots, with no sign of the process behind them',
          'Concept work presented as if it were shipped client work',
          'No contact details, or a contact form hidden at the very bottom',
          'Copying a famous portfolio layout so closely that yours looks like a template',
          'Not updating for a year, so the newest project is your oldest skill',
        ],
      },
    ],
    table: {
      title: 'A PDF portfolio, a Behance page or a 3D portfolio',
      columns: ['', 'PDF or Behance', 'Perlink 3D portfolio'],
      rows: [
        ['Opens well on a phone', 'Often slow or tiny', 'Yes, page made for phones first'],
        ['Your own address', 'A file or a profile on someone else’s site', 'perlink.to/yourname or your own domain'],
        ['Memorable first impression', 'Looks like everyone else’s', 'A room people walk around'],
        ['Contact or booking form', 'No', 'Yes, on the page'],
        ['See who visited', 'Limited or none', 'Visits and clicks per site'],
      ],
    },
    stepsTitle: 'Make your design portfolio in six steps',
    steps: [
      { title: 'Pick a designer template', text: 'Start from an artist, studio or personal portfolio template. Each comes with a matching 3D room.' },
      { title: 'Choose four to six projects', text: 'Lead with the work closest to the job or clients you want next.' },
      { title: 'Write short case studies', text: 'Problem, your role, process, final design, outcome. Use a text block and an image album for each.' },
      { title: 'Dress the room', text: 'Put your images in the frames, add a neon sign with your name, pick a land and the light.' },
      { title: 'Add a way to reach you', text: 'A contact form, your email and links to Behance, Dribbble or LinkedIn.' },
      { title: 'Publish and share', text: 'Put perlink.to/yourname in your CV and bio, and post a tour video of the room.' },
    ],
    faq: [
      { q: 'Do I need to know Three.js, Blender or Spline?', a: 'No. Perlink builds the room for you. You choose the objects, move them around and put your images in the frames, all in a visual editor.' },
      { q: 'Will a 3D portfolio distract from my work?', a: 'Not if you keep it simple. Your case studies stay on a normal, readable page, and the room is a way into them. You can choose whether visitors see the page or the room first.' },
      { q: 'Can I link to my Behance, Dribbble or full case studies?', a: 'Yes. Add them as links on the page, and attach a link to a frame, the laptop or the neon sign in the room.' },
      { q: 'Is it free?', a: 'Yes. The free plan gives you one site with the page, the 3D room and 30 days of analytics, with no time limit. Paid plans add more sites, Pro themes and longer analytics.' },
      { q: 'Can I use my own domain?', a: 'Yes, on the Plus plan ($20 a month, up to 3 domains) or Max. Your perlink.to address keeps working too.' },
      { q: 'Does it work for UI/UX designers, or only for visual work?', a: 'Both. UI/UX designers can put flows and screens in the frames and keep the full case study on the page, with a timeline block for the process.' },
      { q: 'Can I update it from my phone?', a: 'Yes. The editor works on phones and computers, so you can add a new project the day it ships.' },
    ],
    ctaTitle: 'Make the portfolio they remember',
    ctaText: 'Claim your address, pick a designer template and have your page and room live today. Free to start.',
  },
  vi: {
    seoTitle: 'Portfolio 3D cho designer, không cần code | Perlink',
    description: 'Cách làm portfolio 3D cho designer: chọn dự án nào, viết case study ra sao, và vì sao một căn phòng 3D giúp khách hàng nhớ đến bạn. Bắt đầu miễn phí.',
    eyebrow: 'Portfolio 3D cho designer',
    title: 'Portfolio 3D cho designer, để người xem thấy cách bạn tư duy',
    intro: 'Người tuyển dụng chỉ lướt portfolio của designer trong một, hai phút, và phần lớn portfolio trông na ná nhau: một lưới mockup bóng bẩy. Portfolio 3D cho bạn thêm một lối vào. Case study nằm trên một trang gọn, tải nhanh, còn chính các tác phẩm đó được treo trên tường một căn phòng nhỏ để người xem dạo quanh. Nhờ vậy bạn là designer mà họ nhớ.',
    demoTitle: 'Phòng của một designer, xem trực tiếp',
    demoText: 'Kéo để nhìn quanh, cuộn hoặc chụm hai ngón để phóng to, chạm vào khung tranh để xem tác phẩm lớn. Đây là căn phòng đi kèm các mẫu dành cho designer.',
    sections: [
      {
        title: 'Người tuyển designer thật sự tìm gì',
        paragraphs: [
          'Art director, trưởng nhóm thiết kế hay khách hàng hiếm khi đọc hết portfolio. Họ lướt để tìm ba điều: gu của bạn có hợp với công việc của họ không, bạn có giải thích được lựa chọn của mình không, và bạn có làm đến nơi đến chốn không. Mockup thành phẩm chỉ trả lời được câu đầu.',
          'Vì vậy portfolio thiết kế mạnh nhất thường đọc như một câu chuyện ngắn: vấn đề là gì, bạn đã thử gì, chọn gì và vì sao, sau đó điều gì thay đổi. Căn phòng 3D không thay thế câu chuyện ấy. Nó khiến người xem đủ tò mò để đọc.',
        ],
        bullets: [
          'Gu: vài dự án giống kiểu việc bạn muốn được thuê làm',
          'Tư duy: bản phác, luồng người dùng, phương án bị loại và lý do chọn phương án cuối',
          'Kết quả: điều gì xảy ra sau khi ra mắt, dù là kết quả nhỏ nhưng thật',
          'Đa dạng vừa đủ: hai, ba mảng việc, không phải mười',
        ],
      },
      {
        title: 'Nên đưa bao nhiêu dự án',
        paragraphs: [
          'Với đa số designer, bốn đến sáu dự án là đủ. Đặt lên đầu dự án gần nhất với công việc hoặc khách hàng bạn muốn có tiếp theo, không phải dự án bạn tự hào nhất từ nhiều năm trước. Nếu bạn đang chuyển từ thiết kế đồ họa sang UI/UX, hãy để dự án sản phẩm lên trước, kể cả khi đó là dự án cá nhân.',
          'Mỗi dự án chưa đủ tốt mà bạn thêm vào sẽ kéo những dự án còn lại xuống. Bớt một dự án thường là cách nhanh nhất để portfolio tốt lên.',
        ],
      },
      {
        title: 'Cấu trúc case study đọc tốt trên điện thoại',
        paragraphs: [
          'Nhiều người mở link portfolio từ tin nhắn hay email ngay trên điện thoại. PDF dài và ảnh nặng rất khó xem ở đó. Hãy giữ mỗi case study ngắn gọn, theo thứ tự:',
        ],
        bullets: [
          'Một câu về vấn đề và đối tượng sử dụng',
          'Vai trò của bạn, nhóm làm cùng và thời gian thực hiện',
          'Hai, ba hình về quá trình: phác thảo, wireframe, luồng người dùng',
          'Thiết kế cuối cùng, kèm một câu về quyết định quan trọng nhất',
          'Kết quả: một con số nếu có, hoặc điều khách hàng, người dùng nói',
        ],
      },
      {
        title: 'Căn phòng 3D giúp gì cho designer',
        paragraphs: [
          'Designer được kỳ vọng biết cách trình bày, nên cách bạn trưng bày tác phẩm cũng là một phần của tác phẩm. Một căn phòng bước vào được nói điều đó trước khi ai đọc chữ nào.',
          'Trên Perlink, khung tranh hiển thị ảnh của chính bạn, và khách chạm vào khung để xem ảnh lớn. Treo tác phẩm đẹp nhất ở tường chính, ảnh quá trình ở tường bên, đặt một biển neon có tên hoặc chuyên môn của bạn phía trên bàn làm việc. Khung tranh hay chiếc laptop có thể dẫn tới case study đầy đủ, Behance hoặc Dribbble của bạn.',
          'Chọn vùng đất và ánh sáng hợp với phong cách: vườn thiền yên tĩnh cho lối thiết kế tối giản, thành phố về đêm cho thương hiệu táo bạo, hoa anh đào cho nét mềm mại. Sau đó quay một video dọc dạo quanh phòng ngay trong trình chỉnh sửa và đăng lên Instagram, TikTok hay LinkedIn. Một căn phòng chuyển động nổi bật trên bảng tin hơn thêm một tấm mockup tĩnh.',
        ],
      },
      {
        title: 'Chuẩn bị ảnh trước khi tải lên',
        paragraphs: [
          'Ảnh tốt làm portfolio trông chỉn chu. Vài thói quen nhỏ có ích cho cả trang lẫn căn phòng:',
        ],
        bullets: [
          'Xuất ảnh khoảng 2000 px ở cạnh dài; lớn hơn chỉ làm trang chậm',
          'Trong một dự án, dùng chung màu nền hoặc kiểu mockup',
          'Cắt vào phần đáng xem, không cần cả khung trình duyệt quanh một cái nút',
          'Viết chú thích và alt text ngắn để công cụ tìm kiếm và trình đọc màn hình hiểu ảnh là gì',
        ],
      },
      {
        title: 'Những lỗi hay gặp trong portfolio thiết kế',
        paragraphs: [
          'Portfolio thiết kế yếu thường mắc cùng một số lỗi, và lỗi nào cũng dễ sửa.',
        ],
        bullets: [
          'Chỉ có ảnh thành phẩm, không thấy quá trình phía sau',
          'Dự án concept được trình bày như dự án thật đã ra mắt cho khách',
          'Không có thông tin liên hệ, hoặc form liên hệ nằm tận cuối trang',
          'Bắt chước bố cục một portfolio nổi tiếng đến mức trông như mẫu có sẵn',
          'Cả năm không cập nhật, nên dự án mới nhất lại là kỹ năng cũ nhất',
        ],
      },
    ],
    table: {
      title: 'Portfolio PDF, trang Behance hay portfolio 3D',
      columns: ['', 'PDF hoặc Behance', 'Portfolio 3D trên Perlink'],
      rows: [
        ['Xem tốt trên điện thoại', 'Thường chậm hoặc chữ nhỏ', 'Có, trang làm cho điện thoại trước'],
        ['Địa chỉ riêng của bạn', 'Một tệp, hoặc hồ sơ trên trang của người khác', 'perlink.to/tên-bạn hoặc tên miền riêng'],
        ['Ấn tượng đầu tiên', 'Giống của mọi người', 'Một căn phòng để dạo quanh'],
        ['Form liên hệ, đặt lịch', 'Không', 'Có, ngay trên trang'],
        ['Biết ai đã xem', 'Hạn chế hoặc không có', 'Lượt xem và lượt bấm cho từng trang'],
      ],
    },
    stepsTitle: 'Làm portfolio thiết kế trong sáu bước',
    steps: [
      { title: 'Chọn mẫu cho designer', text: 'Bắt đầu từ mẫu portfolio họa sĩ, studio hoặc cá nhân. Mẫu nào cũng có sẵn phòng 3D đi kèm.' },
      { title: 'Chọn bốn đến sáu dự án', text: 'Đặt lên đầu dự án gần nhất với công việc hay khách hàng bạn muốn có.' },
      { title: 'Viết case study ngắn', text: 'Vấn đề, vai trò, quá trình, thiết kế cuối, kết quả. Mỗi dự án một khối chữ và một album ảnh.' },
      { title: 'Bày biện căn phòng', text: 'Đưa ảnh vào khung tranh, thêm biển neon có tên bạn, chọn vùng đất và ánh sáng.' },
      { title: 'Thêm cách liên hệ', text: 'Một form liên hệ, email và link tới Behance, Dribbble hay LinkedIn.' },
      { title: 'Đăng và chia sẻ', text: 'Đặt perlink.to/tên-bạn vào CV và bio, rồi đăng video dạo quanh phòng.' },
    ],
    faq: [
      { q: 'Tôi có cần biết Three.js, Blender hay Spline không?', a: 'Không. Perlink dựng căn phòng cho bạn. Bạn chọn đồ vật, sắp xếp chúng và đưa ảnh vào khung tranh trong trình chỉnh sửa trực quan.' },
      { q: 'Portfolio 3D có làm người xem sao nhãng khỏi tác phẩm không?', a: 'Không, nếu bạn giữ nó đơn giản. Case study vẫn nằm trên một trang bình thường, dễ đọc, còn căn phòng là lối dẫn vào. Bạn tự chọn khách thấy trang hay phòng trước.' },
      { q: 'Tôi có gắn link Behance, Dribbble hay case study đầy đủ được không?', a: 'Được. Thêm chúng thành liên kết trên trang, và gắn link vào khung tranh, laptop hay biển neon trong phòng.' },
      { q: 'Có miễn phí không?', a: 'Có. Gói miễn phí gồm một trang với portfolio, phòng 3D và thống kê 30 ngày, không giới hạn thời gian. Gói trả phí có thêm trang, theme Pro và thống kê dài hơn.' },
      { q: 'Tôi dùng tên miền riêng được không?', a: 'Được, với gói Plus (20 USD một tháng, tối đa 3 tên miền) hoặc Max. Địa chỉ perlink.to của bạn vẫn hoạt động song song.' },
      { q: 'Designer UI/UX có dùng được không, hay chỉ hợp với thiết kế hình ảnh?', a: 'Cả hai. Designer UI/UX có thể đưa luồng và màn hình vào khung tranh, giữ case study đầy đủ trên trang, dùng khối timeline cho quá trình làm.' },
      { q: 'Tôi cập nhật bằng điện thoại được không?', a: 'Được. Trình chỉnh sửa chạy trên cả điện thoại và máy tính, nên dự án nào vừa ra mắt là bạn thêm vào ngay.' },
    ],
    ctaTitle: 'Làm portfolio khiến người ta nhớ',
    ctaText: 'Giữ địa chỉ của bạn, chọn một mẫu cho designer và đưa trang cùng căn phòng lên mạng ngay hôm nay. Bắt đầu miễn phí.',
  },
}
