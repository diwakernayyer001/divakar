"use client";

import { useEffect, useState } from "react";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { motion, AnimatePresence } from "motion/react";

interface FestivalData {
    active: boolean;
    festival: {
        name: string;
        lottieUrl: string;
        link?: string;
    } | null;
}

export function FestivalBadge() {
    const [data, setData] = useState<FestivalData | null>(null);

    useEffect(() => {
        fetch("/api/proxy/festival")
            .then((res) => res.json())
            .then((data) => setData(data))
            .catch((err) => console.error("Failed to fetch festival badge:", err));
    }, []);

    if (!data?.active || !data.festival) return null;

    const lottieUrl = data.festival.lottieUrl.replace(
        'https://d316u7k0d46mo4.cloudfront.net/festival-badges',
        '/api/proxy/lottie'
    );

    const Content = (
        <div 
            className="rounded-full bg-[#1a0b2e] border border-white/10 overflow-hidden shadow-lg transition-transform duration-300 group-hover:scale-105"
            style={{ 
                width: '32px', 
                height: '32px',
                minWidth: '32px',
                minHeight: '32px',
                maxWidth: '32px',
                maxHeight: '32px',
                position: 'relative'
            }}
        >
            <div style={{ 
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%) scale(0.15)',
                width: '200px',
                height: '200px'
            }}>
                <DotLottieReact
                    src={lottieUrl}
                    loop
                    autoplay
                />
            </div>
        </div>
    );

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative group cursor-pointer"
                style={{ display: 'inline-flex', flexShrink: 0 }}
                title={data.festival.name}
            >
                <div className="absolute -inset-0.5 bg-yellow-500/30 rounded-full blur-sm opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
                {data.festival.link ? (
                    <a
                        href={data.festival.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                    >
                        {Content}
                    </a>
                ) : (
                    Content
                )}
            </motion.div>
        </AnimatePresence>
    );
}
