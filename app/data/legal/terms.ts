import type { LegalDocs } from './types'

export const TERMS: LegalDocs = {
  en: {
    title: 'Terms of Service',
    description: 'The rules for using Perlink to build personal websites and 3D worlds.',
    intro: 'These terms explain what Perlink offers, what you agree to when you use it, and what is not allowed on sites built with it.',
    summary: [
      { icon: 'i-lucide-user-check', title: 'Your content is yours', text: 'You own what you publish and are responsible for it.' },
      { icon: 'i-lucide-shield-alert', title: 'No scams or harm', text: 'Fraud, phishing, adult or illegal content is taken down.' },
      { icon: 'i-lucide-wallet', title: 'Cancel any time', text: 'Paid plans are software subscriptions you can cancel whenever you like.' },
    ],
    sections: [
      {
        id: 'acceptance',
        title: 'Acceptance of these terms',
        blocks: [
          'By using Perlink (perlink.to, "the Service") you agree to these Terms of Service. If you do not agree, please do not use the Service.',
        ],
      },
      {
        id: 'service',
        title: 'What Perlink provides',
        blocks: [
          'Perlink lets people and small businesses create:',
          { list: [
            'Personal and business websites with templates, themes and content blocks',
            'Interactive 3D worlds attached to those websites',
            'Image albums, photo frames and media hosting',
            'Page analytics',
            'Custom domains for websites (on paid plans)',
            'Links and QR codes made with earlier versions of the Service, which keep working',
          ] },
          'Perlink is self-serve software: you build and edit your site yourself. We do not offer design, development or other services.',
          'Perlink only sells its own software plans. If you show products, menus, bookings or payment details on your site, any sale between you and your visitors happens directly between you and them: Perlink is not a party to it, does not process those payments and does not sell on your behalf.',
        ],
      },
      {
        id: 'accounts',
        title: 'Your account',
        blocks: [
          'You sign in with Google. You must be at least 13 years old, or the minimum age of digital consent in your country.',
          'You are responsible for keeping your account secure and for everything done with it. Tell us right away at {email} if you notice unauthorized use.',
        ],
      },
      {
        id: 'acceptable-use',
        title: 'Acceptable use and prohibited content',
        blocks: [
          'You are responsible for everything you publish with Perlink. You may not publish, link to or promote:',
          { list: [
            'Scams and fraud: fake giveaways, pyramid or "get rich quick" schemes, unlicensed investment, trading or crypto offers',
            'Phishing: pages that imitate a bank, wallet, brand or login page, or ask visitors for passwords, card numbers or one-time codes',
            'Malware, viruses or other harmful software',
            'Sexually explicit content, or any sexual content involving minors',
            'Violence, terrorism, hate speech, harassment or threats',
            'Illegal goods and services, including drugs, weapons, counterfeits, unlicensed gambling and stolen data',
            'Content that infringes copyright, trademarks or other rights',
            'Impersonation of another person, brand or organization',
            'Spam, unsolicited messages or misleading links',
            'Anything that breaks the laws of Vietnam or of the country you operate in',
          ] },
          'You also may not try to get around our security, overload the Service, or access other people’s accounts.',
        ],
      },
      {
        id: 'reports',
        title: 'Reports and takedowns',
        blocks: [
          'Anyone can report a site with the "Report" link at the bottom of every Perlink site, or at [perlink.to/report](/report).',
          'We review reports and may, without prior notice, take a site down, disable a custom domain or suspend an account that breaks these terms. A site that was taken down cannot be published again unless we restore it.',
          { note: 'Think we made a mistake, or want to send a copyright notice? Write to {email}.' },
        ],
      },
      {
        id: 'content',
        title: 'Content and intellectual property',
        blocks: [
          'You keep ownership of the content you create. You give us a limited license to host, display and back it up as needed to run the Service, and you confirm you have the rights to everything you upload or link to.',
          'Perlink’s software, templates, themes and brand remain ours.',
        ],
      },
      {
        id: 'plans',
        title: 'Plans, payments and renewal',
        blocks: [
          { list: [
            'Perlink is software sold as a subscription. There is a free plan and paid plans (Starter, Plus and Pro); prices and what each plan includes are on the [pricing page](/pricing). Prices are shown in US dollars, and in Vietnamese đồng (VND) for customers in Vietnam.',
            'Our order process is conducted by our online reseller **Lemon Squeezy**, which is the Merchant of Record for all our orders. Lemon Squeezy handles payment, billing, sales tax and invoices, and provides all customer service inquiries and handles returns for those orders.',
            'Monthly and yearly subscriptions **renew automatically** at the end of each period until you cancel. You can cancel at any time from your account or the receipt email; the plan then stays active until the end of the period you paid for and is not charged again.',
            'Customers in Vietnam may instead pay by local bank transfer (VietQR). Those plans are paid in advance for one month or one year and do not renew on their own.',
            'Paid features are delivered digitally: they turn on in your account as soon as the payment is confirmed. Nothing is shipped.',
            'When a plan ends, the account returns to the free plan. Your sites stay online, but paid features (custom domains, switching to Pro themes, extra sites) stop until you renew.',
            'Each account can try the Plus plan free once, for 7 days, with no payment details.',
            'Price changes apply to future periods only, never to a period you already paid for.',
            'Refunds follow our [Refund Policy](/refund).',
          ] },
        ],
      },
      {
        id: 'limits',
        title: 'Service limits',
        blocks: [
          'Each plan has limits, such as the number of sites. We may also limit uploads or traffic to protect the Service, and may change or retire features with reasonable notice.',
        ],
      },
      {
        id: 'data',
        title: 'Analytics and data',
        blocks: [
          'We count visits and clicks for site owners and to improve the Service. IP addresses are hashed and never shown to site owners. The [Privacy Policy](/privacy) has the details.',
        ],
      },
      {
        id: 'termination',
        title: 'Ending your use',
        blocks: [
          'You can delete your account at any time in Settings. We may suspend or end access for conduct that breaks these terms or harms others. If we end a paid account for any other reason, we refund the unused part of the current period.',
        ],
      },
      {
        id: 'warranty',
        title: 'No warranty',
        blocks: [
          'The Service is provided "as is", without warranties of any kind. We work hard to keep it running, but cannot promise it will always be available, secure or error-free.',
        ],
      },
      {
        id: 'liability',
        title: 'Limitation of liability',
        blocks: [
          'To the extent the law allows, Perlink is not liable for indirect, incidental, special, consequential or punitive damages. Our total liability for any claim is limited to what you paid us in the 12 months before it.',
        ],
      },
      {
        id: 'changes',
        title: 'Changes to these terms',
        blocks: [
          'We may update these terms. We will tell you about significant changes by email or in the Service. Using the Service after a change means you accept the new terms.',
        ],
      },
      {
        id: 'contact',
        title: 'Contact',
        blocks: [
          'Perlink is operated by Hoang Kim Duc, an individual based in Vietnam.',
          'Questions about these terms: {email}.',
        ],
      },
    ],
  },
  vi: {
    title: 'Điều khoản sử dụng',
    description: 'Quy định khi dùng Perlink để tạo trang web cá nhân và thế giới 3D.',
    intro: 'Điều khoản này giải thích Perlink cung cấp gì, bạn đồng ý với điều gì khi sử dụng, và những gì không được phép đăng trên trang tạo bằng Perlink.',
    summary: [
      { icon: 'i-lucide-user-check', title: 'Nội dung là của bạn', text: 'Bạn sở hữu và chịu trách nhiệm với những gì mình đăng.' },
      { icon: 'i-lucide-shield-alert', title: 'Không lừa đảo, không gây hại', text: 'Trang lừa đảo, giả mạo, người lớn hay phi pháp sẽ bị gỡ.' },
      { icon: 'i-lucide-wallet', title: 'Huỷ bất cứ lúc nào', text: 'Gói trả phí là thuê bao phần mềm, bạn có thể huỷ bất cứ lúc nào.' },
    ],
    sections: [
      {
        id: 'acceptance',
        title: 'Chấp nhận điều khoản',
        blocks: [
          'Khi sử dụng Perlink (perlink.to, "Dịch vụ"), bạn đồng ý với Điều khoản sử dụng này. Nếu không đồng ý, vui lòng không sử dụng Dịch vụ.',
        ],
      },
      {
        id: 'service',
        title: 'Perlink cung cấp gì',
        blocks: [
          'Perlink giúp cá nhân và doanh nghiệp nhỏ tạo:',
          { list: [
            'Trang web cá nhân và kinh doanh với mẫu, theme và các khối nội dung',
            'Thế giới 3D gắn với trang web',
            'Album ảnh, khung ảnh và lưu trữ hình ảnh',
            'Thống kê lượt xem trang',
            'Tên miền riêng cho trang (ở các gói trả phí)',
            'Link rút gọn và mã QR tạo từ phiên bản cũ, vẫn tiếp tục hoạt động',
          ] },
          'Perlink là phần mềm tự phục vụ: bạn tự tạo và chỉnh sửa trang. Chúng tôi không cung cấp dịch vụ thiết kế, lập trình hay dịch vụ khác.',
          'Perlink chỉ bán các gói phần mềm của mình. Nếu trang của bạn có sản phẩm, thực đơn, đặt chỗ hay thông tin thanh toán, mọi giao dịch giữa bạn và khách của bạn diễn ra trực tiếp giữa hai bên: Perlink không tham gia, không xử lý các khoản thanh toán đó và không bán hàng thay bạn.',
        ],
      },
      {
        id: 'accounts',
        title: 'Tài khoản của bạn',
        blocks: [
          'Bạn đăng nhập bằng Google. Bạn cần từ 13 tuổi trở lên, hoặc đủ độ tuổi theo quy định tại quốc gia của bạn.',
          'Bạn chịu trách nhiệm bảo mật tài khoản và mọi hoạt động trên tài khoản. Hãy báo ngay cho chúng tôi qua {email} nếu thấy có người dùng trái phép.',
        ],
      },
      {
        id: 'acceptable-use',
        title: 'Sử dụng hợp lệ và nội dung bị cấm',
        blocks: [
          'Bạn chịu trách nhiệm với mọi nội dung đăng trên Perlink. Bạn không được đăng, dẫn link tới hoặc quảng bá:',
          { list: [
            'Lừa đảo: giveaway giả, đa cấp, "làm giàu nhanh", mời đầu tư, trading hay tiền mã hóa không được cấp phép',
            'Giả mạo (phishing): trang nhái ngân hàng, ví, thương hiệu hay trang đăng nhập, hoặc đòi mật khẩu, số thẻ, mã OTP của người xem',
            'Mã độc, virus hay phần mềm gây hại',
            'Nội dung khiêu dâm, hoặc bất kỳ nội dung tình dục nào liên quan đến trẻ vị thành niên',
            'Bạo lực, khủng bố, phát ngôn thù ghét, quấy rối hay đe dọa',
            'Hàng hóa, dịch vụ phi pháp: chất cấm, vũ khí, hàng giả, cờ bạc trái phép, dữ liệu đánh cắp',
            'Nội dung vi phạm bản quyền, nhãn hiệu hay quyền của người khác',
            'Mạo danh cá nhân, thương hiệu hay tổ chức khác',
            'Spam, tin nhắn không mong muốn hoặc link gây hiểu nhầm',
            'Bất cứ điều gì vi phạm pháp luật Việt Nam hoặc nơi bạn hoạt động',
          ] },
          'Bạn cũng không được tìm cách vượt qua lớp bảo mật, làm quá tải Dịch vụ hay truy cập tài khoản của người khác.',
        ],
      },
      {
        id: 'reports',
        title: 'Báo cáo và gỡ trang',
        blocks: [
          'Bất kỳ ai cũng có thể báo cáo một trang qua link "Báo cáo" ở cuối mọi trang Perlink, hoặc tại [perlink.to/report](/report).',
          'Chúng tôi xem xét báo cáo và có thể, không cần báo trước, gỡ trang, ngắt tên miền riêng hoặc khóa tài khoản vi phạm điều khoản. Trang đã bị gỡ không thể xuất bản lại trừ khi chúng tôi khôi phục.',
          { note: 'Nếu bạn cho rằng chúng tôi nhầm, hoặc muốn gửi khiếu nại bản quyền, hãy viết cho {email}.' },
        ],
      },
      {
        id: 'content',
        title: 'Nội dung và sở hữu trí tuệ',
        blocks: [
          'Bạn giữ quyền sở hữu nội dung mình tạo. Bạn cho phép chúng tôi lưu trữ, hiển thị và sao lưu nội dung trong phạm vi cần thiết để vận hành Dịch vụ, và bạn xác nhận có quyền với mọi thứ mình tải lên hay dẫn link.',
          'Phần mềm, mẫu, theme và thương hiệu Perlink thuộc về chúng tôi.',
        ],
      },
      {
        id: 'plans',
        title: 'Gói dịch vụ, thanh toán và gia hạn',
        blocks: [
          { list: [
            'Perlink là phần mềm bán theo hình thức thuê bao. Có gói Miễn phí và các gói trả phí (Starter, Plus, Pro); giá và quyền lợi từng gói có ở [trang Bảng giá](/pricing). Giá hiển thị bằng đô la Mỹ, và bằng đồng Việt Nam (VND) cho khách tại Việt Nam.',
            'Việc đặt mua được thực hiện qua đại lý bán lại trực tuyến **Lemon Squeezy**, đơn vị bán hàng chính thức (Merchant of Record) cho mọi đơn hàng của chúng tôi. Lemon Squeezy xử lý thanh toán, hoá đơn, thuế bán hàng, hỗ trợ khách hàng và hoàn trả cho các đơn đó.',
            'Thuê bao theo tháng hoặc theo năm **tự gia hạn** khi hết kỳ cho đến khi bạn huỷ. Bạn có thể huỷ bất cứ lúc nào trong tài khoản hoặc từ email biên nhận; gói vẫn dùng được đến hết kỳ đã trả và không bị trừ tiền thêm.',
            'Khách tại Việt Nam có thể thanh toán bằng chuyển khoản ngân hàng (VietQR). Các gói này trả trước theo tháng hoặc năm và không tự gia hạn.',
            'Tính năng trả phí được giao dưới dạng số: bật ngay trong tài khoản khi thanh toán được xác nhận. Không có hàng hoá vận chuyển.',
            'Khi gói hết hạn, tài khoản về gói Miễn phí. Trang vẫn hoạt động, nhưng tính năng trả phí (tên miền riêng, đổi sang theme Pro, thêm trang) tạm dừng đến khi gia hạn.',
            'Mỗi tài khoản được dùng thử gói Plus miễn phí một lần trong 7 ngày, không cần thông tin thanh toán.',
            'Thay đổi giá chỉ áp dụng cho kỳ sau, không ảnh hưởng kỳ bạn đã thanh toán.',
            'Hoàn tiền theo [Chính sách hoàn tiền](/refund).',
          ] },
        ],
      },
      {
        id: 'limits',
        title: 'Giới hạn dịch vụ',
        blocks: [
          'Mỗi gói có giới hạn riêng, ví dụ số trang. Chúng tôi cũng có thể giới hạn dung lượng tải lên hay lưu lượng để bảo vệ Dịch vụ, và có thể thay đổi hoặc ngừng tính năng với thông báo hợp lý.',
        ],
      },
      {
        id: 'data',
        title: 'Thống kê và dữ liệu',
        blocks: [
          'Chúng tôi đếm lượt xem và lượt bấm cho chủ trang và để cải thiện Dịch vụ. Địa chỉ IP được mã hóa một chiều và không bao giờ hiển thị cho chủ trang. Chi tiết xem [Chính sách quyền riêng tư](/privacy).',
        ],
      },
      {
        id: 'termination',
        title: 'Ngừng sử dụng',
        blocks: [
          'Bạn có thể xóa tài khoản bất cứ lúc nào trong phần Cài đặt. Chúng tôi có thể tạm khóa hoặc chấm dứt quyền truy cập nếu bạn vi phạm điều khoản hay gây hại cho người khác. Nếu chấm dứt tài khoản trả phí vì lý do khác, chúng tôi hoàn lại phần thời gian chưa dùng.',
        ],
      },
      {
        id: 'warranty',
        title: 'Không bảo đảm',
        blocks: [
          'Dịch vụ được cung cấp "nguyên trạng", không kèm bảo đảm nào. Chúng tôi luôn cố gắng giữ Dịch vụ ổn định nhưng không cam kết luôn sẵn sàng, an toàn hay không có lỗi.',
        ],
      },
      {
        id: 'liability',
        title: 'Giới hạn trách nhiệm',
        blocks: [
          'Trong phạm vi pháp luật cho phép, Perlink không chịu trách nhiệm cho thiệt hại gián tiếp, ngẫu nhiên, đặc biệt hay mang tính trừng phạt. Tổng trách nhiệm của chúng tôi cho mọi khiếu nại không vượt quá số tiền bạn đã trả trong 12 tháng trước đó.',
        ],
      },
      {
        id: 'changes',
        title: 'Thay đổi điều khoản',
        blocks: [
          'Chúng tôi có thể cập nhật điều khoản. Những thay đổi quan trọng sẽ được báo qua email hoặc ngay trong Dịch vụ. Tiếp tục sử dụng sau khi thay đổi nghĩa là bạn chấp nhận điều khoản mới.',
        ],
      },
      {
        id: 'contact',
        title: 'Liên hệ',
        blocks: [
          'Perlink do Hoàng Kim Đức, cá nhân tại Việt Nam, vận hành.',
          'Thắc mắc về điều khoản: {email}.',
        ],
      },
    ],
  },
}
