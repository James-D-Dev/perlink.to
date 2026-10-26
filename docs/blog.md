# Blog

Each site can have a blog: posts written in the site editor's **Blog** tab,
read at `perlink.to/<site>/blog` (list) and `/blog/<slug>` (post), in the
site's own look (background, fonts, cards) and language.

## Writing

- Blog tab (`SiteBlogPosts.vue`): the site's posts, drafts and published,
  with the plan usage; **Write a post** opens
  `/dashboard/site/<site>/blog/<id>`.
- Editor page: cover image, title and body (Nuxt UI `UEditor`, Tiptap),
  saved as you type (1.2 s after the last change). Toolbar: H2/H3, bold,
  italic, underline, strike, link (own dialog), lists, quote, code,
  divider, image upload (same storage as albums), undo/redo. Post settings:
  address (slug) and summary. **Publish** / **Unpublish**.
- The address comes from the title (Vietnamese marks removed) until the
  post is published or the owner sets one.

## Storage and rendering

- Table `posts` (migration 0031). The body is the Tiptap document (JSON).
- `shared/postContent.ts` turns it into HTML for the post page, RSS and
  search engines: only the nodes and marks the editor makes, all text
  escaped, links limited to http(s)/mailto/tel and images to https, so the
  HTML is safe to show. It also gives the plain text (summary, reading time
  at ~220 words a minute) and slugs.

## Public side

- `GET /api/bio/<site>/posts` (list, `?limit=`) and
  `/api/bio/<site>/posts/<slug>` (one post as HTML, plus the newer / older
  ones). Both include what the pages need of the site (name, picture,
  theme, badge), so they don't count as site views.
- SEO: title, description (summary), cover as the share image, canonical
  URL, `BlogPosting` structured data. Sitemap lists blogs and posts; RSS at
  `/<site>/blog/rss.xml`.
- "Latest posts" block (`BioBlogDisplay.vue`, block `blog`): the newest 3,
  5 or 10 posts on the site's page, linking to the blog.
- On a custom domain, `/blog` goes to the site's blog on perlink.to.

## Plans

Published posts per account (all its sites): Free 50, Starter 100, Plus and
Pro unlimited (`PLAN_LIMITS[plan].posts`). Publishing past the limit shows
the upgrade prompt.

## In the 3D room

The **Blog board** (catalog `blog-board`, Wall category, `opensBlog`) is a
cork board with "BLOG" on it: hovering shows "Blog", clicking opens
`/<site>/blog`, and a "Blog" chip appears under the room.

## Template

**Personal blog** (`blog`, Personal category): an intro, the latest 5 posts,
socials, and a reading-nook room with the blog board on the wall.
