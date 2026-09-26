"use client";

import FgImage from "./FgImage";
import Image from "next/image"

export default function BlurredImageBackground({src}:{src?: string | null}) {
    return (
        <FgImage
            src={src ?? ''}
            alt="Background" 
            className="pointer-events-none select-none fixed w-full h-full top-0 left-0 blur-2xl -z-1"
            width={1920}
            height={1080}
            opacity={25}
        />
    )
}