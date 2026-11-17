import type { H3Event } from 'h3'
import { getDB } from './db'
import { escapeHtml } from './email'
import type { AppLanguage } from '#shared/language'

// Perlink's email templates: one branded layout (logo, white card, button,
// footer) and the words of each email, in English and Vietnamese. The words
// and the layout's colour/footer can be changed in Superadmin → Email
// templates; changes are kept in app_settings ("email_template:<id>",
// "email_layout") over the defaults here.
//
// Words are plain text with {{variables}}: a blank line starts a paragraph,
// lines starting "- " or "1. " make a list, **text** is bold.

export interface TemplateWords {
  subject: string
  /** Big title in the card (optional) */
  heading: string
  body: string
  /** Button label (the link is set by the email) */
  button: string
  /** Small print under the button */
  note: string
}

export interface TemplateDef {
  id: string
  name: string
  description: string
  /** Who gets it */
  audience: 'user' | 'site owner' | 'admin'
  /** Variables and a sample value, for the editor and previews */
  variables: Record<string, string>
  /** The button's link for previews (each email sets its own) */
  sampleUrl?: string
  /** Sample details table, for previews of emails that have one */
  sampleRows?: [string, string][]
  defaults: Record<AppLanguage, TemplateWords>
}

export const EMAIL_TEMPLATES: TemplateDef[] = [
  {
    id: 'welcome',
    name: 'Welcome',
    description: 'Sent once when someone creates an account (Google, Facebook, TikTok).',
    audience: 'user',
    variables: { name: 'Linh' },
    sampleUrl: 'https://perlink.to/dashboard',
    defaults: {
      en: {
        subject: 'Welcome to Perlink 👋',
        heading: 'Welcome to Perlink',
        body: 'Hi {{name}},\n\nThanks for joining Perlink. Here’s how to get your first site live:\n\n1. Create a site and add your links, photos and contact buttons, or start from a theme.\n2. Make it yours: colours, a 3D room, a password or an opening time.\n3. Publish and share your link in your bio, on a QR code or in messages.',
        button: 'Open your dashboard',
        note: 'Questions or ideas? Just reply to this email. It comes straight to us.',
      },
      vi: {
        subject: 'Chào mừng bạn đến với Perlink 👋',
        heading: 'Chào mừng bạn đến với Perlink',
        body: 'Chào {{name}},\n\nCảm ơn bạn đã tham gia Perlink. Ba bước để trang đầu tiên của bạn lên sóng:\n\n1. Tạo trang và thêm liên kết, hình ảnh, nút liên hệ, hoặc bắt đầu từ một theme có sẵn.\n2. Tuỳ chỉnh theo phong cách của bạn: màu sắc, phòng 3D, mật khẩu hoặc giờ mở trang.\n3. Xuất bản và chia sẻ link ở bio, qua mã QR hoặc tin nhắn.',
        button: 'Mở trang quản lý',
        note: 'Có câu hỏi hay góp ý? Bạn chỉ cần trả lời email này, thư sẽ đến thẳng đội ngũ Perlink.',
      },
    },
  },
  {
    id: 'form_request',
    name: 'New request',
    description: 'To a site owner when a visitor sends their contact or booking form.',
    audience: 'site owner',
    variables: { site: 'linh.studio', name: 'Minh Anh' },
    sampleUrl: 'https://perlink.to/dashboard',
    sampleRows: [['Name', 'Minh Anh'], ['Phone', '0901 234 567'], ['Date', '2026-12-24'], ['Message', 'Hi, is this date still free?']],
    defaults: {
      en: {
        subject: 'New request from {{name}} · perlink.to/{{site}}',
        heading: 'New request',
        body: 'Someone sent a request through your site **perlink.to/{{site}}**.',
        button: 'Open your inbox',
        note: 'You get this email because your Perlink site has a form. Reply to answer the visitor directly.',
      },
      vi: {
        subject: 'Yêu cầu mới từ {{name}} · perlink.to/{{site}}',
        heading: 'Yêu cầu mới',
        body: 'Có khách vừa gửi yêu cầu qua trang **perlink.to/{{site}}** của bạn.',
        button: 'Mở Hộp thư',
        note: 'Bạn nhận email này vì trang Perlink của bạn có form. Trả lời email để liên hệ trực tiếp với khách.',
      },
    },
  },
  {
    id: 'form_order',
    name: 'New order',
    description: 'To a site owner when a visitor places an order in their shop.',
    audience: 'site owner',
    variables: { site: 'linh.studio', code: 'A1B2C3', name: 'Minh Anh' },
    sampleUrl: 'https://perlink.to/dashboard',
    sampleRows: [['Order', 'A1B2C3'], ['Product', 'Handmade candle'], ['Quantity', '2'], ['Total', '240.000 ₫'], ['Payment', 'Bank transfer'], ['Name', 'Minh Anh'], ['Address', '12 Lê Lợi, Q.1']],
    defaults: {
      en: {
        subject: 'New order {{code}} · perlink.to/{{site}}',
        heading: 'New order {{code}}',
        body: 'You have a new order on **perlink.to/{{site}}**.',
        button: 'Open your inbox',
        note: 'You get this email because your Perlink site has a shop.',
      },
      vi: {
        subject: 'Đơn hàng mới {{code}} · perlink.to/{{site}}',
        heading: 'Đơn hàng mới {{code}}',
        body: 'Bạn có đơn hàng mới trên trang **perlink.to/{{site}}**.',
        button: 'Mở Hộp thư',
        note: 'Bạn nhận email này vì trang Perlink của bạn có cửa hàng.',
      },
    },
  },
  {
    id: 'form_rsvp',
    name: 'Invitation reply (RSVP)',
    description: 'To a site owner when a guest answers their invitation.',
    audience: 'site owner',
    variables: { site: 'an-va-binh', name: 'Minh Anh' },
    sampleUrl: 'https://perlink.to/dashboard',
    sampleRows: [['Name', 'Minh Anh'], ['Coming', 'Yes'], ['Guests', '2'], ['Message', 'Congratulations!']],
    defaults: {
      en: {
        subject: '{{name}} replied to your invitation · perlink.to/{{site}}',
        heading: '{{name}} replied',
        body: 'A guest answered your invitation on **perlink.to/{{site}}**.',
        button: 'See all replies',
        note: 'You get this email because your Perlink invitation collects replies.',
      },
      vi: {
        subject: '{{name}} đã trả lời thiệp mời · perlink.to/{{site}}',
        heading: '{{name}} đã trả lời',
        body: 'Một khách mời vừa trả lời thiệp trên trang **perlink.to/{{site}}**.',
        button: 'Xem tất cả phản hồi',
        note: 'Bạn nhận email này vì thiệp mời Perlink của bạn đang nhận phản hồi.',
      },
    },
  },
  {
    id: 'form_answer',
    name: 'Proposal answer',
    description: 'To a site owner when someone says yes on their proposal page.',
    audience: 'site owner',
    variables: { site: 'will-you' },
    sampleUrl: 'https://perlink.to/dashboard',
    sampleRows: [['Message', 'Yes, of course! ❤️']],
    defaults: {
      en: {
        subject: '💘 Someone said yes · perlink.to/{{site}}',
        heading: '💘 They said yes',
        body: 'Someone just answered on **perlink.to/{{site}}**.',
        button: 'Open your inbox',
        note: 'You get this email because your Perlink page has a question.',
      },
      vi: {
        subject: '💘 Người ấy đã đồng ý · perlink.to/{{site}}',
        heading: '💘 Người ấy đã đồng ý',
        body: 'Có người vừa trả lời trên trang **perlink.to/{{site}}**.',
        button: 'Mở Hộp thư',
        note: 'Bạn nhận email này vì trang Perlink của bạn có câu hỏi.',
      },
    },
  },
  {
    id: 'report',
    name: 'Site reported',
    description: 'To the admin when a visitor reports a site.',
    audience: 'admin',
    variables: { site: 'some-site', reason: 'spam' },
    sampleUrl: 'https://perlink.to/superadmin/reports',
    sampleRows: [['Site', 'perlink.to/some-site'], ['Reason', 'spam'], ['Details', 'Sends people to a fake shop']],
    defaults: {
      en: {
        subject: 'Report: perlink.to/{{site}} ({{reason}})',
        heading: 'A site was reported',
        body: 'A visitor reported **perlink.to/{{site}}** for **{{reason}}**.',
        button: 'Review reports',
        note: 'Reply to write to the visitor, when they left an email.',
      },
      vi: {
        subject: 'Báo cáo: perlink.to/{{site}} ({{reason}})',
        heading: 'Có trang bị báo cáo',
        body: 'Một khách đã báo cáo trang **perlink.to/{{site}}** vì **{{reason}}**.',
        button: 'Xem báo cáo',
        note: 'Trả lời email để liên hệ người báo cáo, nếu họ để lại email.',
      },
    },
  },
]

export interface EmailLayout {
  /** Button and accent colour */
  accent: string
  /** Line above the address in the footer */
  footer: Record<AppLanguage, string>
}

export const DEFAULT_LAYOUT: EmailLayout = {
  accent: '#0066d6',
  footer: {
    en: 'Perlink: personal websites and 3D worlds.',
    vi: 'Perlink: website cá nhân và thế giới 3D.',
  },
}

const templateKey = (id: string) => `email_template:${id}`
const LAYOUT_KEY = 'email_layout'

async function readSetting<T>(event: H3Event, key: string): Promise<Partial<T> | null> {
  try {
    const row = await getDB(event).prepare('SELECT value FROM app_settings WHERE key = ?').bind(key).first<{ value: string }>()
    return row ? JSON.parse(row.value) : null
  } catch {
    return null
  }
}

async function writeSetting(event: H3Event, key: string, value: unknown | null) {
  const db = getDB(event)
  if (value === null) {
    await db.prepare('DELETE FROM app_settings WHERE key = ?').bind(key).run()
    return
  }
  await db
    .prepare(`INSERT INTO app_settings (key, value, updated_at) VALUES (?, ?, datetime('now')) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`)
    .bind(key, JSON.stringify(value))
    .run()
}

export const templateDef = (id: string) => EMAIL_TEMPLATES.find(t => t.id === id)

/** The saved words of a template (only what was changed), by language */
export const getTemplateOverrides = (event: H3Event, id: string) =>
  readSetting<Record<AppLanguage, Partial<TemplateWords>>>(event, templateKey(id))

export const saveTemplateOverrides = (event: H3Event, id: string, value: Partial<Record<AppLanguage, Partial<TemplateWords>>> | null) =>
  writeSetting(event, templateKey(id), value)

export async function getTemplateWords(event: H3Event, id: string, lang: AppLanguage): Promise<TemplateWords> {
  const def = templateDef(id)
  if (!def) throw new Error(`Unknown email template ${id}`)
  const saved = (await getTemplateOverrides(event, id))?.[lang] ?? {}
  return { ...def.defaults[lang], ...saved }
}

export async function getLayout(event: H3Event): Promise<EmailLayout> {
  const saved = await readSetting<EmailLayout>(event, LAYOUT_KEY)
  return {
    accent: isColour(saved?.accent) ? saved!.accent! : DEFAULT_LAYOUT.accent,
    footer: { ...DEFAULT_LAYOUT.footer, ...(saved?.footer ?? {}) },
  }
}

export const saveLayout = (event: H3Event, value: EmailLayout | null) => writeSetting(event, LAYOUT_KEY, value)

export const isColour = (value: unknown): value is string => typeof value === 'string' && /^#[0-9a-f]{6}$/i.test(value)

/** {{variable}} → its value (the raw text; escaping happens when rendering) */
export const fill = (text: string, vars: Record<string, string>) =>
  text.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key: string) => vars[key] ?? '')

/** Plain text with paragraphs, lists and **bold** → email HTML */
export function textToHtml(text: string, opts: { color?: string } = {}) {
  const color = opts.color ?? '#3a3631'
  const inline = (line: string) => escapeHtml(line)
    .replace(/\*\*(.+?)\*\*/g, '<strong style="color:#0c0b0a;font-weight:600">$1</strong>')
    .replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" style="color:#0066d6">$1</a>')
  return text.trim().split(/\n{2,}/).map((block) => {
    const lines = block.split('\n')
    if (lines.every(line => /^\s*\d+[.)]\s+/.test(line))) {
      return `<ol style="margin:0 0 16px;padding-left:22px;color:${color}">${lines.map(line => `<li style="margin:0 0 8px;padding-left:4px">${inline(line.replace(/^\s*\d+[.)]\s+/, ''))}</li>`).join('')}</ol>`
    }
    if (lines.every(line => /^\s*[-•]\s+/.test(line))) {
      return `<ul style="margin:0 0 16px;padding-left:22px;color:${color}">${lines.map(line => `<li style="margin:0 0 8px;padding-left:4px">${inline(line.replace(/^\s*[-•]\s+/, ''))}</li>`).join('')}</ul>`
    }
    return `<p style="margin:0 0 16px;color:${color}">${lines.map(inline).join('<br>')}</p>`
  }).join('')
}

/** Plain-text version of the same words (bold marks removed) */
const textOnly = (text: string) => text.replace(/\*\*(.+?)\*\*/g, '$1').trim()

/** A label/value table (form details, an order) in the card */
export function detailsTable(rows: [string, string][]) {
  if (!rows.length) return ''
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:4px 0 24px;border-collapse:collapse;background:#f8f6f3;border-radius:14px">
${rows.map(([label, value], i) => `<tr><td style="padding:12px 16px;${i ? 'border-top:1px solid #ece8e2;' : ''}color:#6b655e;font-size:14px;width:120px;vertical-align:top">${escapeHtml(label)}</td><td style="padding:12px 16px;${i ? 'border-top:1px solid #ece8e2;' : ''}color:#0c0b0a;font-size:14px;white-space:pre-line;word-break:break-word">${escapeHtml(value)}</td></tr>`).join('\n')}
</table>`
}

const FONT = `-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,Roboto,Helvetica,Arial,sans-serif`

/** The branded email around some content */
export function renderLayout(opts: {
  layout: EmailLayout
  lang: AppLanguage
  title: string
  /** Inbox preview line */
  preheader?: string
  heading?: string
  bodyHtml: string
  button?: { label: string; url: string }
  note?: string
}) {
  const { layout, lang } = opts
  const accent = layout.accent
  const button = opts.button?.label && opts.button.url
    ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 24px"><tr><td style="border-radius:999px;background:${accent}">
<a href="${escapeHtml(opts.button.url)}" style="display:inline-block;padding:13px 26px;font-family:${FONT};font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:999px">${escapeHtml(opts.button.label)}</a>
</td></tr></table>`
    : ''
  return `<!doctype html>
<html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light only"><meta name="supported-color-schemes" content="light"><title>${escapeHtml(opts.title)}</title></head>
<body style="margin:0;padding:0;background:#f3f1ee;-webkit-text-size-adjust:100%">
${opts.preheader ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent">${escapeHtml(opts.preheader)}</div>` : ''}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f1ee"><tr><td align="center" style="padding:32px 16px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px">
<tr><td style="padding:0 4px 20px">
<a href="https://perlink.to" style="text-decoration:none"><img src="https://perlink.to/web-app-manifest-192x192.png" width="32" height="32" alt="" style="display:inline-block;vertical-align:middle;border:0;border-radius:8px"><span style="display:inline-block;vertical-align:middle;margin-left:10px;font-family:${FONT};font-size:21px;font-weight:700;letter-spacing:-0.03em;color:#0c0b0a"><span style="color:${accent}">per</span>link</span></a>
</td></tr>
<tr><td style="background:#ffffff;border:1px solid #e8e4de;border-radius:20px;padding:36px 32px;font-family:${FONT};font-size:15px;line-height:1.6;color:#3a3631">
${opts.heading ? `<h1 style="margin:0 0 18px;font-family:${FONT};font-size:23px;line-height:1.3;font-weight:700;letter-spacing:-0.02em;color:#0c0b0a">${escapeHtml(opts.heading)}</h1>` : ''}
${opts.bodyHtml}
${button}
${opts.note ? `<p style="margin:8px 0 0;padding-top:18px;border-top:1px solid #efebe6;font-size:13px;line-height:1.55;color:#8a837b">${escapeHtml(opts.note)}</p>` : ''}
</td></tr>
<tr><td style="padding:22px 8px 0;text-align:center;font-family:${FONT};font-size:12px;line-height:1.6;color:#9b948c">
${escapeHtml(layout.footer[lang])}<br>
<a href="https://perlink.to" style="color:#9b948c;text-decoration:underline">perlink.to</a> · <a href="mailto:support@perlink.to" style="color:#9b948c;text-decoration:underline">support@perlink.to</a>
</td></tr>
</table>
</td></tr></table>
</body></html>`
}

/** Subject, HTML and text of a template, with its saved words and the layout */
export async function renderTemplate(event: H3Event, id: string, lang: AppLanguage, opts: {
  vars: Record<string, string>
  buttonUrl?: string
  rows?: [string, string][]
  /** Words to use instead of the saved ones (the editor's preview) */
  words?: Partial<TemplateWords>
  layout?: EmailLayout
}) {
  const words = { ...(await getTemplateWords(event, id, lang)), ...(opts.words ?? {}) }
  const layout = opts.layout ?? await getLayout(event)
  const subject = fill(words.subject, opts.vars).trim()
  const heading = fill(words.heading, opts.vars).trim()
  const body = fill(words.body, opts.vars)
  const note = fill(words.note, opts.vars).trim()
  const buttonLabel = fill(words.button, opts.vars).trim()
  const rows = opts.rows ?? []

  const html = renderLayout({
    layout,
    lang,
    title: subject,
    preheader: textOnly(body).split('\n').find(Boolean)?.slice(0, 140),
    heading: heading || undefined,
    bodyHtml: textToHtml(body) + detailsTable(rows),
    button: opts.buttonUrl && buttonLabel ? { label: buttonLabel, url: opts.buttonUrl } : undefined,
    note: note || undefined,
  })
  const text = [
    heading,
    textOnly(body),
    rows.map(([label, value]) => `${label}: ${value}`).join('\n'),
    opts.buttonUrl && buttonLabel ? `${buttonLabel}: ${opts.buttonUrl}` : '',
    note,
  ].filter(Boolean).join('\n\n')
  return { subject, html, text }
}
