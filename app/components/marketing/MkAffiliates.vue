<template>
  <div class="bg-paper text-ink">
    <!-- Hero: the offer on a money-green card, with what a payout looks like -->
    <section class="px-3 pt-3 sm:px-5 sm:pt-5">
      <div class="relative isolate mx-auto max-w-6xl overflow-hidden rounded-[28px] text-white shadow-[0_40px_80px_-40px_rgba(4,120,87,0.8)] sm:rounded-[36px]">
        <MarketingMkMoneyBackdrop />
        <div class="grid items-center gap-10 px-6 py-12 sm:px-10 sm:py-16 lg:grid-cols-[1.15fr_1fr] lg:px-14 lg:py-20">
          <div>
            <p class="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-lime-100 ring-1 ring-white/20 backdrop-blur">
              <UIcon name="i-lucide-badge-dollar-sign" class="size-3.5" />{{ text.eyebrow }}
            </p>
            <h1 class="mk-display mt-5 pr-10 text-[40px] leading-[1.05] sm:text-6xl"><template v-for="(part, i) in text.title.split(`${PCT}%`)" :key="i"><span v-if="i" class="bg-gradient-to-r from-amber-200 via-amber-300 to-yellow-200 bg-clip-text font-extrabold text-transparent drop-shadow-[0_2px_12px_rgba(252,211,77,0.45)]">{{ PCT }}%</span>{{ part }}</template></h1>
            <p class="mt-5 max-w-xl text-base leading-relaxed text-emerald-50/80 sm:text-lg">{{ text.intro }}</p>
            <div class="mt-8 flex flex-wrap gap-3">
              <a :href="signupUrl" target="_blank" rel="noopener" class="inline-flex h-12 items-center gap-2 rounded-full bg-amber-300 px-6 text-[15px] font-semibold text-[#422006] shadow-lg shadow-black/25 transition hover:-translate-y-0.5 hover:bg-amber-200">
                {{ text.join }}<UIcon name="i-lucide-arrow-up-right" class="size-4" />
              </a>
              <NuxtLink to="/dashboard/earn" class="inline-flex h-12 items-center rounded-full bg-white/10 px-6 text-[15px] font-medium text-white ring-1 ring-white/30 backdrop-blur transition hover:bg-white/20">
                {{ text.dashboard }}
              </NuxtLink>
            </div>
            <div class="mt-10 grid grid-cols-3 gap-2 sm:gap-3">
              <div v-for="(stat, i) in text.stats" :key="stat.label" class="rounded-2xl bg-white/10 p-3 ring-1 ring-white/15 backdrop-blur-md sm:p-4">
                <p class="text-xl font-semibold sm:text-3xl" :class="i === 0 && 'font-extrabold text-[#fcd34d]'">{{ stat.value }}</p>
                <p class="mt-1 text-[11px] leading-tight text-emerald-50/70 sm:text-sm">{{ stat.label }}</p>
              </div>
            </div>
          </div>

          <!-- A payout statement: what the commission looks like in practice -->
          <div class="relative mx-auto w-full max-w-sm">
            <div class="absolute -inset-4 -z-10 rounded-[32px] bg-lime-300/20 blur-2xl" />
            <div class="rounded-3xl bg-white p-5 text-zinc-900 shadow-2xl shadow-black/40 sm:p-6">
              <div class="flex items-center justify-between">
                <p class="text-sm font-medium text-zinc-500">{{ text.ledgerTitle }}</p>
                <span class="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">+{{ PCT }}%</span>
              </div>
              <p class="mt-2 text-4xl font-semibold tracking-tight tabular-nums">{{ formatUsd(ledgerTotal) }}</p>
              <p class="text-xs text-zinc-500">{{ text.ledgerNote }}</p>
              <ul class="mt-5 space-y-2.5">
                <li v-for="row in ledger" :key="row.label" class="flex items-center gap-3 rounded-2xl bg-zinc-50 px-3 py-2.5">
                  <span class="flex size-9 shrink-0 items-center justify-center rounded-xl" :class="row.tone">
                    <UIcon :name="row.icon" class="size-4" />
                  </span>
                  <span class="min-w-0 flex-1">
                    <span class="block truncate text-sm font-medium">{{ row.label }}</span>
                    <span class="block text-xs text-zinc-500">{{ row.sub }}</span>
                  </span>
                  <span class="text-sm font-semibold tabular-nums text-emerald-600">+{{ formatUsd(row.amount) }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <MarketingMkSection :title="text.stepsTitle">
      <ol class="grid gap-4 md:grid-cols-3">
        <li v-for="(step, i) in text.steps" :key="step.title" v-reveal="i * 110" class="rounded-2xl bg-sand p-6 md:p-8">
          <span class="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-lg font-semibold text-white shadow-lg shadow-emerald-600/30">{{ i + 1 }}</span>
          <p class="mt-6 text-base font-medium text-ink">{{ step.title }}</p>
          <p class="mt-1 text-sm leading-relaxed text-ink-muted">{{ step.text }}</p>
        </li>
      </ol>
    </MarketingMkSection>

    <MarketingMkSection :title="text.whoTitle">
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div v-for="(item, i) in text.who" :key="item.title" v-reveal="(i % 4) * 90" class="rounded-2xl p-6 ring-1 ring-line">
          <span class="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600"><UIcon :name="item.icon" class="size-5" /></span>
          <h3 class="mt-4 text-base font-medium text-ink">{{ item.title }}</h3>
          <p class="mt-1 text-sm leading-relaxed text-ink-muted">{{ item.text }}</p>
        </div>
      </div>
    </MarketingMkSection>

    <!-- The rules, plainly -->
    <MarketingMkSection id="rules" :title="text.rulesTitle">
      <ul class="max-w-3xl space-y-3">
        <li v-for="rule in text.rules" :key="rule" class="flex items-start gap-3 text-[15px] leading-relaxed text-ink">
          <UIcon name="i-lucide-circle-check" class="mt-1 size-4 shrink-0 text-emerald-600" />
          {{ rule }}
        </li>
      </ul>
    </MarketingMkSection>

    <MarketingMkSection :title="text.faqTitle">
      <div class="divide-y divide-line border-y border-line">
        <details v-for="item in text.faq" :key="item.q" class="group py-5">
          <summary class="flex cursor-pointer list-none items-center justify-between gap-6 text-[15px] text-ink [&::-webkit-details-marker]:hidden">
            {{ item.q }}
            <UIcon name="i-lucide-plus" class="size-4 shrink-0 text-ink-muted transition-transform group-open:rotate-45" />
          </summary>
          <p class="mt-3 max-w-2xl text-sm leading-relaxed text-ink-muted">{{ item.a }}</p>
        </details>
      </div>
      <div class="mt-10">
        <MarketingMkButton :href="signupUrl" trailing-icon="i-lucide-arrow-up-right">{{ text.join }}</MarketingMkButton>
      </div>
    </MarketingMkSection>
  </div>
</template>

<script setup lang="ts">
// The affiliate program: /affiliates and /vi/cong-tac-vien. Run by Lemon
// Squeezy; the numbers come from shared/affiliate.
import { AFFILIATE_COMMISSION as PCT, AFFILIATE_COOKIE_DAYS as DAYS } from '#shared/affiliate'
import { PLAN_PRICES_USD, formatUsd } from '#shared/plans'

const { lang } = useMarketingLang()
const signupUrl = useRuntimeConfig().public.affiliateSignupUrl as string

const TEXT = {
  en: {
    metaTitle: `Perlink Affiliate Program: Earn ${PCT}% Recurring, for Life | Perlink`,
    metaDescription: `Earn ${PCT}% of every payment, for as long as they stay subscribed, when people you send buy a Perlink plan. Free to join, paid by Lemon Squeezy.`,
    eyebrow: 'Affiliate program',
    title: `Share Perlink, earn ${PCT}% for life`,
    intro: `Send people to Perlink with your link. When they buy Starter, Plus or Max within ${DAYS} days, you earn ${PCT}% of every payment they make, renewals included, for as long as they stay subscribed. Lemon Squeezy tracks every sale and pays you.`,
    join: 'Become an affiliate',
    ledgerTitle: 'Your commission, one year',
    ledgerNote: 'Example: three people you sent',
    ledgerRows: ['Max, annually', 'Plus, annually', 'Starter, monthly'],
    ledgerSub: ['renews every year', 'renews every year', '12 payments'],
    dashboard: 'Your affiliate page',
    stats: [
      { value: `${PCT}%`, label: 'of every payment' },
      { value: 'For life', label: 'on every renewal' },
      { value: `${DAYS} days`, label: 'for a click to count' },
    ],
    stepsTitle: 'How it works',
    steps: [
      { title: 'Join on Lemon Squeezy', text: 'Sign up with your email. Lemon Squeezy runs the program: it counts your sales and pays you by PayPal or bank.' },
      { title: 'Share your link', text: 'Add your code in Perlink (Dashboard → Earn) and share your links. Your own sites’ “Made with Perlink” badge carries your code too.' },
      { title: 'Get paid', text: `Every time someone you sent pays for Starter, Plus or Max, ${PCT}% is yours, every month or year they renew.` },
    ],
    whoTitle: 'Made for',
    who: [
      { icon: 'i-lucide-video', title: 'Creators', text: 'Show your Perlink page or 3D room in a video and put the link in your bio.' },
      { icon: 'i-lucide-pen-tool', title: 'Designers and agencies', text: 'Build sites for clients on Perlink and earn when they upgrade.' },
      { icon: 'i-lucide-graduation-cap', title: 'Teachers and coaches', text: 'Recommend Perlink to students and small businesses you help.' },
      { icon: 'i-lucide-heart', title: 'Happy users', text: 'Friends ask how you made your page? Send them your link.' },
    ],
    rulesTitle: 'Program rules',
    rules: [
      'Be honest: say it’s your affiliate link when you share it, as the law in many countries requires.',
      'No spam: no unsolicited messages, comment spam or mass posting.',
      'No ads on the Perlink name: don’t bid on “Perlink” or similar keywords, and don’t make pages or accounts that look like ours.',
      'No fake reviews, coupons or promises we don’t make.',
      'No buying through your own link, and no paying people to sign up.',
      'Commission is on payments that are kept: refunds and chargebacks are taken back.',
      'We can remove an affiliate who breaks these rules; Lemon Squeezy’s affiliate terms also apply.',
    ],
    faqTitle: 'Questions',
    faq: [
      { q: 'Does it cost anything to join?', a: 'No. Joining is free, and you don’t need a paid Perlink plan.' },
      { q: 'How and when am I paid?', a: 'Lemon Squeezy pays affiliates by PayPal or bank transfer once your earnings pass its payout threshold. You see every sale in your Lemon Squeezy affiliate dashboard.' },
      { q: 'What counts as a sale?', a: `Someone who follows your link and buys Starter, Plus or Max by card or PayPal within ${DAYS} days. You earn on every payment they make after that, for as long as they stay subscribed.` },
      { q: 'Do I earn from free sign-ups?', a: 'Not directly, but we remember who brought each account: if they upgrade later, the sale is yours.' },
      { q: 'What does the badge do?', a: 'Perlink sites show a “Made with Perlink” badge. Once you add your code, the badge on your own sites sends visitors to Perlink with your code.' },
    ],
  },
  vi: {
    metaTitle: `Cộng tác viên Perlink: Nhận ${PCT}% hoa hồng trọn đời | Perlink`,
    metaDescription: `Nhận ${PCT}% mỗi khoản thanh toán, chừng nào khách còn dùng, khi người bạn giới thiệu mua gói Perlink. Đăng ký miễn phí, Lemon Squeezy trả tiền.`,
    eyebrow: 'Chương trình cộng tác viên',
    title: `Giới thiệu Perlink, nhận ${PCT}% trọn đời`,
    intro: `Gửi mọi người tới Perlink bằng link của bạn. Khi họ mua gói Starter, Plus hoặc Max trong vòng ${DAYS} ngày, bạn nhận ${PCT}% mỗi lần họ thanh toán, kể cả các lần gia hạn, chừng nào họ còn dùng. Lemon Squeezy theo dõi từng đơn và trả tiền cho bạn.`,
    join: 'Đăng ký làm cộng tác viên',
    ledgerTitle: 'Hoa hồng của bạn trong một năm',
    ledgerNote: 'Ví dụ: ba người bạn giới thiệu',
    ledgerRows: ['Max, theo năm', 'Plus, theo năm', 'Starter, theo tháng'],
    ledgerSub: ['gia hạn mỗi năm', 'gia hạn mỗi năm', '12 lần thanh toán'],
    dashboard: 'Trang cộng tác viên của bạn',
    stats: [
      { value: `${PCT}%`, label: 'mỗi khoản thanh toán' },
      { value: 'Trọn đời', label: 'mỗi lần khách gia hạn' },
      { value: `${DAYS} ngày`, label: 'để một lượt bấm được tính' },
    ],
    stepsTitle: 'Cách hoạt động',
    steps: [
      { title: 'Đăng ký trên Lemon Squeezy', text: 'Đăng ký bằng email. Lemon Squeezy vận hành chương trình: đếm doanh số và trả tiền cho bạn qua PayPal hoặc ngân hàng.' },
      { title: 'Chia sẻ link', text: 'Thêm mã vào Perlink (Dashboard → Kiếm tiền) rồi chia sẻ link. Huy hiệu “Made with Perlink” trên trang của bạn cũng mang mã của bạn.' },
      { title: 'Nhận tiền', text: `Mỗi lần người bạn giới thiệu thanh toán gói Starter, Plus hoặc Max, ${PCT}% là của bạn, mỗi tháng hoặc mỗi năm họ gia hạn.` },
    ],
    whoTitle: 'Dành cho',
    who: [
      { icon: 'i-lucide-video', title: 'Nhà sáng tạo nội dung', text: 'Quay trang Perlink hoặc phòng 3D của bạn và đặt link ở bio.' },
      { icon: 'i-lucide-pen-tool', title: 'Designer và agency', text: 'Làm trang cho khách trên Perlink và nhận hoa hồng khi họ nâng cấp.' },
      { icon: 'i-lucide-graduation-cap', title: 'Giáo viên và người hướng dẫn', text: 'Giới thiệu Perlink cho học viên và các shop nhỏ bạn hỗ trợ.' },
      { icon: 'i-lucide-heart', title: 'Người dùng yêu thích Perlink', text: 'Bạn bè hỏi trang của bạn làm bằng gì? Gửi họ link của bạn.' },
    ],
    rulesTitle: 'Quy định chương trình',
    rules: [
      'Trung thực: ghi rõ đó là link cộng tác viên khi chia sẻ, như luật nhiều nước yêu cầu.',
      'Không spam: không nhắn tin hàng loạt, spam bình luận hay đăng tràn lan.',
      'Không chạy quảng cáo bằng tên Perlink: không đặt từ khoá “Perlink” hay từ tương tự, không tạo trang hoặc tài khoản giả giống của chúng tôi.',
      'Không đánh giá giả, mã giảm giá giả hay hứa hẹn những gì chúng tôi không cam kết.',
      'Không tự mua qua link của mình, không trả tiền để người khác đăng ký.',
      'Hoa hồng tính trên khoản thanh toán được giữ lại: đơn hoàn tiền hoặc bị chargeback sẽ bị trừ.',
      'Chúng tôi có thể loại cộng tác viên vi phạm; điều khoản cộng tác viên của Lemon Squeezy cũng được áp dụng.',
    ],
    faqTitle: 'Câu hỏi thường gặp',
    faq: [
      { q: 'Tham gia có mất phí không?', a: 'Không. Đăng ký miễn phí và không cần dùng gói trả phí của Perlink.' },
      { q: 'Tôi được trả tiền thế nào, khi nào?', a: 'Lemon Squeezy trả cho cộng tác viên qua PayPal hoặc chuyển khoản khi thu nhập đạt ngưỡng thanh toán của họ. Bạn xem từng đơn trong trang cộng tác viên của Lemon Squeezy.' },
      { q: 'Thế nào được tính là một đơn?', a: `Người bấm link của bạn và mua gói Starter, Plus hoặc Max bằng thẻ hoặc PayPal trong vòng ${DAYS} ngày. Bạn nhận hoa hồng mỗi lần họ thanh toán sau đó, chừng nào họ còn dùng.` },
      { q: 'Người đăng ký miễn phí có được tính không?', a: 'Không trực tiếp, nhưng Perlink ghi nhớ ai mang tới mỗi tài khoản: nếu sau này họ nâng cấp, đơn đó là của bạn.' },
      { q: 'Huy hiệu dùng để làm gì?', a: 'Các trang Perlink có huy hiệu “Made with Perlink”. Khi bạn thêm mã, huy hiệu trên trang của bạn sẽ đưa khách tới Perlink kèm mã của bạn.' },
    ],
  },
}
const text = computed(() => TEXT[lang.value])

// The example payout: one Max and one Plus customer paying yearly, one Starter monthly
const cut = (amount: number) => Math.round(amount * PCT) / 100
const ledger = computed(() => [
  { amount: cut(PLAN_PRICES_USD.max.annual), icon: 'i-lucide-gem', tone: 'bg-gradient-to-br from-amber-300 to-pink-400 text-white' },
  { amount: cut(PLAN_PRICES_USD.plus.annual), icon: 'i-lucide-crown', tone: 'bg-zinc-900 text-white' },
  { amount: cut(PLAN_PRICES_USD.starter.monthly * 12), icon: 'i-lucide-rocket', tone: 'bg-sky-100 text-sky-700' },
].map((row, i) => ({ ...row, label: text.value.ledgerRows[i]!, sub: text.value.ledgerSub[i]! })))
const ledgerTotal = computed(() => ledger.value.reduce((sum, row) => sum + row.amount, 0))

const SITE = 'https://perlink.to'
const pageUrl = computed(() => `${SITE}${lang.value === 'vi' ? '/vi/cong-tac-vien' : '/affiliates'}`)
useSeoMeta({
  title: () => text.value.metaTitle,
  description: () => text.value.metaDescription,
  ogTitle: () => text.value.metaTitle,
  ogDescription: () => text.value.metaDescription,
  ogUrl: () => pageUrl.value,
  ogType: 'website',
  ogSiteName: 'Perlink',
  ogImage: `${SITE}/images/og.jpg`,
  twitterCard: 'summary_large_image',
  twitterSite: X_HANDLE,
})
useHead({
  htmlAttrs: { lang: () => lang.value },
  link: () => [
    { rel: 'canonical', href: pageUrl.value },
    { rel: 'alternate', hreflang: 'en', href: `${SITE}/affiliates` },
    { rel: 'alternate', hreflang: 'vi', href: `${SITE}/vi/cong-tac-vien` },
    { rel: 'alternate', hreflang: 'x-default', href: `${SITE}/affiliates` },
  ],
})

const { setLocale } = useI18n()
onMounted(() => {
  if (lang.value === 'vi') setLocale('vi')
})
</script>
