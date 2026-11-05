import type { PortfolioTopic } from './types'

// "Portfolio website with 3D effects": the kinds of 3D on a portfolio, what
// each costs, and how to keep the site fast
export const EFFECTS_TOPIC: PortfolioTopic = {
  id: 'effects',
  path: { en: 'portfolio-website-with-3d-effects', vi: 'website-portfolio-hieu-ung-3d' },
  demo: 'developer',
  templates: ['personal-neon', 'personal', 'creator'],
  updated: '2026-11-06',
  readMinutes: 8,
  en: {
    seoTitle: 'Portfolio Website with 3D Effects: Types and Tips',
    description: 'From tilt cards to explorable 3D worlds: the kinds of 3D effects for a portfolio website, what each costs in effort and speed, and how to keep it fast.',
    eyebrow: 'Portfolio with 3D effects',
    title: 'Portfolio website with 3D effects: what to use and how to keep it fast',
    intro: '3D effects on a portfolio range from a card that tilts under the cursor to a whole world visitors explore. The small ones cost almost nothing and add polish; the big ones are memorable but take real work and can slow the site down. This guide covers the four main kinds, the tools behind them, and the rules that keep a 3D portfolio fast on phones.',
    demoTitle: 'The biggest kind: a space to explore',
    demoText: 'A live 3D room running in this page. Drag to look around, zoom in, and tap the objects.',
    sections: [
      {
        title: '1. Tilt and parallax: 3D-looking, mostly CSS',
        paragraphs: [
          'The lightest kind. Project cards tilt toward the cursor, layers of an image move at different speeds, or a hero image shifts slightly as you scroll. These are done with CSS transforms (perspective, rotateX, rotateY, translateZ) and a few lines of JavaScript that follow the pointer or the scroll position.',
          'They add depth without loading any 3D library, and they run well on almost any device. The limit is that nothing is really 3D: there are no models and no camera, only flat layers moved in space. Use them to make a grid of work feel more alive, not as the main idea of the site.',
        ],
      },
      {
        title: '2. Scroll-driven 3D: a scene that moves as you read',
        paragraphs: [
          'A 3D object or scene stays on screen and turns, opens or changes as the visitor scrolls, while text sections pass by. Product launch pages use this a lot. It is usually built with Three.js or React Three Fiber for the scene and an animation library such as GSAP with its ScrollTrigger plugin to tie the camera or the model to the scroll position.',
          'It tells a story in order, which suits case studies. It costs more: a 3D library, at least one model, and careful tuning so the motion stays smooth while the page scrolls. Scroll-jacking, where the page stops scrolling normally, is the most common way these sites frustrate people.',
        ],
      },
      {
        title: '3. A WebGL hero: one 3D scene at the top',
        paragraphs: [
          'A single interactive scene in the first screen: a shape that reacts to the mouse, particles, a model of something you made, a shader that ripples. Below it, the rest of the portfolio is a normal page. Tools range from Spline, where you design the scene visually and embed it, to Three.js or React Three Fiber in code, with models made in Blender.',
          'This is the best balance for many people. It makes a strong first impression and leaves the work itself easy to read. The risk is the first screen loading slowly, which is exactly where visitors decide whether to stay, so the scene should load after the text and have a still image as a fallback.',
        ],
      },
      {
        title: '4. An explorable world: the portfolio is the space',
        paragraphs: [
          'The whole portfolio is a 3D place: a room, an island, a town or a game. Visitors move around and find projects as objects. The best-known examples, such as Bruno Simon’s portfolio where you drive a small car around a world, took their makers weeks of work with Three.js and Blender, and a lot of skill.',
          'Nothing is more memorable, and nothing costs more to build or to keep up to date. It also has the biggest risks: long loading, work hidden behind exploration and poor results on weak phones. A world works best when there is also a plain way in, such as a menu or a normal page with the same projects.',
        ],
      },
      {
        title: 'The tools, and what each asks of you',
        paragraphs: [
          'Three.js is the most used JavaScript library for 3D in the browser; it handles the renderer, camera, lights, materials and model loading on top of WebGL. React Three Fiber lets you write a Three.js scene as React components, which fits sites already built with React or Next.js. Spline is a visual editor for 3D scenes that exports an embed, quick to start with but heavier and less flexible than hand-written code. Blender is where most custom models are made and textured before being exported, usually as glTF or GLB files.',
          'Building any of the bigger effects yourself means learning at least one of these, plus how to compress models and textures. If your goal is a portfolio rather than learning 3D, a tool that gives you the 3D part ready-made saves most of that time.',
        ],
      },
      {
        title: 'Rules that keep a 3D portfolio fast',
        paragraphs: [
          'Whatever kind of effect you choose, the same habits decide whether the site feels quick or heavy:',
        ],
        bullets: [
          'Keep your name, introduction and project descriptions as real HTML text, not text drawn inside the scene, so search engines, screen readers and translation tools can read them.',
          'Load the 3D after the page: show the text first, then load the library and models when the scene is about to be seen or when someone taps to open it.',
          'Compress models (glTF with Draco or Meshopt) and textures (KTX2 or WebP), and keep polygon counts low.',
          'Lower the quality on weaker devices: smaller render size, fewer shadows, a lower frame rate when nothing moves.',
          'Respect prefers-reduced-motion and offer a still image or a plain version for people who turn motion off.',
          'Have a fallback when WebGL is not available, and never make the 3D the only route to your work or contact details.',
        ],
      },
      {
        title: 'Where Perlink fits',
        paragraphs: [
          'Perlink gives you the explorable kind without code. Your portfolio is a normal page that loads fast and that search engines can read, and the same page is a 3D room visitors can walk around: your photos in picture frames on the walls, links on a laptop or a neon sign, a desk, shelves and lamps, on one of 11 lands, by day or night.',
          'The room only loads when it is opened, or first if you choose room-first, and it adjusts its quality to the device, using WebGL or WebGPU where the browser has it. You arrange everything in a visual editor, and you can record a vertical video tour of the room for social media.',
        ],
      },
    ],
    table: {
      title: 'The four kinds compared',
      columns: ['', 'Effort to build yourself', 'Effect on speed'],
      rows: [
        ['Tilt and parallax', 'Hours, CSS and a little JavaScript', 'Almost none'],
        ['Scroll-driven 3D', 'Days, Three.js or R3F plus GSAP', 'Medium: a library and models to load'],
        ['WebGL hero scene', 'A day with Spline, days in code', 'Medium, mostly on the first screen'],
        ['Explorable world', 'Weeks, Three.js and Blender', 'High unless loaded on demand'],
      ],
    },
    stepsTitle: 'Adding 3D to your portfolio, step by step',
    steps: [
      { title: 'Write the plain version first', text: 'Introduction, best projects, contact. If the 3D failed to load, this page should still get you the job.' },
      { title: 'Pick one kind of effect', text: 'Choose the one that fits your work and time: tilt for polish, a hero scene for impact, a world for a creative statement.' },
      { title: 'Choose your tool', text: 'CSS for tilt, Spline or Three.js for a hero, Three.js and Blender for a world, or Perlink for a ready-made room.' },
      { title: 'Load it late', text: 'Show the text first and load the 3D on demand. Test on a mid-range phone over mobile data, not only on your laptop.' },
      { title: 'Add the fallbacks', text: 'A still image, reduced motion support and a way to reach every project without the 3D.' },
      { title: 'Measure and trim', text: 'Check load time and smoothness, then shrink models and textures until both are good on a phone.' },
    ],
    faq: [
      { q: 'What is the easiest way to add 3D effects to a portfolio?', a: 'Tilt or parallax effects with CSS are the easiest to code. For real 3D without code, Spline lets you embed a scene you design visually, and Perlink gives you a whole explorable room with your work in it.' },
      { q: 'Do 3D effects slow down a website?', a: 'They can. A 3D library and models add download size and work for the phone. Loading the 3D after the text, compressing models and lowering quality on weaker devices keeps the cost small.' },
      { q: 'Is Three.js or Spline better for a portfolio?', a: 'Spline is faster to start with and needs no code, but its embeds are heavier and harder to customise. Three.js takes longer to learn and gives full control over the scene and its performance.' },
      { q: 'Are 3D effects bad for SEO?', a: 'Not if your text stays as HTML. Search engines struggle with text drawn inside a WebGL canvas, so keep your name, descriptions and headings in the page itself.' },
      { q: 'Do 3D portfolio websites work on mobile?', a: 'Light effects work everywhere. Heavier scenes need smaller models, lower quality on weaker phones and touch controls. Always test on a real mid-range phone.' },
      { q: 'What does prefers-reduced-motion mean for my 3D portfolio?', a: 'It is a setting people turn on when motion bothers them. Your site can read it and switch off camera movements or show a still image instead.' },
      { q: 'Can I have a 3D portfolio without coding?', a: 'Yes. Perlink builds the 3D room for you from a template; you add your photos, links and words in a visual editor and publish at perlink.to/yourname.' },
    ],
    ctaTitle: 'Get the 3D without the weeks of work',
    ctaText: 'A fast portfolio page and an explorable 3D room at one address, made in a visual editor. Free to start.',
  },
  vi: {
    seoTitle: 'Website portfolio hiệu ứng 3D: các loại và mẹo',
    description: 'Từ thẻ nghiêng theo chuột tới cả một thế giới 3D: các loại hiệu ứng 3D cho website portfolio, công sức và tốc độ của từng loại, và cách giữ trang nhanh.',
    eyebrow: 'Portfolio có hiệu ứng 3D',
    title: 'Website portfolio có hiệu ứng 3D: chọn loại nào và giữ trang nhanh thế nào',
    intro: 'Hiệu ứng 3D trên portfolio có thể chỉ là một tấm thẻ nghiêng theo con trỏ, cũng có thể là cả một thế giới để người xem đi khám phá. Loại nhỏ gần như không tốn gì mà vẫn làm trang trau chuốt hơn; loại lớn rất ấn tượng nhưng tốn công thật sự và dễ làm trang chậm đi. Bài này nói về bốn loại chính, công cụ đứng sau từng loại, và những nguyên tắc giúp portfolio 3D vẫn nhanh trên điện thoại.',
    demoTitle: 'Loại lớn nhất: một không gian để khám phá',
    demoText: 'Một phòng 3D đang chạy ngay trong trang này. Kéo để nhìn quanh, phóng to và chạm vào các đồ vật.',
    sections: [
      {
        title: '1. Nghiêng và parallax: trông như 3D, phần lớn là CSS',
        paragraphs: [
          'Loại nhẹ nhất. Thẻ dự án nghiêng về phía con trỏ, các lớp của một bức ảnh trôi với tốc độ khác nhau, hoặc ảnh đầu trang dịch nhẹ khi cuộn. Tất cả làm bằng CSS transform (perspective, rotateX, rotateY, translateZ) cùng vài dòng JavaScript theo dõi con trỏ hay vị trí cuộn.',
          'Hiệu ứng này tạo chiều sâu mà không phải tải thư viện 3D nào, và chạy tốt trên hầu hết thiết bị. Giới hạn là không có gì thật sự 3D: không có mô hình, không có camera, chỉ là các lớp phẳng được dịch trong không gian. Hãy dùng để lưới tác phẩm sinh động hơn, đừng biến nó thành ý tưởng chính của trang.',
        ],
      },
      {
        title: '2. 3D theo thanh cuộn: cảnh chuyển động khi bạn đọc',
        paragraphs: [
          'Một vật thể hay cảnh 3D đứng yên trên màn hình rồi xoay, mở ra hoặc biến đổi khi người xem cuộn trang, trong lúc các đoạn chữ trôi qua. Trang ra mắt sản phẩm rất hay dùng kiểu này. Thường được làm bằng Three.js hoặc React Three Fiber cho phần cảnh, kèm một thư viện hoạt ảnh như GSAP với plugin ScrollTrigger để gắn camera hay mô hình vào vị trí cuộn.',
          'Kiểu này kể chuyện theo trình tự, rất hợp với case study. Đổi lại tốn công hơn: một thư viện 3D, ít nhất một mô hình, và phải tinh chỉnh kỹ để chuyển động mượt khi cuộn. Chiếm quyền cuộn trang, khiến trang không còn cuộn bình thường, là lỗi phổ biến nhất làm người xem khó chịu.',
        ],
      },
      {
        title: '3. Cảnh WebGL đầu trang: một cảnh 3D ở màn hình đầu tiên',
        paragraphs: [
          'Một cảnh tương tác duy nhất ở màn hình đầu: một khối hình phản ứng theo chuột, các hạt sáng, mô hình một thứ bạn từng làm, một shader gợn sóng. Phần còn lại của portfolio là trang bình thường. Công cụ có thể là Spline, nơi bạn dựng cảnh trực quan rồi nhúng vào, hoặc Three.js, React Three Fiber viết bằng code, với mô hình làm trong Blender.',
          'Với nhiều người, đây là điểm cân bằng tốt nhất: ấn tượng mạnh ở cái nhìn đầu mà tác phẩm vẫn dễ đọc. Rủi ro là màn hình đầu tải chậm, mà đó lại đúng là lúc người xem quyết định ở lại hay đi, nên cảnh 3D cần tải sau phần chữ và có một ảnh tĩnh thay thế.',
        ],
      },
      {
        title: '4. Thế giới để khám phá: portfolio chính là không gian',
        paragraphs: [
          'Toàn bộ portfolio là một nơi chốn 3D: căn phòng, hòn đảo, thị trấn hay một trò chơi. Người xem di chuyển và tìm thấy dự án dưới dạng đồ vật. Những ví dụ nổi tiếng nhất, như portfolio của Bruno Simon nơi bạn lái một chiếc xe nhỏ đi quanh một thế giới, đã tốn của người làm nhiều tuần với Three.js và Blender cùng rất nhiều tay nghề.',
          'Không gì dễ nhớ bằng, và cũng không gì tốn công làm và cập nhật bằng. Rủi ro cũng lớn nhất: tải lâu, tác phẩm bị giấu sau việc khám phá và chạy kém trên điện thoại yếu. Một thế giới 3D hiệu quả nhất khi vẫn có lối vào đơn giản, như một menu hay một trang bình thường với cùng các dự án.',
        ],
      },
      {
        title: 'Các công cụ, và mỗi cái đòi hỏi gì',
        paragraphs: [
          'Three.js là thư viện JavaScript phổ biến nhất cho 3D trên trình duyệt; nó lo phần render, camera, ánh sáng, chất liệu và nạp mô hình, chạy trên nền WebGL. React Three Fiber cho phép viết cảnh Three.js dưới dạng component React, hợp với trang đã làm bằng React hay Next.js. Spline là trình dựng cảnh 3D trực quan, xuất ra mã nhúng, bắt đầu nhanh nhưng nặng hơn và kém linh hoạt hơn code viết tay. Blender là nơi phần lớn mô hình được dựng và gắn texture trước khi xuất ra, thường ở dạng glTF hoặc GLB.',
          'Tự làm bất kỳ hiệu ứng lớn nào cũng có nghĩa là phải học ít nhất một trong số này, cộng thêm cách nén mô hình và texture. Nếu mục tiêu của bạn là có portfolio chứ không phải học 3D, một công cụ làm sẵn phần 3D sẽ tiết kiệm phần lớn thời gian đó.',
        ],
      },
      {
        title: 'Nguyên tắc giữ portfolio 3D luôn nhanh',
        paragraphs: [
          'Dù chọn loại hiệu ứng nào, vẫn là những thói quen này quyết định trang nhanh hay nặng:',
        ],
        bullets: [
          'Giữ tên, phần giới thiệu và mô tả dự án là chữ HTML thật, không vẽ trong cảnh 3D, để Google, trình đọc màn hình và công cụ dịch đọc được.',
          'Tải 3D sau trang: hiện chữ trước, rồi mới tải thư viện và mô hình khi cảnh sắp được xem hoặc khi có người chạm để mở.',
          'Nén mô hình (glTF với Draco hoặc Meshopt) và texture (KTX2 hoặc WebP), giữ số đa giác thấp.',
          'Giảm chất lượng trên máy yếu: render nhỏ hơn, ít bóng đổ hơn, giảm số khung hình khi không có gì chuyển động.',
          'Tôn trọng prefers-reduced-motion và có ảnh tĩnh hoặc bản đơn giản cho người tắt chuyển động.',
          'Có phương án dự phòng khi máy không hỗ trợ WebGL, và đừng bao giờ để 3D là đường duy nhất tới tác phẩm hay thông tin liên hệ.',
        ],
      },
      {
        title: 'Perlink nằm ở đâu trong bức tranh này',
        paragraphs: [
          'Perlink cho bạn loại “thế giới để khám phá” mà không cần code. Portfolio của bạn là một trang bình thường, tải nhanh và Google đọc được, đồng thời chính trang đó là một căn phòng 3D để khách dạo quanh: ảnh tác phẩm trong khung trên tường, liên kết gắn vào laptop hay biển neon, bàn làm việc, kệ sách, đèn, trên một trong 11 vùng đất, ngày hoặc đêm.',
          'Căn phòng chỉ tải khi được mở, hoặc tải trước nếu bạn chọn mở phòng trước, và tự điều chỉnh chất lượng theo máy, dùng WebGL hoặc WebGPU nếu trình duyệt hỗ trợ. Bạn sắp xếp mọi thứ bằng trình chỉnh sửa trực quan, và có thể quay video dọc dạo quanh phòng để đăng mạng xã hội.',
        ],
      },
    ],
    table: {
      title: 'So sánh bốn loại',
      columns: ['', 'Công sức tự làm', 'Ảnh hưởng tới tốc độ'],
      rows: [
        ['Nghiêng và parallax', 'Vài giờ, CSS và chút JavaScript', 'Gần như không'],
        ['3D theo thanh cuộn', 'Vài ngày, Three.js hoặc R3F cùng GSAP', 'Vừa: thêm thư viện và mô hình'],
        ['Cảnh WebGL đầu trang', 'Một ngày với Spline, vài ngày nếu viết code', 'Vừa, chủ yếu ở màn hình đầu'],
        ['Thế giới để khám phá', 'Vài tuần, Three.js và Blender', 'Lớn, trừ khi chỉ tải khi cần'],
      ],
    },
    stepsTitle: 'Thêm 3D vào portfolio, từng bước',
    steps: [
      { title: 'Làm bản đơn giản trước', text: 'Giới thiệu, dự án tốt nhất, liên hệ. Kể cả khi phần 3D không tải được, trang này vẫn phải đủ sức giúp bạn có việc.' },
      { title: 'Chọn một loại hiệu ứng', text: 'Chọn loại hợp với tác phẩm và thời gian của bạn: nghiêng cho trau chuốt, cảnh đầu trang cho ấn tượng, thế giới 3D cho tuyên ngôn sáng tạo.' },
      { title: 'Chọn công cụ', text: 'CSS cho hiệu ứng nghiêng, Spline hoặc Three.js cho cảnh đầu trang, Three.js và Blender cho thế giới 3D, hoặc Perlink cho căn phòng làm sẵn.' },
      { title: 'Tải muộn', text: 'Hiện chữ trước, tải 3D khi cần. Thử trên một chiếc điện thoại tầm trung dùng 4G, không chỉ trên laptop của bạn.' },
      { title: 'Thêm phương án dự phòng', text: 'Ảnh tĩnh, hỗ trợ giảm chuyển động và một đường tới mọi dự án mà không cần 3D.' },
      { title: 'Đo và cắt gọt', text: 'Kiểm tra thời gian tải và độ mượt, rồi thu nhỏ mô hình, texture tới khi cả hai đều ổn trên điện thoại.' },
    ],
    faq: [
      { q: 'Cách dễ nhất để thêm hiệu ứng 3D vào portfolio là gì?', a: 'Hiệu ứng nghiêng hay parallax bằng CSS là dễ viết code nhất. Muốn 3D thật mà không code, Spline cho phép nhúng cảnh bạn dựng trực quan, còn Perlink cho bạn nguyên một căn phòng 3D có sẵn tác phẩm của bạn.' },
      { q: 'Hiệu ứng 3D có làm website chậm không?', a: 'Có thể. Thư viện 3D và mô hình làm tăng dung lượng tải và bắt điện thoại làm việc nhiều hơn. Tải 3D sau phần chữ, nén mô hình và giảm chất lượng trên máy yếu sẽ giữ cái giá đó ở mức nhỏ.' },
      { q: 'Nên dùng Three.js hay Spline cho portfolio?', a: 'Spline bắt đầu nhanh hơn và không cần code, nhưng mã nhúng nặng hơn và khó tùy biến. Three.js mất thời gian học hơn nhưng cho bạn toàn quyền với cảnh và hiệu năng.' },
      { q: 'Hiệu ứng 3D có hại cho SEO không?', a: 'Không, nếu chữ của bạn vẫn là HTML. Google khó đọc chữ vẽ trong canvas WebGL, nên hãy giữ tên, mô tả và tiêu đề ngay trong trang.' },
      { q: 'Website portfolio 3D có chạy được trên điện thoại không?', a: 'Hiệu ứng nhẹ chạy ở mọi nơi. Cảnh nặng hơn cần mô hình nhỏ, giảm chất lượng trên máy yếu và điều khiển bằng chạm. Luôn thử trên một chiếc điện thoại tầm trung thật.' },
      { q: 'prefers-reduced-motion có ý nghĩa gì với portfolio 3D?', a: 'Đó là cài đặt người dùng bật khi chuyển động làm họ khó chịu. Trang của bạn có thể đọc cài đặt này để tắt chuyển động camera hoặc hiện ảnh tĩnh thay thế.' },
      { q: 'Có làm được portfolio 3D mà không cần code không?', a: 'Được. Perlink dựng căn phòng 3D cho bạn từ một mẫu; bạn thêm ảnh, liên kết và chữ bằng trình chỉnh sửa trực quan rồi đăng tại perlink.to/tên-bạn.' },
    ],
    ctaTitle: 'Có phần 3D mà không mất hàng tuần',
    ctaText: 'Một trang portfolio tải nhanh và một căn phòng 3D để khám phá, chung một địa chỉ, làm bằng trình chỉnh sửa trực quan. Bắt đầu miễn phí.',
  },
}
