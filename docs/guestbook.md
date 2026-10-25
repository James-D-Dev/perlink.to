# 3D room guestbook and gifts

Visitors to a site's 3D room press **💌 Guestbook** (top right), pick a gift
(flowers, gift box, cake, balloon, teddy bear, star), write their name and a
message. The gift pops up on the lawn in front of the room and the camera
glides to it; anyone can click a gift to read its message. The room fills up
as people visit, which gives owners a reason to share it and visitors a
reason to come back.

Owners get each new message on Telegram (if connected), see them in
**Inbox → Guestbook** (`/dashboard/site/<name>/inbox#guestbook`) where they
can hide or delete them, and can turn the guestbook off with the
book-and-heart button in the 3D room editor's toolbar (save and publish).

## How it works

```
RoomViewer.vue (public 3D page)
  GET  /api/bio/<name>/guestbook     newest 60 visible entries + total
  POST /api/bio/<name>/guestbook     { name, message, gift, website(honeypot) }
       3 per visitor per 10 min (IP hashed per site), Telegram to the owner,
       analytics action 'guestbook'
  RoomCanvas :guests → RoomScene.setGuests(list, animate)
       buildGuestGift() makes each gift from primitives (no files to load),
       guestGiftSpot(i) places it on rings around the open corner (+x,+z),
       standing on the land (raycast down onto land.ground)
  click a gift → onGuestActivate → note card;   hover → "From <name>"
Owner
  GET    /api/admin/bio/<name>/guestbook          all entries
  PATCH  /api/admin/bio/<name>/guestbook/<id>     { hidden }
  DELETE /api/admin/bio/<name>/guestbook/<id>
```

- Data: `guestbook_entries` (migration 0027). On/off: `themeConfig.room.guestbook`
  (missing = on).
- Gift list, emoji and length limits: `shared/guestbook.ts` (used by both sides).
- Visitor texts in all 11 site languages (`guestbook*`, `gift*` in `app/utils/siteI18n.ts`).

| File | Role |
|---|---|
| `app/utils/room/guestGifts.ts` | Gift models, positions, bobbing |
| `app/utils/room/RoomScene.ts` | `setGuests`, `focusGuest`, picking and pop-in |
| `app/components/room/RoomViewer.vue` | Button, panel, note card |
| `app/components/site/SiteGuestbook.vue` | Owner's list in the Inbox |
| `server/api/bio/[username]/guestbook.*.ts` | Public read and post |
| `server/api/admin/bio/[username]/guestbook/*` | Owner hide and delete |

## Ideas next

- Gift room template for birthdays and couples (owner writes first, shares the link)
- Seasonal gifts (lantern for Mid-Autumn, lì xì envelope for Tết)
- Pro: more gift types, owner pins favourite messages
