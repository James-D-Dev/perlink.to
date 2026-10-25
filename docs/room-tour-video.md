# Room tour video (TikTok / Reels / Shorts)

Owners turn their 3D room into a vertical video to post on TikTok: the camera
sweeps through the room, the site's name and `perlink.to/<name>` stay on top,
the room's music plays, and the last second and a half is a "visit my 3D room"
card. Every video posted is an ad that points back to Perlink.

Where: 3D room editor (`/dashboard/room/<name>`) → toolbar **Quay video chia sẻ**
(clapperboard icon).

## How it works

Everything happens in the browser; nothing is uploaded.

```
RoomTourRecorder.vue (modal)
  ├─ hidden 540×960 box ──► RoomScene({ capture: true })     pixel ratio 2 → 1080×1920
  │                          renderTour(progress) → WebGL canvas
  ├─ <canvas 1080×1920> ◄── drawFrame(p): copy the WebGL frame, then draw
  │                          title, perlink.to pill, watermark, end card
  ├─ canvas.captureStream(30) + room music (AudioContext → MediaStreamDestination)
  └─ MediaRecorder → Blob → <video> preview, Download, Share (navigator.share)
```

- **Format:** MP4 (H.264/AAC) where the browser can record it (Chrome 126+,
  Safari), otherwise WebM. About 10 MB for 8 s at 10 Mbps.
- **Camera path** (`RoomScene.renderTour`): for the first 78 % it sweeps across
  the open side of the room (azimuth 0.18 → π/2−0.18) while moving in; then it
  rises and pulls back to show the land. Distances scale with the room size.
- **Capture mode** (`RoomSceneOptions.capture`): best quality, fixed 2× pixel
  ratio, no adaptive downgrade, controls off, and the scene draws no frames of
  its own. The recorder draws each frame, so timing follows the recording.
- **Before recording:** waits up to 6 s for objects still loading (`scene.loading`).
- **Options:** title text (no label, placeholder only) and three icon buttons at the bottom: day/night, length (8/12/15 s, tap to cycle), music on/off.
- **Watermark:** a small "Tạo bằng Perlink" in the corner on plans without
  `removeBranding` (Free, Starter). Plus and Pro have none.
- **Share:** on phones `navigator.share({ files })` opens the share sheet, so
  the video goes straight to TikTok or Zalo. A suggested caption with
  hashtags can be copied.

| File | Role |
|---|---|
| `app/components/room/RoomTourRecorder.vue` | Modal, drawing, recording, download/share |
| `app/utils/room/RoomScene.ts` | `capture` option, `renderTour()`, `loading` |
| `app/components/room/RoomStudio.vue` | Toolbar button, mounts the recorder |
| `i18n/locales/*/room.json` → `room.tour` | Texts |

## Notes

- Music comes from `app/data/roomMusic.ts` (Pixabay licence). Tracks marked
  `contentId` are registered with YouTube Content ID, so a YouTube upload with
  them may get a claim; TikTok and Reels are not affected by that system.
- Recording runs in real time: a 12 s video takes 12 s. Keep the tab in front;
  browsers slow down hidden tabs.
- Ideas next: a still image for Stories, more camera paths (close-ups of
  framed photos), showing the products on shelves once the 3D shop exists.
