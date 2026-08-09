// Create Canvas
let canvas = document.createElement("canvas");

canvas.id = "myCanvas";
canvas.width = 1500;
canvas.height = 1000;
canvas.style.border = "1px solid black";

document.body.appendChild(canvas);

// Get Canvas Context
let ctx = canvas.getContext("2d");

// Add Click Event
canvas.addEventListener("click", sparkle);

// Sparkle Function
function sparkle(event) {

    let x = event.offsetX;
    let y = event.offsetY;

    for (let i = 0; i < 5; i++) {

        let sx = x + Math.random() * 40 - 20;
        let sy = y + Math.random() * 40 - 20;

        drawStar(sx, sy);
    }
}

// Draw Star Function
function drawStar(x, y) {

    ctx.font = "30px Arial";
    ctx.fillStyle = "gold";

    ctx.fillText("★", x, y);

    // Remove star after 400 milliseconds
    setTimeout(function () {

        ctx.clearRect(
            x - 20,
            y - 40,
            60,
            60
        );

    }, 400);
}