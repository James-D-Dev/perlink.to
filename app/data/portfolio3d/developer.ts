import type { PortfolioTopic } from './types'

// "3D developer portfolio": software engineers, front-end and game developers
export const DEVELOPER_TOPIC: PortfolioTopic = {
  id: 'developer',
  path: { en: 'developer', vi: 'lap-trinh-vien' },
  demo: 'developer',
  templates: ['personal-neon', 'personal', 'personal-resume'],
  updated: '2026-11-06',
  readMinutes: 6,
  en: {
    seoTitle: '3D Developer Portfolio Without the Weekend | Perlink',
    description: 'A 3D developer portfolio without spending weeks in Three.js: what recruiters check, which projects to show, and a room with your GitHub on the laptop.',
    eyebrow: '3D developer portfolio',
    title: 'A 3D developer portfolio, minus the weeks of Three.js',
    intro: 'Plenty of developers have planned a 3D portfolio in Three.js and never finished it, because the portfolio became the project. Perlink gives you the room ready-made: your projects on a clean page recruiters can scan, and a small 3D room with your GitHub on the laptop and your stack on a neon sign. Spend the time on the code you want to show instead.',
    demoTitle: 'A developer’s room, live',
    demoText: 'Drag to look around and scroll or pinch to zoom. Tap the frames to see the projects. On your own room, the laptop opens your GitHub.',
    sections: [
      {
        title: 'What recruiters and engineering managers check',
        paragraphs: [
          'A technical recruiter usually has your CV in one tab and your portfolio in another. They want to confirm, quickly, that the skills on the CV are real. An engineering manager goes one step further and opens your code.',
        ],
        bullets: [
          'Shipped things: a live link beats a screenshot, and a screenshot beats a description',
          'Code they can read: a public repository with a clear README',
          'What you did: on a team project, your part, in one or two sentences',
          'How you think: a short write-up of one hard problem and how you solved it',
          'Current stack: the languages and tools you use now, not every one you have touched',
        ],
      },
      {
        title: 'Which projects to show',
        paragraphs: [
          'Three to five projects is the right amount. Choose ones that match the job you want: a front-end role wants polished interfaces and performance work, a back-end role wants systems, data and reliability, a game or graphics role wants things that move.',
          'Tutorial clones (a to-do app, a weather app, a Netflix copy) are fine for learning, but they look the same in every portfolio. If you have one, add something of your own to it, or replace it with a small tool you actually use. Open source contributions count, even small ones; link the merged pull request.',
        ],
      },
      {
        title: 'A project card that answers the right questions',
        paragraphs: [
          'For each project, keep the same short structure, so a reader can compare them at a glance:',
        ],
        bullets: [
          'Name and one line on what it does and who uses it',
          'Stack, in a single line',
          'Your role and the size of the team',
          'One technical decision worth talking about in an interview',
          'Links: live demo, repository, and a write-up if you have one',
        ],
      },
      {
        title: 'Why not just build it yourself in Three.js?',
        paragraphs: [
          'If you are applying for WebGL or creative development roles, a hand-built 3D portfolio is itself the strongest project you can show, and you should build it. For everyone else, it is weeks of modelling, lighting, loading screens, mobile performance and accessibility work that says little about the job you are applying for.',
          'There is also a practical risk: a heavy 3D page that takes ten seconds to load on a recruiter’s phone is a worse first impression than a plain page. Perlink keeps a fast, readable page as the base, adapts the room’s quality to the device, and lets you choose whether visitors see the page or the room first.',
        ],
      },
      {
        title: 'Making the room yours as a developer',
        paragraphs: [
          'The room is where you show some personality without writing a line of rendering code. A few ideas that work well for developers:',
        ],
        bullets: [
          'Link the laptop on the desk to your GitHub, so the most obvious object opens your code',
          'Put your stack on a neon sign, or a line you like, such as “ship small, ship often”',
          'Hang screenshots of your projects in the frames; each frame can link to the live app',
          'Use the TV for a demo screenshot of your best project',
          'Choose the city at night or mars and a dark wall colour, if your page uses a dark theme',
          'Add the blog board if you write, and keep your technical posts on the site’s blog',
        ],
      },
      {
        title: 'Mistakes that cost developers interviews',
        paragraphs: [
          'Most of these take an evening to fix.',
        ],
        bullets: [
          'Dead demo links, or apps sleeping on a free host that take a minute to wake up',
          'Repositories with no README, or a README that is still the framework’s default',
          'A skills list with thirty logos and no sign of which ones you know well',
          'No email or LinkedIn on the page, so interested people have nowhere to go',
          'A portfolio that breaks on a phone, which is exactly where many recruiters open it',
        ],
      },
    ],
    table: {
      title: 'Building a 3D portfolio yourself or using Perlink',
      columns: ['', 'Three.js from scratch', 'Perlink'],
      rows: [
        ['Time to a live portfolio', 'Weeks', 'An evening'],
        ['Shows 3D graphics skills', 'Yes, strongly', 'No, it shows your other projects'],
        ['Fast page for recruiters and search engines', 'You build it too', 'Built in'],
        ['Hosting, address, analytics', 'You set them up', 'Included, perlink.to/yourname'],
        ['Updating a project', 'Edit code and redeploy', 'In the editor, on phone or computer'],
      ],
    },
    stepsTitle: 'Make your developer portfolio in six steps',
    steps: [
      { title: 'Start from the developer template', text: 'The neon developer template comes with a dark page, a projects timeline and a matching room.' },
      { title: 'Pick three to five projects', text: 'Match them to the role you want. Live link, repository and your part in each.' },
      { title: 'Write the project cards', text: 'One line on what it does, the stack, your role, one technical decision, the links.' },
      { title: 'Set up the room', text: 'Link the laptop to GitHub, write your stack on the neon sign, put screenshots in the frames.' },
      { title: 'Add contact and CV', text: 'Email, LinkedIn and a link to your CV, plus a contact form for freelance work.' },
      { title: 'Share it everywhere', text: 'Put perlink.to/yourname in your CV, GitHub profile and LinkedIn, and print the QR code if you go to events.' },
    ],
    faq: [
      { q: 'Should I build my portfolio in Three.js instead?', a: 'If you are applying for WebGL, graphics or creative developer roles, yes, because the portfolio is the proof. For front-end, back-end, mobile or full-stack roles, your time is better spent on the projects you show, and Perlink gives you the 3D room without the build.' },
      { q: 'Can I link to GitHub, live demos and my CV?', a: 'Yes. Add them as links on the page, and attach a link to the laptop, the neon sign or any frame in the room.' },
      { q: 'Is there a dark theme?', a: 'Yes. The neon developer template is dark, with a glowing accent, and you can change colours and fonts to your own.' },
      { q: 'Can I write technical posts?', a: 'Yes. Each site has a blog, and the free plan includes up to 50 published posts.' },
      { q: 'Will recruiters on slow phones see my work?', a: 'Yes. The portfolio is a normal web page first and loads quickly; the room adjusts its quality to the device and is one tap away.' },
      { q: 'Is it free?', a: 'Yes. One site with the page, the 3D room and 30 days of analytics is free with no time limit. Starter is $6 a month for more sites and Pro themes.' },
      { q: 'Can I use my own domain, like yourname.dev?', a: 'Yes, on the Plus plan ($20 a month, up to 3 domains) or Max. Your perlink.to address keeps working too.' },
    ],
    ctaTitle: 'Ship your portfolio tonight',
    ctaText: 'Claim your address, start from the developer template, and spend the rest of the week on code.',
  },
  vi: {
    seoTitle: 'Portfolio 3D lập trình viên, không cần Three.js | Perlink',
    description: 'Làm portfolio 3D cho lập trình viên mà không mất hàng tuần với Three.js: nhà tuyển dụng xem gì, nên đưa dự án nào, và phòng 3D có laptop dẫn tới GitHub.',
    eyebrow: 'Portfolio 3D cho lập trình viên',
    title: 'Portfolio 3D cho lập trình viên, khỏi mất cả tháng với Three.js',
    intro: 'Rất nhiều lập trình viên từng định tự làm portfolio 3D bằng Three.js rồi bỏ dở, vì chính cái portfolio đã thành một dự án lớn. Perlink dựng sẵn căn phòng cho bạn. Dự án nằm trên một trang gọn để nhà tuyển dụng lướt nhanh, còn trong căn phòng 3D nhỏ, chiếc laptop dẫn tới GitHub và tấm biển neon ghi stack của bạn. Thời gian còn lại, bạn dành cho phần code muốn khoe.',
    demoTitle: 'Phòng của một lập trình viên, xem trực tiếp',
    demoText: 'Kéo để nhìn quanh, cuộn hoặc chụm hai ngón để phóng to, chạm vào khung tranh để xem dự án. Trong phòng của bạn, chiếc laptop sẽ mở GitHub.',
    sections: [
      {
        title: 'Nhà tuyển dụng và trưởng nhóm kỹ thuật xem gì',
        paragraphs: [
          'Người tuyển dụng IT thường mở CV ở một tab và portfolio ở tab bên cạnh. Họ muốn xác nhận thật nhanh rằng kỹ năng ghi trong CV là thật. Trưởng nhóm kỹ thuật đi xa hơn một bước: họ mở code của bạn ra đọc.',
        ],
        bullets: [
          'Sản phẩm đã chạy: link dùng thử hơn ảnh chụp, ảnh chụp hơn lời mô tả',
          'Code đọc được: repository công khai có README rõ ràng',
          'Phần bạn làm: với dự án nhóm, một hai câu về đúng phần của bạn',
          'Cách bạn nghĩ: một bài viết ngắn về một vấn đề khó và cách bạn giải',
          'Stack hiện tại: ngôn ngữ và công cụ bạn đang dùng, không phải mọi thứ từng chạm tới',
        ],
      },
      {
        title: 'Nên đưa dự án nào',
        paragraphs: [
          'Ba đến năm dự án là vừa. Chọn dự án hợp với vị trí bạn ứng tuyển: front-end cần giao diện chỉn chu và tối ưu hiệu năng, back-end cần hệ thống, dữ liệu và độ ổn định, còn game hay đồ họa thì cần thứ gì đó chuyển động.',
          'Những bản sao theo tutorial (ứng dụng to-do, ứng dụng thời tiết, bản sao Netflix) tốt để học, nhưng portfolio nào cũng có. Nếu bạn có một cái như vậy, hãy thêm điểm riêng của mình vào, hoặc thay bằng một công cụ nhỏ mà chính bạn đang dùng. Đóng góp mã nguồn mở cũng tính, dù nhỏ; hãy dẫn link tới pull request đã được merge.',
        ],
      },
      {
        title: 'Thẻ dự án trả lời đúng câu hỏi',
        paragraphs: [
          'Mỗi dự án nên theo cùng một cấu trúc ngắn để người đọc so sánh trong một cái nhìn:',
        ],
        bullets: [
          'Tên dự án và một câu: nó làm gì, ai dùng',
          'Stack, gói trong một dòng',
          'Vai trò của bạn và quy mô nhóm',
          'Một quyết định kỹ thuật đáng đem ra nói trong buổi phỏng vấn',
          'Liên kết: bản chạy thử, repository, và bài viết nếu có',
        ],
      },
      {
        title: 'Sao không tự viết bằng Three.js?',
        paragraphs: [
          'Nếu bạn ứng tuyển vị trí WebGL hay creative developer, một portfolio 3D tự viết chính là dự án mạnh nhất bạn có thể khoe, và bạn nên tự làm. Với những vị trí khác, đó là hàng tuần dựng mô hình, ánh sáng, màn hình tải, tối ưu cho điện thoại và trợ năng, nhưng lại nói rất ít về công việc bạn đang ứng tuyển.',
          'Còn một rủi ro thực tế: một trang 3D nặng, mất mười giây mới mở được trên điện thoại của nhà tuyển dụng, để lại ấn tượng tệ hơn một trang đơn giản. Perlink giữ một trang nhanh, dễ đọc làm nền, tự chỉnh chất lượng phòng theo máy, và để bạn chọn khách thấy trang hay phòng trước.',
        ],
      },
      {
        title: 'Biến căn phòng thành chỗ của một dev',
        paragraphs: [
          'Căn phòng là nơi bạn thể hiện cá tính mà không cần viết dòng code dựng hình nào. Vài ý tưởng hợp với lập trình viên:',
        ],
        bullets: [
          'Gắn link GitHub vào chiếc laptop trên bàn, để món đồ dễ thấy nhất mở ra code của bạn',
          'Ghi stack lên biển neon, hoặc một câu bạn thích như “ship small, ship often”',
          'Treo ảnh chụp các dự án trong khung tranh, mỗi khung dẫn tới bản chạy thật',
          'Dùng chiếc TV cho ảnh demo của dự án tốt nhất',
          'Chọn thành phố về đêm hoặc sao Hỏa với tường màu tối nếu trang của bạn dùng giao diện tối',
          'Thêm bảng blog nếu bạn viết bài, và đăng bài kỹ thuật lên blog của trang',
        ],
      },
      {
        title: 'Những lỗi khiến dev mất cơ hội phỏng vấn',
        paragraphs: [
          'Phần lớn chỉ mất một buổi tối để sửa.',
        ],
        bullets: [
          'Link demo chết, hoặc ứng dụng chạy trên host miễn phí phải chờ cả phút mới thức dậy',
          'Repository không có README, hoặc README vẫn là bản mặc định của framework',
          'Danh sách kỹ năng ba mươi cái logo mà không biết bạn giỏi cái nào',
          'Không có email hay LinkedIn trên trang, người quan tâm không biết liên hệ đâu',
          'Portfolio vỡ giao diện trên điện thoại, đúng nơi nhiều nhà tuyển dụng mở nó',
        ],
      },
    ],
    table: {
      title: 'Tự làm portfolio 3D hay dùng Perlink',
      columns: ['', 'Tự viết bằng Three.js', 'Perlink'],
      rows: [
        ['Thời gian để portfolio lên mạng', 'Vài tuần', 'Một buổi tối'],
        ['Thể hiện kỹ năng đồ họa 3D', 'Có, rất rõ', 'Không, nó làm nổi các dự án khác của bạn'],
        ['Trang nhanh cho nhà tuyển dụng và Google', 'Phải tự làm thêm', 'Có sẵn'],
        ['Hosting, địa chỉ, thống kê', 'Tự thiết lập', 'Có sẵn, perlink.to/tên-bạn'],
        ['Cập nhật dự án', 'Sửa code rồi deploy lại', 'Trong trình chỉnh sửa, trên điện thoại hay máy tính'],
      ],
    },
    stepsTitle: 'Làm portfolio lập trình viên trong sáu bước',
    steps: [
      { title: 'Bắt đầu từ mẫu cho developer', text: 'Mẫu Neon developer có sẵn trang tối, dòng thời gian dự án và căn phòng đi kèm.' },
      { title: 'Chọn ba đến năm dự án', text: 'Hợp với vị trí bạn muốn. Mỗi dự án có link chạy thử, repository và phần bạn làm.' },
      { title: 'Viết thẻ dự án', text: 'Nó làm gì, stack, vai trò, một quyết định kỹ thuật, các liên kết.' },
      { title: 'Sắp xếp căn phòng', text: 'Gắn GitHub vào laptop, ghi stack lên biển neon, đưa ảnh dự án vào khung tranh.' },
      { title: 'Thêm liên hệ và CV', text: 'Email, LinkedIn, link tới CV, cùng form liên hệ cho việc freelance.' },
      { title: 'Chia sẻ khắp nơi', text: 'Đặt perlink.to/tên-bạn vào CV, hồ sơ GitHub, LinkedIn, và in mã QR nếu bạn hay đi sự kiện.' },
    ],
    faq: [
      { q: 'Tôi có nên tự làm portfolio bằng Three.js không?', a: 'Nếu bạn ứng tuyển WebGL, đồ họa hay creative developer thì nên, vì portfolio chính là bằng chứng. Với front-end, back-end, mobile hay full-stack, thời gian nên dành cho các dự án bạn khoe, còn Perlink lo phần phòng 3D.' },
      { q: 'Tôi gắn link GitHub, bản demo và CV được không?', a: 'Được. Thêm chúng thành liên kết trên trang, và gắn link vào laptop, biển neon hay bất kỳ khung tranh nào trong phòng.' },
      { q: 'Có giao diện tối không?', a: 'Có. Mẫu Neon developer dùng nền tối với màu nhấn phát sáng, bạn đổi màu và phông chữ theo ý mình.' },
      { q: 'Tôi viết bài kỹ thuật được không?', a: 'Được. Mỗi trang có blog riêng, gói miễn phí đăng được tới 50 bài.' },
      { q: 'Nhà tuyển dụng dùng điện thoại yếu có xem được không?', a: 'Được. Portfolio trước hết là một trang web bình thường, tải nhanh; căn phòng tự chỉnh chất lượng theo máy và chỉ cách một lần chạm.' },
      { q: 'Có miễn phí không?', a: 'Có. Một trang gồm portfolio, phòng 3D và thống kê 30 ngày, miễn phí không giới hạn thời gian. Gói Starter 6 USD một tháng có thêm trang và theme Pro.' },
      { q: 'Tôi dùng tên miền riêng như tenban.dev được không?', a: 'Được, với gói Plus (20 USD một tháng, tối đa 3 tên miền) hoặc Max. Địa chỉ perlink.to vẫn hoạt động song song.' },
    ],
    ctaTitle: 'Đưa portfolio lên mạng ngay tối nay',
    ctaText: 'Giữ địa chỉ của bạn, bắt đầu từ mẫu cho developer, và dành phần còn lại của tuần cho code.',
  },
}
