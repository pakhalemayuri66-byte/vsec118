

// Create Canvas
let canvas = document.createElement("canvas");

canvas.id = "myCanvas";
canvas.width = 800;
canvas.height = 500;
canvas.style.border = "1px solid black";

document.body.appendChild(canvas);


// Get Canvas Context
let ctx = canvas.getContext("2d");


// Ball Properties
let x = 100;
let y = 100;

let radius = 30;

let dx = 3;
let dy = 3;


// Animation Function
function animate() {

    // Clear Canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);


    // Draw Ball
    ctx.beginPath();

    ctx.arc(x, y, radius, 0, Math.PI * 2);

    ctx.fillStyle = "blue";

    ctx.fill();

    ctx.closePath();


    // Move Ball
    x += dx;
    y += dy;


    // Bounce from left and right
    if (x + radius > canvas.width || x - radius < 0) {
        dx = -dx;
    }


    // Bounce from top and bottom
    if (y + radius > canvas.height || y - radius < 0) {
        dy = -dy;
    }


    // Repeat Animation
    requestAnimationFrame(animate);
}


// Start Animation
animate();
