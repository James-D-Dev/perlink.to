import type { WeddingTopic } from './types'

// Addressing guests: how to write each guest's name on the invitation, the
// forms of address, and sending each guest their own link (?to=Name)

export const ADDRESSING_TOPIC: WeddingTopic = {
  id: 'addressing',
  path: { en: 'how-to-address-wedding-guests', vi: 'cach-ghi-ten-khach-thiep-cuoi' },
  templates: ['wedding-invite', 'wedding-two-families', 'invite-wedding-red', 'wedding-song-hy', 'wedding-ao-dai', 'wedding-minimal'],
  updated: '2026-11-06',
  readMinutes: 7,
  en: {
    seoTitle: 'How to Address Wedding Invitations to Guests',
    description: 'How to address wedding invitations: couples, families, plus-ones, titles and children, and how to send each guest an online invitation with their own name.',
    eyebrow: 'Addressing guests',
    title: 'How to address wedding invitations, guest by guest',
    intro: 'Address each invitation to exactly the people who are invited, by the names they use, with the title they would expect. That one line tells a guest whether their partner or children are invited before they read anything else. On an online invitation the same rule applies, except the name goes on a personal link instead of an envelope.',
    sections: [
      {
        title: 'Why the name line matters more than it looks',
        paragraphs: [
          'The name on an invitation is the guest list in miniature. "Mr and Mrs Tran" invites two people. "The Tran family" invites the children too. "Anna Lee and guest" means Anna can bring someone. Get it vague and you will spend the weeks before the wedding answering awkward messages about who is allowed to come.',
          'It is also the most personal part of the invitation. A guest who sees their own name, spelled right and with the form of address they are used to, feels invited rather than informed.',
        ],
      },
      {
        title: 'Formal and informal forms',
        paragraphs: [
          'For a formal invitation, use titles and full names on the outside and a shorter form inside. For a relaxed wedding, first names are fine for friends, but older relatives and family friends usually still expect a title.',
        ],
        bullets: [
          'A married couple: "Mr and Mrs David Tran" (traditional) or "Mai and David Tran" (modern).',
          'A couple with different surnames, or unmarried: both names on one line, "Ms Mai Le and Mr David Tran".',
          'A family with children invited: "The Tran Family", or the parents’ names followed by the children’s first names.',
          'A single guest with a plus-one: "Ms Anna Lee and Guest". If you know the partner’s name, use it.',
          'Professional titles: "Dr", "Professor" or a military rank go before the name when the guest uses them.',
          'Teachers, elders and family friends: when in doubt, use the more formal form. Nobody is offended by respect.',
        ],
      },
      {
        title: 'Addressing guests in Vietnamese families',
        paragraphs: [
          'If your wedding includes Vietnamese relatives, the name line follows Vietnamese forms of address, which depend on age and family relationship rather than just on marriage. Uncles and aunts are addressed by their place in the family ("Chú Hai", "Cô Ba"), and a family is invited through its head ("Ông Nguyễn Văn Minh và gia đình").',
          'Our Vietnamese version of this guide goes into those forms in detail. If your partner’s family is Vietnamese, ask them to check the names for their side: the right form of address matters more to many older relatives than any wording on the card.',
        ],
      },
      {
        title: 'One personal link per guest',
        paragraphs: [
          'Online invitations solve the envelope problem differently. Instead of writing names on envelopes, you send each guest their own link with their name in it. On Perlink you type the guest’s name in the invitation letter’s settings and copy the link it gives you, which ends in ?to= and the name. When that guest opens the page, the sealed envelope reads "For Anna and Tom" and the letter greets them by name.',
          'Because the link carries the name exactly as you typed it, you control the form of address per guest: "Uncle Hai and family" for one, "Anna" for another, "Professor Lee" for a third. The page is the same for everyone; only the greeting changes.',
          'With the one-time Wedding pass, your dashboard also lists which named guests have opened their invitation, so you know who to remind before the reply date.',
        ],
        samples: [
          { label: 'A guest list ready to turn into links', text: 'Uncle Hai and family\nAunt Lan and Uncle Phong\nAnna and Tom\nProfessor Lee\nMinh and guest' },
        ],
      },
      {
        title: 'Two families, two sides',
        paragraphs: [
          'When each family holds its own reception, the name line is only half of it: each guest also needs the right time and place. Make one page with a Groom’s side tab and a Bride’s side tab, then add the side to each guest’s link, for example ?to=Uncle%20Hai&side=groom. That guest sees their name on the envelope and their family’s schedule first, and can still look at the other side.',
          'Keep a simple spreadsheet while you do it: name as written on the link, side, and whether they replied. It takes ten minutes and saves the week before the wedding.',
        ],
      },
      {
        title: 'Mistakes that cause awkward conversations',
        paragraphs: [
          'Most addressing problems come from being vague to avoid a decision. Decide who is invited first, then write names that say it.',
        ],
        bullets: [
          'Writing "and family" when you meant only the parents. Children will come.',
          'Leaving out a long-term partner’s name. Use it if you know it; ask a friend if you do not.',
          'Misspelling a name, or using a nickname with an elder. Check spellings against how they write it themselves.',
          'Sending a group chat one generic link. Everyone in the chat assumes everyone is invited, plus-ones included.',
          'Forgetting that a guest may forward the link. A personal greeting makes clear who it was for.',
        ],
      },
    ],
    stepsTitle: 'Address every guest in five steps',
    steps: [
      { title: 'Fix the guest list', text: 'Decide exactly who is invited, including partners and children, before writing a single name.' },
      { title: 'Write each name line', text: 'The form they expect: title, full name, "and family" only when children are invited.' },
      { title: 'Add the side', text: 'For two-family weddings, mark each guest groom’s side or bride’s side.' },
      { title: 'Make the links', text: 'Type each name in the letter settings, copy the personal link, and paste it next to the name in your list.' },
      { title: 'Send and follow up', text: 'Send each link on its own. A week before the reply date, remind those who have not opened or answered.' },
    ],
    faq: [
      { q: 'How do I address an invitation to a couple who are not married?', a: 'Put both full names on one line, each with its own title if you use titles: "Ms Mai Le and Mr David Tran". Order does not matter; many people put the person you know best first.' },
      { q: 'Do I write "and guest" or the partner’s name?', a: 'Use the partner’s name whenever you know it. "And guest" is for a single guest you are allowing to bring someone you have not met.' },
      { q: 'How do I make clear children are not invited?', a: 'Name only the adults on the invitation. If you expect questions, add a short, warm line at the end, such as "This will be an adults-only evening".' },
      { q: 'Can a guest change the name in their link?', a: 'The name is part of the address, so anyone who edits the link can change what their envelope says. It is a greeting, not a ticket; use the reply form to know who is really coming.' },
      { q: 'Can I see which guests opened their invitation?', a: 'With the Wedding pass, yes: the dashboard lists the named guests who opened their link and when. Without it you still see total views and every reply sent through the form.' },
    ],
    ctaTitle: 'Send every guest an invitation with their name on it',
    ctaText: 'Start from a wedding template, write your invitation once, and make one personal link per guest from the letter settings. Free to start; no app for guests to install.',
  },
  vi: {
    seoTitle: 'Cách ghi tên khách trên thiệp cưới cho đúng',
    description: 'Cách ghi tên khách mời trên thiệp cưới: ông bà, cô chú, anh chị, thầy cô, "và gia đình", "và người thương", cùng cách gửi mỗi khách một link thiệp có tên riêng.',
    eyebrow: 'Ghi tên khách mời',
    title: 'Cách ghi tên khách trên thiệp cưới: đúng vai vế, đúng người được mời',
    intro: 'Ghi tên khách trên thiệp cưới cần đúng hai điều: đúng cách xưng hô với người đó, và đúng những ai được mời. Một dòng "Kính mời: Chú Hai và gia đình" đã nói cho khách biết cả nhà được mời, còn "Anh Minh" thì chỉ một người. Với thiệp cưới online, tên khách không viết tay lên phong bì mà nằm trong link riêng gửi cho từng người.',
    sections: [
      {
        title: 'Dòng tên khách quan trọng hơn bạn nghĩ',
        paragraphs: [
          'Dòng tên trên thiệp chính là danh sách khách mời thu nhỏ. "Anh Minh" là mời một mình anh Minh. "Anh Minh và người thương" là anh được đưa người yêu đi cùng. "Anh chị Minh và các cháu" là mời cả nhà. Ghi mơ hồ thì những tuần trước đám cưới bạn sẽ phải trả lời rất nhiều tin nhắn khó xử kiểu "em đưa bé đi được không".',
          'Đây cũng là phần cá nhân nhất của tấm thiệp. Khách thấy đúng tên mình, đúng cách gọi mình vẫn được gọi, sẽ cảm thấy mình được mời thật lòng chứ không phải nhận một thông báo.',
        ],
      },
      {
        title: 'Xưng hô theo vai vế và tuổi tác',
        paragraphs: [
          'Người Việt xưng hô theo vai vế trong họ và tuổi tác, không chỉ theo việc đã có gia đình hay chưa. Vì vậy cùng một người, thiệp nhà trai và thiệp nhà gái có thể gọi khác nhau: với chú rể đó là "Chú Tư", với cô dâu có khi lại là "Bác Tư". Hãy ghi theo cách của người đứng mời trên thiệp, thường là bố mẹ.',
        ],
        bullets: [
          'Người lớn tuổi, bạn của ông bà: "Kính mời: Ông bà Nguyễn Văn Hùng" hoặc "Cụ ông Nguyễn Văn Hùng và gia đình".',
          'Họ hàng: gọi theo thứ trong nhà, "Bác Cả", "Chú Hai", "Cô Ba", "Dì Út". Miền Bắc thường dùng thứ tự bắt đầu từ "Cả", miền Nam bắt đầu từ "Hai".',
          'Đồng nghiệp, bạn của bố mẹ: "Anh chị Trần Minh Đức", hoặc "Gia đình anh Đức".',
          'Thầy cô: "Kính mời Thầy Nguyễn Văn An" hoặc "Cô Lê Thị Hằng". Với thầy cô, luôn dùng cách gọi trang trọng.',
          'Bạn bè: tên thân mật là đủ, "Minh", "Hà & Tuấn", hoặc biệt danh nếu thiệp vui vẻ.',
          'Cấp trên, đối tác: ghi chức danh nếu họ quen được gọi vậy, "Kính mời Giám đốc Phạm Văn Long".',
        ],
      },
      {
        title: '"Và gia đình", "và người thương", "và các cháu"',
        paragraphs: [
          'Ba cụm từ nhỏ này quyết định ai sẽ đến. Hãy dùng đúng ý mình muốn, đừng thêm cho lịch sự nếu nhà hàng chỉ đặt đủ bàn cho người lớn.',
        ],
        bullets: [
          '"Và gia đình": mời cả vợ chồng và con cái. Dùng cho họ hàng thân, hàng xóm lâu năm.',
          '"Anh chị": mời hai vợ chồng, không mời con. Nếu không muốn có trẻ nhỏ, chỉ ghi tên người lớn.',
          '"Và người thương" hoặc "và bạn đồng hành": khách độc thân được đưa thêm một người. Biết tên người yêu của khách thì ghi luôn tên, sẽ ấm áp hơn nhiều.',
          '"Và các cháu": mời cả trẻ nhỏ, nên ghi khi bạn muốn khách yên tâm đưa con theo.',
        ],
      },
      {
        title: 'Mỗi khách một link có tên riêng',
        paragraphs: [
          'Thiệp cưới online giải quyết chuyện viết tên theo cách khác. Thay vì viết tay lên từng phong bì, bạn gửi cho mỗi khách một link có tên của họ. Trên Perlink, bạn gõ tên khách vào ô trong phần cài đặt lá thư mời, bấm sao chép link, link sẽ có đuôi ?to= kèm tên. Khách mở ra sẽ thấy phong bì niêm phong ghi "Gửi Chú Hai và gia đình", chạm vào là thư mở ra cùng nhạc nền.',
          'Tên trong link được giữ đúng như bạn gõ, nên mỗi khách được xưng hô đúng vai vế: người này là "Ông bà Hùng", người kia là "Minh", người nọ là "Thầy An". Nội dung thiệp giống nhau cho tất cả, chỉ lời chào trên phong bì là khác.',
          'Với gói Đám cưới trả một lần, trang quản lý còn cho bạn xem khách nào đã mở thiệp và mở lúc nào, để biết cần nhắc ai trước hạn xác nhận.',
        ],
        samples: [
          { label: 'Danh sách khách sẵn để tạo link', text: 'Ông bà Nguyễn Văn Hùng\nChú Hai và gia đình\nCô Ba, chú Phong\nThầy Nguyễn Văn An\nAnh Minh và người thương\nHà & Tuấn' },
        ],
      },
      {
        title: 'Khách nhà trai, khách nhà gái',
        paragraphs: [
          'Khi hai nhà tổ chức tiệc riêng, mỗi khách không chỉ cần đúng tên mà còn cần đúng giờ, đúng nơi. Bạn làm một trang có hai tab "Nhà trai" và "Nhà gái", rồi thêm bên vào link của từng khách, ví dụ ?to=Chú%20Hai&side=groom cho họ hàng bên nội chú rể, ?side=bride cho khách nhà gái. Khách mở ra thấy tên mình trên phong bì và lịch tiệc bên mình trước, vẫn bấm sang được tab bên kia nếu muốn.',
          'Nên giữ một bảng tính đơn giản: tên như ghi trong link, khách bên nào, đã xác nhận chưa. Mất mười phút nhưng đỡ cho bạn cả tuần cuối trước đám cưới.',
        ],
      },
      {
        title: 'Những lỗi dễ gây khó xử',
        paragraphs: [
          'Hầu hết lỗi ghi tên đến từ việc ghi chung chung cho khỏi phải quyết định. Hãy chốt danh sách trước, rồi mới ghi tên sao cho nói đúng điều đó.',
        ],
        bullets: [
          'Ghi "và gia đình" trong khi chỉ định mời hai vợ chồng: các cháu sẽ đi theo.',
          'Gọi người lớn bằng tên không, hoặc gọi sai vai vế: hỏi bố mẹ trước khi gửi thiệp cho họ hàng.',
          'Viết sai chính tả tên, nhất là tên có dấu: kiểm tra lại theo cách người đó tự viết tên mình.',
          'Thả một link chung vào nhóm chat cơ quan: ai trong nhóm cũng nghĩ mình được mời, kể cả người không định mời.',
          'Quên rằng khách có thể chuyển tiếp link: phong bì có tên giúp ai cũng thấy thiệp này gửi cho ai.',
        ],
      },
    ],
    stepsTitle: 'Ghi tên cho từng khách trong năm bước',
    steps: [
      { title: 'Chốt danh sách khách', text: 'Biết chính xác ai được mời, có đi kèm vợ chồng, người yêu, con nhỏ hay không.' },
      { title: 'Viết dòng tên', text: 'Đúng vai vế theo người đứng mời, chỉ ghi "và gia đình" khi mời cả nhà.' },
      { title: 'Đánh dấu bên', text: 'Đám cưới hai nhà tổ chức riêng thì ghi rõ khách nhà trai hay nhà gái.' },
      { title: 'Tạo link riêng', text: 'Gõ từng tên trong phần cài đặt lá thư, sao chép link và dán cạnh tên trong danh sách.' },
      { title: 'Gửi và nhắc', text: 'Gửi riêng từng link qua Zalo hay Messenger. Trước hạn xác nhận một tuần, nhắc những ai chưa mở hoặc chưa trả lời.' },
    ],
    faq: [
      { q: 'Thiệp mời đồng nghiệp nên ghi "anh/chị" hay ghi tên không?', a: 'Với đồng nghiệp lớn tuổi hơn hoặc cấp trên, ghi "anh/chị" kèm tên. Đồng nghiệp ngang tuổi, thân thiết thì tên thân mật là đủ.' },
      { q: 'Muốn mời khách đi kèm người yêu thì ghi thế nào?', a: 'Ghi "Anh Minh và người thương", hoặc ghi luôn tên người yêu nếu bạn biết: "Minh & Hà". Ghi tên luôn sẽ ấm áp hơn.' },
      { q: 'Không muốn khách đưa con nhỏ theo thì ghi thế nào cho khéo?', a: 'Chỉ ghi tên hai vợ chồng, không ghi "và gia đình". Nếu sợ khách hiểu lầm, thêm một câu nhẹ nhàng ở cuối thiệp, ví dụ giờ tiệc khá muộn nên mong anh chị thông cảm.' },
      { q: 'Khách có tự sửa tên trong link được không?', a: 'Tên nằm ngay trong địa chỉ link, nên ai sửa link thì phong bì sẽ hiện tên khác. Đây là lời chào, không phải vé mời; để biết ai thật sự đến, hãy dựa vào form xác nhận tham dự.' },
      { q: 'Có biết khách nào đã mở thiệp không?', a: 'Có, với gói Đám cưới: trang quản lý liệt kê các khách có tên đã mở link và thời gian mở. Gói miễn phí vẫn xem được tổng lượt xem và mọi xác nhận tham dự gửi qua form.' },
    ],
    ctaTitle: 'Gửi mỗi khách một tấm thiệp có tên riêng',
    ctaText: 'Chọn một mẫu thiệp cưới, viết lời mời một lần, rồi tạo link riêng cho từng khách ngay trong phần cài đặt lá thư. Miễn phí để bắt đầu, khách không cần cài ứng dụng.',
  },
}
