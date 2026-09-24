"use client";

import Link from "next/link"
import { DiVim } from "react-icons/di"
import { Button } from "@/components/buttons/Button";
import Image from "next/image";
import BlurredImageBackground from "@/components/image/BlurredImageBackground";
import { useEffect, useState } from "react";
import * as EmailValidator from "email-validator"
import { MdMovie, MdOutlineError } from "react-icons/md";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import signOut from "@/lib/auth/client/signOut";
import clsx from "clsx";
import { User } from "@supabase/supabase-js";
import Avatar from "@/components/user/Avatar";
import { useProfileStore } from "@/stores/useProfileStore";

export default function Profile() {
    const supabase = createClient();
    const router = useRouter();

    const {user, profile, loading: profileLoading} = useProfileStore();

    async function handleSignOut() {
        await signOut();
    }

    function handleEditProfile() {
        router.push("/profile/edit");
    }

    return (
        <div className={clsx(
            "bg-linear-0 from-accent/18 to-transparent gap-6 flex-1 flex flex-row justify-between items-start p-16",
            "max-md:flex-col max-md:p-2"
        )}>
            <BlurredImageBackground src="https://picsum.photos/500/500"/>
            {/* User Info */}
            <div className={clsx(
                "flex flex-col gap-6 bg-background p-8 rounded-2xl shadow-xl flex-1 h-full sticky top-10 overflow-hidden",
                "max-md:static max-md:w-full"
            )}>
                {/* User data */}
                <div className="flex flex-row gap-4 items-center">
                    <Avatar outline={true} profile={profile} loading={profileLoading}/>
                    <div className="flex flex-col w-full min-w-0">
                        {profile?.name &&
                        <p className="font-bold text-2xl line-clamp-1 text-ellipsis shrink">
                            @{profile?.name}
                        </p>
                        }
                        <p className="flex flex-row gap-1 items-center font-bold text-center w-fit px-2 rounded-sm uppercase text-background bg-accent">
                            <MdMovie className="text-background"/> -
                        </p>
                    </div>
                </div>

                {/* Analytics */}
                <table className="table-auto">
                    <tbody>
                        <tr>
                            <td>Matches Played</td>
                            <td>-</td>
                        </tr>
                        <tr>
                            <td>Accuracy</td>
                            <td>-</td>
                        </tr>
                    </tbody>
                </table>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                    <button className="bg-primary/5 hover:bg-primary/10 transition-colors py-2 rounded-md cursor-pointer"
                    onClick={handleEditProfile}
                    >
                        Edit Profile
                    </button>

                    <button className="bg-primary/5 hover:bg-primary/10 transition-colors py-2 rounded-md cursor-pointer"
                    onClick={() => {
                        // ZAK TODO: Add invite friends feature
                    }}
                    >
                        Invite Friends
                    </button>

                    <button className="opacity-50 hover:opacity-100 hover:bg-red-500/25 py-2 transition-colors rounded-md cursor-pointer"
                    onClick={handleSignOut}
                    >
                        Sign out
                    </button>
                </div>
            </div>

            {/* Game Info */}
            <div className={clsx(
                "flex flex-col gap-6 bg-background p-8 min-w-0 w-full rounded-2xl shadow-xl flex-4 min-w-0",
                "max-md:w-full"
            )}>
                <div className="flex flex-col gap-2">
                    <p className="uppercase font-bold text-3xl">RECENT GAMES</p>
                    <div className="w-full flex flex-row gap-4 flex-nowrap overflow-x-auto scrollbar-none p-3 rounded-lg bg-primary/5">
                        {Array.from({length: 20}).map((key, idx) => (
                            <div
                            key={idx}
                            className="shrink-0 w-50 h-30 bg-red-500 rounded-md"
                            />
                        ))}
                    </div>
                </div>

            </div>
        </div>
    )
}