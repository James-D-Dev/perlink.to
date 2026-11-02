<template>
  <div class="min-h-dvh">
    <SiteTemplatePreviewBar :template-id="template.id" />

    <BioPageView :bio-data="bioData" :username="template.id" mode="template" />
  </div>
</template>

<script setup lang="ts">
import { stableBlockIds } from '~/data/templateKit'
import type { BioData } from '~/types/bio'
import { PAGE_TEMPLATES } from '~/data/pageTemplates'
import { localizeTemplateContent } from '~/data/templateCopyVi'

// A template as a full live page, opened from the template pickers so people
// can look around before choosing. Blocks show their sample content.
definePageMeta({ layout: 'blank', colorMode: 'light' })
provide(TEMPLATE_PREVIEW_KEY, true)

const route = useRoute()
const { t, locale } = useI18n()

const template = PAGE_TEMPLATES.find(item => item.id === route.params.id)
if (!template) throw createError({ statusCode: 404, statusMessage: 'Template not found', fatal: true })

const name = computed(() => t(`dashboard.templates.${template.id}.name`))

const bioData = computed<BioData>(() => {
  const content = localizeTemplateContent(template.build(), locale.value)
  return {
    title: content.title,
    bio: content.bio,
    avatarUrl: content.avatarUrl || '',
    templateId: 'modern',
    themeConfig: { ...content.themeConfig, showShare: false, roomButton: false },
    // Numbered ids, so the page renders the same on the server and in the browser
    blocks: stableBlockIds(content.blocks, template.id),
  }
})

// A landing page for searches like "restaurant menu website template"
const vi = computed(() => locale.value === 'vi')
const description = computed(() => t(`dashboard.templates.${template.id}.description`))
// Portfolio templates answer searches for a (3D) portfolio website
const PORTFOLIO_SEO: Record<string, { en: [string, string]; vi: [string, string] }> = {
  'personal': {
    en: ['Free 3D Portfolio Website Template | Perlink', 'A free personal portfolio website template with a 3D room: about you, selected work and links. No code, ready in minutes.'],
    vi: ['Mẫu website portfolio 3D miễn phí | Perlink', 'Mẫu website portfolio cá nhân miễn phí kèm phòng 3D: giới thiệu, tác phẩm tiêu biểu và liên kết. Không cần code.'],
  },
  'creator': {
    en: ['Free 3D Artist Portfolio Template | Perlink', 'A free artist portfolio template: your work as a gallery, links to shop or commission, and a 3D room to walk around.'],
    vi: ['Mẫu portfolio nghệ sĩ 3D miễn phí | Perlink', 'Mẫu portfolio nghệ sĩ miễn phí: tác phẩm dạng thư viện, liên kết mua hoặc đặt làm, và phòng 3D để dạo quanh.'],
  },
  'musician': {
    en: ['Free Musician Portfolio Website Template | Perlink', 'A free musician portfolio website: new releases, show dates and booking, with a 3D room for your fans.'],
    vi: ['Mẫu website portfolio ca sĩ, DJ miễn phí | Perlink', 'Mẫu portfolio cho ca sĩ và DJ: bản phát hành mới, lịch diễn và mời biểu diễn, kèm phòng 3D cho người hâm mộ.'],
  },
  'wedding-photo': {
    en: ['Free Photography Portfolio Template | Perlink', 'A free photography portfolio template: your best shots, packages and booking, with a 3D room to show your work.'],
    vi: ['Mẫu portfolio nhiếp ảnh miễn phí | Perlink', 'Mẫu portfolio nhiếp ảnh miễn phí: ảnh đẹp nhất, gói chụp và đặt lịch, kèm phòng 3D trưng bày tác phẩm.'],
  },
}
const portfolioSeo = computed(() => PORTFOLIO_SEO[template.id]?.[vi.value ? 'vi' : 'en'])
const metaTitle = computed(() => portfolioSeo.value?.[0] ?? (vi.value ? `Mẫu ${name.value} miễn phí | Perlink` : `Free ${name.value} Template | Perlink`))
const metaDescription = computed(() => portfolioSeo.value?.[1] ??
  `${description.value} ${vi.value ? 'Mẫu miễn phí cho link bio hoặc trang web, kèm phòng 3D. Chỉnh theo ý bạn trên Perlink.' : 'A free template for your link in bio page or website, with a matching 3D room.'}`.slice(0, 160),
)
const pageUrl = `https://perlink.to/templates/${template.id}`
useSeoMeta({
  title: metaTitle,
  description: metaDescription,
  ogTitle: metaTitle,
  ogDescription: metaDescription,
  ogUrl: pageUrl,
  ogType: 'website',
  ogSiteName: 'Perlink',
  ogImage: 'https://perlink.to/images/og.jpg',
  twitterCard: 'summary_large_image',
})
useHead({ link: [{ rel: 'canonical', href: pageUrl }] })
</script>
