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
}
