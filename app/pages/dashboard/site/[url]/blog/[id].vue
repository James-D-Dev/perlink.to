<template>
  <div class="min-h-screen bg-paper text-ink">
    <!-- Top bar: back, save status, post settings, publish -->
    <header class="sticky top-0 z-30 border-b border-line bg-paper/85 backdrop-blur-xl">
      <div class="mx-auto flex h-14 max-w-3xl items-center gap-2 px-3">
        <UButton icon="i-lucide-arrow-left" color="neutral" variant="ghost" :to="backTo" :aria-label="t('dashboard.blog.back')" />
        <span class="min-w-0 flex-1 truncate text-xs text-muted">
          <template v-if="saving">{{ t('dashboard.blog.saving') }}</template>
          <template v-else-if="saveError">{{ t('dashboard.blog.saveFailed') }}</template>
          <template v-else-if="post">{{ post.status === 'published' ? t('dashboard.blog.status.published') : t('dashboard.blog.savedDraft') }}</template>
        </span>
        <UPopover :content="{ align: 'end' }">
          <UButton icon="i-lucide-settings-2" color="neutral" variant="ghost" :aria-label="t('dashboard.blog.settings')" />
          <template #content>
            <div class="w-80 space-y-3 p-4">
              <div>
                <label class="mb-1 block text-xs font-medium text-muted" for="post-slug">{{ t('dashboard.blog.slug') }}</label>
                <UInput id="post-slug" v-model="slug" class="w-full" :placeholder="post?.slug" @blur="saveSlug" />
                <p class="mt-1 truncate text-[11px] text-muted">perlink.to/{{ username }}/blog/{{ slug || post?.slug }}</p>
              </div>
              <div>
                <label class="mb-1 block text-xs font-medium text-muted" for="post-excerpt">{{ t('dashboard.blog.excerpt') }}</label>
                <UTextarea id="post-excerpt" v-model="excerpt" :rows="3" maxlength="300" class="w-full" :placeholder="autoExcerptText || t('dashboard.blog.excerptHint')" @blur="queueSave" />
              </div>
              <UButton v-if="post?.status === 'published'" block color="neutral" variant="soft" icon="i-lucide-eye-off" :label="t('dashboard.blog.unpublish')" :loading="publishing" @click="setStatus('draft')" />
            </div>
          </template>
        </UPopover>
        <UButton
          v-if="post?.status === 'published'"
          color="neutral"
          variant="outline"
          icon="i-lucide-external-link"
          :to="`/${username}/blog/${post.slug}`"
          target="_blank"
          :aria-label="t('dashboard.blog.view')"
        />
        <UButton
          v-else
          icon="i-lucide-send"
          :label="t('dashboard.blog.publish')"
          :loading="publishing"
          :disabled="!post"
          @click="setStatus('published')"
        />
      </div>
    </header>

    <div v-if="!post" class="flex justify-center py-24">
      <UIcon name="i-lucide-loader-circle" class="size-6 animate-spin text-muted" />
    </div>

    <main v-else class="mx-auto max-w-3xl px-4 pb-32 pt-6">
      <!-- Cover -->
      <div v-if="coverUrl" class="group relative mb-6 overflow-hidden rounded-3xl">
        <img :src="coverUrl" alt="" class="aspect-[2/1] w-full object-cover">
        <div class="absolute right-3 top-3 flex gap-2 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100">
          <UButton size="sm" color="neutral" variant="outline" icon="i-lucide-image" :label="t('dashboard.blog.changeCover')" :loading="uploading === 'cover'" @click="pickImage('cover')" />
          <UButton size="sm" color="neutral" variant="outline" icon="i-lucide-x" :aria-label="t('dashboard.blog.removeCover')" @click="setCover(null)" />
        </div>
      </div>
      <UButton v-else class="mb-4" color="neutral" variant="ghost" icon="i-lucide-image-plus" :label="t('dashboard.blog.addCover')" :loading="uploading === 'cover'" @click="pickImage('cover')" />

      <!-- Title -->
      <textarea
        ref="titleEl"
        v-model="title"
        rows="1"
        maxlength="200"
        :placeholder="t('dashboard.blog.titlePlaceholder')"
        class="w-full resize-none border-0 bg-transparent p-0 text-3xl font-bold leading-tight tracking-tight text-ink outline-none placeholder:text-ink-faint sm:text-4xl"
        @input="fitTitle(); queueSave()"
      />

      <!-- Body -->
      <UEditor
        v-slot="{ editor }"
        v-model="content"
        content-type="json"
        :mention="false"
        :placeholder="t('dashboard.blog.bodyPlaceholder')"
        class="mt-4"
        :ui="{ base: 'blog-editor min-h-[50vh] text-[17px] leading-relaxed' }"
        @update:model-value="queueSave"
      >
        <div class="sticky top-14 z-20 -mx-2 mb-3 overflow-x-auto bg-paper/90 px-2 py-1.5 backdrop-blur [scrollbar-width:none]">
          <UEditorToolbar :editor="editor" :items="toolbar(editor)" />
        </div>
      </UEditor>
    </main>

    <input ref="fileInput" type="file" accept="image/jpeg,image/png,image/webp,image/gif" class="hidden" @change="onFile">

    <!-- Add a link to the selected words -->
    <AppSheet v-model:open="linkOpen" :title="t('dashboard.blog.linkTitle')" :ui="{ content: 'max-w-sm' }">
      <template #body>
        <form class="space-y-3" @submit.prevent="applyLink">
          <UInput v-model="linkUrl" type="url" placeholder="https://" class="w-full" autofocus />
          <div class="flex gap-2">
            <UButton type="button" color="neutral" variant="soft" :label="t('dashboard.blog.removeLink')" @click="linkUrl = ''; applyLink()" />
            <UButton type="submit" class="flex-1 justify-center" :label="t('dashboard.blog.addLink')" />
          </div>
        </form>
      </template>
    </AppSheet>
  </div>
</template>

<script setup lang="ts">
// The few editor methods used here (the editor is Tiptap, inside UEditor)
interface Editor {
  chain: () => any
  getAttributes: (name: string) => Record<string, any>
  isActive: (name: string) => boolean
}

// Writing a blog post: cover, title and body, saved as you type; Publish puts
// it on perlink.to/<site>/blog
definePageMeta({ layout: 'blank', middleware: 'auth', ssr: false })

const route = useRoute()
const { t } = useI18n()
const toast = useToast()
const username = String(route.params.url)
const postId = String(route.params.id)
const backTo = `/dashboard/site/${username}#blog`

interface Post { id: string; slug: string; title: string; excerpt: string | null; coverUrl: string | null; status: 'draft' | 'published'; content: unknown; autoExcerpt?: string }

const post = ref<Post | null>(null)
const title = ref('')
const content = ref<Record<string, unknown> | null>(null)
const coverUrl = ref<string | null>(null)
const excerpt = ref('')
const slug = ref('')
const autoExcerptText = ref('')
const titleEl = ref<HTMLTextAreaElement | null>(null)

useHead({ title: () => `${title.value || t('dashboard.blog.untitled')} — Perlink` })

onMounted(async () => {
  try {
    const res = await $fetch<{ post: Post }>(`/api/admin/bio/${username}/posts/${postId}`)
    apply(res.post)
    await nextTick()
    fitTitle()
    if (!title.value) titleEl.value?.focus()
  } catch {
    toast.add({ title: t('dashboard.blog.notFound'), color: 'error' })
    navigateTo(backTo)
  }
})

function apply(p: Post) {
  post.value = p
  title.value = p.title
  content.value = p.content as Record<string, unknown>
  coverUrl.value = p.coverUrl
  excerpt.value = p.excerpt ?? ''
  slug.value = p.slug.startsWith('draft-') ? '' : p.slug
  if (p.autoExcerpt !== undefined) autoExcerptText.value = p.autoExcerpt
}

function fitTitle() {
  const el = titleEl.value
  if (!el) return
  el.style.height = 'auto'
  el.style.height = `${el.scrollHeight}px`
}

// ---------- Saving ----------

const saving = ref(false)
const saveError = ref(false)
let timer: ReturnType<typeof setTimeout> | null = null

async function save(extra: Record<string, unknown> = {}) {
  if (!post.value) return
  if (timer) clearTimeout(timer)
  timer = null
  saving.value = true
  saveError.value = false
  try {
    const res = await $fetch<{ post: Post }>(`/api/admin/bio/${username}/posts/${postId}`, {
      method: 'PUT',
      body: { title: title.value, content: content.value, excerpt: excerpt.value || null, coverUrl: coverUrl.value, ...extra },
    })
    post.value = { ...post.value, ...res.post }
    autoExcerptText.value = res.post.autoExcerpt ?? ''
    if (!slug.value && !res.post.slug.startsWith('draft-') && res.post.status === 'published') slug.value = res.post.slug
    return res.post
  } catch (error: any) {
    saveError.value = true
    if (extra.status) throw error
  } finally {
    saving.value = false
  }
}

/** Saves a moment after the last keystroke */
function queueSave() {
  if (timer) clearTimeout(timer)
  timer = setTimeout(() => save(), 1200)
}
onBeforeUnmount(() => {
  if (timer) save()
})

function saveSlug() {
  if (slug.value && slug.value !== post.value?.slug) save({ slug: slug.value })
}

const publishing = ref(false)
async function setStatus(status: 'draft' | 'published') {
  publishing.value = true
  try {
    const saved = await save({ status })
    if (saved) toast.add({ title: status === 'published' ? t('dashboard.blog.published') : t('dashboard.blog.unpublished'), color: 'success' })
  } catch (error: any) {
    if (useUpgradePrompt().fromError(error)) return
    toast.add({ title: t('dashboard.blog.failed'), description: error?.data?.statusMessage, color: 'error' })
  } finally {
    publishing.value = false
  }
}

// ---------- Images (cover and in the body) ----------

const fileInput = ref<HTMLInputElement | null>(null)
const uploading = ref<'cover' | 'body' | null>(null)
let target: 'cover' | 'body' = 'cover'
let bodyEditor: Editor | null = null

function pickImage(where: 'cover' | 'body', editor?: Editor) {
  target = where
  if (editor) bodyEditor = editor
  fileInput.value?.click()
}

async function onFile(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file) return
  uploading.value = target
  try {
    const site = await $fetch<{ bioPage: { id: string } }>(`/api/admin/bio/${username}`)
    const form = new FormData()
    form.append('file', file)
    form.append('bioPageId', site.bioPage.id)
    const res = await $fetch<{ url: string }>('/api/upload/image-album', { method: 'POST', body: form })
    if (target === 'cover') setCover(res.url)
    else bodyEditor?.chain().focus().setImage({ src: res.url }).run()
  } catch (error: any) {
    toast.add({ title: t('dashboard.blog.uploadFailed'), description: error?.data?.statusMessage, color: 'error' })
  } finally {
    uploading.value = null
  }
}

function setCover(url: string | null) {
  coverUrl.value = url
  save()
}

// ---------- Links ----------

const linkOpen = ref(false)
const linkUrl = ref('')
let linkEditor: Editor | null = null
function openLink(editor: Editor) {
  linkEditor = editor
  linkUrl.value = editor.getAttributes('link').href ?? ''
  linkOpen.value = true
}
function applyLink() {
  const editor = linkEditor
  linkOpen.value = false
  if (!editor) return
  const href = linkUrl.value.trim()
  if (!href) editor.chain().focus().extendMarkRange('link').unsetLink().run()
  else editor.chain().focus().extendMarkRange('link').setLink({ href: /^(https?:|mailto:|tel:)/i.test(href) ? href : `https://${href}` }).run()
}

// ---------- Toolbar ----------

function toolbar(editor: Editor) {
  return [
    [
      { kind: 'heading', level: 2, icon: 'i-lucide-heading-2', 'aria-label': 'H2' },
      { kind: 'heading', level: 3, icon: 'i-lucide-heading-3', 'aria-label': 'H3' },
    ],
    [
      { kind: 'mark', mark: 'bold', icon: 'i-lucide-bold', 'aria-label': 'Bold' },
      { kind: 'mark', mark: 'italic', icon: 'i-lucide-italic', 'aria-label': 'Italic' },
      { kind: 'mark', mark: 'underline', icon: 'i-lucide-underline', 'aria-label': 'Underline' },
      { kind: 'mark', mark: 'strike', icon: 'i-lucide-strikethrough', 'aria-label': 'Strike' },
      { icon: 'i-lucide-link', 'aria-label': t('dashboard.blog.linkTitle'), active: editor.isActive('link'), onClick: () => openLink(editor) },
    ],
    [
      { kind: 'bulletList', icon: 'i-lucide-list', 'aria-label': 'List' },
      { kind: 'orderedList', icon: 'i-lucide-list-ordered', 'aria-label': 'Numbered list' },
      { kind: 'blockquote', icon: 'i-lucide-quote', 'aria-label': 'Quote' },
      { kind: 'codeBlock', icon: 'i-lucide-code', 'aria-label': 'Code' },
      { kind: 'horizontalRule', icon: 'i-lucide-minus', 'aria-label': 'Divider' },
      { icon: 'i-lucide-image-plus', 'aria-label': t('dashboard.blog.addImage'), loading: uploading.value === 'body', onClick: () => pickImage('body', editor) },
    ],
    [
      { kind: 'undo', icon: 'i-lucide-undo-2', 'aria-label': 'Undo' },
      { kind: 'redo', icon: 'i-lucide-redo-2', 'aria-label': 'Redo' },
    ],
  ]
}
</script>

<style>
/* The writing area looks like the published post */
.blog-editor h2 { font-size: 1.45em; font-weight: 700; margin-top: 1.4em; }
.blog-editor h3 { font-size: 1.2em; font-weight: 700; margin-top: 1.2em; }
.blog-editor p + p { margin-top: 0.9em; }
.blog-editor ul { list-style: disc; padding-left: 1.4em; }
.blog-editor ol { list-style: decimal; padding-left: 1.4em; }
.blog-editor blockquote { border-left: 3px solid currentColor; padding-left: 1em; opacity: 0.8; font-style: italic; }
.blog-editor pre { background: rgb(0 0 0 / 0.05); padding: 1em; border-radius: 14px; }
.blog-editor img { border-radius: 16px; max-width: 100%; }
.blog-editor a { text-decoration: underline; }
</style>
