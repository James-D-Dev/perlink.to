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
        blocks: ['If a paid plan isn’t right for you, ask for a refund within 7 days of the payment (the first payment or a renewal) and we will refund it in full. Your account returns to the free plan when the refund is made.'],
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
            'Orders paid online are refunded through our reseller and Merchant of Record, **Lemon Squeezy**, to the original payment method; your bank may take 5–10 business days to show it. Bank transfers in Vietnam are refunded by bank transfer within 5 business days.',
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
        blocks: ['Nếu gói trả phí chưa phù hợp, hãy yêu cầu hoàn tiền trong vòng 7 ngày kể từ lúc thanh toán (lần đầu hoặc lần gia hạn), chúng tôi hoàn lại toàn bộ. Tài khoản sẽ về gói Miễn phí khi hoàn tiền xong.'],
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
            'Đơn thanh toán trực tuyến được hoàn qua đại lý bán lại và đơn vị bán hàng chính thức **Lemon Squeezy**, về phương thức thanh toán ban đầu; ngân hàng có thể mất 5–10 ngày làm việc để hiển thị. Chuyển khoản tại Việt Nam được hoàn bằng chuyển khoản trong 5 ngày làm việc.',
          ] },
        ],
      },
    ],
  },
}
