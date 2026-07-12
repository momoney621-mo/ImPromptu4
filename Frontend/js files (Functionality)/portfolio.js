/* ==========================================================
   SPEAKUP AI
   PORTFOLIO.JS
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* ==========================================
       DOM ELEMENTS
    ========================================== */

    const portfolioGrid =
        document.getElementById("portfolioGrid") ||
        document.querySelector(".portfolio-grid");

    const searchInput =
        document.getElementById("speechSearch");

    const filterSelect =
        document.getElementById("portfolioFilter");

    const emptyState =
        document.getElementById("portfolioEmpty");

    const analysisModal =
        document.getElementById("analysisModal");

    const closeAnalysisModal =
        document.getElementById("closeAnalysisModal");

    const modalOverlay =
        analysisModal
            ? analysisModal.querySelector(".analysis-modal-overlay")
            : null;

    const modalSpeechTitle =
        document.getElementById("modalSpeechTitle");

    const modalOverallScore =
        document.getElementById("modalOverallScore");

    const modalEyeContact =
        document.getElementById("modalEyeContact");

    const modalConfidence =
        document.getElementById("modalConfidence");

    const modalVoiceClarity =
        document.getElementById("modalVoiceClarity");

    const modalSpeakingPace =
        document.getElementById("modalSpeakingPace");

    const modalBodyLanguage =
        document.getElementById("modalBodyLanguage");

    const modalOrganization =
        document.getElementById("modalOrganization");

    const modalSuggestion =
        document.getElementById("modalSuggestion");


    /* ==========================================
       SCORE EXPLANATIONS
    ========================================== */

    const adviceLibrary = {

        eyeContact: {
            name: "eye contact",
            advice:
                "Try looking toward the camera or audience more consistently. Avoid looking down for long periods. A useful strategy is to hold eye contact for three to five seconds before naturally moving to another part of the audience."
        },

        confidence: {
            name: "confidence",
            advice:
                "Use a stronger vocal presence and commit fully to each sentence. Reduce filler words, stand tall, and begin each main point with a clear and decisive tone."
        },

        voiceClarity: {
            name: "voice clarity",
            advice:
                "Pronounce important words more carefully and avoid letting your voice fade at the end of sentences. Slow down slightly and project your voice so every idea is easy to understand."
        },

        speakingPace: {
            name: "speaking pace",
            advice:
                "Aim for a steadier rhythm. Pause briefly after major ideas and avoid rushing through transitions. Strategic pauses make your speech sound more confident and give the audience time to process your message."
        },

        bodyLanguage: {
            name: "body language",
            advice:
                "Keep an open posture, face the audience, and use purposeful hand gestures. Avoid repetitive movements or shifting too often, because controlled movement makes your presentation appear more confident."
        },

        organization: {
            name: "organization",
            advice:
                "Use a clearer structure with an introduction, two or three main points, and a conclusion. Transition words such as first, next, however, and finally will make your ideas easier to follow."
        }

    };


    /* ==========================================
       RANDOM SCORE GENERATOR
    ========================================== */

    function generateScore() {

        return Math.floor(
            Math.random() * 31
        ) + 70;
    }


    /* ==========================================
       CREATE ANALYSIS
    ========================================== */

    function createSpeechAnalysis(card) {

        const storedAnalysis =
            card.dataset.analysis
                ? JSON.parse(card.dataset.analysis)
                : null;

        if (storedAnalysis) {
            return storedAnalysis;
        }

        const scores = {

            eyeContact: generateScore(),

            confidence: generateScore(),

            voiceClarity: generateScore(),

            speakingPace: generateScore(),

            bodyLanguage: generateScore(),

            organization: generateScore()

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

        const analysis = {
            scores,
            overallScore,
            suggestion: buildDetailedSuggestion(
                scores,
                overallScore
            )
        };

        card.dataset.analysis =
            JSON.stringify(analysis);

        return analysis;
    }


    /* ==========================================
       DETAILED SUGGESTION
    ========================================== */

    function buildDetailedSuggestion(
        scores,
        overallScore
    ) {

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

        const weakest =
            categories[0];

        const secondWeakest =
            categories[1];

        const strongest =
            [...categories].sort(
                (first, second) =>
                    second.score - first.score
            )[0];

        const weakestAdvice =
            adviceLibrary[weakest.key];

        const secondAdvice =
            adviceLibrary[secondWeakest.key];

        const strongestName =
            adviceLibrary[strongest.key].name;

        let opening = "";

        if (overallScore >= 93) {

            opening =
                "Excellent performance. Your delivery was polished, confident, and highly effective.";

        } else if (overallScore >= 87) {

            opening =
                "This was a strong speech with clear strengths and only a few areas that need refinement.";

        } else if (overallScore >= 80) {

            opening =
                "This was a solid performance. Your message was understandable, but your delivery can become more controlled and engaging.";

        } else {

            opening =
                "You showed a good foundation, but several delivery habits should be strengthened before your next presentation.";

        }

        return (
            `${opening} ` +
            `Your strongest area was ${strongestName}, which helped your speech feel more effective. ` +
            `Your main improvement area is ${weakestAdvice.name}. ` +
            `${weakestAdvice.advice} ` +
            `You should also work on ${secondAdvice.name}. ` +
            `${secondAdvice.advice}`
        );
    }


    /* ==========================================
       OPEN ANALYSIS MODAL
    ========================================== */

    function openAnalysisModal(card) {

        if (!analysisModal) return;

        const titleElement =
            card.querySelector("h3");

        const title =
            titleElement
                ? titleElement.textContent.trim()
                : "Speech Analysis";

        const analysis =
            createSpeechAnalysis(card);

        const scores =
            analysis.scores;

        if (modalSpeechTitle) {
            modalSpeechTitle.textContent = title;
        }

        if (modalOverallScore) {
            modalOverallScore.innerHTML =
                `${analysis.overallScore}<span>/100</span>`;
        }

        if (modalEyeContact) {
            modalEyeContact.textContent =
                `${scores.eyeContact}%`;
        }

        if (modalConfidence) {
            modalConfidence.textContent =
                `${scores.confidence}%`;
        }

        if (modalVoiceClarity) {
            modalVoiceClarity.textContent =
                `${scores.voiceClarity}%`;
        }

        if (modalSpeakingPace) {
            modalSpeakingPace.textContent =
                `${scores.speakingPace}%`;
        }

        if (modalBodyLanguage) {
            modalBodyLanguage.textContent =
                `${scores.bodyLanguage}%`;
        }

        if (modalOrganization) {
            modalOrganization.textContent =
                `${scores.organization}%`;
        }

        if (modalSuggestion) {
            modalSuggestion.textContent =
                analysis.suggestion;
        }

        analysisModal.classList.add("open");

        analysisModal.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.style.overflow = "hidden";
    }


    /* ==========================================
       CLOSE ANALYSIS MODAL
    ========================================== */

    function closeModal() {

        if (!analysisModal) return;

        analysisModal.classList.remove("open");

        analysisModal.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.style.overflow = "";
    }


    /* ==========================================
       PLAY VIDEO
    ========================================== */

    function setupVideoPlayback() {

        document
            .querySelectorAll(".play-overlay")
            .forEach((button) => {

                button.addEventListener(
                    "click",
                    () => {

                        const thumbnail =
                            button.closest(
                                ".speech-thumbnail"
                            );

                        const video =
                            thumbnail
                                ? thumbnail.querySelector(
                                    ".portfolio-video"
                                )
                                : null;

                        if (!video) return;

                        document
                            .querySelectorAll(
                                ".portfolio-video"
                            )
                            .forEach((otherVideo) => {

                                if (
                                    otherVideo !== video
                                ) {

                                    otherVideo.pause();
                                }

                            });

                        if (video.paused) {

                            video.controls = true;

                            video.play();

                            button.innerHTML = `
                                <i class="fa-solid fa-pause"></i>
                            `;

                        } else {

                            video.pause();

                            button.innerHTML = `
                                <i class="fa-solid fa-play"></i>
                            `;
                        }
                    }
                );

            });

        document
            .querySelectorAll(".portfolio-video")
            .forEach((video) => {

                video.addEventListener(
                    "ended",
                    () => {

                        const thumbnail =
                            video.closest(
                                ".speech-thumbnail"
                            );

                        const button =
                            thumbnail
                                ? thumbnail.querySelector(
                                    ".play-overlay"
                                )
                                : null;

                        if (button) {

                            button.innerHTML = `
                                <i class="fa-solid fa-play"></i>
                            `;
                        }
                    }
                );

            });
    }


    /* ==========================================
       ANALYSIS BUTTONS
    ========================================== */

    function setupAnalysisButtons() {

        document
            .querySelectorAll(".analysis-btn")
            .forEach((button) => {

                button.addEventListener(
                    "click",
                    () => {

                        const card =
                            button.closest(
                                ".speech-card"
                            );

                        if (card) {
                            openAnalysisModal(card);
                        }
                    }
                );

            });
    }


    /* ==========================================
       SEARCH AND FILTER
    ========================================== */

    function applySearchAndFilter() {

        const searchValue =
            searchInput
                ? searchInput.value
                    .trim()
                    .toLowerCase()
                : "";

        const filterValue =
            filterSelect
                ? filterSelect.value
                    .trim()
                    .toLowerCase()
                : "all";

        let visibleCount = 0;

        document
            .querySelectorAll(".speech-card")
            .forEach((card) => {

                const title =
                    card.dataset.title
                        ? card.dataset.title.toLowerCase()
                        : card
                            .querySelector("h3")
                            .textContent
                            .toLowerCase();

                const type =
                    card.dataset.type
                        ? card.dataset.type.toLowerCase()
                        : "";

                const visibility =
                    card.dataset.visibility
                        ? card.dataset.visibility.toLowerCase()
                        : "";

                const matchesSearch =
                    title.includes(searchValue);

                const matchesFilter =
                    filterValue === "all" ||
                    type.includes(filterValue) ||
                    visibility.includes(filterValue);

                const shouldShow =
                    matchesSearch &&
                    matchesFilter;

                card.style.display =
                    shouldShow
                        ? ""
                        : "none";

                if (shouldShow) {
                    visibleCount++;
                }

            });

        if (emptyState) {
            emptyState.hidden =
                visibleCount !== 0;
        }
    }


    /* ==========================================
       SORT BY SCORE
    ========================================== */

    function sortByHighestScore() {

        if (!portfolioGrid) return;

        const cards = [
            ...document.querySelectorAll(
                ".speech-card"
            )
        ];

        cards.sort((first, second) => {

            const firstScore =
                Number(
                    first.dataset.score
                ) || 0;

            const secondScore =
                Number(
                    second.dataset.score
                ) || 0;

            return secondScore - firstScore;
        });

        cards.forEach((card) => {
            portfolioGrid.appendChild(card);
        });
    }


    /* ==========================================
       UPDATE STATS
    ========================================== */

    function updatePortfolioStats() {

        const cards =
            document.querySelectorAll(
                ".speech-card"
            );

        const totalSpeeches =
            cards.length;

        let totalScore = 0;

        cards.forEach((card) => {

            totalScore +=
                Number(
                    card.dataset.score
                ) || 0;
        });

        const averageScore =
            totalSpeeches > 0
                ? Math.round(
                    totalScore /
                    totalSpeeches
                )
                : 0;

        const totalElement =
            document.getElementById(
                "totalSpeeches"
            );

        const averageElement =
            document.getElementById(
                "averageScore"
            );

        if (totalElement) {
            totalElement.textContent =
                totalSpeeches;
        }

        if (averageElement) {
            averageElement.textContent =
                averageScore;
        }
    }


    /* ==========================================
       MODAL EVENTS
    ========================================== */

    if (closeAnalysisModal) {

        closeAnalysisModal.addEventListener(
            "click",
            closeModal
        );
    }

    if (modalOverlay) {

        modalOverlay.addEventListener(
            "click",
            closeModal
        );
    }

    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Escape" &&
                analysisModal &&
                analysisModal.classList.contains(
                    "open"
                )
            ) {

                closeModal();
            }
        }
    );


    /* ==========================================
       SEARCH EVENTS
    ========================================== */

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            applySearchAndFilter
        );
    }

    if (filterSelect) {

        filterSelect.addEventListener(
            "change",
            applySearchAndFilter
        );
    }


    /* ==========================================
       HOVER EFFECT
    ========================================== */

    document
        .querySelectorAll(".speech-thumbnail")
        .forEach((thumbnail) => {

            thumbnail.addEventListener(
                "mouseenter",
                () => {

                    thumbnail.style.transform =
                        "scale(1.02)";
                }
            );

            thumbnail.addEventListener(
                "mouseleave",
                () => {

                    thumbnail.style.transform =
                        "scale(1)";
                }
            );

        });


    /* ==========================================
       INITIALIZE
    ========================================== */

    sortByHighestScore();

    updatePortfolioStats();

    setupVideoPlayback();

    setupAnalysisButtons();

    applySearchAndFilter();

});