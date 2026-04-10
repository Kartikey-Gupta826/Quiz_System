require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: "https://quiz-system-xeiz.onrender.com"
}));

// ── Middleware ──
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// ── Data file helpers ──
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

function readJSON(file) {
  const p = path.join(DATA_DIR, file);
  if (!fs.existsSync(p)) return null;
  return JSON.parse(fs.readFileSync(p, 'utf-8'));
}

function writeJSON(file, data) {
  fs.writeFileSync(path.join(DATA_DIR, file), JSON.stringify(data, null, 2));
}

// ── Seed data ──
function seedData() {
  if (!fs.existsSync(path.join(DATA_DIR, 'quizzes.json'))) {
    writeJSON('quizzes.json', require('./data/quizzes.json'));
  }
  if (!fs.existsSync(path.join(DATA_DIR, 'leaderboard.json'))) {
    writeJSON('leaderboard.json', []);
  }
}

const ADMIN_PASSWORD = process.env.PASSWORD; // Password for admin routes 
let adminToken = null;

// ── ROUTES ──

app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;

  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Wrong password" });
  }

  // generate simple token
  adminToken = uuidv4();

  res.json({ token: adminToken });
});

function checkAdmin(req, res, next) {
  const token = req.headers['x-admin-token'];

  if (!token || token !== adminToken) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  next();
}

// GET /api/quizzes — list all quizzes (meta only)
app.get('/api/quizzes', (req, res) => {
  const quizzes = readJSON('quizzes.json');
  if (!quizzes) return res.status(500).json({ error: 'Data not found' });
  const meta = quizzes.map(({ id, title, description, difficulty, timePerQuestion, category }) => ({
    id, title, description, difficulty, timePerQuestion, category,
    questionCount: (readJSON(`questions_${id}.json`) || []).length
  }));
  res.json(meta);
});

// GET /api/quizzes/:id — single quiz meta
app.get('/api/quizzes/:id', (req, res) => {
  const quizzes = readJSON('quizzes.json');
  const quiz = quizzes && quizzes.find(q => q.id === req.params.id);
  if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
  const questions = readJSON(`questions_${quiz.id}.json`) || [];
  res.json({ ...quiz, questionCount: questions.length });
});

// GET /api/quizzes/:id/questions — questions (no correct index leaked!)
app.get('/api/quizzes/:id/questions', (req, res) => {
  const questions = readJSON(`questions_${req.params.id}.json`);
  if (!questions) return res.status(404).json({ error: 'Questions not found' });
  // Shuffle array
  const shuffled = [...questions].sort(() => Math.random() - 0.5);
  // Return all data (frontend handles answer validation client-side for simplicity)
  res.json(shuffled);
});

// GET /api/leaderboard
app.get('/api/leaderboard', (req, res) => {
  const lb = readJSON('leaderboard.json') || [];
  const bestScores = {};

  lb.forEach(e => {
    if (!bestScores[e.userId] || e.percentage > bestScores[e.userId].percentage) {
      bestScores[e.userId] = e;
    }
  });
  res.json(
    Object.values(bestScores).sort((a, b) => b.percentage - a.percentage)
  );
});

// POST /api/leaderboard — submit a score
app.post('/api/leaderboard', (req, res) => {
  const lb = readJSON('leaderboard.json') || [];
  const entry = {
    id: uuidv4(),
    userId: req.body.userId,
    name: req.body.name || 'Anonymous',
    quizId: req.body.quizId,
    quizTitle: req.body.quizTitle,
    correct: req.body.correct,
    total: req.body.total,
    percentage: req.body.percentage,
    timestamp: req.body.timestamp || Date.now()
  };
  lb.push(entry);
  writeJSON('leaderboard.json', lb);
  res.status(201).json(entry);
});

// DELETE /api/leaderboard/clear
app.delete('/api/leaderboard/clear', (req, res) => {
  writeJSON('leaderboard.json', []);
  res.json({ success: true });
});

// DELETE /api/leaderboard/:id
app.delete('/api/leaderboard/:id', (req, res) => {
  let lb = readJSON('leaderboard.json') || [];
  lb = lb.filter(e => e.id !== req.params.id);
  writeJSON('leaderboard.json', lb);
  res.json({ success: true });
});

// GET /api/admin/questions — all questions for admin
app.get('/api/admin/questions', checkAdmin, (req, res) => {
  const quizzes = readJSON('quizzes.json') || [];
  let all = [];
  quizzes.forEach(quiz => {
    const qs = readJSON(`questions_${quiz.id}.json`) || [];
    all = all.concat(qs.map(q => ({ ...q, quizId: quiz.id })));
  });
  res.json(all);
});

// POST /api/admin/questions — add a question
app.post('/api/admin/questions', checkAdmin, (req, res) => {
  const { quizId, question, options, correctIndex, explanation } = req.body;
  if (!quizId || !question || !options || options.length !== 4) {
    return res.status(400).json({ error: 'Invalid question data' });
  }
  const questions = readJSON(`questions_${quizId}.json`) || [];
  const newQ = { id: uuidv4(), question, options, correctIndex, explanation: explanation || '', quizId };
  questions.push(newQ);
  writeJSON(`questions_${quizId}.json`, questions);
  res.status(201).json(newQ);
});

// DELETE /api/admin/questions/:quizId/:id
app.delete('/api/admin/questions/:quizId/:id', checkAdmin, (req, res) => {
  const { quizId, id } = req.params;
  let questions = readJSON(`questions_${quizId}.json`) || [];
  questions = questions.filter(q => q.id !== id);
  writeJSON(`questions_${quizId}.json`, questions);
  res.json({ success: true });
});

// Fallback — serve index.html for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// ── Start ──
seedData();
app.listen(PORT, () => {
  console.log(`\n QuizHub running at: http://localhost:${PORT}`);
  console.log(`   Admin panel:         http://localhost:${PORT}/pages/admin.html`);
  console.log(`   Leaderboard:         http://localhost:${PORT}/pages/leaderboard.html\n`);
});
