import type { LegalDocs } from './types'

export const COOKIES: LegalDocs = {
  en: {
    title: 'Cookie Notice',
    description: 'The few cookies Perlink uses and how to control them.',
    intro: 'Perlink uses a few cookies to work, and Google Analytics cookies on its own pages to understand how people find and use Perlink, which you can turn off. We don’t use advertising cookies, and people’s sites are never tracked by Perlink.',
    summary: [
      { icon: 'i-lucide-cookie', title: 'Few cookies', text: 'Sign-in, language, security, and analytics if you allow it.' },
      { icon: 'i-lucide-eye-off', title: 'No ad tracking', text: 'No advertising cookies and no tracking across sites.' },
      { icon: 'i-lucide-chart-no-axes-column', title: 'Analytics you control', text: 'Google Analytics on Perlink’s own pages only. Turn it off below.' },
    ],
    sections: [
      {
        id: 'what',
        title: 'What cookies are',
        blocks: ['Cookies are small text files a website stores in your browser. Similar tools, such as local storage, keep small settings on your device.'],
      },
      {
        id: 'list',
        title: 'Cookies we use',
        blocks: [
          { table: [
            ['Cookie', 'Purpose'],
            ['nuxt-session', 'Keeps you signed in (Perlink, essential)'],
            ['perlink_lang', 'Remembers your language (Perlink, functional)'],
            ['__cf_bm and similar', 'Protects the site from bots and attacks (Cloudflare, essential)'],
            ['pl_unlock_…', 'Keeps a password-protected site open after you enter its password, for 30 days (Perlink, essential)'],
            ['_ga, _ga_…', 'Tells visits apart so we can see how people find and use Perlink, for up to 2 years (Google Analytics, analytics; only with your OK in the EEA, UK and Switzerland)'],
            ['pl_signup', 'Notes for a few minutes that an account was just created, for the sign-up count (Perlink, analytics)'],
          ] },
          'Websites built with Perlink may embed content from other services (for example YouTube videos, Google Maps or Spotify). Those services can set their own cookies under their own policies.',
          'A site’s owner can also add their own Facebook Pixel, TikTok Pixel or Google Analytics to their site. Those tags set cookies for the owner’s ad and analytics accounts, under those services’ policies; the site’s owner is responsible for them. Perlink’s own Google Analytics never runs on people’s sites.',
        ],
      },
      {
        id: 'storage',
        title: 'Local storage',
        blocks: ['We also keep a few settings in your browser’s local storage, such as whether the dashboard sidebar is folded or which editor tab you last used. They never leave your device.'],
      },
      {
        id: 'analytics',
        title: 'Analytics',
        blocks: [
          'Visits and clicks on people’s sites are counted on our servers, without cookies, and visitor IP addresses are hashed so they can’t be read back.',
          'On Perlink’s own pages (the home page, guides, pricing, sign-in and the dashboard) we use Google Analytics to see where visitors come from, which pages they use and whether they come back, and to count sign-ups, published sites and purchases. Google receives your IP address and browser details under its own policy; we don’t send your name or email, and advertising features are off.',
          'In the EEA, the UK and Switzerland, Google Analytics sets cookies only after you allow them; until then it sends only cookieless signals. Elsewhere it’s on by default. You can change your choice at any time with the button below.',
        ],
      },
      {
        id: 'manage',
        title: 'Managing cookies',
        blocks: [
          'You can view and delete cookies in your browser settings:',
          { list: [
            '**Chrome:** Settings → Privacy and security → Third-party cookies / Site data',
            '**Safari:** Settings → Privacy → Manage Website Data',
            '**Firefox:** Settings → Privacy & Security → Cookies and Site Data',
            '**Edge:** Settings → Cookies and site permissions',
          ] },
          { note: 'Blocking essential cookies will sign you out and may stop the dashboard from working.' },
        ],
      },
      {
        id: 'changes',
        title: 'Changes',
        blocks: ['If we start using a new kind of cookie, we will update this notice and the date at the top.'],
      },
      {
        id: 'contact',
        title: 'Contact',
        blocks: ['Questions about cookies: {email}.'],
      },
    ],
  },
  vi: {
    title: 'Thông báo về cookie',
    description: 'Những cookie ít ỏi Perlink sử dụng và cách bạn kiểm soát chúng.',
    intro: 'Perlink dùng vài cookie để hoạt động, và cookie Google Analytics trên các trang của chính Perlink để hiểu mọi người tìm thấy và dùng Perlink thế nào; bạn có thể tắt. Chúng tôi không dùng cookie quảng cáo, và Perlink không theo dõi trang của người dùng.',
    summary: [
      { icon: 'i-lucide-cookie', title: 'Ít cookie', text: 'Đăng nhập, ngôn ngữ, bảo mật, và thống kê nếu bạn cho phép.' },
      { icon: 'i-lucide-eye-off', title: 'Không theo dõi quảng cáo', text: 'Không cookie quảng cáo, không theo dõi chéo trang.' },
      { icon: 'i-lucide-chart-no-axes-column', title: 'Thống kê do bạn quyết định', text: 'Google Analytics chỉ trên trang của Perlink. Tắt ở nút bên dưới.' },
    ],
    sections: [
      {
        id: 'what',
        title: 'Cookie là gì',
        blocks: ['Cookie là tệp văn bản nhỏ mà trang web lưu trong trình duyệt của bạn. Các công cụ tương tự như local storage giữ vài cài đặt nhỏ trên thiết bị.'],
      },
      {
        id: 'list',
        title: 'Cookie chúng tôi dùng',
        blocks: [
          { table: [
            ['Cookie', 'Mục đích'],
            ['nuxt-session', 'Giữ trạng thái đăng nhập (Perlink, bắt buộc)'],
            ['perlink_lang', 'Ghi nhớ ngôn ngữ bạn chọn (Perlink, chức năng)'],
            ['__cf_bm và tương tự', 'Bảo vệ trang khỏi bot và tấn công (Cloudflare, bắt buộc)'],
            ['pl_unlock_…', 'Giữ trang có mật khẩu mở sau khi bạn nhập đúng mật khẩu, trong 30 ngày (Perlink, bắt buộc)'],
            ['_ga, _ga_…', 'Phân biệt các lượt truy cập để biết mọi người tìm thấy và dùng Perlink thế nào, tối đa 2 năm (Google Analytics, thống kê; ở EEA, Anh và Thụy Sĩ chỉ khi bạn đồng ý)'],
            ['pl_signup', 'Ghi chú trong vài phút rằng tài khoản vừa được tạo, để đếm lượt đăng ký (Perlink, thống kê)'],
          ] },
          'Trang tạo bằng Perlink có thể nhúng nội dung từ dịch vụ khác (ví dụ video YouTube, Google Maps, Spotify). Các dịch vụ đó có thể đặt cookie riêng theo chính sách của họ.',
          'Chủ trang cũng có thể tự gắn Facebook Pixel, TikTok Pixel hoặc Google Analytics của họ vào trang. Các mã này đặt cookie cho tài khoản quảng cáo và thống kê của chủ trang, theo chính sách của các dịch vụ đó; chủ trang chịu trách nhiệm về chúng. Google Analytics của Perlink không bao giờ chạy trên trang của người dùng.',
        ],
      },
      {
        id: 'storage',
        title: 'Local storage',
        blocks: ['Chúng tôi cũng lưu vài cài đặt trong local storage của trình duyệt, như thanh bên đang thu gọn hay tab chỉnh sửa bạn dùng gần nhất. Chúng không bao giờ rời khỏi thiết bị của bạn.'],
      },
      {
        id: 'analytics',
        title: 'Thống kê',
        blocks: [
          'Lượt xem và lượt bấm trên trang của người dùng được đếm trên máy chủ, không dùng cookie, và IP người xem được mã hóa một chiều nên không thể đọc lại.',
          'Trên các trang của chính Perlink (trang chủ, hướng dẫn, bảng giá, đăng nhập và trang quản lý), chúng tôi dùng Google Analytics để biết khách đến từ đâu, dùng những trang nào, có quay lại không, và đếm lượt đăng ký, trang được xuất bản và giao dịch mua. Google nhận địa chỉ IP và thông tin trình duyệt của bạn theo chính sách của Google; chúng tôi không gửi tên hay email của bạn, và tính năng quảng cáo đã tắt.',
          'Ở EEA, Anh và Thụy Sĩ, Google Analytics chỉ đặt cookie sau khi bạn cho phép; trước đó chỉ gửi tín hiệu không dùng cookie. Ở nơi khác, thống kê bật sẵn. Bạn có thể đổi lựa chọn bất cứ lúc nào bằng nút bên dưới.',
        ],
      },
      {
        id: 'manage',
        title: 'Quản lý cookie',
        blocks: [
          'Bạn có thể xem và xóa cookie trong cài đặt trình duyệt:',
          { list: [
            '**Chrome:** Cài đặt → Quyền riêng tư và bảo mật → Cookie / Dữ liệu trang web',
            '**Safari:** Cài đặt → Quyền riêng tư → Quản lý dữ liệu trang web',
            '**Firefox:** Cài đặt → Quyền riêng tư & Bảo mật → Cookie và dữ liệu trang',
            '**Edge:** Cài đặt → Cookie và quyền của trang',
          ] },
          { note: 'Chặn cookie bắt buộc sẽ khiến bạn bị đăng xuất và trang quản lý có thể không hoạt động.' },
        ],
      },
      {
        id: 'changes',
        title: 'Thay đổi',
        blocks: ['Nếu dùng thêm loại cookie mới, chúng tôi sẽ cập nhật thông báo này và ngày ở đầu trang.'],
      },
      {
        id: 'contact',
        title: 'Liên hệ',
        blocks: ['Thắc mắc về cookie: {email}.'],
      },
    ],
  },
  zh: {
    title: 'Cookie 声明',
    description: 'Perlink 使用的少量 Cookie 以及您如何管理它们。',
    intro: 'Perlink 使用少量 Cookie 以维持正常运行，并在 Perlink 自有页面上使用 Google Analytics Cookie，以了解用户如何找到和使用 Perlink，您可以关闭后者。我们不使用广告 Cookie，Perlink 也绝不会跟踪用户的网站。本译文仅供参考，如有歧义，以英文版本为准。',
    summary: [
      { icon: 'i-lucide-cookie', title: '少量 Cookie', text: '用于登录、语言、安全，以及经您允许的统计分析。' },
      { icon: 'i-lucide-eye-off', title: '无广告跟踪', text: '不使用广告 Cookie，不进行跨网站跟踪。' },
      { icon: 'i-lucide-chart-no-axes-column', title: '统计分析由您决定', text: 'Google Analytics 仅用于 Perlink 自有页面。可在下方关闭。' },
    ],
    sections: [
      {
        id: 'what',
        title: '什么是 Cookie',
        blocks: ['Cookie 是网站存储在您浏览器中的小型文本文件。本地存储（local storage）等类似工具会在您的设备上保存少量设置。'],
      },
      {
        id: 'list',
        title: '我们使用的 Cookie',
        blocks: [
          { table: [
            ['Cookie', '用途'],
            ['nuxt-session', '保持您的登录状态（Perlink，必要）'],
            ['perlink_lang', '记住您选择的语言（Perlink，功能性）'],
            ['__cf_bm 及类似 Cookie', '保护网站免受机器人和攻击（Cloudflare，必要）'],
            ['pl_unlock_…', '在您输入正确密码后，使受密码保护的网站保持打开状态 30 天（Perlink，必要）'],
            ['_ga, _ga_…', '区分不同访问，以便我们了解用户如何找到和使用 Perlink，最长保留 2 年（Google Analytics，统计分析；在欧洲经济区、英国和瑞士仅在您同意后使用）'],
            ['pl_signup', '在几分钟内记录账户刚刚创建，用于统计注册数量（Perlink，统计分析）'],
          ] },
          '使用 Perlink 创建的网站可能嵌入其他服务的内容（例如 YouTube 视频、Google Maps 或 Spotify）。这些服务可能根据其自身政策设置自己的 Cookie。',
          '网站所有者也可以在其网站上添加自己的 Facebook Pixel、TikTok Pixel 或 Google Analytics。这些代码会依据相应服务的政策，为网站所有者的广告和统计账户设置 Cookie，并由网站所有者对其负责。Perlink 自身的 Google Analytics 绝不会在用户的网站上运行。',
        ],
      },
      {
        id: 'storage',
        title: '本地存储',
        blocks: ['我们还会在您浏览器的本地存储中保存少量设置，例如管理后台侧边栏是否折叠，或您上次使用的编辑器标签页。这些数据绝不会离开您的设备。'],
      },
      {
        id: 'analytics',
        title: '统计分析',
        blocks: [
          '用户网站上的访问和点击在我们的服务器上统计，不使用 Cookie，访客的 IP 地址经过哈希处理，无法还原。',
          '在 Perlink 自有页面（首页、指南、价格、登录页和管理后台）上，我们使用 Google Analytics 了解访客从何而来、使用了哪些页面、是否再次访问，并统计注册、发布的网站和购买数量。Google 会根据其自身政策接收您的 IP 地址和浏览器信息；我们不会发送您的姓名或电子邮件地址，且广告功能已关闭。',
          '在欧洲经济区、英国和瑞士，Google Analytics 仅在您允许后才设置 Cookie；在此之前仅发送不使用 Cookie 的信号。在其他地区，该功能默认开启。您可以随时通过下方按钮更改您的选择。',
        ],
      },
      {
        id: 'manage',
        title: '管理 Cookie',
        blocks: [
          '您可以在浏览器设置中查看和删除 Cookie：',
          { list: [
            '**Chrome：** 设置 → 隐私和安全 → 第三方 Cookie / 网站数据',
            '**Safari：** 设置 → 隐私 → 管理网站数据',
            '**Firefox：** 设置 → 隐私与安全 → Cookie 和网站数据',
            '**Edge：** 设置 → Cookie 和网站权限',
          ] },
          { note: '阻止必要 Cookie 会使您退出登录，并可能导致管理后台无法正常使用。' },
        ],
      },
      {
        id: 'changes',
        title: '变更',
        blocks: ['如果我们开始使用新类型的 Cookie，我们将更新本声明及页面顶部的日期。'],
      },
      {
        id: 'contact',
        title: '联系我们',
        blocks: ['有关 Cookie 的问题：{email}。'],
      },
    ],
  },
  ja: {
    title: 'Cookieに関するお知らせ',
    description: 'Perlinkが使用する少数のCookieと、その管理方法について説明します。',
    intro: 'Perlinkは、サービスの動作に必要な少数のCookieと、Perlink自身のページで利用者がPerlinkをどのように見つけ、利用しているかを把握するためのGoogle Analytics Cookieを使用します。後者はオフにできます。広告用Cookieは使用せず、Perlinkが利用者のサイトを追跡することはありません。この翻訳は便宜上提供するものであり、英語版が優先します。',
    summary: [
      { icon: 'i-lucide-cookie', title: '最小限のCookie', text: 'ログイン、言語、セキュリティ、および許可された場合のアクセス解析に使用します。' },
      { icon: 'i-lucide-eye-off', title: '広告トラッキングなし', text: '広告用Cookieやサイトをまたいだ追跡は行いません。' },
      { icon: 'i-lucide-chart-no-axes-column', title: '解析はご自身で選択', text: 'Google AnalyticsはPerlink自身のページでのみ使用します。下のボタンでオフにできます。' },
    ],
    sections: [
      {
        id: 'what',
        title: 'Cookieとは',
        blocks: ['Cookieとは、ウェブサイトがお使いのブラウザに保存する小さなテキストファイルです。ローカルストレージなどの類似技術は、お使いの端末に小さな設定情報を保存します。'],
      },
      {
        id: 'list',
        title: '使用するCookie',
        blocks: [
          { table: [
            ['Cookie', '目的'],
            ['nuxt-session', 'ログイン状態を維持します（Perlink、必須）'],
            ['perlink_lang', '選択した言語を記憶します（Perlink、機能）'],
            ['__cf_bm など', 'ボットや攻撃からサイトを保護します（Cloudflare、必須）'],
            ['pl_unlock_…', 'パスワード保護されたサイトにパスワードを入力した後、30日間開いた状態を維持します（Perlink、必須）'],
            ['_ga, _ga_…', '訪問を区別し、利用者がPerlinkをどのように見つけ、利用しているかを把握します。最長2年間（Google Analytics、アクセス解析。EEA、英国およびスイスでは同意があった場合のみ）'],
            ['pl_signup', 'アカウントが作成された直後であることを数分間記録し、登録数の集計に使用します（Perlink、アクセス解析）'],
          ] },
          'Perlinkで作成されたサイトには、他のサービスのコンテンツ（YouTube動画、Google Maps、Spotifyなど）が埋め込まれている場合があります。これらのサービスは、それぞれのポリシーに基づき独自のCookieを設定することがあります。',
          'サイトの所有者は、自身のFacebook Pixel、TikTok PixelまたはGoogle Analyticsをサイトに追加することもできます。これらのタグは、各サービスのポリシーに基づき、所有者の広告・解析アカウントのためにCookieを設定するものであり、その責任はサイトの所有者が負います。Perlink自身のGoogle Analyticsが利用者のサイトで動作することはありません。',
        ],
      },
      {
        id: 'storage',
        title: 'ローカルストレージ',
        blocks: ['ダッシュボードのサイドバーが折りたたまれているか、最後に使用したエディタのタブなど、いくつかの設定をブラウザのローカルストレージにも保存します。これらがお使いの端末の外に送信されることはありません。'],
      },
      {
        id: 'analytics',
        title: 'アクセス解析',
        blocks: [
          '利用者のサイトでの閲覧数とクリック数は、Cookieを使用せずに当社のサーバーで集計され、訪問者のIPアドレスは復元できないようハッシュ化されます。',
          'Perlink自身のページ（トップページ、ガイド、料金、ログイン、ダッシュボード）では、Google Analyticsを使用して、訪問者の流入元、利用されたページ、再訪の有無を把握し、登録数、公開されたサイト数および購入数を集計します。Googleは自社のポリシーに基づき、お客様のIPアドレスとブラウザ情報を受け取ります。当社がお客様の氏名やメールアドレスを送信することはなく、広告機能はオフにしています。',
          'EEA、英国およびスイスでは、Google Analyticsはお客様が許可した後にのみCookieを設定し、それまではCookieを使用しない信号のみを送信します。その他の地域では、初期設定でオンになっています。下のボタンでいつでも選択を変更できます。',
        ],
      },
      {
        id: 'manage',
        title: 'Cookieの管理',
        blocks: [
          'Cookieはブラウザの設定で確認・削除できます。',
          { list: [
            '**Chrome：** 設定 → プライバシーとセキュリティ → サードパーティCookie／サイトデータ',
            '**Safari：** 設定 → プライバシー → Webサイトデータを管理',
            '**Firefox：** 設定 → プライバシーとセキュリティ → Cookieとサイトデータ',
            '**Edge：** 設定 → Cookieとサイトのアクセス許可',
          ] },
          { note: '必須Cookieをブロックするとログアウトされ、ダッシュボードが動作しなくなる場合があります。' },
        ],
      },
      {
        id: 'changes',
        title: '変更',
        blocks: ['新しい種類のCookieを使用し始める場合は、本お知らせおよびページ上部の日付を更新します。'],
      },
      {
        id: 'contact',
        title: 'お問い合わせ',
        blocks: ['Cookieに関するご質問：{email}'],
      },
    ],
  },
  ko: {
    title: '쿠키 안내',
    description: 'Perlink가 사용하는 소수의 쿠키와 이를 관리하는 방법을 안내합니다.',
    intro: 'Perlink는 서비스 운영에 필요한 소수의 쿠키와, Perlink 자체 페이지에서 이용자가 Perlink를 어떻게 찾고 이용하는지 파악하기 위한 Google Analytics 쿠키를 사용하며, 후자는 끌 수 있습니다. 광고 쿠키는 사용하지 않으며, Perlink는 이용자의 사이트를 추적하지 않습니다. 이 번역본은 편의를 위해 제공되며, 영문본이 우선합니다.',
    summary: [
      { icon: 'i-lucide-cookie', title: '최소한의 쿠키', text: '로그인, 언어, 보안, 그리고 허용하신 경우 통계 분석에 사용합니다.' },
      { icon: 'i-lucide-eye-off', title: '광고 추적 없음', text: '광고 쿠키와 사이트 간 추적을 사용하지 않습니다.' },
      { icon: 'i-lucide-chart-no-axes-column', title: '직접 선택하는 통계', text: 'Google Analytics는 Perlink 자체 페이지에서만 사용합니다. 아래에서 끌 수 있습니다.' },
    ],
    sections: [
      {
        id: 'what',
        title: '쿠키란',
        blocks: ['쿠키는 웹사이트가 브라우저에 저장하는 작은 텍스트 파일입니다. 로컬 스토리지와 같은 유사한 도구는 기기에 작은 설정 정보를 보관합니다.'],
      },
      {
        id: 'list',
        title: '사용하는 쿠키',
        blocks: [
          { table: [
            ['쿠키', '목적'],
            ['nuxt-session', '로그인 상태를 유지합니다(Perlink, 필수)'],
            ['perlink_lang', '선택한 언어를 기억합니다(Perlink, 기능)'],
            ['__cf_bm 등', '봇과 공격으로부터 사이트를 보호합니다(Cloudflare, 필수)'],
            ['pl_unlock_…', '비밀번호로 보호된 사이트에 비밀번호를 입력한 후 30일 동안 열린 상태로 유지합니다(Perlink, 필수)'],
            ['_ga, _ga_…', '방문을 구분하여 이용자가 Perlink를 어떻게 찾고 이용하는지 파악하며, 최대 2년간 보관됩니다(Google Analytics, 통계; EEA, 영국 및 스위스에서는 동의한 경우에만)'],
            ['pl_signup', '계정이 방금 생성되었음을 몇 분간 기록하여 가입 수를 집계합니다(Perlink, 통계)'],
          ] },
          'Perlink로 만든 사이트에는 다른 서비스의 콘텐츠(예: YouTube 동영상, Google Maps, Spotify)가 삽입될 수 있습니다. 해당 서비스는 자체 정책에 따라 자체 쿠키를 설정할 수 있습니다.',
          '사이트 소유자는 자신의 Facebook Pixel, TikTok Pixel 또는 Google Analytics를 사이트에 추가할 수도 있습니다. 이러한 태그는 해당 서비스의 정책에 따라 소유자의 광고 및 통계 계정을 위한 쿠키를 설정하며, 이에 대한 책임은 사이트 소유자에게 있습니다. Perlink 자체의 Google Analytics는 이용자의 사이트에서 절대 실행되지 않습니다.',
        ],
      },
      {
        id: 'storage',
        title: '로컬 스토리지',
        blocks: ['대시보드 사이드바의 접힘 여부나 마지막으로 사용한 편집기 탭 등 몇 가지 설정을 브라우저의 로컬 스토리지에도 저장합니다. 이 정보는 기기 밖으로 전송되지 않습니다.'],
      },
      {
        id: 'analytics',
        title: '통계',
        blocks: [
          '이용자 사이트의 방문과 클릭은 쿠키 없이 당사 서버에서 집계되며, 방문자 IP 주소는 복원할 수 없도록 해시 처리됩니다.',
          'Perlink 자체 페이지(홈페이지, 가이드, 요금제, 로그인 및 대시보드)에서는 Google Analytics를 사용하여 방문자의 유입 경로, 이용한 페이지, 재방문 여부를 파악하고 가입, 게시된 사이트 및 구매 수를 집계합니다. Google은 자체 정책에 따라 귀하의 IP 주소와 브라우저 정보를 수신합니다. 당사는 귀하의 이름이나 이메일을 전송하지 않으며, 광고 기능은 꺼져 있습니다.',
          'EEA, 영국 및 스위스에서는 Google Analytics가 귀하가 허용한 후에만 쿠키를 설정하며, 그 전에는 쿠키를 사용하지 않는 신호만 전송합니다. 그 밖의 지역에서는 기본적으로 켜져 있습니다. 아래 버튼으로 언제든지 선택을 변경할 수 있습니다.',
        ],
      },
      {
        id: 'manage',
        title: '쿠키 관리',
        blocks: [
          '브라우저 설정에서 쿠키를 확인하고 삭제할 수 있습니다.',
          { list: [
            '**Chrome:** 설정 → 개인정보 보호 및 보안 → 서드 파티 쿠키 / 사이트 데이터',
            '**Safari:** 설정 → 개인정보 보호 → 웹 사이트 데이터 관리',
            '**Firefox:** 설정 → 개인 정보 및 보안 → 쿠키 및 사이트 데이터',
            '**Edge:** 설정 → 쿠키 및 사이트 권한',
          ] },
          { note: '필수 쿠키를 차단하면 로그아웃되며 대시보드가 작동하지 않을 수 있습니다.' },
        ],
      },
      {
        id: 'changes',
        title: '변경',
        blocks: ['새로운 종류의 쿠키를 사용하게 되면 본 안내와 페이지 상단의 날짜를 업데이트합니다.'],
      },
      {
        id: 'contact',
        title: '문의',
        blocks: ['쿠키 관련 문의: {email}.'],
      },
    ],
  },
}
