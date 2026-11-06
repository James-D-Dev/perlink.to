import type { WeddingTopic } from './types'

// Invitation wording: ready-to-copy lines for formal, casual, family-hosted
// and bilingual invitations, and what an online invitation changes

export const WORDING_TOPIC: WeddingTopic = {
  id: 'wording',
  path: { en: 'wedding-invitation-wording', vi: 'loi-moi-cuoi-hay' },
  templates: ['wedding-invite', 'wedding-song-hy', 'wedding-two-families', 'wedding-minimal', 'wedding-bilingual', 'invite-wedding-garden'],
  updated: '2026-11-06',
  readMinutes: 7,
  en: {
    seoTitle: 'Wedding Invitation Wording: Examples to Copy',
    description: 'Wedding invitation wording you can copy: formal, casual, hosted by both families, bilingual, plus RSVP lines and what to write on an online invitation.',
    eyebrow: 'Invitation wording',
    title: 'Wedding invitation wording you can copy and make your own',
    intro: 'Good wedding invitation wording says five things clearly: who is inviting, who is getting married, when, where, and how to reply. Everything else is tone. Below are ready-made versions for a formal invitation, a relaxed one, one hosted by both families, and a bilingual one, with notes on what changes when the invitation is a link instead of a card.',
    sections: [
      {
        title: 'The five things every invitation must say',
        paragraphs: [
          'Guests read an invitation in a few seconds, usually on their phone, and then they come back to it twice: once to reply and once on the day to find the venue. Wording that buries the time or the address under a long poem makes both of those moments harder.',
          'Before you think about tone, check that your draft answers these, in this order. Then add warmth around them, not instead of them.',
        ],
        bullets: [
          'The host line: who is inviting. Traditionally the parents, today often the couple, or both families together.',
          'The couple: full first names at least. On a formal card, full names; on a casual one, the names your guests call you.',
          'The date and time, written out: "Saturday, 12 December 2026, at four in the afternoon". Add the weekday; people plan by weekdays.',
          'The venue: the name and the full address, plus a map link on an online invitation.',
          'The reply: by when, and how. "Please reply by 30 November" is clearer than "RSVP soon".',
        ],
      },
      {
        title: 'Formal wording',
        paragraphs: [
          'Formal wording suits a church or hotel ceremony, an older guest list, or families who expect it. It is written in the third person, spells out the date and time, and avoids abbreviations. "The honour of your presence" is traditionally used for a religious ceremony and "the pleasure of your company" for a civil ceremony or reception, though few guests will notice the difference today.',
        ],
        samples: [
          { label: 'Hosted by the bride’s parents', text: 'Mr and Mrs David Tran\nrequest the honour of your presence\nat the marriage of their daughter\nLinh Tran\nto\nNam Nguyen\nSaturday, the twelfth of December, two thousand twenty-six\nat four o’clock in the afternoon\nRose Garden Hotel, 8 Lake Road, Hanoi\nReception to follow' },
          { label: 'Hosted by the couple', text: 'Linh Tran and Nam Nguyen\nrequest the pleasure of your company\nat their wedding\nSaturday, 12 December 2026, at four in the afternoon\nRose Garden Hotel, Hanoi\nKindly reply by 30 November' },
        ],
      },
      {
        title: 'Casual and modern wording',
        paragraphs: [
          'A relaxed invitation sounds like you. It can use first names, a joke, or a line about how you met, as long as the practical details are still easy to find. Keep the fun in the first two lines and the facts in a plain block underneath, so a guest scanning for the time does not have to read a paragraph.',
          'If your guest list mixes close friends and older relatives, aim for warm rather than jokey. A line that makes your friends laugh can confuse an aunt reading a translation in her head.',
        ],
        samples: [
          { label: 'Warm and simple', text: 'We’re getting married!\nLinh & Nam would love you to celebrate with us.\nSaturday 12 December, 4 pm\nRose Garden Hotel, Hanoi\nDinner, music and too much cake to follow.\nTell us you’re coming by 30 November.' },
          { label: 'Playful', text: 'After seven years, two cities and one very patient cat,\nLinh & Nam are making it official.\nCome eat, dance and witness it:\nSaturday 12 December, 4 pm, Rose Garden Hotel, Hanoi.\nReply by 30 November so we save you a seat.' },
        ],
      },
      {
        title: 'When both families host',
        paragraphs: [
          'In many families, especially Vietnamese, Chinese and Korean ones, the parents of both the bride and the groom invite together, and each family may hold its own ceremony and reception on different days or in different cities. The invitation then names both sets of parents and, often, gives separate times for each side.',
          'This is where an online invitation is easier than paper: instead of printing two versions, you make one page with a Groom’s side tab and a Bride’s side tab. Each tab shows that family’s ceremony, venue and time. You send the groom’s relatives a link that opens on their tab and the bride’s relatives one that opens on theirs (the link ends in ?side=groom or ?side=bride), and anyone can switch tabs to see the other side.',
        ],
        samples: [
          { label: 'Both sets of parents', text: 'Mr and Mrs Minh Nguyen\nand\nMr and Mrs David Tran\ntogether with their children\nNam and Linh\ninvite you to celebrate their marriage\nSaturday, 12 December 2026\nGroom’s family reception: 11 am, Nguyen family home, Bac Ninh\nWedding dinner: 6 pm, Rose Garden Hotel, Hanoi' },
        ],
      },
      {
        title: 'Bilingual wording',
        paragraphs: [
          'When half your guests read English and half read another language, put the two versions next to each other rather than translating word for word. Translate the meaning and keep each version natural: a formal Vietnamese invitation and a formal English one use different phrases to show the same respect.',
          'Keep the facts identical. Names, the date, the time and the address should match exactly in both versions, and numbers should use one format. Write "12 December 2026" and "12/12/2026" side by side only if you are sure no guest will read it as a different day. Our guide to bilingual invitations has full examples.',
        ],
      },
      {
        title: 'RSVP lines and the small print',
        paragraphs: [
          'The reply line is the one most invitations get wrong. Give a date, about three weeks before the wedding, and tell guests what you need: whether they are coming, how many people, and anything about food. On an online invitation the reply form asks for this, so the line can simply say "Please reply below by 30 November".',
          'Small print belongs at the end, short: dress code, parking, whether children are invited, and a gift note if you want one. Many couples now add a bank QR code for guests who cannot attend and want to send a gift. Keep it gentle: "If you would like to send a gift from afar, our details are below" reads better than a bare account number.',
        ],
        bullets: [
          'Dress code: "Garden formal: light colours welcome."',
          'Children: "We love your little ones, but this will be an adults-only evening."',
          'Plus-ones: name exactly who is invited on each personal link instead of explaining rules.',
          'Gifts: "Your presence is our gift. If you wish to send something from afar, a QR code is below."',
        ],
      },
      {
        title: 'What changes on an online invitation',
        paragraphs: [
          'A paper card has to fit everything on one face. A link does not, so the invitation itself can stay short and the page underneath does the rest: a countdown, the schedule of the day, the venue on a map with directions, the reply form, your photos, and the gift QR code. Guests tap once to add the date to their calendar.',
          'The opening also changes. On Perlink the invitation can be a sealed letter that each guest taps to open, greeting them by name ("For Uncle Hai") when you send them their own link. Music starts as they open it. Because the wording sits in the letter, you can fix a typo or change the time after sending, and every guest sees the new version on the same link.',
        ],
      },
    ],
    stepsTitle: 'Write yours in five steps',
    steps: [
      { title: 'Decide who hosts', text: 'Your parents, the two of you, or both families. That sets the first line and the tone.' },
      { title: 'Write the facts block', text: 'Names, weekday and date, time, venue and address, reply date. Check them twice.' },
      { title: 'Pick a tone', text: 'Copy the formal, casual or family version above and change it until it sounds like you.' },
      { title: 'Add the small print', text: 'Dress code, children, parking, a gentle gift line. One sentence each.' },
      { title: 'Put it in a letter', text: 'Paste it into the invitation letter of a wedding template and send each guest a personal link.' },
    ],
    faq: [
      { q: 'Who should be named first on a wedding invitation?', a: 'Traditionally the bride’s name comes first when her parents host, and the groom’s family first when his parents host. When both families host, either order works; many couples list the groom’s family first in Vietnamese and the bride’s first in English, but there is no rule you must follow.' },
      { q: 'How early should invitations go out?', a: 'Six to eight weeks before the wedding, earlier for guests who travel. Ask for replies about three weeks before, so you have time to give the venue your final numbers.' },
      { q: 'Should the time on the invitation be the real start time?', a: 'Write the time you want guests seated. If your ceremony starts at 4:00, write 3:30 for guests to arrive, or write 4:00 and say "please arrive by 3:45". Do not write a fake early time: guests learn to come late.' },
      { q: 'Can I change the wording after sending an online invitation?', a: 'Yes. Edit the letter or the details and publish; the link stays the same, so every guest sees the new version without you sending anything again.' },
      { q: 'Is it rude to mention gifts or money?', a: 'Not if it is short and optional. Put it at the end, never on the first screen, and phrase it as an option for guests who want it.' },
    ],
    ctaTitle: 'Put your wording in a letter guests open',
    ctaText: 'Choose a wedding template, paste your invitation into the letter, and send each guest a link with their name on the envelope. The letter, countdown, schedule, map, reply form, guestbook and gift QR are on the free plan.',
  },
  vi: {
    seoTitle: 'Lời mời cưới hay: mẫu câu mời đám cưới để chép',
    description: 'Mẫu lời mời cưới hay để chép: trang trọng, thân mật, bố mẹ hai bên đứng mời, song ngữ, kèm câu xác nhận tham dự và cách viết cho thiệp cưới online.',
    eyebrow: 'Lời mời cưới',
    title: 'Lời mời cưới hay: mẫu câu chép được ngay, sửa thành của mình',
    intro: 'Một lời mời cưới hay trước hết phải đủ ý: ai đứng mời, ai thành hôn, ngày giờ nào, ở đâu và khách xác nhận thế nào. Phần còn lại là giọng văn. Dưới đây là các mẫu trang trọng theo kiểu bố mẹ hai bên đứng mời, mẫu thân mật cho bạn bè, mẫu song ngữ, cùng những điều nên đổi khi thiệp là một đường link thay vì tấm thiệp giấy.',
    sections: [
      {
        title: 'Năm điều thiệp nào cũng phải có',
        paragraphs: [
          'Khách đọc thiệp chỉ trong vài giây, phần lớn là trên điện thoại, rồi mở lại thêm hai lần: một lần để xác nhận, một lần vào đúng hôm cưới để tìm đường. Câu chữ hoa mỹ quá dài mà giấu mất giờ và địa chỉ sẽ làm khó khách ở cả hai lần đó.',
          'Trước khi nghĩ tới văn phong, hãy kiểm tra bản nháp đã trả lời đủ những ý sau, theo đúng thứ tự. Sự ấm áp đặt xung quanh các ý này, không thay cho chúng.',
        ],
        bullets: [
          'Người đứng mời: bố mẹ nhà trai, bố mẹ nhà gái, cả hai gia đình, hay chính cô dâu chú rể.',
          'Tên cô dâu chú rể: thiệp trang trọng ghi đủ họ tên, thiệp bạn bè có thể ghi tên thân mật.',
          'Ngày giờ ghi đủ thứ, ngày dương lịch, và nhiều nhà ghi thêm ngày âm lịch: "Vào lúc 11 giờ 00, Chủ nhật, ngày 13 tháng 12 năm 2026 (tức ngày … tháng … năm Bính Ngọ)". Hãy tra lịch âm thật kỹ trước khi in hay gửi.',
          'Địa điểm: tên nhà hàng hoặc tư gia, địa chỉ đầy đủ, và trên thiệp online thì thêm nút chỉ đường.',
          'Cách xác nhận và hạn chót: "Bạn xác nhận giúp chúng mình trước ngày 30/11 nhé" rõ hơn nhiều so với "mong bạn hồi âm".',
        ],
      },
      {
        title: 'Mẫu trang trọng, bố mẹ hai bên đứng mời',
        paragraphs: [
          'Đây là kiểu thiệp quen thuộc nhất ở Việt Nam: phía trên ghi tên ông bà, bố mẹ hai bên cùng địa chỉ nhà, ở giữa là tên cô dâu chú rể, phía dưới là lời mời tới dự lễ thành hôn và tiệc cưới. Lời lẽ ngắn, trang nghiêm, dùng "trân trọng kính mời", "tới dự bữa cơm thân mật", "mừng lễ thành hôn của con chúng tôi".',
          'Nếu nhà trai và nhà gái tổ chức ở hai nơi, mỗi bên thường in thiệp riêng với tên bố mẹ bên mình đứng trước và giờ tiệc bên mình. Dù vậy, câu chữ hai bản nên giống nhau để hai gia đình cảm thấy ngang hàng.',
        ],
        samples: [
          { label: 'Thiệp nhà trai', text: 'Nhà trai\nÔng Nguyễn Văn Minh – Bà Trần Thị Hoa\nThôn Đông, xã Tam Sơn, Bắc Ninh\nTrân trọng báo tin lễ thành hôn của con chúng tôi\nNguyễn Văn Nam\nvà\nTrần Thị Linh\nTrưởng nữ của Ông Trần Văn Đức – Bà Lê Thị Mai\nHôn lễ được cử hành vào lúc 9 giờ 00, Chủ nhật ngày 13 tháng 12 năm 2026\nTại tư gia nhà trai\nSự hiện diện của quý khách là niềm vinh hạnh cho gia đình chúng tôi.' },
          { label: 'Lời mời dự tiệc', text: 'Trân trọng kính mời\n........................................\nTới dự bữa cơm thân mật mừng lễ thành hôn của con chúng tôi\nVào lúc 11 giờ 00, Chủ nhật ngày 13 tháng 12 năm 2026\nTại Nhà hàng Hoa Sen, sảnh Ngọc Lan\n68 Lý Thường Kiệt, Hoàn Kiếm, Hà Nội\nRất hân hạnh được đón tiếp!' },
        ],
      },
      {
        title: 'Một link cho cả nhà trai và nhà gái',
        paragraphs: [
          'Với thiệp giấy, hai nhà phải in hai bản. Với thiệp online, bạn chỉ cần một trang có hai tab "Nhà trai" và "Nhà gái": mỗi tab có giờ lễ, giờ tiệc và địa điểm riêng của bên đó, còn lời mời, album ảnh, sổ lưu bút và mã QR mừng cưới thì dùng chung.',
          'Bạn gửi họ hàng bên nội một link mở sẵn tab nhà trai, bên ngoại một link mở sẵn tab nhà gái (cuối link có ?side=groom hoặc ?side=bride). Khách vẫn bấm qua tab bên kia được, nên bạn bè chung của hai người xem được cả hai lịch. Cách này cũng tránh được chuyện khách bên này đi nhầm sang tiệc bên kia vì cầm nhầm thiệp.',
        ],
      },
      {
        title: 'Mẫu thân mật cho bạn bè, đồng nghiệp',
        paragraphs: [
          'Thiệp gửi bạn bè không cần câu "trân trọng kính mời". Viết như cách bạn vẫn nhắn tin cho họ, vui một chút cũng được, miễn là ngày giờ và địa điểm vẫn nằm riêng ở một khối rõ ràng phía dưới để khách lướt là thấy.',
          'Nếu cùng một thiệp gửi cho cả bạn bè lẫn các cô dì chú bác, hãy chọn giọng ấm áp thay vì quá nhí nhảnh. Câu đùa làm bạn thân bật cười có thể khiến người lớn tuổi khó hiểu.',
        ],
        samples: [
          { label: 'Ấm áp, ngắn gọn', text: 'Cuối cùng thì tụi mình cũng cưới rồi!\nLinh & Nam rất mong có bạn ở đó trong ngày vui nhất của tụi mình.\n18 giờ 00, Thứ Bảy 12/12/2026\nNhà hàng Hoa Sen, 68 Lý Thường Kiệt, Hà Nội\nBạn xác nhận giúp tụi mình trước 30/11 nha.' },
          { label: 'Vui vẻ', text: 'Sau 7 năm, 2 thành phố và 1 con mèo kiên nhẫn,\nNam và Linh quyết định về chung một nhà.\nĐến ăn, đến nhảy, đến làm chứng nhé:\n18 giờ, Thứ Bảy 12/12, Nhà hàng Hoa Sen, Hà Nội.\nNhớ xác nhận trước 30/11 để tụi mình giữ ghế cho bạn!' },
        ],
      },
      {
        title: 'Mẫu song ngữ Việt – Anh',
        paragraphs: [
          'Khi có khách nước ngoài hoặc người thân ở xa không đọc tiếng Việt, hãy đặt hai bản cạnh nhau thay vì dịch từng chữ. "Trân trọng kính mời" sang tiếng Anh tự nhiên nhất là "request the pleasure of your company", không phải dịch sát nghĩa từng từ.',
          'Thông tin phải trùng khớp tuyệt đối ở hai bản: tên, ngày, giờ, địa chỉ. Ngày âm lịch chỉ để ở bản tiếng Việt, bản tiếng Anh ghi ngày dương lịch kèm thứ. Bài thiệp cưới song ngữ có đầy đủ mẫu và cách sắp xếp.',
        ],
        samples: [
          { label: 'Song ngữ', text: 'Trân trọng kính mời bạn tới dự tiệc cưới của chúng mình\nWe would love you to celebrate our wedding with us\nLinh & Nam\n18:00, Thứ Bảy 12.12.2026 · 6 pm, Saturday 12 December 2026\nNhà hàng Hoa Sen, 68 Lý Thường Kiệt, Hà Nội' },
        ],
      },
      {
        title: 'Câu xác nhận tham dự và lời nhắn cuối thiệp',
        paragraphs: [
          'Câu xác nhận là chỗ nhiều thiệp viết sai nhất. Hãy cho khách một hạn chót, khoảng ba tuần trước ngày cưới, và nói rõ bạn cần biết gì: có đến không, đi mấy người. Trên thiệp online đã có sẵn form xác nhận, nên câu này chỉ cần là "Bạn xác nhận ở phía dưới giúp chúng mình trước 30/11 nhé".',
          'Phần lời nhắn cuối thiệp nên ngắn: trang phục, chỗ gửi xe, có đưa trẻ nhỏ đi được không. Ngày nay nhiều cặp đôi thêm mã QR mừng cưới cho khách ở xa không về kịp. Hãy viết thật nhẹ nhàng, đặt ở cuối trang chứ đừng để ngay màn hình đầu.',
        ],
        bullets: [
          'Trang phục: "Dress code: tông pastel nhẹ nhàng, rất mong được đón bạn."',
          'Gửi xe: "Có hầm gửi xe miễn phí ngay dưới nhà hàng."',
          'Mừng cưới từ xa: "Sự có mặt của bạn là món quà lớn nhất. Nếu ở xa không về kịp, bạn có thể gửi lời chúc và quà mừng qua mã QR bên dưới."',
          'Giờ đón khách: ghi giờ đón khách và giờ khai tiệc riêng, khách sẽ đến đúng giờ hơn.',
        ],
      },
      {
        title: 'Thiệp online khác thiệp giấy ở đâu',
        paragraphs: [
          'Thiệp giấy phải gói mọi thứ vào một mặt giấy. Thiệp online thì không: lời mời giữ ngắn gọn, còn trang bên dưới lo phần còn lại, gồm đếm ngược tới ngày cưới, lịch trình, bản đồ chỉ đường, form xác nhận, album ảnh cưới và mã QR mừng cưới. Khách bấm một lần là lưu ngày cưới vào lịch điện thoại.',
          'Cách mở thiệp cũng khác. Trên Perlink, lời mời nằm trong một lá thư niêm phong, khách chạm vào là mở, và phong bì ghi đúng tên người đó ("Gửi Chú Hai") khi bạn gửi link riêng cho từng khách. Nhạc nền phát khi thư mở ra. Vì lời mời nằm trên trang, bạn sửa được lỗi chính tả hay đổi giờ sau khi đã gửi, và mọi khách đều thấy bản mới trên cùng một link.',
        ],
      },
    ],
    stepsTitle: 'Viết lời mời trong năm bước',
    steps: [
      { title: 'Chọn người đứng mời', text: 'Bố mẹ một bên, cả hai gia đình, hay chính hai bạn. Điều này quyết định dòng đầu và giọng văn.' },
      { title: 'Viết khối thông tin', text: 'Tên, thứ ngày tháng (cả âm lịch nếu cần), giờ, địa điểm, hạn xác nhận. Soát lại hai lần.' },
      { title: 'Chọn giọng văn', text: 'Chép một mẫu trang trọng, thân mật hay song ngữ ở trên, rồi sửa đến khi nghe giống mình.' },
      { title: 'Thêm lời nhắn cuối', text: 'Trang phục, gửi xe, mừng cưới từ xa. Mỗi ý một câu.' },
      { title: 'Đưa vào lá thư', text: 'Dán lời mời vào lá thư của mẫu thiệp cưới, chia tab nhà trai và nhà gái nếu cần, rồi gửi link riêng cho từng khách.' },
    ],
    faq: [
      { q: 'Thiệp nhà trai ghi tên ai trước?', a: 'Thiệp nhà trai ghi tên bố mẹ chú rể và chú rể trước, thiệp nhà gái ghi tên bố mẹ cô dâu và cô dâu trước. Nếu dùng một thiệp chung cho cả hai nhà, nhiều gia đình để nhà trai bên trái, nhà gái bên phải.' },
      { q: 'Có cần ghi ngày âm lịch không?', a: 'Không bắt buộc, nhưng nhiều gia đình, nhất là ông bà, quen xem ngày âm. Nếu ghi, hãy tra lịch thật kỹ và ghi cả ngày dương để khách trẻ không nhầm.' },
      { q: 'Nên gửi thiệp trước bao lâu?', a: 'Khoảng 3 đến 4 tuần với khách ở gần, 6 đến 8 tuần với khách phải đi xa hoặc ở nước ngoài. Hạn xác nhận nên trước ngày cưới khoảng 1 đến 2 tuần để kịp báo số bàn cho nhà hàng.' },
      { q: 'Gửi thiệp online cho người lớn tuổi có bị coi là thiếu lịch sự không?', a: 'Với ông bà, bố mẹ của bạn bè hay thầy cô, nhiều nhà vẫn mang thiệp giấy đến tận nơi, và thiệp online chỉ để gửi thêm bản đồ và lịch trình. Bạn có thể in mã QR của thiệp online lên thiệp giấy để dùng cả hai.' },
      { q: 'Gửi thiệp rồi mới thấy sai giờ thì làm sao?', a: 'Với thiệp online, bạn chỉ cần sửa trên trang rồi đăng lại. Link vẫn giữ nguyên nên khách mở ra là thấy giờ đúng, không cần gửi lại.' },
    ],
    ctaTitle: 'Đưa lời mời vào lá thư khách chạm để mở',
    ctaText: 'Chọn một mẫu thiệp cưới, dán lời mời của bạn vào lá thư, chia tab nhà trai và nhà gái nếu hai bên tổ chức riêng, rồi gửi mỗi khách một link có tên họ trên phong bì. Lá thư, đếm ngược, lịch trình, bản đồ, form xác nhận, sổ lưu bút và mã QR mừng cưới đều có trong gói miễn phí.',
  },
}
