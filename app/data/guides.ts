// How-to guides on the marketing site: the searches people make before they
// pick a tool ("how to make a personal website") get a real answer, not a
// product page. Each guide has an English and a Vietnamese address.

import type { MarketingLang } from './marketingCopy'

export interface GuideSection {
  title: string
  paragraphs: string[]
  bullets?: string[]
}

export interface GuideText {
  seoTitle: string
  description: string
  eyebrow: string
  title: string
  intro: string
  /** Minutes it takes to read */
  readMinutes: number
  sections: GuideSection[]
  /** Numbered steps, the heart of the guide */
  stepsTitle: string
  steps: { title: string; text: string }[]
  faq: { q: string; a: string }[]
  ctaTitle: string
  ctaText: string
}

export interface Guide {
  id: string
  path: Record<MarketingLang, string>
  /** Template the guide suggests starting from */
  templateId: string
  updated: string
  en: GuideText
  vi: GuideText
}

export const GUIDES: Guide[] = [
  {
    id: 'personal-website',
    path: { en: '/how-to-make-a-personal-website', vi: '/vi/cach-tao-website-ca-nhan' },
    templateId: 'personal',
    updated: '2026-11-05',
    en: {
      seoTitle: 'How to Make a Personal Website (Free, No Code) — Perlink',
      description: 'A step-by-step guide to making a personal website for free: what to put on it, how to pick an address, how to write your about section and how to get found on Google.',
      eyebrow: 'Guide',
      title: 'How to make a personal website',
      intro: 'A personal website is one address that tells people who you are, what you do and how to reach you. You don’t need to code or pay for hosting to make one. This guide walks through what to put on it, how to write it and how to publish it in an afternoon.',
      readMinutes: 6,
      sections: [
        {
          title: 'What a personal website is for',
          paragraphs: [
            'Social profiles come and go, and each one shows only part of you. A personal website is the page you own: it collects your work, your story and your contact details in one place, and it stays the same when platforms change their rules.',
            'People use one to find a job, win clients, sell a few products, share a portfolio or simply have a link that looks better than a list of social handles.',
          ],
        },
        {
          title: 'What to put on it',
          paragraphs: ['Keep it short. Most visitors decide in a few seconds whether they’re in the right place, so lead with the essentials:'],
          bullets: [
            'Your name, a photo and one sentence on what you do.',
            'A short about section: who you help, what you’re good at, and something human.',
            'Your best work: three to six projects, photos or results, each with a line of context.',
            'Proof: a few testimonials, logos of clients or numbers you can stand behind.',
            'One clear way to contact you: an email, a form or a booking link.',
            'Links to the two or three profiles that matter (not all of them).',
          ],
        },
        {
          title: 'How to write your about section',
          paragraphs: [
            'Write the way you’d introduce yourself to someone at an event. Start with what you do and for whom, add one detail that shows experience (a number, a client, a place), and end with what you’d like the reader to do next.',
            'For example: “I’m a product designer in Ho Chi Minh City. For six years I’ve helped startups turn rough ideas into apps people enjoy using. Have a project? Write to me below.”',
          ],
        },
        {
          title: 'Getting found on Google',
          paragraphs: ['A personal website helps people who search your name find the right you. To help search engines understand the page:'],
          bullets: [
            'Use your real name in the page title and the first heading.',
            'Write a sentence or two of plain text about what you do; images alone say nothing to a search engine.',
            'Link to your website from your social profiles, email signature and CV.',
            'Keep it up to date: a page that changes now and then looks alive.',
          ],
        },
      ],
      stepsTitle: 'Make one in six steps',
      steps: [
        { title: 'Pick your address', text: 'Choose a short name people can say out loud, like perlink.to/yourname. On a paid plan you can connect your own domain later and keep the same address.' },
        { title: 'Start from a template', text: 'Pick a personal or portfolio template so the layout, fonts and colours already work together. Every template comes with sample content you replace.' },
        { title: 'Write the top of the page', text: 'Add your photo, your name and one line on what you do. This is what most visitors read, so spend the most time here.' },
        { title: 'Add your work and proof', text: 'Add a gallery, a few projects or a CV block, then two or three testimonials. Fewer, better pieces beat a long list.' },
        { title: 'Add a way to reach you', text: 'Add a contact form, your email or a booking link, plus the social profiles that matter.' },
        { title: 'Publish and share', text: 'Publish, open the page on your phone to check it, then put the link in your bios, email signature and CV.' },
      ],
      faq: [
        { q: 'Can I make a personal website for free?', a: 'Yes. On Perlink’s free plan you can publish one site at perlink.to/yourname with no time limit. Paid plans add more sites, Pro themes and your own domain.' },
        { q: 'Do I need to know how to code?', a: 'No. You build the page from blocks (text, photos, links, a contact form) in a drag-and-drop editor.' },
        { q: 'How long does it take?', a: 'Starting from a template, most people publish a first version in under an hour. The writing takes longer than the building.' },
        { q: 'Should I use my own domain?', a: 'It looks more professional, but it isn’t needed to start. You can begin at perlink.to/yourname and connect a domain later on Plus or Max.' },
      ],
      ctaTitle: 'Start your personal website',
      ctaText: 'Claim your address and start from a template. Free, and live in a minute.',
    },
    vi: {
      seoTitle: 'Cách tạo website cá nhân miễn phí, không cần code — Perlink',
      description: 'Hướng dẫn từng bước tạo website cá nhân miễn phí: nên có gì trên trang, chọn địa chỉ, viết phần giới thiệu và để Google tìm thấy bạn.',
      eyebrow: 'Hướng dẫn',
      title: 'Cách tạo website cá nhân',
      intro: 'Website cá nhân là một địa chỉ cho người khác biết bạn là ai, làm gì và liên hệ bằng cách nào. Bạn không cần biết code hay thuê hosting. Bài này hướng dẫn nên đưa gì lên trang, viết thế nào và xuất bản trong một buổi chiều.',
      readMinutes: 6,
      sections: [
        {
          title: 'Website cá nhân dùng để làm gì',
          paragraphs: [
            'Mạng xã hội thay đổi liên tục, và mỗi nơi chỉ cho thấy một phần của bạn. Website cá nhân là trang của riêng bạn: gom công việc, câu chuyện và cách liên hệ vào một chỗ, không phụ thuộc vào luật lệ của nền tảng nào.',
            'Người ta dùng nó để xin việc, tìm khách hàng, bán vài sản phẩm, khoe portfolio, hoặc đơn giản là có một đường link đẹp hơn danh sách tài khoản mạng xã hội.',
          ],
        },
        {
          title: 'Nên có gì trên trang',
          paragraphs: ['Càng ngắn gọn càng tốt. Người xem quyết định trong vài giây có ở lại hay không, nên hãy đặt những thứ quan trọng lên đầu:'],
          bullets: [
            'Tên, ảnh và một câu về công việc của bạn.',
            'Phần giới thiệu ngắn: bạn giúp ai, giỏi gì, và một chi tiết đời thường.',
            'Sản phẩm tốt nhất: ba đến sáu dự án, hình ảnh hoặc kết quả, mỗi cái kèm một dòng giải thích.',
            'Bằng chứng: vài nhận xét của khách, logo đối tác hoặc con số có thật.',
            'Một cách liên hệ rõ ràng: email, form hoặc link đặt lịch.',
            'Link tới hai, ba trang mạng xã hội quan trọng nhất (không cần tất cả).',
          ],
        },
        {
          title: 'Cách viết phần giới thiệu',
          paragraphs: [
            'Hãy viết như khi bạn tự giới thiệu với người mới gặp. Mở đầu bằng việc bạn làm và cho ai, thêm một chi tiết cho thấy kinh nghiệm (một con số, một khách hàng, một nơi chốn), rồi kết bằng điều bạn muốn người đọc làm tiếp.',
            'Ví dụ: “Mình là product designer ở TP.HCM. Sáu năm qua mình giúp các startup biến ý tưởng thô thành ứng dụng dễ dùng. Có dự án? Nhắn mình ở bên dưới nhé.”',
          ],
        },
        {
          title: 'Để Google tìm thấy bạn',
          paragraphs: ['Website cá nhân giúp người tìm tên bạn trên Google thấy đúng bạn. Để công cụ tìm kiếm hiểu trang:'],
          bullets: [
            'Dùng tên thật trong tiêu đề trang và dòng tiêu đề đầu tiên.',
            'Viết vài câu chữ về việc bạn làm; chỉ có hình thì công cụ tìm kiếm không đọc được.',
            'Gắn link website vào trang mạng xã hội, chữ ký email và CV.',
            'Thỉnh thoảng cập nhật: trang có thay đổi trông “còn sống” hơn.',
          ],
        },
      ],
      stepsTitle: 'Tạo website trong sáu bước',
      steps: [
        { title: 'Chọn địa chỉ', text: 'Chọn một cái tên ngắn, dễ đọc, như perlink.to/tên-bạn. Với gói trả phí, bạn có thể nối tên miền riêng sau mà vẫn giữ địa chỉ này.' },
        { title: 'Bắt đầu từ một mẫu', text: 'Chọn mẫu cá nhân hoặc portfolio để bố cục, phông chữ và màu sắc đã hợp nhau sẵn. Mẫu nào cũng có nội dung mẫu để bạn thay.' },
        { title: 'Viết phần đầu trang', text: 'Thêm ảnh, tên và một dòng về công việc của bạn. Đây là phần hầu hết mọi người đọc, nên hãy dành nhiều thời gian nhất ở đây.' },
        { title: 'Thêm sản phẩm và bằng chứng', text: 'Thêm album ảnh, vài dự án hoặc khối CV, rồi hai, ba nhận xét. Ít mà chất hơn nhiều mà dàn trải.' },
        { title: 'Thêm cách liên hệ', text: 'Thêm form liên hệ, email hoặc link đặt lịch, cùng các trang mạng xã hội quan trọng.' },
        { title: 'Xuất bản và chia sẻ', text: 'Xuất bản, mở trang trên điện thoại để kiểm tra, rồi gắn link vào bio, chữ ký email và CV.' },
      ],
      faq: [
        { q: 'Tạo website cá nhân miễn phí được không?', a: 'Được. Gói Miễn phí của Perlink cho bạn xuất bản một trang ở perlink.to/tên-bạn, không giới hạn thời gian. Gói trả phí có thêm trang, theme Pro và tên miền riêng.' },
        { q: 'Có cần biết lập trình không?', a: 'Không. Bạn dựng trang từ các khối (chữ, ảnh, link, form liên hệ) bằng trình chỉnh sửa kéo thả.' },
        { q: 'Mất bao lâu?', a: 'Bắt đầu từ một mẫu, đa số mọi người xuất bản bản đầu tiên trong chưa tới một giờ. Phần viết nội dung thường lâu hơn phần dựng trang.' },
        { q: 'Có nên dùng tên miền riêng?', a: 'Tên miền riêng trông chuyên nghiệp hơn, nhưng không bắt buộc lúc đầu. Bạn có thể bắt đầu ở perlink.to/tên-bạn rồi nối tên miền sau với gói Plus hoặc Max.' },
      ],
      ctaTitle: 'Tạo website cá nhân của bạn',
      ctaText: 'Giữ địa chỉ của bạn và bắt đầu từ một mẫu. Miễn phí, lên sóng trong một phút.',
    },
  },
  {
    id: 'link-in-bio',
    path: { en: '/how-to-make-a-link-in-bio', vi: '/vi/cach-tao-link-bio' },
    templateId: 'link-in-bio',
    updated: '2026-11-05',
    en: {
      seoTitle: 'How to Make a Link in Bio Page for Instagram & TikTok — Perlink',
      description: 'How to make a free link in bio page for Instagram, TikTok and YouTube: what links to include, how to order them, and how to add it to your profile.',
      eyebrow: 'Guide',
      title: 'How to make a link in bio page',
      intro: 'Instagram and TikTok give you one link in your profile. A link in bio page turns that one link into a small page with everything you want people to find: your shop, your latest video, your booking form, your socials. Here’s how to make one that people actually tap.',
      readMinutes: 5,
      sections: [
        {
          title: 'Why use a link in bio page',
          paragraphs: [
            'Changing the link in your profile every time you post something new means older posts point to the wrong place. A link in bio page stays at one address while you change what’s on it, so every post can say “link in bio” and still be right.',
            'It also tells you what people care about: clicks per link show which offer, product or video works.',
          ],
        },
        {
          title: 'What links to include',
          paragraphs: ['Fewer links get more clicks. Put the one thing you most want people to do at the top, then add what supports it:'],
          bullets: [
            'Your main goal first: the shop, the booking form, the new release or the sign-up.',
            'Your latest post, video or campaign, while it’s fresh.',
            'Two or three social profiles as icons, not as big buttons.',
            'A way to contact you, if that’s how you get work.',
            'Products with photos and prices if you sell; people tap pictures more than text.',
          ],
        },
        {
          title: 'Tips for a page people tap',
          paragraphs: ['Most visitors arrive on a phone, from an app, for a few seconds. So:'],
          bullets: [
            'Write button labels as actions: “Book a table”, “Shop the drop”, not just “Website”.',
            'Use the same photo and name as your profile so people know they’re in the right place.',
            'Keep the most important link above the fold on a phone.',
            'Remove links that nobody clicks after a few weeks.',
          ],
        },
      ],
      stepsTitle: 'Make one in five steps',
      steps: [
        { title: 'Claim your name', text: 'Pick an address that matches your handle, like perlink.to/yourname, so it’s easy to remember and type.' },
        { title: 'Pick a template', text: 'Start from a link in bio template and choose a theme that matches your feed.' },
        { title: 'Add your links and socials', text: 'Add your main link first, then your latest content and your social icons. Add products, videos or a form if you need them.' },
        { title: 'Publish and test', text: 'Publish, open the page on your phone and tap every link once.' },
        { title: 'Add it to your profiles', text: 'Paste the address into the website field of your Instagram, TikTok and YouTube profiles, then say “link in bio” in your posts.' },
      ],
      faq: [
        { q: 'Is a link in bio page free?', a: 'Yes. On Perlink’s free plan you can publish one page at perlink.to/yourname with no time limit, with links, socials, products and videos.' },
        { q: 'Where do I put the link on Instagram or TikTok?', a: 'Edit your profile and paste the address into the Website (Instagram) or Website/Link (TikTok) field. On TikTok the field may need a business or creator account.' },
        { q: 'Can I see how many people click?', a: 'Yes. Perlink shows visits and clicks per link, so you can see what works and remove what doesn’t.' },
        { q: 'Can it be more than a list of links?', a: 'Yes. Add products with prices, a menu, videos, a contact form or a blog, and every page can also be opened as a small 3D room.' },
      ],
      ctaTitle: 'Make your link in bio',
      ctaText: 'Claim perlink.to/yourname and add your links. Free, and live in a minute.',
    },
    vi: {
      seoTitle: 'Cách tạo link bio cho Instagram, TikTok miễn phí — Perlink',
      description: 'Cách tạo trang link bio miễn phí cho Instagram, TikTok và YouTube: nên đặt link nào, sắp xếp ra sao và gắn vào trang cá nhân thế nào.',
      eyebrow: 'Hướng dẫn',
      title: 'Cách tạo trang link bio',
      intro: 'Instagram và TikTok chỉ cho bạn một đường link trên trang cá nhân. Trang link bio biến đường link đó thành một trang nhỏ chứa mọi thứ bạn muốn người xem tìm thấy: cửa hàng, video mới nhất, form đặt lịch, các mạng xã hội. Đây là cách làm một trang mà người xem thật sự bấm vào.',
      readMinutes: 5,
      sections: [
        {
          title: 'Vì sao nên dùng trang link bio',
          paragraphs: [
            'Mỗi lần đăng bài mới lại đổi link trên trang cá nhân thì các bài cũ sẽ trỏ sai chỗ. Trang link bio giữ nguyên một địa chỉ trong khi bạn thay nội dung bên trong, nên bài nào ghi “link ở bio” cũng vẫn đúng.',
            'Nó còn cho bạn biết người xem quan tâm gì: số lượt bấm của từng link cho thấy ưu đãi, sản phẩm hay video nào hiệu quả.',
          ],
        },
        {
          title: 'Nên đặt link nào',
          paragraphs: ['Càng ít link càng nhiều lượt bấm. Đặt điều bạn muốn người xem làm nhất lên đầu, rồi thêm những thứ hỗ trợ:'],
          bullets: [
            'Mục tiêu chính lên đầu: cửa hàng, form đặt lịch, sản phẩm mới hoặc đăng ký.',
            'Bài đăng, video hay chiến dịch mới nhất, khi còn đang “nóng”.',
            'Hai, ba mạng xã hội dưới dạng biểu tượng, không cần nút to.',
            'Cách liên hệ, nếu bạn nhận việc qua đó.',
            'Sản phẩm có ảnh và giá nếu bạn bán hàng; người xem bấm vào hình nhiều hơn chữ.',
          ],
        },
        {
          title: 'Mẹo để trang được bấm nhiều',
          paragraphs: ['Hầu hết người xem vào từ điện thoại, từ một ứng dụng, và chỉ ở lại vài giây. Vì vậy:'],
          bullets: [
            'Ghi nút bằng hành động: “Đặt bàn”, “Mua ngay”, thay vì chỉ “Website”.',
            'Dùng cùng ảnh và tên với trang cá nhân để người xem biết mình vào đúng chỗ.',
            'Đặt link quan trọng nhất ở phần nhìn thấy ngay trên điện thoại.',
            'Sau vài tuần, bỏ những link không ai bấm.',
          ],
        },
      ],
      stepsTitle: 'Tạo link bio trong năm bước',
      steps: [
        { title: 'Giữ tên của bạn', text: 'Chọn địa chỉ trùng với tên tài khoản, như perlink.to/tên-bạn, để dễ nhớ và dễ gõ.' },
        { title: 'Chọn một mẫu', text: 'Bắt đầu từ mẫu link bio và chọn theme hợp với phong cách trang của bạn.' },
        { title: 'Thêm link và mạng xã hội', text: 'Thêm link chính trước, rồi nội dung mới nhất và các biểu tượng mạng xã hội. Thêm sản phẩm, video hoặc form nếu cần.' },
        { title: 'Xuất bản và kiểm tra', text: 'Xuất bản, mở trang trên điện thoại và bấm thử từng link.' },
        { title: 'Gắn vào trang cá nhân', text: 'Dán địa chỉ vào ô Website trên Instagram, TikTok và YouTube, rồi nhắc “link ở bio” trong bài đăng.' },
      ],
      faq: [
        { q: 'Tạo link bio có miễn phí không?', a: 'Có. Gói Miễn phí của Perlink cho bạn xuất bản một trang ở perlink.to/tên-bạn, không giới hạn thời gian, có link, mạng xã hội, sản phẩm và video.' },
        { q: 'Gắn link vào Instagram, TikTok ở đâu?', a: 'Vào sửa hồ sơ và dán địa chỉ vào ô Trang web (Instagram) hoặc Website/Liên kết (TikTok). Trên TikTok, ô này có thể cần tài khoản doanh nghiệp hoặc nhà sáng tạo.' },
        { q: 'Có xem được bao nhiêu người bấm không?', a: 'Có. Perlink hiện lượt xem và lượt bấm của từng link, để bạn biết link nào hiệu quả và bỏ link không ai bấm.' },
        { q: 'Trang link bio có thể nhiều hơn danh sách link không?', a: 'Có. Bạn có thể thêm sản phẩm có giá, thực đơn, video, form liên hệ hay blog, và trang nào cũng mở được thành một căn phòng 3D nhỏ.' },
      ],
      ctaTitle: 'Tạo link bio của bạn',
      ctaText: 'Giữ địa chỉ perlink.to/tên-bạn và thêm link. Miễn phí, lên sóng trong một phút.',
    },
  },
]

export const GUIDE_PAIRS: [string, string][] = GUIDES.map(g => [g.path.en, g.path.vi])

/** The about page, in each language */
export const ABOUT_PAIR: [string, string] = ['/about', '/vi/gioi-thieu']
