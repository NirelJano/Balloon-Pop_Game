document.addEventListener("DOMContentLoaded", () => {
    const mainScreen = document.getElementById("MainScreen");
    const gameScreen = document.getElementById("GameScreen");
    const resultScreen = document.getElementById("ResultScreen");

    const easyButton = document.getElementById("Easy");
    const mediumButton = document.getElementById("Medium");
    const hardButton = document.getElementById("Hard");

    const startButton = document.getElementById("StartButton");
    const restartButton = document.querySelectorAll(".RestartButton");
    const quitButton = document.querySelectorAll(".QuitButton");

    const timerElement = document.getElementById("Timer");
    const scoreElement = document.getElementById("Score");
    const resultScore = document.getElementById("ResultScore");

    let Level = "easy";
    let gameInterval = null;
    let remainingTime = 0;
    let score = 0;
    let highScore = {easy: 0, medium: 0, hard: 0};
    let levelConfig = {time: 60, balloons: 200, speed:0.3};

    function showPopEffect(x, y) {
        const popElement = document.createElement("div");
        popElement.innerText = "POP! 💥";
        popElement.style.position = "absolute";
        popElement.style.left = `${x}px`;
        popElement.style.top = `${y}px`;
        popElement.style.fontSize = "30px";
        popElement.style.fontWeight = "bold";
        popElement.style.color = "red";
        popElement.style.textShadow = "2px 2px 5px black";
        popElement.style.transform = "translate(-50%, -50%)";
        popElement.style.zIndex = "1000";
        popElement.style.animation = "fadeOut 1s forwards";
        document.body.appendChild(popElement);
    
        // הסר את האלמנט לאחר סיום האנימציה
        setTimeout(() => {
            document.body.removeChild(popElement);
        }, 1000);
    }
    

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

        if (Level === "hard") {
            levelConfig = {time: 30, balloons: 200,speed:0.8};
        } else if (Level === "medium") {
            levelConfig = {time: 45, balloons: 200,speed:0.6};
        } else {
            levelConfig = {time: 60, balloons: 200,speed:0.3};
        }
        startGame(levelConfig.time, levelConfig.balloons,levelConfig.speed);
    });

    restartButton.forEach(button =>
        button.addEventListener("click", () => {
            clearInterval(gameInterval); 
            remainingTime = levelConfig.time; 
            timerElement.innerText = `Time: ${remainingTime}`; 
            score = 0;
            scoreElement.innerText = `Score: ${score}`;
            resultScreen.style.display = "none"; 
            gameScreen.style.display = "block";
            startButton.click();
        })
    );
    

    quitButton.forEach(button =>
        button.addEventListener("click", () => {
            clearInterval(gameInterval);
            resultScreen.style.display = "none"; 
            gameScreen.style.display = "none";
            mainScreen.style.display = "block";
            score = 0;
            scoreElement.innerText = `Score: ${score}`;
        })
    );

    function displayResults() { 
        gameScreen.style.display = "none";
        resultScreen.style.display = "block";
        const currentHighScore = highScore[Level];
        if (score > currentHighScore) {
            highScore[Level] = score;
        }
        resultScore.innerText = `Your Score: ${score}\nHigh Score (${Level}): ${highScore[Level]}`;
    }


    function getRandomColor() {
        const letters = "0123456789ABCDEF";
        let color = "#";
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    function startGame(time, balloons, speed) {
        const canvas = document.getElementById("gameCanvas");
        const ctx = canvas.getContext("2d");
        canvas.width = window.innerWidth ;
        canvas.height = window.innerHeight * 0.85;

        const balloonsArray = [];
        score = 0
        scoreElement.innerText = `Score: ${score}`;

        for (let i = 0; i < balloons; i++) {
            setTimeout(() => {
                const x = Math.random() * canvas.width;
                const y = canvas.height + Math.random() * 100; 
                const radius = 20 + Math.random() * 30;
                const color = getRandomColor();
                const speedY = -(canvas.height / 110) * speed; 
                const speedX = (Math.random() - 0.5) * speed; 

                balloonsArray.push({x, y, radius, color, speedX, speedY, popped: false});
            }, i * 1400); 
        }
    
        function drawBalloons() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            balloonsArray.forEach((balloon) => {
                if (!balloon.popped) {
                    // תנועת בלונים
                    balloon.x += balloon.speedX;
                    balloon.y += balloon.speedY;
        
                    
        
                    // ציור בלון (עם מעבר צבעים)
                    const gradient = ctx.createRadialGradient(
                        balloon.x,
                        balloon.y,
                        balloon.radius * 0.5,
                        balloon.x,
                        balloon.y,
                        balloon.radius
                    );
                    gradient.addColorStop(0, "white");
                    gradient.addColorStop(1, balloon.color);
                    ctx.beginPath();
                    ctx.ellipse(
                        balloon.x,
                        balloon.y,
                        balloon.radius * 0.8,
                        balloon.radius,
                        0,
                        0,
                        Math.PI * 2
                    );
                    ctx.fillStyle = gradient;
                    ctx.fill();
                    ctx.closePath();
        
                    // חוט מתפתל
                    ctx.beginPath();
                    ctx.moveTo(balloon.x, balloon.y + balloon.radius);
                    ctx.bezierCurveTo(
                        balloon.x - 10,
                        balloon.y + balloon.radius + 20,
                        balloon.x + 10,
                        balloon.y + balloon.radius + 40,
                        balloon.x,
                        balloon.y + balloon.radius + 50
                    );
                    ctx.strokeStyle = "black";
                    ctx.lineWidth = 1;
                    ctx.stroke();
                    ctx.closePath();
        
                    // צל
                    ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
                    ctx.shadowBlur = 10;
                    ctx.shadowOffsetX = 5;
                    ctx.shadowOffsetY = 5;
                }
            });
        }
        
    
        canvas.addEventListener("click", (event) => {
            const rect = canvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;
            
            balloonsArray.forEach((balloon) => {
                if (!balloon.popped) {
                    const distance = Math.sqrt(
                        (mouseX - balloon.x) ** 2 + (mouseY - balloon.y) ** 2
                    );
                    if (distance <= balloon.radius) {
                        balloon.popped = true;
                        score++;
                        scoreElement.innerText = `Score: ${score}`; 
                        showPopEffect(balloon.x + rect.left, balloon.y + rect.top);
                    }
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
                displayResults();
            }
        }, 1000);
    }
});