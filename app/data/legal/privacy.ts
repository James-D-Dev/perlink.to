import type { LegalDocs } from './types'

export const PRIVACY: LegalDocs = {
  en: {
    title: 'Privacy Policy',
    description: 'What data Perlink collects, why, and the choices you have.',
    intro: 'We collect only what we need to run Perlink, never sell your data, and let you export or delete it at any time.',
    summary: [
      { icon: 'i-lucide-ban', title: 'We don’t sell data', text: 'No ads, no data brokers, no selling of personal data.' },
      { icon: 'i-lucide-fingerprint', title: 'Visitors stay anonymous', text: 'Visitor IPs are hashed; owners see counts, not people.' },
      { icon: 'i-lucide-download', title: 'You’re in control', text: 'Export your data or delete your account in Settings.' },
    ],
    sections: [
      {
        id: 'collect',
        title: 'What we collect',
        blocks: [
          '**Account:** your name and profile picture from the account you sign in with (Google, Facebook or TikTok), your email address when that account shares it (TikTok does not), that account\'s user ID, and when you joined.',
          '**What you create:** site content (text, links, menus, images), 3D world layouts and photos, theme settings, and links or QR codes made with earlier versions.',
          '**Visits to your sites:** page views and clicks, the referring site, country or region, device type and browser. Visitor IP addresses are hashed with a daily changing salt, so they cannot be read back.',
          '**Payments:** the plan, amount, order or payment code and date of each payment. Online payments are processed by our reseller Creem (Merchant of Record), and bank transfers in Vietnam by your bank; we never see card numbers or bank logins.',
          '**Reports:** when you report a site, the reason, your message, the email you choose to give, and a hashed IP used only to stop abuse of the form.',
        ],
      },
      {
        id: 'use',
        title: 'How we use it',
        blocks: [
          { list: [
            'To run the Service and show your sites and 3D worlds to visitors',
            'To give you analytics for your sites',
            'To process plan payments and keep billing records',
            'To find and stop fraud, phishing and abuse',
            'To contact you about your account',
            'To improve Perlink and meet legal obligations',
          ] },
        ],
      },
      {
        id: 'providers',
        title: 'Who we share it with',
        blocks: [
          'We do not sell personal data. We share it only with providers that help run Perlink, under confidentiality, or when the law requires it:',
          { table: [
            ['Provider', 'What for'],
            ['Cloudflare', 'Hosting, database, file storage, security, sending emails (e.g. form submissions to site owners)'],
            ['Google, Meta (Facebook), TikTok', 'Sign-in'],
            ['Google Analytics', 'How visitors find and use Perlink’s own pages (not people’s sites); see the Cookie Notice'],
            ['Creem', 'Selling plans as our reseller and Merchant of Record: checkout, payments, tax, invoices and refunds'],
            ['SePay', 'Notifications of bank transfers for plan payments in Vietnam'],
          ] },
        ],
      },
      {
        id: 'public',
        title: 'Public content',
        blocks: [
          'Sites and 3D worlds you publish are public by design: anyone with the link can see them, unless you protect the site with a password. Do not put sensitive personal information on a public page.',
          'If you add your own Facebook Pixel, TikTok Pixel or Google Analytics to your site, those services receive data about your visitors under their own terms, and you are responsible for telling your visitors and getting any consent your local law requires.',
        ],
      },
      {
        id: 'security',
        title: 'Storage and security',
        blocks: [
          'Data is stored on Cloudflare’s infrastructure and always sent over encrypted connections (HTTPS). Access to admin tools is limited to the Perlink team.',
        ],
      },
      {
        id: 'rights',
        title: 'Your rights',
        blocks: [
          'You can see and edit your data in the dashboard, download a copy in **Settings → Download your data**, and delete your account in Settings. You can also ask us to correct or delete data, or object to how it is used, by writing to {email}.',
        ],
      },
      {
        id: 'retention',
        title: 'How long we keep it',
        blocks: [
          'We keep your data while your account exists. When you delete your account, your sites and personal data are deleted; database backups may keep copies for up to 30 days. Billing records are kept as long as accounting law requires.',
        ],
      },
      {
        id: 'cookies',
        title: 'Cookies',
        blocks: ['We use cookies that Perlink needs to work, such as keeping you signed in, and Google Analytics cookies on Perlink’s own pages, which you can turn off. See the [Cookie Notice](/cookie-notice).'],
      },
      {
        id: 'children',
        title: 'Children',
        blocks: ['Perlink is not meant for children under 13, and we do not knowingly collect their data. If you think a child has given us data, contact us and we will delete it.'],
      },
      {
        id: 'transfers',
        title: 'International transfers',
        blocks: ['Our providers may process data in several countries. We use providers with appropriate safeguards for international transfers.'],
      },
      {
        id: 'changes',
        title: 'Changes',
        blocks: ['We may update this policy and will tell you about significant changes by email or in the Service. The date at the top shows the latest version.'],
      },
      {
        id: 'contact',
        title: 'Contact',
        blocks: ['Questions about privacy: {email}.'],
      },
    ],
  },
  vi: {
    title: 'Chính sách quyền riêng tư',
    description: 'Perlink thu thập dữ liệu gì, để làm gì, và quyền của bạn.',
    intro: 'Chúng tôi chỉ thu thập những gì cần để vận hành Perlink, không bao giờ bán dữ liệu, và bạn có thể tải về hoặc xóa dữ liệu bất cứ lúc nào.',
    summary: [
      { icon: 'i-lucide-ban', title: 'Không bán dữ liệu', text: 'Không quảng cáo, không bán dữ liệu cá nhân cho ai.' },
      { icon: 'i-lucide-fingerprint', title: 'Người xem được ẩn danh', text: 'IP người xem được mã hóa; chủ trang chỉ thấy con số.' },
      { icon: 'i-lucide-download', title: 'Bạn toàn quyền', text: 'Tải dữ liệu về hoặc xóa tài khoản ngay trong Cài đặt.' },
    ],
    sections: [
      {
        id: 'collect',
        title: 'Chúng tôi thu thập gì',
        blocks: [
          '**Tài khoản:** tên và ảnh đại diện từ tài khoản bạn dùng để đăng nhập (Google, Facebook hoặc TikTok), email nếu tài khoản đó cung cấp (TikTok thì không), mã người dùng của tài khoản đó, cùng ngày bạn tham gia.',
          '**Nội dung bạn tạo:** nội dung trang (chữ, link, thực đơn, hình ảnh), bố cục và ảnh trong thế giới 3D, cài đặt giao diện, link rút gọn và mã QR từ phiên bản cũ.',
          '**Lượt truy cập trang của bạn:** lượt xem và lượt bấm, trang giới thiệu, quốc gia/khu vực, loại thiết bị và trình duyệt. IP người xem được mã hóa một chiều với khóa đổi mỗi ngày nên không thể đọc ngược lại.',
          '**Thanh toán:** gói, số tiền, mã đơn hàng hoặc mã thanh toán và ngày của từng giao dịch. Thanh toán trực tuyến do đại lý bán lại Creem (đơn vị bán hàng chính thức) xử lý, chuyển khoản tại Việt Nam do ngân hàng của bạn xử lý; chúng tôi không bao giờ thấy số thẻ hay thông tin đăng nhập ngân hàng.',
          '**Báo cáo vi phạm:** lý do, nội dung bạn viết, email (nếu bạn để lại) và IP đã mã hóa, chỉ dùng để chống lạm dụng biểu mẫu.',
        ],
      },
      {
        id: 'use',
        title: 'Chúng tôi dùng dữ liệu để làm gì',
        blocks: [
          { list: [
            'Vận hành Dịch vụ, hiển thị trang và thế giới 3D cho người xem',
            'Cung cấp thống kê cho trang của bạn',
            'Xử lý thanh toán gói và lưu hồ sơ thanh toán',
            'Phát hiện và ngăn chặn lừa đảo, giả mạo, lạm dụng',
            'Liên hệ với bạn về tài khoản',
            'Cải thiện Perlink và tuân thủ pháp luật',
          ] },
        ],
      },
      {
        id: 'providers',
        title: 'Chúng tôi chia sẻ với ai',
        blocks: [
          'Chúng tôi không bán dữ liệu cá nhân. Dữ liệu chỉ được chia sẻ với các nhà cung cấp giúp vận hành Perlink (có cam kết bảo mật), hoặc khi pháp luật yêu cầu:',
          { table: [
            ['Nhà cung cấp', 'Mục đích'],
            ['Cloudflare', 'Máy chủ, cơ sở dữ liệu, lưu trữ tệp, bảo mật, gửi email (ví dụ: gửi biểu mẫu khách điền cho chủ trang)'],
            ['Google, Meta (Facebook), TikTok', 'Đăng nhập'],
            ['Google Analytics', 'Khách tìm thấy và dùng các trang của chính Perlink thế nào (không phải trang của người dùng); xem Thông báo về cookie'],
            ['Creem', 'Bán gói với vai trò đại lý bán lại và đơn vị bán hàng chính thức: thanh toán, thuế, hoá đơn, hoàn tiền'],
            ['SePay', 'Thông báo giao dịch chuyển khoản khi thanh toán gói tại Việt Nam'],
          ] },
        ],
      },
      {
        id: 'public',
        title: 'Nội dung công khai',
        blocks: [
          'Trang và thế giới 3D bạn xuất bản là công khai: ai có link đều xem được, trừ khi bạn khoá trang bằng mật khẩu. Đừng đặt thông tin cá nhân nhạy cảm lên trang công khai.',
          'Nếu bạn gắn Facebook Pixel, TikTok Pixel hoặc Google Analytics của mình vào trang, các dịch vụ đó nhận dữ liệu về khách xem trang theo điều khoản của họ, và bạn có trách nhiệm thông báo cho khách cũng như xin sự đồng ý nếu luật nơi bạn hoạt động yêu cầu.',
        ],
      },
      {
        id: 'security',
        title: 'Lưu trữ và bảo mật',
        blocks: [
          'Dữ liệu được lưu trên hạ tầng Cloudflare và luôn truyền qua kết nối mã hóa (HTTPS). Chỉ đội ngũ Perlink mới truy cập được công cụ quản trị.',
        ],
      },
      {
        id: 'rights',
        title: 'Quyền của bạn',
        blocks: [
          'Bạn xem và sửa dữ liệu trong trang quản lý, tải bản sao tại **Cài đặt → Tải dữ liệu của bạn**, và xóa tài khoản trong Cài đặt. Bạn cũng có thể yêu cầu sửa, xóa dữ liệu hoặc phản đối cách dữ liệu được sử dụng qua {email}.',
        ],
      },
      {
        id: 'retention',
        title: 'Thời gian lưu giữ',
        blocks: [
          'Dữ liệu được giữ trong thời gian tài khoản tồn tại. Khi bạn xóa tài khoản, trang và dữ liệu cá nhân bị xóa; bản sao lưu cơ sở dữ liệu có thể còn tối đa 30 ngày. Hồ sơ thanh toán được giữ theo thời hạn luật kế toán yêu cầu.',
        ],
      },
      {
        id: 'cookies',
        title: 'Cookie',
        blocks: ['Chúng tôi dùng cookie cần thiết để Perlink hoạt động, như giữ trạng thái đăng nhập, và cookie Google Analytics trên các trang của chính Perlink mà bạn có thể tắt. Xem [Thông báo về cookie](/cookie-notice).'],
      },
      {
        id: 'children',
        title: 'Trẻ em',
        blocks: ['Perlink không dành cho trẻ dưới 13 tuổi và chúng tôi không cố ý thu thập dữ liệu của trẻ. Nếu bạn nghĩ một em nhỏ đã cung cấp dữ liệu, hãy liên hệ để chúng tôi xóa.'],
      },
      {
        id: 'transfers',
        title: 'Chuyển dữ liệu ra nước ngoài',
        blocks: ['Các nhà cung cấp có thể xử lý dữ liệu ở nhiều quốc gia. Chúng tôi chọn nhà cung cấp có biện pháp bảo vệ phù hợp cho việc này.'],
      },
      {
        id: 'changes',
        title: 'Thay đổi',
        blocks: ['Chúng tôi có thể cập nhật chính sách và sẽ báo các thay đổi quan trọng qua email hoặc trong Dịch vụ. Ngày ở đầu trang cho biết phiên bản mới nhất.'],
      },
      {
        id: 'contact',
        title: 'Liên hệ',
        blocks: ['Thắc mắc về quyền riêng tư: {email}.'],
      },
    ],
  },
  zh: {
    title: '隐私政策',
    description: 'Perlink 收集哪些数据、用途是什么，以及您拥有的选择。',
    intro: '我们只收集运营 Perlink 所必需的数据，绝不出售您的数据，并允许您随时导出或删除数据。本译文仅为方便阅读而提供，如有歧义，以英文版本为准。',
    summary: [
      { icon: 'i-lucide-ban', title: '我们不出售数据', text: '没有广告，没有数据经纪商，不出售任何个人数据。' },
      { icon: 'i-lucide-fingerprint', title: '访客保持匿名', text: '访客 IP 经过哈希处理；网站所有者只能看到数量，看不到具体的人。' },
      { icon: 'i-lucide-download', title: '由您掌控', text: '您可以在“设置”中导出数据或删除账户。' },
    ],
    sections: [
      {
        id: 'collect',
        title: '我们收集的信息',
        blocks: [
          '**账户：**您用于登录的账户（Google、Facebook 或 TikTok）中的姓名和头像、该账户共享的电子邮件地址（TikTok 不共享）、该账户的用户 ID，以及您的注册时间。',
          '**您创建的内容：**网站内容（文字、链接、菜单、图片）、3D 世界的布局和照片、主题设置，以及用早期版本创建的链接或二维码。',
          '**您网站的访问数据：**页面浏览量和点击量、来源网站、国家或地区、设备类型和浏览器。访客 IP 地址使用每日更换的盐值进行哈希处理，因此无法还原。',
          '**付款：**每笔付款的套餐、金额、订单号或付款代码以及日期。在线付款由我们的经销商 Creem（Merchant of Record，记录商户）处理，越南境内的银行转账由您的银行处理；我们从不接触卡号或网银登录信息。',
          '**举报：**当您举报某个网站时，我们会收集举报原因、您的留言、您选择提供的电子邮件，以及一个仅用于防止表单被滥用的哈希 IP。',
        ],
      },
      {
        id: 'use',
        title: '我们如何使用这些信息',
        blocks: [
          { list: [
            '运营本服务，并向访客展示您的网站和 3D 世界',
            '为您提供网站的统计分析',
            '处理套餐付款并保存账单记录',
            '发现并制止欺诈、网络钓鱼和滥用行为',
            '就您的账户与您联系',
            '改进 Perlink 并履行法律义务',
          ] },
        ],
      },
      {
        id: 'providers',
        title: '我们与谁共享',
        blocks: [
          '我们不出售个人数据。我们仅在保密前提下与协助运营 Perlink 的服务提供商共享数据，或在法律要求时共享：',
          { table: [
            ['服务提供商', '用途'],
            ['Cloudflare', '托管、数据库、文件存储、安全防护、发送电子邮件（例如向网站所有者发送表单提交内容）'],
            ['Google、Meta（Facebook）、TikTok', '登录'],
            ['Google Analytics', '了解访客如何找到并使用 Perlink 自己的页面（不包括用户的网站）；请参阅 Cookie 声明'],
            ['Creem', '作为我们的经销商和 Merchant of Record（记录商户）销售套餐：结账、付款、税费、发票和退款'],
            ['SePay', '越南境内套餐付款的银行转账通知'],
          ] },
        ],
      },
      {
        id: 'public',
        title: '公开内容',
        blocks: [
          '您发布的网站和 3D 世界在设计上是公开的：任何拥有链接的人都可以查看，除非您为网站设置了密码保护。请勿在公开页面上放置敏感的个人信息。',
          '如果您在自己的网站上添加了自己的 Facebook Pixel、TikTok Pixel 或 Google Analytics，这些服务将依据其自身条款接收有关您访客的数据，您有责任告知访客，并取得您所在地法律要求的任何同意。',
        ],
      },
      {
        id: 'security',
        title: '存储与安全',
        blocks: [
          '数据存储在 Cloudflare 的基础设施上，并始终通过加密连接（HTTPS）传输。管理工具的访问权限仅限于 Perlink 团队。',
        ],
      },
      {
        id: 'rights',
        title: '您的权利',
        blocks: [
          '您可以在控制台中查看和编辑您的数据，在 **设置 → 下载您的数据** 中下载副本，并在“设置”中删除账户。您也可以发送邮件至 {email}，要求我们更正或删除数据，或反对我们使用数据的方式。',
        ],
      },
      {
        id: 'retention',
        title: '保存期限',
        blocks: [
          '在您的账户存续期间，我们会保存您的数据。删除账户后，您的网站和个人数据将被删除；数据库备份可能会保留副本最长 30 天。账单记录将按会计法律要求的期限保存。',
        ],
      },
      {
        id: 'cookies',
        title: 'Cookie',
        blocks: ['我们使用 Perlink 正常运行所必需的 Cookie（例如保持您的登录状态），并在 Perlink 自己的页面上使用 Google Analytics Cookie，您可以将其关闭。请参阅 [Cookie 声明](/cookie-notice)。'],
      },
      {
        id: 'children',
        title: '儿童',
        blocks: ['Perlink 不面向 13 岁以下的儿童，我们不会在知情的情况下收集其数据。如果您认为有儿童向我们提供了数据，请联系我们，我们将予以删除。'],
      },
      {
        id: 'transfers',
        title: '跨境传输',
        blocks: ['我们的服务提供商可能在多个国家处理数据。我们选用对跨境传输采取适当保障措施的服务提供商。'],
      },
      {
        id: 'changes',
        title: '变更',
        blocks: ['我们可能会更新本政策，如有重大变更，将通过电子邮件或在本服务中通知您。页面顶部的日期为最新版本的日期。'],
      },
      {
        id: 'contact',
        title: '联系我们',
        blocks: ['隐私相关问题：{email}。'],
      },
    ],
  },
  ja: {
    title: 'プライバシーポリシー',
    description: 'Perlink が収集するデータ、その目的、およびお客様が選択できること。',
    intro: '当社は Perlink の運営に必要なデータのみを収集し、お客様のデータを販売することはなく、いつでもエクスポートまたは削除できるようにしています。この翻訳は便宜上提供するものであり、英語版が優先します。',
    summary: [
      { icon: 'i-lucide-ban', title: 'データを販売しません', text: '広告なし、データブローカーなし、個人データの販売もありません。' },
      { icon: 'i-lucide-fingerprint', title: '訪問者は匿名のまま', text: '訪問者の IP はハッシュ化され、サイト所有者に見えるのは人数のみで、個人は特定できません。' },
      { icon: 'i-lucide-download', title: 'お客様が管理できます', text: '「設定」からデータのエクスポートやアカウントの削除ができます。' },
    ],
    sections: [
      {
        id: 'collect',
        title: '収集する情報',
        blocks: [
          '**アカウント：**ログインに使用したアカウント（Google、Facebook または TikTok）の氏名とプロフィール画像、そのアカウントが共有する場合のメールアドレス（TikTok は共有しません）、そのアカウントのユーザー ID、および登録日時。',
          '**お客様が作成したもの：**サイトのコンテンツ（テキスト、リンク、メニュー、画像）、3D ワールドのレイアウトと写真、テーマ設定、および以前のバージョンで作成したリンクや QR コード。',
          '**お客様のサイトへのアクセス：**ページビューとクリック、参照元サイト、国または地域、デバイスの種類およびブラウザ。訪問者の IP アドレスは毎日変わるソルトでハッシュ化されるため、元に戻すことはできません。',
          '**お支払い：**各お支払いのプラン、金額、注文番号または支払いコード、および日付。オンライン決済は当社の販売代理店である Creem（Merchant of Record）が処理し、ベトナム国内の銀行振込はお客様の銀行が処理します。当社がカード番号や銀行のログイン情報を目にすることはありません。',
          '**通報：**サイトを通報された場合の通報理由、メッセージ、お客様が任意で提供したメールアドレス、およびフォームの不正利用防止にのみ使用するハッシュ化された IP。',
        ],
      },
      {
        id: 'use',
        title: '利用目的',
        blocks: [
          { list: [
            '本サービスを運営し、お客様のサイトや 3D ワールドを訪問者に表示するため',
            'お客様のサイトのアクセス解析を提供するため',
            'プランのお支払いを処理し、請求記録を保管するため',
            '詐欺、フィッシングおよび不正利用を発見し、阻止するため',
            'お客様のアカウントに関してご連絡するため',
            'Perlink を改善し、法的義務を履行するため',
          ] },
        ],
      },
      {
        id: 'providers',
        title: '共有先',
        blocks: [
          '当社は個人データを販売しません。Perlink の運営を支援する事業者と守秘義務のもとで共有する場合、または法令により求められる場合にのみ共有します。',
          { table: [
            ['事業者', '目的'],
            ['Cloudflare', 'ホスティング、データベース、ファイル保存、セキュリティ、メール送信（例：サイト所有者へのフォーム送信内容の通知）'],
            ['Google、Meta（Facebook）、TikTok', 'ログイン'],
            ['Google Analytics', '訪問者が Perlink 自身のページ（利用者のサイトは含みません）をどのように見つけ、利用しているかの把握。Cookie に関するお知らせをご覧ください'],
            ['Creem', '当社の販売代理店および Merchant of Record としてのプラン販売：決済画面、支払い、税金、請求書および返金'],
            ['SePay', 'ベトナム国内でのプランのお支払いに関する銀行振込の通知'],
          ] },
        ],
      },
      {
        id: 'public',
        title: '公開コンテンツ',
        blocks: [
          'お客様が公開したサイトや 3D ワールドは、その性質上公開されるものです。サイトをパスワードで保護しない限り、リンクを知っている人は誰でも閲覧できます。公開ページに機微な個人情報を掲載しないでください。',
          'お客様がご自身のサイトに独自の Facebook Pixel、TikTok Pixel または Google Analytics を追加した場合、これらのサービスはそれぞれの規約に基づいてお客様の訪問者に関するデータを受け取ります。訪問者への告知や、お客様の地域の法令で求められる同意の取得は、お客様の責任となります。',
        ],
      },
      {
        id: 'security',
        title: '保存とセキュリティ',
        blocks: [
          'データは Cloudflare のインフラストラクチャ上に保存され、常に暗号化された接続（HTTPS）で送信されます。管理ツールへのアクセスは Perlink チームに限定されています。',
        ],
      },
      {
        id: 'rights',
        title: 'お客様の権利',
        blocks: [
          'お客様はダッシュボードでデータを確認・編集でき、**設定 → データをダウンロード** からコピーをダウンロードし、「設定」でアカウントを削除できます。また、{email} までご連絡いただくことで、データの訂正や削除を求めたり、その利用方法に異議を申し立てたりすることもできます。',
        ],
      },
      {
        id: 'retention',
        title: '保存期間',
        blocks: [
          'お客様のアカウントが存在する間、データを保管します。アカウントを削除すると、サイトと個人データは削除されます。ただし、データベースのバックアップに最長 30 日間コピーが残る場合があります。請求記録は会計関連法令が定める期間保管します。',
        ],
      },
      {
        id: 'cookies',
        title: 'Cookie',
        blocks: ['当社は、ログイン状態の維持など Perlink の動作に必要な Cookie と、Perlink 自身のページで使用する Google Analytics の Cookie（オフにできます）を使用します。詳しくは [Cookieに関するお知らせ](/cookie-notice) をご覧ください。'],
      },
      {
        id: 'children',
        title: 'お子様について',
        blocks: ['Perlink は 13 歳未満のお子様を対象としておらず、当社がそのデータを故意に収集することはありません。お子様がデータを提供したと思われる場合は当社までご連絡ください。削除いたします。'],
      },
      {
        id: 'transfers',
        title: '国際的なデータ移転',
        blocks: ['当社の委託先は、複数の国でデータを処理する場合があります。当社は、国際的なデータ移転について適切な保護措置を講じている事業者を利用しています。'],
      },
      {
        id: 'changes',
        title: '変更',
        blocks: ['当社は本ポリシーを更新することがあり、重要な変更についてはメールまたは本サービス内でお知らせします。ページ上部の日付が最新版を示します。'],
      },
      {
        id: 'contact',
        title: 'お問い合わせ',
        blocks: ['プライバシーに関するお問い合わせ：{email}'],
      },
    ],
  },
  ko: {
    title: '개인정보 처리방침',
    description: 'Perlink가 어떤 데이터를 왜 수집하는지, 그리고 이용자가 선택할 수 있는 사항을 안내합니다.',
    intro: '당사는 Perlink 운영에 필요한 데이터만 수집하며, 이용자의 데이터를 판매하지 않고, 언제든지 내보내거나 삭제할 수 있도록 합니다. 이 번역본은 편의를 위해 제공되며, 영어 원문이 우선합니다.',
    summary: [
      { icon: 'i-lucide-ban', title: '데이터를 판매하지 않습니다', text: '광고도, 데이터 브로커도 없으며 개인정보를 판매하지 않습니다.' },
      { icon: 'i-lucide-fingerprint', title: '방문자는 익명으로 유지됩니다', text: '방문자 IP는 해시 처리되며, 사이트 소유자는 사람이 아닌 수치만 봅니다.' },
      { icon: 'i-lucide-download', title: '이용자가 직접 관리합니다', text: '설정에서 데이터를 내보내거나 계정을 삭제할 수 있습니다.' },
    ],
    sections: [
      {
        id: 'collect',
        title: '수집하는 정보',
        blocks: [
          '**계정:** 로그인에 사용한 계정(Google, Facebook 또는 TikTok)의 이름과 프로필 사진, 해당 계정이 공유하는 경우의 이메일 주소(TikTok은 공유하지 않음), 해당 계정의 사용자 ID, 가입 일시.',
          '**이용자가 만든 콘텐츠:** 사이트 콘텐츠(텍스트, 링크, 메뉴, 이미지), 3D 월드 레이아웃과 사진, 테마 설정, 이전 버전에서 만든 링크나 QR 코드.',
          '**이용자 사이트 방문 정보:** 페이지 조회수와 클릭수, 유입 사이트, 국가 또는 지역, 기기 유형 및 브라우저. 방문자 IP 주소는 매일 바뀌는 솔트로 해시 처리되므로 원래대로 복원할 수 없습니다.',
          '**결제:** 각 결제의 요금제, 금액, 주문 번호 또는 결제 코드, 날짜. 온라인 결제는 당사의 리셀러인 Creem(Merchant of Record)이 처리하고, 베트남 내 계좌이체는 이용자의 은행이 처리합니다. 당사는 카드 번호나 은행 로그인 정보를 절대 보지 않습니다.',
          '**신고:** 사이트를 신고하는 경우 신고 사유, 이용자의 메시지, 이용자가 선택하여 제공한 이메일, 그리고 양식 악용 방지에만 사용되는 해시 처리된 IP.',
        ],
      },
      {
        id: 'use',
        title: '이용 목적',
        blocks: [
          { list: [
            '서비스를 운영하고 이용자의 사이트와 3D 월드를 방문자에게 보여주기 위해',
            '이용자에게 사이트 통계 분석을 제공하기 위해',
            '요금제 결제를 처리하고 결제 기록을 보관하기 위해',
            '사기, 피싱 및 악용을 탐지하고 차단하기 위해',
            '이용자의 계정과 관련하여 연락하기 위해',
            'Perlink를 개선하고 법적 의무를 이행하기 위해',
          ] },
        ],
      },
      {
        id: 'providers',
        title: '제공 대상',
        blocks: [
          '당사는 개인정보를 판매하지 않습니다. Perlink 운영을 돕는 업체에 비밀유지 조건하에 제공하거나, 법률이 요구하는 경우에만 제공합니다.',
          { table: [
            ['업체', '목적'],
            ['Cloudflare', '호스팅, 데이터베이스, 파일 저장, 보안, 이메일 발송(예: 사이트 소유자에게 양식 제출 내용 전달)'],
            ['Google, Meta(Facebook), TikTok', '로그인'],
            ['Google Analytics', '방문자가 Perlink 자체 페이지(이용자의 사이트 제외)를 어떻게 찾고 이용하는지 파악. 쿠키 안내 참조'],
            ['Creem', '당사의 리셀러이자 Merchant of Record로서 요금제 판매: 결제 페이지, 결제, 세금, 인보이스 및 환불'],
            ['SePay', '베트남 내 요금제 결제를 위한 계좌이체 알림'],
          ] },
        ],
      },
      {
        id: 'public',
        title: '공개 콘텐츠',
        blocks: [
          '이용자가 게시한 사이트와 3D 월드는 본래 공개를 전제로 합니다. 사이트를 비밀번호로 보호하지 않는 한, 링크를 가진 누구나 볼 수 있습니다. 공개 페이지에 민감한 개인정보를 게시하지 마십시오.',
          '이용자가 자신의 사이트에 자체 Facebook Pixel, TikTok Pixel 또는 Google Analytics를 추가하는 경우, 해당 서비스는 각자의 약관에 따라 이용자의 방문자에 관한 데이터를 수신하며, 방문자에게 이를 알리고 현지 법률이 요구하는 동의를 받는 것은 이용자의 책임입니다.',
        ],
      },
      {
        id: 'security',
        title: '보관 및 보안',
        blocks: [
          '데이터는 Cloudflare의 인프라에 저장되며 항상 암호화된 연결(HTTPS)로 전송됩니다. 관리 도구에 대한 접근은 Perlink 팀으로 제한됩니다.',
        ],
      },
      {
        id: 'rights',
        title: '이용자의 권리',
        blocks: [
          '이용자는 대시보드에서 자신의 데이터를 확인하고 수정할 수 있으며, **설정 → 데이터 다운로드**에서 사본을 내려받고, 설정에서 계정을 삭제할 수 있습니다. 또한 {email}로 연락하여 데이터의 정정이나 삭제를 요청하거나, 데이터 이용 방식에 이의를 제기할 수 있습니다.',
        ],
      },
      {
        id: 'retention',
        title: '보관 기간',
        blocks: [
          '당사는 계정이 존재하는 동안 데이터를 보관합니다. 계정을 삭제하면 사이트와 개인정보가 삭제되며, 데이터베이스 백업에는 최대 30일간 사본이 남아 있을 수 있습니다. 결제 기록은 회계 관련 법률이 요구하는 기간 동안 보관합니다.',
        ],
      },
      {
        id: 'cookies',
        title: '쿠키',
        blocks: ['당사는 로그인 상태 유지 등 Perlink 작동에 필요한 쿠키와, Perlink 자체 페이지에서 사용하는 Google Analytics 쿠키(끌 수 있음)를 사용합니다. 자세한 내용은 [쿠키 안내](/cookie-notice)를 참조하십시오.'],
      },
      {
        id: 'children',
        title: '아동',
        blocks: ['Perlink는 만 13세 미만 아동을 대상으로 하지 않으며, 당사는 아동의 데이터를 고의로 수집하지 않습니다. 아동이 당사에 데이터를 제공했다고 생각되면 당사에 연락해 주십시오. 해당 데이터를 삭제하겠습니다.'],
      },
      {
        id: 'transfers',
        title: '국외 이전',
        blocks: ['당사의 수탁업체는 여러 국가에서 데이터를 처리할 수 있습니다. 당사는 국외 이전에 대해 적절한 보호 조치를 갖춘 업체를 이용합니다.'],
      },
      {
        id: 'changes',
        title: '변경',
        blocks: ['당사는 본 방침을 변경할 수 있으며, 중요한 변경 사항은 이메일 또는 서비스 내에서 알려드립니다. 상단의 날짜가 최신 버전을 나타냅니다.'],
      },
      {
        id: 'contact',
        title: '문의',
        blocks: ['개인정보 관련 문의: {email}'],
      },
    ],
  },
}
