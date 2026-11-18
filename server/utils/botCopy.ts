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
  zh: {
    help: 'Perlink 会把你所有网站的新订单和新请求发送到这里。要连接，请打开 perlink.to → 设置 → 通知 → 连接 Telegram。发送 /stop 即可关闭。',
    expired: '这个链接已过期。请回到 Perlink 再次点击“连接 Telegram”。',
    connected: '✅ <b>已连接 Perlink！</b>新订单和新请求会发送到这里。发送 /stop 即可关闭。',
    stopped: 'Perlink 通知已关闭。',
    test: '✅ <b>Perlink</b>：通知运行正常。新订单和新请求会发送到这里。',
  },
  ja: {
    help: 'Perlink は、あなたのサイトに届いた新しい注文やリクエストをここにお送りします。接続するには、perlink.to → 設定 → 通知 → 「Telegram を接続」を開いてください。/stop を送ると通知を停止できます。',
    expired: 'このリンクは有効期限が切れています。Perlink でもう一度「Telegram を接続」を押してください。',
    connected: '✅ <b>Perlink に接続しました！</b>新しい注文やリクエストがここに届きます。/stop を送ると通知を停止できます。',
    stopped: 'Perlink の通知を停止しました。',
    test: '✅ <b>Perlink</b>：通知は正常に動作しています。新しい注文やリクエストがここに届きます。',
  },
  ko: {
    help: 'Perlink가 내 사이트의 새 주문과 요청을 여기로 보내드려요. 연결하려면 perlink.to → 설정 → 알림 → Telegram 연결을 여세요. /stop을 보내면 알림이 꺼져요.',
    expired: '링크가 만료되었어요. Perlink에서 "Telegram 연결"을 다시 눌러 주세요.',
    connected: '✅ <b>Perlink에 연결되었어요!</b> 새 주문과 요청이 여기로 도착해요. /stop을 보내면 알림이 꺼져요.',
    stopped: 'Perlink 알림을 껐어요.',
    test: '✅ <b>Perlink</b>: 알림이 잘 작동하고 있어요. 새 주문과 요청이 여기로 도착해요.',
  },
}
