
import { Asteroid } from "./asteroid";

interface Star {
    x: number;
    y: number;
    radius: number;
}

export default Star;

export function getCanvas(canvasRef: React.RefObject<HTMLCanvasElement>): HTMLCanvasElement {
    const canvas = canvasRef.current;
    if (canvas == null) {
        throw new Error("Failed to init canvas!");
    }
    return canvas;
}

export function getContext(canvasRef: React.RefObject<HTMLCanvasElement>): CanvasRenderingContext2D {
    const canvas = getCanvas(canvasRef);
    const context = canvas.getContext('2d');
    if (context == null) {
        throw new Error("Failed to init context!");
    }
    return context;
}

export function drawAsteroids(context: CanvasRenderingContext2D, asteroids: Asteroid[], stars: Star[]) {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    drawBackground(context, stars);
    context.strokeStyle = "white";
    context.lineWidth = 5;

    asteroids.forEach(asteroid => {
        context.beginPath();
        context.arc(asteroid.x, asteroid.y, asteroid.radius, 0, 2 * Math.PI);
        context.stroke();
    });
}
function drawBackground(context: CanvasRenderingContext2D, stars: Star[]) {
    context.fillStyle = 'black';
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    stars.forEach((star)=>{

        
        context.beginPath();
        context.arc(star.x, star.y, star.radius, 0, 2 * Math.PI);
        context.fillStyle = 'white';
        context.fill();
    }
    )
}

