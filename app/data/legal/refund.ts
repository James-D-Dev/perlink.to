import type { LegalDocs } from './types'

export const REFUND: LegalDocs = {
  en: {
    title: 'Refund Policy',
    description: 'How refunds work for Perlink paid plans: a 7-day money-back guarantee.',
    intro: 'Try Perlink free, pay only when you’re sure, and get your money back within 7 days if it isn’t right for you.',
    summary: [
      { icon: 'i-lucide-badge-check', title: '7-day money back', text: 'Full refund within 7 days of any payment, no questions.' },
      { icon: 'i-lucide-repeat', title: 'No surprise charges', text: 'Plans never renew or charge you on their own.' },
      { icon: 'i-lucide-clock', title: 'Fast', text: 'Reply within 2 business days, money back within 5.' },
    ],
    sections: [
      {
        id: 'try',
        title: 'Try before you pay',
        blocks: ['Perlink has a free plan with no time limit, and every account can try the Plus plan free for 7 days. Paid plans never renew or charge you automatically.'],
      },
      {
        id: 'guarantee',
        title: '7-day money-back guarantee',
        blocks: ['If a paid plan isn’t right for you, ask for a refund within 7 days of the payment and we will refund it in full. Your account returns to the free plan when the refund is made.'],
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
            'Email {email} from the address of your Perlink account.',
            'Include the payment code from **Plans → Payment history** (it starts with "PL").',
            'We reply within 2 business days and send the money back by bank transfer to the account it came from within 5 business days of approving it.',
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
      { icon: 'i-lucide-repeat', title: 'Không tự trừ tiền', text: 'Gói không bao giờ tự gia hạn hay tự thu tiền.' },
      { icon: 'i-lucide-clock', title: 'Nhanh chóng', text: 'Phản hồi trong 2 ngày làm việc, hoàn tiền trong 5 ngày.' },
    ],
    sections: [
      {
        id: 'try',
        title: 'Dùng thử trước khi trả tiền',
        blocks: ['Perlink có gói Miễn phí không giới hạn thời gian, và mỗi tài khoản được dùng thử gói Plus miễn phí 7 ngày. Gói trả phí không bao giờ tự gia hạn hay tự trừ tiền.'],
      },
      {
        id: 'guarantee',
        title: 'Cam kết hoàn tiền trong 7 ngày',
        blocks: ['Nếu gói trả phí chưa phù hợp, hãy yêu cầu hoàn tiền trong vòng 7 ngày kể từ lúc thanh toán, chúng tôi hoàn lại toàn bộ. Tài khoản sẽ về gói Miễn phí khi hoàn tiền xong.'],
      },
      {
        id: 'after',
        title: 'Sau 7 ngày',
        blocks: [
          'Sau 7 ngày, khoản thanh toán không được hoàn lại, nhưng gói vẫn dùng được đến hết kỳ bạn đã trả.',
          { note: 'Ngoại lệ: nếu Dịch vụ không hoạt động như mô tả (ví dụ gián đoạn kéo dài), hoặc bạn chuyển khoản trùng hay nhầm, hãy báo cho chúng tôi để được hoàn tiền.' },
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
            'Gửi email tới {email} từ địa chỉ email của tài khoản Perlink.',
            'Ghi kèm mã thanh toán trong **Gói dịch vụ → Lịch sử thanh toán** (bắt đầu bằng "PL").',
            'Chúng tôi phản hồi trong 2 ngày làm việc và chuyển khoản hoàn tiền về tài khoản đã thanh toán trong 5 ngày làm việc sau khi duyệt.',
          ] },
        ],
      },
    ],
  },
}
