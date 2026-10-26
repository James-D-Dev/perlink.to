// Blog post bodies are Tiptap documents (JSON). This turns one into HTML for
// the public page, RSS and search engines. Only the nodes and marks the
// editor makes are drawn; everything else is dropped, all text is escaped,
// and links / images only keep safe addresses, so the HTML is safe to show.

export interface PostNode {
  type: string
  text?: string
  attrs?: Record<string, unknown>
  marks?: { type: string; attrs?: Record<string, unknown> }[]
  content?: PostNode[]
}

export const EMPTY_DOC: PostNode = { type: 'doc', content: [] }

const escape = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')

/** http(s), mailto and tel links only */
export function safeHref(value: unknown) {
  const href = String(value ?? '').trim()
  return /^(https?:\/\/|mailto:|tel:)/i.test(href) ? href : null
}

/** https images only (and our own /api/media proxy) */
const safeSrc = (value: unknown) => {
  const src = String(value ?? '').trim()
  return /^(https:\/\/|\/api\/media\/)/i.test(src) ? src : null
}

function renderText(node: PostNode) {
  let html = escape(node.text ?? '')
  for (const mark of node.marks ?? []) {
    if (mark.type === 'bold') html = `<strong>${html}</strong>`
    else if (mark.type === 'italic') html = `<em>${html}</em>`
    else if (mark.type === 'underline') html = `<u>${html}</u>`
    else if (mark.type === 'strike') html = `<s>${html}</s>`
    else if (mark.type === 'code') html = `<code>${html}</code>`
    else if (mark.type === 'link') {
      const href = safeHref(mark.attrs?.href)
      if (href) html = `<a href="${escape(href)}" target="_blank" rel="noopener nofollow ugc">${html}</a>`
    }
  }
  return html
}

function renderNode(node: PostNode): string {
  const inner = () => (node.content ?? []).map(renderNode).join('')
  switch (node.type) {
    case 'doc': return inner()
    case 'text': return renderText(node)
    case 'paragraph': return `<p>${inner()}</p>`
    case 'heading': {
      const level = Math.min(Math.max(Number(node.attrs?.level) || 2, 2), 4)
      return `<h${level}>${inner()}</h${level}>`
    }
    case 'bulletList': return `<ul>${inner()}</ul>`
    case 'orderedList': return `<ol>${inner()}</ol>`
    case 'listItem': return `<li>${inner()}</li>`
    case 'blockquote': return `<blockquote>${inner()}</blockquote>`
    case 'codeBlock': return `<pre><code>${(node.content ?? []).map(n => escape(n.text ?? '')).join('')}</code></pre>`
    case 'horizontalRule': return '<hr>'
    case 'hardBreak': return '<br>'
    case 'image': {
      const src = safeSrc(node.attrs?.src)
      if (!src) return ''
      const alt = escape(String(node.attrs?.alt ?? ''))
      return `<figure><img src="${escape(src)}" alt="${alt}" loading="lazy" decoding="async"></figure>`
    }
    default: return ''
  }
}

export function parsePostDoc(value: unknown): PostNode {
  try {
    const doc = typeof value === 'string' ? JSON.parse(value) : value
    return doc && typeof doc === 'object' && (doc as PostNode).type === 'doc' ? (doc as PostNode) : EMPTY_DOC
  } catch {
    return EMPTY_DOC
  }
}

export const renderPostHtml = (doc: PostNode) => renderNode(doc)

/** All the words, for the excerpt and the reading time */
export function postText(node: PostNode): string {
  if (node.type === 'text') return node.text ?? ''
  const parts = (node.content ?? []).map(postText)
  return ['paragraph', 'heading', 'listItem', 'blockquote', 'codeBlock'].includes(node.type) ? `${parts.join('')}\n` : parts.join('')
}

/** About 220 words a minute, at least one */
export const readingMinutes = (text: string) => Math.max(1, Math.round(text.split(/\s+/).filter(Boolean).length / 220))

/** The first ~160 characters, cut at a word */
export function autoExcerpt(text: string, max = 160) {
  const clean = text.replace(/\s+/g, ' ').trim()
  if (clean.length <= max) return clean
  return `${clean.slice(0, max).replace(/\s+\S*$/, '')}…`
}

/** "Món ngon Hà Nội!" → "mon-ngon-ha-noi" */
export function slugify(value: string) {
  return value
    .normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'post'
}
