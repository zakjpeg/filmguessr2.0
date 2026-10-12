"use client";

type Profile = {
    name: string,
    icon: string,
    color_primary: string,
    color_secondary: string,
    created_at: string,
    profile_experience?: {
        points: number,
    },
    admin?: {
        id?: number,
        user_id?: string,
        created_at?: Date
    }
}