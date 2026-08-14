

let canvas = document.createElement("canvas");

canvas.id = "myCanvas";
canvas.width = 800;
canvas.height = 500;
canvas.style.border = "1px solid black";

document.body.appendChild(canvas);


let ctx = canvas.getContext("2d");


let x = 100;
let y = 100;

let radius = 30;

let dx = 3;
let dy = 3;


function animate() {

    
    ctx.clearRect(0, 0, canvas.width, canvas.height);


    
    ctx.beginPath();

    ctx.arc(x, y, radius, 0, Math.PI * 2);

    ctx.fillStyle = "blue";

    ctx.fill();

    ctx.closePath();


    x += dx;
    y += dy;



    if (x + radius > canvas.width || x - radius < 0) {
        dx = -dx;
    }



    if (y + radius > canvas.height || y - radius < 0) {
        dy = -dy;
    }


    requestAnimationFrame(animate);
}



animate();
