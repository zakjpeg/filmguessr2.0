"use client";

export function InsetBorder({
    width = 2,
    rounded = 24,
    opacity = 1,
    color = '#FFFFFF44',
}: {
    width?: number;
    rounded?: number;
    opacity?: number;
    color?: string;
}) {
    return (
        <div
            className={`pointer-events-none absolute inset-0 h-full w-full`}
            style={{
                opacity: opacity,
                borderRadius: rounded,
                borderWidth: width,
                borderColor: color,
                mixBlendMode: 'overlay'
            }}
        />
    );
}
