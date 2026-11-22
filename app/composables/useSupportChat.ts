/** Whether the dashboard's chat with support is open (shared, so the sidebar and help can open it) */
export function useSupportChat() {
  return useState('support-chat-open', () => false)
}
