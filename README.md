# PathPilot 🧭
> **"Turn your goal into a path. Turn your path into progress."**

An interactive learning and career-roadmap web application built specifically for beginners who know what they want to become, but don't know what to learn first, what skills they are missing, what practical projects to build, or what to do next.

Submitted to the Devpost Hackathon: **Beginner's Paradise – FirstCommit**  
**Developer:** [Touseef Ahmad](https://github.com/touseef-ahmad262) (Age 19)  
**GitHub Profile:** [https://github.com/touseef-ahmad262](https://github.com/touseef-ahmad262)

---

## 🌟 The Problem: Tutorial Hell & Direction Overload
Beginners aspiring to enter tech face a universal dilemma:
1. **Direction Overload:** Endless video tutorials and bootcamp catalogs leave learners unsure where to start.
2. **Missing Prerequisite Visibility:** Learners jump into complex frameworks like React or PyTorch before mastering core fundamentals (HTML, CSS, vanilla JavaScript, basic logic).
3. **Passive Consumption:** Watching tutorials creates an illusion of competence, but learners struggle to build practical projects independently.
4. **No Transparent Skill Metrics:** Traditional roadmaps are static checklists that don't quantify where a student's actual gaps lie.

## 💡 The Solution: PathPilot
PathPilot replaces generic, static roadmaps with an interactive, personalized progression system:
- **Personalized Onboarding:** Takes the learner's goal, existing experience, current skills, available hours/week, and target timeframe.
- **Signature Feature — Skill Gap Analyzer:** Computes real percentage proficiencies (e.g. *HTML 100%, CSS 70%, JavaScript 35%, Git 25%, Projects 20%*), highlights the primary bottleneck, and explains why it matters.
- **Interactive Phased Roadmap:** Structured into progressive stages with curated learning tasks, time estimates, verification challenges, and mini-projects.
- **Practical Mission System:** Hands-on missions (responsive landing page, weather dashboard, GitHub profile finder, etc.) complete with instructions and deliverables.
- **Gamified Momentum:** Live XP, Level advancement, daily streak tracking, and 6 unlockable achievement badges.
- **AI Roadmap Coach:** Context-aware mentor powered by Gemini 3.8 Flash through a secure server-side proxy with intelligent offline fallback.
- **One-Click Demo Mode:** Instant sample profile loading for hackathon judges to test without typing.

---

## 🎯 Alignment with Devpost Judging Criteria

| Judging Area | Weight | How PathPilot Delivers |
| :--- | :---: | :--- |
| **Learning & Growth** | **30%** | Built by a 19-year-old self-taught developer to solve real beginner struggles. Bridges theoretical knowledge and real code with verification challenges and milestone checklists. |
| **Creativity & Impact** | **25%** | Replaces static diagrams with a dynamic **Skill Gap Analyzer** and practical **Mission System** that directly combats tutorial hell. |
| **Technical Execution** | **25%** | Production-ready full-stack architecture (React 18, TypeScript, Tailwind CSS, Express backend). Server-side Gemini API proxy, resilient localStorage engine, zero browser credential leaks, and smart heuristic fallback. |
| **Presentation & Communication** | **20%** | Refined custom typography, dark luxury palette, high WCAG contrast, instant demo mode for judges, and thorough documentation. |

---

## 🚀 Key Features

### 1. Multi-Step Onboarding Flow
- **Goal Presets:** Web Developer, UI/UX Designer, Data Analyst, AI Developer, Mobile Developer, or Custom Goals.
- **Experience Calibration:** Complete Beginner, Some Basics, or Intermediate Foundation.
- **Skill Inventory:** Interactive tag selection and custom skill inputs.
- **Commitment Slider:** 4 to 35 hours per week and 3, 6, or 12-month pacing options.

### 2. Signature Feature: Skill Gap Analyzer
- Evaluates skills across **Foundational**, **Core**, **Workflow**, and **Practical** categories.
- Computes exact percentage levels against benchmark requirements.
- Automatically isolates the **Primary Skill Gap** (e.g., *JavaScript at 35% with a 45% gap remaining*).
- Explains why the gap exists and generates a dynamic "Recommended Next Action".
- *Grounding Disclaimer:* Strictly focuses on learning progression and project mastery without unsubstantiated employment claims.

### 3. Interactive Roadmap Stages
- Accordion stages with visual phase numbers and progress meters.
- Core learning tasks with estimated completion times (in minutes) and resource links.
- Interactive checkboxes that award XP (+30 XP) and update skill scores live.
- **Stage Practical Challenge** with criteria checklists (+75 XP).
- **Stage Mini-Project** with defined portfolio deliverables (+150 XP).

### 4. Practical Mission System
- Portfolio-grade projects with difficulty ratings (Beginner, Intermediate, Advanced) and estimated hours.
- Examples include:
  - *Build a Responsive Product Landing Page* (HTML, CSS, Flexbox)
  - *Dynamic Weather Dashboard* (JavaScript, Fetch API, Async/Await)
  - *Interactive GitHub Profile Finder* (REST APIs, DOM, Error Handling)
  - *Comprehensive Form Validator* (Regex, Client State, UX Feedback)
  - *Personal Developer Portfolio & Showcase* (Semantic HTML, Responsive Grid)
- Interactive mission brief with step-by-step implementation instructions and checklist.

### 5. Progress Dashboard
- Command center tracking target completion pace, overall roadmap progress %, current level & XP threshold, 7-day streak visualizer, active stage snapshot, and top skill gaps preview.

### 6. AI Roadmap Coach (Gemini 3.8 Flash)
- Grounded in the user's active goal, current stage, primary skill gap, and available hours.
- One-click prompt chips:
  - *"What should I learn next?"*
  - *"Why is this my biggest skill gap?"*
  - *"Give me a beginner practice challenge."*
  - *"Explain this concept simply."*
- Fully functional in both live Gemini mode and offline smart heuristic mode.

---

## 🛠️ Architecture & Tech Stack

```
┌─────────────────────────────────────────────────────────┐
│                    PathPilot Client                     │
│  (React 18 + TypeScript + Tailwind CSS + Lucide Icons)  │
└────────────────────────────┬────────────────────────────┘
                             │
                  HTTP / REST API Calls
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│                 Express Backend Server                  │
│                     (Node.js / tsx)                     │
├─────────────────────────────────────────────────────────┤
│  • /api/health    -> Health check & API key detection   │
│  • /api/coach     -> Server-side proxy for Gemini SDK   │
│  • Fallback Engine-> Smart offline heuristic generator  │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│           Google GenAI SDK (gemini-3.8-flash)           │
│         (Keys never exposed to client bundles)          │
└─────────────────────────────────────────────────────────┘
```

---

## 💻 Local Development

### Prerequisites
- Node.js (v18 or higher)
- npm

### Installation
```bash
# Clone the repository
git clone https://github.com/touseef-ahmad262/pathpilot.git
cd pathpilot

# Install dependencies
npm install

# (Optional) Set up Gemini API key in .env
echo "GEMINI_API_KEY=your_key_here" > .env

# Run the development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## 👨‍💻 About the Developer
- **Name:** Touseef Ahmad
- **Age:** 19
- **GitHub:** [https://github.com/touseef-ahmad262](https://github.com/touseef-ahmad262)
- Built with passion for the **Beginner's Paradise – FirstCommit** Hackathon.
