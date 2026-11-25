
/* ============================================
   QuizSprint
   Browser-based version
   ============================================ */

// Parse configuration
// This version currently uses browser storage for data.
const PARSE_APP_ID = "tKyTal7oTJcA0oJIPcvg9dDV0ngTi1wdh7kQSBbC";
const PARSE_JS_KEY = "e1DYHZMwQEQ9x0JgupdiEYr91DU5qFAMFN8yzlBU";
const PARSE_SERVER = "https://parseapi.back4app.com/";

// Note: Configuration alone does not sync this demo to Parse.

const $ = id => document.getElementById(id);

const storage = {
  get(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key)) ?? fallback;
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

let users = storage.get("qs_users", []);
let quizzes = storage.get("qs_quizzes", []);
let classes = storage.get("qs_classes", []);
let attempts = storage.get("qs_attempts", []);
let currentUser = storage.get("qs_currentUser", null);
let language = storage.get("qs_language", "en");
let theme = storage.get("qs_theme", "dark");
let boardMode = "global";
let selectedClass = null;
let accountMode = "login";

const subjects = [
  "Mathematics", "Vietnamese", "English", "Science",
  "History", "Geography", "Computer Science",
  "Technology", "Art", "Music",
  "Physical Education", "Civic Education"
];

const dictionary = {
  en: {
    dashboard:"Dashboard",
    study:"Study by grade",
    studyText:"Choose your grade and subject.",
    quizHub:"Quiz hub",
    quizText:"Explore and create quizzes.",
    classes:"Classes",
    classText:"Create or join classes.",
    leaderboard:"Leaderboard",
    leaderText:"Compare SprintPoints.",
    profile:"Profile",
    profileText:"Your account.",
    login:"Login",
    start:"Start learning →",
    global:"Global",
    classBoard:"Class",
    createQuiz:"+ Create quiz",
    createClass:"Create class",
    joinClass:"Join class",
    heroText:"Learn subjects, challenge yourself and compete.",
    heroTitle:"Your learning. Your sprint.",
    noQuizzes:"No quizzes available yet.",
    noClasses:"You haven't joined any classes.",
    points:"SprintPoints",
    rank:"Global rank",
    completed:"Completed quizzes",
    logout:"Logout",
    play:"Play",
    view:"View class",
    create:"Create account",
    switchLogin:"Already have an account? Login",
    signup:"Sign up",
    quizTitle:"Quiz title",
    description:"Description",
    question:"Question",
    option:"Option",
    correct:"Correct answer",
    publish:"Publish quiz",
    addQuestion:"+ Add question",
    remove:"Remove",
    result:"Results",
    close:"Close",
    member:"Members",
    code:"Join code",
    className:"Class name",
    enterCode:"Enter join code",
    welcome:"Welcome",
    grade:"Grade",
    noAccount:"You are not logged in.",
    teacherOnly:"Teacher accounts can create quizzes and classes.",
    studentOnly:"Student accounts can take quizzes.",
    fill:"Complete all fields and questions.",
    username:"Username",
    password:"Password",
    score:"Score",
    questions:"questions",
    noBoard:"No users yet."
  },
  vi: {
    dashboard:"Bảng điều khiển",
    study:"Học theo lớp",
    studyText:"Chọn lớp và môn học.",
    quizHub:"Khu vực bài kiểm tra",
    quizText:"Khám phá và tạo bài kiểm tra.",
    classes:"Lớp học",
    classText:"Tạo hoặc tham gia lớp.",
    leaderboard:"Bảng xếp hạng",
    leaderText:"So sánh SprintPoints.",
    profile:"Hồ sơ",
    profileText:"Tài khoản của bạn.",
    login:"Đăng nhập",
    start:"Bắt đầu học →",
    global:"Toàn cầu",
    classBoard:"Lớp",
    createQuiz:"+ Tạo bài kiểm tra",
    createClass:"Tạo lớp",
    joinClass:"Tham gia lớp",
    heroText:"Học tập, thử thách bản thân và thi đấu.",
    heroTitle:"Học tập. Bứt phá.",
    noQuizzes:"Chưa có bài kiểm tra.",
    noClasses:"Bạn chưa tham gia lớp nào.",
    points:"SprintPoints",
    rank:"Xếp hạng toàn cầu",
    completed:"Bài đã hoàn thành",
    logout:"Đăng xuất",
    play:"Bắt đầu",
    view:"Xem lớp",
    create:"Tạo tài khoản",
    switchLogin:"Đã có tài khoản? Đăng nhập",
    signup:"Đăng ký",
    quizTitle:"Tên bài kiểm tra",
    description:"Mô tả",
    question:"Câu hỏi",
    option:"Đáp án",
    correct:"Đáp án đúng",
    publish:"Đăng bài kiểm tra",
    addQuestion:"+ Thêm câu hỏi",
    remove:"Xóa",
    result:"Kết quả",
    close:"Đóng",
    member:"Thành viên",
    code:"Mã tham gia",
    className:"Tên lớp",
    enterCode:"Nhập mã tham gia",
    welcome:"Xin chào",
    grade:"Lớp",
    noAccount:"Bạn chưa đăng nhập.",
    teacherOnly:"Tài khoản giáo viên có thể tạo bài kiểm tra và lớp.",
    studentOnly:"Tài khoản học sinh có thể làm bài kiểm tra.",
    fill:"Vui lòng hoàn thành tất cả câu hỏi.",
    username:"Tên người dùng",
    password:"Mật khẩu",
    score:"Điểm",
    questions:"câu hỏi",
    noBoard:"Chưa có người dùng."
  }
};

function tr(key) {
  return dictionary[language][key] || dictionary.en[key] || key;
}

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&":"&amp;",
    "<":"&lt;",
    ">":"&gt;",
    '"':"&quot;",
    "'":"&#39;"
  }[char]));
}

function saveAll() {
  storage.set("qs_users", users);
  storage.set("qs_quizzes", quizzes);
  storage.set("qs_classes", classes);
  storage.set("qs_attempts", attempts);
  storage.set("qs_currentUser", currentUser);
}

function applyTheme() {
  document.body.classList.toggle("light", theme === "light");
  $("themeBtn").textContent = theme === "light" ? "☾" : "☀";
  storage.set("qs_theme", theme);
}

function applyLanguage() {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.dataset.i18n;
    if (dictionary[language][key]) {
      el.textContent = tr(key);
    }
  });

  $("langBtn").textContent = language === "en" ? "VI" : "EN";

  // Translate non-English subject UI only.
  // The English subject itself is intentionally unchanged.
  $("welcomeUser").textContent = currentUser
    ? `${tr("welcome")}, ${currentUser.username}!`
    : "Welcome to QuizSprint";

  $("createQuizBtn").textContent = tr("createQuiz");
  $("createClassBtn").textContent = tr("createClass");
  $("joinClassBtn").textContent = tr("joinClass");
  $("globalTab").textContent = tr("global");
  $("classTab").textContent = tr("classBoard");

  populateGrades();
  populateSubjects();
  renderSubjects();
  renderQuizzes();
  renderClasses();
  renderLeaderboard();
  renderProfile();
  updateUserUI();
}

function populateGrades() {
  const options = Array.from({length:12}, (_,i) =>
    `<option value="${i+1}">${tr("grade")} ${i+1}</option>`
  ).join("");

  $("gradeSelect").innerHTML = options;
  $("newQuizGrade").innerHTML = options;
}

function populateSubjects() {
  const options = subjects.map(s =>
    `<option value="${escapeHTML(s)}">${escapeHTML(s)}</option>`
  ).join("");

  $("subjectSelect").innerHTML = options;
  $("newQuizSubject").innerHTML = options;
}

function renderSubjects() {
  const grade = Number($("gradeSelect").value || 1);
  const subject = $("subjectSelect").value || subjects[0];

  const available = quizzes.filter(q =>
    q.grade === grade && q.subject === subject
  );

  $("studyContent").innerHTML = `
    <article class="subject-card">
      <div class="subject-icon">📚</div>
      <h3>${tr("grade")} ${grade}</h3>
      <p>${escapeHTML(subject)}</p>
      <p>${available.length} ${tr("questions")}</p>
      <button class="primary" onclick="browseSubject()">${tr("play")}</button>
    </article>
  `;
}

function browseSubject() {
  const grade = Number($("gradeSelect").value);
  const subject = $("subjectSelect").value;

  const list = quizzes.filter(q =>
    q.grade === grade && q.subject === subject
  );

  $("quizList").innerHTML = list.length
    ? list.map(quizCard).join("")
    : `<div class="card">${tr("noQuizzes")}</div>`;

  $("quizSection").scrollIntoView({behavior:"smooth"});
}

function quizCard(q) {
  return `
    <article class="quiz-card">
      <h3>${escapeHTML(q.title)}</h3>
      <p>${escapeHTML(q.subject)} · ${tr("grade")} ${q.grade}</p>
      <p>${q.questions.length} ${tr("questions")}</p>
      <button class="primary" onclick="playQuiz('${q.id}')">${tr("play")}</button>
    </article>
  `;
}

function renderQuizzes() {
  $("quizList").innerHTML = quizzes.length
    ? quizzes.map(quizCard).join("")
    : `<div class="card">${tr("noQuizzes")}</div>`;
}

function renderClasses() {
  const joined = currentUser
    ? classes.filter(c => c.members.includes(currentUser.username))
    : [];

  $("classList").innerHTML = joined.length
    ? joined.map(c => `
      <article class="class-card">
        <h3>${escapeHTML(c.name)}</h3>
        <p>${tr("code")}: <b>${escapeHTML(c.code)}</b></p>
        <p>${c.members.length} ${tr("member")}</p>
        <button onclick="viewClass('${c.id}')">${tr("view")}</button>
      </article>
    `).join("")
    : `<div class="card">${tr("noClasses")}</div>`;
}

function renderLeaderboard() {
  let scores = users.map(u => ({
    username:u.username,
    points:u.points || 0
  }));

  if (boardMode === "class" && selectedClass) {
    scores = scores.filter(s =>
      selectedClass.members.includes(s.username)
    );
  }

  scores.sort((a,b) => b.points - a.points);

  $("leaderboard").innerHTML = scores.length
    ? `
      <table>
        <thead>
          <tr><th>#</th><th>Username</th><th>SprintPoints</th></tr>
        </thead>
        <tbody>
          ${scores.map((s,i) => `
            <tr>
              <td>${i+1}</td>
              <td>${escapeHTML(s.username)}</td>
              <td>⚡ ${s.points}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `
    : `<p>${tr("noBoard")}</p>`;
}

function renderProfile() {
  if (!currentUser) {
    $("profile").innerHTML = `
      <p>${tr("noAccount")}</p>
      <button onclick="openAccount()">${tr("login")}</button>
    `;
    return;
  }

  $("profile").innerHTML = `
    <h3>${escapeHTML(currentUser.username)}</h3>
    <p>${escapeHTML(currentUser.role)}</p>
    <p>⚡ ${currentUser.points || 0} SprintPoints</p>
    <button onclick="logout()">${tr("logout")}</button>
  `;
}

function updateUserUI() {
  $("welcomeUser").textContent = currentUser
    ? `${tr("welcome")}, ${currentUser.username}!`
    : "Welcome to QuizSprint";

  $("points").textContent = currentUser?.points || 0;
  $("statPoints").textContent = currentUser?.points || 0;

  $("statQuizzes").textContent = currentUser
    ? attempts.filter(a => a.username === currentUser.username).length
    : 0;

  const sorted = [...users].sort((a,b) =>
    (b.points || 0) - (a.points || 0)
  );

  const rank = currentUser
    ? sorted.findIndex(u => u.username === currentUser.username)
    : -1;

  $("statRank").textContent = rank < 0 ? "—" : `#${rank+1}`;

  renderProfile();
  renderLeaderboard();
  renderClasses();
}

function openAccount() {
  $("accountDialog").showModal();
}

function logout() {
  currentUser = null;
  saveAll();
  updateUserUI();
}

function submitAccount() {
  const username = $("username").value.trim();
  const password = $("password").value;
  const role = document.querySelector('input[name="role"]:checked').value;

  if (!username || !password) {
    $("accountMessage").textContent =
      "Enter a username and password.";
    return;
  }

  if (accountMode === "signup") {
    if (users.some(u =>
      u.username.toLowerCase() === username.toLowerCase()
    )) {
      $("accountMessage").textContent = "Username already exists.";
      return;
    }

    currentUser = {
      username,
      password,
      role,
      points:0
    };

    users.push(currentUser);
  } else {
    const user = users.find(u =>
      u.username === username &&
      u.password === password &&
      u.role === role
    );

    if (!user) {
      $("accountMessage").textContent = "Incorrect login details.";
      return;
    }

    currentUser = user;
  }

  $("accountMessage").textContent = "";
  saveAll();
  $("accountDialog").close();
  updateUserUI();
}

function createClass() {
  if (!currentUser) return openAccount();

  if (currentUser.role !== "Teacher") {
    return alert(tr("teacherOnly"));
  }

  const name = $("className").value.trim();
  if (!name) return alert("Enter a class name.");

  const code = Math.random().toString(36)
    .slice(2,8).toUpperCase();

  classes.push({
    id:crypto.randomUUID(),
    name,
    code,
    owner:currentUser.username,
    members:[currentUser.username]
  });

  saveAll();
  renderClasses();
  $("className").value = "";
}

function joinClass() {
  if (!currentUser) return openAccount();

  const code = $("joinCode").value.trim().toUpperCase();
  const c = classes.find(x => x.code === code);

  if (!c) return alert("Class not found.");

  if (!c.members.includes(currentUser.username)) {
    c.members.push(currentUser.username);
  }

  saveAll();
  renderClasses();
  $("joinCode").value = "";
}

function viewClass(id) {
  const c = classes.find(x => x.id === id);
  if (!c) return;

  selectedClass = c;

  $("classDialogTitle").textContent = c.name;

  const members = users.filter(u =>
    c.members.includes(u.username)
  );

  $("classDialogContent").innerHTML = `
    <p>${tr("code")}: <b>${escapeHTML(c.code)}</b></p>
    <h3>${tr("member")}</h3>
    ${members.map(m => `
      <p>${escapeHTML(m.username)} · ⚡ ${m.points || 0}</p>
    `).join("")}
    <button onclick="showClassBoard('${c.id}')">Leaderboard</button>
  `;

  $("classDialog").showModal();
}

function showClassBoard(id) {
  selectedClass = classes.find(c => c.id === id);
  boardMode = "class";

  $("classTab").classList.add("active");
  $("globalTab").classList.remove("active");

  renderLeaderboard();
  $("leaderboardSection").scrollIntoView({behavior:"smooth"});
  $("classDialog").close();
}

function addQuestion() {
  const wrapper = document.createElement("div");
  wrapper.className = "question-item";

  wrapper.innerHTML = `
    <input class="question-text" placeholder="${tr("question")}">
    <input class="option" placeholder="A">
    <input class="option" placeholder="B">
    <input class="option" placeholder="C">
    <input class="option" placeholder="D">
    <label>${tr("correct")}:
      <select class="correct">
        <option value="0">A</option>
        <option value="1">B</option>
        <option value="2">C</option>
        <option value="3">D</option>
      </select>
    </label>
    <button class="remove-question">${tr("remove")}</button>
  `;

  wrapper.querySelector(".remove-question").onclick =
    () => wrapper.remove();

  $("questionBuilder").appendChild(wrapper);
}

function publishQuiz() {
  if (!currentUser) return openAccount();

  if (currentUser.role !== "Teacher") {
    return alert(tr("teacherOnly"));
  }

  const title = $("newQuizTitle").value.trim();
  const grade = Number($("newQuizGrade").value);
  const subject = $("newQuizSubject").value;
  const description = $("newQuizDescription").value.trim();

  const questions = [...document.querySelectorAll(".question-item")]
    .map(el => ({
      text:el.querySelector(".question-text").value.trim(),
      options:[...el.querySelectorAll(".option")]
        .map(o => o.value.trim()),
      correct:Number(el.querySelector(".correct").value)
    }));

  if (!title || questions.length === 0 ||
      questions.some(q =>
        !q.text || q.options.some(o => !o)
      )) {
    $("quizMessage").textContent = tr("fill");
    return;
  }

  quizzes.push({
    id:crypto.randomUUID(),
    title,
    grade,
    subject,
    description,
    author:currentUser.username,
    questions
  });

  saveAll();
  $("quizDialog").close();
  renderQuizzes();
  renderSubjects();

  $("newQuizTitle").value = "";
  $("newQuizDescription").value = "";
  $("questionBuilder").innerHTML = "";
}

function playQuiz(id) {
  if (!currentUser) return openAccount();

  if (currentUser.role !== "Student") {
    return alert(tr("studentOnly"));
  }

  const quiz = quizzes.find(q => q.id === id);
  if (!quiz) return;

  $("playTitle").textContent = quiz.title;

  $("playContent").innerHTML = `
    <form id="playForm">
      ${quiz.questions.map((q,i) => `
        <div class="question-item">
          <h3>${i+1}. ${escapeHTML(q.text)}</h3>
          ${q.options.map((o,j) => `
            <label class="answer-option">
              <input type="radio" name="q${i}" value="${j}" required>
              ${escapeHTML(o)}
            </label>
          `).join("")}
        </div>
      `).join("")}
      <button class="primary full" type="submit">Submit</button>
    </form>
  `;

  $("playForm").onsubmit = e => {
    e.preventDefault();

    const formData = new FormData(e.target);
    let score = 0;

    quiz.questions.forEach((q,i) => {
      if (Number(formData.get("q"+i)) === q.correct) {
        score++;
      }
    });

    const gained = score * 10;
    const percentage = Math.round(
      score / quiz.questions.length * 100
    );

    currentUser.points = (currentUser.points || 0) + gained;

    const userIndex = users.findIndex(u =>
      u.username === currentUser.username
    );

    if (userIndex !== -1) {
      users[userIndex] = currentUser;
    }

    attempts.push({
      id:crypto.randomUUID(),
      username:currentUser.username,
      quizId:quiz.id,
      score,
      total:quiz.questions.length,
      percentage,
      points:gained,
      date:new Date().toISOString()
    });

    saveAll();
    updateUserUI();

    $("playContent").innerHTML = `
      <h2>${tr("result")}</h2>
      <h3>${score}/${quiz.questions.length}</h3>
      <p>${percentage}%</p>
      <p>⚡ +${gained} SprintPoints</p>
      <button onclick="$('playDialog').close()">${tr("close")}</button>
    `;
  };

  $("playDialog").showModal();
}

function init() {
  populateGrades();
  populateSubjects();

  $("gradeSelect").onchange = renderSubjects;
  $("subjectSelect").onchange = renderSubjects;

  $("langBtn").onclick = () => {
    language = language === "en" ? "vi" : "en";
    storage.set("qs_language", language);
    applyLanguage();
  };

  $("themeBtn").onclick = () => {
    theme = theme === "dark" ? "light" : "dark";
    applyTheme();
  };

  $("loginBtn").onclick = openAccount;
  $("startBtn").onclick = () =>
    $("study").scrollIntoView({behavior:"smooth"});

  $("submitAccount").onclick = submitAccount;

  $("switchAccount").onclick = () => {
    accountMode = accountMode === "login" ? "signup" : "login";

    $("accountTitle").textContent =
      accountMode === "login" ? "Login" : "Sign up";

    $("submitAccount").textContent =
      accountMode === "login" ? "Login" : "Sign up";

    $("switchAccount").textContent =
      accountMode === "login"
        ? tr("create")
        : tr("switchLogin");
  };

  $("createClassBtn").onclick = createClass;
  $("joinClassBtn").onclick = joinClass;

  $("createQuizBtn").onclick = () => {
    if (!currentUser) return openAccount();

    if (currentUser.role !== "Teacher") {
      return alert(tr("teacherOnly"));
    }

    $("questionBuilder").innerHTML = "";
    addQuestion();
    $("quizDialog").showModal();
  };

  $("addQuestionBtn").onclick = addQuestion;
  $("publishQuizBtn").onclick = publishQuiz;

  $("globalTab").onclick = () => {
    boardMode = "global";
    selectedClass = null;
    $("globalTab").classList.add("active");
    $("classTab").classList.remove("active");
    renderLeaderboard();
  };

  $("classTab").onclick = () => {
    if (!currentUser) return openAccount();

    const joined = classes.filter(c =>
      c.members.includes(currentUser.username)
    );

    if (!joined.length) return alert(tr("noClasses"));

    selectedClass = joined[0];
    boardMode = "class";

    $("classTab").classList.add("active");
    $("globalTab").classList.remove("active");

    renderLeaderboard();
  };

  document.querySelectorAll("[data-close]").forEach(btn => {
    btn.onclick = () => $(btn.dataset.close).close();
  });

  applyTheme();
  applyLanguage();
  updateUserUI();
}

init();
