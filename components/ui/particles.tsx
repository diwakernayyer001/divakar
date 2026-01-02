"use client";

import React, { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

interface ParticlesProps {
    className?: string;
    quantity?: number;
    staticity?: number;
    ease?: number;
    refresh?: boolean;
}

export default function Particles({
    className = "",
    quantity = 200,
    staticity = 50,
    ease = 50,
    refresh = false,
}: ParticlesProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const canvasContainerRef = useRef<HTMLDivElement>(null);
    const context = useRef<CanvasRenderingContext2D | null>(null);
    const circles = useRef<any[]>([]);
    const mouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
    const canvasSize = useRef<{ w: number; h: number }>({ w: 0, h: 0 });
    const dpr = typeof window !== "undefined" ? window.devicePixelRatio : 1;
    const { theme } = useTheme();

    useEffect(() => {
        if (canvasRef.current) {
            context.current = canvasRef.current.getContext("2d");
        }
        initCanvas();
        animate();
        window.addEventListener("resize", initCanvas);

        return () => {
            window.removeEventListener("resize", initCanvas);
        };
    }, [theme]);

    useEffect(() => {
        onMouseMove();
    }, []);

    useEffect(() => {
        initCanvas();
    }, [refresh]);

    const initCanvas = () => {
        resizeCanvas();
        drawParticles();
    };

    const onMouseMove = () => {
        if (canvasRef.current) {
            window.addEventListener("mousemove", (e) => {
                const rect = canvasRef.current!.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                mouse.current.x = x;
                mouse.current.y = y;
            });
            window.addEventListener("touchmove", (e) => {
                const rect = canvasRef.current!.getBoundingClientRect();
                const x = e.touches[0].clientX - rect.left;
                const y = e.touches[0].clientY - rect.top;
                mouse.current.x = x;
                mouse.current.y = y;
                // Prevent scrolling while interacting with particles
                // Note: This effectively disables scrolling on mobile while touching the screen.
                // If this is too aggressive, we might restrict it to specific conditions.
                if (e.cancelable) {
                    e.preventDefault();
                }
            }, { passive: false });
            window.addEventListener("touchstart", (e) => {
                const rect = canvasRef.current!.getBoundingClientRect();
                const x = e.touches[0].clientX - rect.left;
                const y = e.touches[0].clientY - rect.top;
                mouse.current.x = x;
                mouse.current.y = y;
                // Optional: prevent default here too if needed, but touchmove is key for scrolling
            });
        }
    };

    const resizeCanvas = () => {
        if (canvasContainerRef.current && canvasRef.current && context.current) {
            circles.current.length = 0;
            canvasSize.current.w = canvasContainerRef.current.offsetWidth;
            canvasSize.current.h = canvasContainerRef.current.offsetHeight;
            canvasRef.current.width = canvasSize.current.w * dpr;
            canvasRef.current.height = canvasSize.current.h * dpr;
            canvasRef.current.style.width = `${canvasSize.current.w}px`;
            canvasRef.current.style.height = `${canvasSize.current.h}px`;
            context.current.scale(dpr, dpr);
        }
    };

    const circleParams = () => {
        const x = Math.floor(Math.random() * canvasSize.current.w);
        const y = Math.floor(Math.random() * canvasSize.current.h);
        const translateX = 0;
        const translateY = 0;
        const size = Math.floor(Math.random() * 2) + 0.1;
        const alpha = 0;
        const targetAlpha = parseFloat((Math.random() * 0.6 + 0.1).toFixed(1));
        const dx = Math.random() * 0.5 + 0.2; // Simulating wind to the right
        const dy = (Math.random() - 0.5) * 0.1; // Minimal vertical drift
        const magnetism = 0.1 + Math.random() * 4;
        return {
            x,
            y,
            translateX,
            translateY,
            size,
            alpha,
            targetAlpha,
            dx,
            dy,
            magnetism,
        };
    };

    const drawCircle = (circle: any, update = false) => {
        if (context.current) {
            const { x, y, translateX, translateY, size, alpha } = circle;
            context.current.beginPath();
            context.current.arc(x + translateX, y + translateY, size, 0, 2 * Math.PI);
            context.current.fillStyle = theme === "dark"
                ? `rgba(255, 255, 255, ${alpha})`
                : `rgba(0, 0, 0, ${alpha})`;
            context.current.fill();

            if (!update) {
                circles.current.push(circle);
            }
        }
    };

    const clearContext = () => {
        if (context.current) {
            context.current.clearRect(
                0,
                0,
                canvasSize.current.w,
                canvasSize.current.h,
            );
        }
    };

    const drawParticles = () => {
        clearContext();
        const particleCount = quantity;
        for (let i = 0; i < particleCount; i++) {
            const circle = circleParams();
            drawCircle(circle);
        }
    };

    const remapValue = (
        value: number,
        start1: number,
        end1: number,
        start2: number,
        end2: number,
    ) => {
        const remapped =
            ((value - start1) * (end2 - start2)) / (end1 - start1) + start2;
        return remapped > 0 ? remapped : 0;
    };

    const animate = () => {
        clearContext();
        circles.current.forEach((circle: any, i: number) => {
            // Handle the alpha value
            const edge = [
                circle.x + circle.translateX - circle.size, // distance from left edge
                canvasSize.current.w - circle.x - circle.translateX - circle.size, // distance from right edge
                circle.y + circle.translateY - circle.size, // distance from top edge
                canvasSize.current.h - circle.y - circle.translateY - circle.size, // distance from bottom edge
            ];
            const closestEdge = edge.reduce((a, b) => Math.min(a, b));
            const remapClosestEdge = parseFloat(
                remapValue(closestEdge, 0, 20, 0, 1).toFixed(2),
            );
            if (remapClosestEdge > 1) {
                circle.alpha += 0.02;
                if (circle.alpha > circle.targetAlpha) {
                    circle.alpha = circle.targetAlpha;
                }
            } else {
                circle.alpha = circle.targetAlpha * remapClosestEdge;
            }
            circle.x += circle.dx;
            circle.y += circle.dy;

            // Interaction: Attract towards mouse
            const targetTranslateX = (mouse.current.x - circle.x) / (staticity / circle.magnetism);
            const targetTranslateY = (mouse.current.y - circle.y) / (staticity / circle.magnetism);

            circle.translateX += (targetTranslateX - circle.translateX) / ease;
            circle.translateY += (targetTranslateY - circle.translateY) / ease;

            if (
                circle.x < -circle.size ||
                circle.x > canvasSize.current.w + circle.size ||
                circle.y < -circle.size ||
                circle.y > canvasSize.current.h + circle.size
            ) {
                // circle is out of the canvas, reset to left side to create flow
                circles.current.splice(i, 1);
                const newCircle = circleParams();
                newCircle.x = -newCircle.size; // start from left
                newCircle.y = Math.floor(Math.random() * canvasSize.current.h);
                drawCircle(newCircle);
            } else {
                drawCircle(
                    {
                        ...circle,
                        x: circle.x,
                        y: circle.y,
                        translateX: circle.translateX,
                        translateY: circle.translateY,
                        alpha: circle.alpha,
                    },
                    true,
                );
            }
        });
        window.requestAnimationFrame(animate);
    };

    return (
        <div className={className} ref={canvasContainerRef} aria-hidden="true" style={{ position: 'fixed', inset: 0, zIndex: -10, pointerEvents: 'none' }}>
            <canvas ref={canvasRef} />
        </div>
    );
}
