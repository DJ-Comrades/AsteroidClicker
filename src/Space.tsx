import { useRef, useEffect, useState } from 'react'
import useInterval from './useInterval';

const SIZE = 500;

interface Asteroid {
    x: number;
    y: number;
    vx: number;// velocity x
    vy: number; // velocity y
    radius: number;
}

function Space(){

    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    
    

    function getCanvas() {
        const canvas = canvasRef.current;
        if (canvas == null) {
            throw new Error("Failed to init canvas!");

        }
        return canvas;
    }

    function getContext() {
        const canvas = getCanvas()
        const context = canvas.getContext('2d');
        if (context == null) {
            throw new Error("Failed to init canvas!");

        }
        return context
    }

    function draw() {
        const canvas = getCanvas()
        const context = getContext()
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = 'black'
        context.fillRect(0, 0, context.canvas.width, context.canvas.height)
        context.strokeStyle = "white"
        context.lineWidth = 5
        asteroids.forEach(element => {
            context.beginPath()
            context.arc(element.x, element.y, element.radius, 0, 2 * Math.PI)
            context.stroke()
        });


    }

    function isOnCanvas(asteroid:Asteroid){
        if(asteroid.x + asteroid.radius < 0 || asteroid.x - asteroid.radius > SIZE){
            return false;
        } else if (asteroid.y + asteroid.radius < 0 || asteroid.y - asteroid.radius > SIZE){
            return false;
        } else {
            return true;
        }
    }

    function updateAsteroids(time: number) {
        if (previousTimeRef.current != undefined){
            const deltaTime = time - previousTimeRef.current;
            setAsteroids(prevAsteroids => {
                const updated = prevAsteroids.map(asteroid => ({
                    ...asteroid,
                    x: asteroid.x + asteroid.vx * deltaTime,
                    y: asteroid.y + asteroid.vy * deltaTime,
                })).filter(asteroid => isOnCanvas(asteroid));
                console.log(updated.length); // Now this will reflect the current length
                return updated
            });
        }
        previousTimeRef.current = time;
        requestId.current = requestAnimationFrame(updateAsteroids);
    }

    const [asteroids, setAsteroids] = useState<Asteroid[]>([])
    const requestId = useRef<number>();
    const previousTimeRef = useRef<number>();
    function init() {
        
        const canvas = getCanvas();
        canvas.width = SIZE;
        canvas.height = SIZE;
        requestId.current = requestAnimationFrame(updateAsteroids)
        return () => cancelAnimationFrame(requestId.current!)
    }
    useEffect(init, [])

    useEffect(draw, [asteroids])

    useInterval(addAsteroid, 2000)

    function addAsteroid() {
        if (asteroids.length >= 10) {
            return
        }
        const edge = Math.floor(Math.random() * 4)
        let x, y, vx, vy;
        const radius = Math.random() * 15 + 10
        switch (edge) {
            case 0: // Bot
                x = Math.random() * SIZE;
                y = SIZE + radius;
                vx = Math.random() - 0.5
                vy = Math.random()
                break;
            case 1: // Top
                x = Math.random() * SIZE;
                y = 0 - radius;
                vx = Math.random() - 0.5
                vy = Math.random() * -1
                break;
            case 2: // Left
                x = 0 - radius;
                y = Math.random() * SIZE;
                vx = Math.random()
                vy = Math.random() - 0.5
                break;
            case 3: // Right
                x = SIZE + radius;
                y = Math.random() * SIZE;
                vx = Math.random() * -1
                vy = Math.random() - 0.5
                break;
            default:
                x = 0
                y = 0
                vx = 0
                vy = 0
        }
        const newAsteroid: Asteroid = {
            x: x,
            y: y,
            radius: radius,
            vx: vx,
            vy: vy
        }
        setAsteroids([...asteroids, newAsteroid])
    }

    return <canvas ref={canvasRef} />

}

export default Space