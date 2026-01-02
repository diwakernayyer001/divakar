"use client";

import { useEffect, useState } from "react";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export function BackgroundIcon({ className }: { className?: string }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className={`pointer-events-none -z-20 ${className || ""}`}>
            <div className="w-full h-full relative opacity-90">
                <DotLottieReact
                    src="https://lottie.host/46c92fbe-ee5a-40d0-90ed-d2047684ec5b/SzhOoCfHwN.lottie"
                    loop
                    autoplay
                />
            </div>
        </div>
    )
}
