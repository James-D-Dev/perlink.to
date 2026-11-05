import type { PortfolioTopic } from './types'

// "Free 3D portfolio": what is really free, here and elsewhere, and what each
// free route costs in time or gives up
export const FREE_TOPIC: PortfolioTopic = {
  id: 'free',
  path: { en: 'free', vi: 'mien-phi' },
  demo: 'designer',
  templates: ['personal', 'creator', 'photographer', 'personal-neon'],
  updated: '2026-11-06',
  readMinutes: 7,
  en: {
    seoTitle: 'Make a 3D Portfolio for Free, No Code | Perlink',
    description: 'How to make a 3D portfolio for free: what Perlink’s free plan includes, what it leaves out, and how it compares with coding one yourself in Three.js.',
    eyebrow: 'Free 3D portfolio',
    title: 'How to make a 3D portfolio for free',
    intro: 'You can have a 3D portfolio online today without paying anything. On Perlink’s free plan you get one site with a portfolio page, a 3D room visitors walk around and 30 days of analytics, with no time limit. This page explains exactly what is free, what you give up, and how it compares with the other free routes, including coding one yourself.',
    demoTitle: 'This room is on the free plan',
    demoText: 'Everything you can do in this room (frames with your work, the land, the light, links) is available without paying. Drag to look around and tap a frame.',
    sections: [
      {
        title: 'What is free on Perlink',
        paragraphs: [
          'The free plan is not a trial. It doesn’t end after 14 days and you don’t need a card to start: you sign in with Google, Facebook or TikTok and build.',
        ],
        bullets: [
          'One published site at perlink.to/yourname, with a portfolio page and its 3D room.',
          'All 11 lands, day, night or an automatic cycle, music from the library and the guestbook.',
          'Picture frames with your own photos, a neon sign with your own words, and links on objects.',
          'Page blocks for links, text, albums, timeline, video, testimonials, contact form and more.',
          'Your own SEO title, description and share image, a QR code, and 30 days of analytics.',
          'Recording a vertical tour video of your room for TikTok, Reels and Shorts.',
        ],
      },
      {
        title: 'What you give up on the free plan',
        paragraphs: [
          'It is fairer to say this plainly than to find out later. On the free plan:',
        ],
        bullets: [
          'You have one site. Starter ($6 a month) gives you three.',
          'Your address is perlink.to/yourname. A custom domain needs Plus ($20 a month).',
          'Analytics go back 30 days instead of 90 days or more.',
          'Pro themes can’t be published, and room videos carry a watermark.',
          'The small “Made with Perlink” badge appears at the bottom; for now it appears on every plan.',
        ],
      },
      {
        title: 'The other free route: code it yourself',
        paragraphs: [
          'Many of the best-known 3D portfolios are built by hand with Three.js or a similar library and hosted for free on GitHub Pages, Netlify or Vercel. The hosting really is free, and the result can be completely unique.',
          'The cost is time. You need to be comfortable with JavaScript and 3D (models, lighting, cameras, performance on phones), and a polished one usually takes weeks. Every later change, like a new project, means editing code and deploying again. If you are a developer and the portfolio itself is the showcase, that time is well spent. If you just want your work online and noticed this month, it usually isn’t.',
        ],
      },
      {
        title: 'Generic website builders',
        paragraphs: [
          'Free tiers of general website builders give you a page quickly, but rarely a walkable 3D space. Some let you embed a 3D model viewer, which shows one object rather than a place to explore. Free tiers also tend to add their own branding and a long subdomain, similar to what you give up here.',
        ],
      },
      {
        title: 'Getting the most out of a free portfolio',
        paragraphs: [
          'A free portfolio can work as hard as a paid one if the content is good. Pick a short address close to your name. Choose five to eight strong pieces rather than everything. Write a clear SEO title such as “Product designer in Hanoi” so search engines know what you do. Set a share image so your link looks good in messages, and put the QR code on your CV or card.',
          'When you outgrow it (a second site for a side project, your own domain, longer analytics), you can upgrade from the dashboard and your site keeps its address and content.',
        ],
      },
    ],
    table: {
      title: 'Free routes to a 3D portfolio, compared',
      columns: ['', 'Perlink free plan', 'Coding it yourself (Three.js + free hosting)'],
      rows: [
        ['Money', 'Free, no time limit', 'Free hosting; a domain is extra'],
        ['Time to go live', 'An afternoon', 'Usually weeks'],
        ['Skills needed', 'None beyond editing a page', 'JavaScript, 3D, performance work'],
        ['Walkable 3D room', 'Included', 'As far as you build it'],
        ['Plain page for phones and search', 'Included', 'You build it too'],
        ['Updating your work', 'In the editor, phone or computer', 'Edit code and deploy'],
        ['Address', 'perlink.to/yourname', 'yourname.github.io or similar'],
        ['Branding', 'Small Perlink badge', 'None'],
      ],
    },
    stepsTitle: 'Make your free 3D portfolio',
    steps: [
      { title: 'Sign in with Google, Facebook or TikTok', text: 'No card. Choose your address, ideally close to your real name.' },
      { title: 'Pick a portfolio template', text: 'Designer, artist, photographer or developer, each with a matching room.' },
      { title: 'Replace the sample work', text: 'Your name, a line about you, five to eight pieces and your links.' },
      { title: 'Arrange your room', text: 'Pick a land and the light, hang your best work in the frames, write your neon sign.' },
      { title: 'Publish and share', text: 'Set the SEO title and share image, then put the link in your bio, CV and email.' },
    ],
    faq: [
      { q: 'Is the free plan really free forever?', a: 'There is no time limit on the free plan. Your site stays online as long as it follows the rules and you keep your account.' },
      { q: 'Do I need a credit card to sign up?', a: 'No. You sign in with Google, Facebook or TikTok. You only pay if you choose to upgrade.' },
      { q: 'Can I remove the “Made with Perlink” badge?', a: 'Not at the moment: the badge shows on every plan for now. It is small and sits at the bottom of the page.' },
      { q: 'Can I use my own domain for free?', a: 'No. Custom domains come with Plus ($20 or 500.000đ a month, 3 domains) and Max (20 domains). On the free plan your address is perlink.to/yourname.' },
      { q: 'Is a free 3D portfolio good enough for job applications?', a: 'Yes. Recruiters judge the work and how clearly it is presented, not the plan behind it. A short address, a good selection and clear descriptions matter far more.' },
      { q: 'What happens to my site if I upgrade later?', a: 'It keeps its address, content and room. You simply get more: more sites, Pro themes, longer analytics or a custom domain. There is a 7-day Plus trial and a 7-day money-back guarantee.' },
      { q: 'Wouldn’t coding my own be better?', a: 'If you are a developer and want the portfolio itself to show your 3D skills, building it yourself is worth it. For most designers, photographers, architects and students, the time is better spent on the work you show.' },
    ],
    ctaTitle: 'Start your free 3D portfolio',
    ctaText: 'Pick your address now. No card, no time limit, and you can publish today.',
  },
  vi: {
    seoTitle: 'Làm portfolio 3D miễn phí, không cần code | Perlink',
    description: 'Cách làm portfolio 3D miễn phí: gói miễn phí của Perlink có gì, thiếu gì, và so với tự code bằng Three.js rồi đăng lên hosting miễn phí thì ra sao.',
    eyebrow: 'Portfolio 3D miễn phí',
    title: 'Cách làm portfolio 3D miễn phí',
    intro: 'Bạn có thể có portfolio 3D trên mạng ngay hôm nay mà không tốn đồng nào. Gói miễn phí của Perlink cho bạn một trang gồm portfolio, một căn phòng 3D để khách dạo quanh và thống kê 30 ngày, không giới hạn thời gian. Bài này nói rõ cái gì miễn phí, bạn phải chấp nhận thiếu gì, và so sánh với các cách miễn phí khác, kể cả tự viết code.',
    demoTitle: 'Căn phòng này làm được trên gói miễn phí',
    demoText: 'Mọi thứ trong phòng này (khung tranh với tác phẩm, vùng đất, ánh sáng, đường link) đều dùng được mà không phải trả tiền. Kéo để nhìn quanh và chạm vào khung tranh.',
    sections: [
      {
        title: 'Trên Perlink, cái gì miễn phí',
        paragraphs: [
          'Gói miễn phí không phải bản dùng thử. Nó không hết hạn sau 14 ngày và bạn không cần thẻ để bắt đầu: đăng nhập bằng Google, Facebook hoặc TikTok là làm được.',
        ],
        bullets: [
          'Một trang đang hoạt động tại perlink.to/tên-bạn, gồm trang portfolio và phòng 3D đi kèm.',
          'Đủ 11 vùng đất, chế độ ngày, đêm hoặc tự chuyển, nhạc trong thư viện và sổ lưu bút.',
          'Khung tranh với ảnh của bạn, bảng neon viết chữ tùy ý, gắn link lên đồ vật.',
          'Các khối nội dung: link, văn bản, album ảnh, dòng thời gian, video, nhận xét, biểu mẫu liên hệ và nhiều hơn.',
          'Tiêu đề, mô tả SEO và ảnh chia sẻ riêng, mã QR, thống kê 30 ngày.',
          'Quay video dọc dạo quanh phòng cho TikTok, Reels và Shorts.',
        ],
      },
      {
        title: 'Dùng miễn phí thì thiếu gì',
        paragraphs: [
          'Nói rõ từ đầu vẫn hơn để bạn tự phát hiện sau. Với gói miễn phí:',
        ],
        bullets: [
          'Bạn có một trang. Gói Starter (150.000đ/tháng) cho ba trang.',
          'Địa chỉ là perlink.to/tên-bạn. Muốn dùng tên miền riêng cần gói Plus (500.000đ/tháng).',
          'Thống kê xem được 30 ngày gần nhất thay vì 90 ngày trở lên.',
          'Không đăng được trang dùng theme Pro, video căn phòng có watermark.',
          'Có huy hiệu nhỏ “Made with Perlink” ở cuối trang; hiện tại gói nào cũng có huy hiệu này.',
        ],
      },
      {
        title: 'Cách miễn phí khác: tự viết code',
        paragraphs: [
          'Nhiều portfolio 3D nổi tiếng được tự tay viết bằng Three.js hoặc thư viện tương tự, rồi đăng miễn phí lên GitHub Pages, Netlify hay Vercel. Hosting đúng là miễn phí, và sản phẩm có thể độc nhất vô nhị.',
          'Cái giá là thời gian. Bạn cần vững JavaScript và 3D (mô hình, ánh sáng, camera, tối ưu cho điện thoại), và một bản chỉn chu thường mất vài tuần. Mỗi lần sửa về sau, như thêm một dự án, là một lần sửa code và đăng lại. Nếu bạn là lập trình viên và chính portfolio là thứ để khoe tay nghề, thời gian đó đáng bỏ ra. Còn nếu bạn chỉ cần tác phẩm lên mạng và được chú ý trong tháng này thì thường là không.',
        ],
      },
      {
        title: 'Các công cụ làm web phổ thông',
        paragraphs: [
          'Gói miễn phí của các công cụ làm web phổ thông cho bạn một trang khá nhanh, nhưng hiếm khi có một không gian 3D để dạo quanh. Một số cho nhúng trình xem mô hình 3D, tức là xem một vật thể chứ không phải một nơi để khám phá. Gói miễn phí ở đó cũng thường gắn thương hiệu của họ và một tên miền phụ dài, tương tự những gì bạn chấp nhận ở đây.',
        ],
      },
      {
        title: 'Tận dụng tối đa portfolio miễn phí',
        paragraphs: [
          'Portfolio miễn phí vẫn hiệu quả như bản trả phí nếu nội dung tốt. Chọn địa chỉ ngắn, gần với tên thật. Chọn năm đến tám tác phẩm mạnh nhất thay vì đưa hết. Viết tiêu đề SEO rõ ràng như “Thiết kế sản phẩm tại Hà Nội” để công cụ tìm kiếm hiểu bạn làm gì. Đặt ảnh chia sẻ để link trông đẹp khi gửi qua Zalo, Messenger, và in mã QR lên CV hoặc danh thiếp.',
          'Khi cần nhiều hơn (một trang nữa cho dự án phụ, tên miền riêng, thống kê dài hơn), bạn nâng cấp ngay trong bảng điều khiển, trang vẫn giữ nguyên địa chỉ và nội dung.',
        ],
      },
    ],
    table: {
      title: 'So sánh các cách làm portfolio 3D miễn phí',
      columns: ['', 'Gói miễn phí Perlink', 'Tự code (Three.js + hosting miễn phí)'],
      rows: [
        ['Chi phí', 'Miễn phí, không giới hạn thời gian', 'Hosting miễn phí; tên miền tính thêm'],
        ['Thời gian để lên mạng', 'Một buổi chiều', 'Thường vài tuần'],
        ['Kỹ năng cần có', 'Chỉ cần biết chỉnh sửa trang', 'JavaScript, 3D, tối ưu hiệu năng'],
        ['Phòng 3D để dạo quanh', 'Có sẵn', 'Tùy bạn làm được tới đâu'],
        ['Trang thường cho điện thoại và Google', 'Có sẵn', 'Phải tự làm thêm'],
        ['Cập nhật tác phẩm', 'Trong trình chỉnh sửa, trên điện thoại hay máy tính', 'Sửa code rồi đăng lại'],
        ['Địa chỉ', 'perlink.to/tên-bạn', 'tên-bạn.github.io hoặc tương tự'],
        ['Thương hiệu', 'Huy hiệu Perlink nhỏ', 'Không có'],
      ],
    },
    stepsTitle: 'Làm portfolio 3D miễn phí',
    steps: [
      { title: 'Đăng nhập bằng Google, Facebook hoặc TikTok', text: 'Không cần thẻ. Chọn địa chỉ, tốt nhất là gần với tên thật của bạn.' },
      { title: 'Chọn mẫu portfolio', text: 'Cho designer, họa sĩ, nhiếp ảnh gia hay lập trình viên, mỗi mẫu có phòng 3D đi kèm.' },
      { title: 'Thay tác phẩm mẫu', text: 'Tên, một câu giới thiệu, năm đến tám tác phẩm và các đường link của bạn.' },
      { title: 'Sắp xếp căn phòng', text: 'Chọn vùng đất và ánh sáng, treo tác phẩm đẹp nhất vào khung, viết chữ lên bảng neon.' },
      { title: 'Đăng và chia sẻ', text: 'Đặt tiêu đề SEO và ảnh chia sẻ, rồi đưa link vào bio, CV và email.' },
    ],
    faq: [
      { q: 'Gói miễn phí có miễn phí mãi không?', a: 'Gói miễn phí không giới hạn thời gian. Trang của bạn vẫn hoạt động chừng nào còn tuân thủ quy định và bạn còn giữ tài khoản.' },
      { q: 'Đăng ký có cần thẻ thanh toán không?', a: 'Không. Bạn đăng nhập bằng Google, Facebook hoặc TikTok. Chỉ trả tiền khi tự chọn nâng cấp.' },
      { q: 'Có bỏ được huy hiệu “Made with Perlink” không?', a: 'Hiện tại thì chưa: gói nào cũng hiện huy hiệu này. Nó nhỏ và nằm ở cuối trang.' },
      { q: 'Dùng tên miền riêng miễn phí được không?', a: 'Không. Tên miền riêng có ở gói Plus (500.000đ/tháng, 3 tên miền) và Max (20 tên miền). Gói miễn phí dùng địa chỉ perlink.to/tên-bạn.' },
      { q: 'Portfolio 3D miễn phí có đủ để đi xin việc không?', a: 'Đủ. Nhà tuyển dụng đánh giá tác phẩm và cách trình bày, không xem bạn dùng gói nào. Địa chỉ ngắn, tác phẩm chọn lọc và mô tả rõ ràng quan trọng hơn nhiều.' },
      { q: 'Sau này nâng cấp thì trang có sao không?', a: 'Trang giữ nguyên địa chỉ, nội dung và căn phòng. Bạn chỉ có thêm: nhiều trang hơn, theme Pro, thống kê dài hơn hay tên miền riêng. Có 7 ngày dùng thử gói Plus và hoàn tiền trong 7 ngày.' },
      { q: 'Tự code chẳng phải tốt hơn sao?', a: 'Nếu bạn là lập trình viên và muốn chính portfolio thể hiện kỹ năng 3D, tự làm rất đáng. Với phần lớn designer, nhiếp ảnh gia, kiến trúc sư và sinh viên, thời gian đó nên dành cho tác phẩm bạn trưng bày.' },
    ],
    ctaTitle: 'Bắt đầu portfolio 3D miễn phí',
    ctaText: 'Chọn địa chỉ ngay bây giờ. Không cần thẻ, không giới hạn thời gian, đăng được ngay hôm nay.',
  },
}
