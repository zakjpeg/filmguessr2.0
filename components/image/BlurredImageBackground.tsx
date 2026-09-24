"use client";

import FgImage from "./FgImage";

export default function BlurredImageBackground({src}:{src: string}) {
    return (
        <img
            src={src}
            alt="Background" 
            className="pointer-events-none select-none fixed w-full h-full top-0 left-0 blur-3xl opacity-25 -z-1"
            width={1920}
            height={1080}
        />
    )
}