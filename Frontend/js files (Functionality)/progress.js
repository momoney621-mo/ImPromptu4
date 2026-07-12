/*=========================================================
    SpeakUp AI
    progress.js
    Part 1
=========================================================*/

document.addEventListener("DOMContentLoaded", () => {

    /* ==========================================
       GOAL CHECKBOXES
    ========================================== */

    const goalCheckboxes = document.querySelectorAll(".goal-item input");

    goalCheckboxes.forEach(box => {

        box.addEventListener("change", () => {

            const goal = box.parentElement;

            if (box.checked) {

                goal.style.background = "#dcfce7";
                goal.style.border = "2px solid #22c55e";
                goal.style.transform = "scale(1.01)";

            } else {

                goal.style.background = "#f8fafc";
                goal.style.border = "none";
                goal.style.transform = "scale(1)";
            }

            updateGoalProgress();

        });

    });

    function updateGoalProgress() {

        const completed = document.querySelectorAll(".goal-item input:checked").length;
        const total = goalCheckboxes.length;

        console.log(`Goals Completed: ${completed}/${total}`);

    }

    /* ==========================================
       COACH CARDS
    ========================================== */

    const addCoachCard = document.querySelector(".add-coach");

    if (addCoachCard) {

        addCoachCard.addEventListener("click", () => {

            const coachName = prompt("Enter Coach Name:");

            if (!coachName) return;

            const coachType = prompt("Coach Role (Teacher, Debate Coach, etc.):");

            const coachGrid = document.querySelector(".coach-grid");

            const coachCard = document.createElement("div");

            coachCard.className = "coach-card";

            coachCard.innerHTML = `

                <i class="fa-solid fa-user-tie"></i>

                <h3>${coachName}</h3>

                <p>${coachType || "Coach"}</p>

                <span class="connected">

                    Connected

                </span>

            `;

            coachGrid.insertBefore(coachCard, addCoachCard);

        });

    }

    /* ==========================================
       SEND TO COACH
    ========================================== */

    const sendButton = document.querySelector(".share-card .primary-btn");

    if (sendButton) {

        sendButton.addEventListener("click", () => {

            const coach =
                document.querySelector(".share-grid select:nth-child(1)");

            const speech =
                document.querySelector(".share-grid select:nth-child(2)");

            alert(
                "Speech successfully sent for review!"
            );

        });

    }

});
/*=========================================================
    SpeakUp AI
    progress.js
    Part 2
=========================================================*/

document.addEventListener("DOMContentLoaded", () => {

    /* ==========================================
       ANIMATE STAT NUMBERS
    ========================================== */

    const statNumbers = document.querySelectorAll(".stat-card h2");

    statNumbers.forEach(stat => {

        const text = stat.textContent.trim();

        const number = parseInt(text.replace(/\D/g, ""));

        if (isNaN(number)) return;

        const prefix = text.startsWith("#") ? "#" : "";
        const suffix = text.includes("%") ? "%" : "";

        let current = 0;

        const speed = Math.max(1, Math.floor(number / 50));

        const timer = setInterval(() => {

            current += speed;

            if (current >= number) {

                current = number;
                clearInterval(timer);

            }

            stat.textContent = prefix + current + suffix;

        }, 20);

    });

    /* ==========================================
       SKILL BAR ANIMATION
    ========================================== */

    const skillBars = document.querySelectorAll(".skill-fill");

    skillBars.forEach(bar => {

        const finalWidth = window.getComputedStyle(bar).width;

        bar.style.width = "0px";

        setTimeout(() => {

            bar.style.transition = "width 1.2s ease";
            bar.style.width = finalWidth;

        }, 300);

    });

    /* ==========================================
       ACHIEVEMENT EFFECTS
    ========================================== */

    const achievements = document.querySelectorAll(".achievement");

    achievements.forEach(card => {

        card.addEventListener("mouseenter", () => {

            card.style.transform = "translateY(-8px) scale(1.04)";
            card.style.boxShadow = "0 15px 35px rgba(79,70,229,.15)";

        });

        card.addEventListener("mouseleave", () => {

            card.style.transform = "";
            card.style.boxShadow = "";

        });

    });

    /* ==========================================
       FEEDBACK CARD EFFECTS
    ========================================== */

    const feedbackCards = document.querySelectorAll(".feedback-item");

    feedbackCards.forEach(card => {

        card.addEventListener("mouseenter", () => {

            card.style.background = "#eef2ff";

        });

        card.addEventListener("mouseleave", () => {

            card.style.background = "#f8fafc";

        });

    });

    /* ==========================================
       SAVE GOALS
    ========================================== */

    const goalBoxes = document.querySelectorAll(".goal-item input");

    goalBoxes.forEach((box, index) => {

        const saved = localStorage.getItem("goal-" + index);

        if (saved === "true") {

            box.checked = true;

            box.parentElement.style.background = "#dcfce7";
            box.parentElement.style.border = "2px solid #22c55e";

        }

        box.addEventListener("change", () => {

            localStorage.setItem("goal-" + index, box.checked);

        });

    });

    /* ==========================================
       SAVE ADDED COACHES
    ========================================== */

    const coachGrid = document.querySelector(".coach-grid");
    const addCoach = document.querySelector(".add-coach");

    if (coachGrid && addCoach) {

        let savedCoaches =
            JSON.parse(localStorage.getItem("coaches")) || [];

        savedCoaches.forEach(coach => {

            const card = document.createElement("div");

            card.className = "coach-card";

            card.innerHTML = `

                <i class="fa-solid fa-user-tie"></i>

                <h3>${coach.name}</h3>

                <p>${coach.role}</p>

                <span class="connected">

                    Connected

                </span>

            `;

            coachGrid.insertBefore(card, addCoach);

        });

        addCoach.addEventListener("click", () => {

            setTimeout(() => {

                const cards =
                    coachGrid.querySelectorAll(".coach-card:not(.add-coach)");

                const newest = cards[cards.length - 1];

                if (!newest) return;

                const coach = {

                    name: newest.querySelector("h3").textContent,
                    role: newest.querySelector("p").textContent

                };

                savedCoaches =
                    JSON.parse(localStorage.getItem("coaches")) || [];

                const exists = savedCoaches.some(c => c.name === coach.name);

                if (!exists) {

                    savedCoaches.push(coach);

                    localStorage.setItem(
                        "coaches",
                        JSON.stringify(savedCoaches)
                    );

                }

            }, 300);

        });

    }

    console.log("SpeakUp AI Progress Loaded");

});