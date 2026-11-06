import type { WeddingTopic } from './types'

// Wedding music: real, well-known songs for each moment of the day, and the
// music on the online invitation itself (royalty-free tracks, from the
// built-in library: data/roomMusic)

export const MUSIC_TOPIC: WeddingTopic = {
  id: 'music',
  path: { en: 'wedding-music', vi: 'nhac-dam-cuoi' },
  templates: ['wedding-invite', 'invite-wedding-garden', 'wedding-korean', 'wedding-night-gold', 'wedding-beach', 'love-anniversary'],
  updated: '2026-11-06',
  readMinutes: 7,
  en: {
    seoTitle: 'Wedding Music: Songs for Every Moment of the Day',
    description: 'Wedding songs for every moment: the walk down the aisle, signing, first dance, dinner and the party, plus how to pick music for your online invitation.',
    eyebrow: 'Wedding music',
    title: 'Wedding music: songs for every moment, from the aisle to the dance floor',
    intro: 'Plan wedding music by moment, not as one long playlist: a piece to walk in to, something soft while you sign, one song for the first dance, easy background music for dinner, and a party set. Below are well-known choices for each, the questions to ask your band or DJ, and what to play on the online invitation itself.',
    sections: [
      {
        title: 'Think in moments',
        paragraphs: [
          'A wedding has five or six musical moments, and each one has a job. The processional sets the mood and covers a walk of one to three minutes. The signing needs something that can loop without anyone noticing. The first dance is the one song people will remember. Dinner music should let people talk. The party should get your least musical uncle on the floor.',
          'Write the moments down with a rough time for each before you pick a single song. It turns an endless playlist into a short list of decisions, and it is exactly what your band, DJ or the venue’s sound technician will ask you for.',
        ],
      },
      {
        title: 'Walking down the aisle',
        paragraphs: [
          'Classical pieces still dominate the processional because they build slowly and can be cut at any bar. Modern couples often choose a slow pop song played on piano or strings instead of the original recording, which keeps it elegant and avoids a vocal starting halfway down the aisle.',
        ],
        bullets: [
          'Canon in D, Johann Pachelbel: the most-played processional, easy to time to any walk.',
          'Bridal Chorus ("Here Comes the Bride"), Richard Wagner: the traditional entrance.',
          'A Thousand Years, Christina Perri: very popular as a piano or string version.',
          'Can’t Help Falling in Love, Elvis Presley: slow and familiar to every generation.',
          'River Flows in You, Yiruma: solo piano, gentle and short.',
        ],
      },
      {
        title: 'The ceremony, signing and exit',
        paragraphs: [
          'During the signing or the tea ceremony, choose instrumental music that can play quietly for ten minutes. For the exit, go upbeat: this is the moment the guests clap and the photographer gets the best shots.',
        ],
        bullets: [
          'Wedding March, Felix Mendelssohn: the classic recessional, bright and fast.',
          'Married Life, Michael Giacchino (from the film Up): instrumental, warm, a little playful.',
          'Marry You, Bruno Mars: upbeat for the walk back up the aisle.',
        ],
      },
      {
        title: 'The first dance',
        paragraphs: [
          'Pick a song you both love, then listen to the lyrics as if you had never heard them; some well-known love songs are about breaking up. Check the length too. Most first dances feel long after two and a half minutes, so ask your DJ to fade it out early or to bring guests onto the floor for the last chorus.',
        ],
        bullets: [
          'Perfect, Ed Sheeran',
          'All of Me, John Legend',
          'Thinking Out Loud, Ed Sheeran',
          'Beautiful in White, Shane Filan: a favourite at weddings across Asia',
          'Make You Feel My Love, Adele',
        ],
      },
      {
        title: 'Dinner and the party',
        paragraphs: [
          'Dinner music should be familiar and low: acoustic covers, jazz standards, soft instrumental versions of songs your guests know. Keep it quiet enough that people at a round table can hear each other.',
          'For the party, start with songs every age group knows, then move toward what your friends want. Tell your DJ about two or three songs guests always ask for in your family and any you never want to hear.',
        ],
        bullets: [
          'September, Earth, Wind & Fire',
          'Dancing Queen, ABBA',
          'Uptown Funk, Mark Ronson featuring Bruno Mars',
          'I Gotta Feeling, The Black Eyed Peas',
        ],
      },
      {
        title: 'Music on the online invitation',
        paragraphs: [
          'An online invitation can play music too, which sets the mood before guests read a word. On Perlink the music starts when the guest taps to open the sealed letter, because phones block sound until a person taps. You pick a track from the built-in library: romantic piano, tender piano, acoustic guitar, lo-fi and others, all royalty-free.',
          'Why not your first-dance song? Playing a commercial recording on a public web page needs a licence that a wedding invitation does not have, and video and music platforms can take such pages down. Royalty-free tracks avoid that. Save the famous songs for the venue, where the band or the venue’s licence covers them.',
        ],
      },
      {
        title: 'Questions to ask your band or DJ',
        paragraphs: [
          'A short brief saves a lot of surprises on the day. Send it a month before the wedding with your list of moments.',
        ],
        bullets: [
          'Can you play the processional live, and how do you time it to the walk?',
          'Who announces the entrances and the first dance, and how do you pronounce our names?',
          'Do you have a wireless microphone for speeches?',
          'What do you play while setting up, and between sets?',
          'What volume do you keep during dinner?',
        ],
      },
    ],
    stepsTitle: 'Plan your wedding music in five steps',
    steps: [
      { title: 'List the moments', text: 'Processional, ceremony, exit, first dance, dinner, party. A rough time for each.' },
      { title: 'Pick one song per key moment', text: 'Processional, first dance and exit. Read the lyrics of each.' },
      { title: 'Write a do and don’t list', text: 'Three songs the party must have, three it must not.' },
      { title: 'Brief your band or DJ', text: 'Send the moments, the songs, names to announce, and timings a month before.' },
      { title: 'Set the invitation’s music', text: 'Choose a romantic or acoustic track that plays as guests open your online invitation.' },
    ],
    faq: [
      { q: 'How many songs do we need for a wedding?', a: 'Three to choose yourself (processional, first dance, exit), plus guidance for dinner and the party. A good band or DJ fills the rest from your do and don’t list.' },
      { q: 'Can we play our first-dance song on the online invitation?', a: 'Not as the original recording. Public pages need a licence to play commercial music, so Perlink offers a library of royalty-free tracks that play when the guest opens the letter.' },
      { q: 'Does the music play automatically?', a: 'It starts with the guest’s first tap, when they open the sealed envelope. Browsers do not allow sound before a tap, so every invitation works this way.' },
      { q: 'What music suits a tea ceremony?', a: 'Quiet instrumental music: solo piano, strings or traditional instruments, low enough for the families to talk.' },
      { q: 'How long should the first dance be?', a: 'About two to three minutes. Ask the DJ to fade the song out or invite guests onto the floor for the last chorus.' },
    ],
    ctaTitle: 'Set the mood before guests read a word',
    ctaText: 'Make your invitation, choose a track from the music library, and the song starts as each guest opens the letter. Free to start.',
  },
  vi: {
    seoTitle: 'Nhạc đám cưới: bài hát cho từng khoảnh khắc',
    description: 'Nhạc đám cưới hay cho từng khoảnh khắc: rước dâu, lễ gia tiên, cô dâu chú rể vào sảnh, cắt bánh, tiệc và giao lưu, cùng cách chọn nhạc nền cho thiệp cưới online.',
    eyebrow: 'Nhạc đám cưới',
    title: 'Nhạc đám cưới: chọn bài cho từng khoảnh khắc, từ lễ gia tiên đến tiệc',
    intro: 'Đừng chọn nhạc đám cưới thành một danh sách dài, hãy chọn theo từng khoảnh khắc: nhạc nhẹ lúc đón khách, bài cho cô dâu chú rể bước vào sảnh, bài lúc cắt bánh rót rượu, nhạc nền khi ăn và nhạc sôi động khi giao lưu. Dưới đây là những bài quen thuộc cho mỗi lúc, những điều nên dặn ban nhạc hay MC, và cách chọn nhạc nền cho chính tấm thiệp online của bạn.',
    sections: [
      {
        title: 'Chia đám cưới thành từng khoảnh khắc',
        paragraphs: [
          'Một đám cưới Việt thường có lễ gia tiên buổi sáng và tiệc cưới ở nhà hàng hoặc tư gia, và mỗi phần có những khoảnh khắc âm nhạc riêng. Lễ gia tiên cần trang nghiêm. Lúc đón khách cần nhạc nhẹ để mọi người còn chào hỏi. Lúc cô dâu chú rể bước vào là cao trào. Lúc ăn tiệc thì nhạc phải đủ nhỏ để bàn tròn còn nói chuyện được.',
          'Hãy ghi ra các khoảnh khắc kèm thời gian dự kiến trước khi chọn bài. Một danh sách vô tận sẽ trở thành vài lựa chọn rõ ràng, và đó cũng chính là thứ ban nhạc, DJ hay MC nhà hàng sẽ hỏi bạn.',
        ],
      },
      {
        title: 'Lễ gia tiên và rước dâu',
        paragraphs: [
          'Lễ gia tiên là phần của hai gia đình, nên nhạc chỉ để làm nền: nhạc không lời, đàn tranh, sáo trúc, hoặc nhạc cưới truyền thống mà nhiều đội lễ đã có sẵn. Hỏi trước đội bê tráp hoặc người dẫn lễ, vì nhiều đội có loa và bộ nhạc quen thuộc của họ.',
          'Đoàn rước dâu thì có thể vui hơn. Nhiều nhà mở những bài nhạc cưới quen thuộc trên đường đón dâu, miễn là âm lượng vừa phải khi tới nhà gái và tắt hẳn khi bắt đầu thắp hương.',
        ],
      },
      {
        title: 'Cô dâu chú rể bước vào sảnh',
        paragraphs: [
          'Đây là khoảnh khắc cả hội trường quay lại nhìn. Nhạc không lời bản piano hay violin luôn an toàn, vì có thể cắt ở bất kỳ đoạn nào khi hai bạn đã lên tới sân khấu. Nếu chọn một bài hát có lời, hãy dặn ban nhạc bắt đầu từ đoạn điệp khúc.',
        ],
        bullets: [
          'Canon in D (Pachelbel): bản nhạc không lời được dùng nhiều nhất cho lúc bước vào.',
          'A Thousand Years (Christina Perri): rất hợp ở bản piano hoặc violin.',
          'Beautiful in White (Shane Filan): bài hát cưới quen thuộc ở Việt Nam và châu Á.',
          'Một nhà (Da LAB): ấm áp, gần gũi, cả khách trẻ lẫn khách lớn tuổi đều dễ nghe.',
          'Ánh nắng của anh (Đức Phúc): nhẹ nhàng, hợp cho đoạn chú rể đón cô dâu.',
        ],
      },
      {
        title: 'Cắt bánh, rót rượu, cảm ơn bố mẹ',
        paragraphs: [
          'Phần nghi lễ trên sân khấu thường kéo dài mười đến mười lăm phút, gồm phát biểu, cắt bánh, rót rượu tháp ly và cảm ơn hai bên gia đình. Nhạc nên nhẹ khi có người phát biểu và rộn ràng hơn khi rót tháp ly.',
        ],
        bullets: [
          'Tình yêu màu nắng (Đoàn Thúy Trang, BigDaddy): tươi vui cho lúc cắt bánh.',
          'Mãi mãi bên nhau (Noo Phước Thịnh): hợp cho lúc rót rượu, trao lời hứa.',
          'Perfect (Ed Sheeran) hoặc All of Me (John Legend): cho điệu nhảy đầu tiên nếu hai bạn muốn có.',
          'Nhạc không lời nhẹ nhàng khi cảm ơn bố mẹ, để lời nói của hai bạn là chính.',
        ],
      },
      {
        title: 'Lúc ăn tiệc và giao lưu',
        paragraphs: [
          'Trong bữa tiệc, chọn những bài khách quen và để âm lượng thấp. Khi phần giao lưu bắt đầu, bạn bè lên hát hoặc nhảy, đó là lúc nhạc sôi động lên. Hãy dặn MC hai, ba bài mà họ hàng nhà bạn lúc nào cũng thích, và những bài bạn không muốn nghe trong ngày cưới (ví dụ bài về chia tay).',
        ],
        bullets: [
          'Đám cưới nha? (Hồng Thanh, Mie): vui, ai cũng hát theo được.',
          'Anh nhà ở đâu thế (AMEE, B Ray): vui tươi, hợp cho bạn bè cô dâu lên nhảy.',
          'Marry You (Bruno Mars) và Dancing Queen (ABBA) nếu có khách nước ngoài.',
        ],
      },
      {
        title: 'Nhạc nền trên thiệp cưới online',
        paragraphs: [
          'Thiệp cưới online cũng có nhạc, giúp khách vào đúng không khí trước khi đọc chữ nào. Trên Perlink, nhạc bắt đầu khi khách chạm mở lá thư niêm phong, vì điện thoại chặn âm thanh cho đến khi người dùng chạm vào màn hình. Bạn chọn một bản trong thư viện có sẵn: piano lãng mạn, piano dịu dàng, guitar mộc, lo-fi và vài bản khác, đều là nhạc miễn phí bản quyền.',
          'Sao không dùng bài hát yêu thích của hai bạn? Phát một bản thu âm thương mại trên trang web công khai cần có giấy phép, thiệp cưới thì không có, và các nền tảng có thể gỡ những trang như vậy. Nhạc miễn phí bản quyền tránh được chuyện đó. Hãy để những bài hát nổi tiếng cho buổi tiệc, nơi ban nhạc hoặc nhà hàng lo phần bản quyền.',
        ],
      },
      {
        title: 'Những điều nên dặn ban nhạc và MC',
        paragraphs: [
          'Một bản dặn dò ngắn giúp bạn tránh rất nhiều bất ngờ trong ngày cưới. Gửi trước khoảng hai tuần, kèm danh sách khoảnh khắc ở trên.',
        ],
        bullets: [
          'Bài nào cho lúc bước vào, bắt đầu từ đoạn nào, dừng khi nào.',
          'Tên cô dâu chú rể và bố mẹ hai bên đọc thế nào cho đúng.',
          'Có micro không dây cho người phát biểu không.',
          'Âm lượng lúc ăn tiệc, và giờ nào thì bắt đầu phần giao lưu.',
          'Những bài tuyệt đối không mở.',
        ],
      },
    ],
    stepsTitle: 'Chọn nhạc đám cưới trong năm bước',
    steps: [
      { title: 'Liệt kê khoảnh khắc', text: 'Lễ gia tiên, đón khách, bước vào sảnh, nghi lễ trên sân khấu, ăn tiệc, giao lưu.' },
      { title: 'Chọn bài cho lúc quan trọng', text: 'Lúc bước vào, lúc rót rượu và điệu nhảy đầu tiên nếu có. Đọc lại lời từng bài.' },
      { title: 'Viết danh sách nên và không nên', text: 'Ba bài phải có, ba bài không được mở.' },
      { title: 'Dặn ban nhạc, MC', text: 'Gửi danh sách khoảnh khắc, tên cần đọc và thời gian trước hai tuần.' },
      { title: 'Chọn nhạc cho thiệp', text: 'Chọn một bản piano hay guitar mộc, nhạc sẽ phát khi khách mở thiệp cưới online.' },
    ],
    faq: [
      { q: 'Nhạc đám cưới nên chọn bài vui hay bài nhẹ nhàng?', a: 'Cả hai, tùy lúc. Nhẹ nhàng khi đón khách, khi bước vào và khi phát biểu; vui tươi khi cắt bánh, rót rượu và giao lưu.' },
      { q: 'Có cho bài hát yêu thích vào thiệp online được không?', a: 'Không dùng được bản thu âm gốc, vì phát nhạc thương mại trên trang công khai cần giấy phép. Perlink có thư viện nhạc miễn phí bản quyền, phát khi khách mở lá thư.' },
      { q: 'Nhạc trên thiệp có tự phát không?', a: 'Nhạc bắt đầu ngay khi khách chạm mở phong bì. Trình duyệt trên điện thoại không cho phát âm thanh trước lần chạm đầu tiên, nên thiệp online nào cũng như vậy.' },
      { q: 'Lễ gia tiên nên mở nhạc gì?', a: 'Nhạc không lời trang nghiêm như đàn tranh, sáo trúc, hoặc bộ nhạc của đội lễ. Âm lượng nhỏ, tắt hẳn khi thắp hương và khi bố mẹ phát biểu.' },
      { q: 'Có nên tránh bài nào trong đám cưới không?', a: 'Nên tránh những bài về chia tay, hôn lễ của người yêu cũ hay nỗi buồn, dù giai điệu hay. Đọc lời trước khi đưa vào danh sách.' },
    ],
    ctaTitle: 'Để khách vào đúng không khí từ lúc mở thiệp',
    ctaText: 'Tạo thiệp cưới online, chọn một bản nhạc trong thư viện, và nhạc sẽ phát khi từng khách mở lá thư. Miễn phí để bắt đầu.',
  },
}
