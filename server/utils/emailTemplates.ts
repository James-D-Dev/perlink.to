import type { H3Event } from 'h3'
import { getDB } from './db'
import { escapeHtml } from './email'
import type { AppLanguage } from '#shared/language'

// Perlink's email templates: one branded layout (logo, white card, button,
// footer) and the words of each email, in English, Vietnamese, Simplified
// Chinese, Japanese and Korean. The words
// and the layout's colour/footer can be changed in Superadmin → Email
// templates; changes are kept in app_settings ("email_template:<id>",
// "email_layout") over the defaults here.
//
// Words are plain text with {{variables}}: a blank line starts a paragraph,
// lines starting "- " or "1. " make a list, **text** is bold.

export interface TemplateWords {
  subject: string
  /** Big title in the card (optional) */
  heading: string
  body: string
  /** Button label (the link is set by the email) */
  button: string
  /** Small print under the button */
  note: string
}

export interface TemplateDef {
  id: string
  name: string
  description: string
  /** Who gets it */
  audience: 'user' | 'site owner' | 'admin'
  /** Variables and a sample value, for the editor and previews */
  variables: Record<string, string>
  /** The button's link for previews (each email sets its own) */
  sampleUrl?: string
  /** Sample details table, for previews of emails that have one */
  sampleRows?: [string, string][]
  /** A picture across the top of the card */
  hero?: { src: string; alt: string; width: number; height: number }
  defaults: Record<AppLanguage, TemplateWords>
}

export const EMAIL_TEMPLATES: TemplateDef[] = [
  {
    id: 'welcome',
    name: 'Welcome',
    description: 'Sent once when someone creates an account (Google, Facebook, TikTok).',
    audience: 'user',
    variables: { name: 'Linh' },
    sampleUrl: 'https://perlink.to/dashboard',
    hero: { src: 'https://perlink.to/images/email/welcome-hero.jpg', alt: 'A Perlink 3D room under a cherry tree', width: 1120, height: 588 },
    defaults: {
      en: {
        subject: 'Welcome to Perlink 👋',
        heading: 'Welcome to Perlink, {{name}} 👋',
        body: 'Your own site, or a whole 3D world, is a few minutes away. Here’s how to get your first one live:\n\n1. **Create a site.** Add your links, photos and contact buttons, or start from a ready-made theme.\n2. **Make it yours.** Pick colours, step into a 3D room, add a password or an opening time.\n3. **Share it.** Put your link in your bio, print it on a QR code or send it in a message.\n\n{{button}}\n\nHappy building,\n**The Perlink team**',
        button: 'Open your dashboard',
        note: 'Questions or ideas? Just reply to this email. It comes straight to us.',
      },
      vi: {
        subject: 'Chào mừng bạn đến với Perlink 👋',
        heading: 'Chào mừng {{name}} đến với Perlink 👋',
        body: 'Trang web của riêng bạn, hay cả một thế giới 3D, chỉ cách bạn vài phút. Ba bước để trang đầu tiên lên sóng:\n\n1. **Tạo trang.** Thêm liên kết, hình ảnh, nút liên hệ, hoặc bắt đầu từ một theme có sẵn.\n2. **Tuỳ chỉnh theo ý bạn.** Chọn màu sắc, bước vào phòng 3D, đặt mật khẩu hoặc giờ mở trang.\n3. **Chia sẻ.** Gắn link vào bio, in thành mã QR hoặc gửi qua tin nhắn.\n\n{{button}}\n\nChúc bạn sáng tạo vui,\n**Đội ngũ Perlink**',
        button: 'Mở trang quản lý',
        note: 'Có câu hỏi hay góp ý? Bạn chỉ cần trả lời email này, thư sẽ đến thẳng đội ngũ Perlink.',
      },
      zh: {
        subject: '欢迎来到 Perlink 👋',
        heading: '{{name}}，欢迎来到 Perlink 👋',
        body: '只需几分钟，你就能拥有自己的网站，甚至一整个 3D 世界。三步让你的第一个网站上线：\n\n1. **创建网站。** 添加链接、照片和联系按钮，或直接从现成的主题开始。\n2. **打造你的风格。** 挑选配色，走进 3D 房间，设置密码或开放时间。\n3. **分享出去。** 把链接放进个人简介，印成二维码，或在消息里发给朋友。\n\n{{button}}\n\n祝你创作愉快，\n**Perlink 团队**',
        button: '打开控制台',
        note: '有问题或想法？直接回复这封邮件，它会直接送到我们手上。',
      },
      ja: {
        subject: 'Perlink へようこそ 👋',
        heading: '{{name}}さん、Perlink へようこそ 👋',
        body: 'あなただけのサイト、そして 3D の世界まで、ほんの数分で作れます。最初のサイトを公開するまでの 3 ステップです。\n\n1. **サイトを作る。** リンクや写真、連絡先ボタンを追加するか、用意されたテーマから始めましょう。\n2. **自分らしく仕上げる。** 色を選んだり、3D ルームに入ってみたり、パスワードや公開時間を設定したりできます。\n3. **シェアする。** プロフィールにリンクを載せたり、QR コードにして印刷したり、メッセージで送ったりしましょう。\n\n{{button}}\n\n楽しいサイトづくりを！\n**Perlink チーム**',
        button: 'ダッシュボードを開く',
        note: 'ご質問やご意見は、このメールにそのまま返信してください。私たちに直接届きます。',
      },
      ko: {
        subject: 'Perlink에 오신 것을 환영해요 👋',
        heading: '{{name}}님, Perlink에 오신 것을 환영합니다 👋',
        body: '나만의 사이트, 나아가 3D 세계까지 몇 분이면 만들 수 있어요. 첫 사이트를 공개하는 세 단계를 알려 드릴게요.\n\n1. **사이트 만들기.** 링크, 사진, 연락 버튼을 추가하거나 준비된 테마로 시작하세요.\n2. **나답게 꾸미기.** 색상을 고르고, 3D 룸에 들어가 보고, 비밀번호나 공개 시간을 설정해 보세요.\n3. **공유하기.** 프로필에 링크를 넣고, QR 코드로 인쇄하거나 메시지로 보내 보세요.\n\n{{button}}\n\n즐겁게 만들어 보세요!\n**Perlink 팀**',
        button: '대시보드 열기',
        note: '궁금한 점이나 아이디어가 있나요? 이 메일에 답장하시면 저희에게 바로 전달돼요.',
      },
    },
  },
  {
    id: 'nudge_no_site',
    name: 'No site yet',
    description: 'Sent once, 1 to 7 days after signing up, to people who haven’t made a site.',
    audience: 'user',
    variables: { name: 'Linh' },
    sampleUrl: 'https://perlink.to/dashboard/new',
    hero: { src: 'https://perlink.to/images/email/welcome-hero.jpg', alt: 'A Perlink 3D room under a cherry tree', width: 1120, height: 588 },
    defaults: {
      en: {
        subject: 'Your Perlink site is 2 minutes away',
        heading: 'Ready when you are, {{name}}',
        body: 'You signed up for Perlink but haven’t made your site yet. It’s quicker than it looks: pick a theme, add your links, and it’s live.\n\nA few ideas to start from:\n\n- **Link in bio** for Instagram or TikTok\n- **Personal page** with your photos and contact buttons\n- **3D room** that visitors can walk around\n- **Birthday, wedding or Valentine** page for someone special\n\n{{button}}\n\nSee you inside,\n**The Perlink team**',
        button: 'Make my site',
        note: 'This is the only reminder we’ll send. Stuck on something? Reply and tell us.',
      },
      vi: {
        subject: 'Trang Perlink của bạn chỉ cách 2 phút',
        heading: 'Sẵn sàng khi bạn sẵn sàng, {{name}}',
        body: 'Bạn đã đăng ký Perlink nhưng chưa tạo trang. Nhanh hơn bạn nghĩ: chọn một theme, thêm link, vậy là trang đã lên sóng.\n\nVài ý tưởng để bắt đầu:\n\n- **Link in bio** cho Instagram hoặc TikTok\n- **Trang cá nhân** với ảnh và nút liên hệ\n- **Phòng 3D** để khách dạo quanh\n- **Trang sinh nhật, cưới hoặc Valentine** tặng người đặc biệt\n\n{{button}}\n\nHẹn gặp bạn bên trong,\n**Đội ngũ Perlink**',
        button: 'Tạo trang của tôi',
        note: 'Đây là lời nhắc duy nhất chúng tôi gửi. Đang vướng chỗ nào? Trả lời email này để kể cho chúng tôi.',
      },
      zh: {
        subject: '只需 2 分钟，你的 Perlink 网站就能上线',
        heading: '{{name}}，随时等你开始',
        body: '你已经注册了 Perlink，但还没有创建网站。其实比想象中更快：选一个主题，加上你的链接，网站就上线了。\n\n几个灵感供你参考：\n\n- **Link in bio**，放在 Instagram、TikTok 或小红书的简介里\n- **个人主页**，展示你的照片和联系按钮\n- **3D 房间**，访客可以在里面四处走走\n- **生日、婚礼或情人节**页面，送给特别的人\n\n{{button}}\n\n我们等你，\n**Perlink 团队**',
        button: '创建我的网站',
        note: '这是我们唯一一次提醒。遇到问题了？回复这封邮件告诉我们。',
      },
      ja: {
        subject: 'Perlink のサイトは 2 分で作れます',
        heading: '{{name}}さん、準備ができたらいつでもどうぞ',
        body: 'Perlink にご登録いただきましたが、まだサイトが作成されていないようです。思っているより簡単です。テーマを選んでリンクを追加すれば、すぐに公開できます。\n\nこんなサイトから始めてみませんか。\n\n- Instagram や TikTok 用の **リンクまとめ（Link in bio）**\n- 写真や連絡先ボタンを載せた **個人ページ**\n- 訪れた人が歩き回れる **3D ルーム**\n- 大切な人に贈る **誕生日・結婚式・バレンタイン** のページ\n\n{{button}}\n\nお待ちしています。\n**Perlink チーム**',
        button: 'サイトを作成する',
        note: 'リマインドはこの一通だけです。お困りのことがあれば、このメールに返信してお知らせください。',
      },
      ko: {
        subject: 'Perlink 사이트, 2분이면 만들 수 있어요',
        heading: '{{name}}님, 준비되면 언제든 시작하세요',
        body: 'Perlink에 가입하셨지만 아직 사이트를 만들지 않으셨어요. 생각보다 빨라요. 테마를 고르고 링크를 추가하면 바로 공개돼요.\n\n이런 아이디어로 시작해 보세요.\n\n- Instagram이나 TikTok용 **링크 인 바이오**\n- 사진과 연락 버튼을 담은 **개인 페이지**\n- 방문자가 둘러볼 수 있는 **3D 룸**\n- 특별한 사람을 위한 **생일, 결혼식, 발렌타인** 페이지\n\n{{button}}\n\n곧 만나요,\n**Perlink 팀**',
        button: '내 사이트 만들기',
        note: '이 알림은 한 번만 보내드려요. 막히는 부분이 있나요? 이 메일에 답장으로 알려 주세요.',
      },
    },
  },
  {
    id: 'form_request',
    name: 'New request',
    description: 'To a site owner when a visitor sends their contact or booking form.',
    audience: 'site owner',
    variables: { site: 'linh.studio', name: 'Minh Anh' },
    sampleUrl: 'https://perlink.to/dashboard',
    sampleRows: [['Name', 'Minh Anh'], ['Phone', '0901 234 567'], ['Date', '2026-12-24'], ['Message', 'Hi, is this date still free?']],
    defaults: {
      en: {
        subject: 'New request from {{name}} · perlink.to/{{site}}',
        heading: 'New request',
        body: 'Someone sent a request through your site **perlink.to/{{site}}**.',
        button: 'Open your inbox',
        note: 'You get this email because your Perlink site has a form. Reply to answer the visitor directly.',
      },
      vi: {
        subject: 'Yêu cầu mới từ {{name}} · perlink.to/{{site}}',
        heading: 'Yêu cầu mới',
        body: 'Có khách vừa gửi yêu cầu qua trang **perlink.to/{{site}}** của bạn.',
        button: 'Mở Hộp thư',
        note: 'Bạn nhận email này vì trang Perlink của bạn có form. Trả lời email để liên hệ trực tiếp với khách.',
      },
      zh: {
        subject: '来自 {{name}} 的新请求 · perlink.to/{{site}}',
        heading: '新请求',
        body: '有人通过你的网站 **perlink.to/{{site}}** 发来了一条请求。',
        button: '打开收件箱',
        note: '你收到这封邮件，是因为你的 Perlink 网站设有表单。直接回复即可联系访客。',
      },
      ja: {
        subject: '{{name}}さんから新しいお問い合わせ · perlink.to/{{site}}',
        heading: '新しいお問い合わせ',
        body: 'あなたのサイト **perlink.to/{{site}}** からお問い合わせが届きました。',
        button: '受信箱を開く',
        note: 'このメールは、あなたの Perlink サイトにフォームがあるためお送りしています。返信すると訪問者に直接連絡できます。',
      },
      ko: {
        subject: '{{name}}님의 새 요청 · perlink.to/{{site}}',
        heading: '새 요청',
        body: '내 사이트 **perlink.to/{{site}}**에서 새 요청이 도착했어요.',
        button: '받은편지함 열기',
        note: 'Perlink 사이트에 양식이 있어서 이 메일을 보내드렸어요. 답장하면 방문자에게 바로 연락할 수 있어요.',
      },
    },
  },
  {
    id: 'form_order',
    name: 'New order',
    description: 'To a site owner when a visitor places an order in their shop.',
    audience: 'site owner',
    variables: { site: 'linh.studio', code: 'A1B2C3', name: 'Minh Anh' },
    sampleUrl: 'https://perlink.to/dashboard',
    sampleRows: [['Order', 'A1B2C3'], ['Product', 'Handmade candle'], ['Quantity', '2'], ['Total', '240.000 ₫'], ['Payment', 'Bank transfer'], ['Name', 'Minh Anh'], ['Address', '12 Lê Lợi, Q.1']],
    defaults: {
      en: {
        subject: 'New order {{code}} · perlink.to/{{site}}',
        heading: 'New order {{code}}',
        body: 'You have a new order on **perlink.to/{{site}}**.',
        button: 'Open your inbox',
        note: 'You get this email because your Perlink site has a shop.',
      },
      vi: {
        subject: 'Đơn hàng mới {{code}} · perlink.to/{{site}}',
        heading: 'Đơn hàng mới {{code}}',
        body: 'Bạn có đơn hàng mới trên trang **perlink.to/{{site}}**.',
        button: 'Mở Hộp thư',
        note: 'Bạn nhận email này vì trang Perlink của bạn có cửa hàng.',
      },
      zh: {
        subject: '新订单 {{code}} · perlink.to/{{site}}',
        heading: '新订单 {{code}}',
        body: '你在 **perlink.to/{{site}}** 上有一笔新订单。',
        button: '打开收件箱',
        note: '你收到这封邮件，是因为你的 Perlink 网站开设了商店。',
      },
      ja: {
        subject: '新しい注文 {{code}} · perlink.to/{{site}}',
        heading: '新しい注文 {{code}}',
        body: '**perlink.to/{{site}}** に新しい注文が入りました。',
        button: '受信箱を開く',
        note: 'このメールは、あなたの Perlink サイトにショップがあるためお送りしています。',
      },
      ko: {
        subject: '새 주문 {{code}} · perlink.to/{{site}}',
        heading: '새 주문 {{code}}',
        body: '**perlink.to/{{site}}**에 새 주문이 들어왔어요.',
        button: '받은편지함 열기',
        note: 'Perlink 사이트에 상점이 있어서 이 메일을 보내드렸어요.',
      },
    },
  },
  {
    id: 'form_rsvp',
    name: 'Invitation reply (RSVP)',
    description: 'To a site owner when a guest answers their invitation.',
    audience: 'site owner',
    variables: { site: 'an-va-binh', name: 'Minh Anh' },
    sampleUrl: 'https://perlink.to/dashboard',
    sampleRows: [['Name', 'Minh Anh'], ['Coming', 'Yes'], ['Guests', '2'], ['Message', 'Congratulations!']],
    defaults: {
      en: {
        subject: '{{name}} replied to your invitation · perlink.to/{{site}}',
        heading: '{{name}} replied',
        body: 'A guest answered your invitation on **perlink.to/{{site}}**.',
        button: 'See all replies',
        note: 'You get this email because your Perlink invitation collects replies.',
      },
      vi: {
        subject: '{{name}} đã trả lời thiệp mời · perlink.to/{{site}}',
        heading: '{{name}} đã trả lời',
        body: 'Một khách mời vừa trả lời thiệp trên trang **perlink.to/{{site}}**.',
        button: 'Xem tất cả phản hồi',
        note: 'Bạn nhận email này vì thiệp mời Perlink của bạn đang nhận phản hồi.',
      },
      zh: {
        subject: '{{name}} 回复了你的邀请 · perlink.to/{{site}}',
        heading: '{{name}} 已回复',
        body: '有位来宾在 **perlink.to/{{site}}** 上回复了你的邀请。',
        button: '查看所有回复',
        note: '你收到这封邮件，是因为你的 Perlink 邀请函正在收集回复。',
      },
      ja: {
        subject: '{{name}}さんが招待状に返信しました · perlink.to/{{site}}',
        heading: '{{name}}さんから返信がありました',
        body: 'ゲストが **perlink.to/{{site}}** の招待状に返信しました。',
        button: 'すべての返信を見る',
        note: 'このメールは、あなたの Perlink 招待状で返信を受け付けているためお送りしています。',
      },
      ko: {
        subject: '{{name}}님이 초대에 답장했어요 · perlink.to/{{site}}',
        heading: '{{name}}님의 답장',
        body: '하객이 **perlink.to/{{site}}**의 초대장에 답장했어요.',
        button: '모든 답장 보기',
        note: 'Perlink 초대장에서 답장을 받고 있어서 이 메일을 보내드렸어요.',
      },
    },
  },
  {
    id: 'form_answer',
    name: 'Proposal answer',
    description: 'To a site owner when someone says yes on their proposal page.',
    audience: 'site owner',
    variables: { site: 'will-you' },
    sampleUrl: 'https://perlink.to/dashboard',
    sampleRows: [['Message', 'Yes, of course! ❤️']],
    defaults: {
      en: {
        subject: '💘 Someone said yes · perlink.to/{{site}}',
        heading: '💘 They said yes',
        body: 'Someone just answered on **perlink.to/{{site}}**.',
        button: 'Open your inbox',
        note: 'You get this email because your Perlink page has a question.',
      },
      vi: {
        subject: '💘 Người ấy đã đồng ý · perlink.to/{{site}}',
        heading: '💘 Người ấy đã đồng ý',
        body: 'Có người vừa trả lời trên trang **perlink.to/{{site}}**.',
        button: 'Mở Hộp thư',
        note: 'Bạn nhận email này vì trang Perlink của bạn có câu hỏi.',
      },
      zh: {
        subject: '💘 对方答应了 · perlink.to/{{site}}',
        heading: '💘 对方答应了',
        body: '有人刚刚在 **perlink.to/{{site}}** 上作出了回答。',
        button: '打开收件箱',
        note: '你收到这封邮件，是因为你的 Perlink 页面设置了一个问题。',
      },
      ja: {
        subject: '💘 「はい」の返事が届きました · perlink.to/{{site}}',
        heading: '💘 「はい」の返事が届きました',
        body: '**perlink.to/{{site}}** に回答がありました。',
        button: '受信箱を開く',
        note: 'このメールは、あなたの Perlink ページに質問があるためお送りしています。',
      },
      ko: {
        subject: '💘 상대방이 수락했어요 · perlink.to/{{site}}',
        heading: '💘 상대방이 수락했어요',
        body: '방금 누군가 **perlink.to/{{site}}**에서 답했어요.',
        button: '받은편지함 열기',
        note: 'Perlink 페이지에 질문이 있어서 이 메일을 보내드렸어요.',
      },
    },
  },
  {
    id: 'report',
    name: 'Site reported',
    description: 'To the admin when a visitor reports a site.',
    audience: 'admin',
    variables: { site: 'some-site', reason: 'spam' },
    sampleUrl: 'https://perlink.to/superadmin/reports',
    sampleRows: [['Site', 'perlink.to/some-site'], ['Reason', 'spam'], ['Details', 'Sends people to a fake shop']],
    defaults: {
      en: {
        subject: 'Report: perlink.to/{{site}} ({{reason}})',
        heading: 'A site was reported',
        body: 'A visitor reported **perlink.to/{{site}}** for **{{reason}}**.',
        button: 'Review reports',
        note: 'Reply to write to the visitor, when they left an email.',
      },
      vi: {
        subject: 'Báo cáo: perlink.to/{{site}} ({{reason}})',
        heading: 'Có trang bị báo cáo',
        body: 'Một khách đã báo cáo trang **perlink.to/{{site}}** vì **{{reason}}**.',
        button: 'Xem báo cáo',
        note: 'Trả lời email để liên hệ người báo cáo, nếu họ để lại email.',
      },
      zh: {
        subject: '举报：perlink.to/{{site}}（{{reason}}）',
        heading: '有网站被举报',
        body: '一位访客以 **{{reason}}** 为由举报了 **perlink.to/{{site}}**。',
        button: '查看举报',
        note: '如果访客留下了邮箱，直接回复即可联系对方。',
      },
      ja: {
        subject: '通報：perlink.to/{{site}}（{{reason}}）',
        heading: 'サイトが通報されました',
        body: '訪問者が **perlink.to/{{site}}** を **{{reason}}** として通報しました。',
        button: '通報を確認する',
        note: '訪問者がメールアドレスを残している場合は、返信して連絡できます。',
      },
      ko: {
        subject: '신고: perlink.to/{{site}} ({{reason}})',
        heading: '사이트가 신고되었어요',
        body: '방문자가 **{{reason}}** 사유로 **perlink.to/{{site}}** 사이트를 신고했어요.',
        button: '신고 검토하기',
        note: '방문자가 이메일을 남겼다면 답장으로 연락할 수 있어요.',
      },
    },
  },
]

export interface EmailLayout {
  /** Button and accent colour */
  accent: string
  /** Line above the address in the footer */
  footer: Record<AppLanguage, string>
}

export const DEFAULT_LAYOUT: EmailLayout = {
  accent: '#0066d6',
  footer: {
    en: 'Perlink: personal websites and 3D worlds.',
    vi: 'Perlink: website cá nhân và thế giới 3D.',
    zh: 'Perlink：个人网站与 3D 世界。',
    ja: 'Perlink：個人サイトと 3D の世界。',
    ko: 'Perlink: 개인 웹사이트와 3D 세계.',
  },
}

const templateKey = (id: string) => `email_template:${id}`
const LAYOUT_KEY = 'email_layout'

async function readSetting<T>(event: H3Event, key: string): Promise<Partial<T> | null> {
  try {
    const row = await getDB(event).prepare('SELECT value FROM app_settings WHERE key = ?').bind(key).first<{ value: string }>()
    return row ? JSON.parse(row.value) : null
  } catch {
    return null
  }
}

async function writeSetting(event: H3Event, key: string, value: unknown | null) {
  const db = getDB(event)
  if (value === null) {
    await db.prepare('DELETE FROM app_settings WHERE key = ?').bind(key).run()
    return
  }
  await db
    .prepare(`INSERT INTO app_settings (key, value, updated_at) VALUES (?, ?, datetime('now')) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`)
    .bind(key, JSON.stringify(value))
    .run()
}

export const templateDef = (id: string) => EMAIL_TEMPLATES.find(t => t.id === id)

/** The saved words of a template (only what was changed), by language */
export const getTemplateOverrides = (event: H3Event, id: string) =>
  readSetting<Record<AppLanguage, Partial<TemplateWords>>>(event, templateKey(id))

export const saveTemplateOverrides = (event: H3Event, id: string, value: Partial<Record<AppLanguage, Partial<TemplateWords>>> | null) =>
  writeSetting(event, templateKey(id), value)

export async function getTemplateWords(event: H3Event, id: string, lang: AppLanguage): Promise<TemplateWords> {
  const def = templateDef(id)
  if (!def) throw new Error(`Unknown email template ${id}`)
  const saved = (await getTemplateOverrides(event, id))?.[lang] ?? {}
  return { ...def.defaults[lang], ...saved }
}

export async function getLayout(event: H3Event): Promise<EmailLayout> {
  const saved = await readSetting<EmailLayout>(event, LAYOUT_KEY)
  return {
    accent: isColour(saved?.accent) ? saved!.accent! : DEFAULT_LAYOUT.accent,
    // Saved layouts from before a language was added don't have its footer yet
    footer: { ...DEFAULT_LAYOUT.footer, ...Object.fromEntries(Object.entries(saved?.footer ?? {}).filter(([, text]) => typeof text === 'string')) },
  }
}

export const saveLayout = (event: H3Event, value: EmailLayout | null) => writeSetting(event, LAYOUT_KEY, value)

export const isColour = (value: unknown): value is string => typeof value === 'string' && /^#[0-9a-f]{6}$/i.test(value)

/** {{variable}} → its value (the raw text; escaping happens when rendering) */
export const fill = (text: string, vars: Record<string, string>) =>
  text.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, key: string) => (key === 'button' ? match : vars[key] ?? ''))

/** Where {{button}} sits on a line of its own, the button goes; otherwise after the message */
const BUTTON_SLOT = '<!--perlink-button-->'

/** Plain text with paragraphs, lists and **bold** → email HTML */
export function textToHtml(text: string, opts: { color?: string; accent?: string } = {}) {
  const color = opts.color ?? '#3a3631'
  const accent = opts.accent ?? DEFAULT_LAYOUT.accent
  const inline = (line: string) => escapeHtml(line)
    .replace(/\*\*(.+?)\*\*/g, '<strong style="color:#0c0b0a;font-weight:600">$1</strong>')
    .replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" style="color:#0066d6">$1</a>')
  return text.trim().split(/\n{2,}/).map((block) => {
    if (/^\s*\{\{\s*button\s*\}\}\s*$/.test(block)) return BUTTON_SLOT
    const lines = block.split('\n')
    if (lines.every(line => /^\s*\d+[.)]\s+/.test(line))) {
      // Steps: a number in an accent circle beside each line
      return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:4px 0 20px">${lines.map((line, i) => `<tr>
<td width="44" valign="top" style="padding:0 0 14px;width:44px"><div style="width:30px;height:30px;line-height:30px;border-radius:15px;background:${accent};color:#ffffff;font-size:14px;font-weight:700;text-align:center">${i + 1}</div></td>
<td valign="top" style="padding:4px 0 14px;color:${color};font-size:15px;line-height:1.55">${inline(line.replace(/^\s*\d+[.)]\s+/, ''))}</td>
</tr>`).join('')}</table>`
    }
    if (lines.every(line => /^\s*[-•]\s+/.test(line))) {
      return `<ul style="margin:0 0 16px;padding-left:22px;color:${color}">${lines.map(line => `<li style="margin:0 0 8px;padding-left:4px">${inline(line.replace(/^\s*[-•]\s+/, ''))}</li>`).join('')}</ul>`
    }
    return `<p style="margin:0 0 16px;color:${color}">${lines.map(inline).join('<br>')}</p>`
  }).join('')
}

/** Plain-text version of the same words (bold marks removed) */
const textOnly = (text: string) => text.replace(/\*\*(.+?)\*\*/g, '$1').replace(/^\s*\{\{\s*button\s*\}\}\s*$/gm, '').replace(/\n{3,}/g, '\n\n').trim()

/** Form details or an order in the card: each label small above its value,
 *  so it reads well at any width (no side-by-side columns to squeeze) */
export function detailsTable(rows: [string, string][]) {
  if (!rows.length) return ''
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:4px 0 24px;border-collapse:separate;background:#f8f6f3;border-radius:14px">
${rows.map(([label, value], i) => `<tr><td style="padding:12px 16px;${i ? 'border-top:1px solid #ece8e2;' : ''}">
<div style="font-size:12px;line-height:1.4;color:#8a837b;margin:0 0 2px">${escapeHtml(label)}</div>
<div style="font-size:15px;line-height:1.5;color:#0c0b0a;white-space:pre-line;word-break:normal;overflow-wrap:break-word">${escapeHtml(value)}</div>
</td></tr>`).join('\n')}
</table>`
}

const FONT = `-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,Roboto,Helvetica,Arial,sans-serif`

/** The branded email around some content */
export function renderLayout(opts: {
  layout: EmailLayout
  lang: AppLanguage
  title: string
  /** Inbox preview line */
  preheader?: string
  heading?: string
  hero?: { src: string; alt: string; width: number; height: number }
  bodyHtml: string
  button?: { label: string; url: string }
  note?: string
}) {
  const { layout, lang } = opts
  const accent = layout.accent
  const button = opts.button?.label && opts.button.url
    ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 24px"><tr><td style="border-radius:999px;background:${accent}">
<a href="${escapeHtml(opts.button.url)}" style="display:inline-block;padding:13px 26px;font-family:${FONT};font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:999px">${escapeHtml(opts.button.label)}</a>
</td></tr></table>`
    : ''
  return `<!doctype html>
<html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light only"><meta name="supported-color-schemes" content="light"><title>${escapeHtml(opts.title)}</title>
<style>
@media only screen and (max-width:480px){
  .pl-outer{padding:20px 10px !important}
  .pl-card{padding:26px 20px !important;border-radius:16px !important}
  .pl-h1{font-size:21px !important}
}
</style></head>
<body style="margin:0;padding:0;background:#f3f1ee;-webkit-text-size-adjust:100%">
${opts.preheader ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent">${escapeHtml(opts.preheader)}</div>` : ''}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f1ee"><tr><td align="center" class="pl-outer" style="padding:32px 16px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px">
<tr><td style="padding:0 4px 20px">
<a href="https://perlink.to" style="text-decoration:none"><img src="https://perlink.to/web-app-manifest-192x192.png" width="32" height="32" alt="" style="display:inline-block;vertical-align:middle;border:0;border-radius:8px"><span style="display:inline-block;vertical-align:middle;margin-left:10px;font-family:${FONT};font-size:21px;font-weight:700;letter-spacing:-0.03em;color:#0c0b0a"><span style="color:${accent}">per</span>link</span></a>
</td></tr>
<tr><td style="background:#ffffff;border:1px solid #e8e4de;border-radius:20px;font-family:${FONT};font-size:15px;line-height:1.6;color:#3a3631">
${opts.hero ? `<img src="${escapeHtml(opts.hero.src)}" width="558" alt="${escapeHtml(opts.hero.alt)}" style="display:block;width:100%;max-width:558px;height:auto;border:0;border-radius:19px 19px 0 0">` : ''}
<div class="pl-card" style="padding:${opts.hero ? '30px' : '34px'} 30px 34px">
${opts.heading ? `<h1 class="pl-h1" style="margin:0 0 18px;font-family:${FONT};font-size:23px;line-height:1.3;font-weight:700;letter-spacing:-0.02em;color:#0c0b0a">${escapeHtml(opts.heading)}</h1>` : ''}
${opts.bodyHtml.includes(BUTTON_SLOT) ? opts.bodyHtml.replace(BUTTON_SLOT, button) : `${opts.bodyHtml}\n${button}`}
${opts.note ? `<p style="margin:8px 0 0;padding-top:18px;border-top:1px solid #efebe6;font-size:13px;line-height:1.55;color:#8a837b">${escapeHtml(opts.note)}</p>` : ''}
</div>
</td></tr>
<tr><td style="padding:22px 8px 0;text-align:center;font-family:${FONT};font-size:12px;line-height:1.6;color:#9b948c">
${escapeHtml(layout.footer[lang] ?? DEFAULT_LAYOUT.footer[lang])}<br>
<a href="https://perlink.to" style="color:#9b948c;text-decoration:underline">perlink.to</a> · <a href="mailto:support@perlink.to" style="color:#9b948c;text-decoration:underline">support@perlink.to</a>
</td></tr>
</table>
</td></tr></table>
</body></html>`
}

/** Subject, HTML and text of a template, with its saved words and the layout */
export async function renderTemplate(event: H3Event, id: string, lang: AppLanguage, opts: {
  vars: Record<string, string>
  buttonUrl?: string
  rows?: [string, string][]
  /** Words to use instead of the saved ones (the editor's preview) */
  words?: Partial<TemplateWords>
  layout?: EmailLayout
}) {
  const words = { ...(await getTemplateWords(event, id, lang)), ...(opts.words ?? {}) }
  const layout = opts.layout ?? await getLayout(event)
  const subject = fill(words.subject, opts.vars).trim()
  const heading = fill(words.heading, opts.vars).trim()
  const body = fill(words.body, opts.vars)
  const note = fill(words.note, opts.vars).trim()
  const buttonLabel = fill(words.button, opts.vars).trim()
  const rows = opts.rows ?? []

  const html = renderLayout({
    layout,
    lang,
    title: subject,
    preheader: textOnly(body).split('\n').find(Boolean)?.slice(0, 140),
    heading: heading || undefined,
    hero: templateDef(id)?.hero,
    bodyHtml: textToHtml(body, { accent: layout.accent }) + detailsTable(rows),
    button: opts.buttonUrl && buttonLabel ? { label: buttonLabel, url: opts.buttonUrl } : undefined,
    note: note || undefined,
  })
  const text = [
    heading,
    textOnly(body),
    rows.map(([label, value]) => `${label}: ${value}`).join('\n'),
    opts.buttonUrl && buttonLabel ? `${buttonLabel}: ${opts.buttonUrl}` : '',
    note,
  ].filter(Boolean).join('\n\n')
  return { subject, html, text }
}
