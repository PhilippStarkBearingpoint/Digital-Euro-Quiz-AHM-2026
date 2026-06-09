(function () {
  'use strict';

  const firebaseConfig = {
    apiKey: 'AIzaSyDloOpiwDq7PzwkhBiOap8SCncXn226UNo',
    authDomain: 'digital-euro-quiz-ahm-2026.firebaseapp.com',
    databaseURL: 'https://digital-euro-quiz-ahm-2026-default-rtdb.europe-west1.firebasedatabase.app',
    projectId: 'digital-euro-quiz-ahm-2026',
    storageBucket: 'digital-euro-quiz-ahm-2026.firebasestorage.app',
    messagingSenderId: '667467540583',
    appId: '1:667467540583:web:3f657b2dc6efedf43b8cc2'
  };

  // Optional. Leave empty if not using App Check for now.
  const firebaseAppCheckSiteKey = '';

  const CONFIG = {
    QUESTION_TIME_SEC: 30,
    SHOW_TOP_N: 20
  };

  const QUESTIONS = [
    {
      id: 'q1',
      text: 'What is the digital euro?',
      choices: ['A cryptocurrency', 'Digital cash issued by the ECB', 'A European stablecoin'],
      correctIndex: 1,
      explanation: 'The digital euro would be official digital central bank money – like cash, but in digital form.'
    },
    {
      id: 'q2',
      text: 'Who would issue the digital euro?',
      choices: ['European Central Bank', 'Commercial banks', 'Card companies'],
      correctIndex: 0,
      explanation: 'The issuer would be the ECB or the Eurosystem – not a private company.'
    },
    {
      id: 'q3',
      text: 'Would cash be replaced by the digital euro?',
      choices: ['Yes', 'No'],
      correctIndex: 1,
      explanation: 'Cash will remain. The digital euro is intended to complement cash, not replace it.'
    },
    {
      id: 'q4',
      text: 'How is privacy designed in the digital euro?',
      choices: ['My personal bank can see transactions', 'Cashlike high privacy standards', 'Payments will be transparent to all users like in Blockchain'],
      correctIndex: 1,
      explanation: 'The ECB emphasises privacy as a core principle. Data will thus be processed and handled securely through encryption and pseudonymisation. For offline payments only the involved two parties would know the transaction details.'
    },
    {
      id: 'q5',
      text: 'Which benefit is typical for citizens?',
      choices: ['End-User fees for every payment', 'Safe and easy payments across Europe', 'Can only be used with constant internet access'],
      correctIndex: 1,
      explanation: 'The goal is convenient, secure and Europe-wide usability – without additional fees for end users.'
    },
    {
      id: 'q6',
      text: 'Which technology could be used?',
      choices: ['Blockchain', 'A centralized settlement platform', 'DLT'],
      correctIndex: 1,
      explanation: 'The digital euro would operate on a central settlement platform, and the Eurosystem will record and verify all settlements and holdings.'
    },
    {
      id: 'q7',
      text: 'When could an introduction realistically be made at the earliest?',
      choices: ['It is already live', '2029', '2034'],
      correctIndex: 1,
      explanation: 'According to the current roadmap, from 2029 onwards is realistic, depending on the EU process and the ECB project phases. The pilot with limited scope is expeted to go-live in mid 2027.'
    },
    {
      id: 'q8',
      text: 'Which of the following is a key strategic motive for the ECB to introduce the digital euro?',
      choices: [
        'Replace fintechs for payments',
        'Strengthen EU autonomy by reducing dependence on non-EU payment providers',
        'Launching a cryptocurrency to compete with Bitcoin'
      ],
      correctIndex: 1,
      explanation: 'The digital euro aims to strengthen Europe\'s strategic autonomy and reduce dependency on non-EU payment providers. It is not intended to replace fintechs and it is not a cryptocurrency.'
    },
    {
      id: 'q9',
      text: 'How does the digital euro promote financial inclusion?',
      choices: [
        'Helps improving personal credit score',
        'Access to payments via digital wallet without a traditional bank account',
        'Only available to people with an existing bank account'
      ],
      correctIndex: 1,
      explanation: 'The digital euro could support financial inclusion by enabling access to digital payments through a digital wallet even without a traditional bank account.'
    }
  ];

  const startView = document.getElementById('start');
  const quizView = document.getElementById('quiz');
  const resultView = document.getElementById('result');
  const startBtn = document.getElementById('startBtn');
  const playerNameInput = document.getElementById('playerName');
  const qIndexEl = document.getElementById('qIndex');
  const qTotalEl = document.getElementById('qTotal');
  const scoreValEl = document.getElementById('scoreVal');
  const timerFill = document.getElementById('timerFill');
  const timerText = document.getElementById('timerText');
  const questionText = document.getElementById('questionText');
  const choicesEl = document.getElementById('choices');
  const explanationEl = document.getElementById('explanation');
  const nextBtn = document.getElementById('nextBtn');
  const finalScoreEl = document.getElementById('finalScore');
  const finalTimeEl = document.getElementById('finalTime');
  const submitBtn = document.getElementById('submitBtn');
  const restartBtn = document.getElementById('restartBtn');
  const submitMsg = document.getElementById('submitMsg');
  const leaderboardBox = document.getElementById('leaderboard');
  const leaderboardList = document.getElementById('leaderboardList');


let playerRankEl = document.getElementById('playerRank');
const leaderboardHeading = leaderboardBox ? leaderboardBox.querySelector('h3') : null;

if (!playerRankEl && leaderboardHeading) {
  playerRankEl = document.createElement('p');
  playerRankEl.id = 'playerRank';
  playerRankEl.className = 'rank-summary hidden';
  leaderboardHeading.parentNode.insertBefore(playerRankEl, leaderboardHeading);
}
``
  
  if (!startView || !quizView || !resultView || !startBtn || !playerNameInput || !qIndexEl || !qTotalEl || !scoreValEl || !timerFill || !timerText || !questionText || !choicesEl || !explanationEl || !nextBtn || !finalScoreEl || !finalTimeEl || !submitBtn || !restartBtn || !submitMsg || !leaderboardBox || !leaderboardList) {
    console.error('Critical DOM elements are missing. Please check index.html IDs.');
    return;
  }

  qTotalEl.textContent = String(QUESTIONS.length);

const state = {
  playerName: '',
  current: 0,
  score: 0,
  totalTimeMs: 0,
  answers: [],
  timer: null,
  timeLeftMs: CONFIG.QUESTION_TIME_SEC * 1000,
  order: [],
  correctIdx: -1,
  submittedEntryMeta: null
  hasSubmittedScore: false
};

  let firebaseReady = false;
  let leaderboardStarted = false;
  let firebaseDb = null;
  let firebaseRef = null;
  let firebasePush = null;
  let firebaseSet = null;
  let firebaseOnValue = null;

  function hasFirebaseConfig() {
    return (
      !String(firebaseConfig.apiKey).startsWith('REPLACE_') &&
      !String(firebaseConfig.authDomain).startsWith('REPLACE_') &&
      !String(firebaseConfig.databaseURL).startsWith('REPLACE_') &&
      !String(firebaseConfig.projectId).startsWith('REPLACE_') &&
      !String(firebaseConfig.messagingSenderId).startsWith('REPLACE_') &&
      !String(firebaseConfig.appId).startsWith('REPLACE_')
    );
  }

  function shuffle(array) {
    const a = array.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = a[i];
      a[i] = a[j];
      a[j] = tmp;
    }
    return a;
  }

  function updateTimerUI() {
    const pct = state.timeLeftMs / (CONFIG.QUESTION_TIME_SEC * 1000);
    timerFill.style.width = String(Math.max(0, Math.min(1, pct)) * 100) + '%';
    timerText.textContent = String(Math.ceil(state.timeLeftMs / 1000)) + 's';
  }

  function renderQuestion() {
    const q = QUESTIONS[state.current];
    qIndexEl.textContent = String(state.current + 1);
    scoreValEl.textContent = String(state.score);
    questionText.textContent = q.text;
    choicesEl.innerHTML = '';
    explanationEl.textContent = '';
    nextBtn.disabled = true;

    const base = q.choices.map(function (_, i) { return i; });
    state.order = shuffle(base);
    state.correctIdx = state.order.indexOf(q.correctIndex);
    state.timeLeftMs = CONFIG.QUESTION_TIME_SEC * 1000;

    const startTs = Date.now();
    updateTimerUI();

    if (state.timer) clearInterval(state.timer);
    state.timer = setInterval(function () {
      const elapsed = Date.now() - startTs;
      state.timeLeftMs = Math.max(0, CONFIG.QUESTION_TIME_SEC * 1000 - elapsed);
      updateTimerUI();
      if (state.timeLeftMs <= 0) {
        clearInterval(state.timer);
        lockChoices(null);
      }
    }, 100);

    state.order.forEach(function (origIdx, idx) {
      const btn = document.createElement('button');
      btn.className = 'choice';
      btn.type = 'button';
      btn.textContent = q.choices[origIdx];
      btn.addEventListener('click', function () { onAnswer(idx); });
      choicesEl.appendChild(btn);
    });
  }

  function onAnswer(idx) {
    if (state.timer) clearInterval(state.timer);
    lockChoices(idx);
  }

  function lockChoices(selectedIdx) {
    const q = QUESTIONS[state.current];
    const isCorrect = selectedIdx !== null && selectedIdx === state.correctIdx;
    let add = 0;

    if (isCorrect) {
      const bonus = Math.round((state.timeLeftMs / (CONFIG.QUESTION_TIME_SEC * 1000)) * 300);
      add = 700 + bonus;
    }

    state.score += add;
    state.totalTimeMs += (CONFIG.QUESTION_TIME_SEC * 1000 - state.timeLeftMs);

    const buttons = Array.prototype.slice.call(document.querySelectorAll('.choice'));
    buttons.forEach(function (b, i) {
      b.classList.add('disabled');
      if (i === state.correctIdx) b.classList.add('correct');
      if (selectedIdx !== null && i === selectedIdx && !isCorrect) b.classList.add('wrong');
    });

    explanationEl.textContent =
      (isCorrect ? 'Correct! ' : 'Incorrect. ') +
      q.explanation +
      (isCorrect ? ' (+' + add + ' points)' : '');

    nextBtn.disabled = false;
    scoreValEl.textContent = String(state.score);

    const answeredOriginalIdx = selectedIdx === null ? null : state.order[selectedIdx];
    state.answers.push({
      qid: q.id,
      correct: !!isCorrect,
      timeMs: (CONFIG.QUESTION_TIME_SEC * 1000 - state.timeLeftMs),
      score: add,
      selectedOriginalIdx: answeredOriginalIdx
    });
  }

  function startQuiz() {
    const name = playerNameInput.value.trim();
    if (!name) {
      playerNameInput.focus();
      playerNameInput.style.outline = '2px solid #ef4444';
      setTimeout(function () { playerNameInput.style.outline = ''; }, 800);
      return;
    }

    state.playerName = name;
    state.current = 0;
    state.score = 0;
    state.totalTimeMs = 0;
    state.answers = [];
    state.hasSubmittedScore = false;
    state.submittedEntryMeta = null;
    
    submitBtn.disabled = false;
    submitBtn.textContent = 'Submit score & show leaderboard';

    leaderboardBox.classList.add('hidden');
    submitMsg.textContent = '';

    
state.submittedEntryMeta = null;
if (playerRankEl) {
  playerRankEl.textContent = '';
  playerRankEl.classList.add('hidden');
}

    startView.classList.remove('visible');
    startView.style.display = 'none';
    quizView.classList.add('visible');
    quizView.style.display = 'block';
    resultView.classList.remove('visible');
    resultView.style.display = 'none';

    renderQuestion();
  }

  function nextQuestion() {
    state.current += 1;
    if (state.current < QUESTIONS.length) {
      renderQuestion();
    } else {
      showResult();
    }
  }

  function showResult() {
    quizView.classList.remove('visible');
    quizView.style.display = 'none';
    resultView.classList.add('visible');
    resultView.style.display = 'block';
    finalScoreEl.textContent = String(state.score);
    finalTimeEl.textContent = (state.totalTimeMs / 1000).toFixed(1);
  }
  
function renderLeaderboardRows(rows) {
  leaderboardList.innerHTML = '';

  rows.slice(0, CONFIG.SHOW_TOP_N).forEach(function (row, i) {
    const li = document.createElement('li');
    const secs = (Number(row.totalTimeMs || 0) / 1000).toFixed(1);
    li.textContent = '#' + (i + 1) + ' ' + row.name + ' — ' + row.score + ' points · ' + secs + 's';
    leaderboardList.appendChild(li);
  });

  if (playerRankEl && state.submittedEntryMeta) {
    const rankIndex = rows.findIndex(function (row) {
      return (
        row.name === state.submittedEntryMeta.name &&
        Number(row.score || 0) === Number(state.submittedEntryMeta.score) &&
        Number(row.totalTimeMs || 0) === Number(state.submittedEntryMeta.totalTimeMs) &&
        Number(row.createdAt || 0) === Number(state.submittedEntryMeta.createdAt)
      );
    });

    if (rankIndex >= 0) {
      playerRankEl.textContent = 'Your current rank: #' + (rankIndex + 1) + ' of ' + rows.length;
      playerRankEl.classList.remove('hidden');
    } else {
      playerRankEl.textContent = '';
      playerRankEl.classList.add('hidden');
    }
  }
}

  function startLeaderboardListener() {
    if (!firebaseReady || leaderboardStarted) return;
    leaderboardStarted = true;

    const leaderboardRefInstance = firebaseRef(firebaseDb, 'leaderboard');
    firebaseOnValue(
      leaderboardRefInstance,
      function (snapshot) {
        const raw = snapshot.val() || {};
        const rows = Object.keys(raw).map(function (id) {
          const value = raw[id] || {};
          value.id = id;
          return value;
        });

        rows.sort(function (a, b) {
          return (
            (Number(b.score || 0) - Number(a.score || 0)) ||
            (Number(a.totalTimeMs || 0) - Number(b.totalTimeMs || 0)) ||
            (Number(a.createdAt || 0) - Number(b.createdAt || 0))
          );
        });

        renderLeaderboardRows(rows);
      },
      function (error) {
        console.error('Leaderboard listener error', error);
      }
    );
  }

  async function submitScore() {    
    if (state.hasSubmittedScore) {
      return;
  }

    submitBtn.disabled = true;
    submitMsg.textContent = 'Submitting score …';

    if (!firebaseReady) {
      submitMsg.textContent = 'Firebase is not configured yet. The quiz works, but leaderboard submission needs your Firebase values in app.js.';
      submitBtn.disabled = false;
      return;
    }

    try {
      const createdAt = Date.now();

state.submittedEntryMeta = {
  name: state.playerName,
  score: state.score,
  totalTimeMs: state.totalTimeMs,
  createdAt: createdAt
};

const entryRef = firebasePush(firebaseRef(firebaseDb, 'leaderboard'));
const createdAt = Date.now();

state.submittedEntryMeta = {
  name: state.playerName,
  score: state.score,
  totalTimeMs: state.totalTimeMs,
  createdAt: createdAt
};

await firebaseSet(entryRef, {
  name: state.playerName,
  score: state.score,
  totalTimeMs: state.totalTimeMs,
  createdAt: createdAt
});

state.hasSubmittedScore = true;
submitBtn.disabled = true;
submitBtn.textContent = 'Score submitted';

leaderboardBox.classList.remove('hidden');
submitMsg.textContent = 'Score saved! The leaderboard is shown below. ✅';
    } catch (err) {
      console.error(err);
      submitMsg.textContent = 'Could not save the score. Please try again later or contact the booth team.';
    } finally {
      submitBtn.disabled = false;
    }
  }

  async function setupFirebaseLazily() {
    if (!hasFirebaseConfig()) {
      console.warn('Firebase placeholders still present. Running quiz without leaderboard backend for now.');
      return;
    }

    try {
      const appMod = await import('https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js');
      const authMod = await import('https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js');
      const dbMod = await import('https://www.gstatic.com/firebasejs/12.3.0/firebase-database.js');
      const appCheckMod = await import('https://www.gstatic.com/firebasejs/12.3.0/firebase-app-check.js');

      const app = appMod.initializeApp(firebaseConfig);

      if (firebaseAppCheckSiteKey && !String(firebaseAppCheckSiteKey).startsWith('REPLACE_')) {
        appCheckMod.initializeAppCheck(app, {
          provider: new appCheckMod.ReCaptchaV3Provider(firebaseAppCheckSiteKey),
          isTokenAutoRefreshEnabled: true
        });
      }

      firebaseDb = dbMod.getDatabase(app);
      firebaseRef = dbMod.ref;
      firebasePush = dbMod.push;
      firebaseSet = dbMod.set;
      firebaseOnValue = dbMod.onValue;

      const auth = authMod.getAuth(app);
      await authMod.signInAnonymously(auth);

      firebaseReady = true;
      startLeaderboardListener();
    } catch (err) {
      console.error('Firebase lazy setup failed', err);
      firebaseReady = false;
    }
  }

  startBtn.addEventListener('click', function (e) {
    e.preventDefault();
    startQuiz();
  });

  nextBtn.addEventListener('click', function (e) {
    e.preventDefault();
    nextQuestion();
  });

  submitBtn.addEventListener('click', function (e) {
    e.preventDefault();
    submitScore();
  });

  restartBtn.addEventListener('click', function (e) {
    e.preventDefault();
    window.location.reload();
  });

  playerNameInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      startQuiz();
    }
  });

  // Quiz functionality is available immediately; Firebase loads separately in the background.
  setupFirebaseLazily();
})();
