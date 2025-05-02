let currentFrame = 1;
let timer;
let isBreakTime = window.location.href.includes("frame4.html"); // Automatically detect break screen
let timeLeft = isBreakTime ? 10 : 15; // 10 seconds for break, 25 for work

// initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
    initializeTimer();
    initializeTasks();
    initializeThemeToggle();
    initializeAffirmations();
});

// timer
function initializeTimer() {
    const timerDisplay = document.getElementById("timer-display");
    const startButton = document.getElementById("start-button");
    const clearButton = document.getElementById("clear-button");
    const resumeButton = document.getElementById("resume-button");

    function updateTimerDisplay() {
        if (timerDisplay) {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
    }

    function startTimer() {
        if (timer) return;

        timer = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();

            if (timeLeft <= 0) {
                clearInterval(timer);
                timer = null;

                if (!isBreakTime) {
                    isBreakTime = true;
                    timeLeft = 10;
                    window.location.href = "frame4.html";
                } else {
                    isBreakTime = false;
                    timeLeft = 15;
                    window.location.href = "index.html";
                }
            }
        }, 1000);
    }

    function clearTimer() {
        clearInterval(timer);
        timer = null;

        if (isBreakTime) {
            timeLeft = 10;
        } else {
            timeLeft = 15;
        }

        updateTimerDisplay();
    }

    if (startButton) startButton.addEventListener("click", startTimer);
    if (clearButton) clearButton.addEventListener("click", clearTimer);
    if (resumeButton) resumeButton.addEventListener("click", () => {
        isBreakTime = false;
        timeLeft = 15;
        window.location.href = "index.html";
    });

    updateTimerDisplay();

    // ✅ Auto-start timer only if on break screen
    if (isBreakTime) {
        startTimer();
    }
}
