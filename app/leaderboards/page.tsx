"use client";

import { Button } from "@/components/buttons/Button";
import BlurredImageBackground from "@/components/image/BlurredImageBackground";
import { FilmguessrLogo } from "@/components/logo/FilmguessrLogo";
import Avatar from "@/components/user/Avatar";
import { XPLevel } from "@/components/user/XPLevel";
import { useProfileStore } from "@/stores/useProfileStore";
import Link from "next/link";
import { FaChartSimple } from "react-icons/fa6";


export default function Leaderboards() {

    const {profile, loading: profileLoading} = useProfileStore();

    return (
    <div className="flex flex-col flex-1 items-center justify-center">

      {/* Background Image */}
      <BlurredImageBackground src="https://picsum.photos/50/50"/>
      
      <main className="relative flex flex-1 w-full max-w-7xl flex-col bg-background rounded-xl mt-10 mb-10 divide-y divide-primary/10">

        {/* Title */}
        <div className="uppercase text-3xl font-bold px-6 py-4 flex flex-row gap-2 items-center">
            <FaChartSimple className="text-accent"/>
            <p>Leaderboards</p>
        </div>

        <div className="flex flex-row divide-x divide-primary/10 h-full">
        
            <div className="w-48 h-full p-2 flex flex-col">

                <div className="flex flex-row gap-4 items-center p-3">
                    <Avatar outline={true} profile={profile} loading={profileLoading} size={10}/>
                    <div className="flex flex-col w-full">
                        {profile?.name &&
                        <p className="font-bold text-xl line-clamp-1 text-ellipsis shrink">
                            @{profile?.name}
                        </p>
                        }
                        <XPLevel size="small" />
                    </div>
                </div>
                
                <div className="hover:bg-primary/7 cursor-pointer px-2 py-1 rounded-sm">XP Level</div>
                <div className="hover:bg-primary/7 cursor-pointer px-2 py-1 rounded-sm">Perfect Wins</div>
                <div className="hover:bg-primary/7 cursor-pointer px-2 py-1 rounded-sm">Games Played</div>
                <div className="hover:bg-primary/7 cursor-pointer px-2 py-1 rounded-sm">5k Wins</div>
                <div className="hover:bg-primary/7 cursor-pointer px-2 py-1 rounded-sm">5k Wins</div>

            </div>

            <div className="w-full h-full p-2 px-6">
                main area
            </div>
        
        </div>


      </main>
    </div>
    )
}