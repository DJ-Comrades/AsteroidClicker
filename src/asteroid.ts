export interface Asteroid {
    x: number;
    y: number;
    vx: number; // velocity x
    vy: number; // velocity y
    radius: number;
    health: number;
}


export function isOnCanvas(asteroid: Asteroid, canvasSize: number): boolean {
    return !(asteroid.x + asteroid.radius < 0 || 
             asteroid.x - asteroid.radius > canvasSize || 
             asteroid.y + asteroid.radius < 0 || 
             asteroid.y - asteroid.radius > canvasSize);
}

export function createAsteroid(canvasSize: number): Asteroid {
    const velocityScale = 0.6;
    const edge = Math.floor(Math.random() * 4);
    let x, y, vx, vy;
    const radius = Math.random() * 15 + 10;

    switch (edge) {
        case 0: // Bottom
            x = Math.random() * canvasSize;
            y = canvasSize + radius;
            vx = Math.random() * 0.5 - 0.25;
            vy = Math.random() * -0.4;
            break;
        case 1: // Top
            x = Math.random() * canvasSize;
            y = 0 - radius;
            vx = Math.random() * 0.5 - 0.25;
            vy = Math.random() * 0.4;
            break;
        case 2: // Left
            x = 0 - radius;
            y = Math.random() * canvasSize;
            vx = Math.random() * 0.4;
            vy = Math.random() * 0.5 - 0.25;
            break;
        case 3: // Right
            x = canvasSize + radius;
            y = Math.random() * canvasSize;
            vx = Math.random() * -0.4;
            vy = Math.random() * 0.5 - 0.25;
            break;
        default:
            throw new Error("Invalid edge");
    }

    return {
        x,
        y,
        radius,
        vx: vx * velocityScale,
        vy: vy * velocityScale,
        health: 100
    };
}