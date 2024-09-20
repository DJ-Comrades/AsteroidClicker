import { useRef, useEffect, useState } from 'react'
import useInterval from './useInterval';

const SIZE = 500;

interface Asteroid {
    x: number;
    y: number;
    vx: number;// velocity x
    vy: number; // velocity y
    radius: number;
    health: number
}

function Space({earnMoney}: { earnMoney: (value: number) => void; }){
    

    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const [asteroids, setAsteroids] = useState<Asteroid[]>([])
    const requestId = useRef<number>();
    const previousTimeRef = useRef<number>();
    const moneyBuffer = useRef<number>(0);

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
                return updated
            });
        }
        previousTimeRef.current = time;
        requestId.current = requestAnimationFrame(updateAsteroids);

    }
    function init() {
        
        const canvas = getCanvas();
        canvas.addEventListener("mousedown", function(e) {
            handleClick(canvas, e)
        });
        canvas.width = SIZE;
        canvas.height = SIZE;
        requestId.current = requestAnimationFrame(updateAsteroids)
        return () => cancelAnimationFrame(requestId.current!)
    }
    useEffect(init, [])

    useEffect(draw, [asteroids])

    useInterval(addAsteroid, 2000)

    function addAsteroid() {
        if (asteroids.length >= 100) {
            return
        }
        const velocityScale = 0.6
        const edge = Math.floor(Math.random() * 4)
        let x, y, vx, vy;
        const radius = Math.random() * 15 + 10
        switch (edge) {
            case 0: // Bot
                x = Math.random() * SIZE;
                y = SIZE + radius;
                vx = Math.random()*0.5 - 0.25
                vy = Math.random()*-0.4
                break;
            case 1: // Top
                x = Math.random() * SIZE;
                y = 0 - radius;
                vx = Math.random()*0.5 - 0.25
                vy = Math.random()*0.4
                break;
            case 2: // Left
                x = 0 - radius;
                y = Math.random() * SIZE;
                vx = Math.random() * 0.4
                vy = Math.random()*0.5 - 0.25
                break;
            case 3: // Right
                x = SIZE + radius;
                y = Math.random() * SIZE;
                vx = Math.random() * -0.4   
                vy = Math.random()*0.5 - 0.25
                break;
            default:
                throw Error("wtf")
        }
        const newAsteroid: Asteroid = {
            x: x,
            y: y,
            radius: radius,
            vx: vx * velocityScale,
            vy: vy * velocityScale,
            health: 100
        }
        setAsteroids([...asteroids, newAsteroid])
    }

    useEffect(() => {
        if (moneyBuffer.current > 0) {
            earnMoney(moneyBuffer.current * 3); // Call earnMoney after state update
            moneyBuffer.current = 0; // Reset the counter
        }
    }, [asteroids, earnMoney]);

    function handleClick(canvas: HTMLCanvasElement, event:MouseEvent){
        const mousePos = getCursorPosition(canvas, event)
        setAsteroids((asteroids) => asteroids.filter(item =>{
            if (isInsideAsteroid(item, mousePos)){
                moneyBuffer.current++;
                return false;
            } else { return true;}}))
    }

    function getDistance(x1: number, x2: number, y1: number, y2: number){
        const a = x1 - x2;
        const b = y1 - y2;
        return Math.sqrt( a*a + b*b );
    }

    function isInsideAsteroid(asteroid: Asteroid, mousePos:{x: number, y: number}) {
        const d = getDistance(mousePos.x, asteroid.x, mousePos.y, asteroid.y)
        return d < asteroid.radius

    }
    function getCursorPosition(canvas: HTMLCanvasElement, event: MouseEvent) {
        const rect = canvas.getBoundingClientRect()
        const x = event.clientX - rect.left
        const y = event.clientY - rect.top
        return {x,y}
    }

    return <canvas ref={canvasRef}/>

}

export default Space