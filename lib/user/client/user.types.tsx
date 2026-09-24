"use client";

type Profile = {
    name: string,
    icon: string,
    color_primary: string,
    color_secondary: string,
    created_at: string,
    experience?: {
        points: number,
    }
}