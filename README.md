# 🎤 ImPromptU

> **Practice. Analyze. Improve.**
>
> An AI-powered public speaking platform that helps students become confident communicators through instant speech analysis and personalized feedback.

---

# 📖 Table of Contents

- Project Overview
- Problem Statement
- Solution Overview
- Features
- Technology Stack
- System Architecture
- Installation
- Usage Guide
- AI Usage
- Screenshots
- Future Scope
- Challenges
- What We Learned
- Team Members
- License

---

# 🚀 Project Overview

Public speaking is one of the most valuable professional and academic skills, yet most students rarely receive meaningful practice or personalized feedback outside of competitions or classrooms.

ImPromptU is an AI-powered speech coaching platform that allows users to practice speeches anytime and receive instant feedback across multiple speaking dimensions.

Instead of waiting for a coach or teacher, users receive immediate insights into their presentation, helping them improve faster and build confidence through consistent practice.

---

# ❗ Problem Statement

Millions of students struggle with:

- Public speaking anxiety
- Lack of practice opportunities
- Limited access to coaches
- Subjective human feedback
- No way to consistently measure improvement

Speech coaching is often expensive, inaccessible, or unavailable outside of school programs.

Students need an affordable, intelligent, and accessible coaching solution.

---

# 💡 Solution Overview

ImPromptU provides an AI-powered speech analysis platform that evaluates a user's presentation after they upload or record a speech.

The platform analyzes multiple aspects of speaking including:

- Eye Contact
- Confidence
- Voice Clarity
- Speaking Pace
- Body Language
- Organization

Users receive detailed scores, personalized feedback, and can track their progress over time.

The platform also includes a growing community section where users can watch excellent speeches for inspiration.

---

# ⭐ Features

## 🎙 AI Speech Analysis

Upload or record speeches directly in the browser.

Receive an overall score plus category scores.

---

## 👀 Eye Contact Analysis

Analyzes how consistently the speaker maintains eye contact throughout the presentation.

---

## 🗣 Voice Clarity

Evaluates speech quality and clarity using speech-processing techniques.

---

## 🚶 Body Language

Estimates posture and movement using computer vision techniques.

---

## ⚡ Speaking Pace

Measures speaking speed to identify whether the user is speaking too fast or too slowly.

---

## 🧠 Organization Analysis

Detects structural cues within speeches such as:

- Introduction
- Roadmap
- Main points
- Conclusion
- Transition words

---

## 📊 Progress Dashboard

Track improvement over time.

View historical scores.

Monitor strengths and weaknesses.

---

## 🎥 Portfolio

Save speeches and review previous performances.

---

## 🌎 Community

Browse example speeches and learn from other speakers.

---

## 🎨 Modern User Interface

Responsive design with:

- Animated homepage
- Interactive 3D microphone
- Modern dashboard
- Clean UI

---

# 🛠 Technology Stack

## Frontend

- HTML5
- CSS3
- JavaScript
- Three.js

## Backend

- Python
- Flask

## AI / Machine Learning

- OpenAI Whisper
- OpenCV
- MediaPipe
- NumPy

## Deployment

- GitHub
- Vercel

---

# 🏗 System Architecture

User

↓

Frontend (HTML/CSS/JavaScript)

↓

Flask Backend

↓

AI Analysis Modules

↓

JSON Results

↓

Dashboard & Score Visualization

---

# ⚙ Installation

## Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/ImPromptU.git
```

```
cd ImPromptU
```

---

## Backend

Navigate into the backend folder.

```bash
cd Backend
```

Create a virtual environment.

```bash
python -m venv venv
```

Activate it.

Windows

```bash
venv\Scripts\activate
```

Mac/Linux

```bash
source venv/bin/activate
```

Install dependencies.

```bash
pip install -r requirements.txt
```

Run Flask.

```bash
python app.py
```

---

## Frontend

Open another terminal.

Navigate to:

```bash
cd Frontend
```

Run a local server.

Python

```bash
python -m http.server 8000
```

or

Use VS Code Live Server.

Open

```
http://localhost:8000/html-files/index.html
```

---

# 🌐 Deployment

Frontend is deployed using Vercel.

The backend currently runs locally through Flask.

Future versions will deploy the backend using cloud infrastructure for a fully online experience.

---

# 📚 Usage Guide

1. Open the homepage.
2. Click **Start Practicing**.
3. Record or upload a speech.
4. Submit for AI analysis.
5. Receive detailed scores.
6. Review personalized feedback.
7. Save the speech to your portfolio.
8. Track long-term progress.

---

# 🤖 AI Usage

Artificial Intelligence was used responsibly throughout the development process.

AI assisted with:

- brainstorming ideas
- debugging errors
- explaining programming concepts
- improving code structure
- generating boilerplate code
- documentation

All AI-generated code was reviewed, modified, integrated, and tested by our team before being included in the project.

The overall application architecture, feature design, debugging process, user interface decisions, integration, testing, and project implementation were completed by the team.

AI served as a development assistant rather than a replacement for engineering work.

---

# 📸 Screenshots

Include screenshots here.

Examples:

- Homepage
- Practice Page
- AI Analysis Dashboard
- Portfolio
- Community
- Progress Dashboard

---

# 🔮 Future Scope

Future improvements include:

- Live speech coaching
- Real-time webcam feedback
- AI-generated practice prompts
- Multi-language support
- Debate mode
- Coach accounts
- Mobile application
- Cloud database
- User authentication
- Advanced speech analytics
- Personalized improvement plans
- AI-generated practice schedules

---

# 🚧 Challenges

Some challenges included:

- Integrating multiple AI models
- Processing uploaded videos efficiently
- Computer vision for body language analysis
- Speech transcription
- Connecting frontend and backend
- Deploying a static frontend alongside a Python backend

---

# 📖 What We Learned

Through this project we gained experience with:

- Full-stack web development
- Flask APIs
- Computer Vision
- Speech Processing
- AI integration
- Git & GitHub
- Vercel deployment
- Software architecture
- Debugging large projects
- Collaborative software engineering

---

# 👥 Team Members

- Soumya Balaji

(Add additional teammates here.)

---

# 📄 License

This project was created for educational and hackathon purposes.

MIT License (recommended)

```
Copyright (c) 2026

Permission is hereby granted, free of charge, to any person obtaining a copy...
```

---

# ❤️ Thank You

Thank you for taking the time to review **ImPromptU**.

We hope our project demonstrates how AI can make public speaking practice more accessible, engaging, and effective for students everywhere.
