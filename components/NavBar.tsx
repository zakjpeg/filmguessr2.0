"use client";
import Link from "next/link";
import { MdLocalMovies } from "react-icons/md";
import { FilmguessrLogo } from "./logo/FilmguessrLogo";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useMemo, useState } from "react";
import { User } from "@supabase/supabase-js";
import { BiCircleThreeQuarter } from "react-icons/bi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { PiSpinnerGapLight } from "react-icons/pi";
import { GiFilmProjector } from "react-icons/gi";
import { TiUserAdd } from "react-icons/ti";
import Avatar from "./user/Avatar";
import { useProfileStore } from "@/stores/useProfileStore";
import clsx from "clsx";
import getLevel from "@/lib/user/client/getLevel";
import { XPLevel } from "./user/XPLevel";

export function NavBar() {

    const supabase = createClient();
    const {profile, loading} = useProfileStore();
    const experience = useMemo(() => getLevel(profile?.profile_experience?.points), [profile?.profile_experience?.points])

    return (
        <div className={clsx(
            "select-none px-16 h-16 w-full flex flex-row justify-between items-center",
            "max-md:px-4"
        )}>
            {/* Left Side */}
            <Link
            href="/"
            className="flex flex-row items-center gap-1 text-xl font-bold hover:text-accent cursor-pointer hover:-rotate-1 hover:scale-103 transition-all"
            >
                <FilmguessrLogo/>
            </Link>

            {/* Right Side */}
            <div className="flex flex-row gap-8 justify-end items-center">
                <Link
                href="/leaderboards"
                className="hover:text-accent cursor-pointer"
                >
                    Leaderboards
                </Link>
                {loading
                ? <div className="flex justify-center items-center w-8 h-8 bg-background rounded-full">
                        <PiSpinnerGapLight className="animate-spin"/>
                    </div>
                : profile
                    ?   <div className="flex flex-row items-center gap-4">
                            <XPLevel />
                            <Link
                            href="/profile"
                            className="hover:text-accent cursor-pointer"
                            >
                                <Avatar size={8} outline={true} profile={profile ?? undefined}/>
                            </Link>
                        </div>
                    :   <Link
                        href="/join"
                        className="hover:text-accent cursor-pointer"
                        >
                            <div 
                            title="Join"
                            className="flex justify-center items-center w-8 h-8 bg-background rounded-full outline-2 outline-accent outline-offset-2">
                                <TiUserAdd size={24} className="text-primary/75"/>
                            </div>
                        </Link>
                }
                
            </div>
            
        </div>
    )
}