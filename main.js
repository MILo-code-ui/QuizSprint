"use strict";

/* =========================================================
   QUIZSPRINT CONFIGURATION
   Get these from your own Back4App application settings.
   Never put the Back4App Master Key in browser code.
   ========================================================= */

const CONFIG = {
  applicationId: "NLxjmmhCCJ4CHeNJ4LSn50lYdkrd6roRByZnnusc",
  javascriptKey: "Vx2F8zhGtOEek9mshM0kXSP61Dsi6R5zK0547B3X",
  serverURL: "https://parseapi.back4app.com/"
};

const ONLINE_ENABLED =
  CONFIG.applicationId !== "YOUR_BACK4APP_APPLICATION_ID" &&
  CONFIG.javascriptKey !== "YOUR_BACK4APP_JAVASCRIPT_KEY" &&
  typeof Parse !== "undefined";

if (ONLINE_ENABLED) {
  Parse.initialize(CONFIG.applicationId, CONFIG.javascriptKey);
  Parse.serverURL = CONFIG.serverURL;
}

/* =========================================================
   HELPERS AND STATE
   ========================================================= */

const $ = id => document.getElementById(id);

const STORAGE_KEY = "quizSprintDataV1";
const PROFILE_KEY = "quizSprintProfileV1";

const defaultData = () => ({
  points: 0,
  timeSeconds: 0,
  quizzesCompleted: 0,
  correctAnswers: 0,
  totalAnswers: 0,
  streak: 0,
  lastStudyDate: "",
  studyDate: "",
  quizzesToday: 0,
  badges: [],
  classes: [],
  quizHistory: []
});

function loadData() {
  try {
    return {
      ...defaultData(),
      ...JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}")
    };
  } catch {
    return defaultData();
  }
}

let data = loadData();
let currentUser = null;
let currentRole = "guest";
let authMode = "login";
let currentPage = "home";
let quizList = [];
let currentQuiz = null;
let questionIndex = 0;
let selectedAnswer = null;
let correctThisQuiz = 0;
let quizStartedAt = 0;
let timerInterval = null;
let questionChecked = false;
let questionDrafts = [];
let uiLanguage = localStorage.getItem("quizSprintLanguage") || "en";
let isSaving = false;

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  renderDashboard();
}

function todayString() {
  const now = new Date();
  return [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0")
  ].join("-");
}

function previousDate(dateString) {
  const date = new Date(dateString + "T12:00:00");
  date.setDate(date.getDate() - 1);
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0")
  ].join("-");
}

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function shuffleCopy(array) {
  return [...array];
}

/* =========================================================
   SAMPLE QUIZZES
   Add more authorized learning content as your site grows.
   ========================================================= */

const sampleQuizzes = [
  {
    id: "math4",
    title: "Toán lớp 4 — Phép tính",
    subject: "Math / Toán",
    grade: 4,
    emoji: "➗",
    description: "Practice multiplication, division and arithmetic.",
    questions: [
      {
        question: "What is 125 × 4?",
        answers: ["400", "450", "500", "550"],
        correct: 2,
        explanation: "125 × 4 = 500."
      },
      {
        question: "What is 840 ÷ 7?",
        answers: ["110", "120", "130", "140"],
        correct: 1,
        explanation: "840 divided by 7 equals 120."
      },
      {
        question: "Which fraction is equal to one half?",
        answers: ["1/3", "2/4", "3/5", "2/3"],
        correct: 1,
        explanation: "2/4 simplifies to 1/2."
      },
      {
        question: "What is 375 + 248?",
        answers: ["613", "623", "633", "643"],
        correct: 1,
        explanation: "375 + 248 = 623."
      }
    ]
  },
  {
    id: "vietnamese4",
    title: "Tiếng Việt lớp 4",
    subject: "Vietnamese / Tiếng Việt",
    grade: 4,
    emoji: "📖",
    description: "Practice vocabulary and sentence structure.",
    questions: [
      {
        question: "Từ nào sau đây là danh từ?",
        answers: ["Chạy", "Đẹp", "Học sinh", "Nhanh"],
        correct: 2,
        explanation: "Học sinh là danh từ chỉ người."
      },
      {
        question: "Từ trái nghĩa với 'chăm chỉ' là gì?",
        answers: ["Siêng năng", "Cần cù", "Lười biếng", "Tốt bụng"],
        correct: 2,
        explanation: "'Lười biếng' trái nghĩa với 'chăm chỉ'."
      },
      {
        question: "Cuối câu hỏi thường dùng dấu gì?",
        answers: ["Dấu chấm", "Dấu hỏi", "Dấu phẩy", "Dấu hai chấm"],
        correct: 1,
        explanation: "Câu hỏi thường kết thúc bằng dấu hỏi."
      }
    ]
  },
  {
    id: "science4",
    title: "Khoa học lớp 4",
    subject: "Science / Khoa học",
    grade: 4,
    emoji: "🔬",
    description: "Explore the natural world.",
    questions: [
      {
        question: "Which organ pumps blood around the body?",
        answers: ["Lungs", "Heart", "Stomach", "Brain"],
        correct: 1,
        explanation: "The heart pumps blood around the body."
      },
      {
        question: "What do plants usually need to grow?",
        answers: ["Sunlight and water", "Plastic", "Darkness only", "Salt water only"],
        correct: 0,
        explanation: "Plants generally need water, light, air and nutrients."
      },
      {
        question: "Which state of water is ice?",
        answers: ["Liquid", "Gas", "Solid", "Plasma"],
        correct: 2,
        explanation: "Ice is water in its solid state."
      }
    ]
  },
  {
    id: "history4",
    title: "Lịch sử & Địa lí lớp 4",
    subject: "History & Geography / Lịch sử & Địa lí",
    grade: 4,
    emoji: "🌏",
    description: "Explore places and the past.",
    questions: [
      {
        question: "What is a map used for?",
        answers: [
          "Showing locations",
          "Measuring temperature only",
          "Cooking food",
          "Growing plants"
        ],
        correct: 0,
        explanation: "Maps represent locations and geographical features."
      },
      {
        question: "Which direction is opposite to north?",
        answers: ["East", "West", "South", "North-east"],
        correct: 2,
        explanation: "South is opposite to north."
      }
    ]
  },
  {
    id: "english4",
    title: "English Vocabulary",
    subject: "English / Tiếng Anh",
    grade: 4,
    emoji: "🔤",
    description: "Practice everyday English.",
    questions: [
      {
        question: "What is the plural of 'child'?",
        answers: ["Childs", "Children", "Childes", "Childrens"],
        correct: 1,
        explanation: "The plural of child is children."
      },
      {
        question: "Choose the correct sentence.",
        answers: [
          "She are happy.",
          "She am happy.",
          "She is happy.",
          "She be happy."
        ],
        correct: 2,
        explanation: "'She is happy' is grammatically correct."
      }
    ]
  },
  {
    id: "mathchallenge",
    title: "Math Challenge",
    subject: "Math / Toán",
    grade: 4,
    emoji: "🧠",
    description: "A short challenge for curious learners.",
    questions: [
      {
        question: "What is 15 × 12?",
        answers: ["160", "170", "180", "190"],
        correct: 2,
        explanation: "15 × 12 = 180."
      },
      {
        question: "What is the next number: 3, 6, 12, 24, ...?",
        answers: ["30", "36", "42", "48"],
        correct: 3,
        explanation: "Each number doubles, so the next is 48."
      },
      {
        question: "How many minutes are in 2 hours?",
        answers: ["60", "90", "120", "180"],
        correct: 2,
        explanation: "2 × 60 = 120 minutes."
      }
    ]
  }
];

/* =========================================================
   STUDY CENTER
   These are topic suggestions, not complete textbook lessons.
   ========================================================= */

const subjects = [
  { name: "Math / Toán", emoji: "➗", description: "Numbers, calculations and problem solving." },
  { name: "Vietnamese / Tiếng Việt", emoji: "📖", description: "Reading, writing and vocabulary." },
  { name: "Science / Khoa học", emoji: "🔬", description: "Explore science and the natural world." },
  { name: "History & Geography / Lịch sử & Địa lí", emoji: "🌏", description: "Places, people and history." },
  { name: "English / Tiếng Anh", emoji: "🔤", description: "Vocabulary, grammar and reading." },
  { name: "Technology / Công nghệ", emoji: "💻", description: "Technology and digital skills." }
];

function renderStudy() {
  const grade = Number($("gradeSelect").value || 4);
  $("studyGrid").innerHTML = subjects.map(subject => `
    <article class="study-card">
      <div class="card-emoji">${subject.emoji}</div>
      <span class="pill">Grade ${grade} / Lớp ${grade}</span>
      <h3>${escapeHTML(subject.name)}</h3>
      <p>${escapeHTML(subject.description)}</p>
      <button class="secondary-btn study-practice"
        data-subject="${escapeHTML(subject.name)}"
        data-grade="${grade}">Practice this subject →</button>
    </article>
  `).join("");
}

/* =========================================================
   PAGE NAVIGATION
   ========================================================= */

function goToPage(page) {
  const protectedPages = ["profile", "classes", "create"];

  if (page === "create" && currentRole !== "teacher") {
    showNotice("Sign in with a teacher account to open the quiz editor.", "error");
    openAuth();
    return;
  }

  if (protectedPages.includes(page) && !currentUser) {
    showNotice("Sign in to use this feature.", "error");
    openAuth();
    return;
  }

  if (page === "quiz" && !currentQuiz) return;

  document.querySelectorAll(".page").forEach(element => {
    element.classList.add("hidden");
  });

  const target = $("page-" + page);
  if (!target) page = "home";
  $("page-" + page).classList.remove("hidden");

  currentPage = page;

  document.querySelectorAll("[data-page].nav-btn").forEach(button => {
    button.classList.toggle("active", button.dataset.page === page);
  });

  if (page === "study") renderStudy();
  if (page === "quizzes") renderQuizzes();
  if (page === "classes") renderClasses();
  if (page === "leaderboard") renderLeaderboard();
  if (page === "profile") renderProfile();

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function openAuth() {
  authMode = "login";
  updateAuthMode();
  $("authMessage").textContent = "";
  document.querySelectorAll(".page").forEach(page => page.classList.add("hidden"));
  $("page-auth").classList.remove("hidden");
  currentPage = "auth";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showNotice(message, type = "success") {
  const notice = $("notice");
  notice.textContent = message;
  notice.className = "notice " + type;
  notice.classList.remove("hidden");

  window.clearTimeout(showNotice.timeout);
  showNotice.timeout = window.setTimeout(() => {
    notice.classList.add("hidden");
  }, 4500);
}

/* =========================================================
   LANGUAGE SWITCH
   ========================================================= */

const translations = {
  en: {
    home: "Home",
    study: "Study",
    quizzes: "Quizzes",
    classes: "Classes",
    leaderboard: "Leaderboard",
    profile: "Profile",
    signIn: "Sign in",
    createQuiz: "＋ Create Quiz",
    startStudying: "📚 Start studying",
    exploreQuizzes: "🎯 Explore quizzes",
    studyCenter: "📚 Study center",
    practice: "Practice this subject →",
    back: "← Back to quizzes"
  },
  vi: {
    home: "Trang chủ",
    study: "Học tập",
    quizzes: "Bài kiểm tra",
    classes: "Lớp học",
    leaderboard: "Bảng xếp hạng",
    profile: "Hồ sơ",
    signIn: "Đăng nhập",
    createQuiz: "＋ Tạo bài kiểm tra",
    startStudying: "📚 Bắt đầu học",
    exploreQuizzes: "🎯 Khám phá bài kiểm tra",
    studyCenter: "📚 Trung tâm học tập",
    practice: "Luyện tập →",
    back: "← Quay lại"
  }
};

function applyLanguage() {
  const language = translations[uiLanguage] || translations.en;

  document.querySelectorAll(".nav-btn").forEach(button => {
    const key = button.dataset.page;
    if (key === "create") {
      button.textContent = language.createQuiz;
    } else if (language[key]) {
      button.textContent = language[key];
    }
  });

  $("authButton").textContent = currentUser
    ? displayName()
    : language.signIn;

  $("languageButton").textContent = uiLanguage === "en" ? "🌐 EN" : "🌐 VI";
  $("footerYear").textContent = "© " + new Date().getFullYear();

  localStorage.setItem("quizSprintLanguage", uiLanguage);
  renderStudy();
}

/* =========================================================
   AUTHENTICATION
   Online sign-up and login require your Back4App credentials.
   No passwords are stored in localStorage by this code.
   ========================================================= */

function updateAuthMode() {
  const registering = authMode === "register";

  $("authTitle").textContent = registering ? "Create account" : "Sign in";
  $("authSubmit").textContent = registering ? "Create account" : "Sign in";
  $("loginTab").classList.toggle("active", !registering);
  $("registerTab").classList.toggle("active", registering);
  $("roleChoice").classList.toggle("hidden", !registering);
  $("authPassword").autocomplete = registering ? "new-password" : "current-password";
}

function displayName() {
  return currentUser?.get
    ? currentUser.get("username")
    : currentUser?.username || "Guest";
}

function setSignedInUser(user, role) {
  currentUser = user;
  currentRole = role || "student";

  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify({
      username: displayName(),
      role: currentRole
    }));
  } catch {}

  $("usernameDisplay")?.replaceChildren();
  $("authButton").textContent = displayName();
  $("teacherNav").classList.toggle("hidden", currentRole !== "teacher");
  $("createClassForm").classList.toggle("hidden", currentRole !== "teacher");
  $("signOutButton").classList.remove("hidden");
  $("welcomeText").textContent = `Welcome back, ${displayName()}! Keep up your learning streak.`;

  renderDashboard();
}

async function handleAuth(event) {
  event.preventDefault();

  const username = $("authUsername").value.trim();
  const password = $("authPassword").value;
  const message = $("authMessage");

  if (username.length < 3 || password.length < 6) {
    message.textContent = "Use a username of at least 3 characters and a password of at least 6 characters.";
    message.className = "feedback bad";
    return;
  }

  if (!ONLINE_ENABLED) {
    message.textContent =
      "Online sign-in is not configured yet. Add your Back4App Application ID and JavaScript Key in main.js first.";
    message.className = "feedback bad";
    return;
  }

  $("authSubmit").disabled = true;
  message.textContent = "Please wait…";
  message.className = "feedback";

  try {
    let user;

    if (authMode === "register") {
      user = new Parse.User();
      user.set("username", username);
      user.set("password", password);

      // Role selection is not a secure teacher-verification system.
      user.set("role", $("authRole").value);

      await user.signUp();
    } else {
      user = await Parse.User.logIn(username, password);
    }

    const role = user.get("role") || "student";
    setSignedInUser(user, role);
    await loadOnlineProgress();

    message.textContent = "You're signed in!";
    message.className = "feedback good";
    $("authPassword").value = "";

    goToPage("home");
    showNotice("Welcome to QuizSprint, " + displayName() + "!");
  } catch (error) {
    message.textContent = error.message || "Sign-in failed. Check your details and try again.";
    message.className = "feedback bad";
  } finally {
    $("authSubmit").disabled = false;
  }
}

async function signOut() {
  try {
    if (ONLINE_ENABLED && Parse.User.current()) {
      await Parse.User.logOut();
    }
  } catch (error) {
    showNotice("Sign-out warning: " + error.message, "error");
  }

  currentUser = null;
  currentRole = "guest";
  localStorage.removeItem(PROFILE_KEY);
  data = defaultData();
  saveData();

  $("teacherNav").classList.add("hidden");
  $("createClassForm").classList.add("hidden");
  $("signOutButton").classList.add("hidden");
  $("authButton").textContent = "Sign in";
  $("welcomeText").textContent = "Welcome to QuizSprint!";

  goToPage("home");
  showNotice("You have signed out.");
}

async function restoreSession() {
  if (ONLINE_ENABLED) {
    try {
      const user = Parse.User.current();

      if (user) {
        currentUser = user;
        currentRole = user.get("role") || "student";
        setSignedInUser(user, currentRole);
        await loadOnlineProgress();
        return;
      }
    } catch (error) {
      console.warn("Could not restore the online session:", error);
    }
  }

  // A profile display preference is not an authenticated session.
  currentUser = null;
  currentRole = "guest";
}

/* =========================================================
   QUIZ LIST AND ONLINE QUIZ SYNC
   ========================================================= */

function mergeQuizzes(onlineQuizzes) {
  const merged = new Map(sampleQuizzes.map(quiz => [quiz.id, quiz]));

  onlineQuizzes.forEach(quiz => {
    merged.set(quiz.id, quiz);
  });

  quizList = [...merged.values()];
}

async function loadQuizzes() {
  const onlineQuizzes = [];

  if (ONLINE_ENABLED) {
    try {
      const Query = Parse.Object.extend("QuizSprintQuiz");
      const query = new Parse.Query(Query);
      query.limit(100);

      const records = await query.find();

      records.forEach(record => {
        const questions = record.get("questions");

        if (!Array.isArray(questions) || !questions.length) return;

        onlineQuizzes.push({
          id: record.id,
          title: record.get("title") || "Untitled quiz",
          subject: record.get("subject") || "General",
          grade: Number(record.get("grade") || 4),
          emoji: "📝",
          description: record.get("description") || "Community quiz",
          questions,
          onlineId: record.id
        });
      });
    } catch (error) {
      console.warn("Online quizzes could not be loaded:", error);
      showNotice("Showing sample quizzes. Online quizzes could not be loaded.", "error");
    }
  }

  mergeQuizzes(onlineQuizzes);
  renderQuizzes();
}

function renderQuizzes() {
  const search = ($("quizSearch").value || "").toLowerCase();

  const visible = quizList.filter(quiz =>
    [quiz.title, quiz.subject, quiz.description].join(" ").toLowerCase().includes(search)
  );

  $("quizGrid").innerHTML = visible.map(quiz => `
    <article class="quiz-card">
      <div class="card-emoji">${escapeHTML(quiz.emoji || "🎯")}</div>
      <span class="pill">Grade ${Number(quiz.grade) || 4}</span>
      <h3>${escapeHTML(quiz.title)}</h3>
      <p>${escapeHTML(quiz.description || "Test your knowledge.")}</p>
      <div class="card-meta">
        <span>${escapeHTML(quiz.subject)}</span>
        <span>${quiz.questions.length} questions</span>
      </div>
      <button class="primary-btn start-quiz" data-quiz-id="${escapeHTML(quiz.id)}">Start quiz →</button>
    </article>
  `).join("");

  $("quizEmpty").classList.toggle("hidden", visible.length > 0);
}

async function publishOnlineQuiz(quiz) {
  const Quiz = Parse.Object.extend("QuizSprintQuiz");
  const record = new Quiz();

  record.set("title", quiz.title);
  record.set("subject", quiz.subject);
  record.set("grade", quiz.grade);
  record.set("description", quiz.description);
  record.set("questions", quiz.questions);
  record.set("creatorUsername", displayName());

  await record.save();

  quiz.id = record.id;
  quiz.onlineId = record.id;
  return quiz;
}

/* =========================================================
   QUIZ ENGINE
   ========================================================= */

function startQuiz(id) {
  const quiz = quizList.find(item => item.id === id);
  if (!quiz || !Array.isArray(quiz.questions) || !quiz.questions.length) {
    showNotice("This quiz does not have any questions yet.", "error");
    return;
  }

  currentQuiz = quiz;
  questionIndex = 0;
  selectedAnswer = null;
  correctThisQuiz = 0;
  questionChecked = false;
  quizStartedAt = Date.now();

  $("quizTimer").textContent = "⏱️ 0:00";
  clearInterval(timerInterval);

  timerInterval = setInterval(() => {
    const seconds = Math.floor((Date.now() - quizStartedAt) / 1000);
    $("quizTimer").textContent =
      "⏱️ " + Math.floor(seconds / 60) + ":" + String(seconds % 60).padStart(2, "0");
  }, 1000);

  goToPage("quiz");
  renderQuestion();
}

function renderQuestion() {
  const question = currentQuiz.questions[questionIndex];

  selectedAnswer = null;
  questionChecked = false;

  $("quizQuestionNumber").textContent =
    `QUESTION ${questionIndex + 1} OF ${currentQuiz.questions.length}`;
  $("quizQuestion").textContent = question.question;
  $("quizProgressFill").style.width =
    `${(questionIndex / currentQuiz.questions.length) * 100}%`;
  $("quizScorePreview").textContent = `${correctThisQuiz} correct`;
  $("answerFeedback").textContent = "";
  $("answerFeedback").className = "feedback";
  $("nextQuestionButton").disabled = true;
  $("nextQuestionButton").textContent = "Check answer";

  $("quizAnswers").innerHTML = question.answers.map((answer, index) => `
    <button class="answer-option" data-answer="${index}">
      <span class="answer-letter">${String.fromCharCode(65 + index)}</span>
      <span>${escapeHTML(answer)}</span>
    </button>
  `).join("");
}

function selectAnswer(index) {
  if (questionChecked) return;

  selectedAnswer = index;

  document.querySelectorAll(".answer-option").forEach((button, i) => {
    button.classList.toggle("selected", i === index);
  });

  $("nextQuestionButton").disabled = false;
  $("nextQuestionButton").textContent = "Check answer";
}

function checkAnswer() {
  if (!currentQuiz || questionChecked) return;

  if (selectedAnswer === null) {
    showNotice("Choose an answer first.", "error");
    return;
  }

  const question = currentQuiz.questions[questionIndex];
  const correct = selectedAnswer === Number(question.correct);
  questionChecked = true;

  if (correct) correctThisQuiz++;

  document.querySelectorAll(".answer-option").forEach((button, index) => {
    button.disabled = true;

    if (index === Number(question.correct)) button.classList.add("correct");
    else if (index === selectedAnswer) button.classList.add("incorrect");
  });

  $("answerFeedback").textContent = correct
    ? "Correct! 🎉 " + (question.explanation || "")
    : "Not quite. " + (question.explanation || "Keep practicing!");

  $("answerFeedback").className = "feedback " + (correct ? "good" : "bad");
  $("quizScorePreview").textContent = `${correctThisQuiz} correct`;
  $("nextQuestionButton").textContent =
    questionIndex === currentQuiz.questions.length - 1 ? "Finish quiz" : "Next question";
}

function nextQuestion() {
  if (!questionChecked) {
    checkAnswer();
    return;
  }

  if (questionIndex < currentQuiz.questions.length - 1) {
    questionIndex++;
    renderQuestion();
  } else {
    finishQuiz();
  }
}

async function finishQuiz() {
  clearInterval(timerInterval);

  const elapsed = Math.max(1, Math.round((Date.now() - quizStartedAt) / 1000));
  const total = currentQuiz.questions.length;
  const earnedXP = correctThisQuiz * 10;
  const accuracy = Math.round((correctThisQuiz / total) * 100);
  const previousBadges = [...data.badges];

  data.points += earnedXP;
  data.timeSeconds += elapsed;
  data.quizzesCompleted++;
  data.correctAnswers += correctThisQuiz;
  data.totalAnswers += total;
  data.quizHistory.push({
    title: currentQuiz.title,
    correct: correctThisQuiz,
    total,
    xp: earnedXP,
    date: todayString()
  });

  if (data.studyDate !== todayString()) {
    data.studyDate = todayString();
    data.quizzesToday = 0;
  }

  data.quizzesToday++;

  if (data.lastStudyDate === todayString()) {
    // The streak has already been counted for today.
  } else if (data.lastStudyDate === previousDate(todayString())) {
    data.streak++;
  } else {
    data.streak = 1;
  }

  data.lastStudyDate = todayString();

  updateBadges();
  saveData();

  $("resultTitle").textContent =
    accuracy >= 80 ? "Amazing work! 🌟" :
    accuracy >= 50 ? "Nice effort! 💪" : "Keep practicing! 🚀";

  $("resultMessage").textContent =
    `You got ${correctThisQuiz} out of ${total} questions correct (${accuracy}%).`;

  $("resultCorrect").textContent = `${correctThisQuiz}/${total}`;
  $("resultXP").textContent = `+${earnedXP} XP`;
  $("resultTime").textContent = formatDuration(elapsed);
  $("newBadges").innerHTML = data.badges
    .filter(badge => !previousBadges.includes(badge))
    .map(badge => `<span class="pill">${escapeHTML(badge)}</span>`)
    .join("");

  goToPage("results");

  if (ONLINE_ENABLED && currentUser) {
    try {
      await saveOnlineProgress();
    } catch (error) {
      console.warn("Progress sync failed:", error);
      showNotice("Quiz completed locally, but online progress could not be synced.", "error");
    }
  }
}

/* =========================================================
   XP, STREAKS, BADGES, TIME LEARNED
   ========================================================= */

const badgeDefinitions = [
  { name: "First Sprint", emoji: "🚀", condition: () => data.quizzesCompleted >= 1 },
  { name: "200 XP Club", emoji: "⭐", condition: () => data.points >= 200 },
  { name: "1,000 XP Champion", emoji: "💎", condition: () => data.points >= 1000 },
  { name: "7-Day Streak", emoji: "🔥", condition: () => data.streak >= 7 },
  { name: "Quiz Explorer", emoji: "🧭", condition: () => data.quizzesCompleted >= 10 },
  { name: "Perfect Sprint", emoji: "🎯", condition: () => data.quizHistory.some(q => q.total > 0 && q.correct === q.total) }
];

function updateBadges() {
  badgeDefinitions.forEach(badge => {
    if (badge.condition() && !data.badges.includes(badge.name)) {
      data.badges.push(badge.name);
    }
  });
}

function formatDuration(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;

  if (minutes < 1) return `${remaining} sec`;
  if (minutes < 60) return `${minutes} min`;
  return `${Math.floor(minutes / 60)} hr ${minutes % 60} min`;
}

function renderDashboard() {
  updateBadges();

  $("homeXP").textContent = data.points.toLocaleString();
  $("homeStreak").textContent = `${data.streak} days`;
  $("homeTime").textContent = formatDuration(data.timeSeconds);
  $("homeBadges").textContent = data.badges.length;

  $("milestone200").textContent = `${Math.min(data.points, 200)} / 200`;
  $("milestone1000").textContent = `${Math.min(data.points, 1000).toLocaleString()} / 1,000`;
  $("progress200").style.width = `${Math.min(100, data.points / 200 * 100)}%`;
  $("progress1000").style.width = `${Math.min(100, data.points / 1000 * 100)}%`;

  const completedToday = data.studyDate === todayString() ? data.quizzesToday : 0;
  $("goalProgress").style.width = completedToday ? "100%" : "0%";
  $("goalText").textContent = `${Math.min(completedToday, 1)} of 1 quiz completed today`;

  $("profileName").textContent = currentUser ? displayName() : "Guest";
  $("profileRole").textContent = currentUser
    ? (currentRole === "teacher" ? "Teacher" : "Student")
    : "Not signed in";

  $("profileXP").textContent = data.points.toLocaleString();
  $("profileLevel").textContent = Math.floor(data.points / 100) + 1;
  $("profileAccuracy").textContent = data.totalAnswers
    ? Math.round(data.correctAnswers / data.totalAnswers * 100) + "%"
    : "—";
  $("profileClasses").textContent = data.classes.length;
  $("profileTime").textContent = formatDuration(data.timeSeconds);
  $("profileQuizzes").textContent = data.quizzesCompleted;
  $("profileStreak").textContent = `${data.streak} days`;

  $("profileAvatar").textContent = currentRole === "teacher" ? "🧑‍🏫" : "⚡";

  renderBadges();
}

function renderBadges() {
  $("badgeGrid").innerHTML = badgeDefinitions.map(badge => {
    const unlocked = data.badges.includes(badge.name);

    return `
      <article class="badge-card ${unlocked ? "" : "locked"}">
        <div class="card-emoji">${badge.emoji}</div>
        <h3>${escapeHTML(badge.name)}</h3>
        <p class="small muted">${unlocked ? "Unlocked!" : "Not unlocked yet"}</p>
      </article>
    `;
  }).join("");
}

function renderProfile() {
  renderDashboard();
}

/* =========================================================
   BACK4APP PROGRESS SYNC
   These objects need suitable Parse permissions.
   ========================================================= */

async function saveOnlineProgress() {
  if (!ONLINE_ENABLED || !currentUser) return;

  const Progress = Parse.Object.extend("QuizSprintProgress");
  const query = new Parse.Query(Progress);

  query.equalTo("owner", currentUser);
  let record = await query.first();

  if (!record) {
    record = new Progress();
    record.set("owner", currentUser);
  }

  record.set("username", displayName());
  record.set("role", currentRole);
  record.set("points", data.points);
  record.set("timeSeconds", data.timeSeconds);
  record.set("quizzesCompleted", data.quizzesCompleted);
  record.set("correctAnswers", data.correctAnswers);
  record.set("totalAnswers", data.totalAnswers);
  record.set("streak", data.streak);
  record.set("lastStudyDate", data.lastStudyDate);
  record.set("badges", data.badges);

  await record.save();
}

async function loadOnlineProgress() {
  if (!ONLINE_ENABLED || !currentUser) return;

  try {
    const Progress = Parse.Object.extend("QuizSprintProgress");
    const query = new Parse.Query(Progress);

    query.equalTo("owner", currentUser);
    const record = await query.first();

    if (record) {
      // Avoid replacing the current browser's data with lower values.
      data.points = Math.max(data.points, Number(record.get("points") || 0));
      data.timeSeconds = Math.max(data.timeSeconds, Number(record.get("timeSeconds") || 0));
      data.quizzesCompleted = Math.max(data.quizzesCompleted, Number(record.get("quizzesCompleted") || 0));
      data.correctAnswers = Math.max(data.correctAnswers, Number(record.get("correctAnswers") || 0));
      data.totalAnswers = Math.max(data.totalAnswers, Number(record.get("totalAnswers") || 0));
      data.streak = Math.max(data.streak, Number(record.get("streak") || 0));

      const remoteBadges = record.get("badges");
      if (Array.isArray(remoteBadges)) {
        data.badges = [...new Set([...data.badges, ...remoteBadges])];
      }

      data.lastStudyDate = data.lastStudyDate || record.get("lastStudyDate") || "";
      saveData();
    }
  } catch (error) {
    console.warn("Progress could not be loaded:", error);
  }

  await loadOnlineLeaderboard();
}

/* =========================================================
   STUDENT LEADERBOARD
   ========================================================= */

async function renderLeaderboard() {
  const localEntries = [];

  // Include the current student in the local view.
  if (currentUser && currentRole === "student") {
    localEntries.push({
      username: displayName(),
      points: data.points,
      current: true
    });
  }

  let entries = localEntries;

  if (ONLINE_ENABLED) {
    try {
      const Progress = Parse.Object.extend("QuizSprintProgress");
      const query = new Parse.Query(Progress);
      query.equalTo("role", "student");
      query.descending("points");
      query.limit(100);

      const records = await query.find();

      entries = records.map(record => ({
        username: record.get("username") || "Student",
        points: Number(record.get("points") || 0),
        current: currentUser && record.get("username") === displayName()
      }));
    } catch (error) {
      console.warn("Leaderboard could not be loaded:", error);
      $("leaderboardNote").textContent =
        "Online leaderboard unavailable. Showing the current student's local score when possible.";
    }
  }

  const byName = new Map();
  entries.forEach(entry => {
    const key = entry.username.toLowerCase();
    const existing = byName.get(key);

    if (!existing || entry.points > existing.points) byName.set(key, entry);
  });

  entries = [...byName.values()].sort((a, b) => b.points - a.points);

  $("leaderboardRows").innerHTML = entries.length
    ? entries.map((entry, index) => `
      <div class="leader-row ${entry.current ? "me" : ""}">
        <span class="rank">${index + 1 <= 3 ? ["🥇", "🥈", "🥉"][index] : "#" + (index + 1)}</span>
        <span class="leader-name">${escapeHTML(entry.username)}${entry.current ? " (you)" : ""}</span>
        <span class="xp-cell">${entry.points.toLocaleString()} XP</span>
      </div>
    `).join("")
    : '<p class="muted">No student scores yet. Complete a quiz to get started!</p>';

  if (currentRole === "teacher") {
    $("leaderboardNote").textContent = "The leaderboard displays student accounts only.";
  }
}

async function loadOnlineLeaderboard() {
  if (currentPage === "leaderboard") await renderLeaderboard();
}

/* =========================================================
   CLASSES
   Starter classes are saved in this browser.
   Shared online classes require a server-side permission model.
   ========================================================= */

function renderClasses() {
  $("classGrid").innerHTML = data.classes.length
    ? data.classes.map(item => `
      <article class="class-card">
        <div class="card-emoji">🏫</div>
        <h3>${escapeHTML(item.name)}</h3>
        <p class="muted small">Class code: <strong>${escapeHTML(item.code)}</strong></p>
        <button class="secondary-btn copy-class" data-code="${escapeHTML(item.code)}">Copy code</button>
      </article>
    `).join("")
    : '<p class="empty-state">No classes yet. Join a class using its code.</p>';
}

function createClass(event) {
  event.preventDefault();

  if (currentRole !== "teacher") {
    showNotice("Only teacher accounts can create classes.", "error");
    return;
  }

  const name = $("className").value.trim();
  if (!name) return;

  const code = Math.random().toString(36).slice(2, 8).toUpperCase();

  data.classes.push({ name, code });
  saveData();
  $("className").value = "";
  renderClasses();

  showNotice(`Class created. Share this code with your students: ${code}`);
}

function joinClass(event) {
  event.preventDefault();

  const code = $("classCode").value.trim().toUpperCase();
  if (!code) return;

  if (data.classes.some(item => item.code === code)) {
    showNotice("You're already in this class on this browser.", "error");
    return;
  }

  data.classes.push({ name: "Joined class", code });
  saveData();
  $("classCode").value = "";
  renderClasses();

  showNotice("Class added to your local list.");
}

/* =========================================================
   TEACHER QUIZ CREATOR
   ========================================================= */

function addQuestionEditor() {
  const number = questionDrafts.length + 1;

  questionDrafts.push({
    question: "",
    answers: ["", "", "", ""],
    correct: 0
  });

  renderQuestionEditors();
}

function renderQuestionEditors() {
  $("questionEditor").innerHTML = questionDrafts.map((question, index) => `
    <div class="question-editor-card" data-editor-index="${index}">
      <h3>Question ${index + 1}</h3>
      <label>Question text</label>
      <input class="draft-question" maxlength="300"
        value="${escapeHTML(question.question)}"
        placeholder="Write the question..." required>

      <label>Answer options</label>
      ${question.answers.map((answer, answerIndex) => `
        <input class="draft-answer ${question.correct === answerIndex ? "correct-answer" : ""}"
          data-answer-index="${answerIndex}" maxlength="200"
          value="${escapeHTML(answer)}"
          placeholder="Option ${answerIndex + 1}" required>
      `).join("")}

      <label>Correct answer</label>
      <select class="draft-correct">
        ${question.answers.map((_, answerIndex) => `
          <option value="${answerIndex}" ${question.correct === answerIndex ? "selected" : ""}>
            Option ${answerIndex + 1}
          </option>
        `).join("")}
      </select>
      <button type="button" class="secondary-btn remove-question" data-remove-index="${index}">Remove question</button>
    </div>
  `).join("");
}

function syncQuestionEditors() {
  document.querySelectorAll(".question-editor-card").forEach(card => {
    const index = Number(card.dataset.editorIndex);
    const draft = questionDrafts[index];
    if (!draft) return;

    draft.question = card.querySelector(".draft-question").value;
    draft.answers = [...card.querySelectorAll(".draft-answer")].map(input => input.value);
    draft.correct = Number(card.querySelector(".draft-correct").value);
  });
}

async function createQuiz(event) {
  event.preventDefault();

  if (!currentUser || currentRole !== "teacher") {
    showNotice("Sign in with a teacher account to publish quizzes.", "error");
    return;
  }

  syncQuestionEditors();

  const title = $("newQuizTitle").value.trim();

  if (!title || questionDrafts.length === 0) {
    showNotice("Add a title and at least one question.", "error");
    return;
  }

  const questions = questionDrafts.map(question => ({
    question: question.question.trim(),
    answers: question.answers.map(answer => answer.trim()),
    correct: Number(question.correct),
    explanation: ""
  }));

  const invalid = questions.some(question =>
    !question.question ||
    question.answers.some(answer => !answer) ||
    question.answers.length !== 4 ||
    question.correct < 0 ||
    question.correct > 3
  );

  if (invalid) {
    showNotice("Complete every question and all four answer options.", "error");
    return;
  }

  const quiz = {
    id: "local-" + Date.now(),
    title,
    subject: $("newQuizSubject").value,
    grade: Number($("newQuizGrade").value),
    emoji: "✏️",
    description: "Teacher-created quiz",
    questions
  };

  if (!ONLINE_ENABLED) {
    showNotice("Configure Back4App first to publish shared online quizzes.", "error");
    return;
  }

  try {
    await publishOnlineQuiz(quiz);
    quizList.push(quiz);
    $("createQuizForm").reset();
    questionDrafts = [];
    addQuestionEditor();
    renderQuizzes();
    goToPage("quizzes");
    showNotice("Quiz published successfully!");
  } catch (error) {
    showNotice("Could not publish quiz: " + error.message, "error");
  }
}

/* =========================================================
   EVENTS
   ========================================================= */

document.addEventListener("click", event => {
  const pageButton = event.target.closest("[data-page]");
  if (pageButton) {
    event.preventDefault();
    goToPage(pageButton.dataset.page);
    return;
  }

  const startButton = event.target.closest(".start-quiz");
  if (startButton) {
    startQuiz(startButton.dataset.quizId);
    return;
  }

  const answerButton = event.target.closest(".answer-option");
  if (answerButton) {
    selectAnswer(Number(answerButton.dataset.answer));
    return;
  }

  const practiceButton = event.target.closest(".study-practice");
  if (practiceButton) {
    const subject = practiceButton.dataset.subject.toLowerCase();
    const matching = quizList.find(quiz =>
      quiz.subject.toLowerCase().includes(subject.split(" / ")[0]) &&
      Number(quiz.grade) === Number(practiceButton.dataset.grade)
    );

    if (matching) {
      startQuiz(matching.id);
    } else {
      $("quizSearch").value = practiceButton.dataset.subject.split(" / ")[0];
      goToPage("quizzes");
      renderQuizzes();
      showNotice("Choose a matching quiz, or ask your teacher to add one.");
    }
    return;
  }

  const removeButton = event.target.closest(".remove-question");
  if (removeButton) {
    syncQuestionEditors();
    questionDrafts.splice(Number(removeButton.dataset.removeIndex), 1);
    renderQuestionEditors();
    return;
  }

  const copyButton = event.target.closest(".copy-class");
  if (copyButton) {
    const code = copyButton.dataset.code;
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(code)
        .then(() => showNotice("Class code copied!"))
        .catch(() => showNotice("Class code: " + code));
    } else {
      showNotice("Class code: " + code);
    }
  }
});

$("authButton").addEventListener("click", openAuth);
$("authForm").addEventListener("submit", handleAuth);
$("loginTab").addEventListener("click", () => {
  authMode = "login";
  updateAuthMode();
});
$("registerTab").addEventListener("click", () => {
  authMode = "register";
  updateAuthMode();
});

$("signOutButton").addEventListener("click", signOut);
$("themeButton").addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("quizSprintTheme",
    document.body.classList.contains("dark") ? "dark" : "light");
});

$("languageButton").addEventListener("click", () => {
  uiLanguage = uiLanguage === "en" ? "vi" : "en";
  applyLanguage();
});

$("gradeSelect").addEventListener("change", renderStudy);
$("quizSearch").addEventListener("input", renderQuizzes);
$("nextQuestionButton").addEventListener("click", nextQuestion);
$("joinClassForm").addEventListener("submit", joinClass);
$("createClassForm").addEventListener("submit", createClass);
$("createQuizForm").addEventListener("submit", createQuiz);
$("addQuestionButton").addEventListener("click", () => {
  syncQuestionEditors();
  addQuestionEditor();
});

/* =========================================================
   INITIALIZATION
   ========================================================= */

async function initialize() {
  document.body.classList.toggle(
    "dark",
    localStorage.getItem("quizSprintTheme") === "dark"
  );

  $("footerYear").textContent = "© " + new Date().getFullYear();

  applyLanguage();
  updateAuthMode();
  renderStudy();
  renderDashboard();
  addQuestionEditor();

  document.querySelectorAll(".page").forEach(page => page.classList.add("hidden"));
  $("page-home").classList.remove("hidden");

  await restoreSession();
  await loadQuizzes();
  renderDashboard();

  if (!ONLINE_ENABLED) {
    showNotice(
      "QuizSprint is running in sample mode. Configure Back4App for online accounts and shared quizzes.",
      "error"
    );
  }
}

initialize();