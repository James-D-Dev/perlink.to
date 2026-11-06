import type { WeddingTopic } from './types'

// The 3D room: Perlink's own kind of wedding invitation, a small room with
// the couple's photos on the walls, a guestbook of wishes and wedding
// decorations (the Wedding room pack: shared/roomPacks)

export const ROOM_TOPIC: WeddingTopic = {
  id: 'room',
  path: { en: 'wedding-invitation-with-3d-room', vi: 'thiep-cuoi-phong-3d' },
  templates: ['wedding-invite', 'wedding-night-gold', 'invite-wedding-garden', 'wedding-korean', 'love-anniversary', 'wedding-photo'],
  updated: '2026-11-06',
  readMinutes: 6,
  en: {
    seoTitle: 'Wedding Invitation with a 3D Room for Your Photos',
    description: 'A wedding invitation with a 3D room: your pre-wedding photos on the walls, wishes from guests, wedding decorations and a tour video to share. Free to start.',
    eyebrow: '3D wedding room',
    title: 'A wedding invitation with a 3D room guests can look around',
    intro: 'A 3D wedding room is a small, cosy room on your invitation page with your pre-wedding photos hanging on the walls, lights, flowers and wedding decorations. Guests drag to look around, tap a photo to see it large and leave their wishes in the room’s guestbook. It is the part of the invitation people send to each other, and the part you keep after the wedding.',
    sections: [
      {
        title: 'What the room is',
        paragraphs: [
          'Most online invitations are a page that scrolls. A Perlink invitation can also open a 3D room: a real-time scene that runs in the phone’s browser, with no app to install. Your photos hang in frames on the walls, there is furniture, plants, lamps, and whatever decorations you add. Guests turn the view with a finger and tap any frame to open the photo full size.',
          'You choose how the page opens. Most couples keep the invitation in 2D, so the letter, schedule and reply form come first, and add a "3D room" button that opens the room. You can also make the room the first thing guests see.',
        ],
      },
      {
        title: 'Why couples add one',
        paragraphs: [
          'Pre-wedding photos are often the most beautiful pictures a couple will ever have taken, and on a normal invitation they end up as a grid of thumbnails. In a room, each photo has a wall and a frame, and guests discover them one by one. It feels closer to walking into your home than scrolling a gallery.',
          'It also gets shared. A room is unusual enough that guests send it to each other and post it, which is exactly what you want from an invitation with a reply date.',
        ],
        bullets: [
          'Your best photos, framed on the walls instead of shrunk into a grid.',
          'Something new for guests, so they open it, look around and share it.',
          'A guestbook of wishes that stays in the room after the wedding.',
          'A keepsake: the room is still there on your anniversary.',
        ],
      },
      {
        title: 'Dressing the room for a wedding',
        paragraphs: [
          'Start from a wedding template: its room already has warm colours, framed sample photos and soft lighting. Replace the photos with yours, then add decorations from the catalogue: flowers, plants, lamps, fairy lights, a rug, frames of different sizes.',
          'For a full wedding look there is the Wedding room pack: a wedding arch, a wedding cake, a champagne tower, LOVE marquee letters, candle lanterns and a sparkler fountain. It is a one-time purchase of $6 on its own, and included in the one-time Wedding pass.',
        ],
        bullets: [
          'Choose 6 to 10 photos. Fewer, larger photos look better than many small ones.',
          'Put your favourite on the wall guests see first.',
          'Mix portrait and landscape shots so the walls do not look like a grid.',
          'Set the room to night, with fairy lights or candle lanterns, for an evening reception.',
        ],
      },
      {
        title: 'Wishes in the room',
        paragraphs: [
          'The room can hold a guestbook. Guests write a few words of congratulations, which appear in the room for you and for everyone who visits after them. Unlike messages scattered across chats, they stay in one place.',
          'Wishes are separate from replies. The reply form on the page is for "coming or not, and how many", and those answers go to your inbox; the guestbook is for the kind words, shown to everyone.',
        ],
      },
      {
        title: 'A tour video for TikTok, Reels and Zalo',
        paragraphs: [
          'From the room editor you can record a short tour video that moves through the room, ready to post or send. It is a good way to announce the wedding to friends who will not open a link from a chat. Free videos carry a small Perlink watermark; paid plans, including the Wedding pass, record without it.',
        ],
      },
      {
        title: 'Will it work on every guest’s phone?',
        paragraphs: [
          'The room runs in the browser on recent iPhones and Android phones and on computers. It only loads when a guest opens it, so the invitation itself stays fast for everyone, including guests on an old phone or a slow connection. If a phone cannot show 3D, the rest of the invitation works as usual.',
          'For photos, ask your photographer for web-sized JPEG files, about 2000 pixels on the long side. They look sharp in the frames and load quickly for guests on mobile data.',
        ],
      },
    ],
    stepsTitle: 'Add a 3D room in five steps',
    steps: [
      { title: 'Pick a wedding template', text: 'Its room comes dressed for a wedding, with sample photos in the frames.' },
      { title: 'Hang your photos', text: 'Replace the sample photos with 6 to 10 of your favourites.' },
      { title: 'Decorate', text: 'Add flowers, lights and, if you like, the Wedding pack’s arch, cake and lanterns.' },
      { title: 'Choose how it opens', text: 'Invitation first with a "3D room" button, or the room first.' },
      { title: 'Share and record', text: 'Send the link, and record a tour video for social media.' },
    ],
    faq: [
      { q: 'Do guests need an app to see the room?', a: 'No. The room runs in the phone’s browser from the same link as the invitation.' },
      { q: 'Is the 3D room free?', a: 'Yes. The room, your photos, the standard decorations and the guestbook are free. The Wedding room pack of premium decorations is a one-time $6, or included in the Wedding pass.' },
      { q: 'How many photos can we hang?', a: 'Enough for several walls of frames. In practice 6 to 10 large photos look best; put the rest in the photo album on the page.' },
      { q: 'Will the room slow down the invitation?', a: 'No. It only loads when a guest opens it, so the letter, schedule and reply form appear first and fast.' },
      { q: 'What happens to the room after the wedding?', a: 'It stays at the same address. Many couples swap in their wedding-day photos afterwards and keep it as an anniversary page.' },
    ],
    ctaTitle: 'Hang your photos in your own wedding room',
    ctaText: 'Choose a wedding template, replace the photos in the frames with yours and send guests an invitation they will actually look around. Free to start.',
  },
  vi: {
    seoTitle: 'Thiệp cưới online có phòng 3D treo ảnh cưới',
    description: 'Thiệp cưới online có phòng 3D: treo ảnh cưới lên tường, khách để lại lời chúc, trang trí cổng hoa, bánh cưới, tháp ly và quay video đăng TikTok. Miễn phí để bắt đầu.',
    eyebrow: 'Thiệp cưới phòng 3D',
    title: 'Thiệp cưới có phòng 3D: treo ảnh cưới lên tường cho khách ngắm',
    intro: 'Phòng 3D trên thiệp cưới là một căn phòng nhỏ, ấm cúng ngay trong trang thiệp, với ảnh cưới của hai bạn treo trong khung trên tường, đèn, hoa và đồ trang trí cưới. Khách dùng ngón tay xoay để nhìn quanh, chạm vào ảnh để xem lớn, và để lại lời chúc trong sổ lưu bút của phòng. Đây là phần khách hay gửi cho nhau nhất, và cũng là phần hai bạn giữ lại sau đám cưới.',
    sections: [
      {
        title: 'Phòng 3D là gì',
        paragraphs: [
          'Phần lớn thiệp cưới online là một trang để cuộn. Thiệp trên Perlink còn mở được một căn phòng 3D: một không gian chạy trực tiếp trên trình duyệt điện thoại, khách không phải cài ứng dụng gì. Ảnh của hai bạn treo trong khung trên tường, có bàn ghế, cây xanh, đèn, cùng những món trang trí bạn chọn. Khách xoay góc nhìn bằng ngón tay, chạm vào khung ảnh nào là ảnh đó mở to.',
          'Bạn chọn trang mở ra thế nào. Phần lớn cặp đôi để thiệp ở dạng 2D, lá thư, lịch trình và form xác nhận hiện trước, kèm một nút "Phòng 3D" để mở phòng. Bạn cũng có thể để căn phòng là thứ đầu tiên khách nhìn thấy.',
        ],
      },
      {
        title: 'Vì sao nên có phòng 3D',
        paragraphs: [
          'Bộ ảnh cưới thường là những tấm ảnh đẹp nhất mà hai bạn từng chụp, vậy mà trên thiệp thông thường chúng chỉ là một lưới ảnh nhỏ. Trong căn phòng, mỗi tấm ảnh có một bức tường, một cái khung, và khách khám phá từng tấm một. Cảm giác giống được bước vào tổ ấm của hai bạn hơn là lướt một bộ sưu tập ảnh.',
          'Phòng 3D cũng được chia sẻ nhiều hơn. Nó đủ lạ để khách gửi cho nhau, đăng lên mạng, và đó chính là điều bạn muốn ở một tấm thiệp cần mọi người xác nhận đúng hạn.',
        ],
        bullets: [
          'Những tấm ảnh đẹp nhất được treo trong khung, không bị thu nhỏ thành lưới.',
          'Một trải nghiệm mới, khách tò mò mở ra, xoay xem và gửi cho bạn bè.',
          'Sổ lưu bút lời chúc vẫn nằm lại trong phòng sau ngày cưới.',
          'Một kỷ niệm: căn phòng vẫn ở đó vào ngày kỷ niệm ngày cưới.',
        ],
      },
      {
        title: 'Trang trí phòng cho đám cưới',
        paragraphs: [
          'Hãy bắt đầu từ một mẫu thiệp cưới: phòng của mẫu đã có sẵn tông màu ấm, khung ảnh mẫu và ánh sáng dịu. Thay ảnh mẫu bằng ảnh của hai bạn, rồi thêm đồ trang trí trong thư viện: hoa, cây, đèn, dây đèn, thảm, khung ảnh đủ kích cỡ.',
          'Muốn căn phòng ra chất đám cưới hẳn hoi thì có gói đồ trang trí phòng 3D Đám cưới: cổng hoa cưới, bánh cưới, tháp ly sâm panh, chữ LOVE phát sáng, đèn lồng nến và pháo hoa lạnh. Gói này mua một lần, giá 6 đô la nếu mua riêng, và có sẵn trong gói Đám cưới 199.000đ.',
        ],
        bullets: [
          'Chọn 6 đến 10 tấm ảnh. Ít ảnh mà to sẽ đẹp hơn nhiều ảnh nhỏ.',
          'Treo tấm đẹp nhất lên bức tường khách nhìn thấy đầu tiên.',
          'Xen kẽ ảnh dọc và ảnh ngang để tường không giống một lưới ảnh.',
          'Để phòng ở chế độ ban đêm, thêm dây đèn hay đèn lồng nến, rất hợp với tiệc cưới buổi tối.',
        ],
      },
      {
        title: 'Lời chúc trong phòng',
        paragraphs: [
          'Căn phòng có sổ lưu bút. Khách viết vài lời chúc mừng, lời chúc hiện ngay trong phòng cho hai bạn và cho cả những người ghé thăm sau. Không như tin nhắn rải rác khắp các nhóm chat, mọi lời chúc nằm chung một chỗ.',
          'Lời chúc khác với xác nhận tham dự. Form xác nhận trên trang là để khách trả lời "có đến không, đi mấy người", câu trả lời gửi về hộp thư của bạn; còn sổ lưu bút là để gửi những lời yêu thương, ai ghé thăm phòng cũng đọc được.',
        ],
      },
      {
        title: 'Quay video phòng đăng TikTok, Reels, Zalo',
        paragraphs: [
          'Trong trình chỉnh sửa phòng, bạn quay được một video ngắn lướt qua căn phòng, sẵn để đăng hoặc gửi. Đây là cách hay để báo tin cưới với những người bạn ít khi bấm vào link trong nhóm chat. Video ở gói miễn phí có một logo Perlink nhỏ; các gói trả phí, kể cả gói Đám cưới, quay video không có logo.',
        ],
      },
      {
        title: 'Điện thoại của khách có xem được không',
        paragraphs: [
          'Phòng chạy trên trình duyệt của iPhone và điện thoại Android đời gần đây, và trên máy tính. Phòng chỉ tải khi khách mở ra, nên bản thân tấm thiệp vẫn nhanh với mọi người, kể cả khách dùng điện thoại cũ hay mạng chậm. Nếu máy không hiển thị được 3D, phần còn lại của thiệp vẫn dùng bình thường.',
          'Về ảnh, hãy xin thợ chụp bản JPEG cho web, cạnh dài khoảng 2000 pixel. Ảnh vẫn sắc nét trong khung mà khách dùng 4G vẫn tải nhanh.',
        ],
      },
    ],
    stepsTitle: 'Thêm phòng 3D vào thiệp cưới trong năm bước',
    steps: [
      { title: 'Chọn mẫu thiệp cưới', text: 'Phòng của mẫu đã được trang trí sẵn cho đám cưới, có ảnh mẫu trong khung.' },
      { title: 'Treo ảnh cưới', text: 'Thay ảnh mẫu bằng 6 đến 10 tấm ảnh hai bạn thích nhất.' },
      { title: 'Trang trí', text: 'Thêm hoa, đèn, và nếu muốn thì cổng hoa, bánh cưới, đèn lồng của gói Đám cưới.' },
      { title: 'Chọn cách mở', text: 'Thiệp hiện trước kèm nút "Phòng 3D", hoặc phòng 3D hiện ngay.' },
      { title: 'Gửi và quay video', text: 'Gửi link cho khách, quay một video phòng để đăng lên mạng xã hội.' },
    ],
    faq: [
      { q: 'Khách có phải cài ứng dụng để xem phòng không?', a: 'Không. Phòng chạy trên trình duyệt điện thoại, ngay trong link thiệp cưới.' },
      { q: 'Phòng 3D có miễn phí không?', a: 'Có. Căn phòng, ảnh của bạn, đồ trang trí thông thường và sổ lưu bút đều miễn phí. Gói đồ trang trí Đám cưới cao cấp mua một lần 6 đô la, hoặc có sẵn trong gói Đám cưới.' },
      { q: 'Treo được bao nhiêu ảnh?', a: 'Đủ cho nhiều bức tường. Thực tế 6 đến 10 tấm ảnh lớn là đẹp nhất; số ảnh còn lại để trong album ảnh trên trang.' },
      { q: 'Phòng 3D có làm thiệp tải chậm không?', a: 'Không. Phòng chỉ tải khi khách mở ra, nên lá thư, lịch trình và form xác nhận vẫn hiện trước và nhanh.' },
      { q: 'Sau đám cưới căn phòng thì sao?', a: 'Vẫn ở nguyên địa chỉ cũ. Nhiều cặp đôi thay ảnh cưới bằng ảnh ngày cưới thật và giữ làm trang kỷ niệm.' },
    ],
    ctaTitle: 'Treo ảnh cưới trong căn phòng của riêng hai bạn',
    ctaText: 'Chọn một mẫu thiệp cưới, thay ảnh trong khung bằng ảnh của hai bạn, và gửi khách một tấm thiệp mà ai cũng muốn xoay xem. Miễn phí để bắt đầu.',
  },
}
