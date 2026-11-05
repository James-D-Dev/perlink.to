import type { PortfolioTopic } from './types'

// "3D portfolio for students": a first portfolio for an internship, a first
// job or a scholarship, when there is little work experience to show yet
export const STUDENT_TOPIC: PortfolioTopic = {
  id: 'student',
  path: { en: 'student', vi: 'sinh-vien' },
  demo: 'student',
  templates: ['personal-resume', 'personal', 'personal-neon'],
  updated: '2026-11-06',
  readMinutes: 7,
  en: {
    seoTitle: '3D Portfolio for Students: Free, No Code | Perlink',
    description: 'A 3D portfolio for students applying for internships, first jobs or scholarships: school projects, clubs and side work on a page and in a 3D room.',
    eyebrow: '3D portfolio for students',
    title: 'A 3D portfolio for students, even with little experience',
    intro: 'When you apply for an internship, a first job or a scholarship, your CV is one page among hundreds and looks like all the others. A portfolio link gives the reader something to look at, and a 3D room they can walk around makes them remember your name. Perlink lets you make both in an afternoon, for free, without coding.',
    demoTitle: 'Walk around a student’s room',
    demoText: 'Drag to look around and tap a frame to see a project large. School work, a club event and a side project, each on its own wall.',
    sections: [
      {
        title: 'You have more to show than you think',
        paragraphs: [
          'Most students leave the portfolio for later because “I don’t have any real work yet”. Recruiters for internships and graduate roles know that. They are not looking for client projects; they want proof that you can finish something and explain it.',
        ],
        bullets: [
          'Course projects and theses: pick the ones you are proud of, not all of them.',
          'Clubs and volunteering: an event you organised, a page you ran, a fundraiser you helped with.',
          'Side projects: a small app, a blog, a design challenge, a video series, photos.',
          'Competitions and hackathons: what you built in the time, even if you didn’t win.',
          'Part-time jobs: what you learned and what you were trusted with.',
        ],
      },
      {
        title: 'Explain each project in four lines',
        paragraphs: [
          'A picture alone tells the reader little. For each project, write four short lines: what it was, what you did yourself (in a group project, say your part honestly), what tools you used, and what came out of it, such as a grade, a number of readers, an event that happened or a lesson learned.',
          'This is exactly what interviewers ask about. If the answers are already on your page, the conversation starts from your work instead of from your CV.',
        ],
      },
      {
        title: 'Your CV and your portfolio work together',
        paragraphs: [
          'Keep your CV short and factual, and let the portfolio carry the pictures and stories. On Perlink, the timeline block works well for education, clubs and jobs in order, and a link at the top can download your CV as a PDF.',
          'Then put the portfolio link on the CV, near your name and email. Many applications today are read on a phone between meetings, so a link that opens a fast, readable page is worth more than a heavy attachment.',
        ],
      },
      {
        title: 'Stand out without exaggerating',
        paragraphs: [
          'The 3D room is what makes a recruiter mention your portfolio to a colleague. Use it to show personality: the land and light you like, your projects framed on the walls, a neon sign with a line about you, a bookshelf, a desk with a laptop linking to your GitHub, Behance or LinkedIn.',
          'Keep the content honest, though. Don’t list skills you have used once, don’t present a group project as yours alone, and don’t invent results. A modest, well-explained project beats an impressive claim that falls apart at the first question.',
        ],
      },
      {
        title: 'A QR code for career fairs and printed CVs',
        paragraphs: [
          'Every Perlink site has a QR code you can download. Print it in a corner of your CV, on a name card for career fairs or on the last slide of your graduation presentation. Someone who scans it on the spot sees your work right away, and the analytics show you how many visits and clicks your site got.',
        ],
      },
      {
        title: 'Keep it alive after you get the job',
        paragraphs: [
          'A portfolio is not a one-time assignment. Add a project each semester, remove the weakest one, and update the line at the top that says what you are looking for. You can edit from your phone, so it takes minutes. When you change field or apply for a master’s, the same address is already in people’s inboxes.',
        ],
      },
    ],
    stepsTitle: 'Make your student portfolio this weekend',
    steps: [
      { title: 'Pick your address', text: 'Use your real name, like perlink.to/linh-nguyen, so it looks right on a CV.' },
      { title: 'Start from the Online CV template', text: 'It has a timeline, skills, recommendations and a contact form already laid out.' },
      { title: 'Add three to five projects', text: 'A few photos and four lines each: what, your part, tools, result.' },
      { title: 'Dress your room', text: 'Choose a land, frame your best projects, write a line on the neon sign and link your profiles.' },
      { title: 'Publish and print the QR code', text: 'Put the link and QR code on your CV, email signature and LinkedIn.' },
    ],
    faq: [
      { q: 'Is it really free for students?', a: 'Yes. The free plan gives you one site with the portfolio page, the 3D room and 30 days of analytics, with no time limit. You sign in with Google, Facebook or TikTok; you don’t need a card to start.' },
      { q: 'I don’t have any work experience. What should I put in it?', a: 'Course projects, a thesis, club activities, volunteering, competitions, side projects and part-time jobs. Pick three to five, and explain what you did yourself in each one.' },
      { q: 'Do I need to know how to code or use 3D software?', a: 'No. You pick a template and edit everything in a visual editor. Perlink builds the 3D room; you choose the land, the furniture and the pictures on the walls.' },
      { q: 'Will a 3D portfolio look unprofessional to recruiters?', a: 'Visitors land on a normal, clean portfolio page first, and the room is one tap away. You can also choose to open the room first if you apply for creative roles.' },
      { q: 'Can I attach my CV as a PDF?', a: 'Yes. Upload your CV somewhere you can share, such as Google Drive, and add it as a link on the page or on the laptop in the room.' },
      { q: 'Can I use it for scholarship applications?', a: 'Yes. Write a short text about your goals, add the timeline of your studies and activities, and include the link in your application where links are allowed.' },
      { q: 'Does it work on phones?', a: 'Yes. The page is built for phones first, and the room adjusts its quality to the device, so it opens smoothly from a QR code or a LinkedIn message.' },
    ],
    ctaTitle: 'Give recruiters something to remember',
    ctaText: 'Pick your address and add your first project. Free, and ready before your next application.',
  },
  vi: {
    seoTitle: 'Portfolio 3D cho sinh viên, miễn phí | Perlink',
    description: 'Portfolio 3D cho sinh viên xin thực tập, việc làm đầu tiên hay học bổng: đồ án, hoạt động câu lạc bộ, dự án cá nhân trên một trang web và phòng 3D.',
    eyebrow: 'Portfolio 3D cho sinh viên',
    title: 'Portfolio 3D cho sinh viên, kể cả khi chưa có nhiều kinh nghiệm',
    intro: 'Khi xin thực tập, việc làm đầu tiên hay học bổng, CV của bạn chỉ là một trang giữa hàng trăm trang na ná nhau. Một đường link portfolio cho người đọc thứ gì đó để xem, còn một căn phòng 3D để dạo quanh khiến họ nhớ tên bạn. Với Perlink, bạn làm được cả hai trong một buổi chiều, miễn phí, không cần biết code.',
    demoTitle: 'Dạo thử phòng của một bạn sinh viên',
    demoText: 'Kéo để nhìn quanh, chạm vào khung tranh để xem dự án cỡ lớn. Đồ án, một sự kiện câu lạc bộ và một dự án cá nhân, mỗi thứ một bức tường.',
    sections: [
      {
        title: 'Bạn có nhiều thứ để khoe hơn bạn nghĩ',
        paragraphs: [
          'Nhiều bạn để portfolio “tính sau” vì nghĩ mình chưa có sản phẩm thật. Nhà tuyển dụng thực tập và vị trí mới ra trường đều biết điều đó. Họ không tìm dự án cho khách hàng; họ muốn thấy bằng chứng là bạn làm xong được một việc và giải thích được nó.',
        ],
        bullets: [
          'Đồ án, bài tập lớn, khóa luận: chọn những cái bạn tự hào, không cần đưa hết.',
          'Câu lạc bộ, tình nguyện: một sự kiện bạn tổ chức, một fanpage bạn chạy, một đợt gây quỹ bạn góp sức.',
          'Dự án cá nhân: một app nhỏ, một blog, một thử thách thiết kế, một series video, một bộ ảnh.',
          'Cuộc thi, hackathon: bạn đã làm ra gì trong thời gian đó, kể cả khi không đạt giải.',
          'Việc làm thêm: bạn học được gì và được giao trách nhiệm gì.',
        ],
      },
      {
        title: 'Mỗi dự án, giải thích trong bốn dòng',
        paragraphs: [
          'Chỉ một tấm ảnh thì người xem hiểu được rất ít. Với mỗi dự án, viết bốn dòng ngắn: đó là gì, phần bạn tự làm là gì (dự án nhóm thì nói thật phần của mình), dùng công cụ gì, và kết quả ra sao: điểm số, số người đọc, sự kiện diễn ra suôn sẻ, hay bài học rút ra.',
          'Đó cũng chính là những câu người phỏng vấn sẽ hỏi. Nếu câu trả lời đã có sẵn trên trang, buổi nói chuyện sẽ bắt đầu từ sản phẩm của bạn chứ không phải từ tờ CV.',
        ],
      },
      {
        title: 'CV và portfolio bổ sung cho nhau',
        paragraphs: [
          'Giữ CV ngắn gọn, đúng sự thật, còn hình ảnh và câu chuyện để portfolio lo. Trên Perlink, khối dòng thời gian rất hợp để kể quá trình học, hoạt động và công việc theo thứ tự, và một đường link ở đầu trang cho phép tải CV dạng PDF.',
          'Sau đó đặt link portfolio lên CV, ngay cạnh tên và email. Bây giờ nhiều hồ sơ được đọc trên điện thoại, giữa hai cuộc họp, nên một link mở ra trang nhẹ, dễ đọc đáng giá hơn một file đính kèm nặng nề.',
        ],
      },
      {
        title: 'Nổi bật mà không phóng đại',
        paragraphs: [
          'Căn phòng 3D là thứ khiến nhà tuyển dụng nhắc tới portfolio của bạn với đồng nghiệp. Hãy dùng nó để thể hiện cá tính: vùng đất và ánh sáng bạn thích, dự án treo trên tường, bảng neon viết một câu về bạn, kệ sách, bàn làm việc có laptop dẫn tới GitHub, Behance hay LinkedIn.',
          'Nhưng nội dung thì phải thật. Đừng liệt kê kỹ năng mới dùng một lần, đừng nhận dự án nhóm là của riêng mình, đừng bịa kết quả. Một dự án khiêm tốn mà giải thích rõ ràng luôn hơn một lời khoe ấn tượng nhưng sụp đổ ngay câu hỏi đầu tiên.',
        ],
      },
      {
        title: 'Mã QR cho ngày hội việc làm và CV in',
        paragraphs: [
          'Trang Perlink nào cũng có mã QR để tải về. In nó ở góc CV, lên tấm thẻ tên khi đi ngày hội việc làm, hay ở slide cuối buổi bảo vệ tốt nghiệp. Người quét tại chỗ thấy ngay sản phẩm của bạn, và phần thống kê cho bạn biết trang có bao nhiêu lượt xem, lượt bấm.',
        ],
      },
      {
        title: 'Đi làm rồi vẫn nên giữ',
        paragraphs: [
          'Portfolio không phải bài tập nộp một lần. Mỗi học kỳ thêm một dự án, bỏ bớt cái yếu nhất, và sửa dòng đầu trang nói bạn đang tìm cơ hội gì. Bạn sửa được ngay trên điện thoại nên chỉ mất vài phút. Đến khi chuyển ngành hay nộp hồ sơ thạc sĩ, địa chỉ đó đã nằm sẵn trong hộp thư của nhiều người.',
        ],
      },
    ],
    stepsTitle: 'Làm portfolio sinh viên ngay cuối tuần này',
    steps: [
      { title: 'Chọn địa chỉ', text: 'Dùng tên thật, ví dụ perlink.to/linh-nguyen, để in lên CV trông chuyên nghiệp.' },
      { title: 'Bắt đầu từ mẫu CV online', text: 'Mẫu có sẵn dòng thời gian, kỹ năng, nhận xét và biểu mẫu liên hệ.' },
      { title: 'Thêm ba đến năm dự án', text: 'Vài tấm ảnh và bốn dòng cho mỗi dự án: là gì, phần của bạn, công cụ, kết quả.' },
      { title: 'Trang trí căn phòng', text: 'Chọn vùng đất, treo dự án đẹp nhất, viết một câu lên bảng neon và gắn link hồ sơ của bạn.' },
      { title: 'Đăng và in mã QR', text: 'Đưa link và mã QR lên CV, chữ ký email và LinkedIn.' },
    ],
    faq: [
      { q: 'Sinh viên dùng có thật sự miễn phí không?', a: 'Có. Gói miễn phí gồm một trang với portfolio, phòng 3D và thống kê 30 ngày, không giới hạn thời gian. Bạn đăng nhập bằng Google, Facebook hoặc TikTok, không cần thẻ thanh toán.' },
      { q: 'Mình chưa đi làm ngày nào, đưa gì vào bây giờ?', a: 'Đồ án, khóa luận, hoạt động câu lạc bộ, tình nguyện, cuộc thi, dự án cá nhân và việc làm thêm. Chọn ba đến năm cái, và nói rõ phần bạn tự làm trong mỗi cái.' },
      { q: 'Có cần biết code hay phần mềm 3D không?', a: 'Không. Bạn chọn mẫu rồi chỉnh mọi thứ trong trình chỉnh sửa trực quan. Perlink dựng phòng 3D; bạn chỉ chọn vùng đất, đồ đạc và tranh treo tường.' },
      { q: 'Portfolio 3D có làm nhà tuyển dụng thấy thiếu chuyên nghiệp không?', a: 'Người xem vào một trang portfolio bình thường, gọn gàng trước, căn phòng chỉ cách một lần chạm. Nếu ứng tuyển vị trí sáng tạo, bạn có thể cho phòng mở trước.' },
      { q: 'Có đính kèm CV dạng PDF được không?', a: 'Được. Tải CV lên nơi chia sẻ được như Google Drive, rồi gắn link trên trang hoặc trên chiếc laptop trong phòng.' },
      { q: 'Dùng để nộp học bổng được không?', a: 'Được. Viết một đoạn ngắn về mục tiêu, thêm dòng thời gian học tập và hoạt động, rồi dán link vào hồ sơ ở chỗ cho phép gửi đường link.' },
      { q: 'Mở trên điện thoại có ổn không?', a: 'Ổn. Trang được làm cho điện thoại trước tiên, phòng 3D tự chỉnh chất lượng theo máy, nên quét QR hay bấm link từ tin nhắn LinkedIn đều mở mượt.' },
    ],
    ctaTitle: 'Cho nhà tuyển dụng một lý do để nhớ bạn',
    ctaText: 'Chọn địa chỉ và thêm dự án đầu tiên. Miễn phí, xong trước lần nộp hồ sơ tới.',
  },
}
