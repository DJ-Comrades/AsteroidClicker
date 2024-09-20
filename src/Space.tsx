// src/Space.tsx
import { useRef, useEffect, useState } from 'react';
import Star, { drawAsteroids, getCanvas, getContext } from './canvasUtils';
import { createAsteroid, isOnCanvas, Asteroid } from './asteroid';
import useInterval from './useInterval';


function Space({ earnMoney }: { earnMoney: (value: number) => void; }) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [asteroids, setAsteroids] = useState<Asteroid[]>([]);
    const requestId = useRef<number>();
    const previousTimeRef = useRef<number>();
    const moneyBuffer = useRef<number>(0);
    const [stars, setStars] = useState<Star[]>([])
    const numStars = 20;
    const SIZE = useRef<number>(500)

    useEffect(()=>{
        SIZE.current = window.innerWidth * 0.25
        console.log(SIZE.current)
    }, [SIZE])

    useEffect(()=>{
        const genStars=[]
        for (let i = 0; i < numStars; i++) {
            const x = Math.random() * SIZE.current;
            const y = Math.random() * SIZE.current;
            const radius = Math.random() * 2;
            genStars.push({ x, y, radius });
        }
        setStars(genStars)
    }, [])
    

    function init() {
        const canvas = getCanvas(canvasRef);
        canvas.width = SIZE.current;
        canvas.height = SIZE.current;
        canvas.addEventListener("mousedown", (e) => handleClick(canvas, e));
        requestId.current = requestAnimationFrame(updateAsteroids);
        return () => cancelAnimationFrame(requestId.current!);
    }

    useEffect(init, []);

    useEffect(() => {
        drawAsteroids(getContext(canvasRef), asteroids, stars);
    }, [asteroids]);

    useEffect(() => {
        earnMoney(moneyBuffer.current * 3); moneyBuffer.current = 0
    }, [asteroids, moneyBuffer])

    useInterval(addAsteroid, 2000);

    function updateAsteroids(time: number) {
        if (previousTimeRef.current !== undefined) {
            const deltaTime = time - previousTimeRef.current;
            setAsteroids(prevAsteroids => {
                return prevAsteroids.map(asteroid => ({
                    ...asteroid,
                    x: asteroid.x + asteroid.vx * deltaTime,
                    y: asteroid.y + asteroid.vy * deltaTime,
                })).filter((item) => isOnCanvas(item, SIZE.current));
            });
        }
        previousTimeRef.current = time;
        requestId.current = requestAnimationFrame(updateAsteroids);
    }

    function addAsteroid() {
        if (asteroids.length < 100) {
            setAsteroids(prev => [...prev, createAsteroid(SIZE.current)]);
        }
    }

    function handleClick(canvas: HTMLCanvasElement, event: MouseEvent) {
        const mousePos = getCursorPosition(canvas, event);
        setAsteroids(prev => prev.filter(item => {
            if (isInsideAsteroid(item, mousePos)) {
                moneyBuffer.current++;
                return false;
            }
            return true;
        }));
    }

    function isInsideAsteroid(asteroid: Asteroid, mousePos: { x: number; y: number }) {
        const distance = Math.sqrt((mousePos.x - asteroid.x) ** 2 + (mousePos.y - asteroid.y) ** 2);
        return distance < asteroid.radius;
    }

    function getCursorPosition(canvas: HTMLCanvasElement, event: MouseEvent) {
        const rect = canvas.getBoundingClientRect();
        return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    }

    return <canvas ref={canvasRef} />;
}

export default Space;
