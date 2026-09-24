"use client";

export default function getLevel(points?: number): {level: number, xp: number, xpRemaining: number} | null {

    if (points === null || points === undefined) {
        return null;
    }


    const level = Math.floor(points/75);
    const xp = points % 75
    const xpRemaining = 75 - xp;

    return {level, xp, xpRemaining}

}