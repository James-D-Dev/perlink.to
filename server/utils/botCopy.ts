import type { AppLanguage } from '#shared/language'

// What the Perlink Telegram bot says, in the recipient's language (their
// account's choice in Settings; English when the chat isn't linked yet)

export const BOT_COPY: Record<AppLanguage, {
  help: string
  expired: string
  connected: string
  stopped: string
  test: string
}> = {
  en: {
    help: 'Perlink sends the new orders and requests of your sites here. To connect, open perlink.to → Settings → Notifications → Connect Telegram. Send /stop to turn it off.',
    expired: 'This link has expired. Press "Connect Telegram" on Perlink again.',
    connected: '✅ <b>Connected to Perlink!</b> New orders and requests will arrive here. Send /stop to turn it off.',
    stopped: 'Perlink notifications are off.',
    test: '✅ <b>Perlink</b>: notifications are working. New orders and requests will arrive here.',
  },
  vi: {
    help: 'Perlink gửi đơn hàng và yêu cầu mới của các trang của bạn tới đây. Để kết nối, vào perlink.to → Cài đặt → Thông báo → Kết nối Telegram. Gõ /stop để tắt.',
    expired: 'Liên kết đã hết hạn. Hãy bấm lại "Kết nối Telegram" trên Perlink.',
    connected: '✅ <b>Đã kết nối với Perlink!</b> Đơn hàng và yêu cầu mới sẽ được gửi tới đây. Gõ /stop để tắt.',
    stopped: 'Đã tắt thông báo Perlink.',
    test: '✅ <b>Perlink</b>: thông báo đang hoạt động. Đơn hàng và yêu cầu mới sẽ được gửi tới đây.',
  },
}
