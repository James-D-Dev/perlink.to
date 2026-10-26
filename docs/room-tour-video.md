# Room tour video (TikTok / Reels / Shorts)

Owners turn their 3D room into a vertical video to post on TikTok: the camera
sweeps through the room, the site's name and `perlink.to/<name>` stay on top,
the room's music plays, and the last second and a half is a "visit my 3D room"
card. Every video posted is an ad that points back to Perlink.

Where: site editor → **3D room** tab → **Chia sẻ phòng của bạn** ("Share
your room") on the "Your 3D room" card, next to **Trang trí phòng**. It's a
gradient button whose icon cycles through the Facebook, TikTok, YouTube,
Instagram and X logos, each a solid circle in its brand colour
(`SocialCycleIcon.vue`), with like and heart reactions floating up from it
as on a live video (`ReactionBurst.vue`; busier on hover, off for reduced
motion). It saves the page and
opens the 3D room editor with `?record=1`, which opens the video studio
straight away (`autoRecord` on RoomStudio; the flag is removed from the
address).

The studio is a full-screen view over the paused editor, not a dialog: it
can't be dismissed by tapping outside or Escape. **Quay lại** (Back) closes it
and returns to the site editor (asking first if the room has unsaved
changes).

## How it works

Everything happens in the browser; nothing is uploaded.

```
RoomTourRecorder.vue (full-screen studio)
  ├─ setup: still = editor snapshot in the video's light, cropped to 9:16 + titles
  ├─ hidden 540×960 box ──► RoomScene({ capture: true })     pixel ratio 2 → 1080×1920
  │                          made when recording starts, disposed when it ends
  │                          renderTour(progress) → WebGL canvas
  ├─ <canvas 1080×1920> ◄── drawFrame(p): copy the WebGL frame, then draw
  │                          title, perlink.to pill, watermark, end card
  ├─ canvas.captureStream(30) + room music (AudioContext → MediaStreamDestination)
  └─ MediaRecorder → Blob → <video> preview, Download, Share (navigator.share)
```

- **Format:** MP4 (H.264/AAC) where the browser can record it (Chrome 126+,
  Safari), otherwise WebM. About 10 MB for 8 s at 10 Mbps.
- **Camera styles** (`RoomScene.renderTour(progress, style)`, `TOUR_STYLES`),
  picked in the studio. Distances scale with the room size; every path stays
  on the room's open sides (azimuth 0 → π/2), where no wall is in the way:
  - *Sweep* (default): across the open side while moving in, then up and back
    to show the land.
  - *Orbit*: an even, higher arc from one open side to the other.
  - *Fly in*: a drone shot from high above the land down into the room.
  - *Pull out*: close at eye level, then up and out to the whole land.
- **Capture mode** (`RoomSceneOptions.capture`): best quality, fixed 2× pixel
  ratio, no adaptive downgrade, controls off, and the scene draws no frames of
  its own. The recorder draws each frame, so timing follows the recording.
- **Preview without a second 3D scene:** while setting up, the frame shows a
  still of the editor's own view (`RoomCanvas.snapshot(light)`, taken in the
  same day/night light the video uses) with the titles drawn over it. The
  recording scene exists only while recording. The still can look a little
  plainer than the video at night: the editor may run at a lower quality
  tier, where fewer lamps cast real light.
- **While the studio is open** the editor hides every control and pauses its
  own scene (`RoomScene.setPaused`). While recording, the frame being
  recorded shows with a status bar (red dot, 0:05 / 0:12, progress) and
  Cancel; when done the video plays in the frame with Share, Download, the
  caption, Back and Record again.
- **Smoothness:** frames are drawn at 30 fps and pushed to the video with
  `captureStream(0)` + `requestFrame()` (fixed-rate capture where that isn't
  supported).
- **Sound:** the track is fetched and decoded up front and played by Web Audio
  (`AudioBufferSourceNode`), so main-thread hiccups can't make it skip; a quiet
  intro is skipped and the fade-out is scheduled ahead.
- **Before recording:** waits up to 6 s for objects still loading (`scene.loading`).
- **Options:** title text (no label, placeholder only) and three icon buttons: day/night, length (8/12/15 s, tap to cycle), music on/off. Then [Back] [Record].
- **Watermark:** a small "Tạo bằng Perlink" in the corner on plans without
  `removeBranding` (Free, Starter). Plus and Pro have none.
- **Share:** on phones `navigator.share({ files, text })` opens the share
  sheet with the video and a suggested caption (link and hashtags), so it
  goes straight to TikTok or Zalo. The ready screen is one row: Back (to the
  options), Share, Download.

| File | Role |
|---|---|
| `app/components/room/RoomTourRecorder.vue` | Full-screen studio, drawing, recording, download/share |
| `app/utils/room/RoomScene.ts` | `capture` option, `renderTour()`, `loading`, `snapshot(light)` |
| `app/components/room/RoomStudio.vue` | Mounts the recorder, gives it the still, pauses the editor, goes back on close |
| `app/components/room/SocialCycleIcon.vue` | Cycling social logos on the site editor's button |
| `i18n/locales/*/room.json` → `room.tour` | Texts |

## Notes

- Music comes from `app/data/roomMusic.ts` (Pixabay licence). Tracks marked
  `contentId` are registered with YouTube Content ID, so a YouTube upload with
  them may get a claim; TikTok and Reels are not affected by that system.
- Recording runs in real time: a 12 s video takes 12 s. Keep the tab in front;
  browsers slow down hidden tabs.
- Ideas next: a still image for Stories, more camera paths (close-ups of
  framed photos), showing the products on shelves once the 3D shop exists.
