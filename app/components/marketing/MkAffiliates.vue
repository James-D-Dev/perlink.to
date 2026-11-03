<template>
  <div class="bg-paper text-ink">
    <MarketingMkSection :ruled="false">
      <div class="max-w-3xl">
        <p class="mk-eyebrow mb-4">{{ text.eyebrow }}</p>
        <h1 class="mk-display text-[40px] sm:text-6xl">{{ text.title }}</h1>
        <p class="mt-5 text-lg leading-relaxed text-ink-muted">{{ text.intro }}</p>
        <div class="mt-8 flex flex-wrap gap-3">
          <MarketingMkButton :href="signupUrl" trailing-icon="i-lucide-arrow-up-right">{{ text.join }}</MarketingMkButton>
          <MarketingMkButton to="/dashboard/earn" variant="outline">{{ text.dashboard }}</MarketingMkButton>
        </div>
      </div>
      <div class="mt-12 grid gap-4 sm:grid-cols-3">
        <div v-for="(stat, i) in text.stats" :key="stat.label" v-reveal="i * 90" class="rounded-2xl bg-sand p-6">
          <p class="mk-display text-4xl text-ink">{{ stat.value }}</p>
          <p class="mt-2 text-sm text-ink-muted">{{ stat.label }}</p>
        </div>
      </div>
    </MarketingMkSection>

    <MarketingMkSection :title="text.stepsTitle">
      <ol class="grid gap-4 md:grid-cols-3">
        <li v-for="(step, i) in text.steps" :key="step.title" v-reveal="i * 110" class="rounded-2xl bg-sand p-6 md:p-8">
          <span class="mk-display text-4xl text-ink-faint">0{{ i + 1 }}</span>
          <p class="mt-6 text-base font-medium text-ink">{{ step.title }}</p>
          <p class="mt-1 text-sm leading-relaxed text-ink-muted">{{ step.text }}</p>
        </li>
      </ol>
    </MarketingMkSection>

    <MarketingMkSection :title="text.whoTitle">
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div v-for="(item, i) in text.who" :key="item.title" v-reveal="(i % 4) * 90" class="rounded-2xl p-6 ring-1 ring-line">
          <UIcon :name="item.icon" class="size-5 text-ink" />
          <h3 class="mt-4 text-base font-medium text-ink">{{ item.title }}</h3>
          <p class="mt-1 text-sm leading-relaxed text-ink-muted">{{ item.text }}</p>
        </div>
      </div>
    </MarketingMkSection>

    <!-- The rules, plainly -->
    <MarketingMkSection id="rules" :title="text.rulesTitle">
      <ul class="max-w-3xl space-y-3">
        <li v-for="rule in text.rules" :key="rule" class="flex items-start gap-3 text-[15px] leading-relaxed text-ink">
          <UIcon name="i-lucide-check" class="mt-1 size-4 shrink-0 text-ink-muted" />
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
import { AFFILIATE_COMMISSION as PCT, AFFILIATE_COOKIE_DAYS as DAYS, AFFILIATE_MONTHS as MONTHS } from '#shared/affiliate'

const { lang } = useMarketingLang()
const signupUrl = useRuntimeConfig().public.affiliateSignupUrl as string

const TEXT = {
  en: {
    metaTitle: `Perlink Affiliate Program: Earn ${PCT}% Recurring | Perlink`,
    metaDescription: `Earn ${PCT}% of every payment for ${MONTHS} months when people you send buy a Perlink plan. Free to join, paid by Lemon Squeezy.`,
    eyebrow: 'Affiliate program',
    title: `Share Perlink, earn ${PCT}% for ${MONTHS} months`,
    intro: `Send people to Perlink with your link. When they buy Starter or Plus within ${DAYS} days, you earn ${PCT}% of each payment for their first ${MONTHS} months. Lemon Squeezy tracks every sale and pays you.`,
    join: 'Become an affiliate',
    dashboard: 'Your affiliate page',
    stats: [
      { value: `${PCT}%`, label: 'of every payment' },
      { value: `${MONTHS} mo`, label: 'of recurring commission' },
      { value: `${DAYS} days`, label: 'for a click to count' },
    ],
    stepsTitle: 'How it works',
    steps: [
      { title: 'Join on Lemon Squeezy', text: 'Sign up with your email. Lemon Squeezy runs the program: it counts your sales and pays you by PayPal or bank.' },
      { title: 'Share your link', text: 'Add your code in Perlink (Dashboard → Earn) and share your links. Your own sites’ “Made with Perlink” badge carries your code too.' },
      { title: 'Get paid', text: `Every time someone you sent pays for Starter or Plus, ${PCT}% is yours, for up to ${MONTHS} months.` },
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
      { q: 'What counts as a sale?', a: `Someone who follows your link and buys Starter or Plus by card or PayPal within ${DAYS} days. You earn on each of their payments for the first ${MONTHS} months.` },
      { q: 'Do I earn from free sign-ups?', a: 'Not directly, but we remember who brought each account: if they upgrade later, the sale is yours.' },
      { q: 'What does the badge do?', a: 'Perlink sites show a “Made with Perlink” badge. Once you add your code, the badge on your own sites sends visitors to Perlink with your code.' },
    ],
  },
  vi: {
    metaTitle: `Cộng tác viên Perlink: Nhận ${PCT}% hoa hồng định kỳ | Perlink`,
    metaDescription: `Nhận ${PCT}% mỗi khoản thanh toán trong ${MONTHS} tháng khi người bạn giới thiệu mua gói Perlink. Đăng ký miễn phí, Lemon Squeezy trả tiền.`,
    eyebrow: 'Chương trình cộng tác viên',
    title: `Giới thiệu Perlink, nhận ${PCT}% trong ${MONTHS} tháng`,
    intro: `Gửi mọi người tới Perlink bằng link của bạn. Khi họ mua gói Starter hoặc Plus trong vòng ${DAYS} ngày, bạn nhận ${PCT}% mỗi lần họ thanh toán trong ${MONTHS} tháng đầu. Lemon Squeezy theo dõi từng đơn và trả tiền cho bạn.`,
    join: 'Đăng ký làm cộng tác viên',
    dashboard: 'Trang cộng tác viên của bạn',
    stats: [
      { value: `${PCT}%`, label: 'mỗi khoản thanh toán' },
      { value: `${MONTHS} tháng`, label: 'hoa hồng định kỳ' },
      { value: `${DAYS} ngày`, label: 'để một lượt bấm được tính' },
    ],
    stepsTitle: 'Cách hoạt động',
    steps: [
      { title: 'Đăng ký trên Lemon Squeezy', text: 'Đăng ký bằng email. Lemon Squeezy vận hành chương trình: đếm doanh số và trả tiền cho bạn qua PayPal hoặc ngân hàng.' },
      { title: 'Chia sẻ link', text: 'Thêm mã vào Perlink (Dashboard → Kiếm tiền) rồi chia sẻ link. Huy hiệu “Made with Perlink” trên trang của bạn cũng mang mã của bạn.' },
      { title: 'Nhận tiền', text: `Mỗi lần người bạn giới thiệu thanh toán gói Starter hoặc Plus, ${PCT}% là của bạn, trong tối đa ${MONTHS} tháng.` },
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
      { q: 'Thế nào được tính là một đơn?', a: `Người bấm link của bạn và mua gói Starter hoặc Plus bằng thẻ hoặc PayPal trong vòng ${DAYS} ngày. Bạn nhận hoa hồng mỗi lần họ thanh toán trong ${MONTHS} tháng đầu.` },
      { q: 'Người đăng ký miễn phí có được tính không?', a: 'Không trực tiếp, nhưng Perlink ghi nhớ ai mang tới mỗi tài khoản: nếu sau này họ nâng cấp, đơn đó là của bạn.' },
      { q: 'Huy hiệu dùng để làm gì?', a: 'Các trang Perlink có huy hiệu “Made with Perlink”. Khi bạn thêm mã, huy hiệu trên trang của bạn sẽ đưa khách tới Perlink kèm mã của bạn.' },
    ],
  },
}
const text = computed(() => TEXT[lang.value])

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
