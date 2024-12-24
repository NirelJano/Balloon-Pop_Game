document.addEventListener("DOMContentLoaded", () => {
    const startButton = document.getElementById("StartButton");
    const gameScreen = document.getElementById("GameScreen");
    const mainScreen = document.getElementById("MainScreen");
    const easyButton = document.getElementById("Easy");
    const mediumButton = document.getElementById("Medium");
    const hardButton = document.getElementById("Hard");
    const timerElement = document.getElementById("Timer");
    const restartButton = document.getElementById("RestartButton");
    const quitButton = document.getElementById("QuitButton");

    let Level = "easy";
    let gameInterval = null;
    let remainingTime = 0;

    function selectedLevel(level) {
        Level = level;
        easyButton.classList.remove("selected");
        mediumButton.classList.remove("selected");
        hardButton.classList.remove("selected");
        if (level === "easy") {
            easyButton.classList.add("selected");
        } else if (level === "medium") {
            mediumButton.classList.add("selected");
        } else {
            hardButton.classList.add("selected");
        }
    }


    easyButton.addEventListener("click", () => selectedLevel("easy"));
    mediumButton.addEventListener("click", () => selectedLevel("medium"));
    hardButton.addEventListener("click", () => selectedLevel("hard"));

    startButton.addEventListener("click", () => {
        mainScreen.style.display = "none";
        gameScreen.style.display = "block";

        let levelConfig;
        if (Level === "easy") {
            levelConfig = { time: 30, balloons: 100 };
        } else if (Level === "medium") {
            levelConfig = { time: 45, balloons: 200 };
        } else {
            levelConfig = { time: 60, balloons: 300 };
        }

        startGame(levelConfig.time, levelConfig.balloons);
    });

    restartButton.addEventListener("click", () => {
        clearInterval(gameInterval);
        startButton.click();
    });

    quitButton.addEventListener("click", () => {
        clearInterval(gameInterval);
        gameScreen.style.display = "none";
        mainScreen.style.display = "block";
    });

    function getRandomColor() {
        const letters = "0123456789ABCDEF";
        let color = "#";
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    function startGame(time, balloons) {
        const canvas = document.getElementById("gameCanvas");
        const ctx = canvas.getContext("2d");

        const balloonsArray = [];
        for (let i = 0; i < balloons; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const radius = 20 + Math.random() * 30;
            const color = getRandomColor();
            balloonsArray.push({ x, y, radius, color, popped: false });
        }
    
        function drawBalloons() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            balloonsArray.forEach((balloon) => {
                if (!balloon.popped) {
                    ctx.beginPath();
                    ctx.arc(balloon.x, balloon.y, balloon.radius, 0, Math.PI * 2);
                    ctx.fillStyle = balloon.color;
                    ctx.fill();
                    ctx.closePath();

                    ctx.beginPath();
                    ctx.moveTo(balloon.x, balloon.y + balloon.radius);
                    ctx.lineTo(balloon.x, balloon.y + balloon.radius + 50);
                    ctx.strokeStyle = "black";
                    ctx.stroke();
                    ctx.closePath();
                }
            });
        }
    
    
        canvas.addEventListener("click", (event) => {
            const rect = canvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;

            balloonsArray.forEach((balloon) => {
                const distance = Math.sqrt(
                    (mouseX - balloon.x) ** 2 + (mouseY - balloon.y) ** 2
                );
                if (distance <= balloon.radius) {
                    balloon.popped = true;
                }
            });
        });

        function gameLoop() {
            drawBalloons();
            requestAnimationFrame(gameLoop);
        }

        gameLoop();
    
        remainingTime = time; 
        timerElement.innerText = `Time: ${remainingTime}`;
        gameInterval = setInterval(() => {
            remainingTime--;
            timerElement.innerText = `Time: ${remainingTime}`;
            if (remainingTime <= 0) {
                clearInterval(gameInterval);
                alert("Game Over!");
            }
        }, 1000);
    }
});
