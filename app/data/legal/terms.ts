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
            'Custom domains for websites, on the plans whose pricing lists them',
            'Links and QR codes made with earlier versions of the Service, which keep working',
          ] },
          'Perlink is self-serve software: you build and edit your site yourself. We do not sell design, development or other custom services.',
          'The Max plan includes every premium 3D room pack and priority online support: questions about using Perlink are answered first. Support is help with the software; it does not include design, building sites or other work done for you.',
          'Perlink only sells its own software plans. If you show products, menus, bookings or payment details on your site, any sale between you and your visitors happens directly between you and them: Perlink is not a party to it, does not process those payments and does not sell on your behalf.',
        ],
      },
      {
        id: 'accounts',
        title: 'Your account',
        blocks: [
          'You sign in with Google, Facebook or TikTok. You must be at least 13 years old, or the minimum age of digital consent in your country.',
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
            'Perlink is software sold as a subscription. There is a free plan and paid plans (Starter, Plus and Max); prices and what each plan includes are on the [pricing page](/pricing). Prices are shown in US dollars, and in Vietnamese đồng (VND) for customers in Vietnam when bank transfer is offered.',
            'Our order process is conducted by our online reseller **Creem**, which is the Merchant of Record for all our orders. Creem handles payment, billing, sales tax and invoices, and provides all customer service inquiries and handles returns for those orders.',
            'Monthly and yearly subscriptions **renew automatically** at the end of each period until you cancel. You can cancel at any time from your account or the receipt email; the plan then stays active until the end of the period you paid for and is not charged again.',
            'When it is offered at checkout, customers in Vietnam may instead pay by local bank transfer (VietQR). Those plans are paid in advance for one month or one year and do not renew on their own.',
            'Paid features are delivered digitally: they turn on in your account as soon as the payment is confirmed. Nothing is shipped.',
            'When a plan ends, the account returns to the free plan. Your sites stay online, but paid features (such as switching to Pro themes or publishing extra sites) stop until you renew.',
            'Each account can try the Plus plan free once, for 7 days, with no payment details.',
            'Price changes apply to future periods only, never to a period you already paid for.',
            'Premium [3D room packs](/3d-room-packs) are a **one-time purchase**, not a subscription. A pack is added to your account as soon as the payment is confirmed and you can use its items in every room you make, for as long as you have an account. The Max plan includes every pack while it is active; rooms published with pack items keep them after the plan ends.',
            'Refunds follow our [Refund Policy](/refund).',
            'Our affiliate program is run through Creem, which tracks referred sales and pays affiliates. Affiliates follow the [program rules](/affiliates#rules) and Creem’s affiliate terms; commission on refunded or charged-back payments is reversed.',
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
            'Tên miền riêng cho trang, ở các gói có ghi tính năng này trên trang Bảng giá',
            'Link rút gọn và mã QR tạo từ phiên bản cũ, vẫn tiếp tục hoạt động',
          ] },
          'Perlink là phần mềm tự phục vụ: bạn tự tạo và chỉnh sửa trang. Chúng tôi không bán dịch vụ thiết kế, lập trình hay dịch vụ làm theo yêu cầu.',
          'Gói Max có sẵn mọi gói món 3D cao cấp và hỗ trợ trực tuyến ưu tiên: câu hỏi về cách dùng Perlink được trả lời trước. Hỗ trợ là hướng dẫn dùng phần mềm; không gồm thiết kế, dựng trang hay công việc làm thay bạn.',
          'Perlink chỉ bán các gói phần mềm của mình. Nếu trang của bạn có sản phẩm, thực đơn, đặt chỗ hay thông tin thanh toán, mọi giao dịch giữa bạn và khách của bạn diễn ra trực tiếp giữa hai bên: Perlink không tham gia, không xử lý các khoản thanh toán đó và không bán hàng thay bạn.',
        ],
      },
      {
        id: 'accounts',
        title: 'Tài khoản của bạn',
        blocks: [
          'Bạn đăng nhập bằng Google, Facebook hoặc TikTok. Bạn cần từ 13 tuổi trở lên, hoặc đủ độ tuổi theo quy định tại quốc gia của bạn.',
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
            'Perlink là phần mềm bán theo hình thức thuê bao. Có gói Miễn phí và các gói trả phí (Starter, Plus và Max); giá và quyền lợi từng gói có ở [trang Bảng giá](/pricing). Giá hiển thị bằng đô la Mỹ, và bằng đồng Việt Nam (VND) cho khách tại Việt Nam khi có hình thức chuyển khoản.',
            'Việc đặt mua được thực hiện qua đại lý bán lại trực tuyến **Creem**, đơn vị bán hàng chính thức (Merchant of Record) cho mọi đơn hàng của chúng tôi. Creem xử lý thanh toán, hoá đơn, thuế bán hàng, hỗ trợ khách hàng và hoàn trả cho các đơn đó.',
            'Thuê bao theo tháng hoặc theo năm **tự gia hạn** khi hết kỳ cho đến khi bạn huỷ. Bạn có thể huỷ bất cứ lúc nào trong tài khoản hoặc từ email biên nhận; gói vẫn dùng được đến hết kỳ đã trả và không bị trừ tiền thêm.',
            'Khi trang thanh toán có hình thức này, khách tại Việt Nam có thể thanh toán bằng chuyển khoản ngân hàng (VietQR). Các gói này trả trước theo tháng hoặc năm và không tự gia hạn.',
            'Tính năng trả phí được giao dưới dạng số: bật ngay trong tài khoản khi thanh toán được xác nhận. Không có hàng hoá vận chuyển.',
            'Khi gói hết hạn, tài khoản về gói Miễn phí. Trang vẫn hoạt động, nhưng tính năng trả phí (như đổi sang theme Pro hay xuất bản thêm trang) tạm dừng đến khi gia hạn.',
            'Mỗi tài khoản được dùng thử gói Plus miễn phí một lần trong 7 ngày, không cần thông tin thanh toán.',
            'Thay đổi giá chỉ áp dụng cho kỳ sau, không ảnh hưởng kỳ bạn đã thanh toán.',
            'Các [gói phòng 3D](/3d-room-packs) cao cấp được **mua một lần**, không phải thuê bao. Gói được thêm vào tài khoản ngay khi thanh toán xác nhận và bạn dùng các món trong mọi phòng bạn làm, chừng nào còn tài khoản. Gói Max có sẵn mọi gói khi còn hiệu lực; phòng đã xuất bản với món của gói vẫn giữ nguyên sau khi gói Max kết thúc.',
            'Hoàn tiền theo [Chính sách hoàn tiền](/refund).',
            'Chương trình cộng tác viên được vận hành qua Creem, đơn vị theo dõi đơn hàng được giới thiệu và trả tiền cho cộng tác viên. Cộng tác viên tuân theo [quy định chương trình](/vi/cong-tac-vien#rules) và điều khoản cộng tác viên của Creem; hoa hồng của khoản thanh toán bị hoàn tiền hoặc chargeback sẽ bị thu hồi.',
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
  zh: {
    title: '服务条款',
    description: '使用 Perlink 创建个人网站和 3D 空间的规则。',
    intro: '本条款说明 Perlink 提供哪些服务、您在使用时同意的内容，以及使用 Perlink 创建的网站上禁止发布的内容。本译文仅为方便阅读而提供，如有歧义，以英文版本为准。',
    summary: [
      { icon: 'i-lucide-user-check', title: '您的内容归您所有', text: '您拥有自己发布的内容，并对其负责。' },
      { icon: 'i-lucide-shield-alert', title: '禁止诈骗和有害内容', text: '欺诈、网络钓鱼、成人或违法内容将被下架。' },
      { icon: 'i-lucide-wallet', title: '随时取消', text: '付费套餐为软件订阅，您可随时取消。' },
    ],
    sections: [
      {
        id: 'acceptance',
        title: '接受本条款',
        blocks: [
          '使用 Perlink（perlink.to，以下简称“本服务”）即表示您同意本服务条款。如您不同意，请勿使用本服务。',
        ],
      },
      {
        id: 'service',
        title: 'Perlink 提供的服务',
        blocks: [
          'Perlink 让个人和小型企业能够创建：',
          { list: [
            '带有模板、主题和内容区块的个人及企业网站',
            '附属于这些网站的可交互 3D 空间',
            '图片相册、相框及媒体托管',
            '页面数据统计',
            '网站自定义域名（适用于定价页面中列明该功能的套餐）',
            '使用本服务早期版本创建的链接和二维码，这些链接和二维码将继续有效',
          ] },
          'Perlink 是自助式软件：您自行搭建和编辑网站。我们不出售设计、开发或其他定制服务。',
          'Max 套餐包含所有高级 3D 房间素材包及优先在线支持：有关使用 Perlink 的问题将优先得到解答。支持仅限于软件使用方面的帮助，不包括设计、代为建站或其他代办工作。',
          'Perlink 仅销售自有的软件套餐。如您在网站上展示商品、菜单、预约或收款信息，您与访客之间的任何交易均直接在您与访客之间进行：Perlink 不是交易的一方，不处理相关付款，也不代表您进行销售。',
        ],
      },
      {
        id: 'accounts',
        title: '您的账户',
        blocks: [
          '您可通过 Google、Facebook 或 TikTok 登录。您须年满 13 周岁，或达到您所在国家/地区规定的数字同意最低年龄。',
          '您有责任确保账户安全，并对使用该账户进行的一切行为负责。如发现未经授权的使用，请立即发送邮件至 {email} 告知我们。',
        ],
      },
      {
        id: 'acceptable-use',
        title: '可接受的使用与禁止内容',
        blocks: [
          '您对通过 Perlink 发布的一切内容负责。您不得发布、链接或推广：',
          { list: [
            '诈骗和欺诈：虚假赠品活动、传销或“快速致富”计划、无牌照的投资、交易或加密货币项目',
            '网络钓鱼：仿冒银行、钱包、品牌或登录页面的网页，或要求访客提供密码、银行卡号或一次性验证码的网页',
            '恶意软件、病毒或其他有害软件',
            '色情露骨内容，或任何涉及未成年人的性内容',
            '暴力、恐怖主义、仇恨言论、骚扰或威胁',
            '违禁商品和服务，包括毒品、武器、假冒商品、无牌照赌博及被盗数据',
            '侵犯著作权、商标权或其他权利的内容',
            '冒充他人、品牌或组织',
            '垃圾信息、未经请求的消息或误导性链接',
            '任何违反越南法律或您经营所在国家/地区法律的内容',
          ] },
          '您也不得试图绕过我们的安全措施、使本服务超载，或访问他人的账户。',
        ],
      },
      {
        id: 'reports',
        title: '举报与下架',
        blocks: [
          '任何人都可以通过每个 Perlink 网站底部的“举报”链接，或在 [perlink.to/report](/report) 举报网站。',
          '我们会审核举报，并可在不事先通知的情况下，下架违反本条款的网站、停用其自定义域名或暂停其账户。被下架的网站不能再次发布，除非我们予以恢复。',
          { note: '认为我们处理有误，或希望提交著作权通知？请发送邮件至 {email}。' },
        ],
      },
      {
        id: 'content',
        title: '内容与知识产权',
        blocks: [
          '您保留您所创建内容的所有权。您授予我们一项有限许可，以便在运营本服务所需的范围内托管、展示和备份这些内容；您确认您对上传或链接的所有内容均拥有相应权利。',
          'Perlink 的软件、模板、主题和品牌仍归我们所有。',
        ],
      },
      {
        id: 'plans',
        title: '套餐、付款与续订',
        blocks: [
          { list: [
            'Perlink 是以订阅方式销售的软件。我们提供免费套餐和付费套餐（Starter、Plus 和 Max）；价格及各套餐包含的内容见[定价页面](/pricing)。价格以美元显示；对于提供银行转账的越南客户，同时以越南盾（VND）显示。',
            '我们的订购流程由在线经销商 **Creem** 执行，Creem 是我们所有订单的记录商户（Merchant of Record）。Creem 负责这些订单的付款、账单、销售税和发票，并处理所有客户服务咨询及退货。',
            '月度和年度订阅在每个周期结束时**自动续订**，直至您取消。您可随时在账户中或通过收据邮件取消；取消后，套餐将保持有效至您已付费周期结束，且不会再次扣费。',
            '如结账时提供该选项，越南客户也可通过本地银行转账（VietQR）付款。此类套餐按一个月或一年预付，不会自动续订。',
            '付费功能以数字方式交付：付款确认后即在您的账户中开通。不涉及任何实物配送。',
            '套餐到期后，账户将恢复为免费套餐。您的网站仍保持在线，但付费功能（如切换到 Pro 主题或发布更多网站）将暂停，直至您续订。',
            '每个账户可免费试用 Plus 套餐一次，为期 7 天，无需提供付款信息。',
            '价格调整仅适用于未来的周期，绝不适用于您已付费的周期。',
            '高级 [3D 房间素材包](/3d-room-packs)为**一次性购买**，并非订阅。付款确认后，素材包即添加到您的账户；只要您的账户存在，您就可以在创建的每个房间中使用其中的物品。Max 套餐在有效期内包含所有素材包；使用素材包物品发布的房间在套餐结束后仍保留这些物品。',
            '退款依照我们的[退款政策](/refund)办理。',
            '我们的推广联盟计划通过 Creem 运营，由 Creem 追踪推荐销售并向推广者付款。推广者须遵守[计划规则](/zh/affiliates#rules)及 Creem 的推广者条款；已退款或被拒付的款项所对应的佣金将被撤销。',
          ] },
        ],
      },
      {
        id: 'limits',
        title: '服务限制',
        blocks: [
          '每个套餐均有一定限制，例如网站数量。为保护本服务，我们也可能限制上传量或流量，并可在合理通知后更改或停用某些功能。',
        ],
      },
      {
        id: 'data',
        title: '数据统计与数据',
        blocks: [
          '我们为网站所有者统计访问量和点击量，并用于改进本服务。IP 地址经过哈希处理，绝不会向网站所有者显示。详情请参阅[隐私政策](/privacy)。',
        ],
      },
      {
        id: 'termination',
        title: '终止使用',
        blocks: [
          '您可随时在“设置”中删除您的账户。对于违反本条款或损害他人的行为，我们可暂停或终止其访问权限。如我们因任何其他原因终止付费账户，将退还当前周期中未使用部分的费用。',
        ],
      },
      {
        id: 'warranty',
        title: '不提供担保',
        blocks: [
          '本服务按“现状”提供，不附带任何形式的担保。我们会尽力保持本服务正常运行，但无法保证其始终可用、安全或无错误。',
        ],
      },
      {
        id: 'liability',
        title: '责任限制',
        blocks: [
          '在法律允许的范围内，Perlink 不对任何间接、附带、特殊、后果性或惩罚性损害承担责任。我们对任何索赔的全部责任，以您在索赔发生前 12 个月内向我们支付的金额为限。',
        ],
      },
      {
        id: 'changes',
        title: '条款变更',
        blocks: [
          '我们可能会更新本条款。如有重大变更，我们将通过电子邮件或在本服务中通知您。变更后继续使用本服务，即表示您接受新的条款。',
        ],
      },
      {
        id: 'contact',
        title: '联系我们',
        blocks: [
          'Perlink 由常驻越南的个人 Hoang Kim Duc 运营。',
          '有关本条款的问题，请联系：{email}。',
        ],
      },
    ],
  },
  ja: {
    title: '利用規約',
    description: 'Perlinkを利用して個人ウェブサイトや3Dワールドを作成する際のルールです。',
    intro: '本規約は、Perlinkが提供するサービスの内容、ご利用にあたって同意いただく事項、およびPerlinkで作成したサイトで禁止される事項を定めるものです。本翻訳は便宜上提供するものであり、英語版と内容が異なる場合は英語版が優先します。',
    summary: [
      { icon: 'i-lucide-user-check', title: 'コンテンツはあなたのもの', text: '公開したコンテンツの所有権はあなたにあり、その責任もあなたが負います。' },
      { icon: 'i-lucide-shield-alert', title: '詐欺・有害行為は禁止', text: '詐欺、フィッシング、アダルトまたは違法なコンテンツは削除されます。' },
      { icon: 'i-lucide-wallet', title: 'いつでも解約可能', text: '有料プランはソフトウェアのサブスクリプションであり、いつでも解約できます。' },
    ],
    sections: [
      {
        id: 'acceptance',
        title: '本規約への同意',
        blocks: [
          'Perlink（perlink.to、以下「本サービス」）を利用することにより、あなたは本利用規約に同意したものとみなされます。同意いただけない場合は、本サービスを利用しないでください。',
        ],
      },
      {
        id: 'service',
        title: 'Perlinkが提供するもの',
        blocks: [
          'Perlinkを利用すると、個人や小規模事業者は次のものを作成できます。',
          { list: [
            'テンプレート、テーマ、コンテンツブロックを使った個人・ビジネス向けウェブサイト',
            'ウェブサイトに付属するインタラクティブな3Dワールド',
            '画像アルバム、フォトフレーム、メディアホスティング',
            'ページのアクセス解析',
            'ウェブサイト用の独自ドメイン（料金表に記載のあるプランに限ります）',
            '本サービスの旧バージョンで作成したリンクおよびQRコード（引き続き利用できます）',
          ] },
          'Perlinkはセルフサービス型のソフトウェアであり、サイトの作成・編集はご自身で行っていただきます。当方はデザイン、開発その他の受託サービスを販売していません。',
          'Maxプランには、すべてのプレミアム3Dルームパックと優先オンラインサポートが含まれ、Perlinkの使い方に関するご質問に優先的に回答します。サポートはソフトウェアの利用に関する支援であり、デザイン、サイト制作その他の代行作業は含まれません。',
          'Perlinkが販売するのは自社のソフトウェアプランのみです。あなたのサイトに商品、メニュー、予約または支払情報を掲載する場合、あなたと訪問者との間の取引はすべて当事者間で直接行われるものとし、Perlinkはその取引の当事者ではなく、その代金の決済を処理せず、あなたに代わって販売を行うこともありません。',
        ],
      },
      {
        id: 'accounts',
        title: 'アカウント',
        blocks: [
          'サインインにはGoogle、FacebookまたはTikTokを使用します。13歳以上、またはお住まいの国のデジタル同意年齢以上である必要があります。',
          'アカウントの安全管理およびアカウントで行われたすべての行為について、あなたが責任を負います。不正利用に気付いた場合は、直ちに{email}までご連絡ください。',
        ],
      },
      {
        id: 'acceptable-use',
        title: '利用上のルールと禁止コンテンツ',
        blocks: [
          'Perlinkで公開するすべてのコンテンツについて、あなたが責任を負います。次のものを公開し、リンクし、または宣伝してはなりません。',
          { list: [
            '詐欺・不正行為：偽のプレゼント企画、ねずみ講や「すぐに儲かる」話、無登録の投資・取引・暗号資産の勧誘',
            'フィッシング：銀行、ウォレット、ブランドまたはログインページを模倣するページ、訪問者にパスワード、カード番号、ワンタイムコードを求めるページ',
            'マルウェア、ウイルスその他の有害なソフトウェア',
            '性的に露骨なコンテンツ、または未成年者が関わるあらゆる性的コンテンツ',
            '暴力、テロ、ヘイトスピーチ、嫌がらせまたは脅迫',
            '違法な商品・サービス（薬物、武器、偽造品、無許可の賭博、盗まれたデータを含みます）',
            '著作権、商標その他の権利を侵害するコンテンツ',
            '他人、ブランドまたは団体へのなりすまし',
            'スパム、迷惑メッセージまたは誤解を招くリンク',
            'ベトナムの法律、またはあなたが活動する国の法律に違反するもの',
          ] },
          'また、当方のセキュリティを回避しようとしたり、本サービスに過剰な負荷をかけたり、他人のアカウントにアクセスしたりしてはなりません。',
        ],
      },
      {
        id: 'reports',
        title: '通報と削除',
        blocks: [
          'すべてのPerlinkサイトの下部にある「通報」リンク、または[perlink.to/report](/report)から、誰でもサイトを通報できます。',
          '当方は通報を確認し、本規約に違反するサイトの削除、独自ドメインの無効化またはアカウントの停止を、事前の通知なく行うことがあります。削除されたサイトは、当方が復元しない限り再公開できません。',
          { note: '当方の判断に誤りがあると思われる場合や、著作権侵害の通知を送りたい場合は、{email}までご連絡ください。' },
        ],
      },
      {
        id: 'content',
        title: 'コンテンツと知的財産',
        blocks: [
          'あなたが作成したコンテンツの所有権はあなたに留保されます。あなたは当方に対し、本サービスの運営に必要な範囲でそのコンテンツをホスト、表示およびバックアップするための限定的なライセンスを付与し、アップロードまたはリンクするすべてのものについて必要な権利を有していることを保証します。',
          'Perlinkのソフトウェア、テンプレート、テーマおよびブランドは当方に帰属します。',
        ],
      },
      {
        id: 'plans',
        title: 'プラン、支払いと更新',
        blocks: [
          { list: [
            'Perlinkはサブスクリプションとして販売されるソフトウェアです。無料プランと有料プラン（Starter、Plus、Max）があり、料金と各プランの内容は[料金ページ](/pricing)に記載しています。料金は米ドルで表示され、銀行振込に対応している場合、ベトナムのお客様にはベトナムドン（VND）でも表示されます。',
            '当方の注文手続きは、オンライン販売代理店である**Creem**が行い、Creemがすべての注文の販売者（Merchant of Record）となります。Creemは決済、請求、売上税および請求書を取り扱い、これらの注文に関するすべてのお問い合わせ対応と返品処理を行います。',
            '月額・年額のサブスクリプションは、解約されるまで各期間の終了時に**自動的に更新**されます。アカウントまたは領収書メールからいつでも解約でき、解約後もお支払い済みの期間の終了まではプランが有効で、以後請求されることはありません。',
            'チェックアウト時に提示される場合、ベトナムのお客様は代わりに国内銀行振込（VietQR）でお支払いいただけます。これらのプランは1か月または1年分の前払いであり、自動的には更新されません。',
            '有料機能はデジタルで提供され、支払いが確認され次第アカウントで有効になります。物品の発送はありません。',
            'プランが終了すると、アカウントは無料プランに戻ります。サイトは引き続き公開されますが、有料機能（Proテーマへの切り替えや追加サイトの公開など）は更新するまで利用できません。',
            '各アカウントは、支払情報なしでPlusプランを7日間、1回に限り無料でお試しいただけます。',
            '料金の変更は将来の期間にのみ適用され、すでにお支払い済みの期間には適用されません。',
            'プレミアム[3Dルームパック](/3d-room-packs)は**買い切り**であり、サブスクリプションではありません。パックは支払いが確認され次第アカウントに追加され、アカウントがある限り、作成するすべてのルームでそのアイテムを使用できます。Maxプランは有効期間中すべてのパックを含み、パックのアイテムを使って公開したルームは、プラン終了後もそのアイテムを保持します。',
            '返金は当方の[返金ポリシー](/refund)に従います。',
            '当方のアフィリエイトプログラムはCreemを通じて運営され、Creemが紹介による売上を追跡し、アフィリエイトへの支払いを行います。アフィリエイトは[プログラムのルール](/ja/affiliates#rules)およびCreemのアフィリエイト規約に従うものとし、返金またはチャージバックされた支払いに対する報酬は取り消されます。',
          ] },
        ],
      },
      {
        id: 'limits',
        title: 'サービスの制限',
        blocks: [
          '各プランには、サイト数などの制限があります。当方は、本サービスを保護するためにアップロードやトラフィックを制限することがあり、合理的な予告をもって機能を変更または廃止することがあります。',
        ],
      },
      {
        id: 'data',
        title: 'アクセス解析とデータ',
        blocks: [
          '当方は、サイト所有者のため、および本サービスの改善のために、訪問数とクリック数を集計します。IPアドレスはハッシュ化され、サイト所有者に表示されることはありません。詳細は[プライバシーポリシー](/privacy)をご覧ください。',
        ],
      },
      {
        id: 'termination',
        title: '利用の終了',
        blocks: [
          'あなたは「設定」からいつでもアカウントを削除できます。当方は、本規約に違反し、または他者に害を与える行為があった場合、アクセスを停止または終了することがあります。それ以外の理由で当方が有料アカウントを終了する場合は、当期の未使用分を返金します。',
        ],
      },
      {
        id: 'warranty',
        title: '保証の否認',
        blocks: [
          '本サービスは「現状有姿」で提供され、いかなる種類の保証もありません。当方は本サービスの安定稼働に努めますが、常に利用可能であること、安全であること、またはエラーがないことを約束するものではありません。',
        ],
      },
      {
        id: 'liability',
        title: '責任の制限',
        blocks: [
          '法律で認められる範囲において、Perlinkは間接的、付随的、特別、結果的または懲罰的な損害について責任を負いません。いかなる請求に関しても、当方の責任の総額は、その請求の前12か月間にあなたが当方に支払った金額を上限とします。',
        ],
      },
      {
        id: 'changes',
        title: '本規約の変更',
        blocks: [
          '当方は本規約を更新することがあります。重要な変更については、メールまたは本サービス上でお知らせします。変更後に本サービスを利用した場合、新しい規約に同意したものとみなされます。',
        ],
      },
      {
        id: 'contact',
        title: 'お問い合わせ',
        blocks: [
          'Perlinkは、ベトナムに拠点を置く個人であるHoang Kim Ducが運営しています。',
          '本規約に関するお問い合わせ：{email}',
        ],
      },
    ],
  },
  ko: {
    title: '이용약관',
    description: 'Perlink로 개인 웹사이트와 3D 월드를 만들 때 지켜야 할 이용 규칙입니다.',
    intro: '이 약관은 Perlink가 제공하는 서비스, 이용 시 동의하는 사항, 그리고 Perlink로 만든 사이트에서 허용되지 않는 행위를 설명합니다. 이 번역본은 편의를 위해 제공되며, 영문본과 내용이 다를 경우 영문본이 우선합니다.',
    summary: [
      { icon: 'i-lucide-user-check', title: '콘텐츠는 회원의 것입니다', text: '게시한 콘텐츠의 소유권과 책임은 회원에게 있습니다.' },
      { icon: 'i-lucide-shield-alert', title: '사기·유해 행위 금지', text: '사기, 피싱, 성인 콘텐츠 또는 불법 콘텐츠는 삭제됩니다.' },
      { icon: 'i-lucide-wallet', title: '언제든지 해지 가능', text: '유료 플랜은 언제든지 해지할 수 있는 소프트웨어 구독입니다.' },
    ],
    sections: [
      {
        id: 'acceptance',
        title: '약관의 동의',
        blocks: [
          'Perlink(perlink.to, 이하 "서비스")를 이용함으로써 귀하는 본 이용약관에 동의하게 됩니다. 동의하지 않는 경우 서비스를 이용하지 마십시오.',
        ],
      },
      {
        id: 'service',
        title: 'Perlink가 제공하는 서비스',
        blocks: [
          'Perlink를 통해 개인과 소규모 사업자는 다음을 만들 수 있습니다.',
          { list: [
            '템플릿, 테마, 콘텐츠 블록을 활용한 개인 및 비즈니스 웹사이트',
            '웹사이트에 연결된 인터랙티브 3D 월드',
            '이미지 앨범, 사진 액자 및 미디어 호스팅',
            '페이지 분석',
            '요금 안내에 포함된 플랜에서 제공되는 웹사이트용 맞춤 도메인',
            '이전 버전의 서비스로 만든 링크와 QR 코드(계속 작동합니다)',
          ] },
          'Perlink는 셀프서비스 소프트웨어로, 회원이 직접 사이트를 만들고 편집합니다. 당사는 디자인, 개발 또는 기타 맞춤형 서비스를 판매하지 않습니다.',
          'Max 플랜에는 모든 프리미엄 3D 룸 팩과 우선 온라인 지원이 포함되며, Perlink 이용에 관한 문의에 우선적으로 답변합니다. 지원은 소프트웨어 사용에 대한 도움이며, 디자인, 사이트 제작 또는 회원을 대신하여 수행하는 기타 작업은 포함되지 않습니다.',
          'Perlink는 자체 소프트웨어 플랜만 판매합니다. 회원이 사이트에 상품, 메뉴, 예약 또는 결제 정보를 게시하는 경우, 회원과 방문자 간의 모든 거래는 당사자 간에 직접 이루어집니다. Perlink는 해당 거래의 당사자가 아니며, 그 결제를 처리하거나 회원을 대신하여 판매하지 않습니다.',
        ],
      },
      {
        id: 'accounts',
        title: '계정',
        blocks: [
          'Google, Facebook 또는 TikTok으로 로그인합니다. 만 13세 이상이거나 거주 국가의 디지털 동의 최소 연령 이상이어야 합니다.',
          '계정의 보안 유지와 계정에서 이루어지는 모든 행위에 대한 책임은 회원에게 있습니다. 무단 사용을 발견한 경우 즉시 {email}로 알려 주십시오.',
        ],
      },
      {
        id: 'acceptable-use',
        title: '허용되는 이용 및 금지 콘텐츠',
        blocks: [
          '회원은 Perlink로 게시하는 모든 콘텐츠에 대해 책임을 집니다. 다음을 게시하거나, 링크하거나, 홍보해서는 안 됩니다.',
          { list: [
            '사기 및 기만 행위: 가짜 경품 이벤트, 다단계 또는 "단기간 고수익" 방식, 인가받지 않은 투자·트레이딩·암호화폐 상품',
            '피싱: 은행, 지갑, 브랜드 또는 로그인 페이지를 모방하거나 방문자에게 비밀번호, 카드 번호, 일회용 인증 코드를 요구하는 페이지',
            '악성코드, 바이러스 또는 기타 유해한 소프트웨어',
            '노골적인 성적 콘텐츠 또는 미성년자가 관련된 모든 성적 콘텐츠',
            '폭력, 테러, 혐오 표현, 괴롭힘 또는 협박',
            '마약, 무기, 위조품, 무허가 도박, 도용된 데이터를 포함한 불법 상품 및 서비스',
            '저작권, 상표권 또는 기타 권리를 침해하는 콘텐츠',
            '다른 사람, 브랜드 또는 단체를 사칭하는 행위',
            '스팸, 원치 않는 메시지 또는 오해를 불러일으키는 링크',
            '베트남 법률 또는 회원이 활동하는 국가의 법률을 위반하는 모든 행위',
          ] },
          '또한 당사의 보안 조치를 우회하거나, 서비스에 과부하를 일으키거나, 다른 사람의 계정에 접근하려고 해서는 안 됩니다.',
        ],
      },
      {
        id: 'reports',
        title: '신고 및 게시 중단',
        blocks: [
          '누구나 모든 Perlink 사이트 하단의 "신고" 링크 또는 [perlink.to/report](/report)에서 사이트를 신고할 수 있습니다.',
          '당사는 신고 내용을 검토하며, 본 약관을 위반한 사이트를 사전 통지 없이 내리거나, 맞춤 도메인을 비활성화하거나, 계정을 정지할 수 있습니다. 게시 중단된 사이트는 당사가 복구하지 않는 한 다시 게시할 수 없습니다.',
          { note: '당사의 판단에 오류가 있다고 생각하시거나 저작권 침해 통지를 보내시려면 {email}로 연락해 주십시오.' },
        ],
      },
      {
        id: 'content',
        title: '콘텐츠 및 지식재산권',
        blocks: [
          '회원이 만든 콘텐츠의 소유권은 회원에게 있습니다. 회원은 서비스 운영에 필요한 범위 내에서 해당 콘텐츠를 호스팅, 표시 및 백업할 수 있는 제한적인 라이선스를 당사에 부여하며, 업로드하거나 링크하는 모든 콘텐츠에 대한 권리를 보유하고 있음을 확인합니다.',
          'Perlink의 소프트웨어, 템플릿, 테마 및 브랜드는 당사의 소유입니다.',
        ],
      },
      {
        id: 'plans',
        title: '플랜, 결제 및 갱신',
        blocks: [
          { list: [
            'Perlink는 구독 방식으로 판매되는 소프트웨어입니다. 무료 플랜과 유료 플랜(Starter, Plus, Max)이 있으며, 가격과 각 플랜의 포함 내용은 [요금 페이지](/pricing)에서 확인할 수 있습니다. 가격은 미국 달러로 표시되며, 계좌 이체가 제공되는 경우 베트남 고객에게는 베트남 동(VND)으로도 표시됩니다.',
            '당사의 주문 절차는 온라인 리셀러인 **Creem**이 진행하며, Creem은 모든 주문의 판매 대행자(Merchant of Record)입니다. Creem은 결제, 청구, 판매세 및 인보이스를 처리하고, 해당 주문에 관한 모든 고객 문의와 반품을 담당합니다.',
            '월간 및 연간 구독은 해지할 때까지 각 기간이 끝날 때마다 **자동으로 갱신**됩니다. 계정 또는 영수증 이메일에서 언제든지 해지할 수 있으며, 해지 후에도 결제한 기간이 끝날 때까지 플랜이 유지되고 추가 요금은 청구되지 않습니다.',
            '결제 화면에서 제공되는 경우, 베트남 고객은 현지 계좌 이체(VietQR)로 결제할 수도 있습니다. 이 플랜은 1개월 또는 1년 단위로 선결제되며 자동으로 갱신되지 않습니다.',
            '유료 기능은 디지털 방식으로 제공되며, 결제가 확인되는 즉시 계정에서 활성화됩니다. 배송되는 물품은 없습니다.',
            '플랜이 종료되면 계정은 무료 플랜으로 전환됩니다. 사이트는 계속 온라인 상태로 유지되지만, 유료 기능(예: Pro 테마로 변경하거나 추가 사이트를 게시하는 기능)은 갱신할 때까지 이용할 수 없습니다.',
            '각 계정은 결제 정보 없이 Plus 플랜을 7일간 한 번 무료로 체험할 수 있습니다.',
            '가격 변경은 이후 기간에만 적용되며, 이미 결제한 기간에는 적용되지 않습니다.',
            '프리미엄 [3D 룸 팩](/3d-room-packs)은 구독이 아닌 **일회성 구매** 상품입니다. 팩은 결제가 확인되는 즉시 계정에 추가되며, 계정을 보유하는 동안 만드는 모든 룸에서 팩의 아이템을 사용할 수 있습니다. Max 플랜에는 플랜이 활성화된 동안 모든 팩이 포함되며, 팩 아이템으로 게시한 룸은 플랜이 종료된 후에도 해당 아이템이 유지됩니다.',
            '환불은 당사의 [환불 정책](/refund)을 따릅니다.',
            '당사의 제휴(어필리에이트) 프로그램은 Creem을 통해 운영되며, Creem이 추천 판매를 추적하고 제휴 파트너에게 수수료를 지급합니다. 제휴 파트너는 [프로그램 규칙](/ko/affiliates#rules)과 Creem의 제휴 약관을 준수해야 하며, 환불되거나 지불 거절(차지백)된 결제에 대한 수수료는 취소됩니다.',
          ] },
        ],
      },
      {
        id: 'limits',
        title: '서비스 이용 한도',
        blocks: [
          '각 플랜에는 사이트 수 등의 한도가 있습니다. 당사는 서비스를 보호하기 위해 업로드나 트래픽을 제한할 수 있으며, 합리적인 사전 고지 후 기능을 변경하거나 종료할 수 있습니다.',
        ],
      },
      {
        id: 'data',
        title: '분석 및 데이터',
        blocks: [
          '당사는 사이트 소유자를 위해, 그리고 서비스 개선을 위해 방문 수와 클릭 수를 집계합니다. IP 주소는 해시 처리되며 사이트 소유자에게 표시되지 않습니다. 자세한 내용은 [개인정보 처리방침](/privacy)을 참고하십시오.',
        ],
      },
      {
        id: 'termination',
        title: '이용 종료',
        blocks: [
          '회원은 설정에서 언제든지 계정을 삭제할 수 있습니다. 당사는 본 약관을 위반하거나 타인에게 피해를 주는 행위에 대해 이용을 정지하거나 종료할 수 있습니다. 그 밖의 사유로 당사가 유료 계정을 종료하는 경우, 현재 기간 중 사용하지 않은 부분을 환불합니다.',
        ],
      },
      {
        id: 'warranty',
        title: '보증의 부인',
        blocks: [
          '서비스는 어떠한 종류의 보증도 없이 "있는 그대로" 제공됩니다. 당사는 서비스가 원활히 운영되도록 최선을 다하지만, 서비스가 항상 이용 가능하거나, 안전하거나, 오류가 없을 것이라고 보장할 수 없습니다.',
        ],
      },
      {
        id: 'liability',
        title: '책임의 제한',
        blocks: [
          '법률이 허용하는 범위 내에서 Perlink는 간접적, 부수적, 특별, 결과적 또는 징벌적 손해에 대해 책임을 지지 않습니다. 모든 청구에 대한 당사의 총 책임은 해당 청구 발생 전 12개월 동안 회원이 당사에 지불한 금액으로 제한됩니다.',
        ],
      },
      {
        id: 'changes',
        title: '약관의 변경',
        blocks: [
          '당사는 본 약관을 변경할 수 있습니다. 중요한 변경 사항은 이메일 또는 서비스 내에서 알려 드립니다. 변경 후에도 서비스를 계속 이용하는 경우 변경된 약관에 동의한 것으로 간주됩니다.',
        ],
      },
      {
        id: 'contact',
        title: '문의',
        blocks: [
          'Perlink는 베트남에 거주하는 개인인 Hoang Kim Duc이 운영합니다.',
          '본 약관에 관한 문의: {email}',
        ],
      },
    ],
  },
}
