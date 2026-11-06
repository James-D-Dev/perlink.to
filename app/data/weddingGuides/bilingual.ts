import type { WeddingTopic } from './types'

// Bilingual invitations: for mixed-nationality couples and guests abroad.
// The site language (utils/siteI18n) sets the words Perlink adds (buttons,
// "Tap to open", the countdown); the couple writes their own text in both
// languages

export const BILINGUAL_TOPIC: WeddingTopic = {
  id: 'bilingual',
  path: { en: 'bilingual-wedding-invitation', vi: 'thiep-cuoi-song-ngu' },
  templates: ['wedding-bilingual', 'wedding-invite', 'wedding-minimal', 'wedding-two-families', 'invite-wedding-garden', 'wedding-beach'],
  updated: '2026-11-06',
  readMinutes: 7,
  en: {
    seoTitle: 'Bilingual Wedding Invitation: Wording and Layout',
    description: 'How to make a bilingual wedding invitation: which language goes first, translating meaning not words, dates and names, plus examples in English and Vietnamese.',
    eyebrow: 'Bilingual invitation',
    title: 'Bilingual wedding invitations: wording, layout and examples',
    intro: 'A bilingual wedding invitation gives every guest the same facts in the language they read best. Lead with the language most guests share, keep the two versions side by side or one under the other, translate the meaning rather than the words, and make sure names, dates, times and the address are identical in both. An online invitation makes this easier: there is no space limit, and you can fix a translation after sending.',
    sections: [
      {
        title: 'Who needs a bilingual invitation',
        paragraphs: [
          'Couples from two countries, couples living abroad who marry at home, and families with relatives overseas all end up with guests who do not share one language. A grandmother in Da Nang and a best friend in Melbourne should both be able to read when and where without asking anyone.',
          'It is also a quiet gesture. Seeing their own language on your invitation tells each side of the family that the wedding belongs to them too.',
        ],
      },
      {
        title: 'Which language goes first',
        paragraphs: [
          'Put first the language of the country where the wedding takes place, or the one most guests read. If the families are evenly split, follow the host: the side hosting the reception leads. When each family hosts its own reception, each side’s invitation can lead with its own language.',
          'Keep the order the same everywhere on the page. Switching which language is on top from section to section makes the page harder to scan.',
        ],
      },
      {
        title: 'Translate the meaning, not the words',
        paragraphs: [
          'Wedding wording is full of set phrases, and set phrases do not translate word for word. The Vietnamese "trân trọng kính mời" becomes "request the pleasure of your company", not "respectfully and solemnly invite". "Bữa cơm thân mật" is a "wedding reception" or "dinner", not "an intimate meal". A friend who speaks both languages well is worth more here than any translation tool.',
          'Tone should match too. If the English is relaxed, the second language should be relaxed in its own way; a casual English line next to a stiff, formal translation reads as two different invitations.',
        ],
        samples: [
          { label: 'English and Vietnamese', text: 'Together with their families\nLinh & Nam\ninvite you to celebrate their wedding\nSaturday, 12 December 2026, 6 pm\nRose Garden Hotel, 8 Lake Road, Hanoi\n\nCùng gia đình hai bên\nLinh & Nam\ntrân trọng kính mời bạn đến dự tiệc cưới\n18 giờ 00, Thứ Bảy, ngày 12.12.2026\nKhách sạn Rose Garden, 8 Đường Ven Hồ, Hà Nội' },
        ],
      },
      {
        title: 'Names, dates, times and addresses',
        paragraphs: [
          'The facts are where bilingual invitations go wrong, because each language has its own conventions. Decide once and check both versions against each other line by line.',
        ],
        bullets: [
          'Names: keep the same spelling in both, with Vietnamese diacritics if that is how the person writes their name. Do not anglicise only one version.',
          'Name order: Vietnamese puts the family name first (Nguyễn Văn Nam). In English text many couples keep it, or use the given name only ("Nam"). Pick one and use it everywhere.',
          'Dates: write the month as a word in English ("12 December 2026") so nobody confuses 12/11 and 11/12. The lunar date, if you include it, belongs in the Vietnamese version only.',
          'Times: 18:00 in Vietnamese, 6 pm in English. Both are fine; just make them the same moment.',
          'Addresses: keep the local address exactly as written locally, so taxi drivers and map apps can find it. Add an English description ("the hotel by the lake") if it helps.',
        ],
      },
      {
        title: 'Layout: side by side or one under the other',
        paragraphs: [
          'On a paper card, two columns work for short text and stacked versions for longer text. On a phone, stacked is almost always better: each block of text in the first language, then the same block in the second, in a slightly smaller or lighter style.',
          'On Perlink, write both languages into each block yourself: the letter, the schedule titles, the event names and the venue notes. Then choose the site language: it sets the words Perlink adds around your text, such as "Tap to open", the countdown labels and the buttons. It can be English, Vietnamese, Spanish, French, German, Portuguese, Indonesian, Thai, Japanese, Korean or Chinese, so pick the one most of your guests read.',
        ],
      },
      {
        title: 'Two families, two languages',
        paragraphs: [
          'For a couple whose families live in different countries, the two-side layout often lines up with the two languages: the groom’s family reception in one country, the bride’s in another. Make one page with a Groom’s side tab and a Bride’s side tab, write each side’s schedule in that family’s language first, and send each family the link that opens their tab (ending in ?side=groom or ?side=bride). Shared friends can switch tabs and see both.',
        ],
      },
      {
        title: 'Practical notes for guests from abroad',
        paragraphs: [
          'Guests travelling for your wedding need more than the time and place. Add a short section in their language with what they will need to know.',
        ],
        bullets: [
          'The nearest airport and how long the ride to the venue takes.',
          'A hotel you recommend, and whether you have a group rate.',
          'What to expect at a ceremony they have not seen before, such as a tea ceremony.',
          'Dress code, with the local custom explained in a line.',
          'Gifts: a bank QR code is easier than cash for guests who cannot change money.',
        ],
      },
    ],
    stepsTitle: 'Make a bilingual invitation in five steps',
    steps: [
      { title: 'Choose the lead language', text: 'The language of the place, or of the hosting family.' },
      { title: 'Write the first version', text: 'In the lead language, with every fact checked.' },
      { title: 'Translate the meaning', text: 'Ask a fluent friend to write the second version in its own natural style.' },
      { title: 'Check the facts line by line', text: 'Names, date, time and address must match exactly.' },
      { title: 'Set the site language', text: 'Pick the language for the buttons and labels, then send each family its own link.' },
    ],
    faq: [
      { q: 'Should both languages be the same size?', a: 'Not necessarily. Many couples set the lead language slightly larger and the second one a little lighter, so the page is easier to scan.' },
      { q: 'Can the page switch languages with a button?', a: 'Perlink pages have one site language for the words it adds (buttons, labels), and you write your own text in both languages. Most couples simply show both versions one under the other.' },
      { q: 'How do we write Vietnamese names in English text?', a: 'Keep the spelling and diacritics as the person writes them. For order, either keep the family name first or use given names only, and do it the same way throughout.' },
      { q: 'Do we need the lunar date in English?', a: 'No. The lunar date matters to Vietnamese relatives; English-speaking guests need the solar date with the weekday.' },
      { q: 'Can we fix a translation after sending?', a: 'Yes. Edit the text and publish; the link stays the same, so every guest sees the corrected version.' },
    ],
    ctaTitle: 'One invitation every guest can read',
    ctaText: 'Start from a wedding template, write each block in both languages, set the site language and send each family the link that opens their side. Free to start.',
  },
  vi: {
    seoTitle: 'Thiệp cưới song ngữ: cách viết và mẫu Việt – Anh',
    description: 'Cách làm thiệp cưới song ngữ Việt – Anh: ngôn ngữ nào đặt trước, dịch ý thay vì dịch từng chữ, ghi tên, ngày âm dương, địa chỉ, kèm mẫu chép được ngay.',
    eyebrow: 'Thiệp cưới song ngữ',
    title: 'Thiệp cưới song ngữ: cách viết, cách sắp xếp và mẫu Việt – Anh',
    intro: 'Thiệp cưới song ngữ giúp mọi khách đọc được cùng một thông tin bằng ngôn ngữ của mình. Đặt trước ngôn ngữ mà đa số khách dùng, để hai bản cạnh nhau hoặc trên dưới, dịch theo ý chứ không dịch từng chữ, và kiểm tra cho tên, ngày, giờ, địa chỉ khớp tuyệt đối ở cả hai bản. Thiệp online càng dễ làm song ngữ: không giới hạn chỗ, dịch sai thì sửa được sau khi gửi.',
    sections: [
      {
        title: 'Ai cần thiệp cưới song ngữ',
        paragraphs: [
          'Cô dâu chú rể khác quốc tịch, hai bạn đang sống ở nước ngoài về Việt Nam làm đám cưới, hay gia đình có nhiều người thân là Việt kiều: lúc đó danh sách khách không còn dùng chung một ngôn ngữ. Bà nội ở Đà Nẵng và người bạn thân ở Melbourne đều phải đọc được ngày giờ, địa điểm mà không cần hỏi ai.',
          'Đó cũng là một cử chỉ tinh tế. Thấy ngôn ngữ của mình trên thiệp, gia đình mỗi bên đều cảm nhận đám cưới này cũng là của họ.',
        ],
      },
      {
        title: 'Ngôn ngữ nào đặt trước',
        paragraphs: [
          'Đặt trước ngôn ngữ của nơi tổ chức đám cưới, hoặc ngôn ngữ mà đa số khách đọc được. Nếu khách hai bên ngang nhau, bên nào đứng ra tổ chức tiệc thì ngôn ngữ bên đó đi trước. Nếu nhà trai và nhà gái tổ chức riêng, thiệp mỗi bên đặt ngôn ngữ của bên mình lên trước.',
          'Giữ thứ tự đó cho cả trang. Phần này tiếng Việt trước, phần kia tiếng Anh trước sẽ khiến khách khó đọc lướt.',
        ],
      },
      {
        title: 'Dịch ý, đừng dịch từng chữ',
        paragraphs: [
          'Lời mời cưới tiếng Việt có rất nhiều cụm từ quen thuộc, và những cụm này không dịch sát nghĩa được. "Trân trọng kính mời" sang tiếng Anh tự nhiên là "request the pleasure of your company". "Bữa cơm thân mật" là "wedding reception" hoặc "dinner", không phải "an intimate meal". "Lễ vu quy", "lễ thành hôn" thường chỉ cần dịch là "wedding ceremony". Một người bạn giỏi cả hai thứ tiếng có giá trị hơn mọi công cụ dịch.',
          'Giọng văn cũng phải tương xứng. Nếu bản tiếng Việt thân mật thì bản tiếng Anh cũng thân mật theo kiểu tiếng Anh; một bên vui vẻ, một bên khô cứng thì đọc lên như hai tấm thiệp khác nhau.',
        ],
        samples: [
          { label: 'Mẫu Việt – Anh', text: 'Cùng gia đình hai bên\nLinh & Nam\ntrân trọng kính mời bạn đến dự tiệc cưới\n18 giờ 00, Thứ Bảy, ngày 12.12.2026\nKhách sạn Rose Garden, 8 Đường Ven Hồ, Hà Nội\n\nTogether with their families\nLinh & Nam\ninvite you to celebrate their wedding\nSaturday, 12 December 2026, 6 pm\nRose Garden Hotel, 8 Lake Road, Hanoi' },
          { label: 'Câu xác nhận', text: 'Bạn xác nhận giúp chúng mình trước ngày 30/11 nhé.\nPlease let us know if you can come by 30 November.' },
        ],
      },
      {
        title: 'Tên, ngày âm dương, giờ và địa chỉ',
        paragraphs: [
          'Thông tin là chỗ thiệp song ngữ hay sai nhất, vì mỗi ngôn ngữ có cách viết riêng. Hãy quyết định một lần, rồi dò từng dòng hai bản với nhau.',
        ],
        bullets: [
          'Tên: viết giống nhau ở cả hai bản, giữ dấu tiếng Việt nếu người đó vẫn viết tên mình có dấu. Đừng bỏ dấu chỉ ở một bản.',
          'Thứ tự tên: tiếng Việt họ trước tên sau (Nguyễn Văn Nam). Trong bản tiếng Anh, nhiều cặp đôi vẫn giữ nguyên, hoặc chỉ ghi tên gọi ("Nam"). Chọn một cách và dùng thống nhất.',
          'Ngày: bản tiếng Anh nên viết tháng bằng chữ ("12 December 2026") để khách nước ngoài không nhầm 12/11 thành ngày 11 tháng 12. Ngày âm lịch chỉ để ở bản tiếng Việt.',
          'Giờ: tiếng Việt ghi 18 giờ 00, tiếng Anh ghi 6 pm. Cách nào cũng được, miễn là cùng một giờ.',
          'Địa chỉ: giữ nguyên địa chỉ tiếng Việt để taxi và ứng dụng bản đồ tìm được. Có thể thêm một dòng mô tả bằng tiếng Anh như "the hotel by West Lake".',
        ],
      },
      {
        title: 'Sắp xếp: cạnh nhau hay trên dưới',
        paragraphs: [
          'Trên thiệp giấy, chữ ngắn thì chia hai cột, chữ dài thì để trên dưới. Trên điện thoại thì gần như luôn nên để trên dưới: mỗi đoạn tiếng Việt, ngay dưới là đoạn tiếng Anh tương ứng, chữ nhỏ hơn hoặc nhạt hơn một chút.',
          'Trên Perlink, bạn tự viết hai thứ tiếng vào từng khối: lá thư mời, tên các mục lịch trình, tên sự kiện và ghi chú địa điểm. Sau đó chọn ngôn ngữ của trang: nó quyết định những chữ Perlink tự thêm quanh nội dung của bạn, như "Chạm để mở thư", nhãn đếm ngược và các nút bấm. Có 11 lựa chọn, gồm tiếng Việt, tiếng Anh, tiếng Hàn, tiếng Nhật, tiếng Trung, tiếng Pháp, tiếng Đức và vài thứ tiếng khác, nên hãy chọn thứ tiếng mà đa số khách đọc được.',
        ],
      },
      {
        title: 'Hai gia đình, hai ngôn ngữ',
        paragraphs: [
          'Với cặp đôi có gia đình ở hai nước, cách chia hai tab thường trùng luôn với hai ngôn ngữ: tiệc nhà trai ở một nước, tiệc nhà gái ở nước kia. Làm một trang có tab "Nhà trai" và "Nhà gái", viết lịch trình mỗi bên bằng ngôn ngữ của gia đình đó trước, rồi gửi mỗi gia đình link mở sẵn tab của họ (đuôi ?side=groom hoặc ?side=bride). Bạn bè chung vẫn bấm qua lại xem được cả hai.',
        ],
      },
      {
        title: 'Những điều khách nước ngoài cần biết',
        paragraphs: [
          'Khách bay sang dự đám cưới cần nhiều hơn ngày giờ và địa điểm. Thêm một mục ngắn bằng ngôn ngữ của họ với những điều sau.',
        ],
        bullets: [
          'Sân bay gần nhất và đi xe đến nơi tổ chức mất bao lâu.',
          'Khách sạn bạn gợi ý, có giá ưu đãi cho khách dự cưới không.',
          'Lễ gia tiên, lễ rước dâu diễn ra thế nào, khách nên làm gì, giải thích trong vài câu.',
          'Trang phục: áo dài, vest hay tông màu nào, kèm phong tục địa phương nếu có.',
          'Mừng cưới: mã QR chuyển khoản tiện hơn tiền mặt cho khách chưa đổi tiền Việt.',
        ],
      },
    ],
    stepsTitle: 'Làm thiệp song ngữ trong năm bước',
    steps: [
      { title: 'Chọn ngôn ngữ chính', text: 'Ngôn ngữ của nơi tổ chức, hoặc của gia đình đứng ra tổ chức tiệc.' },
      { title: 'Viết bản đầu tiên', text: 'Bằng ngôn ngữ chính, soát kỹ mọi thông tin.' },
      { title: 'Dịch theo ý', text: 'Nhờ một người giỏi cả hai thứ tiếng viết bản thứ hai theo văn phong tự nhiên của nó.' },
      { title: 'Dò từng dòng', text: 'Tên, ngày, giờ, địa chỉ phải khớp tuyệt đối ở hai bản.' },
      { title: 'Chọn ngôn ngữ trang', text: 'Chọn ngôn ngữ cho nút bấm và nhãn, rồi gửi mỗi gia đình link của bên mình.' },
    ],
    faq: [
      { q: 'Hai ngôn ngữ có cần cỡ chữ bằng nhau không?', a: 'Không nhất thiết. Nhiều cặp đôi để ngôn ngữ chính lớn hơn một chút, ngôn ngữ thứ hai nhạt hơn, để trang dễ đọc lướt.' },
      { q: 'Trang có nút đổi ngôn ngữ không?', a: 'Mỗi trang Perlink có một ngôn ngữ cho các chữ tự thêm như nút bấm và nhãn, còn nội dung thì bạn tự viết hai thứ tiếng. Phần lớn các cặp đôi để hai bản trên dưới nhau.' },
      { q: 'Tên tiếng Việt trong bản tiếng Anh nên viết thế nào?', a: 'Giữ đúng chính tả và dấu như người đó vẫn viết. Về thứ tự, giữ họ trước hoặc chỉ ghi tên gọi, và làm thống nhất cho cả thiệp.' },
      { q: 'Có cần dịch ngày âm lịch sang tiếng Anh không?', a: 'Không. Ngày âm lịch quan trọng với người thân Việt Nam; khách nước ngoài chỉ cần ngày dương lịch kèm thứ.' },
      { q: 'Gửi thiệp rồi mới thấy dịch sai thì sao?', a: 'Sửa trên trang rồi đăng lại. Link vẫn giữ nguyên nên mọi khách mở ra là thấy bản đã sửa.' },
    ],
    ctaTitle: 'Một tấm thiệp mà khách nào cũng đọc được',
    ctaText: 'Chọn một mẫu thiệp cưới, viết mỗi khối bằng hai thứ tiếng, chọn ngôn ngữ trang, rồi gửi mỗi gia đình link mở sẵn bên của họ. Miễn phí để bắt đầu.',
  },
}
