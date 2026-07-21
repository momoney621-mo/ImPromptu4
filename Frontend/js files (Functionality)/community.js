/* ==========================================================
   SPEAKUP AI - COMMUNITY
========================================================== */

document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("analysisModal");
    const closeModal = document.querySelector(".close-analysis");
    const categoryButtons = document.querySelectorAll(".category");
    const communityReels = document.getElementById("communityReels");

    const speeches = [
        { id: 1, title: "One of the Greatest Speeches Ever", speaker: "Steve Jobs", category: "motivational", duration: "3–4 min", youtubeId: "Tuw8hxrFBH8", youtubeUrl: "https://www.youtube.com/watch?v=Tuw8hxrFBH8", description: "Steve Jobs shares advice about believing in your ideas, following your passion, and creating meaningful work.", scores: { overall: 96, eye: 95, confidence: 97, voice: 96, pace: 94, body: 95, organization: 98 } },
        { id: 2, title: "Best 3 Minutes for an Inspiring Day", speaker: "Oprah Winfrey", category: "inspirational", duration: "3 min", youtubeId: "y06yCoUvxAY", youtubeUrl: "https://www.youtube.com/watch?v=y06yCoUvxAY", description: "Oprah Winfrey delivers a short message about purpose, resilience, and personal growth.", scores: { overall: 95, eye: 96, confidence: 98, voice: 97, pace: 92, body: 94, organization: 95 } },
        { id: 3, title: "3 Life Lessons in 3 Minutes", speaker: "Phil Knight", category: "business", duration: "3 min", youtubeId: "NruVhgnFpp0", youtubeUrl: "https://www.youtube.com/watch?v=NruVhgnFpp0", description: "Nike co-founder Phil Knight shares three concise lessons about persistence, failure, and continuing to try.", scores: { overall: 93, eye: 91, confidence: 95, voice: 94, pace: 93, body: 90, organization: 96 } },
        { id: 4, title: "2015 State of the Union in 4 Minutes", speaker: "Barack Obama", category: "leadership", duration: "4 min", youtubeId: "71mvp1fJx9A", youtubeUrl: "https://www.youtube.com/watch?v=71mvp1fJx9A", description: "A condensed example of Barack Obama's pacing, emphasis, audience connection, and leadership speaking style.", scores: { overall: 97, eye: 98, confidence: 98, voice: 97, pace: 96, body: 96, organization: 98 } },
        { id: 5, title: "Most Eye-Opening Speech", speaker: "Arnold Schwarzenegger", category: "success", duration: "4 min", youtubeId: "PAqhno_ZmJU", youtubeUrl: "https://www.youtube.com/watch?v=PAqhno_ZmJU", description: "Arnold Schwarzenegger discusses vision, ambition, hard work, and refusing to accept limitations.", scores: { overall: 94, eye: 93, confidence: 98, voice: 94, pace: 92, body: 97, organization: 92 } }
    ];

    let currentReel = 0;

    const formatCategory = category => category.charAt(0).toUpperCase() + category.slice(1);

    function renderSpeeches(speechList) {
        if (!communityReels) return;

        communityReels.innerHTML = speechList.map(speech => `
            <article class="reel-card" data-category="${speech.category}" data-speech-id="${speech.id}">
                <div class="video-wrapper">
                    <iframe src="https://www.youtube.com/embed/${speech.youtubeId}" title="${speech.title} by ${speech.speaker}" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                </div>
                <div class="speaker-info">
                    <div class="speech-meta"><span class="speech-category">${formatCategory(speech.category)}</span><span class="speech-duration">${speech.duration}</span></div>
                    <h2>${speech.title}</h2>
                    <h3>${speech.speaker}</h3>
                    <p>${speech.description}</p>
                </div>
                <div class="reel-actions">
                    <button class="action-btn like-btn" type="button"><i class="fa-regular fa-heart"></i><span>Like</span></button>
                    <button class="action-btn comment-btn" type="button"><i class="fa-regular fa-comment"></i><span>Comment</span></button>
                    <button class="analysis-btn" type="button" data-speech-id="${speech.id}">View AI Analysis</button>
                </div>
            </article>
        `).join("");
    }

    function closeAnalysisModal() {
        if (!modal) return;
        modal.classList.remove("show");
        document.body.style.overflow = "";
    }

    function openAnalysisModal(speech) {
        if (!modal || !speech) return;

        modal.classList.add("show");
        document.body.style.overflow = "hidden";

        const title = modal.querySelector(".analysis-content > h2");
        const overallScore = modal.querySelector(".analysis-score h1");
        const scoreBoxes = modal.querySelectorAll(".analysis-box span");
        const scores = [speech.scores.eye, speech.scores.confidence, speech.scores.voice, speech.scores.pace, speech.scores.body, speech.scores.organization];

        if (title) title.textContent = `AI Speech Analysis: ${speech.speaker}`;
        if (overallScore) overallScore.textContent = speech.scores.overall;
        scoreBoxes.forEach((box, index) => {
            if (scores[index] !== undefined) box.textContent = `${scores[index]}%`;
        });
    }

    if (closeModal) closeModal.addEventListener("click", closeAnalysisModal);

    if (modal) {
        modal.addEventListener("click", event => {
            if (event.target === modal) closeAnalysisModal();
        });
    }

    categoryButtons.forEach(button => {
        button.addEventListener("click", () => {
            const selectedCategory = button.dataset.category;
            categoryButtons.forEach(categoryButton => categoryButton.classList.remove("active"));
            button.classList.add("active");
            renderSpeeches(selectedCategory === "all" ? speeches : speeches.filter(speech => speech.category === selectedCategory));
            currentReel = 0;
        });
    });

    if (communityReels) {
        communityReels.addEventListener("click", event => {
            const likeButton = event.target.closest(".like-btn");
            const commentButton = event.target.closest(".comment-btn");
            const analysisButton = event.target.closest(".analysis-btn");

            if (likeButton) {
                likeButton.classList.toggle("liked");
                const icon = likeButton.querySelector("i");
                if (icon) {
                    icon.classList.toggle("fa-solid", likeButton.classList.contains("liked"));
                    icon.classList.toggle("fa-regular", !likeButton.classList.contains("liked"));
                }
            } else if (commentButton) {
                alert("Community comments will be available soon!");
            } else if (analysisButton) {
                const selectedSpeech = speeches.find(speech => speech.id === Number(analysisButton.dataset.speechId));
                openAnalysisModal(selectedSpeech);
            }
        });
    }

    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && modal?.classList.contains("show")) {
            closeAnalysisModal();
            return;
        }

        const focusedElement = document.activeElement;
        const isInteractive = focusedElement && (focusedElement.matches("input, textarea, select, button, iframe") || focusedElement.isContentEditable);
        if (isInteractive || !communityReels || !["ArrowDown", "ArrowUp"].includes(event.key)) return;

        const reelCards = communityReels.querySelectorAll(".reel-card");
        if (!reelCards.length) return;

        const nextIndex = event.key === "ArrowDown"
            ? Math.min(currentReel + 1, reelCards.length - 1)
            : Math.max(currentReel - 1, 0);

        if (nextIndex === currentReel) return;

        const card = reelCards[nextIndex];
        if (card) {
            currentReel = nextIndex;
            event.preventDefault();
            card.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    });

    renderSpeeches(speeches);
    const allCategoryButton = document.querySelector('.category[data-category="all"]');
    if (allCategoryButton) allCategoryButton.classList.add("active");

    console.log("SpeakUp AI Community Loaded Successfully");
});
