import type { LegalDocs } from './types'

export const REFUND: LegalDocs = {
  en: {
    title: 'Refund Policy',
    description: 'How refunds work for Perlink paid plans: a 7-day money-back guarantee.',
    intro: 'Try Perlink free, pay only when you’re sure, and get your money back within 7 days if it isn’t right for you.',
    summary: [
      { icon: 'i-lucide-badge-check', title: '7-day money back', text: 'Full refund within 7 days of any payment, no questions.' },
      { icon: 'i-lucide-repeat', title: 'Cancel any time', text: 'Stop a subscription whenever you like; it won’t be charged again.' },
      { icon: 'i-lucide-clock', title: 'Fast', text: 'We reply within 2 business days.' },
    ],
    sections: [
      {
        id: 'try',
        title: 'Try before you pay',
        blocks: ['Perlink has a free plan with no time limit, and every account can try the Plus plan free for 7 days, with no payment details. You can cancel a paid subscription at any time and it won’t be charged again.'],
      },
      {
        id: 'guarantee',
        title: '7-day money-back guarantee',
        blocks: ['If a paid plan isn’t right for you, ask for a refund within 7 days of the payment (the first payment or a renewal) and we will refund it in full. Your account returns to the free plan when the refund is made.', 'The same applies to a premium 3D room pack: within 7 days of buying it, we refund it in full and the pack is removed from your account.'],
      },
      {
        id: 'after',
        title: 'After 7 days',
        blocks: [
          'Payments are not refunded after 7 days, but your plan stays active until the end of the period you paid for.',
          { note: 'Exceptions: if the Service didn’t work as described (for example a long outage), or a payment was made twice or by mistake, tell us and we will refund it.' },
        ],
      },
      {
        id: 'not-refunded',
        title: 'What isn’t refunded',
        blocks: [
          { list: [
            'Accounts or sites removed for breaking the [Terms of Service](/terms#acceptable-use)',
            'Third-party costs, such as a domain name bought from a registrar',
          ] },
        ],
      },
      {
        id: 'how',
        title: 'How to ask for a refund',
        blocks: [
          { list: [
            'Email {email} from the address of your Perlink account, with the order number from your receipt email (or, for a bank transfer in Vietnam, the payment code starting with "PL" from **Plans → Payment history**).',
            'We reply within 2 business days.',
            'Orders paid online are refunded through our reseller and Merchant of Record, **Creem**, to the original payment method; your bank may take 5–10 business days to show it. Bank transfers in Vietnam are refunded by bank transfer within 5 business days.',
          ] },
        ],
      },
    ],
  },
  vi: {
    title: 'Chính sách hoàn tiền',
    description: 'Cách hoàn tiền cho các gói trả phí của Perlink: cam kết hoàn tiền trong 7 ngày.',
    intro: 'Dùng thử Perlink miễn phí, chỉ trả tiền khi đã chắc chắn, và được hoàn tiền trong 7 ngày nếu thấy chưa phù hợp.',
    summary: [
      { icon: 'i-lucide-badge-check', title: 'Hoàn tiền trong 7 ngày', text: 'Hoàn 100% trong 7 ngày sau mỗi lần thanh toán.' },
      { icon: 'i-lucide-repeat', title: 'Huỷ bất cứ lúc nào', text: 'Huỷ thuê bao bất cứ lúc nào, không bị trừ tiền thêm.' },
      { icon: 'i-lucide-clock', title: 'Nhanh chóng', text: 'Phản hồi trong 2 ngày làm việc.' },
    ],
    sections: [
      {
        id: 'try',
        title: 'Dùng thử trước khi trả tiền',
        blocks: ['Perlink có gói Miễn phí không giới hạn thời gian, và mỗi tài khoản được dùng thử gói Plus miễn phí 7 ngày, không cần thông tin thanh toán. Bạn có thể huỷ thuê bao trả phí bất cứ lúc nào và sẽ không bị trừ tiền thêm.'],
      },
      {
        id: 'guarantee',
        title: 'Cam kết hoàn tiền trong 7 ngày',
        blocks: ['Nếu gói trả phí chưa phù hợp, hãy yêu cầu hoàn tiền trong vòng 7 ngày kể từ lúc thanh toán (lần đầu hoặc lần gia hạn), chúng tôi hoàn lại toàn bộ. Tài khoản sẽ về gói Miễn phí khi hoàn tiền xong.', 'Gói phòng 3D cao cấp cũng vậy: trong vòng 7 ngày kể từ lúc mua, chúng tôi hoàn lại toàn bộ và gói được gỡ khỏi tài khoản.'],
      },
      {
        id: 'after',
        title: 'Sau 7 ngày',
        blocks: [
          'Sau 7 ngày, khoản thanh toán không được hoàn lại, nhưng gói vẫn dùng được đến hết kỳ bạn đã trả.',
          { note: 'Ngoại lệ: nếu Dịch vụ không hoạt động như mô tả (ví dụ gián đoạn kéo dài), hoặc bạn thanh toán trùng hay nhầm, hãy báo cho chúng tôi để được hoàn tiền.' },
        ],
      },
      {
        id: 'not-refunded',
        title: 'Trường hợp không hoàn tiền',
        blocks: [
          { list: [
            'Tài khoản hoặc trang bị gỡ do vi phạm [Điều khoản sử dụng](/terms#acceptable-use)',
            'Chi phí bên thứ ba, ví dụ tên miền bạn mua từ nhà đăng ký tên miền',
          ] },
        ],
      },
      {
        id: 'how',
        title: 'Cách yêu cầu hoàn tiền',
        blocks: [
          { list: [
            'Gửi email tới {email} từ địa chỉ email của tài khoản Perlink, kèm mã đơn hàng trong email biên nhận (hoặc, nếu chuyển khoản tại Việt Nam, mã thanh toán bắt đầu bằng "PL" trong **Gói dịch vụ → Lịch sử thanh toán**).',
            'Chúng tôi phản hồi trong 2 ngày làm việc.',
            'Đơn thanh toán trực tuyến được hoàn qua đại lý bán lại và đơn vị bán hàng chính thức **Creem**, về phương thức thanh toán ban đầu; ngân hàng có thể mất 5–10 ngày làm việc để hiển thị. Chuyển khoản tại Việt Nam được hoàn bằng chuyển khoản trong 5 ngày làm việc.',
          ] },
        ],
      },
    ],
  },
  zh: {
    title: '退款政策',
    description: 'Perlink 付费套餐的退款方式：7 天退款保证。',
    intro: '免费试用 Perlink，确定合适后再付费；如不满意，可在 7 天内获得退款。本译文仅为方便阅读而提供，如有歧义，以英文版本为准。',
    summary: [
      { icon: 'i-lucide-badge-check', title: '7 天退款', text: '每次付款后 7 天内可全额退款，无需说明理由。' },
      { icon: 'i-lucide-repeat', title: '随时取消', text: '可随时停止订阅，之后不会再被扣费。' },
      { icon: 'i-lucide-clock', title: '快速处理', text: '我们会在 2 个工作日内回复。' },
    ],
    sections: [
      {
        id: 'try',
        title: '先试用，后付费',
        blocks: ['Perlink 提供不限时长的免费套餐，且每个账户均可免费试用 Plus 套餐 7 天，无需填写付款信息。您可以随时取消付费订阅，取消后不会再被扣费。'],
      },
      {
        id: 'guarantee',
        title: '7 天退款保证',
        blocks: ['如果付费套餐不适合您，请在付款（首次付款或续费）后 7 天内申请退款，我们将全额退款。退款完成后，您的账户将恢复为免费套餐。', '高级 3D 房间包同样适用：购买后 7 天内，我们将全额退款，并从您的账户中移除该房间包。'],
      },
      {
        id: 'after',
        title: '7 天之后',
        blocks: [
          '超过 7 天的付款不予退款，但您的套餐将保持有效，直至已付费周期结束。',
          { note: '例外情况：如果本服务未能按描述正常运行（例如长时间中断），或出现重复付款、误付款，请告知我们，我们将予以退款。' },
        ],
      },
      {
        id: 'not-refunded',
        title: '不予退款的情形',
        blocks: [
          { list: [
            '因违反[服务条款](/terms#acceptable-use)而被移除的账户或网站',
            '第三方费用，例如从域名注册商处购买的域名',
          ] },
        ],
      },
      {
        id: 'how',
        title: '如何申请退款',
        blocks: [
          { list: [
            '请使用您 Perlink 账户的电子邮箱发送邮件至 {email}，并附上收据邮件中的订单号（如在越南通过银行转账付款，请附上 **套餐 → 支付记录** 中以“PL”开头的付款代码）。',
            '我们会在 2 个工作日内回复。',
            '在线支付的订单将通过我们的经销商及记录商户（Merchant of Record）**Creem** 退回至原付款方式；您的银行可能需要 5–10 个工作日才会显示该笔退款。在越南通过银行转账付款的，将在 5 个工作日内以银行转账方式退款。',
          ] },
        ],
      },
    ],
  },
  ja: {
    title: '返金ポリシー',
    description: 'Perlink の有料プランの返金について：7 日間の返金保証。',
    intro: 'Perlink は無料でお試しいただけます。納得してからお支払いいただき、合わなかった場合は 7 日以内であれば返金いたします。本翻訳は便宜上提供するものであり、英語版が優先します。',
    summary: [
      { icon: 'i-lucide-badge-check', title: '7 日間の返金保証', text: 'お支払いから 7 日以内であれば、理由を問わず全額返金いたします。' },
      { icon: 'i-lucide-repeat', title: 'いつでも解約可能', text: 'サブスクリプションはいつでも停止でき、以後請求されることはありません。' },
      { icon: 'i-lucide-clock', title: '迅速な対応', text: '2 営業日以内にご返信いたします。' },
    ],
    sections: [
      {
        id: 'try',
        title: 'お支払い前にお試しください',
        blocks: ['Perlink には期間無制限の無料プランがあり、すべてのアカウントで Plus プランを 7 日間無料でお試しいただけます（お支払い情報の入力は不要です）。有料サブスクリプションはいつでも解約でき、以後請求されることはありません。'],
      },
      {
        id: 'guarantee',
        title: '7 日間の返金保証',
        blocks: ['有料プランがご希望に合わない場合は、お支払い（初回のお支払いまたは更新）から 7 日以内に返金をお申し出ください。全額を返金いたします。返金が完了すると、アカウントは無料プランに戻ります。', 'プレミアム 3D ルームパックについても同様です。ご購入から 7 日以内であれば全額を返金し、当該パックはアカウントから削除されます。'],
      },
      {
        id: 'after',
        title: '7 日経過後',
        blocks: [
          '7 日を経過したお支払いは返金いたしませんが、プランはお支払い済みの期間が終了するまで引き続きご利用いただけます。',
          { note: '例外：本サービスが説明どおりに機能しなかった場合（長時間の障害など）、または二重払いや誤ってお支払いいただいた場合は、ご連絡いただければ返金いたします。' },
        ],
      },
      {
        id: 'not-refunded',
        title: '返金の対象外となるもの',
        blocks: [
          { list: [
            '[利用規約](/terms#acceptable-use)への違反により削除されたアカウントまたはサイト',
            'ドメイン登録事業者から購入したドメイン名など、第三者に支払う費用',
          ] },
        ],
      },
      {
        id: 'how',
        title: '返金の申請方法',
        blocks: [
          { list: [
            'Perlink アカウントのメールアドレスから {email} 宛てに、領収書メールに記載された注文番号を添えてメールでご連絡ください（ベトナムでの銀行振込の場合は、**プラン → 支払い履歴** に表示される「PL」で始まる支払いコードを添えてください）。',
            '2 営業日以内にご返信いたします。',
            'オンラインでお支払いいただいたご注文は、当社の再販業者兼販売事業者（Merchant of Record）である **Creem** を通じて、元のお支払い方法に返金されます。銀行の明細に反映されるまで 5～10 営業日かかる場合があります。ベトナムでの銀行振込は、5 営業日以内に銀行振込で返金いたします。',
          ] },
        ],
      },
    ],
  },
  ko: {
    title: '환불 정책',
    description: 'Perlink 유료 요금제의 환불 방식: 7일 환불 보장.',
    intro: 'Perlink를 무료로 사용해 보고 확신이 들 때만 결제하세요. 맞지 않으면 7일 이내에 환불받을 수 있습니다. 이 번역본은 편의를 위해 제공되며, 영문본이 우선합니다.',
    summary: [
      { icon: 'i-lucide-badge-check', title: '7일 환불 보장', text: '모든 결제는 결제 후 7일 이내라면 이유를 묻지 않고 전액 환불합니다.' },
      { icon: 'i-lucide-repeat', title: '언제든 해지', text: '구독은 언제든 중단할 수 있으며, 이후 다시 청구되지 않습니다.' },
      { icon: 'i-lucide-clock', title: '신속한 처리', text: '영업일 기준 2일 이내에 답변합니다.' },
    ],
    sections: [
      {
        id: 'try',
        title: '결제 전에 먼저 사용해 보세요',
        blocks: ['Perlink는 기간 제한 없는 무료 요금제를 제공하며, 모든 계정은 결제 정보 없이 Plus 요금제를 7일간 무료로 체험할 수 있습니다. 유료 구독은 언제든 해지할 수 있으며, 해지 후에는 다시 청구되지 않습니다.'],
      },
      {
        id: 'guarantee',
        title: '7일 환불 보장',
        blocks: ['유료 요금제가 맞지 않는 경우, 결제(최초 결제 또는 갱신 결제) 후 7일 이내에 환불을 요청하시면 전액 환불해 드립니다. 환불이 완료되면 계정은 무료 요금제로 전환됩니다.', '프리미엄 3D 룸 팩도 마찬가지입니다. 구매 후 7일 이내라면 전액 환불해 드리며, 해당 팩은 계정에서 삭제됩니다.'],
      },
      {
        id: 'after',
        title: '7일 이후',
        blocks: [
          '7일이 지난 결제는 환불되지 않지만, 요금제는 결제한 기간이 끝날 때까지 계속 유지됩니다.',
          { note: '예외: 서비스가 설명대로 작동하지 않은 경우(예: 장시간 장애) 또는 중복 결제나 착오로 결제된 경우에는 알려 주시면 환불해 드립니다.' },
        ],
      },
      {
        id: 'not-refunded',
        title: '환불되지 않는 경우',
        blocks: [
          { list: [
            '[이용약관](/terms#acceptable-use) 위반으로 삭제된 계정 또는 사이트',
            '도메인 등록 기관에서 구매한 도메인 이름 등 제3자 비용',
          ] },
        ],
      },
      {
        id: 'how',
        title: '환불 요청 방법',
        blocks: [
          { list: [
            'Perlink 계정의 이메일 주소로 {email}에 이메일을 보내 주시고, 영수증 이메일에 있는 주문 번호를 함께 알려 주십시오(베트남에서 계좌 이체로 결제한 경우 **요금제 → 결제 내역**에 표시된 "PL"로 시작하는 결제 코드).',
            '영업일 기준 2일 이내에 답변합니다.',
            '온라인으로 결제한 주문은 당사의 리셀러이자 판매 기록 주체(Merchant of Record)인 **Creem**을 통해 원래 결제 수단으로 환불됩니다. 은행에 반영되기까지 영업일 기준 5~10일이 걸릴 수 있습니다. 베트남에서의 계좌 이체 결제는 영업일 기준 5일 이내에 계좌 이체로 환불됩니다.',
          ] },
        ],
      },
    ],
  },
}
