import type { PortfolioTopic } from './types'

// "3D portfolio vs traditional portfolio": an honest comparison, with the
// cases where a plain portfolio is the better choice
export const COMPARE_TOPIC: PortfolioTopic = {
  id: 'compare',
  path: { en: 'vs-traditional-portfolio', vi: 'so-voi-portfolio-thuong' },
  demo: 'designer',
  templates: ['personal', 'creator', 'photographer'],
  updated: '2026-11-06',
  readMinutes: 7,
  en: {
    seoTitle: '3D Portfolio vs Traditional Portfolio: Which to Use',
    description: 'A 3D portfolio is memorable, a traditional one is fast to skim. An honest look at what each does well, where each fails, and when to use both together.',
    eyebrow: '3D vs traditional portfolio',
    title: '3D portfolio vs traditional portfolio: an honest comparison',
    intro: 'A traditional portfolio is a page of your work you can scan in seconds. A 3D portfolio is a space people explore, which makes it memorable but slower to read. Neither wins every time: the right choice depends on who looks at your work and how long they have. For most people the best answer is both, a fast page first and a 3D room one tap away.',
    demoTitle: 'What the 3D side feels like',
    demoText: 'This is a live room, not a video. Drag to look around, zoom, and tap a picture on the wall to open it.',
    sections: [
      {
        title: 'What we mean by each',
        paragraphs: [
          'A traditional portfolio is the format most people know: a website, PDF or profile page with an introduction, a grid or list of projects, and a way to get in touch. Behance pages, Notion portfolios and most personal websites are traditional portfolios.',
          'A 3D portfolio puts your work inside a space rendered in the browser. Visitors move a camera around a room, a landscape or an object, and find your projects as things in that space: pictures on a wall, a screen on a desk, a sign that links somewhere. It is built with WebGL, usually through a library such as Three.js, or made with a tool that does that part for you.',
        ],
      },
      {
        title: 'Where a 3D portfolio is stronger',
        paragraphs: [
          'The main reason to make one is memory. Someone who reviews many portfolios in a day tends to forget the grids and remember the one they walked through. A space also shows taste in a way a template rarely does: the colours, objects and light you choose say something about you before anyone reads a word.',
        ],
        bullets: [
          'It is remembered and talked about, and people share it more often than a standard page.',
          'Visitors stay longer, because there is something to do rather than only something to read.',
          'For creative and technical roles it doubles as proof of skill or taste.',
          'It gives you something to post: a short video of a walk through your room works well on TikTok, Reels and Shorts.',
        ],
      },
      {
        title: 'Where a 3D portfolio is weaker',
        paragraphs: [
          'The same things that make a 3D portfolio memorable also get in the way. Most of the problems below come from treating the 3D space as the only way to see your work.',
        ],
        bullets: [
          'It is heavier. Models, textures and the 3D library have to download before anything moves, which is slow on mobile data.',
          'It can hide the work. If projects only appear after someone finds the right object, a busy reviewer may leave before they see them.',
          'Recruiters and hiring managers often give a first look in well under a minute. Exploring takes longer than that.',
          'Text drawn inside a 3D scene is harder for screen readers, translation tools and search engines to read.',
          'Older or cheaper phones may run it slowly or get warm, and some people get motion sickness from moving cameras.',
          'Built from scratch, it takes days or weeks, and every update to your work means changing code.',
        ],
      },
      {
        title: 'Where a traditional portfolio is stronger, and where it falls short',
        paragraphs: [
          'A traditional portfolio is quick to load, quick to scan and easy to update. Anyone can use it on any device, search engines read all of it, and a reviewer can find your best project in seconds. For roles judged mainly on results, such as marketing, writing, consulting or most engineering jobs, that speed matters more than anything else.',
          'Its weakness is that it looks like everyone else’s. With the same templates in wide use, two portfolios can be hard to tell apart, and a good project can get lost in a grid that looks like the last ten the reviewer saw.',
        ],
      },
      {
        title: 'When a traditional portfolio is the better choice',
        paragraphs: [
          'Be honest about your audience. A plain page is usually the better main format if any of these apply:',
        ],
        bullets: [
          'You are applying through a company’s hiring process, where reviewers skim dozens of links in a sitting.',
          'Your work is mostly writing, data, documents or code that people need to read closely.',
          'Most of your visitors come from places with slow mobile connections.',
          'You need to update your work every week and do not want to touch a 3D scene each time.',
        ],
      },
      {
        title: 'The answer most people need: both, in the right order',
        paragraphs: [
          'You do not have to choose. The pattern that works best is a normal, fast portfolio page that people see first, with a 3D version of the same work one tap away. Reviewers in a hurry get the page; people with time and curiosity open the room. Search engines read the page, and the 3D part only loads when someone asks for it.',
          'This is how Perlink works. Your portfolio is a real web page with its own title and description, and the same page is also a 3D room visitors can walk around, with your photos framed on the walls and links on objects such as the laptop or a neon sign. You decide whether the page or the room opens first, and the room adjusts its quality to the visitor’s device.',
        ],
      },
    ],
    table: {
      title: 'Side by side',
      columns: ['', 'Traditional portfolio', '3D portfolio'],
      rows: [
        ['First impression', 'Clean, familiar, easy to forget', 'Memorable, says something about you'],
        ['Time to see your best work', 'Seconds', 'Depends on how the space is designed'],
        ['Load on mobile data', 'Light and fast', 'Heavier: models and a 3D engine to download'],
        ['Older phones', 'Work everywhere', 'May be slow without a lighter mode'],
        ['Screen readers and search engines', 'Read everything', 'Struggle with text inside the scene'],
        ['Time to build yourself', 'Hours', 'Days to weeks with Three.js or Blender'],
        ['Updating your work', 'Edit and save', 'Often means changing the scene or code'],
        ['Best for', 'Fast reviews, text-heavy work', 'Creative and technical roles, social sharing'],
      ],
    },
    stepsTitle: 'How to get the best of both',
    steps: [
      { title: 'Start with the page', text: 'Write a two-line introduction, pick your three to six strongest projects and add a clear way to contact you. This is what a busy reviewer sees.' },
      { title: 'Put the best work first', text: 'Lead with the project that is closest to the job or client you want, not the oldest or the biggest.' },
      { title: 'Turn the same page into a room', text: 'On Perlink the room comes with your template. Hang your project images in the picture frames so the room shows the same work.' },
      { title: 'Add links to objects', text: 'Link the laptop to a case study, a frame to your Behance or GitHub, and the neon sign to your contact form.' },
      { title: 'Choose what opens first', text: 'Page first for job applications, room first for social media bios and creative clients.' },
      { title: 'Share both ways', text: 'Send the link in applications, and post a short vertical video of your room to show what is behind it.' },
    ],
    faq: [
      { q: 'Is a 3D portfolio better than a traditional one?', a: 'Not always. It is more memorable and better for creative or technical roles, but slower to load and to skim. If reviewers only have a minute, a fast page matters more. Having both, with the page first, avoids the trade-off.' },
      { q: 'Do recruiters actually look at 3D portfolios?', a: 'Many will give any portfolio only a short first look, so they need to find your work fast. A 3D portfolio that also offers a plain page, or opens on a clear list of projects, works for them. One that hides projects behind exploration often does not.' },
      { q: 'Will a 3D portfolio hurt my SEO?', a: 'It can, if your words only exist inside the 3D scene. Search engines read HTML text far more reliably than text drawn in WebGL. Keep your name, introduction and project descriptions as a normal page, as Perlink does, and the 3D part does not get in the way.' },
      { q: 'Does a 3D portfolio work on phones?', a: 'A well-made one does, but it needs care: smaller models, lower quality on weaker devices and touch controls. Perlink’s room adapts its quality to the device, and the page version works everywhere.' },
      { q: 'Do I need to know Three.js or Blender?', a: 'Only if you build it from scratch. With Perlink you pick a template, add your work and arrange the room in a visual editor, with no code or 3D modelling.' },
      { q: 'Which jobs benefit most from a 3D portfolio?', a: 'Designers, 3D artists, creative developers, architects, photographers and students in creative fields, where the portfolio itself shows taste and skill. For writing, research or most corporate roles, the page matters more than the room.' },
      { q: 'Can I start with a normal portfolio and add 3D later?', a: 'Yes. On Perlink every site has both. You can keep the page as the main view and switch the room on or make it open first whenever you want.' },
    ],
    ctaTitle: 'Make a portfolio that works both ways',
    ctaText: 'A fast page for people in a hurry and a 3D room for people who want to look around, at one address. Free to start.',
  },
  vi: {
    seoTitle: 'Portfolio 3D và portfolio thường: nên chọn cái nào',
    description: 'Portfolio 3D dễ nhớ, portfolio thường xem nhanh. So sánh thẳng thắn điểm mạnh, điểm yếu của từng loại, và khi nào nên dùng cả hai cùng một lúc.',
    eyebrow: 'Portfolio 3D và portfolio thường',
    title: 'Portfolio 3D và portfolio thường khác gì nhau?',
    intro: 'Portfolio thường là một trang liệt kê tác phẩm, lướt vài giây là nắm được. Portfolio 3D là một không gian để người xem đi khám phá, nên dễ nhớ hơn nhưng xem chậm hơn. Không loại nào luôn thắng: chọn cái nào tùy vào ai sẽ xem và họ có bao nhiêu thời gian. Với đa số mọi người, cách tốt nhất là có cả hai: một trang tải nhanh ở trước, phòng 3D chỉ cách một lần chạm.',
    demoTitle: 'Phần 3D trông như thế nào',
    demoText: 'Đây là phòng 3D chạy thật, không phải video. Kéo để nhìn quanh, phóng to, chạm vào bức ảnh trên tường để mở.',
    sections: [
      {
        title: 'Hiểu đúng hai khái niệm',
        paragraphs: [
          'Portfolio thường là dạng quen thuộc nhất: một trang web, file PDF hay trang hồ sơ gồm phần giới thiệu, danh sách hoặc lưới dự án và cách liên hệ. Trang Behance, portfolio làm bằng Notion và phần lớn website cá nhân đều là portfolio thường.',
          'Portfolio 3D đặt tác phẩm của bạn vào một không gian dựng ngay trên trình duyệt. Người xem xoay camera quanh một căn phòng, một vùng đất hay một vật thể, và tìm thấy dự án dưới dạng đồ vật trong đó: tranh treo tường, màn hình trên bàn, tấm biển dẫn tới một liên kết. Phần này được làm bằng WebGL, thường qua thư viện Three.js, hoặc bằng một công cụ làm sẵn phần đó cho bạn.',
        ],
      },
      {
        title: 'Portfolio 3D mạnh ở đâu',
        paragraphs: [
          'Lý do lớn nhất để làm portfolio 3D là để được nhớ. Người phải xem nhiều hồ sơ trong ngày thường quên những lưới ảnh giống nhau, nhưng nhớ cái mà họ được bước vào. Một không gian cũng thể hiện gu thẩm mỹ rõ hơn hẳn một mẫu có sẵn: màu sắc, đồ vật, ánh sáng bạn chọn đã nói lên nhiều điều trước khi ai đó đọc chữ nào.',
        ],
        bullets: [
          'Dễ nhớ, dễ được nhắc tới, và hay được chia sẻ hơn một trang bình thường.',
          'Người xem ở lại lâu hơn, vì có thứ để làm chứ không chỉ có thứ để đọc.',
          'Với ngành sáng tạo và kỹ thuật, bản thân portfolio đã là bằng chứng cho tay nghề hoặc gu.',
          'Có sẵn nội dung để đăng: một video ngắn dạo quanh căn phòng rất hợp với TikTok, Reels và Shorts.',
        ],
      },
      {
        title: 'Portfolio 3D yếu ở đâu',
        paragraphs: [
          'Chính những thứ làm portfolio 3D dễ nhớ cũng có thể gây cản trở. Phần lớn vấn đề dưới đây xảy ra khi không gian 3D là cách duy nhất để xem tác phẩm.',
        ],
        bullets: [
          'Nặng hơn. Mô hình, texture và thư viện 3D phải tải xong mới chạy, khá chậm khi dùng 4G.',
          'Có thể giấu mất tác phẩm. Nếu dự án chỉ hiện ra khi bấm đúng đồ vật, người xem bận rộn có thể rời đi trước khi thấy.',
          'Nhà tuyển dụng thường chỉ lướt qua mỗi hồ sơ chưa tới một phút. Đi khám phá thì lâu hơn thế.',
          'Chữ vẽ trong cảnh 3D khó đọc hơn với trình đọc màn hình, công cụ dịch và Google.',
          'Điện thoại cũ hoặc giá rẻ có thể chạy chậm, nóng máy, và một số người bị chóng mặt khi camera chuyển động.',
          'Tự làm từ đầu mất vài ngày đến vài tuần, và mỗi lần cập nhật tác phẩm lại phải sửa code.',
        ],
      },
      {
        title: 'Portfolio thường mạnh và yếu ở đâu',
        paragraphs: [
          'Portfolio thường tải nhanh, lướt nhanh và dễ cập nhật. Ai cũng xem được trên mọi thiết bị, Google đọc được toàn bộ nội dung, người tuyển dụng tìm thấy dự án tốt nhất của bạn trong vài giây. Với những vị trí được đánh giá chủ yếu bằng kết quả như marketing, viết lách, tư vấn hay phần lớn công việc lập trình, sự nhanh gọn này quan trọng hơn mọi thứ.',
          'Điểm yếu là trông giống của người khác. Khi ai cũng dùng chung vài mẫu quen thuộc, hai portfolio có thể khó phân biệt, và một dự án hay dễ bị chìm trong lưới ảnh trông y như mười cái người xem vừa lướt qua.',
        ],
      },
      {
        title: 'Khi nào portfolio thường là lựa chọn tốt hơn',
        paragraphs: [
          'Hãy thật lòng với chính mình về người xem. Một trang đơn giản thường nên là dạng chính nếu bạn rơi vào một trong các trường hợp sau:',
        ],
        bullets: [
          'Bạn nộp hồ sơ qua quy trình tuyển dụng của công ty, nơi người duyệt lướt hàng chục đường link một lúc.',
          'Tác phẩm của bạn chủ yếu là bài viết, số liệu, tài liệu hay code mà người xem cần đọc kỹ.',
          'Phần lớn người xem truy cập bằng mạng di động chậm.',
          'Bạn cập nhật tác phẩm hằng tuần và không muốn mỗi lần lại phải chỉnh một cảnh 3D.',
        ],
      },
      {
        title: 'Câu trả lời cho đa số: dùng cả hai, đúng thứ tự',
        paragraphs: [
          'Bạn không cần chọn một. Cách hiệu quả nhất là một trang portfolio bình thường, tải nhanh, hiện ra trước, còn bản 3D của cùng nội dung đó chỉ cách một lần chạm. Người vội xem trang; người tò mò và có thời gian thì mở phòng. Google đọc trang, còn phần 3D chỉ tải khi có người muốn xem.',
          'Perlink làm đúng như vậy. Portfolio của bạn là một trang web thật, có tiêu đề và mô tả riêng, đồng thời cũng là một căn phòng 3D để khách dạo quanh, với ảnh tác phẩm treo trong khung trên tường và liên kết gắn vào đồ vật như laptop hay biển neon. Bạn tự chọn mở trang hay mở phòng trước, và phòng tự điều chỉnh chất lượng theo máy của người xem.',
        ],
      },
    ],
    table: {
      title: 'So sánh nhanh',
      columns: ['', 'Portfolio thường', 'Portfolio 3D'],
      rows: [
        ['Ấn tượng đầu tiên', 'Gọn gàng, quen thuộc, dễ quên', 'Dễ nhớ, thể hiện cá tính'],
        ['Thời gian để thấy tác phẩm tốt nhất', 'Vài giây', 'Tùy cách thiết kế không gian'],
        ['Tải bằng 4G', 'Nhẹ và nhanh', 'Nặng hơn: phải tải mô hình và engine 3D'],
        ['Điện thoại đời cũ', 'Chạy tốt mọi nơi', 'Có thể chậm nếu không có chế độ nhẹ'],
        ['Trình đọc màn hình và Google', 'Đọc được hết', 'Khó đọc chữ nằm trong cảnh 3D'],
        ['Thời gian tự làm', 'Vài giờ', 'Vài ngày đến vài tuần với Three.js, Blender'],
        ['Cập nhật tác phẩm', 'Sửa rồi lưu', 'Thường phải sửa cảnh hoặc code'],
        ['Hợp nhất với', 'Duyệt hồ sơ nhanh, tác phẩm nhiều chữ', 'Ngành sáng tạo, kỹ thuật, chia sẻ mạng xã hội'],
      ],
    },
    stepsTitle: 'Cách có được cái lợi của cả hai',
    steps: [
      { title: 'Làm trang trước', text: 'Viết hai dòng giới thiệu, chọn ba đến sáu dự án mạnh nhất và để cách liên hệ thật rõ. Đây là thứ người xem bận rộn sẽ thấy.' },
      { title: 'Đặt tác phẩm tốt nhất lên đầu', text: 'Mở đầu bằng dự án gần nhất với công việc hay khách hàng bạn muốn, không phải dự án cũ nhất hay lớn nhất.' },
      { title: 'Biến chính trang đó thành căn phòng', text: 'Trên Perlink, phòng 3D có sẵn theo mẫu bạn chọn. Treo ảnh dự án vào khung tranh để căn phòng trưng bày đúng những tác phẩm đó.' },
      { title: 'Gắn liên kết vào đồ vật', text: 'Laptop dẫn tới một case study, khung tranh dẫn tới Behance hay GitHub, biển neon dẫn tới form liên hệ.' },
      { title: 'Chọn cái mở trước', text: 'Mở trang trước khi nộp hồ sơ xin việc, mở phòng trước khi đặt link ở bio mạng xã hội hay gửi khách hàng sáng tạo.' },
      { title: 'Chia sẻ theo cả hai cách', text: 'Gửi link trong hồ sơ ứng tuyển, và đăng một video dọc ngắn dạo quanh căn phòng để người ta tò mò bấm vào.' },
    ],
    faq: [
      { q: 'Portfolio 3D có tốt hơn portfolio thường không?', a: 'Không phải lúc nào cũng vậy. Portfolio 3D dễ nhớ hơn và hợp với ngành sáng tạo, kỹ thuật, nhưng tải và xem chậm hơn. Nếu người xem chỉ có một phút, trang tải nhanh quan trọng hơn. Có cả hai, với trang hiện trước, là cách tránh phải đánh đổi.' },
      { q: 'Nhà tuyển dụng có thật sự xem portfolio 3D không?', a: 'Phần lớn chỉ xem lướt mỗi hồ sơ lúc đầu, nên họ cần thấy tác phẩm thật nhanh. Portfolio 3D có kèm trang thường, hoặc mở ra ngay danh sách dự án, sẽ hợp với họ. Portfolio bắt người xem đi khám phá mới thấy dự án thì thường không.' },
      { q: 'Portfolio 3D có làm hại SEO không?', a: 'Có thể, nếu chữ của bạn chỉ nằm trong cảnh 3D. Google đọc chữ HTML tốt hơn nhiều so với chữ vẽ bằng WebGL. Giữ tên, phần giới thiệu và mô tả dự án ở dạng trang web bình thường, như cách Perlink làm, thì phần 3D không ảnh hưởng.' },
      { q: 'Portfolio 3D có chạy trên điện thoại không?', a: 'Làm tốt thì có, nhưng cần chú ý: mô hình nhẹ, giảm chất lượng trên máy yếu và điều khiển bằng chạm. Phòng 3D của Perlink tự điều chỉnh chất lượng theo máy, còn bản trang thì chạy được ở mọi nơi.' },
      { q: 'Tôi có cần biết Three.js hay Blender không?', a: 'Chỉ khi bạn tự làm từ đầu. Với Perlink, bạn chọn mẫu, thêm tác phẩm và sắp xếp căn phòng bằng trình chỉnh sửa trực quan, không cần code hay dựng mô hình 3D.' },
      { q: 'Ngành nào được lợi nhiều nhất từ portfolio 3D?', a: 'Thiết kế, họa sĩ 3D, lập trình viên sáng tạo, kiến trúc sư, nhiếp ảnh gia và sinh viên các ngành sáng tạo, nơi bản thân portfolio đã cho thấy gu và tay nghề. Với viết lách, nghiên cứu hay phần lớn công việc văn phòng, trang thường quan trọng hơn căn phòng.' },
      { q: 'Tôi có thể làm portfolio thường trước rồi thêm 3D sau không?', a: 'Được. Trên Perlink trang nào cũng có cả hai. Bạn có thể giữ trang làm giao diện chính, rồi bật phòng 3D hoặc cho phòng mở trước bất cứ lúc nào.' },
    ],
    ctaTitle: 'Làm portfolio hợp với cả hai kiểu người xem',
    ctaText: 'Một trang tải nhanh cho người vội và một căn phòng 3D cho người muốn dạo quanh, chung một địa chỉ. Bắt đầu miễn phí.',
  },
}
