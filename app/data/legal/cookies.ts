import type { LegalDocs } from './types'

export const COOKIES: LegalDocs = {
  en: {
    title: 'Cookie Notice',
    description: 'The few cookies Perlink uses and how to control them.',
    intro: 'Perlink uses a small number of cookies, all needed for the site to work. We don’t use advertising or cross-site tracking cookies.',
    summary: [
      { icon: 'i-lucide-cookie', title: 'Only what’s needed', text: 'Sign-in, language and security. Nothing else.' },
      { icon: 'i-lucide-eye-off', title: 'No ad tracking', text: 'No advertising cookies and no tracking across sites.' },
      { icon: 'i-lucide-chart-no-axes-column', title: 'Analytics without cookies', text: 'Visits are counted on our servers, not with cookies.' },
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
          ] },
          'Websites built with Perlink may embed content from other services (for example YouTube videos, Google Maps or Spotify). Those services can set their own cookies under their own policies.',
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
        blocks: ['Site visits and clicks are counted on our servers. We don’t use analytics cookies, and visitor IP addresses are hashed so they can’t be read back.'],
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
    intro: 'Perlink chỉ dùng vài cookie, tất cả đều cần thiết để trang hoạt động. Chúng tôi không dùng cookie quảng cáo hay theo dõi bạn qua các trang khác.',
    summary: [
      { icon: 'i-lucide-cookie', title: 'Chỉ những gì cần', text: 'Đăng nhập, ngôn ngữ và bảo mật. Không gì khác.' },
      { icon: 'i-lucide-eye-off', title: 'Không theo dõi quảng cáo', text: 'Không cookie quảng cáo, không theo dõi chéo trang.' },
      { icon: 'i-lucide-chart-no-axes-column', title: 'Thống kê không cần cookie', text: 'Lượt xem được đếm trên máy chủ, không qua cookie.' },
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
          ] },
          'Trang tạo bằng Perlink có thể nhúng nội dung từ dịch vụ khác (ví dụ video YouTube, Google Maps, Spotify). Các dịch vụ đó có thể đặt cookie riêng theo chính sách của họ.',
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
        blocks: ['Lượt xem và lượt bấm được đếm trên máy chủ. Chúng tôi không dùng cookie thống kê, và IP người xem được mã hóa một chiều nên không thể đọc lại.'],
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
