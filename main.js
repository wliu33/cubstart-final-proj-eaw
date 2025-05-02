
let timer;
let isBreakTime = window.location.href.includes("frame4.html"); // Automatically detect break screen
let timeLeft = isBreakTime ? 15 : 15; // 15 seconds for both work and break (demo purposes)

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
    initializeTimer();
    initializeTasks();
    initializeAffirmations();
});

// Timer functionality
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
                    // Switch to break screen
                    isBreakTime = true;
                    timeLeft = 15; // 15 seconds for break (demo)
                    window.location.href = "frame4.html";
                } else {
                    // Return to work
                    isBreakTime = false;
                    timeLeft = 15; // 15 seconds for work (demo)
                    window.location.href = "index.html";
                }
            }
        }, 1000);
    }

    function clearTimer() {
        clearInterval(timer);
        timer = null;
        timeLeft = 15; // Always reset to 15 seconds (demo)
        updateTimerDisplay();
    }

    if (startButton) startButton.addEventListener("click", startTimer);
    if (clearButton) clearButton.addEventListener("click", clearTimer);
    if (resumeButton) resumeButton.addEventListener("click", () => {
        isBreakTime = false;
        timeLeft = 15; // 15 seconds when resuming (demo)
        window.location.href = "index.html";
    });

    updateTimerDisplay();

    // Auto-start timer if on break screen
    if (isBreakTime) {
        startTimer();
    }
}

// Task list functionality (unchanged)
function initializeTasks() {
    const taskList = document.getElementById("task-list");
    const newTaskInput = document.getElementById("new-task");
    const addTaskButton = document.getElementById("add-task");

    function createTaskElement(taskText) {
        const taskId = 'task-' + Date.now();
        const taskItem = document.createElement('div');
        taskItem.className = 'task-item';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = taskId;
        checkbox.className = 'task-checkbox';
        
        const label = document.createElement('label');
        label.htmlFor = taskId;
        label.textContent = taskText;
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-task';
        deleteBtn.textContent = '×';
        deleteBtn.addEventListener('click', () => {
            taskItem.remove();
        });
        
        checkbox.addEventListener('change', () => {
            label.style.textDecoration = checkbox.checked ? 'line-through' : 'none';
            label.style.color = checkbox.checked ? '#888' : '#000';
        });
        
        taskItem.appendChild(checkbox);
        taskItem.appendChild(label);
        taskItem.appendChild(deleteBtn);
        
        return taskItem;
    }

    function addTask() {
        const taskText = newTaskInput.value.trim();
        if (taskText) {
            const taskElement = createTaskElement(taskText);
            taskList.appendChild(taskElement);
            newTaskInput.value = '';
        }
    }

    if (addTaskButton && newTaskInput) {
        addTaskButton.addEventListener('click', addTask);
        newTaskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addTask();
            }
        });
    }
}

// Affirmations functionality (unchanged)
function initializeAffirmations() {
    const affirmationButton = document.getElementById("get-affirmation");
    const affirmationDisplay = document.getElementById("affirmation-text");

    if (affirmationButton && affirmationDisplay) {
        const fallbackAffirmations = [
            "You're doing great!",
            "Believe in yourself!",
            "One step at a time!",
            "You've got this!",
            "Progress takes time!"
        ];

        affirmationButton.addEventListener('click', () => {
            fetch("https://www.affirmations.dev/")
                .then(response => {
                    if (!response.ok) throw new Error('Network response was not ok');
                    return response.json();
                })
                .then(data => {
                    affirmationDisplay.textContent = data.affirmation;
                })
                .catch(error => {
                    console.error('Error fetching affirmation:', error);
                    const randomIndex = Math.floor(Math.random() * fallbackAffirmations.length);
                    affirmationDisplay.textContent = fallbackAffirmations[randomIndex];
                });
        });
    }
}