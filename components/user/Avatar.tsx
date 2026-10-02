"use client";

import { AVATAR_ICONS } from "@/lib/avatar/client/avatar.types";
import { useProfileStore } from "@/stores/useProfileStore";
import clsx from "clsx";
import { PiSpinnerGapLight } from "react-icons/pi";
import { TiUser } from "react-icons/ti";

export default function Avatar(
    {
        userId, 
        outline = false, 
        size = 12,
        profile,
        loading = false,
    }:{
        userId?: string | null | undefined, 
        outline?: boolean,
        size?:number
        profile?: Profile | null,
        loading?: boolean
    }
) {

    const {profile: selfProfile} = useProfileStore();

    if (!profile) {
        profile = selfProfile;
    }

    const Icon = (AVATAR_ICONS[profile?.icon as keyof typeof AVATAR_ICONS]) ?? TiUser;

    return (
        <div
        style={{
            width: size * 4,
            height: size * 4,
            fontSize: size * 2.5,
            backgroundColor: profile?.color_primary,
            color: profile?.color_secondary
        }}
        className={clsx(
            "shrink-0 flex justify-center items-center overflow-hidden bg-background rounded-full",
            outline && "outline-2 outline-accent outline-offset-2"
        )}
        >
            {loading
            ? <PiSpinnerGapLight className="animate-spin"/>
            : <Icon />
            }
        </div>
    )
}