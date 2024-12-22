document.addEventListener("DOMContentLoaded", () => {
    const startButton = document.getElementById("StartButton");
    const gameScreen = document.getElementById("GameScreen");
    const mainScreen = document.getElementById("MainScreen");
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    startButton.addEventListener("click", () => {
        // הסתרת מסך ראשי והצגת מסך משחק
        mainScreen.style.display = "none";
        gameScreen.style.display = "block";

        // הפעלת המשחק
        startGame();
    });

    function startGame() {
        // משתנים בסיסיים למשחק
        let x = canvas.width / 2;
        let y = canvas.height - 30;
        let dx = 2;
        let dy = -2;
        const ballRadius = 10;

        function drawBall() {
            ctx.beginPath();
            ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
            ctx.fillStyle = "#0095DD";
            ctx.fill();
            ctx.closePath();
        }

        function updateGame() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawBall();

            // לוגיקת תנועה
            if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
                dx = -dx;
            }
            if (y + dy > canvas.height - ballRadius || y + dy < ballRadius) {
                dy = -dy;
            }

            x += dx;
            y += dy;

            requestAnimationFrame(updateGame);
        }

        // התחלת לולאת המשחק
        updateGame();
    }
});
