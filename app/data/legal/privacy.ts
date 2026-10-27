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
          '**Account:** your email address, name and profile picture from Google sign-in, and when you joined.',
          '**What you create:** site content (text, links, menus, images), 3D world layouts and photos, theme settings, and links or QR codes made with earlier versions.',
          '**Visits to your sites:** page views and clicks, the referring site, country or region, device type and browser. Visitor IP addresses are hashed with a daily changing salt, so they cannot be read back.',
          '**Payments:** the plan, amount, order or payment code and date of each payment. Online payments are processed by our reseller Lemon Squeezy (Merchant of Record), and bank transfers in Vietnam by your bank; we never see card numbers or bank logins.',
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
            ['Google', 'Sign-in'],
            ['Lemon Squeezy', 'Selling plans as our reseller and Merchant of Record: checkout, payments, tax, invoices and refunds'],
            ['SePay', 'Notifications of bank transfers for plan payments in Vietnam'],
          ] },
        ],
      },
      {
        id: 'public',
        title: 'Public content',
        blocks: [
          'Sites and 3D worlds you publish are public by design: anyone with the link can see them. Do not put sensitive personal information on a public page.',
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
        blocks: ['We only use cookies that Perlink needs to work, such as keeping you signed in. See the [Cookie Notice](/cookie-notice).'],
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
          '**Tài khoản:** email, tên và ảnh đại diện từ đăng nhập Google, cùng ngày bạn tham gia.',
          '**Nội dung bạn tạo:** nội dung trang (chữ, link, thực đơn, hình ảnh), bố cục và ảnh trong thế giới 3D, cài đặt giao diện, link rút gọn và mã QR từ phiên bản cũ.',
          '**Lượt truy cập trang của bạn:** lượt xem và lượt bấm, trang giới thiệu, quốc gia/khu vực, loại thiết bị và trình duyệt. IP người xem được mã hóa một chiều với khóa đổi mỗi ngày nên không thể đọc ngược lại.',
          '**Thanh toán:** gói, số tiền, mã đơn hàng hoặc mã thanh toán và ngày của từng giao dịch. Thanh toán trực tuyến do đại lý bán lại Lemon Squeezy (đơn vị bán hàng chính thức) xử lý, chuyển khoản tại Việt Nam do ngân hàng của bạn xử lý; chúng tôi không bao giờ thấy số thẻ hay thông tin đăng nhập ngân hàng.',
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
            ['Google', 'Đăng nhập'],
            ['Lemon Squeezy', 'Bán gói với vai trò đại lý bán lại và đơn vị bán hàng chính thức: thanh toán, thuế, hoá đơn, hoàn tiền'],
            ['SePay', 'Thông báo giao dịch chuyển khoản khi thanh toán gói tại Việt Nam'],
          ] },
        ],
      },
      {
        id: 'public',
        title: 'Nội dung công khai',
        blocks: [
          'Trang và thế giới 3D bạn xuất bản là công khai: ai có link đều xem được. Đừng đặt thông tin cá nhân nhạy cảm lên trang công khai.',
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
        blocks: ['Chúng tôi chỉ dùng cookie cần thiết để Perlink hoạt động, như giữ trạng thái đăng nhập. Xem [Thông báo về cookie](/cookie-notice).'],
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
}
