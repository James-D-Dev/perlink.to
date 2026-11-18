// How-to guides on the marketing site: the searches people make before they
// pick a tool ("how to make a personal website") get a real answer, not a
// product page. Each guide has an English and a Vietnamese address; the
// Chinese, Japanese and Korean pages live under /zh, /ja, /ko + the English slug.

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

export type Guide = {
  id: string
  /** zh/ja/ko addresses come from path.en (see data/langPaths) */
  path: { en: string; vi: string }
  /** Template the guide suggests starting from */
  templateId: string
  updated: string
} & Record<MarketingLang, GuideText>

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
    zh: {
      seoTitle: '如何制作个人网站（免费、无需代码）— Perlink',
      description: '手把手教你免费制作个人网站：放哪些内容、怎么选网址、如何写自我介绍，以及怎样让别人在搜索引擎上找到你。',
      eyebrow: '指南',
      title: '如何制作个人网站',
      intro: '个人网站就是一个网址，告诉别人你是谁、做什么、怎么联系你。制作个人网站不需要会写代码，也不用花钱买主机。本文带你一步步搞定：放哪些内容、怎么写，以及如何在一个下午内发布上线。',
      readMinutes: 6,
      sections: [
        {
          title: '个人网站有什么用',
          paragraphs: [
            '社交账号来来去去，每个平台只能展示你的一部分。个人网站是真正属于你的页面：把作品、经历和联系方式集中在一处，平台规则怎么变，它都不受影响。',
            '有人用它求职、接项目、卖点小商品、展示作品集，也有人只是想要一个比一串社交账号更好看的链接。',
          ],
        },
        {
          title: '网站上放什么',
          paragraphs: ['越简洁越好。大多数访客几秒钟内就会决定要不要留下，所以先把最重要的内容放在前面：'],
          bullets: [
            '你的名字、一张照片，以及一句话说明你是做什么的。',
            '简短的自我介绍：你帮助谁、擅长什么，再加一点个人色彩。',
            '最好的作品：三到六个项目、照片或成果，每个配一句说明。',
            '可信的证明：几条客户评价、合作品牌的标志，或经得起推敲的数据。',
            '一个清晰的联系方式：邮箱、表单或预约链接。',
            '两三个最重要的社交主页链接（不用全放）。',
          ],
        },
        {
          title: '怎么写自我介绍',
          paragraphs: [
            '就像在活动上向别人介绍自己那样写。先说你做什么、为谁做，再加一个能体现经验的细节（一个数字、一位客户、一座城市），最后告诉读者下一步可以做什么。',
            '例如：“我是一名在上海工作的产品设计师。六年来，我帮助创业公司把粗糙的想法变成好用的 App。有项目想聊？欢迎在下方给我留言。”',
          ],
        },
        {
          title: '让搜索引擎找到你',
          paragraphs: ['有了个人网站，别人搜索你的名字时就能找到真正的你。想让搜索引擎更好地理解你的页面：'],
          bullets: [
            '在页面标题和第一个大标题里使用你的真实姓名。',
            '用一两句文字说明你做什么；只有图片的话，搜索引擎什么也读不到。',
            '在社交主页、邮件签名和简历里附上网站链接。',
            '保持更新：时不时有变化的页面看起来更有活力。',
          ],
        },
      ],
      stepsTitle: '六步做出个人网站',
      steps: [
        { title: '选好网址', text: '取一个简短、念得出口的名字，比如 perlink.to/yourname。升级到付费套餐后，还可以绑定自己的域名，原网址照样保留。' },
        { title: '从模板开始', text: '选一个个人主页或作品集模板，布局、字体和配色都已经搭配好。每个模板都自带示例内容，替换成你自己的就行。' },
        { title: '写好页面顶部', text: '放上你的照片、名字和一句话介绍。这是大多数访客都会看的部分，最值得花时间。' },
        { title: '添加作品和证明', text: '加入相册、几个项目或简历模块，再放两三条评价。少而精胜过多而杂。' },
        { title: '添加联系方式', text: '加上联系表单、邮箱或预约链接，以及重要的社交主页。' },
        { title: '发布并分享', text: '点击发布，用手机打开检查一遍，然后把链接放进各平台简介、邮件签名和简历里。' },
      ],
      faq: [
        { q: '可以免费制作个人网站吗？', a: '可以。使用 Perlink 免费版，你可以在 perlink.to/yourname 发布一个网站，没有时间限制。付费套餐提供更多网站、Pro 主题和自定义域名。' },
        { q: '需要会写代码吗？', a: '不需要。你可以在拖拽式编辑器里用各种模块（文字、图片、链接、联系表单）搭建页面。' },
        { q: '需要多长时间？', a: '从模板开始，大多数人不到一小时就能发布第一版。写内容往往比搭页面花的时间更多。' },
        { q: '要不要用自己的域名？', a: '自己的域名看起来更专业，但起步时并非必需。你可以先用 perlink.to/yourname，之后再通过 Plus 或 Max 套餐绑定域名。' },
      ],
      ctaTitle: '开始制作你的个人网站',
      ctaText: '抢先注册你的网址，从模板开始。免费使用，一分钟即可上线。',
    },
    ja: {
      seoTitle: '個人サイトの作り方｜無料・コード不要 — Perlink',
      description: '個人サイトを無料で作る方法をステップごとに解説。載せる内容、URLの決め方、自己紹介の書き方、Googleで見つけてもらうコツまで紹介します。',
      eyebrow: 'ガイド',
      title: '個人サイトの作り方',
      intro: '個人サイトは、あなたが誰で、何をしていて、どう連絡すればいいかを伝えるひとつのアドレスです。作るのにプログラミングもサーバー契約も必要ありません。このガイドでは、何を載せるか、どう書くか、そして半日で公開するまでの流れを紹介します。',
      readMinutes: 6,
      sections: [
        {
          title: '個人サイトは何のためにあるのか',
          paragraphs: [
            'SNSのアカウントは移り変わり、それぞれがあなたの一面しか見せてくれません。個人サイトは自分だけのページです。作品、経歴、連絡先をひとつにまとめられ、プラットフォームの規約が変わっても影響を受けません。',
            '就職・転職活動、仕事の受注、ちょっとした商品の販売、ポートフォリオの公開のほか、SNSアカウントを並べるより見栄えのいいリンクがほしい、という理由で作る人もいます。',
          ],
        },
        {
          title: '何を載せるか',
          paragraphs: ['短くまとめましょう。訪問者の多くは数秒で読み進めるかどうかを決めるので、大事なことから順に載せます。'],
          bullets: [
            '名前、写真、そして仕事をひと言で表す一文。',
            '短い自己紹介：誰の役に立てるか、何が得意か、そして人柄が伝わるひと言。',
            '代表作：3〜6件のプロジェクト、写真、実績。それぞれに一行の説明を添えます。',
            '信頼の裏付け：お客様の声、取引先のロゴ、自信を持って示せる数字。',
            'わかりやすい連絡手段をひとつ：メール、フォーム、予約リンクなど。',
            '本当に大事なSNS 2〜3個へのリンク（すべて載せる必要はありません）。',
          ],
        },
        {
          title: '自己紹介の書き方',
          paragraphs: [
            'イベントで初対面の人に自己紹介するつもりで書きましょう。まず何を誰のためにしているかを伝え、経験が伝わる具体的な情報（数字、取引先、場所）をひとつ加え、最後に読んだ人にしてほしい行動で締めくくります。',
            '例：「東京で活動するプロダクトデザイナーです。6年間、スタートアップの粗削りなアイデアを使いやすいアプリに仕上げるお手伝いをしてきました。ご相談は下のフォームからお気軽にどうぞ。」',
          ],
        },
        {
          title: 'Googleで見つけてもらうには',
          paragraphs: ['個人サイトがあれば、あなたの名前で検索した人がきちんとあなたにたどり着けます。検索エンジンにページを理解してもらうためのポイントです。'],
          bullets: [
            'ページタイトルと最初の見出しに本名を入れる。',
            '仕事内容を1〜2文のテキストで書く。画像だけでは検索エンジンには何も伝わりません。',
            'SNSのプロフィール、メール署名、履歴書からサイトへリンクする。',
            'こまめに更新する。ときどき変化があるページは「生きている」印象を与えます。',
          ],
        },
      ],
      stepsTitle: '6ステップで作る',
      steps: [
        { title: 'URLを決める', text: '声に出して言いやすい短い名前を選びましょう（例：perlink.to/yourname）。有料プランなら、あとから独自ドメインを接続しても同じアドレスを使い続けられます。' },
        { title: 'テンプレートから始める', text: '個人向けやポートフォリオのテンプレートを選べば、レイアウト・フォント・配色が最初から整っています。どのテンプレートにもサンプルが入っているので、自分の内容に差し替えるだけです。' },
        { title: 'ページの冒頭を書く', text: '写真、名前、仕事をひと言で表す一文を入れます。ほとんどの人が読むのはここなので、いちばん時間をかけましょう。' },
        { title: '作品と実績を加える', text: 'ギャラリー、いくつかのプロジェクト、または経歴ブロックを追加し、お客様の声を2〜3件載せます。数より質が大切です。' },
        { title: '連絡手段を加える', text: 'お問い合わせフォーム、メールアドレス、予約リンクと、大事なSNSを追加します。' },
        { title: '公開してシェアする', text: '公開したらスマホで表示を確認し、SNSのプロフィール、メール署名、履歴書にリンクを載せましょう。' },
      ],
      faq: [
        { q: '個人サイトは無料で作れますか？', a: 'はい。Perlinkの無料プランでは、perlink.to/yourname でサイトを1つ、期間無制限で公開できます。有料プランではサイト数の追加、Proテーマ、独自ドメインが使えます。' },
        { q: 'プログラミングの知識は必要ですか？', a: 'いいえ。ドラッグ＆ドロップのエディタで、ブロック（テキスト、写真、リンク、お問い合わせフォーム）を組み合わせてページを作れます。' },
        { q: 'どれくらい時間がかかりますか？', a: 'テンプレートから始めれば、ほとんどの人が1時間以内に最初のバージョンを公開しています。作る作業より、文章を書くほうに時間がかかります。' },
        { q: '独自ドメインは使うべきですか？', a: 'よりプロフェッショナルに見えますが、最初から必要なわけではありません。perlink.to/yourname から始めて、あとで Plus または Max プランで独自ドメインを接続できます。' },
      ],
      ctaTitle: '個人サイトを作りはじめる',
      ctaText: 'あなたのアドレスを確保して、テンプレートから始めましょう。無料で、1分で公開できます。',
    },
    ko: {
      seoTitle: '개인 홈페이지 만드는 법 (무료, 코딩 없이) — Perlink',
      description: '개인 홈페이지를 무료로 만드는 방법을 단계별로 알려드려요. 무엇을 넣을지, 주소 정하는 법, 자기소개 쓰는 법, 검색에 노출되는 법까지.',
      eyebrow: '가이드',
      title: '개인 홈페이지 만드는 법',
      intro: '개인 홈페이지는 내가 누구인지, 무슨 일을 하는지, 어떻게 연락하면 되는지 알려주는 하나의 주소예요. 코딩을 몰라도, 호스팅 비용을 내지 않아도 만들 수 있어요. 이 가이드에서는 무엇을 넣고 어떻게 쓰는지, 그리고 반나절 만에 공개하는 방법까지 차근차근 알려드릴게요.',
      readMinutes: 6,
      sections: [
        {
          title: '개인 홈페이지는 왜 필요할까요',
          paragraphs: [
            'SNS 계정은 생겼다 사라지고, 각각은 나의 일부만 보여줘요. 개인 홈페이지는 온전히 내 것인 페이지예요. 작업물, 이야기, 연락처를 한곳에 모을 수 있고, 플랫폼 정책이 바뀌어도 그대로 남아 있어요.',
            '취업이나 이직, 클라이언트 유치, 소소한 상품 판매, 포트폴리오 공유에 쓰기도 하고, 단순히 SNS 계정 목록보다 보기 좋은 링크 하나를 갖고 싶어서 만들기도 해요.',
          ],
        },
        {
          title: '무엇을 넣어야 할까요',
          paragraphs: ['짧을수록 좋아요. 방문자 대부분은 몇 초 만에 더 볼지 말지 결정하니까, 핵심부터 보여주세요.'],
          bullets: [
            '이름, 사진, 그리고 하는 일을 설명하는 한 문장.',
            '짧은 자기소개: 누구를 돕는지, 무엇을 잘하는지, 그리고 나다운 이야기 한 가지.',
            '대표 작업: 프로젝트, 사진, 성과 3~6개와 각각에 대한 한 줄 설명.',
            '신뢰할 근거: 고객 후기 몇 개, 함께한 브랜드 로고, 자신 있게 내세울 수 있는 숫자.',
            '명확한 연락 방법 하나: 이메일, 문의 폼, 예약 링크.',
            '정말 중요한 SNS 두세 개의 링크(전부 넣을 필요는 없어요).',
          ],
        },
        {
          title: '자기소개 쓰는 법',
          paragraphs: [
            '행사에서 처음 만난 사람에게 나를 소개하듯 써보세요. 무슨 일을 누구를 위해 하는지로 시작하고, 경험을 보여주는 디테일 하나(숫자, 고객, 지역)를 더한 뒤, 읽는 사람이 다음에 할 행동으로 마무리하세요.',
            '예: “서울에서 활동하는 프로덕트 디자이너입니다. 6년 동안 스타트업의 막연한 아이디어를 쓰기 편한 앱으로 만들어 왔어요. 함께할 프로젝트가 있다면 아래로 연락 주세요.”',
          ],
        },
        {
          title: '검색에서 나를 찾게 하려면',
          paragraphs: ['개인 홈페이지가 있으면 내 이름을 검색한 사람이 정확히 나를 찾을 수 있어요. 검색엔진이 페이지를 잘 이해하도록 하려면:'],
          bullets: [
            '페이지 제목과 첫 번째 제목에 실명을 쓰세요.',
            '하는 일을 한두 문장의 텍스트로 적으세요. 이미지만으로는 검색엔진에 아무것도 전달되지 않아요.',
            'SNS 프로필, 이메일 서명, 이력서에 홈페이지 링크를 넣으세요.',
            '꾸준히 업데이트하세요. 가끔씩 바뀌는 페이지가 살아 있어 보여요.',
          ],
        },
      ],
      stepsTitle: '6단계로 만들기',
      steps: [
        { title: '주소 정하기', text: 'perlink.to/yourname처럼 소리 내어 말하기 쉬운 짧은 이름을 고르세요. 유료 플랜에서는 나중에 개인 도메인을 연결해도 같은 주소를 계속 쓸 수 있어요.' },
        { title: '템플릿으로 시작하기', text: '개인 또는 포트폴리오 템플릿을 고르면 레이아웃, 폰트, 색상이 이미 어울리게 맞춰져 있어요. 모든 템플릿에 예시 콘텐츠가 들어 있어서 내 내용으로 바꾸기만 하면 돼요.' },
        { title: '페이지 상단 쓰기', text: '사진, 이름, 하는 일을 설명하는 한 줄을 넣으세요. 방문자 대부분이 읽는 부분이니 가장 많은 시간을 들이세요.' },
        { title: '작업물과 근거 추가하기', text: '갤러리, 프로젝트 몇 개, 또는 이력 블록을 추가하고 후기를 두세 개 넣으세요. 많은 것보다 좋은 몇 개가 나아요.' },
        { title: '연락 방법 추가하기', text: '문의 폼, 이메일, 예약 링크와 함께 중요한 SNS 프로필을 추가하세요.' },
        { title: '공개하고 공유하기', text: '공개한 뒤 휴대폰으로 열어 확인하고, SNS 소개란, 이메일 서명, 이력서에 링크를 넣으세요.' },
      ],
      faq: [
        { q: '개인 홈페이지를 무료로 만들 수 있나요?', a: '네. Perlink 무료 플랜으로 perlink.to/yourname 주소에 사이트 하나를 기간 제한 없이 공개할 수 있어요. 유료 플랜에서는 더 많은 사이트, Pro 테마, 개인 도메인을 쓸 수 있어요.' },
        { q: '코딩을 알아야 하나요?', a: '아니요. 드래그 앤 드롭 에디터에서 블록(텍스트, 사진, 링크, 문의 폼)을 조합해 페이지를 만들어요.' },
        { q: '얼마나 걸리나요?', a: '템플릿으로 시작하면 대부분 한 시간 안에 첫 버전을 공개해요. 만드는 것보다 글 쓰는 데 시간이 더 걸려요.' },
        { q: '개인 도메인을 써야 하나요?', a: '더 전문적으로 보이지만 처음부터 필요하지는 않아요. perlink.to/yourname으로 시작하고 나중에 Plus나 Max 플랜에서 도메인을 연결하면 돼요.' },
      ],
      ctaTitle: '개인 홈페이지 시작하기',
      ctaText: '내 주소를 선점하고 템플릿으로 시작하세요. 무료이고, 1분이면 공개돼요.',
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
    zh: {
      seoTitle: '怎么做 Instagram、TikTok 链接主页（免费）— Perlink',
      description: '免费为 Instagram、TikTok 和 YouTube 制作链接主页：该放哪些链接、怎么排序，以及如何添加到个人资料。',
      eyebrow: '指南',
      title: '如何制作链接主页',
      intro: 'Instagram 和 TikTok 的个人资料里只能放一个链接。链接主页能把这一个链接变成一个小页面，装下你想让别人看到的一切：网店、最新视频、预约表单、社交账号。下面教你做一个真正有人点的链接主页。',
      readMinutes: 5,
      sections: [
        {
          title: '为什么要用链接主页',
          paragraphs: [
            '每发一条新内容就改一次简介里的链接，旧帖子就会指向错误的地方。链接主页的网址始终不变，你只需更新里面的内容，所以每条帖子写“链接在简介”都不会过时。',
            '它还能告诉你大家关心什么：每个链接的点击量会显示哪个优惠、商品或视频最受欢迎。',
          ],
        },
        {
          title: '放哪些链接',
          paragraphs: ['链接越少，点击越多。把你最希望别人做的事放在最上面，再补充起辅助作用的内容：'],
          bullets: [
            '最重要的目标放第一位：网店、预约表单、新品发布或报名注册。',
            '趁热放上你最新的帖子、视频或活动。',
            '两三个社交账号用图标展示，不用做成大按钮。',
            '如果你靠接单获得工作，放一个联系方式。',
            '如果你在卖东西，放上带图片和价格的商品；比起文字，大家更爱点图片。',
          ],
        },
        {
          title: '让人愿意点的小技巧',
          paragraphs: ['大多数访客用手机、从某个 App 点进来，只停留几秒钟。所以：'],
          bullets: [
            '按钮文字写成动作：“预订座位”“抢购新品”，而不只是“网站”。',
            '使用和个人资料相同的头像和名字，让人知道没走错地方。',
            '在手机上，把最重要的链接放在不用滑动就能看到的位置。',
            '几周后，删掉没人点的链接。',
          ],
        },
      ],
      stepsTitle: '五步做出链接主页',
      steps: [
        { title: '注册你的名字', text: '选一个和你账号名一致的网址，比如 perlink.to/yourname，好记又好输入。' },
        { title: '选一个模板', text: '从链接主页模板开始，挑一个和你账号风格一致的主题。' },
        { title: '添加链接和社交账号', text: '先放主链接，再放最新内容和社交图标。需要的话，还可以加商品、视频或表单。' },
        { title: '发布并测试', text: '点击发布，用手机打开页面，把每个链接都点一遍。' },
        { title: '添加到个人资料', text: '把网址粘贴到 Instagram、TikTok 和 YouTube 个人资料的网站栏里，然后在帖子里提醒大家“链接在简介”。' },
      ],
      faq: [
        { q: '链接主页免费吗？', a: '免费。使用 Perlink 免费版，你可以在 perlink.to/yourname 发布一个页面，没有时间限制，支持链接、社交账号、商品和视频。' },
        { q: '在 Instagram 或 TikTok 上，链接放在哪里？', a: '编辑个人资料，把网址粘贴到“网站”（Instagram）或“网站/链接”（TikTok）栏。在 TikTok 上，这一栏可能需要企业账号或创作者账号才能使用。' },
        { q: '能看到有多少人点击吗？', a: '可以。Perlink 会显示访问量和每个链接的点击量，帮你看清什么有效、删掉没用的。' },
        { q: '链接主页只能放链接吗？', a: '不只是链接。你还可以添加带价格的商品、菜单、视频、联系表单或博客，而且每个页面都能以一个小小的 3D 房间打开。' },
      ],
      ctaTitle: '制作你的链接主页',
      ctaText: '注册 perlink.to/yourname，添加你的链接。免费使用，一分钟即可上线。',
    },
    ja: {
      seoTitle: 'リンクまとめページの作り方｜Instagram・TikTok — Perlink',
      description: 'Instagram、TikTok、YouTube向けのプロフィールリンク（リンクまとめページ）を無料で作る方法。載せるリンク、並べ方、プロフィールへの設定まで解説します。',
      eyebrow: 'ガイド',
      title: 'リンクまとめページの作り方',
      intro: 'InstagramやTikTokのプロフィールに載せられるリンクはひとつだけ。リンクまとめページを使えば、そのひとつのリンクを、ショップ、最新動画、予約フォーム、SNSなど見てほしいものをすべて集めた小さなページに変えられます。実際にタップされるページの作り方を紹介します。',
      readMinutes: 5,
      sections: [
        {
          title: 'リンクまとめページを使う理由',
          paragraphs: [
            '新しい投稿のたびにプロフィールのリンクを変えていると、過去の投稿が間違った場所を指してしまいます。リンクまとめページならアドレスは同じまま中身だけを入れ替えられるので、どの投稿で「プロフィールのリンクから」と書いても正しく案内できます。',
            'さらに、フォロワーの関心もわかります。リンクごとのクリック数から、どのキャンペーン、商品、動画が反応を集めているかが見えてきます。',
          ],
        },
        {
          title: '載せるべきリンク',
          paragraphs: ['リンクは少ないほどクリックされます。いちばんしてほしい行動を一番上に置き、それを後押しするものを足していきましょう。'],
          bullets: [
            'メインの目的を最初に：ショップ、予約フォーム、新作、登録ページなど。',
            '最新の投稿、動画、キャンペーンは、話題が新しいうちに。',
            'SNSは2〜3個をアイコンで。大きなボタンにする必要はありません。',
            '仕事の依頼を受けているなら、連絡手段。',
            '販売しているなら、写真と価格つきの商品。文字より画像のほうがタップされます。',
          ],
        },
        {
          title: 'タップされるページのコツ',
          paragraphs: ['訪問者の多くは、スマホのアプリから数秒だけ訪れます。だからこそ、次の点を意識しましょう。'],
          bullets: [
            'ボタンの文言は行動で書く：「Website」ではなく「席を予約する」「新作を見る」など。',
            'プロフィールと同じ写真と名前を使い、正しいページに来たと安心してもらう。',
            'いちばん大事なリンクは、スマホでスクロールせずに見える位置に置く。',
            '数週間たってもクリックされないリンクは削除する。',
          ],
        },
      ],
      stepsTitle: '5ステップで作る',
      steps: [
        { title: '名前を確保する', text: 'アカウント名と同じアドレス（例：perlink.to/yourname）を選べば、覚えやすく入力もしやすくなります。' },
        { title: 'テンプレートを選ぶ', text: 'リンクまとめ用のテンプレートから始めて、フィードの雰囲気に合うテーマを選びます。' },
        { title: 'リンクとSNSを追加する', text: 'まずメインのリンク、次に最新コンテンツとSNSアイコンを追加します。必要に応じて商品、動画、フォームも追加できます。' },
        { title: '公開してテストする', text: '公開したらスマホでページを開き、すべてのリンクを一度ずつタップして確認します。' },
        { title: 'プロフィールに設定する', text: 'Instagram、TikTok、YouTubeのプロフィールのウェブサイト欄にアドレスを貼り付け、投稿では「プロフィールのリンクから」と案内しましょう。' },
      ],
      faq: [
        { q: 'リンクまとめページは無料で作れますか？', a: 'はい。Perlinkの無料プランでは、perlink.to/yourname でページを1つ、期間無制限で公開できます。リンク、SNS、商品、動画も載せられます。' },
        { q: 'InstagramやTikTokのどこにリンクを貼ればいいですか？', a: 'プロフィールを編集し、「ウェブサイト」（Instagram）または「ウェブサイト／リンク」（TikTok）の欄にアドレスを貼り付けます。TikTokでは、ビジネスアカウントやクリエイターアカウントが必要な場合があります。' },
        { q: 'クリック数は確認できますか？', a: 'はい。Perlinkではアクセス数とリンクごとのクリック数がわかるので、効果のあるリンクを残し、そうでないものを外せます。' },
        { q: 'リンクを並べる以外のこともできますか？', a: 'はい。価格つきの商品、メニュー、動画、お問い合わせフォーム、ブログを追加できます。どのページも小さな3Dルームとして開くこともできます。' },
      ],
      ctaTitle: 'リンクまとめページを作る',
      ctaText: 'perlink.to/yourname を確保してリンクを追加しましょう。無料で、1分で公開できます。',
    },
    ko: {
      seoTitle: '링크 인 바이오 만드는 법 (Instagram·TikTok) — Perlink',
      description: 'Instagram, TikTok, YouTube용 링크 인 바이오 페이지를 무료로 만드는 방법. 어떤 링크를 넣고, 어떻게 배치하고, 프로필에 어떻게 연결하는지 알려드려요.',
      eyebrow: '가이드',
      title: '링크 인 바이오 페이지 만드는 법',
      intro: 'Instagram과 TikTok은 프로필에 링크를 하나만 걸 수 있어요. 링크 인 바이오 페이지는 그 링크 하나를 작은 페이지로 바꿔 쇼핑몰, 최신 영상, 예약 폼, SNS까지 보여주고 싶은 모든 것을 담아줘요. 사람들이 실제로 누르는 페이지를 만드는 방법을 알려드릴게요.',
      readMinutes: 5,
      sections: [
        {
          title: '링크 인 바이오 페이지를 쓰는 이유',
          paragraphs: [
            '새 게시물을 올릴 때마다 프로필 링크를 바꾸면 예전 게시물은 엉뚱한 곳을 가리키게 돼요. 링크 인 바이오 페이지는 주소는 그대로 두고 내용만 바꿀 수 있어서, 어떤 게시물에 “프로필 링크 확인”이라고 써도 항상 맞는 곳으로 안내해요.',
            '사람들이 무엇에 관심 있는지도 알 수 있어요. 링크별 클릭 수를 보면 어떤 혜택, 상품, 영상이 반응이 좋은지 한눈에 보여요.',
          ],
        },
        {
          title: '어떤 링크를 넣어야 할까요',
          paragraphs: ['링크가 적을수록 클릭은 많아져요. 가장 원하는 행동 하나를 맨 위에 두고, 그걸 뒷받침하는 것들을 더하세요.'],
          bullets: [
            '가장 중요한 목표를 맨 먼저: 쇼핑몰, 예약 폼, 신상품·신곡, 신청 페이지.',
            '최신 게시물, 영상, 캠페인은 따끈따끈할 때.',
            'SNS 두세 개는 큰 버튼 말고 아이콘으로.',
            '일을 의뢰받는다면 연락 방법.',
            '판매를 한다면 사진과 가격이 있는 상품. 사람들은 글보다 사진을 더 많이 눌러요.',
          ],
        },
        {
          title: '많이 눌리는 페이지를 만드는 팁',
          paragraphs: ['방문자 대부분은 휴대폰으로, 앱에서 넘어와 몇 초만 머물러요. 그러니까:'],
          bullets: [
            '버튼 문구는 행동으로 쓰세요. 그냥 “웹사이트” 대신 “자리 예약하기”, “신상 보러 가기”처럼요.',
            '프로필과 같은 사진과 이름을 써서 제대로 찾아왔다는 걸 알 수 있게 하세요.',
            '가장 중요한 링크는 휴대폰에서 스크롤 없이 보이는 곳에 두세요.',
            '몇 주가 지나도 아무도 누르지 않는 링크는 지우세요.',
          ],
        },
      ],
      stepsTitle: '5단계로 만들기',
      steps: [
        { title: '이름 선점하기', text: 'perlink.to/yourname처럼 계정 이름과 같은 주소를 고르면 기억하기도, 입력하기도 쉬워요.' },
        { title: '템플릿 고르기', text: '링크 인 바이오 템플릿으로 시작하고 피드 분위기에 맞는 테마를 고르세요.' },
        { title: '링크와 SNS 추가하기', text: '메인 링크를 먼저 넣고, 최신 콘텐츠와 SNS 아이콘을 추가하세요. 필요하면 상품, 영상, 폼도 넣을 수 있어요.' },
        { title: '공개하고 테스트하기', text: '공개한 뒤 휴대폰으로 페이지를 열어 모든 링크를 한 번씩 눌러보세요.' },
        { title: '프로필에 추가하기', text: 'Instagram, TikTok, YouTube 프로필의 웹사이트 칸에 주소를 붙여 넣고, 게시물에서 “프로필 링크 확인”이라고 알려주세요.' },
      ],
      faq: [
        { q: '링크 인 바이오 페이지는 무료인가요?', a: '네. Perlink 무료 플랜으로 perlink.to/yourname 주소에 페이지 하나를 기간 제한 없이 공개할 수 있고, 링크, SNS, 상품, 영상을 모두 넣을 수 있어요.' },
        { q: 'Instagram이나 TikTok 어디에 링크를 넣나요?', a: '프로필 편집에서 웹사이트(Instagram) 또는 웹사이트/링크(TikTok) 칸에 주소를 붙여 넣으세요. TikTok에서는 비즈니스 계정이나 크리에이터 계정이 필요할 수 있어요.' },
        { q: '몇 명이 클릭했는지 볼 수 있나요?', a: '네. Perlink에서 방문 수와 링크별 클릭 수를 보여줘서, 잘되는 건 남기고 안 되는 건 뺄 수 있어요.' },
        { q: '링크 목록 말고 다른 것도 넣을 수 있나요?', a: '네. 가격이 있는 상품, 메뉴, 영상, 문의 폼, 블로그를 추가할 수 있고, 모든 페이지는 작은 3D 룸으로도 열 수 있어요.' },
      ],
      ctaTitle: '링크 인 바이오 만들기',
      ctaText: 'perlink.to/yourname을 선점하고 링크를 추가하세요. 무료이고, 1분이면 공개돼요.',
    },
  },
]

export const GUIDE_PAIRS: [string, string][] = GUIDES.map(g => [g.path.en, g.path.vi])

/** The about page, in each language */
export const ABOUT_PAIR: [string, string] = ['/about', '/vi/gioi-thieu']
