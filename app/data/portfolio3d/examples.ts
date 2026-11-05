import type { PortfolioExample, PortfolioTopic } from './types'

// "3D portfolio examples": a roundup of well-known 3D portfolios elsewhere
// (linked, described in our own words, each address checked live on
// 2026-11-06) and five made from Perlink templates, with their live rooms
export const EXAMPLES_TOPIC: PortfolioTopic = {
  id: 'examples',
  path: { en: 'examples', vi: 'vi-du' },
  demo: 'photographer',
  templates: ['personal', 'creator', 'photographer', 'personal-neon'],
  updated: '2026-11-06',
  readMinutes: 9,
  en: {
    seoTitle: '3D Portfolio Examples: Best 3D Portfolio Websites',
    description: 'The best 3D portfolio websites, from Bruno Simon’s drivable world to explorable rooms, with what each does well and ideas you can borrow for your own.',
    eyebrow: '3D portfolio examples',
    title: '3D portfolio examples worth studying',
    intro: 'These are some of the best-known 3D portfolio websites on the web, plus five you can open and explore right here, made from Perlink templates. For each one we note what makes it work and one idea you can take for your own portfolio. Open them on a computer if you can: several are built for a mouse and a big screen.',
    demoTitle: 'Try one here first',
    demoText: 'A photographer’s 3D room, live in this page. Drag to look around and tap a framed photo to open it.',
    sections: [
      {
        title: 'What the best 3D portfolios have in common',
        paragraphs: [
          'Look at the examples below side by side and a few patterns stand out. They are not the ones with the most effects. They are the ones where the 3D says something about the person.',
        ],
        bullets: [
          'One clear idea. A car to drive, a ramen shop, a room, a sphere of sound. Visitors understand the concept in a few seconds.',
          'The concept fits the maker. A sound designer’s site reacts to sound; a developer’s site hides a working computer. The 3D is a statement about what they do.',
          'The work is easy to reach. Projects, contact and an about section can be found quickly, often from a menu or a screen that does not require exploring.',
          'They reward curiosity with small details: objects that react, hidden jokes, sounds, moving light.',
        ],
      },
      {
        title: 'Patterns you can borrow',
        paragraphs: [
          'You do not need weeks of Three.js to use the ideas behind these sites. A few that translate to any 3D portfolio, including one made with Perlink:',
        ],
        bullets: [
          'A personal space as the frame: your room, your desk, your studio. People like seeing where someone works.',
          'Projects as objects: framed images on a wall, a screen on a desk, a sign that links to a case study.',
          'A plain way in next to the 3D one, so a reviewer in a hurry can still find everything.',
          'Light and time of day as mood. The same room feels calm by day and cosy at night.',
          'Sound used sparingly, off until the visitor chooses to hear it.',
        ],
      },
      {
        title: 'Mistakes the weaker 3D portfolios make',
        paragraphs: [
          'For every memorable 3D portfolio there are many that people close after a few seconds. The usual reasons:',
        ],
        bullets: [
          'A long loading screen before anything appears, especially on phones.',
          'Projects only reachable by finding the right object, with no menu or list.',
          'Text drawn inside the 3D scene, too small to read and invisible to search engines.',
          'Camera controls that fight the visitor, or scrolling that stops working normally.',
          'A borrowed template scene with nothing personal in it, which makes the 3D feel like decoration.',
        ],
      },
      {
        title: 'Built from scratch or with a tool?',
        paragraphs: [
          'Most of the famous examples on this page were built by hand by people who are 3D developers or designers themselves, often over weeks, with Three.js for the code and Blender for the models. For them, the portfolio is also proof of that skill.',
          'If your work is design, photography, architecture or code that is not about 3D, building the space yourself is a large detour. A tool such as Perlink gives you the space ready-made: you choose a template, put your own work in the frames and on the objects, and publish a page and a room together at perlink.to/yourname.',
        ],
      },
      {
        title: 'How we chose these examples',
        paragraphs: [
          'Inclusion is editorial: we picked 3D portfolios that are well known in the web design and Three.js community, that we could open and check, and that each teach something different. We link to every site and describe it in our own words; we do not copy their text or show screenshots. Sites change over time, so what you see may differ from our notes.',
          'If you made a 3D portfolio you think belongs here, or you are listed and would like to be removed or have a detail corrected, write to support@perlink.to.',
        ],
      },
    ],
    stepsTitle: 'Turn what you like here into your own portfolio',
    steps: [
      { title: 'Pick one idea to borrow', text: 'Not five. A room, a desk, an island at night: one concept you can explain in a sentence.' },
      { title: 'Choose your strongest work', text: 'Three to eight projects is enough. These go in the frames and on the page.' },
      { title: 'Start from a template', text: 'On Perlink, pick a portfolio template close to your field. It comes with a page and a matching 3D room.' },
      { title: 'Make the space yours', text: 'Hang your images, link objects to your projects, write your own words on the neon sign, choose a land and the time of day.' },
      { title: 'Keep a plain way in', text: 'Leave the page version with your projects and contact details, so nobody has to explore to find them.' },
      { title: 'Share it', text: 'Put perlink.to/yourname in your bio and CV, and post a short video tour of your room.' },
    ],
    faq: [
      { q: 'What is the most famous 3D portfolio?', a: 'Bruno Simon’s portfolio, where you drive a small car around a 3D world to find his projects, is probably the most widely shared. It won Awwwards Site of the Month in November 2019 and is still a common reference.' },
      { q: 'How long does it take to build a 3D portfolio like these?', a: 'The hand-built examples here typically represent weeks of work by experienced 3D developers. With a tool like Perlink, a portfolio page and 3D room from a template takes minutes to set up, plus the time to add your own work.' },
      { q: 'Do I need to be a 3D artist to have a 3D portfolio?', a: 'No. The famous ones are often made by 3D specialists showing their skill, but designers, photographers, architects and students can use a ready-made room and focus on their own work.' },
      { q: 'Can I copy one of these portfolios?', a: 'Take ideas, not code or assets. The sites, models and text belong to their makers. Borrow a concept, such as a room or projects as objects, and make it about your own work.' },
      { q: 'Do these 3D portfolios work on phones?', a: 'Some do, some are best on a computer. That is worth noticing when you plan your own: keep a fast page for phone visitors and make the 3D part load only when it is opened.' },
      { q: 'How do I get my 3D portfolio listed here?', a: 'Send the link to support@perlink.to with a line about what makes it special. Inclusion is an editorial choice, and we check every site before adding it.' },
      { q: 'Are the Perlink examples real templates I can use?', a: 'Yes. Each one is a template you can start from for free, with the same kind of page and 3D room you can explore on this page.' },
    ],
    ctaTitle: 'Make the next example',
    ctaText: 'Start from a portfolio template with a page and a 3D room, put your work in it, and publish at perlink.to/yourname. Free to start.',
  },
  vi: {
    seoTitle: 'Ví dụ portfolio 3D đẹp: các website portfolio 3D hay nhất',
    description: 'Những website portfolio 3D đẹp nhất, từ thế giới lái xe của Bruno Simon đến các căn phòng để khám phá, kèm điểm hay của từng trang và ý tưởng bạn có thể học.',
    eyebrow: 'Ví dụ portfolio 3D',
    title: 'Những ví dụ portfolio 3D đáng để học hỏi',
    intro: 'Đây là một số website portfolio 3D nổi tiếng nhất trên mạng, cùng năm portfolio bạn có thể mở và khám phá ngay tại đây, làm từ mẫu của Perlink. Với mỗi trang, bài viết ghi lại điều làm nó hiệu quả và một ý tưởng bạn có thể mang về cho portfolio của mình. Nếu được, hãy mở bằng máy tính: nhiều trang được làm cho chuột và màn hình lớn.',
    demoTitle: 'Thử một căn phòng ngay tại đây',
    demoText: 'Phòng 3D của một nhiếp ảnh gia, chạy ngay trong trang này. Kéo để nhìn quanh và chạm vào ảnh trong khung để mở.',
    sections: [
      {
        title: 'Điểm chung của những portfolio 3D hay nhất',
        paragraphs: [
          'Đặt các ví dụ dưới đây cạnh nhau sẽ thấy vài điểm lặp lại. Chúng không phải những trang nhiều hiệu ứng nhất. Chúng là những trang mà phần 3D nói lên điều gì đó về người làm ra nó.',
        ],
        bullets: [
          'Một ý tưởng rõ ràng. Một chiếc xe để lái, một quán mì ramen, một căn phòng, một khối cầu âm thanh. Người xem hiểu ý tưởng chỉ sau vài giây.',
          'Ý tưởng hợp với người làm. Trang của nhà thiết kế âm thanh phản ứng theo âm thanh; trang của lập trình viên giấu một chiếc máy tính chạy được. Phần 3D là lời tuyên bố về công việc của họ.',
          'Tác phẩm dễ tìm. Dự án, liên hệ và phần giới thiệu đều tới được nhanh, thường qua menu hoặc một màn hình không bắt phải khám phá.',
          'Chúng thưởng cho sự tò mò bằng chi tiết nhỏ: đồ vật phản ứng khi chạm, những trò đùa giấu kín, âm thanh, ánh sáng thay đổi.',
        ],
      },
      {
        title: 'Những cách làm bạn có thể học theo',
        paragraphs: [
          'Bạn không cần hàng tuần học Three.js để dùng được ý tưởng của các trang này. Vài cách áp dụng được cho mọi portfolio 3D, kể cả portfolio làm bằng Perlink:',
        ],
        bullets: [
          'Lấy không gian riêng làm khung: căn phòng, bàn làm việc, studio của bạn. Ai cũng thích nhìn nơi một người làm việc.',
          'Biến dự án thành đồ vật: ảnh đóng khung trên tường, màn hình trên bàn, tấm biển dẫn tới case study.',
          'Đặt một lối vào đơn giản cạnh lối vào 3D, để người đang vội vẫn tìm được mọi thứ.',
          'Dùng ánh sáng và thời điểm trong ngày để tạo cảm xúc. Cùng một căn phòng, ban ngày thì bình yên, ban đêm thì ấm cúng.',
          'Dùng âm thanh tiết chế, để tắt cho tới khi người xem tự bật.',
        ],
      },
      {
        title: 'Những lỗi hay gặp ở portfolio 3D kém',
        paragraphs: [
          'Cứ mỗi portfolio 3D đáng nhớ lại có rất nhiều trang bị đóng sau vài giây. Lý do thường là:',
        ],
        bullets: [
          'Màn hình chờ tải quá lâu trước khi có gì hiện ra, nhất là trên điện thoại.',
          'Chỉ tới được dự án khi tìm đúng đồ vật, không có menu hay danh sách.',
          'Chữ vẽ ngay trong cảnh 3D, quá nhỏ để đọc và Google không thấy được.',
          'Điều khiển camera ngược ý người xem, hoặc trang không còn cuộn bình thường.',
          'Dùng nguyên cảnh mẫu của người khác, không có gì mang dấu ấn cá nhân, khiến phần 3D chỉ còn là đồ trang trí.',
        ],
      },
      {
        title: 'Tự làm từ đầu hay dùng công cụ?',
        paragraphs: [
          'Phần lớn các ví dụ nổi tiếng trong trang này do chính các lập trình viên hay nhà thiết kế 3D tự tay làm, thường mất nhiều tuần, với Three.js cho phần code và Blender cho mô hình. Với họ, portfolio cũng là bằng chứng cho chính tay nghề đó.',
          'Nếu công việc của bạn là thiết kế, nhiếp ảnh, kiến trúc hay lập trình không liên quan tới 3D, tự dựng không gian là một đường vòng rất dài. Một công cụ như Perlink cho bạn không gian làm sẵn: chọn mẫu, đặt tác phẩm của bạn vào khung tranh và đồ vật, rồi đăng cả trang lẫn căn phòng tại perlink.to/tên-bạn.',
        ],
      },
      {
        title: 'Cách chúng tôi chọn các ví dụ',
        paragraphs: [
          'Danh sách này do đội ngũ biên tập lựa chọn: những portfolio 3D được biết đến rộng rãi trong cộng đồng thiết kế web và Three.js, mà chúng tôi đã mở và kiểm tra, và mỗi trang dạy một điều khác nhau. Chúng tôi dẫn link tới từng trang và mô tả bằng lời của mình, không chép chữ hay đăng ảnh chụp màn hình. Các trang có thể thay đổi theo thời gian, nên những gì bạn thấy có thể khác ghi chú ở đây.',
          'Nếu bạn làm một portfolio 3D và thấy nó xứng đáng có mặt ở đây, hoặc bạn đã có tên và muốn được gỡ ra hay sửa thông tin, hãy viết tới support@perlink.to.',
        ],
      },
    ],
    stepsTitle: 'Biến điều bạn thích ở đây thành portfolio của mình',
    steps: [
      { title: 'Chọn một ý tưởng để học theo', text: 'Một thôi, không phải năm. Một căn phòng, một góc bàn, một hòn đảo về đêm: ý tưởng bạn giải thích được trong một câu.' },
      { title: 'Chọn tác phẩm mạnh nhất', text: 'Ba đến tám dự án là đủ. Chúng sẽ nằm trong khung tranh và trên trang.' },
      { title: 'Bắt đầu từ một mẫu', text: 'Trên Perlink, chọn mẫu portfolio gần với ngành của bạn. Mẫu có sẵn trang và phòng 3D đi kèm.' },
      { title: 'Biến không gian thành của bạn', text: 'Treo ảnh của bạn, gắn liên kết dự án vào đồ vật, viết chữ của riêng bạn lên biển neon, chọn vùng đất và thời điểm trong ngày.' },
      { title: 'Giữ một lối vào đơn giản', text: 'Để lại bản trang có dự án và thông tin liên hệ, để không ai phải khám phá mới tìm thấy.' },
      { title: 'Chia sẻ', text: 'Đặt perlink.to/tên-bạn vào bio và CV, rồi đăng một video ngắn dạo quanh căn phòng.' },
    ],
    faq: [
      { q: 'Portfolio 3D nổi tiếng nhất là của ai?', a: 'Portfolio của Bruno Simon, nơi bạn lái một chiếc xe nhỏ đi quanh thế giới 3D để tìm dự án của anh, có lẽ là trang được chia sẻ nhiều nhất. Trang từng nhận giải Site of the Month của Awwwards tháng 11/2019 và đến nay vẫn thường được nhắc tới.' },
      { q: 'Làm một portfolio 3D như thế này mất bao lâu?', a: 'Các ví dụ tự làm trong trang này thường là thành quả nhiều tuần của những lập trình viên 3D giàu kinh nghiệm. Với công cụ như Perlink, dựng trang portfolio và phòng 3D từ mẫu chỉ mất vài phút, cộng thời gian bạn thêm tác phẩm của mình.' },
      { q: 'Tôi có cần là họa sĩ 3D mới có portfolio 3D không?', a: 'Không. Những trang nổi tiếng thường do chuyên gia 3D làm để khoe tay nghề, còn nhà thiết kế, nhiếp ảnh gia, kiến trúc sư hay sinh viên có thể dùng căn phòng làm sẵn và tập trung vào tác phẩm của mình.' },
      { q: 'Tôi có được sao chép một trong các portfolio này không?', a: 'Hãy học ý tưởng, đừng lấy code hay tài nguyên. Trang web, mô hình và nội dung thuộc về người làm ra chúng. Mượn một ý tưởng, như căn phòng hay dự án dưới dạng đồ vật, rồi làm nó thành câu chuyện về tác phẩm của bạn.' },
      { q: 'Các portfolio 3D này có chạy trên điện thoại không?', a: 'Có trang chạy tốt, có trang hợp với máy tính hơn. Đó là điều đáng chú ý khi bạn lên kế hoạch cho portfolio của mình: giữ một trang tải nhanh cho người xem bằng điện thoại, và chỉ tải phần 3D khi được mở.' },
      { q: 'Làm sao để portfolio 3D của tôi có mặt ở đây?', a: 'Gửi link tới support@perlink.to kèm một dòng về điểm đặc biệt của nó. Việc đưa vào danh sách do biên tập quyết định, và chúng tôi kiểm tra từng trang trước khi thêm.' },
      { q: 'Các ví dụ của Perlink có phải mẫu thật tôi dùng được không?', a: 'Đúng vậy. Mỗi ví dụ là một mẫu bạn có thể bắt đầu miễn phí, với trang và phòng 3D giống như bạn khám phá trong trang này.' },
    ],
    ctaTitle: 'Làm ví dụ tiếp theo',
    ctaText: 'Bắt đầu từ một mẫu portfolio có sẵn trang và phòng 3D, đưa tác phẩm của bạn vào và đăng tại perlink.to/tên-bạn. Miễn phí để bắt đầu.',
  },
}

export const PORTFOLIO_EXAMPLES: PortfolioExample[] = [
  // ---------- On the web ----------
  {
    id: 'bruno-simon',
    kind: 'web',
    url: 'https://bruno-simon.com/',
    author: 'Bruno Simon',
    en: {
      name: 'Bruno Simon’s portfolio',
      who: 'A creative developer’s portfolio as a small world you drive around',
      highlights: [
        'You drive a little car through a 3D landscape and find his projects and links along the way.',
        'It turns browsing a portfolio into play, which is why people share it so much.',
        'Built with Three.js; it won Awwwards Site of the Month in November 2019.',
      ],
      takeaway: 'If you make a 3D portfolio, give visitors something to do, not only something to look at.',
    },
    vi: {
      name: 'Portfolio của Bruno Simon',
      who: 'Portfolio của một lập trình viên sáng tạo, là một thế giới nhỏ để lái xe khám phá',
      highlights: [
        'Bạn lái một chiếc xe nhỏ qua khung cảnh 3D và gặp các dự án, liên kết của anh dọc đường.',
        'Xem portfolio trở thành một trò chơi, đó là lý do trang được chia sẻ nhiều đến vậy.',
        'Làm bằng Three.js; từng nhận Site of the Month của Awwwards tháng 11/2019.',
      ],
      takeaway: 'Khi làm portfolio 3D, hãy cho người xem việc gì đó để làm, chứ không chỉ để nhìn.',
    },
  },
  {
    id: 'my-room-in-3d',
    kind: 'web',
    url: 'https://my-room-in-3d.vercel.app/',
    author: 'Bruno Simon',
    en: {
      name: 'My Room in 3D',
      who: 'A real room recreated in the browser',
      highlights: [
        'A detailed 3D copy of the maker’s own room, modelled in Blender and shown with Three.js.',
        'Small living details, such as steam from a coffee cup and an animation on the TV, make it feel inhabited.',
        'The code is public on GitHub, and many people have learned from it and made their own rooms.',
      ],
      takeaway: 'Your own room is a strong frame for a portfolio: personal, familiar and easy to understand.',
    },
    vi: {
      name: 'My Room in 3D',
      who: 'Một căn phòng thật được tái hiện trên trình duyệt',
      highlights: [
        'Bản sao 3D chi tiết căn phòng của chính tác giả, dựng trong Blender và hiển thị bằng Three.js.',
        'Những chi tiết nhỏ như hơi nóng bốc lên từ tách cà phê hay hình động trên TV khiến căn phòng như có người ở.',
        'Mã nguồn công khai trên GitHub, rất nhiều người đã học theo và làm căn phòng của riêng mình.',
      ],
      takeaway: 'Căn phòng của chính bạn là một khung rất mạnh cho portfolio: riêng tư, quen thuộc và dễ hiểu.',
    },
  },
  {
    id: 'jesse-zhou',
    kind: 'web',
    url: 'https://www.jesse-zhou.com/',
    author: 'Jesse Zhou',
    en: {
      name: 'Jesse’s Ramen',
      who: 'A personal site set in a 3D ramen shop',
      highlights: [
        'The whole portfolio is a stylised ramen shop, made with Three.js and Blender.',
        'Projects, articles and the about section are reached through the shop, so the theme carries the navigation.',
        'A memorable concept that has nothing to do with the job, and that is exactly why people remember it.',
      ],
      takeaway: 'A theme from your life or culture can be more memorable than one about your profession.',
    },
    vi: {
      name: 'Jesse’s Ramen',
      who: 'Trang cá nhân đặt trong một quán mì ramen 3D',
      highlights: [
        'Toàn bộ portfolio là một quán ramen cách điệu, làm bằng Three.js và Blender.',
        'Dự án, bài viết và phần giới thiệu đều được dẫn tới qua quán, nên chủ đề cũng chính là cách điều hướng.',
        'Ý tưởng chẳng liên quan gì tới nghề nghiệp, và chính vì thế mà người ta nhớ.',
      ],
      takeaway: 'Một chủ đề từ cuộc sống hay văn hóa của bạn có thể dễ nhớ hơn một chủ đề về nghề.',
    },
  },
  {
    id: 'henry-heffernan',
    kind: 'web',
    url: 'https://henryheffernan.com/',
    author: 'Henry Heffernan',
    en: {
      name: 'Henry Heffernan’s portfolio',
      who: 'A software engineer’s portfolio with a desktop operating system inside a 3D scene',
      highlights: [
        'A 3D scene is the outer layer, and inside it runs a second, desktop-style site that works like an operating system.',
        'The two layers are separate projects, both public on GitHub.',
        'For a software engineer, a working computer inside the portfolio shows the skill directly.',
      ],
      takeaway: 'Let the format prove what you do: a developer’s portfolio that is itself a piece of software says more than a list of skills.',
    },
    vi: {
      name: 'Portfolio của Henry Heffernan',
      who: 'Portfolio của một kỹ sư phần mềm, với một hệ điều hành máy tính nằm trong cảnh 3D',
      highlights: [
        'Lớp ngoài là một cảnh 3D, bên trong chạy một trang thứ hai giống màn hình máy tính, hoạt động như một hệ điều hành.',
        'Hai lớp là hai dự án riêng, cả hai đều công khai trên GitHub.',
        'Với kỹ sư phần mềm, một chiếc máy tính chạy được ngay trong portfolio là bằng chứng tay nghề trực tiếp nhất.',
      ],
      takeaway: 'Để chính hình thức chứng minh nghề của bạn: portfolio của lập trình viên mà bản thân là một phần mềm thì nói được nhiều hơn danh sách kỹ năng.',
    },
  },
  {
    id: 'jordan-breton',
    kind: 'web',
    url: 'https://jordan-breton.com/',
    author: 'Jordan Breton',
    en: {
      name: 'Jordan Breton’s portfolio',
      who: 'A freelance developer’s portfolio as a 3D world to look around',
      highlights: [
        'Visitors drag or touch to look around a 3D world and tap to explore it.',
        'The introduction is also written as normal page text, so it can be read without exploring.',
        'It shows creative Three.js work and serious engineering on the same page, for the clients he wants.',
      ],
      takeaway: 'Put a readable introduction next to the 3D, so the world adds to your message instead of replacing it.',
    },
    vi: {
      name: 'Portfolio của Jordan Breton',
      who: 'Portfolio của một lập trình viên tự do, là một thế giới 3D để nhìn ngắm',
      highlights: [
        'Người xem kéo hoặc chạm để nhìn quanh một thế giới 3D, rồi chạm để khám phá.',
        'Phần giới thiệu vẫn được viết thành chữ bình thường trên trang, đọc được mà không cần khám phá.',
        'Trang cho thấy cả tay nghề Three.js sáng tạo lẫn năng lực kỹ thuật bài bản, đúng với khách hàng anh muốn hướng tới.',
      ],
      takeaway: 'Đặt phần giới thiệu dễ đọc cạnh phần 3D, để thế giới 3D bổ sung cho thông điệp chứ không thay thế nó.',
    },
  },
  {
    id: 'where-worlds-take-shape',
    kind: 'web',
    url: 'https://paodao.fr/',
    en: {
      name: 'Where Worlds Take Shape',
      who: 'A playable portfolio built with WebGL and Three.js',
      highlights: [
        'The portfolio is an explorable 3D world where projects are discovered by moving through it.',
        'It mixes storytelling, navigation and small games instead of a list of work.',
        'Named an Awwwards Site of the Day in May 2026.',
      ],
      takeaway: 'Discovery can be the experience itself, as long as visitors always know where to go next.',
    },
    vi: {
      name: 'Where Worlds Take Shape',
      who: 'Một portfolio chơi được, làm bằng WebGL và Three.js',
      highlights: [
        'Portfolio là một thế giới 3D để khám phá, dự án hiện ra khi bạn di chuyển trong đó.',
        'Trang kết hợp kể chuyện, điều hướng và các trò chơi nhỏ thay cho một danh sách tác phẩm.',
        'Được Awwwards chọn là Site of the Day vào tháng 5/2026.',
      ],
      takeaway: 'Bản thân việc khám phá có thể là trải nghiệm, miễn là người xem luôn biết bước tiếp theo đi đâu.',
    },
  },
  {
    id: 'chiara-luzzana',
    kind: 'web',
    url: 'https://www.chiaraluzzana.com/',
    author: 'Niccolò Miranda for Chiara Luzzana',
    en: {
      name: 'Chiara Luzzana',
      who: 'A sound designer’s portfolio built around a 3D sphere of sound',
      highlights: [
        'A 3D sphere shaped like sound waves sits at the centre and reacts to the soundtrack.',
        'Sound, visuals and type all point at one idea: what the person does for a living.',
        'Recognised by Awwwards (Site of the Day), The FWA and CSSDA.',
      ],
      takeaway: 'Choose one 3D element that represents your work, rather than a whole world.',
    },
    vi: {
      name: 'Chiara Luzzana',
      who: 'Portfolio của một nhà thiết kế âm thanh, xoay quanh một khối cầu 3D làm từ âm thanh',
      highlights: [
        'Ở trung tâm là khối cầu 3D mang hình sóng âm, phản ứng theo nhạc nền.',
        'Âm thanh, hình ảnh và chữ đều hướng về một ý: công việc của chính người đó.',
        'Được Awwwards (Site of the Day), The FWA và CSSDA ghi nhận.',
      ],
      takeaway: 'Chọn một vật thể 3D đại diện cho công việc của bạn, thay vì dựng cả một thế giới.',
    },
  },
  {
    id: 'james-murray',
    kind: 'web',
    url: 'https://jamesmurray.ca/',
    author: 'James Murray',
    en: {
      name: 'James Murray’s 3D portfolio',
      who: 'A developer’s portfolio as a 3D universe of orbiting worlds',
      highlights: [
        'Visitors navigate a Three.js universe where each world is a part of the portfolio.',
        'Different worlds hold different sides of the maker: projects, personal story, ways of thinking.',
        'Nominated on Awwwards in 2026.',
      ],
      takeaway: 'Group your work into a few clear places, so the space doubles as a map of who you are.',
    },
    vi: {
      name: 'Portfolio 3D của James Murray',
      who: 'Portfolio của một lập trình viên dưới dạng vũ trụ 3D với các thế giới quay quanh',
      highlights: [
        'Người xem di chuyển trong một vũ trụ Three.js, mỗi thế giới là một phần của portfolio.',
        'Mỗi thế giới chứa một khía cạnh của tác giả: dự án, câu chuyện cá nhân, cách suy nghĩ.',
        'Được đề cử trên Awwwards năm 2026.',
      ],
      takeaway: 'Gom tác phẩm vào vài nơi rõ ràng, để không gian cũng là bản đồ về con người bạn.',
    },
  },
  {
    id: 'lusion',
    kind: 'web',
    url: 'https://lusion.co/',
    author: 'Lusion',
    en: {
      name: 'Lusion',
      who: 'A 3D studio’s own site, as its portfolio',
      highlights: [
        'A studio that makes real-time 3D and interactive web experiences shows that skill on its own site.',
        'The third version of the site won Awwwards Site of the Year and Developer Site of the Year for 2023.',
        'Useful as a benchmark of what polished real-time 3D on the web can look like.',
      ],
      takeaway: 'Polish matters more than quantity: a few scenes done extremely well beat many rough ones.',
    },
    vi: {
      name: 'Lusion',
      who: 'Trang web của một studio 3D, cũng chính là portfolio của họ',
      highlights: [
        'Một studio chuyên làm trải nghiệm 3D thời gian thực và web tương tác thể hiện tay nghề ngay trên trang của mình.',
        'Phiên bản thứ ba của trang đoạt giải Site of the Year và Developer Site of the Year năm 2023 của Awwwards.',
        'Một thước đo tốt cho việc 3D thời gian thực trên web có thể trau chuốt tới mức nào.',
      ],
      takeaway: 'Trau chuốt quan trọng hơn số lượng: vài cảnh làm thật kỹ hơn hẳn nhiều cảnh làm vội.',
    },
  },

  // ---------- Made with Perlink ----------
  {
    id: 'perlink-designer',
    kind: 'perlink',
    demo: 'designer',
    template: 'creator',
    en: {
      name: 'A designer’s studio',
      who: 'For graphic designers, illustrators and artists',
      highlights: [
        'The page is a gallery of work with links to a shop or commissions.',
        'In the room, the artwork hangs in picture frames that visitors tap to see large.',
        'Bright walls and plenty of space keep the attention on the work.',
      ],
      takeaway: 'Treat the room like a small exhibition: fewer pieces, hung where people look first.',
    },
    vi: {
      name: 'Studio của nhà thiết kế',
      who: 'Cho designer đồ họa, họa sĩ minh họa và nghệ sĩ',
      highlights: [
        'Trang là một bộ sưu tập tác phẩm, kèm liên kết tới cửa hàng hoặc nhận đặt vẽ.',
        'Trong phòng, tác phẩm treo trong khung tranh, khách chạm vào để xem lớn.',
        'Tường sáng và nhiều khoảng trống giữ sự chú ý cho tác phẩm.',
      ],
      takeaway: 'Hãy coi căn phòng như một triển lãm nhỏ: ít tác phẩm hơn, treo đúng chỗ người ta nhìn đầu tiên.',
    },
  },
  {
    id: 'perlink-developer',
    kind: 'perlink',
    demo: 'developer',
    template: 'personal-neon',
    en: {
      name: 'A developer’s night desk',
      who: 'For software developers and tech creators',
      highlights: [
        'A dark page with projects on a timeline and links to code.',
        'The room is a desk setup at night, where the laptop and a neon sign can link to your projects.',
        'Night mode and neon light give it the feel of late coding sessions.',
      ],
      takeaway: 'Link objects to real things: the laptop to GitHub, the sign to your best project.',
    },
    vi: {
      name: 'Góc làm việc đêm của lập trình viên',
      who: 'Cho lập trình viên và người làm nội dung công nghệ',
      highlights: [
        'Trang nền tối, dự án xếp theo dòng thời gian, kèm liên kết tới code.',
        'Căn phòng là một góc bàn làm việc về đêm, laptop và biển neon có thể dẫn tới dự án của bạn.',
        'Chế độ ban đêm và ánh đèn neon gợi đúng cảm giác những đêm ngồi code.',
      ],
      takeaway: 'Gắn đồ vật với thứ có thật: laptop dẫn tới GitHub, biển neon dẫn tới dự án tốt nhất.',
    },
  },
  {
    id: 'perlink-photographer',
    kind: 'perlink',
    demo: 'photographer',
    template: 'photographer',
    en: {
      name: 'A photographer’s gallery',
      who: 'For portrait, travel and event photographers',
      highlights: [
        'The page frames your photos on a dark background, with packages, prices and a booking form.',
        'The room is a gallery: your shots in frames on the walls, each one opening large when tapped.',
        'Visitors can book a shoot from the page after looking around.',
      ],
      takeaway: 'Choose photos that work small and large: the room shows them as frames first, then full size.',
    },
    vi: {
      name: 'Phòng tranh của nhiếp ảnh gia',
      who: 'Cho nhiếp ảnh gia chân dung, du lịch và sự kiện',
      highlights: [
        'Trang đặt ảnh của bạn trên nền tối, kèm các gói chụp, giá và form đặt lịch.',
        'Căn phòng là một phòng trưng bày: ảnh của bạn trong khung trên tường, chạm vào là mở lớn.',
        'Khách xem xong có thể đặt lịch chụp ngay trên trang.',
      ],
      takeaway: 'Chọn ảnh đẹp cả khi nhỏ lẫn khi lớn: trong phòng ảnh hiện thành khung trước, rồi mới mở toàn màn hình.',
    },
  },
  {
    id: 'perlink-architect',
    kind: 'perlink',
    demo: 'architect',
    template: 'interior-design',
    en: {
      name: 'An architect’s studio',
      who: 'For architects and interior designers',
      highlights: [
        'A quiet, magazine-like page with projects in a carousel and a consultation booking.',
        'The room itself shows a sense of space, with project photos framed on the walls.',
        'Calm colours and good light suit work that is about space and materials.',
      ],
      takeaway: 'For spatial work, the room is part of the pitch: dress it the way you would dress a client’s space.',
    },
    vi: {
      name: 'Studio của kiến trúc sư',
      who: 'Cho kiến trúc sư và nhà thiết kế nội thất',
      highlights: [
        'Trang nhẹ nhàng như tạp chí, dự án xếp trong carousel, kèm đặt lịch tư vấn.',
        'Bản thân căn phòng đã thể hiện cảm nhận không gian, với ảnh công trình đóng khung trên tường.',
        'Màu dịu và ánh sáng đẹp hợp với công việc xoay quanh không gian và vật liệu.',
      ],
      takeaway: 'Với công việc về không gian, căn phòng là một phần lời chào hàng: hãy bày nó như cách bạn bày không gian cho khách.',
    },
  },
  {
    id: 'perlink-student',
    kind: 'perlink',
    demo: 'student',
    template: 'personal-resume',
    en: {
      name: 'A student’s first portfolio',
      who: 'For students and fresh graduates applying for internships and first jobs',
      highlights: [
        'The page works as an online CV: experience on a timeline, skills and recommendations.',
        'The room adds class projects and moments in frames, which makes a short CV feel more personal.',
        'Page-first suits applications; the room is there for anyone curious.',
      ],
      takeaway: 'With little experience, show your process and personality: the room is a good place for both.',
    },
    vi: {
      name: 'Portfolio đầu tiên của sinh viên',
      who: 'Cho sinh viên và người mới tốt nghiệp đang tìm thực tập hay việc làm đầu tiên',
      highlights: [
        'Trang đóng vai một CV online: kinh nghiệm theo dòng thời gian, kỹ năng và nhận xét.',
        'Căn phòng thêm đồ án và những khoảnh khắc trong khung tranh, giúp một CV còn ngắn trở nên có dấu ấn hơn.',
        'Mở trang trước hợp khi nộp hồ sơ; căn phòng để dành cho ai tò mò.',
      ],
      takeaway: 'Khi còn ít kinh nghiệm, hãy cho thấy cách bạn làm việc và cá tính của mình: căn phòng là nơi hợp cho cả hai.',
    },
  },
]
