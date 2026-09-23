"use client";

import clsx from "clsx";
import { TiUser } from "react-icons/ti";

export default function Avatar(
    {
        userId, 
        outline = false, 
        size = 12,
        profile
    }:{
        userId?: string | null | undefined, 
        outline?: boolean,
        size?:number
        profile?: any
    }
) {

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
            {profile?.icon
            ? profile.icon
            : <TiUser/>
            }
            
        </div>
    )
}