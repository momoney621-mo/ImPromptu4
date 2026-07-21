# ImPromptU

An AI-powered speech coaching platform that helps students improve their public speaking through personalized AI feedback.

## Problem

Students often struggle with public speaking but lack access to affordable coaching and meaningful feedback outside the classroom.

## Solution

ImPromptU allows users to practice speeches, receive AI-generated analysis, and track their improvement over time.

## Features

Core functionality available in the platform.

- **Speech Recording** – Record speeches directly in the browser.
- **Video Upload** – Upload existing speech recordings for analysis.
- **AI Analysis** – Receive detailed feedback on speaking performance.
- **Eye Contact** – Estimates audience engagement through computer vision.
- **Confidence** – Evaluates speaking confidence using speech characteristics.
- **Voice Clarity** – Measures vocal consistency and clarity.
- **Speaking Pace** – Calculates speaking speed and pacing.
- **Body Language** – Analyzes posture and body movement.
- **Organization** – Detects speech structure and transitions.
- **Portfolio** – Save previous speeches and review past results.
- **Progress Dashboard** – Track improvement using statistics and charts.
- **Community** – Watch speeches from other speakers for inspiration.
- **Prompt Generator** – Generate impromptu speaking prompts.

## Tech Stack

Technologies used to build the application.

### Frontend

Creates the user interface.

- HTML5
- CSS3
- JavaScript (ES6)

### Backend

Handles requests and AI processing.

- Python
- Flask

### AI & Computer Vision

Processes speech and video data.

- OpenAI Whisper
- OpenCV
- MediaPipe Tasks API
- NumPy

### Deployment

Hosts and manages the project online.

- GitHub
- Vercel

## Project Structure

Organizes the frontend and backend into separate components.

```text
Backend/
    app.py
    uploads/
    ai/
        analyzer.py
        eye_contact.py
        confidence.py
        body_language.py
        voice_clarity.py
        speaking_pace.py
        organization.py

Frontend/
    assets/
    css files(Design)/
    html-files/
    js files (Functionality)/
    public/
    vercel.json
```

## Installation

Set up the project locally.

```bash
git clone https://github.com/momoney621-mo/ImPromptu4.git
cd ImPromptu4
```

Create a virtual environment.

```bash
python -m venv .venv
```

Activate it.

```bash
.venv\Scripts\activate
```

Install the required packages.

```bash
pip install -r requirements.txt
```

Start the Flask backend.

```bash
python app.py
```

Open the frontend using:

```text
Frontend/html-files/index.html
```

or deploy using Vercel.

## Usage

How to use the application.

1. Open ImPromptU.
2. Record or upload a speech.
3. Analyze the speech.
4. Review AI feedback.
5. Save the results.
6. Track your progress.

## Screenshots

Images of the main pages.

- Home Page
- Practice Page
- AI Analysis
- Portfolio
- Community
- Progress Dashboard

## Future Improvements

Planned features for future versions.

- Live speech coaching
- Better eye contact detection
- Facial expression analysis
- Real-time AI feedback
- Mobile application
- Coach dashboard
- Debate mode

## Team

Project contributors.

**Mohnish**

- Frontend Development
- Backend Development
- AI Integration
- UI/UX Design
- Deployment

## License

Created for educational and hackathon purposes.
