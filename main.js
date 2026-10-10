
"use strict";

/*
 * StudyFull
 * Files: index.html, style.css, main.js
 *
 * Back4App configuration:
 * Set APP_ID and JAVASCRIPT_KEY below using your own dashboard values.
 * Never put your Back4App Master Key in this file.
 */

const CONFIG = {
  APP_ID: "NLxjmmhCCJ4CHeNJ4LSn50lYdkrd6roRByZnnusc",
  JAVASCRIPT_KEY: "Vx2F8zhGtOEek9mshM0kXSP61Dsi6R5zK0547B3X",
  SERVER_URL: "https://parseapi.back4app.com/"
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const DAY = 86400000;
const XP_PER_CORRECT = 10;
const MAX_QUIZ_QUESTIONS = 50;

const GRADES = Array.from({ length: 12 }, (_, i) => i + 1);
const SUBJECTS = [
  { value: "Maths", en: "Maths", vi: "Toán" },
  { value: "Vietnamese", en: "Vietnamese", vi: "Tiếng Việt" },
  { value: "English", en: "English", vi: "Tiếng Anh" },
  { value: "Science", en: "Science", vi: "Khoa học" },
  { value: "History", en: "History & Geography", vi: "Lịch sử & Địa lí" },
  { value: "Informatics", en: "Informatics", vi: "Tin học" }
];

const TRANSLATIONS = {
  en: {
    menu: "MENU", home: "Home", study: "Study", quizzes: "Quizzes",
    classes: "Classes", leaderboard: "Leaderboard", achievements: "Achievements",
    createQuiz: "Create quiz", profile: "My profile", keepGoing: "Keep it going!",
    welcomeBack: "WELCOME TO YOUR LEARNING SPACE", hello: "Hello",
    welcomeSubtitle: "Small steps today, big achievements tomorrow.",
    heroTag: "YOUR NEXT ADVENTURE STARTS HERE",
    heroTitle: "Make every day a learning day.",
    heroText: "Explore subjects, challenge yourself and celebrate every milestone.",
    exploreStudy: "Explore study materials →", yourProgress: "Your progress",
    progressSubtitle: "Your learning journey at a glance.", totalXP: "Total XP",
    xpEarned: "Experience earned", dailyStreak: "Daily streak",
    streakSubtitle: "Days learning in a row", timeLearnt: "Time learnt",
    timeSubtitle: "Time spent on quizzes", numberClasses: "My classes",
    classesSubtitle: "Classes joined", continueLearning: "Continue learning",
    continueSubtitle: "Pick up a new challenge.", viewAll: "View all →",
    dailyGoal: "Daily goal", dailyGoalText: "Build your learning habit.",
    recentBadges: "Your achievements", badgesSubtitle: "Celebrate your milestones.",
    seeBadges: "See badges →", studyTitle: "Study materials 📚",
    studySubtitle: "Choose your grade, subject and topic.", grade: "Grade",
    subject: "Subject", topic: "Topic", openLesson: "Open lesson",
    backToTopics: "Back to topics",
    studyNotice: "StudyFull provides learning guides and practice frameworks. Check your official textbook for the complete curriculum.",
    quizTitle: "Quiz zone 🧠", quizSubtitle: "Test what you know and earn XP.",
    joinClass: "Join a class", join: "Join class", createClass: "Create a class",
    className: "Class name", createClassButton: "Create class", myClasses: "My classes",
    classesTitle: "Your classes 🏫", classesSubtitle2: "Join your classmates or manage your class.",
    leaderboardTitle: "Leaderboard 🏆",
    leaderboardSubtitle: "A little progress each day adds up.",
    learner: "Learner", points: "Points",
    leaderboardNote: "Student accounts only are displayed on the leaderboard.",
    achievementTitle: "Achievements 🏅", achievementSubtitle: "Earn badges as you grow.",
    createTitle: "Create a quiz ✏️", createSubtitle: "Build a quiz for your students.",
    quizName: "Quiz name", quizDescription: "Description", questions: "Questions",
    addQuestion: "Add question", publishQuiz: "Publish quiz",
    myCreatedQuizzes: "My quizzes", profileTitle: "My profile 👤",
    profileSubtitle: "Your account and learning statistics.", editProfile: "Edit profile",
    learningStats: "Learning statistics", quizzesCompleted: "Quizzes completed",
    accuracy: "Accuracy", accountSettings: "Account settings",
    accountSettingsText: "Your username is used to sign in. Never share your password.",
    changePassword: "Change password", username: "Username", password: "Password",
    displayName: "Display name", role: "Account type", saveChanges: "Save changes",
    currentPassword: "Current password", newPassword: "New password"
  },
  vi: {
    menu: "DANH MỤC", home: "Trang chủ", study: "Học tập",
    quizzes: "Bài kiểm tra", classes: "Lớp học", leaderboard: "Bảng xếp hạng",
    achievements: "Thành tích", createQuiz: "Tạo bài kiểm tra",
    profile: "Hồ sơ", keepGoing: "Tiếp tục nhé!",
    welcomeBack: "CHÀO MỪNG BẠN ĐẾN VỚI STUDYFULL", hello: "Xin chào",
    welcomeSubtitle: "Tiến bộ từng ngày, đạt thành tích lớn hơn.",
    heroTag: "HÀNH TRÌNH TIẾP THEO BẮT ĐẦU TỪ ĐÂY",
    heroTitle: "Biến mỗi ngày thành một ngày học tập.",
    heroText: "Khám phá môn học, thử thách bản thân và chúc mừng từng cột mốc.",
    exploreStudy: "Khám phá tài liệu →", yourProgress: "Tiến độ học tập",
    progressSubtitle: "Tổng quan hành trình học tập của bạn.",
    totalXP: "Tổng XP", xpEarned: "Điểm kinh nghiệm",
    dailyStreak: "Chuỗi ngày học", streakSubtitle: "Số ngày học liên tiếp",
    timeLearnt: "Thời gian học", timeSubtitle: "Thời gian làm bài kiểm tra",
    numberClasses: "Lớp học", classesSubtitle: "Số lớp đã tham gia",
    continueLearning: "Tiếp tục học", continueSubtitle: "Thử một thử thách mới.",
    viewAll: "Xem tất cả →", dailyGoal: "Mục tiêu hằng ngày",
    dailyGoalText: "Xây dựng thói quen học tập.",
    recentBadges: "Thành tích của bạn", badgesSubtitle: "Chúc mừng những cột mốc.",
    seeBadges: "Xem huy hiệu →", studyTitle: "Tài liệu học tập 📚",
    studySubtitle: "Chọn khối lớp, môn học và chủ đề.",
    grade: "Khối lớp", subject: "Môn học", topic: "Chủ đề",
    openLesson: "Mở bài học", backToTopics: "Quay lại chủ đề",
    studyNotice: "StudyFull cung cấp hướng dẫn và bài luyện tập. Hãy tham khảo sách giáo khoa chính thức để học đầy đủ chương trình.",
    quizTitle: "Khu vực kiểm tra 🧠",
    quizSubtitle: "Kiểm tra kiến thức và nhận XP.",
    joinClass: "Tham gia lớp", join: "Tham gia",
    createClass: "Tạo lớp học", className: "Tên lớp",
    createClassButton: "Tạo lớp", myClasses: "Lớp của tôi",
    classesTitle: "Lớp học của bạn 🏫",
    classesSubtitle2: "Tham gia cùng bạn bè hoặc quản lý lớp.",
    leaderboardTitle: "Bảng xếp hạng 🏆",
    leaderboardSubtitle: "Mỗi ngày tiến bộ một chút.",
    learner: "Người học", points: "Điểm",
    leaderboardNote: "Chỉ tài khoản học sinh được hiển thị trên bảng xếp hạng.",
    achievementTitle: "Huy hiệu thành tích 🏅",
    achievementSubtitle: "Nhận huy hiệu khi bạn tiến bộ.",
    createTitle: "Tạo bài kiểm tra ✏️",
    createSubtitle: "Tạo bài kiểm tra cho học sinh.",
    quizName: "Tên bài kiểm tra", quizDescription: "Mô tả",
    questions: "Câu hỏi", addQuestion: "Thêm câu hỏi",
    publishQuiz: "Đăng bài kiểm tra", myCreatedQuizzes: "Bài kiểm tra của tôi",
    profileTitle: "Hồ sơ của tôi 👤",
    profileSubtitle: "Tài khoản và thống kê học tập.",
    editProfile: "Sửa hồ sơ", learningStats: "Thống kê học tập",
    quizzesCompleted: "Bài kiểm tra hoàn thành", accuracy: "Độ chính xác",
    accountSettings: "Cài đặt tài khoản",
    accountSettingsText: "Dùng tên đăng nhập để đăng nhập. Không chia sẻ mật khẩu.",
    changePassword: "Đổi mật khẩu", username: "Tên đăng nhập",
    password: "Mật khẩu", displayName: "Tên hiển thị",
    role: "Loại tài khoản", saveChanges: "Lưu thay đổi",
    currentPassword: "Mật khẩu hiện tại", newPassword: "Mật khẩu mới"
  }
};

const BADGES = [
  { id: "first_quiz", icon: "🌱", title: "First Steps", vi: "Bước đầu tiên", description: "Complete your first quiz.", viDesc: "Hoàn thành bài kiểm tra đầu tiên.", test: s => s.completed >= 1 },
  { id: "xp_200", icon: "⭐", title: "200 XP", vi: "200 XP", description: "Earn 200 XP.", viDesc: "Đạt 200 XP.", test: s => s.xp >= 200 },
  { id: "xp_1000", icon: "🏆", title: "XP Champion", vi: "Nhà vô địch XP", description: "Earn 1,000 XP.", viDesc: "Đạt 1.000 XP.", test: s => s.xp >= 1000 },
  { id: "five_quizzes", icon: "🧠", title: "Quiz Explorer", vi: "Nhà thám hiểm", description: "Complete 5 quizzes.", viDesc: "Hoàn thành 5 bài kiểm tra.", test: s => s.completed >= 5 },
  { id: "ten_quizzes", icon: "🎯", title: "Quiz Master", vi: "Bậc thầy kiểm tra", description: "Complete 10 quizzes.", viDesc: "Hoàn thành 10 bài kiểm tra.", test: s => s.completed >= 10 },
  { id: "three_day_streak", icon: "🔥", title: "On a Roll", vi: "Bền bỉ", description: "Reach a 3-day streak.", viDesc: "Học 3 ngày liên tiếp.", test: s => s.streak >= 3 },
  { id: "seven_day_streak", icon: "📅", title: "Weekly Wonder", vi: "Chăm chỉ cả tuần", description: "Reach a 7-day streak.", viDesc: "Học 7 ngày liên tiếp.", test: s => s.streak >= 7 },
  { id: "ten_hours", icon: "⏰", title: "Dedicated Learner", vi: "Người học chăm chỉ", description: "Learn for 10 hours.", viDesc: "Học đủ 10 giờ.", test: s => s.minutes >= 600 }
];

const DEMO_QUIZZES = [
  {
    id: "demo-maths-4", title: "Lớp 4 · Toán", grade: 4, subject: "Maths",
    description: "Practise multiplication, division and number sense.",
    icon: "🔢", authorName: "StudyFull", questions: [
      { text: "What is 125 × 4?", options: ["400", "450", "500", "550"], correct: 2 },
      { text: "What is 864 ÷ 8?", options: ["108", "118", "98", "106"], correct: 0 },
      { text: "Which fraction equals one half?", options: ["1/3", "2/4", "3/4", "2/3"], correct: 1 },
      { text: "What is 3,450 + 2,175?", options: ["5,525", "5,625", "5,725", "5,615"], correct: 1 },
      { text: "How many minutes are in 2 hours?", options: ["60", "90", "100", "120"], correct: 3 }
    ]
  },
  {
    id: "demo-vietnamese-4", title: "Lớp 4 · Tiếng Việt", grade: 4, subject: "Vietnamese",
    description: "Practise vocabulary, sentence structure and reading.",
    icon: "📖", authorName: "StudyFull", questions: [
      { text: "Từ nào sau đây là danh từ?", options: ["Chạy", "Xinh đẹp", "Học sinh", "Nhanh"], correct: 2 },
      { text: "Câu nào có hình ảnh so sánh?", options: ["Em đi học.", "Mặt trời đỏ như quả cầu lửa.", "Trời đang mưa.", "Bạn đọc sách."], correct: 1 },
      { text: "Từ trái nghĩa với 'chăm chỉ' là gì?", options: ["Siêng năng", "Cần cù", "Lười biếng", "Kiên trì"], correct: 2 },
      { text: "Cuối câu hỏi thường dùng dấu nào?", options: [".", ",", "?", "!"], correct: 2 }
    ]
  },
  {
    id: "demo-science-4", title: "Lớp 4 · Khoa học", grade: 4, subject: "Science",
    description: "Explore matter, energy and living things.",
    icon: "🔬", authorName: "StudyFull", questions: [
      { text: "Which is a source of light?", options: ["The Moon itself", "The Sun", "A stone", "A book"], correct: 1 },
      { text: "Which state of matter has a fixed shape?", options: ["Gas", "Liquid", "Solid", "Vapour"], correct: 2 },
      { text: "Which organ pumps blood around the body?", options: ["Lungs", "Heart", "Stomach", "Brain"], correct: 1 },
      { text: "Plants generally need which three things to grow?", options: ["Water, light and air", "Plastic, sand and oil", "Salt, smoke and darkness", "Only soil"], correct: 0 }
    ]
  },
  {
    id: "demo-history-4", title: "Lớp 4 · Lịch sử & Địa lí", grade: 4, subject: "History",
    description: "Explore Vietnamese history and geography.",
    icon: "🌏", authorName: "StudyFull", questions: [
      { text: "What is the capital of Vietnam?", options: ["Huế", "Đà Nẵng", "Hà Nội", "Cần Thơ"], correct: 2 },
      { text: "Which river flows through the Mekong Delta?", options: ["Mekong", "Red River only", "Thames", "Nile"], correct: 0 },
      { text: "Which direction does the Sun generally rise from?", options: ["North", "South", "East", "West"], correct: 2 }
    ]
  },
  {
    id: "demo-english-4", title: "Grade 4 · English", grade: 4, subject: "English",
    description: "Practise everyday English and grammar.",
    icon: "🔤", authorName: "StudyFull", questions: [
      { text: "Choose the correct sentence.", options: ["She go to school.", "She goes to school.", "She going school.", "She gone to school."], correct: 1 },
      { text: "What is the plural of 'child'?", options: ["Childs", "Childes", "Children", "Childrens"], correct: 2 },
      { text: "Choose the opposite of 'early'.", options: ["Soon", "Late", "Quick", "Fast"], correct: 1 }
    ]
  },
  {
    id: "demo-computing-4", title: "Grade 4 · Informatics", grade: 4, subject: "Informatics",
    description: "Learn basic computing and digital safety.",
    icon: "💻", authorName: "StudyFull", questions: [
      { text: "What is a keyboard used for?", options: ["Entering text", "Printing paper", "Playing sound only", "Showing images only"], correct: 0 },
      { text: "Which is a strong password habit?", options: ["Share it with friends", "Use 12345678", "Use a unique, hard-to-guess password", "Write it publicly"], correct: 2 },
      { text: "What should you do with a suspicious link?", options: ["Open it quickly", "Send it to everyone", "Avoid clicking and ask a trusted adult", "Enter your password"], correct: 2 }
    ]
  }
];

const STUDY_TOPICS = {
  Maths: {
    en: ["Numbers and place value", "Addition and subtraction", "Multiplication and division", "Fractions", "Geometry and measurement", "Word problems"],
    vi: ["Số tự nhiên và giá trị hàng", "Phép cộng và phép trừ", "Phép nhân và phép chia", "Phân số", "Hình học và đo lường", "Toán có lời văn"]
  },
  Vietnamese: {
    en: ["Reading comprehension", "Vocabulary", "Parts of speech", "Sentence building", "Writing practice"],
    vi: ["Đọc hiểu", "Từ ngữ", "Từ loại", "Đặt câu", "Luyện viết"]
  },
  English: {
    en: ["Vocabulary", "Everyday conversations", "Grammar basics", "Reading practice", "Writing practice"],
    vi: ["Từ vựng", "Giao tiếp hằng ngày", "Ngữ pháp cơ bản", "Luyện đọc", "Luyện viết"]
  },
  Science: {
    en: ["Living things", "Matter and materials", "Energy", "Human body and health", "Environment"],
    vi: ["Sinh vật", "Vật chất và vật liệu", "Năng lượng", "Cơ thể người và sức khỏe", "Môi trường"]
  },
  History: {
    en: ["Vietnamese history", "Geography of Vietnam", "Maps and directions", "People and communities"],
    vi: ["Lịch sử Việt Nam", "Địa lí Việt Nam", "Bản đồ và phương hướng", "Con người và cộng đồng"]
  },
  Informatics: {
    en: ["Computer basics", "Typing and documents", "Algorithms and sequences", "Digital safety"],
    vi: ["Máy tính cơ bản", "Gõ phím và văn bản", "Thuật toán và trình tự", "An toàn số"]
  }
};

const LESSONS = {
  Maths: {
    "Numbers and place value": {
      en: ["Digits represent different values depending on their positions.", "For example, 3,482 has 3 thousands, 4 hundreds, 8 tens and 2 ones.", "To compare numbers, compare digits from left to right.", "Practice: What is the value of the digit 7 in 4,725? Answer: 700."],
      vi: ["Mỗi chữ số có giá trị khác nhau tùy theo vị trí.", "Ví dụ, số 3.482 có 3 nghìn, 4 trăm, 8 chục và 2 đơn vị.", "Để so sánh số, hãy so sánh các chữ số từ trái sang phải.", "Luyện tập: Chữ số 7 trong số 4.725 có giá trị bao nhiêu? Đáp án: 700."]
    },
    "Addition and subtraction": {
      en: ["Line up digits according to place value.", "Add or subtract from the ones column, carrying or regrouping when needed.", "Check your answer using the inverse operation.", "Practice: 2,450 + 1,375 = 3,825."],
      vi: ["Đặt các chữ số thẳng hàng theo giá trị hàng.", "Cộng hoặc trừ từ hàng đơn vị, nhớ hoặc đổi khi cần.", "Kiểm tra kết quả bằng phép tính ngược lại.", "Luyện tập: 2.450 + 1.375 = 3.825."]
    },
    "Multiplication and division": {
      en: ["Multiplication combines equal groups. Division shares equally.", "Check a division answer by multiplying the quotient by the divisor.", "Practice: 24 × 3 = 72; 72 ÷ 3 = 24."],
      vi: ["Phép nhân gộp các nhóm bằng nhau. Phép chia chia đều các nhóm.", "Kiểm tra phép chia bằng cách nhân thương với số chia.", "Luyện tập: 24 × 3 = 72; 72 ÷ 3 = 24."]
    },
    "Fractions": {
      en: ["A fraction represents part of a whole.", "The numerator is above the line; the denominator is below it.", "Fractions such as 1/2 and 2/4 have the same value.", "Practice: If a pizza is split into 8 equal pieces and you eat 3, you ate 3/8."],
      vi: ["Phân số biểu thị một phần của tổng thể.", "Tử số nằm trên gạch phân số; mẫu số nằm dưới.", "Các phân số như 1/2 và 2/4 có giá trị bằng nhau.", "Luyện tập: Chiếc bánh chia thành 8 phần bằng nhau, ăn 3 phần thì đã ăn 3/8 chiếc bánh."]
    }
  },
  Vietnamese: {
    "Reading comprehension": {
      en: ["Read a passage carefully, identify the main idea and find details that support it.", "Ask who, what, when, where, why and how.", "Practice: After reading a paragraph, explain its main idea in one sentence."],
      vi: ["Đọc kĩ đoạn văn, xác định ý chính và tìm chi tiết hỗ trợ.", "Đặt câu hỏi ai, cái gì, khi nào, ở đâu, vì sao và như thế nào.", "Luyện tập: Sau khi đọc một đoạn văn, hãy nêu ý chính bằng một câu."]
    },
    "Vocabulary": {
      en: ["Words can have similar or opposite meanings.", "Synonyms have similar meanings; antonyms have opposite meanings.", "Practice: 'Chăm chỉ' and 'siêng năng' have similar meanings."],
      vi: ["Các từ có thể có nghĩa giống hoặc trái ngược nhau.", "Từ đồng nghĩa có nghĩa gần giống; từ trái nghĩa có nghĩa đối lập.", "Luyện tập: 'Chăm chỉ' và 'siêng năng' là các từ gần nghĩa."]
    }
  },
  English: {
    "Grammar basics": {
      en: ["A simple sentence often has a subject and a verb.", "With he, she or it in the present simple, many verbs take -s or -es.", "Example: I play football. She plays football.", "Practice: He ___ (go/goes) to school. Answer: goes."],
      vi: ["Một câu đơn thường có chủ ngữ và động từ.", "Với he, she hoặc it ở thì hiện tại đơn, nhiều động từ thêm -s hoặc -es.", "Ví dụ: I play football. She plays football.", "Luyện tập: He ___ (go/goes) to school. Đáp án: goes."]
    },
    "Vocabulary": {
      en: ["Learn new words in context rather than memorising isolated lists.", "Group words by topic and practise using them in sentences.", "Practice: Write three sentences about your school using new vocabulary."],
      vi: ["Học từ mới trong ngữ cảnh thay vì chỉ học thuộc danh sách.", "Nhóm từ theo chủ đề và luyện đặt câu.", "Luyện tập: Viết ba câu về trường học bằng từ vựng mới."]
    }
  },
  Science: {
    "Living things": {
      en: ["Living things need resources to survive and grow.", "Plants generally need light, water, air and suitable conditions.", "Animals need food, water and a suitable habitat.", "Practice: Name two things a plant needs to grow."],
      vi: ["Sinh vật cần các điều kiện cần thiết để tồn tại và phát triển.", "Thực vật thường cần ánh sáng, nước, không khí và điều kiện phù hợp.", "Động vật cần thức ăn, nước và môi trường sống phù hợp.", "Luyện tập: Kể tên hai yếu tố cần thiết để cây phát triển."]
    }
  },
  History: {
    "Geography of Vietnam": {
      en: ["Vietnam is in Southeast Asia and has a long coastline.", "Maps use symbols, labels and directions to represent places.", "Practice: Locate your province or city on a map of Vietnam."],
      vi: ["Việt Nam nằm ở Đông Nam Á và có đường bờ biển dài.", "Bản đồ dùng kí hiệu, nhãn và phương hướng để biểu thị địa điểm.", "Luyện tập: Xác định tỉnh hoặc thành phố của em trên bản đồ Việt Nam."]
    }
  },
  Informatics: {
    "Digital safety": {
      en: ["Keep passwords private and use different passwords for different accounts.", "Do not open suspicious links or share private information with strangers.", "Ask a trusted adult for help when something online feels wrong.", "Practice: Describe one way to protect an online account."],
      vi: ["Giữ bí mật mật khẩu và sử dụng mật khẩu khác nhau cho các tài khoản.", "Không mở liên kết đáng ngờ hoặc chia sẻ thông tin riêng tư với người lạ.", "Nhờ người lớn đáng tin cậy giúp đỡ khi gặp điều bất thường trên mạng.", "Luyện tập: Nêu một cách bảo vệ tài khoản trực tuyến."]
    }
  }
};

const state = {
  language: "en",
  theme: "light",
  authMode: "login",
  user: null,
  profile: null,
  stats: freshStats(),
  quizzes: [...DEMO_QUIZZES],
  classes: [],
  currentQuiz: null,
  currentQuestion: 0,
  answers: [],
  quizStartedAt: 0,
  timerInterval: null,
  questionCount: 0,
  lastToast: null,
  backendConfigured: false,
  backendReady: false,
  demoProgress: null
};

function freshStats() {
  return {
    xp: 0, points: 0, minutes: 0, completed: 0,
    correct: 0, answered: 0, streak: 0,
    lastStudyDay: "", studyDays: [], badges: []
  };
}

function todayKey(date = new Date()) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0")
  ].join("-");
}

function shiftDay(key, amount) {
  const d = new Date(`${key}T12:00:00`);
  d.setDate(d.getDate() + amount);
  return todayKey(d);
}

function safeNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : fallback;
}

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;",
    '"': "&quot;", "'": "&#39;"
  })[char]);
}

function tr(key) {
  return TRANSLATIONS[state.language][key] ||
    TRANSLATIONS.en[key] || key;
}

function gradeLabel(grade) {
  return state.language === "vi" ? `Lớp ${grade}` : `Grade ${grade}`;
}

function subjectLabel(subject) {
  const found = SUBJECTS.find(item => item.value === subject);
  return found ? found[state.language] : subject;
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(state.lastToast);
  state.lastToast = setTimeout(() => toast.classList.remove("show"), 3300);
}

function setConnection(mode, message) {
  const el = $("#connectionStatus");
  el.className = "connection" + (mode === "online" ? " online" : mode === "error" ? " error" : "");
  el.textContent = message;
}

function backendIsConfigured() {
  return Boolean(
    CONFIG.APP_ID &&
    CONFIG.JAVASCRIPT_KEY &&
    CONFIG.APP_ID !== "YOUR_BACK4APP_APPLICATION_ID" &&
    CONFIG.JAVASCRIPT_KEY !== "YOUR_BACK4APP_JAVASCRIPT_KEY" &&
    window.Parse
  );
}

function readDemoProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem("studyfull-demo-progress") || "null");
    return saved && typeof saved === "object" ? saved : null;
  } catch {
    return null;
  }
}

function saveDemoProgress() {
  try {
    localStorage.setItem("studyfull-demo-progress", JSON.stringify(state.stats));
  } catch {
    // The current session still works if browser storage is unavailable.
  }
}

function loadLocalPreferences() {
  try {
    state.language = localStorage.getItem("studyfull-language") === "vi" ? "vi" : "en";
    state.theme = localStorage.getItem("studyfull-theme") === "dark" ? "dark" : "light";
  } catch {
    state.language = "en";
    state.theme = "light";
  }
  document.body.classList.toggle("dark", state.theme === "dark");
}

function setStatsFromUser(user) {
  const stored = user.get("studyStats") || {};
  state.stats = {
    ...freshStats(),
    xp: safeNumber(stored.xp),
    points: safeNumber(stored.points),
    minutes: safeNumber(stored.minutes),
    completed: safeNumber(stored.completed),
    correct: safeNumber(stored.correct),
    answered: safeNumber(stored.answered),
    streak: safeNumber(stored.streak),
    lastStudyDay: typeof stored.lastStudyDay === "string" ? stored.lastStudyDay : "",
    studyDays: Array.isArray(stored.studyDays) ? stored.studyDays.filter(v => typeof v === "string").slice(-60) : [],
    badges: Array.isArray(stored.badges) ? stored.badges.filter(v => typeof v === "string") : []
  };
}

function serializeStats() {
  return {
    xp: state.stats.xp,
    points: state.stats.points,
    minutes: state.stats.minutes,
    completed: state.stats.completed,
    correct: state.stats.correct,
    answered: state.stats.answered,
    streak: state.stats.streak,
    lastStudyDay: state.stats.lastStudyDay,
    studyDays: state.stats.studyDays.slice(-60),
    badges: state.stats.badges
  };
}

async function saveStats() {
  if (state.user && state.backendReady) {
    try {
      state.user.set("studyStats", serializeStats());
      await state.user.save();
    } catch (error) {
      console.error("Could not save progress:", error);
      showToast("Progress could not sync. Please try again.");
    }
  } else {
    saveDemoProgress();
  }
}

function getDisplayName() {
  if (!state.user) return state.language === "vi" ? "Bạn học" : "Learner";
  return state.user.get("displayName") ||
    state.user.get("username") || "Learner";
}

function getRole() {
  return state.user ? state.user.get("role") || "student" : "guest";
}

function isTeacher() {
  return getRole() === "teacher";
}

function requireAccount(message) {
  if (!state.user) {
    showToast(message || "Sign in to use this feature.");
    openAuth("login");
    return false;
  }
  return true;
}

function applyLanguage() {
  document.documentElement.lang = state.language;
  $$("[data-i18n]").forEach(el => {
    const key = el.dataset.i18n;
    if (TRANSLATIONS[state.language][key]) {
      el.textContent = tr(key);
    }
  });

  $("#languageButton").textContent = state.language === "en" ? "🌐 EN" : "🌐 VI";
  $("#themeButton").textContent = state.theme === "dark" ? "☀️" : "🌙";
  $("#authHeaderButton").textContent = state.user
    ? getDisplayName()
    : state.language === "vi" ? "Đăng nhập" : "Sign in";
  $("#logoutButton").classList.toggle("hidden", !state.user);
  $("#authHeaderButton").classList.remove("hidden");
  $("#sidebarStreak").textContent = state.language === "vi"
    ? `${state.stats.streak} ngày`
    : `${state.stats.streak} days`;
  $("#welcomeName").textContent = getDisplayName();
  $("#todayLabel").textContent = new Intl.DateTimeFormat(
    state.language === "vi" ? "vi-VN" : "en-US",
    { weekday: "short", month: "short", day: "numeric" }
  ).format(new Date());

  $("#quizSearch").placeholder = state.language === "vi"
    ? "Tìm bài kiểm tra..." : "Search quizzes...";
  $("#joinClassCode").placeholder = state.language === "vi"
    ? "Nhập mã lớp" : "Enter class code";

  renderEverything();
}

function openAuth(mode = "login") {
  if (state.user) {
    showToast(state.language === "vi" ? "Bạn đã đăng nhập." : "You're already signed in.");
    return;
  }
  state.authMode = mode;
  updateAuthMode();
  $("#authModal").classList.remove("hidden");
  setTimeout(() => $("#authUsername").focus(), 40);
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.add("hidden");
}

function updateAuthMode() {
  const signup = state.authMode === "signup";
  $("#loginTab").classList.toggle("active", !signup);
  $("#signupTab").classList.toggle("active", signup);
  $("#signupExtra").classList.toggle("hidden", !signup);
  $("#authTitle").textContent = signup
    ? (state.language === "vi" ? "Tạo tài khoản StudyFull" : "Create your StudyFull account")
    : (state.language === "vi" ? "Chào mừng bạn trở lại!" : "Welcome to StudyFull!");
  $("#authSubtitle").textContent = signup
    ? (state.language === "vi" ? "Bắt đầu hành trình học tập của bạn." : "Start your learning journey.")
    : (state.language === "vi" ? "Đăng nhập để tiếp tục học tập." : "Sign in to continue learning.");
  $("#authSubmitButton").textContent = signup
    ? (state.language === "vi" ? "Tạo tài khoản" : "Create account")
    : (state.language === "vi" ? "Đăng nhập" : "Sign in");
  $("#authPassword").autocomplete = signup ? "new-password" : "current-password";
}

function parseErrorMessage(error) {
  const code = error && error.code;
  if (code === 202 || code === 203) return "That username is already in use.";
  if (code === 101 || code === 210 || code === 211) return "Incorrect username or password.";
  if (code === 125) return "Please enter a valid username.";
  if (code === 100) return "Could not reach Back4App. Check your internet connection and configuration.";
  return error && error.message ? error.message : "Something went wrong. Please try again.";
}

async function handleAuthSubmit(event) {
  event.preventDefault();
  const username = $("#authUsername").value.trim();
  const password = $("#authPassword").value;
  const submit = $("#authSubmitButton");

  if (!state.backendReady) {
    showToast("Online accounts need your Back4App Application ID and JavaScript Key in main.js.");
    return;
  }
  if (!/^[A-Za-z0-9_.-]{3,20}$/.test(username)) {
    showToast("Username must be 3–20 characters: letters, numbers, _, . or -.");
    return;
  }
  if (password.length < 8) {
    showToast("Use a password with at least 8 characters.");
    return;
  }

  submit.disabled = true;
  try {
    let user;
    if (state.authMode === "signup") {
      user = new Parse.User();
      user.set("username", username);
      user.set("password", password);
      user.set("displayName", $("#authDisplayName").value.trim() || username);
      user.set("role", $("#authRole").value === "teacher" ? "teacher" : "student");
      user.set("studyStats", freshStats());
      user = await user.signUp();
    } else {
      user = await Parse.User.logIn(username, password);
    }

    state.user = user;
    setStatsFromUser(user);
    closeModal("authModal");
    $("#authForm").reset();
    await loadOnlineData();
    await recordStudyDay();
    await saveStats();
    showToast(state.language === "vi" ? "Đăng nhập thành công! 🎉" : "Welcome to StudyFull! 🎉");
    applyLanguage();
    updateAccountUI();
  } catch (error) {
    console.error("Authentication failed:", error);
    showToast(parseErrorMessage(error));
  } finally {
    submit.disabled = false;
  }
}

async function logout() {
  if (state.backendReady && state.user) {
    try {
      await Parse.User.logOut();
    } catch (error) {
      console.error("Logout error:", error);
    }
  }
  state.user = null;
  state.profile = null;
  state.stats = freshStats();
  state.classes = [];
  state.quizzes = [...DEMO_QUIZZES];
  stopQuizTimer();
  applyLanguage();
  updateAccountUI();
  showToast(state.language === "vi" ? "Đã đăng xuất." : "Signed out.");
}

function updateAccountUI() {
  const teacher = isTeacher();
  $$(".teacher-nav").forEach(el => el.classList.toggle("hidden", !teacher));
  $("#teacherClassPanel").classList.toggle("hidden", !teacher);
  $("#authHeaderButton").textContent = state.user
    ? getDisplayName()
    : state.language === "vi" ? "Đăng nhập" : "Sign in";
  $("#logoutButton").classList.toggle("hidden", !state.user);
  $("#profileName").textContent = getDisplayName();
  $("#profileRole").textContent = teacher
    ? (state.language === "vi" ? "Giáo viên" : "Teacher")
    : (state.language === "vi" ? "Học sinh" : "Student");
  $("#profileAvatar").textContent = teacher ? "👩‍🏫" : state.user ? "🎓" : "🌟";
  $("#profileId").textContent = state.user ? `ID: ${state.user.id}` : "Demo mode";
  renderEverything();
}

function navigate(page) {
  const target = document.getElementById(`page-${page}`);
  if (!target) return;
  if (page === "create" && !isTeacher()) {
    showToast("Only teacher accounts can create quizzes.");
    return;
  }
  $$(".page").forEach(el => el.classList.add("hidden"));
  target.classList.remove("hidden");
  $$(".nav-button").forEach(el => el.classList.toggle("active", el.dataset.page === page));
  if (page === "leaderboard") loadLeaderboard();
  if (page === "classes") loadClasses();
  if (page === "quizzes") renderQuizCatalog();
  if (page === "create") renderTeacherQuizzes();
  if (page === "study") renderStudyCatalog();
  if (page === "achievements") renderAchievements();
  if (page === "profile") renderProfile();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderStats() {
  $("#statXP").textContent = state.stats.xp.toLocaleString();
  $("#statStreak").textContent = state.language === "vi"
    ? `${state.stats.streak} ngày` : `${state.stats.streak} days`;
  $("#statTime").textContent = formatMinutes(state.stats.minutes);
  $("#statClasses").textContent = state.classes.length;
  $("#profileXP").textContent = state.stats.xp.toLocaleString();
  $("#profileCompleted").textContent = state.stats.completed;
  $("#profileTime").textContent = formatMinutes(state.stats.minutes);
  $("#profileStreak").textContent = state.language === "vi"
    ? `${state.stats.streak} ngày` : `${state.stats.streak} days`;
  $("#profileAccuracy").textContent = state.stats.answered
    ? `${Math.round(state.stats.correct / state.stats.answered * 100)}%` : "0%";
  $("#goalMinutes").textContent = Math.min(state.stats.minutesToday || 0, 15);
  $("#goalProgress").style.width = `${Math.min(100, ((state.stats.minutesToday || 0) / 15) * 100)}%`;
  $("#goalMessage").textContent = (state.stats.minutesToday || 0) >= 15
    ? (state.language === "vi" ? "Đã hoàn thành mục tiêu hôm nay! 🎉" : "Daily goal completed! 🎉")
    : (state.language === "vi" ? "Mỗi phút học đều có ích!" : "Every minute makes a difference!");
  $("#sidebarStreak").textContent = state.language === "vi"
    ? `${state.stats.streak} ngày` : `${state.stats.streak} days`;
  renderCalendar();
}

function formatMinutes(minutes) {
  const value = Math.floor(safeNumber(minutes));
  const hours = Math.floor(value / 60);
  const remaining = value % 60;
  if (hours > 0) return state.language === "vi"
    ? `${hours} giờ ${remaining} phút`
    : `${hours}h ${remaining}m`;
  return state.language === "vi" ? `${remaining} phút` : `${remaining} min`;
}

function renderCalendar() {
  const container = $("#streakCalendar");
  const today = todayKey();
  const dayNames = state.language === "vi"
    ? ["T2", "T3", "T4", "T5", "T6", "T7", "CN"]
    : ["M", "T", "W", "T", "F", "S", "S"];
  const currentDay = (new Date().getDay() + 6) % 7;
  const monday = shiftDay(today, -currentDay);
  container.innerHTML = dayNames.map((name, i) => {
    const key = shiftDay(monday, i);
    const dayNumber = Number(key.slice(-2));
    const done = state.stats.studyDays.includes(key);
    return `<div class="calendar-day ${done ? "done" : ""}">${name}<span title="${escapeHTML(key)}">${done ? "✓" : dayNumber}</span></div>`;
  }).join("");
}

async function recordStudyDay() {
  const today = todayKey();
  const last = state.stats.lastStudyDay;
  if (last === today) return;
  if (last && last === shiftDay(today, -1)) {
    state.stats.streak += 1;
  } else {
    state.stats.streak = 1;
  }
  state.stats.lastStudyDay = today;
  if (!state.stats.studyDays.includes(today)) state.stats.studyDays.push(today);
  state.stats.studyDays = state.stats.studyDays.slice(-60);
  await saveStats();
  renderStats();
  checkBadges();
}

function checkBadges() {
  const newBadges = [];
  for (const badge of BADGES) {
    if (badge.test(state.stats) && !state.stats.badges.includes(badge.id)) {
      state.stats.badges.push(badge.id);
      newBadges.push(badge);
    }
  }
  if (newBadges.length) {
    newBadges.forEach(badge => showToast(`🏅 ${state.language === "vi" ? badge.vi : badge.title}!`));
    saveStats();
    renderBadges();
  }
}

function renderBadges() {
  const earned = BADGES.filter(b => state.stats.badges.includes(b.id));
  $("#homeBadges").innerHTML = earned.length
    ? earned.slice(-4).map(b => `<div class="mini-badge"><span>${b.icon}</span>${escapeHTML(state.language === "vi" ? b.vi : b.title)}</div>`).join("")
    : `<p class="muted small">${state.language === "vi" ? "Hoàn thành bài kiểm tra để mở khóa huy hiệu!" : "Complete quizzes to unlock your first badge!"}</p>`;
  renderAchievements();
}

function renderAchievements() {
  const container = $("#achievementGrid");
  if (!container) return;
  container.innerHTML = BADGES.map(b => {
    const earned = state.stats.badges.includes(b.id);
    return `<article class="achievement-card ${earned ? "earned" : ""}">
      <div class="achievement-icon">${b.icon}</div>
      <h3>${escapeHTML(state.language === "vi" ? b.vi : b.title)}</h3>
      <p>${escapeHTML(state.language === "vi" ? b.viDesc : b.description)}</p>
      <div class="achievement-status">${earned ? (state.language === "vi" ? "✓ Đã đạt" : "✓ Earned") : (state.language === "vi" ? "Chưa đạt" : "Not earned yet")}</div>
    </article>`;
  }).join("");
}

function quizSummary(quiz) {
  const questionCount = Array.isArray(quiz.questions) ? quiz.questions.length : 0;
  return `<div class="card-meta"><span class="tag">${escapeHTML(gradeLabel(quiz.grade))}</span><span class="tag">${escapeHTML(subjectLabel(quiz.subject))}</span><span class="tag">📝 ${questionCount}</span></div>`;
}

function quizCard(quiz) {
  const icon = quiz.icon || "🧠";
  return `<article class="quiz-card">
    <div class="card-emoji">${escapeHTML(icon)}</div>
    <h3>${escapeHTML(quiz.title)}</h3>
    <p>${escapeHTML(quiz.description || (state.language === "vi" ? "Luyện tập kiến thức của bạn." : "Practise what you know."))}</p>
    ${quizSummary(quiz)}
    <button class="primary-button" type="button" data-start-quiz="${escapeHTML(quiz.id)}">${state.language === "vi" ? "Bắt đầu →" : "Start quiz →"}</button>
  </article>`;
}

function renderQuizCatalog() {
  const search = ($("#quizSearch")?.value || "").trim().toLowerCase();
  const grade = $("#quizGradeFilter")?.value || "all";
  const subject = $("#quizSubjectFilter")?.value || "all";
  const quizzes = state.quizzes.filter(q => {
    const matchSearch = `${q.title} ${q.description || ""} ${q.subject}`.toLowerCase().includes(search);
    return matchSearch && (grade === "all" || String(q.grade) === grade) &&
      (subject === "all" || q.subject === subject);
  });
  $("#quizCatalog").innerHTML = quizzes.map(quizCard).join("");
  $("#quizEmpty").classList.toggle("hidden", quizzes.length > 0);
}

function renderHomeQuizzes() {
  $("#homeQuizList").innerHTML = state.quizzes.slice(0, 3).map(q => `
    <div class="quiz-list-item">
      <div class="quiz-emoji">${escapeHTML(q.icon || "🧠")}</div>
      <div class="quiz-list-info"><strong>${escapeHTML(q.title)}</strong><small>${escapeHTML(gradeLabel(q.grade))} · ${escapeHTML(subjectLabel(q.subject))} · ${q.questions.length} questions</small></div>
      <button class="primary-button" type="button" data-start-quiz="${escapeHTML(q.id)}">${state.language === "vi" ? "Làm" : "Start"}</button>
    </div>`).join("");
}

function populateSelects() {
  const gradeOptions = GRADES.map(g => `<option value="${g}">${escapeHTML(gradeLabel(g))}</option>`).join("");
  $("#studyGrade").innerHTML = gradeOptions;
  $("#newQuizGrade").innerHTML = gradeOptions;
  $("#quizGradeFilter").innerHTML = `<option value="all">${state.language === "vi" ? "Tất cả khối" : "All grades"}</option>${gradeOptions}`;
  const subjectOptions = SUBJECTS.map(s => `<option value="${s.value}">${escapeHTML(s[state.language])}</option>`).join("");
  $("#studySubject").innerHTML = subjectOptions;
  $("#newQuizSubject").innerHTML = subjectOptions;
  $("#quizSubjectFilter").innerHTML = `<option value="all">${state.language === "vi" ? "Tất cả môn" : "All subjects"}</option>${subjectOptions}`;
  populateTopics();
}

function populateTopics() {
  const subject = $("#studySubject").value || "Maths";
  const topics = STUDY_TOPICS[subject] || STUDY_TOPICS.Maths;
  $("#studyTopic").innerHTML = topics[state.language].map((topic, i) =>
    `<option value="${i}">${escapeHTML(topic)}</option>`).join("");
}

function renderStudyCatalog() {
  const grade = Number($("#studyGrade").value || 4);
  const subject = $("#studySubject").value || "Maths";
  const topics = (STUDY_TOPICS[subject] || STUDY_TOPICS.Maths)[state.language];
  $("#studyCatalog").innerHTML = topics.map((topic, index) => `
    <article class="study-card">
      <div class="card-emoji">${["📘", "✏️", "🧩", "💡", "🔎", "🌟"][index % 6]}</div>
      <h3>${escapeHTML(topic)}</h3>
      <p>${escapeHTML(state.language === "vi" ? `Chủ đề ${index + 1} · Lớp ${grade}` : `Topic ${index + 1} · Grade ${grade}`)}</p>
      <div class="card-meta"><span class="tag">${escapeHTML(subjectLabel(subject))}</span><span class="tag">${escapeHTML(gradeLabel(grade))}</span></div>
      <button class="primary-button" type="button" data-open-lesson="${index}">${state.language === "vi" ? "Học chủ đề →" : "Study topic →"}</button>
    </article>`).join("");
}

function openLesson(index) {
  const grade = Number($("#studyGrade").value || 4);
  const subject = $("#studySubject").value || "Maths";
  const topics = (STUDY_TOPICS[subject] || STUDY_TOPICS.Maths)[state.language];
  const topic = topics[index];
  const englishTopic = (STUDY_TOPICS[subject] || STUDY_TOPICS.Maths).en[index];
  const lesson = LESSONS[subject]?.[englishTopic];
  const lines = lesson?.[state.language] || [
    state.language === "vi"
      ? `Đây là khung học tập cho chủ đề "${topic}".`
      : `This is a study guide framework for "${topic}".`,
    state.language === "vi"
      ? "Đọc bài học trong sách giáo khoa, ghi lại các ý chính và làm bài tập."
      : "Read your textbook, write down the key ideas and practise the examples.",
    state.language === "vi"
      ? "Luyện tập: Viết ba điều em đã học được về chủ đề này."
      : "Practice: Write down three things you learned about this topic."
  ];
  $("#studyDetailContent").innerHTML = `
    <div class="study-detail-title"><p class="eyebrow">${escapeHTML(gradeLabel(grade))} · ${escapeHTML(subjectLabel(subject))}</p>
    <h2>${escapeHTML(topic)}</h2></div>
    <div class="lesson-content">${lines.map((line, i) => {
      if (i === 0) return `<p>${escapeHTML(line)}</p>`;
      return `<p>${escapeHTML(line)}</p>`;
    }).join("")}
      <h3>${state.language === "vi" ? "Cùng thực hành" : "Try it yourself"}</h3>
      <p>${state.language === "vi"
        ? "Hãy thử giải thích chủ đề này bằng lời của em. Sau đó, kiểm tra lại kiến thức trong sách giáo khoa."
        : "Try explaining this topic in your own words. Then check your understanding against your textbook."}</p>
      <button class="primary-button" type="button" data-page="quizzes">${state.language === "vi" ? "Luyện tập qua bài kiểm tra →" : "Practise with quizzes →"}</button>
    </div>`;
  $("#studyCatalog").classList.add("hidden");
  $(".filters").classList.add("hidden");
  $("#studyDetail").classList.remove("hidden");
  $("#studyDetail").dataset.lessonSubject = subject;
}

function resetStudyView() {
  $("#studyCatalog").classList.remove("hidden");
  $(".filters").classList.remove("hidden");
  $("#studyDetail").classList.add("hidden");
}

function openQuiz(quizId) {
  const quiz = state.quizzes.find(q => q.id === quizId);
  if (!quiz) {
    showToast("This quiz is no longer available. Refresh the quiz list.");
    return;
  }
  if (!Array.isArray(quiz.questions) || !quiz.questions.length) {
    showToast("This quiz has no questions yet.");
    return;
  }
  if (!requireAccount(state.language === "vi" ? "Đăng nhập để lưu điểm và tiến độ." : "Sign in to save your score and progress.")) return;

  state.currentQuiz = quiz;
  state.currentQuestion = 0;
  state.answers = Array(quiz.questions.length).fill(null);
  state.quizStartedAt = Date.now();
  $("#quizModal").classList.remove("hidden");
  renderQuizQuestion();
}

function stopQuizTimer() {
  if (state.timerInterval) clearInterval(state.timerInterval);
  state.timerInterval = null;
}

function renderQuizQuestion() {
  const quiz = state.currentQuiz;
  if (!quiz) return;
  const question = quiz.questions[state.currentQuestion];
  const total = quiz.questions.length;
  const selected = state.answers[state.currentQuestion];
  const title = state.language === "vi" ? quiz.title : quiz.title;
  $("#quizPlayContent").innerHTML = `
    <p class="eyebrow">${escapeHTML(title)}</p>
    <div class="question-count">${state.language === "vi" ? "Câu hỏi" : "QUESTION"} ${state.currentQuestion + 1} / ${total}</div>
    <div class="quiz-progress-line"><div style="width:${((state.currentQuestion + 1) / total) * 100}%"></div></div>
    <h2 class="play-question">${escapeHTML(question.text)}</h2>
    <div class="answer-options">${question.options.map((option, i) => `
      <button class="answer-option ${selected === i ? "selected" : ""}" type="button" data-answer="${i}">
        <span class="answer-letter">${String.fromCharCode(65 + i)}</span><span>${escapeHTML(option)}</span>
      </button>`).join("")}</div>
    <div class="quiz-play-actions">
      <button class="secondary-button" type="button" id="previousQuestionButton" ${state.currentQuestion === 0 ? "disabled" : ""}>← ${state.language === "vi" ? "Trước" : "Previous"}</button>
      <button class="primary-button" type="button" id="nextQuestionButton">${state.currentQuestion === total - 1 ? (state.language === "vi" ? "Nộp bài ✓" : "Finish ✓") : (state.language === "vi" ? "Tiếp theo →" : "Next →")}</button>
    </div>`;
}

function selectAnswer(index) {
  state.answers[state.currentQuestion] = index;
  renderQuizQuestion();
}

function nextQuestion() {
  if (state.answers[state.currentQuestion] === null) {
    showToast(state.language === "vi" ? "Hãy chọn một đáp án trước nhé." : "Choose an answer first.");
    return;
  }
  if (state.currentQuestion < state.currentQuiz.questions.length - 1) {
    state.currentQuestion++;
    renderQuizQuestion();
  } else {
    finishQuiz();
  }
}

function previousQuestion() {
  if (state.currentQuestion > 0) {
    state.currentQuestion--;
    renderQuizQuestion();
  }
}

async function finishQuiz() {
  const quiz = state.currentQuiz;
  if (!quiz) return;
  const questions = quiz.questions;
  const correct = questions.reduce((count, q, i) => count + (state.answers[i] === q.correct ? 1 : 0), 0);
  const answered = questions.length;
  const elapsedMinutes = Math.max(1, Math.round((Date.now() - state.quizStartedAt) / 60000));
  const earnedXP = correct * XP_PER_CORRECT;
  const accuracy = Math.round(correct / answered * 100);

  state.stats.xp += earnedXP;
  state.stats.points += earnedXP;
  state.stats.minutes += elapsedMinutes;
  state.stats.completed += 1;
  state.stats.correct += correct;
  state.stats.answered += answered;
  state.stats.minutesToday = (state.stats.minutesToday || 0) + elapsedMinutes;

  await recordStudyDay();
  checkBadges();
  await saveStats();
  if (state.backendReady) await saveLeaderboardEntry();
  renderEverything();

  $("#quizPlayContent").innerHTML = `
    <div class="result-score">
      <div class="result-emoji">${accuracy >= 80 ? "🎉" : accuracy >= 50 ? "🌟" : "💪"}</div>
      <p class="eyebrow">${state.language === "vi" ? "HOÀN THÀNH BÀI KIỂM TRA" : "QUIZ COMPLETED"}</p>
      <h2>${escapeHTML(quiz.title)}</h2>
      <strong>${correct} / ${answered}</strong>
      <p>${state.language === "vi" ? "Câu trả lời đúng" : "Correct answers"} · ${accuracy}%</p>
      <div class="card-meta" style="justify-content:center">
        <span class="tag">⚡ +${earnedXP} XP</span>
        <span class="tag">⏱️ ${escapeHTML(formatMinutes(elapsedMinutes))}</span>
      </div>
      <p class="muted">${accuracy >= 80
        ? (state.language === "vi" ? "Tuyệt vời! Hãy tiếp tục phát huy! 🎊" : "Excellent work! Keep it up! 🎊")
        : (state.language === "vi" ? "Mỗi lần luyện tập đều giúp bạn tiến bộ." : "Every practice session helps you improve.")}</p>
      <button class="primary-button full-button" id="closeQuizResultButton" type="button">${state.language === "vi" ? "Tiếp tục học" : "Continue learning"}</button>
    </div>`;
  state.currentQuiz = null;
}

async function saveLeaderboardEntry() {
  if (!state.user || !state.backendReady) return;
  try {
    const query = new Parse.Query("StudyFullScore");
    query.equalTo("owner", state.user);
    query.limit(1);
    let entry = await query.first();
    if (!entry) {
      entry = new Parse.Object("StudyFullScore");
      entry.set("owner", state.user);
    }
    entry.set("username", state.user.get("username"));
    entry.set("displayName", getDisplayName());
    entry.set("role", getRole());
    entry.set("xp", state.stats.xp);
    entry.set("completed", state.stats.completed);
    entry.set("streak", state.stats.streak);
    const acl = new Parse.ACL(state.user);
    acl.setPublicReadAccess(true);
    acl.setPublicWriteAccess(false);
    entry.setACL(acl);
    await entry.save();
  } catch (error) {
    console.error("Leaderboard save failed:", error);
    showToast("Your progress saved, but leaderboard sync needs database permissions.");
  }
}

function addQuestionEditor() {
  if (state.questionCount >= MAX_QUIZ_QUESTIONS) {
    showToast(`A quiz can have at most ${MAX_QUIZ_QUESTIONS} questions.`);
    return;
  }
  const index = state.questionCount++;
  const block = document.createElement("div");
  block.className = "question-editor";
  block.dataset.questionIndex = index;
  block.innerHTML = `
    <div class="question-editor-head"><strong>${state.language === "vi" ? "Câu hỏi" : "Question"} ${index + 1}</strong>
      <button class="remove-question" type="button" data-remove-question>✕ ${state.language === "vi" ? "Xóa" : "Remove"}</button>
    </div>
    <label>${state.language === "vi" ? "Nội dung câu hỏi" : "Question text"}
      <textarea class="editor-question-text" rows="2" required maxlength="500" placeholder="${state.language === "vi" ? "Nhập câu hỏi..." : "Enter your question..."}"></textarea>
    </label>
    <div class="option-editor-grid">
      ${[0, 1, 2, 3].map(i => `<label>Option ${String.fromCharCode(65 + i)}
        <input class="editor-option" required maxlength="250" placeholder="${state.language === "vi" ? "Đáp án" : "Answer"} ${String.fromCharCode(65 + i)}"></label>`).join("")}
    </div>
    <label class="correct-answer-label">${state.language === "vi" ? "Đáp án đúng" : "Correct answer"}
      <select class="editor-correct"><option value="0">A</option><option value="1">B</option><option value="2">C</option><option value="3">D</option></select>
    </label>`;
  $("#questionBuilder").appendChild(block);
}

function collectQuizQuestions() {
  const blocks = $$(".question-editor", $("#questionBuilder"));
  if (!blocks.length) throw new Error("Add at least one question.");
  return blocks.map((block, index) => {
    const text = $(".editor-question-text", block).value.trim();
    const options = $$(".editor-option", block).map(input => input.value.trim());
    if (!text || options.some(o => !o)) throw new Error(`Complete question ${index + 1} and all four options.`);
    return { text, options, correct: Number($(".editor-correct", block).value) };
  });
}

async function createQuiz(event) {
  event.preventDefault();
  if (!requireAccount("Sign in as a teacher to create quizzes.")) return;
  if (!isTeacher()) {
    showToast("Only teacher accounts can create quizzes.");
    return;
  }

  let questions;
  try {
    questions = collectQuizQuestions();
  } catch (error) {
    showToast(error.message);
    return;
  }

  const title = $("#newQuizTitle").value.trim();
  const grade = Number($("#newQuizGrade").value);
  const subject = $("#newQuizSubject").value;
  const description = $("#newQuizDescription").value.trim();

  if (!title || !Number.isInteger(grade) || grade < 1 || grade > 12) {
    showToast("Enter a quiz title and a valid grade.");
    return;
  }

  if (!state.backendReady) {
    showToast("Configure Back4App before publishing online quizzes. Your quiz has not been published.");
    return;
  }

  const submit = $("#createQuizForm button[type='submit']");
  submit.disabled = true;
  try {
    const obj = new Parse.Object("StudyFullQuiz");
    obj.set("title", title);
    obj.set("grade", grade);
    obj.set("subject", subject);
    obj.set("description", description);
    obj.set("icon", subject === "Maths" ? "🔢" : subject === "Science" ? "🔬" : "📘");
    obj.set("questions", questions);
    obj.set("author", state.user);
    obj.set("authorName", getDisplayName());
    obj.set("published", true);
    const acl = new Parse.ACL(state.user);
    acl.setPublicReadAccess(true);
    acl.setPublicWriteAccess(false);
    obj.setACL(acl);
    await obj.save();

    state.quizzes.unshift({
      id: obj.id, title, grade, subject, description,
      icon: obj.get("icon"), authorName: getDisplayName(),
      questions, online: true
    });
    $("#createQuizForm").reset();
    $("#questionBuilder").innerHTML = "";
    state.questionCount = 0;
    addQuestionEditor();
    renderQuizCatalog();
    renderHomeQuizzes();
    renderTeacherQuizzes();
    showToast("Quiz published online! 🎉");
  } catch (error) {
    console.error("Quiz creation failed:", error);
    showToast(parseErrorMessage(error));
  } finally {
    submit.disabled = false;
  }
}

function renderTeacherQuizzes() {
  const mine = state.quizzes.filter(q => q.online && q.authorName === getDisplayName());
  $("#teacherQuizList").innerHTML = mine.length
    ? mine.map(q => `<div class="quiz-list-item"><div class="quiz-emoji">📝</div><div class="quiz-list-info"><strong>${escapeHTML(q.title)}</strong><small>${escapeHTML(gradeLabel(q.grade))} · ${q.questions.length} questions</small></div></div>`).join("")
    : `<p class="muted small">${state.language === "vi" ? "Bạn chưa tạo bài kiểm tra nào." : "You haven't created any quizzes yet."}</p>`;
}

async function loadOnlineData() {
  if (!state.backendReady || !state.user) return;
  await Promise.allSettled([loadOnlineQuizzes(), loadClasses()]);
}

async function loadOnlineQuizzes() {
  if (!state.backendReady) return;
  try {
    const query = new Parse.Query("StudyFullQuiz");
    query.equalTo("published", true);
    query.descending("createdAt");
    query.limit(100);
    const results = await query.find();
    const online = results.map(obj => ({
      id: obj.id,
      title: obj.get("title") || "Untitled quiz",
      grade: safeNumber(obj.get("grade"), 4),
      subject: obj.get("subject") || "Maths",
      description: obj.get("description") || "",
      icon: obj.get("icon") || "🧠",
      authorName: obj.get("authorName") || "Teacher",
      questions: Array.isArray(obj.get("questions")) ? obj.get("questions") : [],
      online: true
    })).filter(q => q.questions.length > 0);
    state.quizzes = [...online, ...DEMO_QUIZZES];
    renderEverything();
  } catch (error) {
    console.error("Could not load quizzes:", error);
    showToast("Online quizzes could not load. Check StudyFullQuiz permissions in Back4App.");
  }
}

async function loadClasses() {
  if (!state.backendReady || !state.user) {
    renderClasses();
    return;
  }
  try {
    const query = new Parse.Query("StudyFullClass");
    query.equalTo("members", state.user);
    query.descending("createdAt");
    query.limit(100);
    state.classes = (await query.find()).map(obj => ({
      id: obj.id,
      name: obj.get("name") || "Class",
      code: obj.get("code") || "",
      teacherName: obj.get("teacherName") || "Teacher",
      teacherId: obj.get("teacherId") || "",
      object: obj
    }));
  } catch (error) {
    console.error("Class loading failed:", error);
    state.classes = [];
    showToast("Could not load classes. Check StudyFullClass permissions.");
  }
  renderClasses();
  renderStats();
}

function makeClassCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "";
  for (let i = 0; i < 7; i++) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

async function createClass(event) {
  event.preventDefault();
  if (!requireAccount("Sign in as a teacher to create a class.")) return;
  if (!isTeacher()) {
    showToast("Only teachers can create classes.");
    return;
  }
  if (!state.backendReady) {
    showToast("Configure Back4App to create online classes.");
    return;
  }
  const name = $("#newClassName").value.trim();
  if (!name) return;
  const submit = $("#createClassForm button[type='submit']");
  submit.disabled = true;
  try {
    const obj = new Parse.Object("StudyFullClass");
    const code = makeClassCode();
    obj.set("name", name);
    obj.set("code", code);
    obj.set("teacher", state.user);
    obj.set("teacherId", state.user.id);
    obj.set("teacherName", getDisplayName());
    obj.set("members", [state.user]);
    const acl = new Parse.ACL(state.user);
    acl.setPublicReadAccess(true);
    acl.setPublicWriteAccess(false);
    obj.setACL(acl);
    await obj.save();
    $("#newClassName").value = "";
    showToast(`Class created! Code: ${code}`);
    await loadClasses();
  } catch (error) {
    console.error("Class creation failed:", error);
    showToast(parseErrorMessage(error));
  } finally {
    submit.disabled = false;
  }
}

async function joinClass(event) {
  event.preventDefault();
  if (!requireAccount("Sign in to join a class.")) return;
  if (!state.backendReady) {
    showToast("Configure Back4App to join online classes.");
    return;
  }
  const code = $("#joinClassCode").value.trim().toUpperCase();
  if (!code) return;
  try {
    const query = new Parse.Query("StudyFullClass");
    query.equalTo("code", code);
    query.limit(1);
    const obj = await query.first();
    if (!obj) {
      showToast("Class code not found. Check the code with your teacher.");
      return;
    }
    const members = obj.get("members") || [];
    if (members.some(member => member.id === state.user.id)) {
      showToast("You're already in this class.");
      return;
    }
    members.push(state.user);
    obj.set("members", members);
    await obj.save();
    $("#joinClassCode").value = "";
    showToast("You joined the class! 🎉");
    await loadClasses();
  } catch (error) {
    console.error("Join class failed:", error);
    showToast("Could not join. Check class permissions and ask your teacher.");
  }
}

function renderClasses() {
  $("#classList").innerHTML = state.classes.length ? state.classes.map(c => `
    <article class="class-card">
      <div class="card-emoji">🏫</div>
      <h3>${escapeHTML(c.name)}</h3>
      <p>${state.language === "vi" ? "Giáo viên" : "Teacher"}: ${escapeHTML(c.teacherName)}</p>
      <div class="class-code">${escapeHTML(c.code)}</div>
      <button class="primary-button" type="button" data-open-class="${escapeHTML(c.id)}">${state.language === "vi" ? "Chi tiết lớp →" : "Class details →"}</button>
    </article>`).join("") : `<div class="empty-state" style="grid-column:1/-1">${state.language === "vi" ? "Bạn chưa tham gia lớp học nào." : "You haven't joined any classes yet."}</div>`;
  $("#statClasses").textContent = state.classes.length;
}

function openClassDetails(id) {
  const c = state.classes.find(item => item.id === id);
  if (!c) return;
  $("#classModalContent").innerHTML = `
    <p class="muted">${state.language === "vi" ? "Tên lớp" : "Class name"}</p><h3>${escapeHTML(c.name)}</h3>
    <p class="muted">${state.language === "vi" ? "Giáo viên" : "Teacher"}</p><p>${escapeHTML(c.teacherName)}</p>
    <p class="muted">${state.language === "vi" ? "Mã tham gia" : "Join code"}</p>
    <div class="class-code">${escapeHTML(c.code)}</div>
    <button id="copyClassCodeButton" class="secondary-button" type="button">${state.language === "vi" ? "Sao chép mã" : "Copy class code"}</button>`;
  $("#classModal").classList.remove("hidden");
}

async function loadLeaderboard() {
  const container = $("#leaderboardList");
  container.innerHTML = `<p class="muted" style="padding:20px">${state.language === "vi" ? "Đang tải bảng xếp hạng..." : "Loading leaderboard..."}</p>`;
  if (!state.backendReady) {
    container.innerHTML = `<div class="empty-state">${state.language === "vi" ? "Cấu hình Back4App để xem bảng xếp hạng trực tuyến." : "Configure Back4App to view the online leaderboard."}</div>`;
    return;
  }
  try {
    const query = new Parse.Query("StudyFullScore");
    query.equalTo("role", "student");
    query.descending("xp");
    query.limit(100);
    const results = await query.find();
    const entries = results.map(obj => ({
      id: obj.get("owner")?.id || obj.id,
      username: obj.get("username") || "Learner",
      name: obj.get("displayName") || obj.get("username") || "Learner",
      xp: safeNumber(obj.get("xp")),
      completed: safeNumber(obj.get("completed"))
    })).sort((a, b) => b.xp - a.xp);

    if (state.user && getRole() === "student" && !entries.some(e => e.id === state.user.id)) {
      entries.push({
        id: state.user.id,
        username: state.user.get("username"),
        name: getDisplayName(),
        xp: state.stats.xp,
        completed: state.stats.completed
      });
      entries.sort((a, b) => b.xp - a.xp);
    }

    container.innerHTML = entries.length ? entries.map((entry, i) => `
      <div class="leaderboard-row ${state.user && entry.id === state.user.id ? "you-row" : ""}">
        <div class="leaderboard-rank">${i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}</div>
        <div class="leaderboard-user"><div class="leaderboard-avatar">${i < 3 ? "🌟" : "🎓"}</div><div><strong>${escapeHTML(entry.name)}${state.user && entry.id === state.user.id ? (state.language === "vi" ? " (Bạn)" : " (You)") : ""}</strong><small>${entry.completed} ${state.language === "vi" ? "bài hoàn thành" : "quizzes completed"}</small></div></div>
        <div class="leaderboard-points">⚡ ${entry.xp.toLocaleString()}</div>
      </div>`).join("") : `<div class="empty-state">${state.language === "vi" ? "Chưa có học sinh nào trên bảng xếp hạng." : "No students on the leaderboard yet."}</div>`;
  } catch (error) {
    console.error("Leaderboard loading failed:", error);
    container.innerHTML = `<div class="empty-state">${state.language === "vi" ? "Không tải được bảng xếp hạng. Kiểm tra quyền StudyFullScore." : "Leaderboard unavailable. Check StudyFullScore permissions."}</div>`;
  }
}

function renderProfile() {
  $("#profileName").textContent = getDisplayName();
  $("#profileRole").textContent = isTeacher() ? "Teacher" : state.user ? "Student" : "Guest";
  $("#profileId").textContent = state.user ? `ID: ${state.user.id}` : "Demo mode";
  renderStats();
}

function renderEverything() {
  renderStats();
  renderHomeQuizzes();
  renderQuizCatalog();
  renderStudyCatalog();
  renderBadges();
  renderClasses();
  renderProfile();
  renderTeacherQuizzes();
}

async function editProfile(event) {
  event.preventDefault();
  if (!requireAccount()) return;
  const name = $("#editDisplayName").value.trim();
  if (!name || name.length > 40) {
    showToast("Display name must be 1–40 characters.");
    return;
  }
  try {
    state.user.set("displayName", name);
    await state.user.save();
    closeModal("editModal");
    applyLanguage();
    showToast("Profile updated!");
  } catch (error) {
    showToast(parseErrorMessage(error));
  }
}

async function changePassword(event) {
  event.preventDefault();
  if (!requireAccount()) return;
  if (!state.backendReady) {
    showToast("Password changes require an online Back4App account.");
    return;
  }
  const oldPassword = $("#currentPassword").value;
  const newPassword = $("#newPassword").value;
  if (newPassword.length < 8) {
    showToast("New password must have at least 8 characters.");
    return;
  }
  try {
    const username = state.user.get("username");
    await Parse.User.logIn(username, oldPassword);
    const current = Parse.User.current();
    current.set("password", newPassword);
    await current.save();
    state.user = current;
    $("#passwordForm").reset();
    closeModal("passwordModal");
    showToast("Password changed successfully!");
  } catch (error) {
    showToast(parseErrorMessage(error));
  }
}

function initEvents() {
  document.addEventListener("click", async event => {
    const pageButton = event.target.closest("[data-page]");
    if (pageButton) {
      event.preventDefault();
      const page = pageButton.dataset.page;
      if (page === "study") resetStudyView();
      navigate(page);
      return;
    }

    const closeButton = event.target.closest("[data-close-modal]");
    if (closeButton) {
      closeModal(closeButton.dataset.closeModal);
      return;
    }

    const startButton = event.target.closest("[data-start-quiz]");
    if (startButton) {
      openQuiz(startButton.dataset.startQuiz);
      return;
    }

    const answerButton = event.target.closest("[data-answer]");
    if (answerButton) {
      selectAnswer(Number(answerButton.dataset.answer));
      return;
    }

    if (event.target.closest("#nextQuestionButton")) {
      nextQuestion();
      return;
    }
    if (event.target.closest("#previousQuestionButton")) {
      previousQuestion();
      return;
    }
    if (event.target.closest("#closeQuizResultButton")) {
      closeModal("quizModal");
      state.currentQuiz = null;
      return;
    }

    const lessonButton = event.target.closest("[data-open-lesson]");
    if (lessonButton) {
      openLesson(Number(lessonButton.dataset.openLesson));
      return;
    }

    const removeButton = event.target.closest("[data-remove-question]");
    if (removeButton) {
      removeButton.closest(".question-editor").remove();
      $$(".question-editor").forEach((block, i) => {
        $(".question-editor-head strong", block).textContent =
          `${state.language === "vi" ? "Câu hỏi" : "Question"} ${i + 1}`;
      });
      return;
    }

    const classButton = event.target.closest("[data-open-class]");
    if (classButton) {
      openClassDetails(classButton.dataset.openClass);
      return;
    }

    if (event.target.closest("#copyClassCodeButton")) {
      const code = $("#classModalContent .class-code")?.textContent || "";
      try {
        await navigator.clipboard.writeText(code);
        showToast("Class code copied!");
      } catch {
        showToast(`Class code: ${code}`);
      }
    }
  });

  $("#authHeaderButton").addEventListener("click", () => {
    if (state.user) navigate("profile");
    else openAuth("login");
  });
  $("#logoutButton").addEventListener("click", logout);
  $("#loginTab").addEventListener("click", () => { state.authMode = "login"; updateAuthMode(); });
  $("#signupTab").addEventListener("click", () => { state.authMode = "signup"; updateAuthMode(); });
  $("#authForm").addEventListener("submit", handleAuthSubmit);

  $("#languageButton").addEventListener("click", () => {
    state.language = state.language === "en" ? "vi" : "en";
    try { localStorage.setItem("studyfull-language", state.language); } catch {}
    populateSelects();
    applyLanguage();
  });

  $("#themeButton").addEventListener("click", () => {
    state.theme = state.theme === "light" ? "dark" : "light";
    document.body.classList.toggle("dark", state.theme === "dark");
    try { localStorage.setItem("studyfull-theme", state.theme); } catch {}
    $("#themeButton").textContent = state.theme === "dark" ? "☀️" : "🌙";
  });

  $("#quizSearch").addEventListener("input", renderQuizCatalog);
  $("#quizGradeFilter").addEventListener("change", renderQuizCatalog);
  $("#quizSubjectFilter").addEventListener("change", renderQuizCatalog);

  $("#studyGrade").addEventListener("change", renderStudyCatalog);
  $("#studySubject").addEventListener("change", () => {
    populateTopics();
    renderStudyCatalog();
  });
  $("#studyTopic").addEventListener("change", () => {
    const index = Number($("#studyTopic").value);
    renderStudyCatalog();
    // The topic selector controls the first lesson action.
    $("#openStudyButton").dataset.topicIndex = String(index);
  });
  $("#openStudyButton").addEventListener("click", () => {
    openLesson(Number($("#studyTopic").value || 0));
  });
  $("#backToStudy").addEventListener("click", resetStudyView);

  $("#createQuizForm").addEventListener("submit", createQuiz);
  $("#addQuestionButton").addEventListener("click", addQuestionEditor);
  $("#createClassForm").addEventListener("submit", createClass);
  $("#joinClassForm").addEventListener("submit", joinClass);

  $("#editProfileButton").addEventListener("click", () => {
    if (!requireAccount()) return;
    $("#editDisplayName").value = getDisplayName();
    $("#editModal").classList.remove("hidden");
  });
  $("#editProfileForm").addEventListener("submit", editProfile);
  $("#changePasswordButton").addEventListener("click", () => {
    if (!requireAccount()) return;
    $("#passwordModal").classList.remove("hidden");
  });
  $("#passwordForm").addEventListener("submit", changePassword);

  $$(".modal").forEach(modal => {
    modal.addEventListener("click", event => {
      if (event.target === modal) closeModal(modal.id);
    });
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") $$(".modal:not(.hidden)").forEach(modal => closeModal(modal.id));
  });
}

async function initializeBackend() {
  state.backendConfigured = backendIsConfigured();
  if (!state.backendConfigured) {
    state.backendReady = false;
    setConnection("demo", "Demo mode");
    const saved = readDemoProgress();
    if (saved) state.stats = { ...freshStats(), ...saved };
    state.stats.minutesToday = 0;
    return;
  }

  try {
    Parse.initialize(CONFIG.APP_ID, CONFIG.JAVASCRIPT_KEY);
    Parse.serverURL = CONFIG.SERVER_URL;
    state.backendReady = true;
    const current = Parse.User.current();
    if (current) {
      state.user = current;
      setStatsFromUser(current);
      setConnection("online", "Back4App connected");
      await loadOnlineData();
      await recordStudyDay();
    } else {
      setConnection("online", "Back4App ready");
    }
  } catch (error) {
    console.error("Back4App initialization failed:", error);
    state.backendReady = false;
    setConnection("error", "Backend unavailable");
    showToast("Back4App could not initialize. Check your Application ID and JavaScript Key.");
  }
}

async function boot() {
  loadLocalPreferences();
  populateSelects();
  addQuestionEditor();
  initEvents();
  await initializeBackend();
  applyLanguage();
  updateAccountUI();
  navigate("home");
  renderEverything();
}

document.addEventListener("DOMContentLoaded", boot);
