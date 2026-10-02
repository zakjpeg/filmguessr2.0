"use client";

import getLevel from "@/lib/user/client/getLevel";
import { useProfileStore } from "@/stores/useProfileStore";
import clsx from "clsx";
import { MdMovie } from "react-icons/md";


export function XPLevel({profile, size = "large"}:{profile?: Profile, size?: "small" | "large"}) {

    const {profile: selfProfile} = useProfileStore();
    const experience = getLevel(profile?.profile_experience?.points ?? selfProfile?.profile_experience?.points)

    if (!experience) {
        return null;
    }

    return (
        <div
        title={"Level " + experience?.level}
        className={clsx(
            "flex flex-row gap-1 items-center font-bold text-center w-fit h-fit rounded-sm uppercase text-background bg-accent",
            size === "large" ? "px-2" : "text-sm px-1 py-0"
        )}>
            <MdMovie className="text-background" size={16}/> {experience?.level}
        </div>
    )
}