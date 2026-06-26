// =============================================
// ExploringAI — main.js
// =============================================

// ---- Theme Toggle ----
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('ai-theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('ai-theme', next);
  });
}

// ---- Hamburger ----
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('open');
    }
  });
}

// ---- Navbar scroll ----
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.style.background = window.scrollY > 20
      ? (document.documentElement.getAttribute('data-theme') === 'light'
          ? 'rgba(244,246,251,0.97)'
          : 'rgba(10,15,30,0.97)')
      : '';
  });
}

// ---- Active Nav Link ----
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(link => {
  link.classList.remove('active');
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});

// ---- Neural Network Canvas (Hero) ----
const canvas = document.getElementById('neuralCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;

  const layers = [3, 5, 5, 4, 2];
  const nodes = [];
  const layerX = layers.map((_, i) => 60 + i * ((W - 120) / (layers.length - 1)));

  layers.forEach((count, li) => {
    const x = layerX[li];
    const spacing = H / (count + 1);
    for (let ni = 0; ni < count; ni++) {
      nodes.push({ x, y: spacing * (ni + 1), layer: li, index: ni, pulse: Math.random() * Math.PI * 2 });
    }
  });

  let time = 0;

  function getLayerColor() {
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    return isDark ? 'rgba(0,212,255,' : 'rgba(0,100,200,';
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    time += 0.018;

    // Connections
    for (let l = 0; l < layers.length - 1; l++) {
      const from = nodes.filter(n => n.layer === l);
      const to = nodes.filter(n => n.layer === l + 1);
      from.forEach(f => {
        to.forEach(t => {
          const alpha = 0.06 + 0.04 * Math.sin(time + f.pulse + t.pulse);
          ctx.beginPath();
          ctx.moveTo(f.x, f.y);
          ctx.lineTo(t.x, t.y);
          ctx.strokeStyle = getLayerColor() + alpha + ')';
          ctx.lineWidth = 1;
          ctx.stroke();
        });
      });
    }

    // Nodes
    nodes.forEach(n => {
      n.pulse += 0.012;
      const glow = 0.5 + 0.5 * Math.sin(n.pulse + time);
      const r = 6 + glow * 2;

      // Outer glow
      const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 3);
      grad.addColorStop(0, getLayerColor() + (0.18 * glow) + ')');
      grad.addColorStop(1, getLayerColor() + '0)');
      ctx.beginPath();
      ctx.arc(n.x, n.y, r * 3, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // Core
      ctx.beginPath();
      ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
      ctx.fillStyle = getLayerColor() + (0.7 + 0.3 * glow) + ')';
      ctx.fill();

      // Ring
      ctx.beginPath();
      ctx.arc(n.x, n.y, r + 3, 0, Math.PI * 2);
      ctx.strokeStyle = getLayerColor() + (0.15 * glow) + ')';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });

    // Layer labels
    const labels = ['Input', 'Hidden', 'Hidden', 'Hidden', 'Output'];
    layerX.forEach((x, i) => {
      ctx.font = '500 11px Space Mono, monospace';
      ctx.fillStyle = getLayerColor() + '0.4)';
      ctx.textAlign = 'center';
      ctx.fillText(labels[i], x, H - 12);
    });

    requestAnimationFrame(draw);
  }
  draw();
}

// ---- Collapsible Algorithm Cards ----
document.querySelectorAll('.algo-header').forEach(header => {
  header.addEventListener('click', () => {
    const card = header.closest('.algo-card');
    const isOpen = card.classList.contains('open');
    document.querySelectorAll('.algo-card').forEach(c => c.classList.remove('open'));
    if (!isOpen) card.classList.add('open');
  });
});

// ---- Glossary Search ----
const glossarySearch = document.getElementById('glossarySearch');
if (glossarySearch) {
  glossarySearch.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase().trim();
    document.querySelectorAll('.glos-item').forEach(item => {
      const text = item.textContent.toLowerCase();
      item.classList.toggle('hidden', q !== '' && !text.includes(q));
    });
    const visible = document.querySelectorAll('.glos-item:not(.hidden)').length;
    const noResult = document.getElementById('glossaryNoResult');
    if (noResult) noResult.style.display = visible === 0 ? 'block' : 'none';
  });
}

// ---- Flashcard flip ----
document.querySelectorAll('.flashcard').forEach(card => {
  card.addEventListener('click', () => card.classList.toggle('flipped'));
});

// ---- Linear Regression Visualization ----
const vizCanvas = document.getElementById('vizCanvas');
if (vizCanvas) {
  const vctx = vizCanvas.getContext('2d');
  vizCanvas.width = vizCanvas.offsetWidth || 800;
  vizCanvas.height = 300;

  const points = [];
  for (let i = 0; i < 25; i++) {
    const x = 40 + Math.random() * (vizCanvas.width - 80);
    const y = vizCanvas.height - 40 - (x / vizCanvas.width) * (vizCanvas.height - 80) * 0.7 + (Math.random() - 0.5) * 60;
    points.push({ x, y });
  }

  function leastSquares(pts) {
    const n = pts.length;
    const sx = pts.reduce((a, p) => a + p.x, 0);
    const sy = pts.reduce((a, p) => a + p.y, 0);
    const sxy = pts.reduce((a, p) => a + p.x * p.y, 0);
    const sxx = pts.reduce((a, p) => a + p.x * p.x, 0);
    const m = (n * sxy - sx * sy) / (n * sxx - sx * sx);
    const b = (sy - m * sx) / n;
    return { m, b };
  }

  function drawViz(highlight = null) {
    const W = vizCanvas.width, H = vizCanvas.height;
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    const bg = isDark ? '#0f1628' : '#eaeff9';
    const dotColor = isDark ? 'rgba(0,212,255,0.7)' : 'rgba(0,100,200,0.7)';
    const lineColor = isDark ? '#00e5a0' : '#007755';
    const axisColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';

    vctx.fillStyle = bg;
    vctx.fillRect(0, 0, W, H);

    const { m, b } = leastSquares(points);

    // Regression line
    vctx.beginPath();
    vctx.moveTo(20, m * 20 + b);
    vctx.lineTo(W - 20, m * (W - 20) + b);
    vctx.strokeStyle = lineColor;
    vctx.lineWidth = 2;
    vctx.setLineDash([6, 3]);
    vctx.stroke();
    vctx.setLineDash([]);

    // Residual lines
    points.forEach(p => {
      const pred = m * p.x + b;
      vctx.beginPath();
      vctx.moveTo(p.x, p.y);
      vctx.lineTo(p.x, pred);
      vctx.strokeStyle = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
      vctx.lineWidth = 1;
      vctx.stroke();
    });

    // Points
    points.forEach((p, i) => {
      vctx.beginPath();
      vctx.arc(p.x, p.y, highlight === i ? 7 : 5, 0, Math.PI * 2);
      vctx.fillStyle = highlight === i ? '#fff' : dotColor;
      vctx.fill();
    });

    // Label
    vctx.font = '500 11px Space Mono, monospace';
    vctx.fillStyle = isDark ? 'rgba(0,229,160,0.6)' : 'rgba(0,120,80,0.6)';
    vctx.fillText('ŷ = mx + b  (least squares regression line)', 16, 20);
  }

  drawViz();

  vizCanvas.addEventListener('mousemove', (e) => {
    const rect = vizCanvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (vizCanvas.width / rect.width);
    const my = (e.clientY - rect.top) * (vizCanvas.height / rect.height);
    let closest = null, minDist = Infinity;
    points.forEach((p, i) => {
      const d = Math.hypot(p.x - mx, p.y - my);
      if (d < minDist) { minDist = d; closest = i; }
    });
    drawViz(minDist < 20 ? closest : null);
  });

  const addPointBtn = document.getElementById('addPointBtn');
  const resetVizBtn = document.getElementById('resetVizBtn');

  if (addPointBtn) {
    addPointBtn.addEventListener('click', () => {
      const x = 40 + Math.random() * (vizCanvas.width - 80);
      const y = vizCanvas.height - 40 - (x / vizCanvas.width) * (vizCanvas.height - 80) * 0.7 + (Math.random() - 0.5) * 70;
      points.push({ x, y });
      drawViz();
    });
  }
  if (resetVizBtn) {
    resetVizBtn.addEventListener('click', () => {
      points.length = 0;
      for (let i = 0; i < 25; i++) {
        const x = 40 + Math.random() * (vizCanvas.width - 80);
        const y = vizCanvas.height - 40 - (x / vizCanvas.width) * (vizCanvas.height - 80) * 0.7 + (Math.random() - 0.5) * 60;
        points.push({ x, y });
      }
      drawViz();
    });
  }

  window.addEventListener('resize', () => {
    vizCanvas.width = vizCanvas.offsetWidth || 800;
    drawViz();
  });
}

// ---- Quiz Logic ----
const quizData = [
  {
    q: "What type of machine learning uses labeled training data to make predictions?",
    options: ["Unsupervised Learning", "Reinforcement Learning", "Supervised Learning", "Semi-supervised Learning"],
    answer: 2,
    explanation: "Supervised learning trains on labeled input-output pairs so the model can predict outputs for new inputs."
  },
  {
    q: "Which algorithm splits data into groups based on feature similarity without predefined labels?",
    options: ["Linear Regression", "K-Means Clustering", "Logistic Regression", "SVM"],
    answer: 1,
    explanation: "K-Means is an unsupervised algorithm that partitions data into K clusters based on distance."
  },
  {
    q: "What is 'overfitting' in machine learning?",
    options: [
      "The model performs well on both train and test data",
      "The model is too simple to capture patterns",
      "The model learns noise in training data and fails on new data",
      "The model trains on too little data"
    ],
    answer: 2,
    explanation: "Overfitting means the model memorizes training data including noise, so it performs poorly on unseen examples."
  },
  {
    q: "Which algorithm is primarily used for classification tasks by finding an optimal separating hyperplane?",
    options: ["K-Nearest Neighbors", "Support Vector Machine", "K-Means", "Linear Regression"],
    answer: 1,
    explanation: "SVMs maximize the margin between classes by finding the optimal hyperplane that separates them."
  },
  {
    q: "In reinforcement learning, what does an agent receive after taking an action?",
    options: ["A label", "A reward signal", "A cluster assignment", "A gradient"],
    answer: 1,
    explanation: "An RL agent receives reward (or penalty) after each action, learning to maximize cumulative reward over time."
  },
  {
    q: "What does 'bias-variance tradeoff' refer to in ML?",
    options: [
      "The tradeoff between model size and accuracy",
      "The tradeoff between underfitting (high bias) and overfitting (high variance)",
      "The tradeoff between precision and recall",
      "The tradeoff between speed and accuracy"
    ],
    answer: 1,
    explanation: "High bias = model is too simple (underfits). High variance = model is too complex (overfits). Good models balance both."
  },
  {
    q: "Which of the following best describes a Decision Tree?",
    options: [
      "A model that fits a line through data points",
      "A model that groups data into K clusters",
      "A hierarchical model that splits data based on feature conditions",
      "A model inspired by the structure of neurons"
    ],
    answer: 2,
    explanation: "Decision Trees use recursive feature splits to form a tree of yes/no decisions leading to predictions."
  },
  {
    q: "What is the main advantage of a Random Forest over a single Decision Tree?",
    options: [
      "It is faster to train",
      "It uses less memory",
      "It reduces variance by averaging many trees",
      "It works only for regression problems"
    ],
    answer: 2,
    explanation: "Random Forest is an ensemble of trees; averaging their predictions reduces overfitting and increases stability."
  }
];

let currentQ = 0, score = 0, answered = false;

function renderQuiz() {
  const container = document.getElementById('quizContainer');
  if (!container) return;

  if (currentQ >= quizData.length) {
    container.innerHTML = `
      <div class="quiz-card quiz-score-card">
        <div class="score-big">${score}/${quizData.length}</div>
        <p class="score-label">${score >= 6 ? '🎉 Excellent! You have a strong grasp of AI/ML concepts.' : score >= 4 ? '👍 Good effort! Review the sections you missed.' : '📚 Keep studying! Check the algorithm and ML pages.'}</p>
        <button class="btn btn-primary" onclick="restartQuiz()">Retake Quiz</button>
      </div>`;
    return;
  }

  const q = quizData[currentQ];
  const letters = ['A', 'B', 'C', 'D'];

  container.innerHTML = `
    <div class="quiz-card">
      <div class="quiz-progress">
        <div class="progress-bar"><div class="progress-fill" style="width:${(currentQ / quizData.length) * 100}%"></div></div>
        <span class="quiz-counter">${currentQ + 1} / ${quizData.length}</span>
      </div>
      <div class="quiz-q">${q.q}</div>
      <div class="quiz-options">
        ${q.options.map((opt, i) => `
          <button class="quiz-option" data-index="${i}" onclick="selectOption(${i})">
            <span class="option-letter">${letters[i]}</span>
            ${opt}
          </button>`).join('')}
      </div>
      <div class="quiz-feedback" id="quizFeedback"></div>
      <div class="quiz-nav">
        <span></span>
        <button class="btn btn-primary" id="nextBtn" style="display:none" onclick="nextQuestion()">
          ${currentQ < quizData.length - 1 ? 'Next Question →' : 'See Results →'}
        </button>
      </div>
    </div>`;
}

function selectOption(index) {
  if (answered) return;
  answered = true;
  const q = quizData[currentQ];
  const options = document.querySelectorAll('.quiz-option');
  const feedback = document.getElementById('quizFeedback');

  options.forEach(btn => btn.disabled = true);
  options[q.answer].classList.add('correct');

  if (index === q.answer) {
    score++;
    feedback.textContent = '✓ Correct! ' + q.explanation;
    feedback.className = 'quiz-feedback show correct';
  } else {
    options[index].classList.add('wrong');
    feedback.textContent = '✗ Not quite. ' + q.explanation;
    feedback.className = 'quiz-feedback show wrong';
  }

  document.getElementById('nextBtn').style.display = 'inline-flex';
}

function nextQuestion() {
  currentQ++;
  answered = false;
  renderQuiz();
}

function restartQuiz() {
  currentQ = 0;
  score = 0;
  answered = false;
  renderQuiz();
}

if (document.getElementById('quizContainer')) renderQuiz();
