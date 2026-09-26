"use client";

import clsx from "clsx";
import Image from "next/image";
import { useState } from "react";

export default function FgImage(
    {src, alt, width, height, className, transition, opacity = 100, objectFit = "cover"}:
    {src: string, alt: string, width: number, height: number, className?: string, transition?: boolean, opacity?: number, objectFit?: "cover" | "contain"}
) {
    const [loaded, setLoaded] = useState<boolean>(false);

    return (
        <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={clsx(
            className,
            "transition-all duration-300 w-full h-full",
            loaded ? `opacity-${opacity}` : "opacity-0"
        )}
        style={{
            objectFit: objectFit
        }}
        onLoad={() => {
            setLoaded(true);
        }}
        unoptimized
        />
    )
}