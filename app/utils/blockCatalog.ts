// The blocks you can add to a page: icon, colour group and search words.
// Shared by the "Add block" picker and the block rows in the editor, so a
// block looks the same in both.

export interface BlockOption {
  id: string
  key: string
  icon: string
  group: 'content' | 'business' | 'extras'
  /** Extra words people may search for */
  keywords: string
}

export const BLOCK_CATALOG: BlockOption[] = [
  { id: 'links', key: 'links', icon: 'i-lucide-link', group: 'content', keywords: 'link url website button liên kết nút' },
  { id: 'social', key: 'social', icon: 'i-lucide-at-sign', group: 'content', keywords: 'instagram facebook tiktok zalo youtube mạng xã hội' },
  { id: 'text', key: 'text', icon: 'i-lucide-text', group: 'content', keywords: 'about intro paragraph giới thiệu văn bản đoạn' },
  { id: 'image-album', key: 'imageAlbum', icon: 'i-lucide-images', group: 'content', keywords: 'photo gallery picture ảnh hình album' },
  { id: 'video', key: 'video', icon: 'i-lucide-clapperboard', group: 'content', keywords: 'youtube tiktok vimeo video clip' },
  { id: 'menu', key: 'menu', icon: 'i-lucide-utensils', group: 'business', keywords: 'price list services rooms thực đơn bảng giá dịch vụ phòng món' },
  { id: 'hours', key: 'hours', icon: 'i-lucide-clock', group: 'business', keywords: 'opening hours giờ mở cửa lịch' },
  { id: 'contact', key: 'contact', icon: 'i-lucide-map-pin', group: 'business', keywords: 'address phone map email địa chỉ điện thoại bản đồ liên hệ' },
  { id: 'form', key: 'form', icon: 'i-lucide-calendar-check', group: 'business', keywords: 'booking reservation appointment rsvp đặt lịch đặt bàn đặt chỗ form' },
  { id: 'products', key: 'products', icon: 'i-lucide-shopping-bag', group: 'business', keywords: 'shop store product sell order shopee tiktok shop lazada sản phẩm bán hàng đặt hàng cửa hàng' },
  { id: 'testimonials', key: 'testimonials', icon: 'i-lucide-quote', group: 'business', keywords: 'reviews feedback đánh giá cảm nhận khách hàng' },
  { id: 'vietqr', key: 'vietqr', icon: 'i-lucide-qr-code', group: 'extras', keywords: 'bank transfer payment donate qr chuyển khoản thanh toán ủng hộ ngân hàng' },
  { id: 'birthday-countdown', key: 'birthdayCountdown', icon: 'i-lucide-cake', group: 'extras', keywords: 'countdown birthday event đếm ngược sinh nhật sự kiện' },
]

/** Icon tile colours by group */
export const BLOCK_TINT = {
  content: 'bg-sky-50 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300',
  business: 'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
  extras: 'bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300',
} as const

const BY_ID = new Map(BLOCK_CATALOG.map(b => [b.id, b]))

/** A block's icon and tile colour, by block name */
export function blockLook(id: string) {
  const block = BY_ID.get(id)
  return block ? { icon: block.icon, tint: BLOCK_TINT[block.group] } : null
}
