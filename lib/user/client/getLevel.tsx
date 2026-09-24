"use client";

export default function getLevel(points?: number): {level: number, xp: number, xpRemaining: number, xpRequired: number} | null {

    if (points === null || points === undefined) {
        return null;
    }

    const xpRequired = 75;
    const level = Math.floor(points/xpRequired) + 1;
    const xp = points % xpRequired
    const xpRemaining = xpRequired - xp;

    return {level, xp, xpRemaining, xpRequired}

}