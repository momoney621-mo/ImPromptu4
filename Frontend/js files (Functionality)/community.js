/* ==========================================================
   SPEAKUP AI
   COMMUNITY.JS
   PART 1
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* ==========================================
       ELEMENTS
    ========================================== */

    const analysisButtons = document.querySelectorAll(".analysis-btn");
    const modal = document.getElementById("analysisModal");
    const closeModal = document.querySelector(".close-analysis");

    const categoryButtons = document.querySelectorAll(".category");
    const likeButtons = document.querySelectorAll(".action-btn");



    /* ==========================================
       OPEN AI ANALYSIS
    ========================================== */

    if (analysisButtons.length && modal) {

        analysisButtons.forEach(button => {

            button.addEventListener("click", () => {

                modal.classList.add("show");

                document.body.style.overflow = "hidden";

            });

        });

    }



    /* ==========================================
       CLOSE AI ANALYSIS
    ========================================== */

    if (closeModal && modal) {

        closeModal.addEventListener("click", () => {

            modal.classList.remove("show");

            document.body.style.overflow = "auto";

        });

    }



    /* ==========================================
       CLOSE WHEN CLICKING BACKGROUND
    ========================================== */

    if (modal) {

        modal.addEventListener("click", (event) => {

            if (event.target === modal) {

                modal.classList.remove("show");

                document.body.style.overflow = "auto";

            }

        });

    }



    /* ==========================================
       ESC KEY CLOSES MODAL
    ========================================== */

    document.addEventListener("keydown", (event) => {

        if (event.key === "Escape" && modal) {

            modal.classList.remove("show");

            document.body.style.overflow = "auto";

        }

    });



    /* ==========================================
       CATEGORY BUTTONS
    ========================================== */

    categoryButtons.forEach(button => {

        button.addEventListener("click", () => {

            categoryButtons.forEach(btn => {

                btn.classList.remove("active");

            });

            button.classList.add("active");

        });

    });



    /* ==========================================
       LIKE BUTTON
    ========================================== */

    likeButtons.forEach(button => {

        const icon = button.querySelector("i");

        if (!icon) return;

        if (!icon.classList.contains("fa-heart")) return;

        button.addEventListener("click", () => {

            button.classList.toggle("liked");

            if (button.classList.contains("liked")) {

                icon.classList.remove("fa-regular");
                icon.classList.add("fa-solid");

                button.style.background = "#ef4444";

            }

            else {

                icon.classList.remove("fa-solid");
                icon.classList.add("fa-regular");

                button.style.background = "";

            }

        });

    });
        /* ==========================================
       CATEGORY FILTERING
    ========================================== */

    const reelCards = document.querySelectorAll(".reel-card");

    categoryButtons.forEach(button => {

        button.addEventListener("click", () => {

            const selectedCategory = button.textContent.trim().toLowerCase();

            reelCards.forEach(card => {

                const title = card.querySelector(".speaker-info h2")
                    .textContent
                    .toLowerCase();

                if (
                    selectedCategory === "all" ||
                    title.includes(selectedCategory)
                ) {

                    card.style.display = "block";

                }

                else {

                    card.style.display = "none";

                }

            });

        });

    });



    /* ==========================================
       FAKE AI SCORES
    ========================================== */

    const fakeScores = [

        {
            overall:94,
            eye:96,
            confidence:95,
            voice:97,
            pace:90,
            body:93,
            organization:98
        },

        {
            overall:91,
            eye:90,
            confidence:94,
            voice:93,
            pace:92,
            body:89,
            organization:95
        },

        {
            overall:97,
            eye:99,
            confidence:98,
            voice:97,
            pace:96,
            body:98,
            organization:99
        }

    ];



    analysisButtons.forEach((button,index)=>{

        button.addEventListener("click",()=>{

            if(!modal) return;

            const data = fakeScores[index % fakeScores.length];

            const boxes = modal.querySelectorAll(".analysis-box span");

            if(boxes.length >= 6){

                boxes[0].textContent = data.eye + "%";
                boxes[1].textContent = data.confidence + "%";
                boxes[2].textContent = data.voice + "%";
                boxes[3].textContent = data.pace + "%";
                boxes[4].textContent = data.body + "%";
                boxes[5].textContent = data.organization + "%";

            }

            const score = modal.querySelector(".analysis-score h1");

            if(score){

                score.textContent = data.overall;

            }

        });

    });



    /* ==========================================
       COMMENT BUTTON
    ========================================== */

    document.querySelectorAll(".fa-comment").forEach(icon=>{

        icon.parentElement.addEventListener("click",()=>{

            alert("Community comments will be available soon!");

        });

    });



    /* ==========================================
       REEL HOVER EFFECT
    ========================================== */

    reelCards.forEach(card=>{

        card.addEventListener("mouseenter",()=>{

            card.style.transform="translateY(-8px)";

        });

        card.addEventListener("mouseleave",()=>{

            card.style.transform="translateY(0px)";

        });

    });



    /* ==========================================
       SCROLL TO NEXT REEL
    ========================================== */

    reelCards.forEach(card=>{

        card.addEventListener("wheel",(event)=>{

            if(event.deltaY>0){

                const next=card.nextElementSibling;

                if(next){

                    next.scrollIntoView({

                        behavior:"smooth",

                        block:"center"

                    });

                }

            }

        });

    });



    /* ==========================================
       KEYBOARD NAVIGATION
    ========================================== */

    let currentReel = 0;

    document.addEventListener("keydown",(event)=>{

        if(event.key==="ArrowDown"){

            currentReel=Math.min(currentReel+1,reelCards.length-1);

            reelCards[currentReel].scrollIntoView({

                behavior:"smooth",

                block:"center"

            });

        }

        if(event.key==="ArrowUp"){

            currentReel=Math.max(currentReel-1,0);

            reelCards[currentReel].scrollIntoView({

                behavior:"smooth",

                block:"center"

            });

        }

    });



    /* ==========================================
       PAGE LOADED
    ========================================== */

    console.log("SpeakUp AI Community Loaded Successfully");

});