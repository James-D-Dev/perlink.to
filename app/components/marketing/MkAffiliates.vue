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
import { LANGUAGE_INFO, type AppLanguage } from '#shared/language'
import { alternateLinks } from '~/data/langPaths'
// The affiliate program: /affiliates and /vi/cong-tac-vien. Run by Creem
// (Affiliate Hub); the numbers come from shared/affiliate.
import { AFFILIATE_COMMISSION as PCT, AFFILIATE_COOKIE_DAYS as DAYS } from '#shared/affiliate'
import { PLAN_PRICES_USD, formatUsd } from '#shared/plans'

const { lang, local } = useMarketingLang()
const signupUrl = useRuntimeConfig().public.affiliateSignupUrl as string

const TEXT = {
  en: {
    metaTitle: `Perlink Affiliate Program: Earn ${PCT}% Recurring, for Life | Perlink`,
    metaDescription: `Earn ${PCT}% of every payment, for as long as they stay subscribed, when people you send buy a Perlink plan. Free to join, paid by Creem.`,
    eyebrow: 'Affiliate program',
    title: `Share Perlink, earn ${PCT}% for life`,
    intro: `Send people to Perlink with your link. When they buy Starter, Plus or Max within ${DAYS} days, you earn ${PCT}% of every payment they make, renewals included, for as long as they stay subscribed. Creem, our payment partner, tracks every sale and pays you.`,
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
      { title: 'Join the program', text: 'Sign up with your email. Creem runs the program: it counts your sales and pays you by bank transfer or USDC.' },
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
      'We can remove an affiliate who breaks these rules; Creem’s affiliate terms also apply.',
    ],
    faqTitle: 'Questions',
    faq: [
      { q: 'Does it cost anything to join?', a: 'No. Joining is free, and you don’t need a paid Perlink plan.' },
      { q: 'How and when am I paid?', a: 'Creem pays affiliates by bank transfer or USDC on the 1st and 15th of each month, once your earnings reach $50 and you’ve verified your identity. You see every sale in your Creem affiliate portal.' },
      { q: 'What counts as a sale?', a: `Someone who follows your link and buys Starter, Plus or Max by card within ${DAYS} days. You earn on every payment they make after that, for as long as they stay subscribed.` },
      { q: 'Do I earn from free sign-ups?', a: 'Not directly, but we remember who brought each account: if they upgrade later, the sale is yours.' },
      { q: 'What does the badge do?', a: 'Perlink sites show a “Made with Perlink” badge. Once you add your code, the badge on your own sites sends visitors to Perlink with your code.' },
    ],
  },
  vi: {
    metaTitle: `Cộng tác viên Perlink: Nhận ${PCT}% hoa hồng trọn đời | Perlink`,
    metaDescription: `Nhận ${PCT}% mỗi khoản thanh toán, chừng nào khách còn dùng, khi người bạn giới thiệu mua gói Perlink. Đăng ký miễn phí, Creem trả tiền.`,
    eyebrow: 'Chương trình cộng tác viên',
    title: `Giới thiệu Perlink, nhận ${PCT}% trọn đời`,
    intro: `Gửi mọi người tới Perlink bằng link của bạn. Khi họ mua gói Starter, Plus hoặc Max trong vòng ${DAYS} ngày, bạn nhận ${PCT}% mỗi lần họ thanh toán, kể cả các lần gia hạn, chừng nào họ còn dùng. Creem, đối tác thanh toán của chúng tôi, theo dõi từng đơn và trả tiền cho bạn.`,
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
      { title: 'Đăng ký chương trình', text: 'Đăng ký bằng email. Creem vận hành chương trình: đếm doanh số và trả tiền cho bạn qua chuyển khoản ngân hàng hoặc USDC.' },
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
      'Chúng tôi có thể loại cộng tác viên vi phạm; điều khoản cộng tác viên của Creem cũng được áp dụng.',
    ],
    faqTitle: 'Câu hỏi thường gặp',
    faq: [
      { q: 'Tham gia có mất phí không?', a: 'Không. Đăng ký miễn phí và không cần dùng gói trả phí của Perlink.' },
      { q: 'Tôi được trả tiền thế nào, khi nào?', a: 'Creem trả cho cộng tác viên qua chuyển khoản ngân hàng hoặc USDC vào ngày 1 và 15 hằng tháng, khi thu nhập đạt 50 USD và bạn đã xác minh danh tính. Bạn xem từng đơn trong trang cộng tác viên của Creem.' },
      { q: 'Thế nào được tính là một đơn?', a: `Người bấm link của bạn và mua gói Starter, Plus hoặc Max bằng thẻ trong vòng ${DAYS} ngày. Bạn nhận hoa hồng mỗi lần họ thanh toán sau đó, chừng nào họ còn dùng.` },
      { q: 'Người đăng ký miễn phí có được tính không?', a: 'Không trực tiếp, nhưng Perlink ghi nhớ ai mang tới mỗi tài khoản: nếu sau này họ nâng cấp, đơn đó là của bạn.' },
      { q: 'Huy hiệu dùng để làm gì?', a: 'Các trang Perlink có huy hiệu “Made with Perlink”. Khi bạn thêm mã, huy hiệu trên trang của bạn sẽ đưa khách tới Perlink kèm mã của bạn.' },
    ],
  },
  zh: {
    metaTitle: `Perlink 推广联盟计划：终身 ${PCT}% 循环佣金 | Perlink`,
    metaDescription: `你推荐的人购买 Perlink 套餐后，只要对方持续订阅，每笔付款你都能拿到 ${PCT}% 佣金。免费加入，由 Creem 支付。`,
    eyebrow: '推广联盟计划',
    title: `分享 Perlink，终身赚取 ${PCT}% 佣金`,
    intro: `用你的专属链接把朋友带到 Perlink。他们在 ${DAYS} 天内购买 Starter、Plus 或 Max，之后只要持续订阅，每一笔付款（包括续费）你都能拿到 ${PCT}%。我们的支付合作伙伴 Creem 会追踪每一笔订单并向你付款。`,
    join: '成为推广伙伴',
    ledgerTitle: '一年下来你的佣金',
    ledgerNote: '示例：你推荐的三位用户',
    ledgerRows: ['Max，按年付', 'Plus，按年付', 'Starter，按月付'],
    ledgerSub: ['每年续费', '每年续费', '12 次付款'],
    dashboard: '你的推广页面',
    stats: [
      { value: `${PCT}%`, label: '每笔付款' },
      { value: '终身', label: '每次续费都算' },
      { value: `${DAYS} 天`, label: '点击有效期' },
    ],
    stepsTitle: '如何运作',
    steps: [
      { title: '加入计划', text: '用邮箱注册即可。计划由 Creem 运营：统计你的销售额，并通过银行转账或 USDC 向你付款。' },
      { title: '分享你的链接', text: '在 Perlink 中添加你的推广码（控制台 → 赚取收益），然后分享你的链接。你自己网站上的“Made with Perlink”徽标也会带上你的推广码。' },
      { title: '拿到收益', text: `你推荐的人每次为 Starter、Plus 或 Max 付款，${PCT}% 都归你，按月或按年续费都算。` },
    ],
    whoTitle: '适合谁',
    who: [
      { icon: 'i-lucide-video', title: '内容创作者', text: '在视频里展示你的 Perlink 页面或 3D 房间，再把链接放进简介。' },
      { icon: 'i-lucide-pen-tool', title: '设计师和代理公司', text: '用 Perlink 为客户搭建网站，客户升级时你就有佣金。' },
      { icon: 'i-lucide-graduation-cap', title: '老师和教练', text: '把 Perlink 推荐给你的学员和你帮助的小商家。' },
      { icon: 'i-lucide-heart', title: '喜欢 Perlink 的用户', text: '朋友问你的页面是怎么做的？把你的链接发给他们。' },
    ],
    rulesTitle: '计划规则',
    rules: [
      '诚实透明：分享时说明这是你的推广链接，许多国家的法律都有此要求。',
      '禁止垃圾信息：不得主动群发消息、刷评论或大量刷屏发帖。',
      '不得用 Perlink 的名字投放广告：不要竞价“Perlink”或类似关键词，也不要制作仿冒我们的页面或账号。',
      '不得发布虚假评价、虚假优惠码，或做出我们没有的承诺。',
      '不得通过自己的链接购买，也不得花钱让别人注册。',
      '佣金按实际保留的付款计算：退款和拒付的订单会被扣回。',
      '违反规则的推广伙伴可能会被移除；同时适用 Creem 的推广条款。',
    ],
    faqTitle: '常见问题',
    faq: [
      { q: '加入需要付费吗？', a: '不需要。加入免费，也不需要购买 Perlink 付费套餐。' },
      { q: '怎么付款？什么时候付？', a: '当你的收益达到 50 美元并完成身份验证后，Creem 会在每月 1 日和 15 日通过银行转账或 USDC 向推广伙伴付款。你可以在 Creem 推广后台看到每一笔订单。' },
      { q: '什么样才算一笔订单？', a: `有人通过你的链接进入，并在 ${DAYS} 天内用银行卡购买 Starter、Plus 或 Max。此后只要对方持续订阅，每笔付款你都有佣金。` },
      { q: '免费注册也有佣金吗？', a: '不直接计算，但我们会记住每个账号是谁带来的：如果对方之后升级，这笔订单就算你的。' },
      { q: '徽标有什么用？', a: 'Perlink 网站会显示“Made with Perlink”徽标。添加推广码后，你自己网站上的徽标会带着你的推广码把访客引到 Perlink。' },
    ],
  },
  ja: {
    metaTitle: `Perlink アフィリエイト：報酬${PCT}%がずっと続く | Perlink`,
    metaDescription: `紹介した人が Perlink のプランを購入すると、契約が続く限りすべての支払いの${PCT}%を報酬として受け取れます。参加無料、支払いは Creem。`,
    eyebrow: 'アフィリエイトプログラム',
    title: `Perlink を紹介して、ずっと${PCT}%の報酬を`,
    intro: `あなたのリンクから Perlink を紹介しましょう。紹介した人が${DAYS}日以内に Starter、Plus、Max のいずれかを購入すると、更新分も含めて、契約が続く限りすべての支払いの${PCT}%があなたの報酬になります。決済パートナーの Creem がすべての売上を記録し、報酬をお支払いします。`,
    join: 'アフィリエイトに参加する',
    ledgerTitle: 'あなたの報酬（1年間）',
    ledgerNote: '例：あなたが紹介した3人',
    ledgerRows: ['Max・年払い', 'Plus・年払い', 'Starter・月払い'],
    ledgerSub: ['毎年更新', '毎年更新', '12回の支払い'],
    dashboard: 'アフィリエイトページへ',
    stats: [
      { value: `${PCT}%`, label: 'すべての支払いから' },
      { value: 'ずっと', label: '更新のたびに' },
      { value: `${DAYS}日間`, label: 'クリックが有効な期間' },
    ],
    stepsTitle: '仕組み',
    steps: [
      { title: 'プログラムに参加', text: 'メールアドレスで登録します。プログラムの運営は Creem が行い、売上を集計して、銀行振込または USDC で報酬をお支払いします。' },
      { title: 'リンクをシェア', text: 'Perlink（ダッシュボード → 報酬を得る）でコードを追加し、リンクをシェアしましょう。あなたのサイトの「Made with Perlink」バッジにもコードが付きます。' },
      { title: '報酬を受け取る', text: `紹介した人が Starter、Plus、Max の料金を支払うたびに、${PCT}%があなたのもの。毎月・毎年の更新ごとに受け取れます。` },
    ],
    whoTitle: 'こんな方に',
    who: [
      { icon: 'i-lucide-video', title: 'クリエイター', text: '動画で Perlink のページや3Dルームを見せて、プロフィールにリンクを。' },
      { icon: 'i-lucide-pen-tool', title: 'デザイナー・制作会社', text: 'クライアントのサイトを Perlink で作り、アップグレード時に報酬を。' },
      { icon: 'i-lucide-graduation-cap', title: '講師・コーチ', text: '教えている生徒やサポートしている小さなお店に Perlink をおすすめ。' },
      { icon: 'i-lucide-heart', title: 'Perlink のファン', text: '友だちに「そのページどうやって作ったの？」と聞かれたら、リンクを送りましょう。' },
    ],
    rulesTitle: 'プログラムのルール',
    rules: [
      '正直に：シェアするときはアフィリエイトリンクであることを明記してください。多くの国で法律により求められています。',
      'スパム禁止：一方的なメッセージ、コメントスパム、大量投稿はしないでください。',
      'Perlink の名前で広告を出さない：「Perlink」や類似キーワードへの入札、当社に似せたページやアカウントの作成は禁止です。',
      '偽のレビュー、偽のクーポン、当社が約束していない内容の宣伝は禁止です。',
      '自分のリンク経由での購入や、お金を払って登録してもらうことは禁止です。',
      '報酬は確定した支払いが対象です。返金やチャージバックの分は差し引かれます。',
      'ルールに違反したアフィリエイトは除外することがあります。Creem のアフィリエイト規約も適用されます。',
    ],
    faqTitle: 'よくある質問',
    faq: [
      { q: '参加に費用はかかりますか？', a: 'いいえ。参加は無料で、Perlink の有料プランも必要ありません。' },
      { q: '報酬はいつ、どのように支払われますか？', a: 'Creem が毎月1日と15日に、銀行振込または USDC でお支払いします。報酬が50ドルに達し、本人確認が済んでいることが条件です。すべての売上は Creem のアフィリエイトポータルで確認できます。' },
      { q: '何が売上としてカウントされますか？', a: `あなたのリンクから訪れ、${DAYS}日以内にカードで Starter、Plus、Max のいずれかを購入した人です。その後は、契約が続く限りすべての支払いから報酬を受け取れます。` },
      { q: '無料登録でも報酬はもらえますか？', a: '直接はもらえません。ただし、どのアカウントを誰が紹介したかは記録しているので、あとでアップグレードされればその売上はあなたのものです。' },
      { q: 'バッジにはどんな役割がありますか？', a: 'Perlink のサイトには「Made with Perlink」バッジが表示されます。コードを追加すると、あなたのサイトのバッジから訪問者があなたのコード付きで Perlink に移動します。' },
    ],
  },
  ko: {
    metaTitle: `Perlink 제휴 프로그램: 평생 ${PCT}% 수익 | Perlink`,
    metaDescription: `추천한 사람이 Perlink 요금제를 구매하면 구독이 유지되는 한 모든 결제의 ${PCT}%를 받아요. 가입 무료, 지급은 Creem.`,
    eyebrow: '제휴 프로그램',
    title: `Perlink를 공유하고 평생 ${PCT}% 받기`,
    intro: `내 링크로 사람들을 Perlink에 데려오세요. 그분들이 ${DAYS}일 안에 Starter, Plus, Max를 구매하면, 구독을 유지하는 동안 갱신 결제를 포함한 모든 결제의 ${PCT}%가 여러분에게 돌아가요. 결제 파트너 Creem이 모든 판매를 추적하고 수익을 지급해요.`,
    join: '제휴 파트너 되기',
    ledgerTitle: '1년 동안의 수익',
    ledgerNote: '예시: 내가 추천한 세 사람',
    ledgerRows: ['Max, 연간', 'Plus, 연간', 'Starter, 월간'],
    ledgerSub: ['매년 갱신', '매년 갱신', '12회 결제'],
    dashboard: '내 제휴 페이지',
    stats: [
      { value: `${PCT}%`, label: '모든 결제에서' },
      { value: '평생', label: '갱신될 때마다' },
      { value: `${DAYS}일`, label: '클릭 인정 기간' },
    ],
    stepsTitle: '이용 방법',
    steps: [
      { title: '프로그램 가입', text: '이메일로 가입하세요. 프로그램은 Creem이 운영해요. 판매를 집계하고 은행 송금이나 USDC로 수익을 지급해요.' },
      { title: '링크 공유', text: 'Perlink에서 코드를 추가하고(대시보드 → 수익 얻기) 링크를 공유하세요. 내 사이트의 “Made with Perlink” 배지에도 내 코드가 들어가요.' },
      { title: '수익 받기', text: `추천한 사람이 Starter, Plus, Max를 결제할 때마다, 매달 또는 매년 갱신할 때마다 ${PCT}%가 여러분 몫이에요.` },
    ],
    whoTitle: '이런 분께 추천해요',
    who: [
      { icon: 'i-lucide-video', title: '크리에이터', text: '영상에서 내 Perlink 페이지나 3D 룸을 보여 주고 프로필에 링크를 걸어 두세요.' },
      { icon: 'i-lucide-pen-tool', title: '디자이너와 에이전시', text: 'Perlink로 고객 사이트를 만들고, 고객이 업그레이드하면 수익을 받아요.' },
      { icon: 'i-lucide-graduation-cap', title: '강사와 코치', text: '수강생이나 돕고 있는 작은 가게에 Perlink를 추천해 주세요.' },
      { icon: 'i-lucide-heart', title: 'Perlink를 좋아하는 사용자', text: '친구가 페이지를 어떻게 만들었냐고 묻나요? 내 링크를 보내 주세요.' },
    ],
    rulesTitle: '프로그램 규칙',
    rules: [
      '정직하게: 공유할 때 제휴 링크임을 밝혀 주세요. 많은 나라에서 법으로 정하고 있어요.',
      '스팸 금지: 원치 않는 메시지, 댓글 스팸, 무차별 게시는 안 돼요.',
      'Perlink 이름으로 광고 금지: “Perlink”나 비슷한 키워드에 입찰하지 말고, 우리와 비슷해 보이는 페이지나 계정을 만들지 마세요.',
      '가짜 후기, 가짜 쿠폰, 우리가 하지 않은 약속은 금지예요.',
      '내 링크로 직접 구매하거나, 돈을 주고 가입을 유도하는 건 안 돼요.',
      '수익은 유지된 결제에만 적용돼요. 환불과 지불 거절(차지백)은 차감돼요.',
      '규칙을 어긴 제휴 파트너는 제외될 수 있으며, Creem의 제휴 약관도 함께 적용돼요.',
    ],
    faqTitle: '자주 묻는 질문',
    faq: [
      { q: '가입하는 데 비용이 드나요?', a: '아니요. 가입은 무료이고, Perlink 유료 요금제를 쓰지 않아도 돼요.' },
      { q: '수익은 언제, 어떻게 받나요?', a: 'Creem이 매월 1일과 15일에 은행 송금이나 USDC로 지급해요. 수익이 $50 이상이고 본인 인증을 마쳐야 해요. 모든 판매 내역은 Creem 제휴 포털에서 확인할 수 있어요.' },
      { q: '무엇이 판매로 인정되나요?', a: `내 링크를 통해 들어온 사람이 ${DAYS}일 안에 카드로 Starter, Plus, Max를 구매하면 인정돼요. 그 뒤로 구독을 유지하는 동안 모든 결제에서 수익을 받아요.` },
      { q: '무료 가입도 수익이 되나요?', a: '바로는 아니에요. 하지만 각 계정을 누가 데려왔는지 기억해 두기 때문에, 나중에 업그레이드하면 그 판매는 여러분 몫이에요.' },
      { q: '배지는 어떤 역할을 하나요?', a: 'Perlink 사이트에는 “Made with Perlink” 배지가 표시돼요. 코드를 추가하면 내 사이트의 배지가 방문자를 내 코드와 함께 Perlink로 안내해요.' },
    ],
  },
} satisfies Record<AppLanguage, unknown>
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
const pageUrl = computed(() => `${SITE}${local('/affiliates')}`)
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
  htmlAttrs: { lang: () => LANGUAGE_INFO[lang.value].html },
  link: () => [
    { rel: 'canonical', href: pageUrl.value },
    ...alternateLinks('/affiliates'),
  ],
})

const { locale, setLocale } = useI18n()
onMounted(() => {
  if (lang.value !== 'en' && locale.value !== lang.value) setLocale(lang.value)
})
</script>
