/*====================================================
    SpeakUp AI - Practice Studio
    Demo Analysis Version
====================================================*/

document.addEventListener("DOMContentLoaded", () => {

    /*=========================================
        DOM ELEMENTS
    =========================================*/

    const camera = document.getElementById("camera");
    const cameraPlaceholder = document.getElementById("cameraPlaceholder");

    const startBtn = document.getElementById("startRecording");
    const stopBtn = document.getElementById("stopRecording");
    const replayBtn = document.getElementById("replayRecording");
    const downloadBtn = document.getElementById("downloadRecording");

    const uploadInput = document.getElementById("videoUpload");

    const timer = document.getElementById("timer");
    const recordStatus = document.getElementById("recordStatus");

    const generatePromptBtn = document.getElementById("generatePrompt");
    const generatedPromptText = document.getElementById(
        "generatedPromptText"
    );

    const analyzeBtn = document.querySelector(".analyze-btn");

    /*=========================================
        FEEDBACK ELEMENTS
    =========================================*/

    const overallScoreElement =
        document.getElementById("overallScore");

    const eyeContactScoreElement =
        document.getElementById("eyeContactScore");

    const confidenceScoreElement =
        document.getElementById("confidenceScore");

    const voiceClarityScoreElement =
        document.getElementById("voiceClarityScore");

    const speakingPaceScoreElement =
        document.getElementById("speakingPaceScore");

    const bodyLanguageScoreElement =
        document.getElementById("bodyLanguageScore");

    const organizationScoreElement =
        document.getElementById("organizationScore");

    const suggestionsElement =
        document.getElementById("suggestions");

    /*=========================================
        VARIABLES
    =========================================*/

    let mediaStream = null;
    let mediaRecorder = null;

    let recordedChunks = [];
    let recordedBlob = null;
    let uploadedVideo = null;

    let recording = false;

    let timerInterval = null;
    let elapsedSeconds = 0;
    let currentVideoURL = null;

    /*=========================================
        TIMER
    =========================================*/

    function updateTimer() {

        if (!timer) return;

        const minutes = String(
            Math.floor(elapsedSeconds / 60)
        ).padStart(2, "0");

        const seconds = String(
            elapsedSeconds % 60
        ).padStart(2, "0");

        timer.textContent = `${minutes}:${seconds}`;
    }

    function startTimer() {

        elapsedSeconds = 0;
        updateTimer();

        clearInterval(timerInterval);

        timerInterval = setInterval(() => {

            elapsedSeconds++;
            updateTimer();

        }, 1000);
    }

    function stopTimer() {

        clearInterval(timerInterval);
        timerInterval = null;
    }

    /*=========================================
        CAMERA
    =========================================*/

    async function startCamera() {

        try {

            stopCamera();

            mediaStream =
                await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true
                });

            if (camera) {

                clearCurrentVideoURL();

                camera.removeAttribute("src");
                camera.srcObject = mediaStream;
                camera.controls = false;
                camera.muted = true;

                await camera.play();
            }

            if (cameraPlaceholder) {
                cameraPlaceholder.style.display = "none";
            }

            return true;

        } catch (error) {

            console.error("Camera error:", error);

            alert(
                "Unable to access your camera or microphone."
            );

            return false;
        }
    }

    function stopCamera() {

        if (mediaStream) {

            mediaStream
                .getTracks()
                .forEach((track) => track.stop());

            mediaStream = null;
        }

        if (camera && camera.srcObject) {

            camera.pause();
            camera.srcObject = null;
        }
    }

    function clearCurrentVideoURL() {

        if (currentVideoURL) {

            URL.revokeObjectURL(currentVideoURL);
            currentVideoURL = null;
        }
    }

    /*=========================================
        START RECORDING
    =========================================*/

    async function startRecording() {

        if (recording) return;

        if (!window.MediaRecorder) {

            alert(
                "MediaRecorder is not supported in this browser."
            );

            return;
        }

        const cameraStarted = await startCamera();

        if (!cameraStarted) return;

        recordedChunks = [];
        recordedBlob = null;
        uploadedVideo = null;

        try {

            mediaRecorder = new MediaRecorder(mediaStream);

        } catch (error) {

            console.error("Recorder error:", error);

            alert("The recording could not be started.");

            return;
        }

        mediaRecorder.ondataavailable = (event) => {

            if (event.data && event.data.size > 0) {
                recordedChunks.push(event.data);
            }
        };

        mediaRecorder.onstop = () => {

            recordedBlob = new Blob(
                recordedChunks,
                {
                    type: mediaRecorder.mimeType ||
                        "video/webm"
                }
            );

            console.log("Recording finished.");
        };

        mediaRecorder.start();

        recording = true;
        startTimer();

        if (startBtn) startBtn.disabled = true;
        if (stopBtn) stopBtn.disabled = false;
        if (replayBtn) replayBtn.disabled = true;
        if (downloadBtn) downloadBtn.disabled = true;

        if (recordStatus) {

            recordStatus.innerHTML = `
                <span class="record-dot"></span>
                Recording
            `;
        }
    }

    /*=========================================
        STOP RECORDING
    =========================================*/

    function stopRecording() {

        if (!recording || !mediaRecorder) return;

        if (mediaRecorder.state !== "inactive") {
            mediaRecorder.stop();
        }

        stopTimer();
        stopCamera();

        recording = false;

        if (startBtn) startBtn.disabled = false;
        if (stopBtn) stopBtn.disabled = true;
        if (replayBtn) replayBtn.disabled = false;
        if (downloadBtn) downloadBtn.disabled = false;

        if (recordStatus) {

            recordStatus.innerHTML = `
                <span class="record-dot"></span>
                Recording Complete
            `;
        }
    }

    /*=========================================
        REPLAY RECORDING
    =========================================*/

    function replayRecording() {

        if (!recordedBlob) {

            alert("No recording is available.");
            return;
        }

        stopCamera();
        clearCurrentVideoURL();

        currentVideoURL =
            URL.createObjectURL(recordedBlob);

        if (camera) {

            camera.srcObject = null;
            camera.src = currentVideoURL;
            camera.controls = true;
            camera.muted = false;

            camera.play().catch((error) => {
                console.error("Playback error:", error);
            });
        }
    }

    /*=========================================
        DOWNLOAD RECORDING
    =========================================*/

    function downloadRecording() {

        if (!recordedBlob) {

            alert("No recording is available.");
            return;
        }

        const downloadURL =
            URL.createObjectURL(recordedBlob);

        const link = document.createElement("a");

        link.href = downloadURL;
        link.download = "SpeakUpAI-Speech.webm";

        document.body.appendChild(link);
        link.click();
        link.remove();

        setTimeout(() => {
            URL.revokeObjectURL(downloadURL);
        }, 1000);
    }

    /*=========================================
        VIDEO UPLOAD
    =========================================*/

    function handleVideoUpload(event) {

        const file = event.target.files[0];

        if (!file) return;

        if (!file.type.startsWith("video/")) {

            alert("Please upload a valid video file.");

            uploadInput.value = "";
            return;
        }

        uploadedVideo = file;
        recordedBlob = null;

        stopCamera();
        clearCurrentVideoURL();

        currentVideoURL =
            URL.createObjectURL(uploadedVideo);

        if (camera) {

            camera.srcObject = null;
            camera.src = currentVideoURL;
            camera.controls = true;
            camera.muted = false;

            camera.play().catch(() => {
                // Browser may require the user to press Play.
            });
        }

        if (cameraPlaceholder) {
            cameraPlaceholder.style.display = "none";
        }

        if (recordStatus) {

            recordStatus.innerHTML = `
                <span class="record-dot"></span>
                Uploaded Video Ready
            `;
        }
    }

    /*=========================================
        SPEECH PROMPTS
    =========================================*/

    const prompts = [
        "Describe a challenge that completely changed your perspective on life.",
        "Should artificial intelligence replace traditional classrooms?",
        "Explain why communication is one of the most important life skills.",
        "If you could solve one world problem, what would it be?",
        "What makes a great leader?",
        "How will technology change public speaking over the next 20 years?",
        "Why do people fear public speaking?",
        "Describe someone who inspires you and explain why.",
        "Should social media have age restrictions?",
        "What does success mean to you?"
    ];

    function generatePrompt() {

        const randomIndex =
            Math.floor(Math.random() * prompts.length);

        const selectedPrompt = prompts[randomIndex];

        if (generatedPromptText) {
            generatedPromptText.innerHTML =
                `<p>${selectedPrompt}</p>`;
        }
    }

    /*=========================================
        DEMO SCORE GENERATOR
    =========================================*/

    function generateRandomScore() {

        // Generates an integer from 70 through 100.
        return Math.floor(Math.random() * 31) + 70;
    }

    function setScore(element, score, overall = false) {

        if (!element) return;

        element.textContent = overall
            ? `${score}/100`
            : `${score}%`;
    }

    /*=========================================
        PRELOADED SUGGESTIONS
    =========================================*/

    const feedbackSuggestions = {

        eyeContact: [
            "Try looking toward the screen or camera more often to create stronger eye contact.",
            "Avoid looking down for long periods. Keep your eyes directed toward your audience."
        ],

        confidence: [
            "Speak with a stronger voice and avoid hesitating between your main points.",
            "Try maintaining a more confident posture and commit fully to each statement."
        ],

        voiceClarity: [
            "Slow down slightly and pronounce each word more clearly.",
            "Project your voice more and avoid allowing sentences to fade at the end."
        ],

        speakingPace: [
            "Use a steadier speaking pace and pause briefly after important ideas.",
            "Avoid rushing through your points. Give your audience time to understand them."
        ],

        bodyLanguage: [
            "Use purposeful hand gestures and avoid unnecessary movement.",
            "Keep an open posture and face the audience throughout your speech."
        ],

        organization: [
            "Improve your speech organization by using a clear introduction, main points, and conclusion.",
            "Use transition words such as first, next, and finally to connect your ideas."
        ]
    };

    function createSuggestion(scores) {

        const categories = [
            {
                key: "eyeContact",
                score: scores.eyeContact
            },
            {
                key: "confidence",
                score: scores.confidence
            },
            {
                key: "voiceClarity",
                score: scores.voiceClarity
            },
            {
                key: "speakingPace",
                score: scores.speakingPace
            },
            {
                key: "bodyLanguage",
                score: scores.bodyLanguage
            },
            {
                key: "organization",
                score: scores.organization
            }
        ];

        categories.sort(
            (first, second) =>
                first.score - second.score
        );

        const lowestCategory = categories[0];

        const categorySuggestions =
            feedbackSuggestions[lowestCategory.key];

        const randomSuggestion =
            categorySuggestions[
                Math.floor(
                    Math.random() *
                    categorySuggestions.length
                )
            ];

        if (lowestCategory.score >= 94) {

            return "Excellent performance. Your speech was confident, clear, engaging, and well organized.";
        }

        return randomSuggestion;
    }

    /*=========================================
        ANALYZE BUTTON - DEMO VERSION
    =========================================*/

    async function analyzeSpeech(event) {

        event.preventDefault();

        if (!recordedBlob && !uploadedVideo) {

            alert("Please record or upload a speech first.");
            return;
        }

        if (!analyzeBtn) return;

        analyzeBtn.disabled = true;

        analyzeBtn.innerHTML = `
            <i class="fa-solid fa-spinner fa-spin"></i>
            Analyzing Speech...
        `;

        if (recordStatus) {

            recordStatus.innerHTML = `
                <span class="record-dot"></span>
                AI Analysis in Progress
            `;
        }

        try {

            // Simulated analysis time.
            await new Promise((resolve) => {
                setTimeout(resolve, 2500);
            });

            const scores = {

                eyeContact: generateRandomScore(),

                confidence: generateRandomScore(),

                voiceClarity: generateRandomScore(),

                speakingPace: generateRandomScore(),

                bodyLanguage: generateRandomScore(),

                organization: generateRandomScore()
            };

            const overallScore = Math.round(
                (
                    scores.eyeContact +
                    scores.confidence +
                    scores.voiceClarity +
                    scores.speakingPace +
                    scores.bodyLanguage +
                    scores.organization
                ) / 6
            );

            const suggestion =
                createSuggestion(scores);

            setScore(
                overallScoreElement,
                overallScore,
                true
            );

            setScore(
                eyeContactScoreElement,
                scores.eyeContact
            );

            setScore(
                confidenceScoreElement,
                scores.confidence
            );

            setScore(
                voiceClarityScoreElement,
                scores.voiceClarity
            );

            setScore(
                speakingPaceScoreElement,
                scores.speakingPace
            );

            setScore(
                bodyLanguageScoreElement,
                scores.bodyLanguage
            );

            setScore(
                organizationScoreElement,
                scores.organization
            );

            if (suggestionsElement) {
                suggestionsElement.textContent =
                    suggestion;
            }

            const result = {

                success: true,

                overall_score: overallScore,

                eye_contact: scores.eyeContact,

                confidence: scores.confidence,

                voice_clarity: scores.voiceClarity,

                speaking_pace: scores.speakingPace,

                body_language: scores.bodyLanguage,

                organization: scores.organization,

                suggestion: suggestion,

                created_at: new Date().toISOString()
            };

            localStorage.setItem(
                "latestSpeechAnalysis",
                JSON.stringify(result)
            );

            analyzeBtn.innerHTML = `
                <i class="fa-solid fa-check"></i>
                Analysis Complete
            `;

            if (recordStatus) {

                recordStatus.innerHTML = `
                    <span class="record-dot"></span>
                    Analysis Complete
                `;
            }

            console.log(
                "Demo analysis result:",
                result
            );

        } catch (error) {

            console.error(
                "Demo analysis error:",
                error
            );

            alert(
                "The analysis could not be completed."
            );

            analyzeBtn.innerHTML = `
                <i class="fa-solid fa-triangle-exclamation"></i>
                Try Again
            `;

        } finally {

            setTimeout(() => {

                analyzeBtn.disabled = false;

                analyzeBtn.innerHTML = `
                    <i class="fa-solid fa-chart-line"></i>
                    Analyze My Speech
                `;

            }, 1800);
        }
    }

    /*=========================================
        BUTTON EVENTS
    =========================================*/

    if (startBtn) {
        startBtn.addEventListener(
            "click",
            startRecording
        );
    }

    if (stopBtn) {
        stopBtn.addEventListener(
            "click",
            stopRecording
        );
    }

    if (replayBtn) {
        replayBtn.addEventListener(
            "click",
            replayRecording
        );
    }

    if (downloadBtn) {
        downloadBtn.addEventListener(
            "click",
            downloadRecording
        );
    }

    if (uploadInput) {
        uploadInput.addEventListener(
            "change",
            handleVideoUpload
        );
    }

    if (generatePromptBtn) {
        generatePromptBtn.addEventListener(
            "click",
            generatePrompt
        );
    }

    if (analyzeBtn) {
        analyzeBtn.addEventListener(
            "click",
            analyzeSpeech
        );
    }

    /*=========================================
        INITIAL BUTTON STATE
    =========================================*/

    if (stopBtn) stopBtn.disabled = true;
    if (replayBtn) replayBtn.disabled = true;
    if (downloadBtn) downloadBtn.disabled = true;

    updateTimer();

    /*=========================================
        KEYBOARD SHORTCUT
        SPACE = START / STOP
    =========================================*/

    document.addEventListener("keydown", (event) => {

        const tagName =
            event.target.tagName.toUpperCase();

        const typing =
            tagName === "INPUT" ||
            tagName === "TEXTAREA" ||
            tagName === "SELECT" ||
            event.target.isContentEditable;

        if (
            event.code === "Space" &&
            !typing
        ) {

            event.preventDefault();

            if (recording) {
                stopRecording();
            } else {
                startRecording();
            }
        }
    });

    /*=========================================
        CLEANUP
    =========================================*/

    window.addEventListener("beforeunload", () => {

        stopTimer();
        stopCamera();
        clearCurrentVideoURL();
    });
});