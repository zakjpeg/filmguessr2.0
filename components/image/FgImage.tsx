"use client";

import clsx from "clsx";
import Image from "next/image";
import { useState } from "react";

export default function FgImage(
    {src, alt, width, height, className, transition}:
    {src: string, alt: string, width: number, height: number, className?: string, transition?: boolean}
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
            "transition-opacity duration-300",
            loaded ? "opacity-100" : "opacity-0"
        )}
        />
    )
}