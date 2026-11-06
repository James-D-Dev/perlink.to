import type { WeddingTopic } from './types'

// Online vs paper invitations: an honest comparison, and using both (the
// online invitation's QR code printed on the paper card)

export const PAPER_TOPIC: WeddingTopic = {
  id: 'paper',
  path: { en: 'online-vs-paper-wedding-invitations', vi: 'thiep-cuoi-online-hay-thiep-giay' },
  templates: ['wedding-invite', 'invite-wedding-red', 'wedding-song-hy', 'wedding-two-families', 'wedding-vintage', 'wedding-minimal'],
  updated: '2026-11-06',
  readMinutes: 7,
  en: {
    seoTitle: 'Online vs Paper Wedding Invitations: Which to Choose',
    description: 'Online or paper wedding invitations? An honest comparison of cost, etiquette, RSVPs and keepsakes, and how to use both with a QR code on the card.',
    eyebrow: 'Online vs paper',
    title: 'Online vs paper wedding invitations: an honest comparison',
    intro: 'Paper invitations are a keepsake and a gesture of respect; online invitations are cheaper, faster, easy to update and much better at collecting replies. Most couples do not have to choose: send paper to the people who expect it, a link to everyone, and print the link’s QR code on the card so paper guests get the map, schedule and reply form too.',
    sections: [
      {
        title: 'What a paper invitation still does best',
        paragraphs: [
          'A printed card says "we thought about you" in a way a message cannot. For grandparents, family elders, teachers and your parents’ friends, being handed a card in person is part of the invitation itself, and in many families it is expected.',
          'Paper is also the keepsake. Many couples keep one card from their own wedding for decades; few keep a link. If the look of the stationery matters to you, a beautiful card is worth paying for.',
        ],
        bullets: [
          'Shows respect to elders and to guests who expect it.',
          'Lasts: a keepsake for you and for close family.',
          'Works for guests who do not use a smartphone or chat apps.',
          'Feels formal, which suits a large traditional wedding.',
        ],
      },
      {
        title: 'Where paper falls short',
        paragraphs: [
          'Paper costs money per guest, takes weeks to design, print and deliver, and cannot be changed once printed. If the venue changes the room or the time moves, every card is wrong. And it is poor at the practical part: guests lose the card, cannot find the address on the day, and reply by phone, by message, or not at all.',
        ],
        bullets: [
          'Printing and delivery cost for every single guest.',
          'Weeks of lead time, and a reprint if something changes.',
          'No map, no calendar reminder, no easy way to reply.',
          'Hard to reach guests who live abroad in time.',
        ],
      },
      {
        title: 'What an online invitation does better',
        paragraphs: [
          'An online invitation is one link, sent through the apps your guests already use. It costs nothing to send to a hundred people instead of ten, it reaches guests abroad instantly, and it can be updated after sending: change the time and everyone sees the new one on the same link.',
          'It also carries everything a card cannot fit. On Perlink a wedding page has a sealed letter each guest taps to open (with their name on the envelope when you send personal links), a countdown, the schedule of the day, the venue with a map and a button to save the date to their calendar, a reply form whose answers land in your inbox, your photos, a guestbook of wishes in the 3D room, and a bank QR code for guests who want to send a gift from afar.',
        ],
        bullets: [
          'Free to send, to any number of guests, anywhere.',
          'Replies collected for you, with party size and a message.',
          'Directions in one tap, and the date saved to their calendar.',
          'Editable after sending; the link never changes.',
          'Room for photos, music and a story a card cannot hold.',
        ],
      },
      {
        title: 'Where online falls short',
        paragraphs: [
          'Be honest about the downsides too. Some older guests will feel a link is too casual, especially from close family. A link in a busy group chat is easy to miss. And a web page is not a keepsake in the same way a card is.',
          'Each of these has a fix: a phone call or a card for the elders, a personal message with each guest’s own link instead of one group post, and a printed card or photo book for the keepsake.',
        ],
      },
      {
        title: 'Using both: the QR code on the card',
        paragraphs: [
          'The approach most couples land on is both. Print a smaller run of cards for elders and close family, and send a link to everyone else. Then print the online invitation’s QR code on the back of the card with one line, "Scan for the map, schedule and to reply". Paper guests keep the card and still get directions on the day.',
          'On Perlink you download your site’s QR code from the dashboard as an image and send it to your printer with the card design. Because the QR code points to your page and not to a fixed file, it keeps working when you update the details.',
        ],
      },
      {
        title: 'Two families, one link',
        paragraphs: [
          'When the groom’s and the bride’s families each print their own cards with their own reception times, the online invitation can follow the same split. Make one page with a Groom’s side tab and a Bride’s side tab. Print the QR code that opens the groom’s side on his family’s cards and the bride’s side on hers; both lead to the same page, so shared friends see both.',
        ],
      },
    ],
    table: {
      title: 'Online and paper, side by side',
      columns: ['', 'Online invitation', 'Paper invitation'],
      rows: [
        ['Cost per guest', 'Nothing to send', 'Printing and delivery for each'],
        ['Time to send', 'Minutes', 'Weeks: design, print, deliver'],
        ['Change after sending', 'Edit; same link', 'Reprint or call everyone'],
        ['Replies', 'Form, counted for you', 'Phone calls and messages'],
        ['Map and calendar', 'One tap', 'Address printed only'],
        ['Guests abroad', 'Instant', 'Slow, often late'],
        ['Keepsake', 'A page, not a thing to keep', 'A card to keep for years'],
        ['Elders and tradition', 'May feel casual', 'Expected and respectful'],
      ],
    },
    stepsTitle: 'Use both in five steps',
    steps: [
      { title: 'Split your guest list', text: 'Mark who should get a card in hand: elders, close family, teachers. Everyone gets the link.' },
      { title: 'Make the online invitation', text: 'Start from a wedding template, add the letter, schedule, venue, reply form and photos.' },
      { title: 'Download the QR code', text: 'Get your site’s QR code from the dashboard and add it to the back of the card design.' },
      { title: 'Print a smaller run', text: 'Only the cards you will actually hand out, plus a few spares and one to keep.' },
      { title: 'Send personal links', text: 'Send each remaining guest their own link, with their name on the envelope.' },
    ],
    faq: [
      { q: 'Is it rude to send a wedding invitation online?', a: 'Not for friends, colleagues and most family today. For elders and anyone who would expect a card, hand them one or call first, then send the link for the details.' },
      { q: 'How many paper invitations should we print if we also send online?', a: 'Only the ones you will hand out in person, usually elders and close family, plus about ten percent spare and one for yourselves.' },
      { q: 'Will the QR code on the card stop working if we change the details?', a: 'No. It points to your page, so it always opens the latest version.' },
      { q: 'Can paper guests reply online?', a: 'Yes. They scan the QR code on the card and use the reply form on the page, the same as everyone else.' },
      { q: 'How much does an online invitation cost on Perlink?', a: 'Making and sending it is free, with the letter, countdown, schedule, reply form, guestbook, gift QR and music. A one-time Wedding pass adds Pro themes and shows which guests opened their invitation.' },
    ],
    ctaTitle: 'Make the online half in an afternoon',
    ctaText: 'Choose a wedding template, add your details, download the QR code for your paper cards and send everyone else a personal link. Free to start.',
  },
  vi: {
    seoTitle: 'Thiệp cưới online hay thiệp giấy? So sánh thật lòng',
    description: 'Nên dùng thiệp cưới online hay thiệp giấy? So sánh chi phí, phép lịch sự, xác nhận tham dự, giữ làm kỷ niệm, và cách dùng cả hai bằng mã QR in trên thiệp giấy.',
    eyebrow: 'Thiệp online hay thiệp giấy',
    title: 'Thiệp cưới online hay thiệp giấy? So sánh thật lòng để chọn cho đúng',
    intro: 'Thiệp giấy là kỷ niệm và là sự kính trọng với người lớn. Thiệp online thì rẻ hơn, nhanh hơn, sửa được sau khi gửi và thu xác nhận tham dự tốt hơn nhiều. Phần lớn các cặp đôi không phải chọn một: trao thiệp giấy cho những người cần trao tận tay, gửi link cho tất cả, rồi in mã QR của thiệp online lên thiệp giấy để khách cầm thiệp vẫn có bản đồ, lịch trình và form xác nhận.',
    sections: [
      {
        title: 'Thiệp giấy vẫn làm tốt nhất điều gì',
        paragraphs: [
          'Ở Việt Nam, mang thiệp đến tận nhà là một phần của lời mời. Với ông bà, các cụ trong họ, thầy cô, bạn của bố mẹ, việc được trao thiệp tận tay thể hiện sự tôn trọng mà một tin nhắn khó thay thế. Nhiều gia đình, nhất là ở quê, vẫn coi đó là phép lịch sự bắt buộc.',
          'Thiệp giấy cũng là kỷ niệm. Rất nhiều người giữ tấm thiệp cưới của chính mình hàng chục năm, còn ít ai giữ một đường link. Nếu bạn yêu thích thiệp đẹp, một mẫu thiệp in chỉn chu là đáng tiền.',
        ],
        bullets: [
          'Thể hiện sự kính trọng với người lớn tuổi và họ hàng.',
          'Giữ được lâu, làm kỷ niệm cho hai bạn và gia đình.',
          'Hợp với khách không dùng điện thoại thông minh hay Zalo.',
          'Trang trọng, hợp với đám cưới truyền thống đông khách.',
        ],
      },
      {
        title: 'Thiệp giấy bất tiện ở đâu',
        paragraphs: [
          'Thiệp giấy tốn tiền in cho từng khách, mất vài tuần để chọn mẫu, in và đi phát, và không sửa được sau khi in. Nhà hàng đổi sảnh hay lùi giờ là cả xấp thiệp sai. Thiệp cũng không giúp gì phần thực tế: khách làm mất thiệp, đến hôm cưới không tìm được địa chỉ, còn xác nhận thì qua điện thoại, tin nhắn, hoặc chẳng ai xác nhận.',
        ],
        bullets: [
          'Tốn chi phí in và công đi phát cho từng người.',
          'Mất nhiều tuần chuẩn bị, sai một chi tiết là in lại.',
          'Không có bản đồ chỉ đường, không có nhắc lịch, khó xác nhận.',
          'Khó gửi kịp cho người thân ở nước ngoài.',
        ],
      },
      {
        title: 'Thiệp online làm tốt hơn ở đâu',
        paragraphs: [
          'Thiệp cưới online là một đường link gửi qua Zalo, Messenger hay bất kỳ ứng dụng nào khách đang dùng. Gửi cho một trăm người hay mười người đều không tốn thêm đồng nào, người thân ở nước ngoài nhận được ngay, và sửa được sau khi gửi: đổi giờ trên trang là mọi khách thấy giờ mới trên cùng link.',
          'Thiệp online cũng chứa được những thứ tấm thiệp giấy không có chỗ. Trên Perlink, một trang thiệp cưới có lá thư niêm phong khách chạm để mở (phong bì ghi đúng tên khách khi bạn gửi link riêng), đếm ngược đến ngày cưới, lịch trình, địa điểm kèm bản đồ và nút lưu ngày cưới vào lịch điện thoại, form xác nhận tham dự gửi thẳng về hộp thư của bạn, album ảnh cưới, sổ lưu bút trong phòng 3D và mã QR mừng cưới cho khách ở xa.',
        ],
        bullets: [
          'Gửi miễn phí, cho bao nhiêu khách cũng được, ở đâu cũng nhận.',
          'Xác nhận tham dự được ghi lại sẵn, kèm số người đi cùng.',
          'Chỉ đường một chạm, ngày cưới lưu vào lịch điện thoại.',
          'Sửa được sau khi gửi, link không đổi.',
          'Có chỗ cho ảnh cưới, nhạc nền và câu chuyện tình yêu.',
        ],
      },
      {
        title: 'Thiệp online kém ở đâu',
        paragraphs: [
          'Cũng nên thật lòng với nhược điểm. Một số người lớn tuổi sẽ thấy nhận thiệp qua tin nhắn là xuề xòa, nhất là từ họ hàng gần. Link thả vào nhóm chat đông người rất dễ bị trôi. Và một trang web không phải là kỷ vật để cầm trên tay như tấm thiệp.',
          'Mỗi điểm đều có cách khắc phục: với người lớn thì vẫn mang thiệp giấy đến hoặc gọi điện mời trước, với nhóm chat thì nhắn riêng từng người kèm link có tên họ, còn kỷ niệm thì giữ vài tấm thiệp in hoặc một cuốn album.',
        ],
      },
      {
        title: 'Dùng cả hai: in mã QR lên thiệp giấy',
        paragraphs: [
          'Cách nhiều cặp đôi chọn nhất là dùng cả hai. In ít thiệp giấy hơn, chỉ để trao cho người lớn và họ hàng thân, còn lại gửi link. Sau đó in mã QR của thiệp online ở mặt sau thiệp giấy kèm một dòng "Quét mã để xem bản đồ, lịch trình và xác nhận tham dự". Khách cầm thiệp giấy vẫn có chỉ đường vào đúng hôm cưới.',
          'Trên Perlink, bạn tải mã QR của trang dưới dạng ảnh ngay trong trang quản lý, rồi gửi cho nhà in cùng file thiết kế thiệp. Vì mã QR dẫn tới trang của bạn chứ không phải một file cố định, nó vẫn dùng được khi bạn sửa thông tin.',
        ],
      },
      {
        title: 'Hai nhà in thiệp riêng, một link chung',
        paragraphs: [
          'Khi nhà trai và nhà gái mỗi bên in thiệp riêng với giờ tiệc riêng, thiệp online cũng chia y như vậy. Làm một trang có hai tab "Nhà trai" và "Nhà gái". Thiệp giấy nhà trai in mã QR mở sẵn tab nhà trai, thiệp nhà gái in mã mở tab nhà gái; cả hai cùng dẫn về một trang, nên bạn bè chung của hai người vẫn xem được cả hai lịch.',
        ],
      },
    ],
    table: {
      title: 'Thiệp online và thiệp giấy, đặt cạnh nhau',
      columns: ['', 'Thiệp cưới online', 'Thiệp giấy'],
      rows: [
        ['Chi phí mỗi khách', 'Gửi không tốn tiền', 'Tiền in và công đi phát'],
        ['Thời gian chuẩn bị', 'Vài phút để gửi', 'Vài tuần: chọn mẫu, in, phát'],
        ['Sửa sau khi gửi', 'Sửa trên trang, link giữ nguyên', 'In lại hoặc gọi báo từng người'],
        ['Xác nhận tham dự', 'Form, tự đếm số khách', 'Gọi điện, nhắn tin'],
        ['Bản đồ, nhắc lịch', 'Một chạm', 'Chỉ có địa chỉ in sẵn'],
        ['Khách ở nước ngoài', 'Nhận ngay', 'Chậm, dễ trễ'],
        ['Giữ làm kỷ niệm', 'Là một trang web', 'Giữ được nhiều năm'],
        ['Người lớn tuổi', 'Có thể thấy xuề xòa', 'Đúng phép, trang trọng'],
      ],
    },
    stepsTitle: 'Dùng cả hai trong năm bước',
    steps: [
      { title: 'Chia danh sách khách', text: 'Đánh dấu ai cần được trao thiệp tận tay: ông bà, họ hàng, thầy cô. Ai cũng nhận link.' },
      { title: 'Làm thiệp online', text: 'Chọn mẫu thiệp cưới, thêm lá thư, lịch trình, địa điểm, form xác nhận và ảnh cưới.' },
      { title: 'Tải mã QR', text: 'Tải mã QR của trang trong trang quản lý và đưa vào mặt sau thiệp giấy.' },
      { title: 'In ít thiệp hơn', text: 'Chỉ in số thiệp sẽ trao tận tay, thêm vài tấm dự phòng và một tấm để giữ.' },
      { title: 'Gửi link riêng', text: 'Gửi cho từng khách còn lại một link có tên họ trên phong bì.' },
    ],
    faq: [
      { q: 'Mời cưới qua tin nhắn có bị coi là thiếu lịch sự không?', a: 'Với bạn bè, đồng nghiệp và phần lớn người thân hiện nay thì không. Với người lớn tuổi hoặc ai bạn biết sẽ mong được trao thiệp, hãy mang thiệp đến hoặc gọi điện mời trước, rồi gửi link để họ có bản đồ và lịch trình.' },
      { q: 'Nếu đã có thiệp online thì nên in bao nhiêu thiệp giấy?', a: 'Chỉ số thiệp bạn sẽ trao tận tay, thường là người lớn và họ hàng thân, cộng thêm khoảng mười phần trăm dự phòng và một tấm cho chính hai bạn.' },
      { q: 'Sửa thông tin trên trang thì mã QR in trên thiệp có còn dùng được không?', a: 'Có. Mã QR dẫn tới trang của bạn, nên quét lúc nào cũng mở bản mới nhất.' },
      { q: 'Khách cầm thiệp giấy có xác nhận online được không?', a: 'Được. Khách quét mã QR trên thiệp rồi điền form xác nhận trên trang, giống mọi khách khác.' },
      { q: 'Làm thiệp cưới online trên Perlink mất bao nhiêu tiền?', a: 'Tạo và gửi thiệp miễn phí, có lá thư, đếm ngược, lịch trình, form xác nhận, sổ lưu bút, mã QR mừng cưới và nhạc nền. Gói Đám cưới trả một lần 199.000đ thêm các giao diện Pro, gói đồ trang trí phòng 3D Đám cưới và cho xem khách nào đã mở thiệp.' },
    ],
    ctaTitle: 'Làm phần thiệp online trong một buổi chiều',
    ctaText: 'Chọn một mẫu thiệp cưới, điền thông tin, tải mã QR để in lên thiệp giấy, và gửi link riêng cho những khách còn lại. Miễn phí để bắt đầu.',
  },
}
