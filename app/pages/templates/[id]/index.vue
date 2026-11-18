<template>
  <div class="min-h-dvh">
    <SiteTemplatePreviewBar :template-id="template.id" />

    <BioPageView :bio-data="bioData" :username="template.id" mode="template" />
    <SiteTemplatePreviewSpacer />
  </div>
</template>

<script setup lang="ts">
import { stableBlockIds } from '~/data/templateKit'
import type { BioData } from '~/types/bio'
import { PAGE_TEMPLATES } from '~/data/pageTemplates'
import { localizeTemplateContent } from '~/data/templateCopyVi'
import { toAppLanguage, type AppLanguage } from '#shared/language'

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
const lang = computed(() => toAppLanguage(locale.value))
const description = computed(() => t(`dashboard.templates.${template.id}.description`))
// Portfolio templates answer searches for a (3D) portfolio website
const PORTFOLIO_SEO: Record<string, Record<AppLanguage, [string, string]>> = {
  'personal': {
    en: ['Free 3D Portfolio Website Template | Perlink', 'A free personal portfolio website template with a 3D room: about you, selected work and links. No code, ready in minutes.'],
    vi: ['Mẫu website portfolio 3D miễn phí | Perlink', 'Mẫu website portfolio cá nhân miễn phí kèm phòng 3D: giới thiệu, tác phẩm tiêu biểu và liên kết. Không cần code.'],
    zh: ['免费 3D 作品集网站模板 | Perlink', '免费的个人作品集网站模板，附带 3D 房间：个人介绍、精选作品和链接。无需写代码，几分钟就能上线。'],
    ja: ['無料の3Dポートフォリオサイトテンプレート | Perlink', '3Dルーム付きの無料ポートフォリオサイトテンプレート。自己紹介、代表作、リンクをまとめられます。コード不要、数分で完成します。'],
    ko: ['무료 3D 포트폴리오 웹사이트 템플릿 | Perlink', '3D 룸이 포함된 무료 개인 포트폴리오 웹사이트 템플릿이에요. 소개, 대표 작업, 링크를 담고 코딩 없이 몇 분 만에 완성해요.'],
  },
  'creator': {
    en: ['Free 3D Artist Portfolio Template | Perlink', 'A free artist portfolio template: your work as a gallery, links to shop or commission, and a 3D room to walk around.'],
    vi: ['Mẫu portfolio nghệ sĩ 3D miễn phí | Perlink', 'Mẫu portfolio nghệ sĩ miễn phí: tác phẩm dạng thư viện, liên kết mua hoặc đặt làm, và phòng 3D để dạo quanh.'],
    zh: ['免费 3D 艺术家作品集模板 | Perlink', '免费的艺术家作品集模板：作品以画廊形式展示，附购买或约稿链接，还有可以四处逛逛的 3D 房间。'],
    ja: ['無料の3Dアーティストポートフォリオテンプレート | Perlink', '無料のアーティスト向けポートフォリオテンプレート。作品をギャラリーで見せ、購入や依頼へのリンク、歩き回れる3Dルームも付いています。'],
    ko: ['무료 3D 아티스트 포트폴리오 템플릿 | Perlink', '무료 아티스트 포트폴리오 템플릿이에요. 작품을 갤러리로 보여 주고, 구매·커미션 링크와 둘러볼 수 있는 3D 룸까지 담았어요.'],
  },
  'musician': {
    en: ['Free Musician Portfolio Website Template | Perlink', 'A free musician portfolio website: new releases, show dates and booking, with a 3D room for your fans.'],
    vi: ['Mẫu website portfolio ca sĩ, DJ miễn phí | Perlink', 'Mẫu portfolio cho ca sĩ và DJ: bản phát hành mới, lịch diễn và mời biểu diễn, kèm phòng 3D cho người hâm mộ.'],
    zh: ['免费音乐人作品集网站模板 | Perlink', '免费的音乐人作品集网站：新歌发布、演出日程和演出邀约，还有给粉丝的 3D 房间。'],
    ja: ['無料のミュージシャン向けポートフォリオサイトテンプレート | Perlink', 'ミュージシャン向けの無料ポートフォリオサイト。新作リリース、ライブ日程、出演依頼をまとめ、ファンのための3Dルームも用意できます。'],
    ko: ['무료 뮤지션 포트폴리오 웹사이트 템플릿 | Perlink', '무료 뮤지션 포트폴리오 웹사이트예요. 신곡, 공연 일정, 섭외 문의를 담고 팬을 위한 3D 룸도 만들 수 있어요.'],
  },
  'wedding-photo': {
    en: ['Free Photography Portfolio Template | Perlink', 'A free photography portfolio template: your best shots, packages and booking, with a 3D room to show your work.'],
    vi: ['Mẫu portfolio nhiếp ảnh miễn phí | Perlink', 'Mẫu portfolio nhiếp ảnh miễn phí: ảnh đẹp nhất, gói chụp và đặt lịch, kèm phòng 3D trưng bày tác phẩm.'],
    zh: ['免费摄影作品集模板 | Perlink', '免费的摄影作品集模板：精选作品、拍摄套餐和预约，还有展示作品的 3D 房间。'],
    ja: ['無料の写真ポートフォリオテンプレート | Perlink', '無料の写真ポートフォリオテンプレート。ベストショット、撮影プラン、予約をまとめ、作品を展示する3Dルームも付いています。'],
    ko: ['무료 사진 포트폴리오 템플릿 | Perlink', '무료 사진 포트폴리오 템플릿이에요. 베스트 컷, 촬영 패키지, 예약을 담고 작품을 전시할 3D 룸도 함께해요.'],
  },
}
// Title and closing line for every other template
const GENERIC_SEO: Record<AppLanguage, { title: (name: string) => string; tail: string }> = {
  en: { title: name => `Free ${name} Template | Perlink`, tail: 'A free template for your link in bio page or website, with a matching 3D room.' },
  vi: { title: name => `Mẫu ${name} miễn phí | Perlink`, tail: 'Mẫu miễn phí cho link bio hoặc trang web, kèm phòng 3D. Chỉnh theo ý bạn trên Perlink.' },
  zh: { title: name => `免费${name}模板 | Perlink`, tail: '免费模板，适用于个人链接页或网站，附带配套的 3D 房间。' },
  ja: { title: name => `無料の${name}テンプレート | Perlink`, tail: 'リンクまとめページやWebサイトに使える無料テンプレート。3Dルームも付いています。' },
  ko: { title: name => `무료 ${name} 템플릿 | Perlink`, tail: '링크 인 바이오 페이지나 웹사이트에 쓸 수 있는 무료 템플릿이에요. 어울리는 3D 룸도 함께해요.' },
}
const portfolioSeo = computed(() => PORTFOLIO_SEO[template.id]?.[lang.value])
const metaTitle = computed(() => portfolioSeo.value?.[0] ?? GENERIC_SEO[lang.value].title(name.value))
const metaDescription = computed(() => portfolioSeo.value?.[1] ??
  `${description.value} ${GENERIC_SEO[lang.value].tail}`.slice(0, 160),
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
