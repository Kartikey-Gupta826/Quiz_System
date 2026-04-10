# QuizHub – Online Quiz Platform

Project Link: https://quiz-system-nu-five.vercel.app/
( Admin password is: Kat123 )

> **Web Technologies Lab – PBL Mini Project**  
> Department of Computer Science and Engineering  
> Bharati Vidyapeeth's College of Engineering, New Delhi  
> Faculty: Mr. Mohit Tiwari

---

## 🎯 Project Overview

QuizHub is a full-stack web application for topic-wise quizzes with a real-time countdown timer, instant scoring, detailed answer review, and a competitive leaderboard.

**Live Features:**
- 5 topics: HTML, CSS, JavaScript, Databases, Networking
- 10 questions per topic (50 total)
- 30-second countdown timer per question
- Instant feedback with explanations
- Leaderboard with podium display
- Admin panel: add/delete questions, view all scores

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3 (Flexbox + Grid), Vanilla JavaScript |
| Backend  | Node.js v18+, Express.js 4.x |
| Storage  | JSON file-based (leaderboard, questions) |
| Fonts    | Google Fonts (Syne + DM Sans) |
| HTTP     | REST API (GET/POST/DELETE) |

---

## 📂 Project Structure

```
quiz-platform/
├── frontend/
│   ├── index.html              # Landing page
│   ├── css/
│   │   └── style.css           # Complete design system
│   ├── js/
│   │   └── main.js             # Shared utilities
│   └── pages/
│       ├── quiz-list.html      # Browse all quizzes
│       ├── quiz.html           # Quiz engine (timer + options)
│       ├── results.html        # Score + answer review
│       ├── leaderboard.html    # Rankings with podium
│       └── admin.html          # Admin: manage questions & scores
├── backend/
│   ├── server.js               # Express REST API
│   └── data/
│       ├── quizzes.json        # Quiz metadata
│       ├── questions_html.json
│       ├── questions_css.json
│       ├── questions_javascript.json
│       ├── questions_databases.json
│       ├── questions_networking.json
│       └── leaderboard.json    # Auto-created on first run
├── package.json
└── README.md
```

---

## 🚀 Setup & Run

### Prerequisites
- Node.js v18 or higher: https://nodejs.org

### Steps

```bash
# 1. Clone or extract the project
cd quiz-platform

# 2. Install dependencies
npm install

# 3. Start the server
npm start

# 4. Open in browser
# http://localhost:3000
```

For development with auto-restart:
```bash
npm run dev
```
To access Admin system :
* Create an env file
* Write your password in it.
---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/quizzes` | List all quizzes (metadata) |
| GET | `/api/quizzes/:id` | Get single quiz details |
| GET | `/api/quizzes/:id/questions` | Get questions (shuffled) |
| GET | `/api/leaderboard` | Get all scores (sorted) |
| POST | `/api/leaderboard` | Submit a new score |
| DELETE | `/api/leaderboard/:id` | Delete one entry |
| DELETE | `/api/leaderboard/clear` | Clear all entries |
| GET | `/api/admin/questions` | Get all questions (admin) |
| POST | `/api/admin/questions` | Add a new question |
| DELETE | `/api/admin/questions/:quizId/:id` | Delete a question |

---

## 🗃️ Data Design

### Quiz Object
```json
{
  "id": "javascript",
  "title": "JavaScript Deep Dive",
  "difficulty": "hard",
  "timePerQuestion": 30,
  "category": "javascript",
  "description": "..."
}
```

### Question Object
```json
{
  "id": "j1",
  "question": "What does typeof null return?",
  "options": ["\"null\"", "\"object\"", "\"undefined\"", "\"boolean\""],
  "correctIndex": 1,
  "explanation": "This is a famous JavaScript bug..."
}
```

### Leaderboard Entry
```json
{
  "id": "uuid-v4",
  "name": "Aarav Singh",
  "quizId": "javascript",
  "quizTitle": "JavaScript Deep Dive",
  "correct": 8,
  "total": 10,
  "percentage": 80,
  "timestamp": 1712345678000
}
```

---

## 📱 Pages

| Page | URL | Description |
|------|-----|-------------|
| Home | `/` | Landing page with topic overview |
| Quiz List | `/pages/quiz-list.html` | Browse & filter all quizzes |
| Quiz | `/pages/quiz.html?id=html` | Take a quiz (any topic) |
| Results | `/pages/results.html` | Score + full review |
| Leaderboard | `/pages/leaderboard.html` | Rankings |
| Admin | `/pages/admin.html` | Manage questions & data |

---

## ✅ Features Checklist

- [x] Responsive design (mobile + desktop) using Flexbox & Grid
- [x] Real-time countdown timer (per question)
- [x] Timer turns red in last 10 seconds
- [x] Auto-submits when timer hits 0
- [x] Color-coded answer feedback (green/red)
- [x] Explanations for every question
- [x] Score saved to leaderboard (POST API)
- [x] Leaderboard with podium (Top 3)
- [x] Filter leaderboard by topic
- [x] Admin panel: add/delete questions
- [x] Admin panel: view/delete scores
- [x] Best score shown on quiz list (localStorage)
- [x] Input validation (name required to start)
- [x] Quit confirmation modal
- [x] CSS animations (slide-in questions)

---

## 🔮 Future Enhancements

1. **User Authentication** – JWT login/register, personal dashboards
2. **MySQL Database** – Replace JSON files with proper relational DB
3. **Question Timer Variations** – Different time per difficulty
4. **Multiplayer Mode** – Socket.io for real-time head-to-head quizzes
5. **AI Question Generator** – GPT API to auto-generate new questions
6. **Performance Analytics** – Charts showing weak topics per user
7. **Dark/Light Mode Toggle**
8. **Export Results as PDF**

---

## 👥 Team

| Member   | Roll No.    |
|----------|-------------|
| Kartikey | 08811502723 |
| Uneeb    | 09111502723 |

---

## 📄 License

Free for academic use.
