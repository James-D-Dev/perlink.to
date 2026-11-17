import type { H3Event } from 'h3'
import { escapeHtml, runInBackground, sendEmail } from './email'
import { LANGUAGE_COOKIE, toAppLanguage, type AppLanguage } from '#shared/language'

// Welcome email for a new account, from support@perlink.to so a reply lands
// in Superadmin → Emails → Inbox. Vietnamese when the dashboard language
// cookie, the browser or the country says so; English otherwise.

const COPY = {
  en: {
    subject: 'Welcome to Perlink 👋',
    hi: (name: string) => (name ? `Hi ${name},` : 'Hi there,'),
    intro: 'Thanks for joining Perlink. Here’s how to get your first site live:',
    steps: [
      'Create a site and add your links, photos and contact buttons, or start from a theme.',
      'Make it yours: colours, a 3D room, a password or an opening time.',
      'Publish and share your link in your bio, on a QR code or in messages.',
    ],
    cta: 'Open your dashboard',
    help: 'Questions or ideas? Just reply to this email. It comes straight to us.',
    signoff: 'Perlink team',
    footer: 'You get this email because you just created a Perlink account.',
  },
  vi: {
    subject: 'Chào mừng bạn đến với Perlink 👋',
    hi: (name: string) => (name ? `Chào ${name},` : 'Chào bạn,'),
    intro: 'Cảm ơn bạn đã tham gia Perlink. Ba bước để trang đầu tiên của bạn lên sóng:',
    steps: [
      'Tạo trang và thêm liên kết, hình ảnh, nút liên hệ, hoặc bắt đầu từ một theme có sẵn.',
      'Tuỳ chỉnh theo phong cách của bạn: màu sắc, phòng 3D, mật khẩu hoặc giờ mở trang.',
      'Xuất bản và chia sẻ link ở bio, qua mã QR hoặc tin nhắn.',
    ],
    cta: 'Mở trang quản lý',
    help: 'Có câu hỏi hay góp ý? Bạn chỉ cần trả lời email này, thư sẽ đến thẳng đội ngũ Perlink.',
    signoff: 'Đội ngũ Perlink',
    footer: 'Bạn nhận email này vì vừa tạo tài khoản Perlink.',
  },
}

export function signupLanguage(event: H3Event): AppLanguage {
  const cookie = getCookie(event, LANGUAGE_COOKIE)
  if (cookie) return toAppLanguage(cookie)
  if (/^vi\b/i.test(getHeader(event, 'accept-language') || '')) return 'vi'
  if (getHeader(event, 'cf-ipcountry') === 'VN') return 'vi'
  return 'en'
}

/** Sends the welcome email after the response (never holds up sign-in) */
export function sendWelcomeEmail(event: H3Event, profile: { email?: string | null; name?: string | null }, language?: AppLanguage) {
  if (!profile.email) return
  const copy = COPY[language ?? signupLanguage(event)]
  const name = (profile.name || '').trim().split(/\s+/)[0] || ''
  const dashboardUrl = 'https://perlink.to/dashboard'

  const html = `<div style="font-family:Inter,Helvetica,Arial,sans-serif;color:#0c0b0a;max-width:520px;margin:0 auto;padding:24px;font-size:15px;line-height:1.6">
<p style="margin:0 0 14px">${escapeHtml(copy.hi(name))}</p>
<p style="margin:0 0 8px">${escapeHtml(copy.intro)}</p>
<ol style="margin:0 0 24px;padding-left:20px">${copy.steps.map(step => `<li style="margin:0 0 6px">${escapeHtml(step)}</li>`).join('')}</ol>
<p style="margin:0 0 28px"><a href="${dashboardUrl}" style="background:#0c0b0a;color:#fdfcfb;text-decoration:none;padding:11px 20px;border-radius:999px;font-size:14px">${escapeHtml(copy.cta)}</a></p>
<p style="margin:0 0 14px">${escapeHtml(copy.help)}</p>
<p style="margin:0 0 28px">${escapeHtml(copy.signoff)}</p>
<p style="font-size:12px;color:#9b948c;margin:0">${escapeHtml(copy.footer)}</p></div>`
  const text = [
    copy.hi(name),
    '',
    copy.intro,
    ...copy.steps.map((step, i) => `${i + 1}. ${step}`),
    '',
    `${copy.cta}: ${dashboardUrl}`,
    '',
    copy.help,
    '',
    copy.signoff,
  ].join('\n')

  runInBackground(event, sendEmail(event, {
    from: 'Perlink <support@perlink.to>',
    to: profile.email,
    subject: copy.subject,
    html,
    text,
    replyTo: 'support@perlink.to',
  }).catch(error => console.error('[welcome] not sent', error)))
}
