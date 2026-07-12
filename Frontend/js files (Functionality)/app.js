// ===============================
// SpeakUp AI Dashboard Script
// ===============================

// Welcome Message
console.log("Welcome to SpeakUp AI!");

// -------------------------------
// Highlight Active Sidebar Link
// -------------------------------

const navLinks = document.querySelectorAll(".sidebar nav a");

navLinks.forEach(link => {

    link.addEventListener("click", function () {

        navLinks.forEach(item => {
            item.classList.remove("active");
        });

        this.classList.add("active");

    });

});

// -------------------------------
// Button Hover Animation
// -------------------------------

const buttons = document.querySelectorAll(".primary-btn");

buttons.forEach(button => {

    button.addEventListener("mouseenter", () => {
        button.style.transform = "translateY(-3px)";
    });

    button.addEventListener("mouseleave", () => {
        button.style.transform = "translateY(0)";
    });

});

// -------------------------------
// Animated Statistics Counter
// -------------------------------

const numbers = document.querySelectorAll(".card h2");

numbers.forEach(counter => {

    const target = parseInt(counter.innerText);

    if (isNaN(target)) return;

    let current = 0;

    const speed = Math.max(1, Math.floor(target / 60));

    const update = () => {

        if (current < target) {

            current += speed;

            if (current > target) current = target;

            counter.innerText = current;

            requestAnimationFrame(update);

        }

    };

    update();

});

// -------------------------------
// Hero Button
// -------------------------------

const practiceButton = document.querySelector(".primary-btn");

if(practiceButton){

practiceButton.addEventListener("click",function(){

window.location.href="practice.html";

});

}

// -------------------------------
// Fade In Cards
// -------------------------------

const cards = document.querySelectorAll(".card, .action-card, .large-card");

cards.forEach((card,index)=>{

card.style.opacity="0";

card.style.transform="translateY(20px)";

setTimeout(()=>{

card.style.transition=".6s";

card.style.opacity="1";

card.style.transform="translateY(0)";

},index*150);

});

// -------------------------------
// Current Date
// -------------------------------

const today = new Date();

console.log(today.toDateString());

// -------------------------------
// Future Features
// -------------------------------

// TODO:
// AI Feedback API
// Webcam Recorder
// Upload Video
// Portfolio Database
// Community Feed
// Login Authentication