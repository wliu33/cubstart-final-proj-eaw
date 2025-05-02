
let currentFrame = 1;
let timer;
let timeLeft = 1500; // 25 minutes in seconds
let isBreakTime = false;

// initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", function() {
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
                    // switch to break screen
                    isBreakTime = true;
                    timeLeft = 300; // 5 minutes for break
                    window.location.href = "frame4.html";
                } else {
                    // break ended, return to work
                    isBreakTime = false;
                    timeLeft = 1500; // 25 minutes for work
                    window.location.href = "frame1.html";
                }
            }
        }, 1000);
    }

    function clearTimer() {
        clearInterval(timer);
        timer = null;
        timeLeft = isBreakTime ? 300 : 1500;
        updateTimerDisplay();
    }

    if (startButton) startButton.addEventListener("click", startTimer);
    if (clearButton) clearButton.addEventListener("click", clearTimer);
    if (resumeButton) resumeButton.addEventListener("click", () => {
        isBreakTime = false;
        timeLeft = 1500;
        window.location.href = "frame1.html";
    });

    updateTimerDisplay();
}

// task list
function initializeTasks() {
    const taskList = document.getElementById("task-list");
    const newTaskInput = document.getElementById("new-task");
    const addTaskButton = document.getElementById("add-task");

    function addTask(taskText) {
        if (!taskText.trim()) return;
        
        const taskId = Date.now();
        const taskItem = document.createElement("div");
        taskItem.className = "task-item";
        taskItem.innerHTML = `
            <input type="checkbox" id="task-${taskId}" class="task-checkbox">
            <label for="task-${taskId}">${taskText}</label>
            <button class="delete-task">×</button>
        `;
        
        taskList.appendChild(taskItem);
        newTaskInput.value = "";
        
        // event listeners for the new task
        const checkbox = taskItem.querySelector(".task-checkbox");
        const label = taskItem.querySelector("label");
        const deleteBtn = taskItem.querySelector(".delete-task");
        
        checkbox.addEventListener("change", () => {
            label.style.textDecoration = checkbox.checked ? "line-through" : "none";
            label.style.color = checkbox.checked ? "#888" : "#000";
        });
        
        deleteBtn.addEventListener("click", () => {
            taskItem.remove();
        });
    }

    if (addTaskButton && newTaskInput) {
        addTaskButton.addEventListener("click", () => {
            addTask(newTaskInput.value);
        });
        
        newTaskInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                addTask(newTaskInput.value);
            }
        });
    }
}



// affirmations
function initializeAffirmations() {
    const affirmationButton = document.getElementById("get-affirmation");
    const affirmationDisplay = document.getElementById("affirmation-text");

    if (affirmationButton && affirmationDisplay) {
        const defaultAffirmations = [
            "You've got this!",
            "You're doing great!",
            "Believe in yourself!",
            "One step at a time!",
            "You're making progress!"
        ];

        affirmationButton.addEventListener("click", () => {
            fetch("https://www.affirmations.dev/")
                .then((response) => response.json())
                .then((data) => {
                    affirmationDisplay.textContent = data.affirmation;
                })
                .catch((error) => {
                    // use local affirmations if API fails
                    const randomIndex = Math.floor(Math.random() * defaultAffirmations.length);
                    affirmationDisplay.textContent = defaultAffirmations[randomIndex];
                    console.error("Affirmation API error:", error);
                });
        });
    }
}