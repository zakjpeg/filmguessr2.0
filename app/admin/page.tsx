"use client";

import { Button } from "@/components/buttons/Button";
import BlurredImageBackground from "@/components/image/BlurredImageBackground";
import { FilmguessrLogo } from "@/components/logo/FilmguessrLogo";
import Avatar from "@/components/user/Avatar";
import { XPLevel } from "@/components/user/XPLevel";
import { useProfileStore } from "@/stores/useProfileStore";
import Link from "next/link";
import { FaChartSimple } from "react-icons/fa6";
import { MdAdminPanelSettings, MdMovie } from "react-icons/md";

const ADMIN_PAGES = [
    {
        path: "/admin/addmovie",
        name: "Add Movies",
        icon: MdMovie,
    }
]


export default function Leaderboards() {

    const {profile, loading: profileLoading} = useProfileStore();

    return (
    <div className="flex flex-col flex-1 items-center justify-center">

      {/* Background Image */}
      <BlurredImageBackground src="https://picsum.photos/50/50"/>
      
      <main className="relative flex flex-1 w-full max-w-7xl flex-col bg-background rounded-xl mt-10 mb-10 divide-y divide-primary/10">

        {/* Title */}
        <div className="uppercase text-3xl font-bold px-6 py-4 flex flex-row gap-2 items-center">
            <MdAdminPanelSettings className="text-accent"/>
            <p>Admin</p>
        </div>

        <div className="flex flex-row flex-wrap gap-6 justify-start items-start p-12">
            {ADMIN_PAGES.map((page) => {

                return (
                    <Link key={page.path} href={page.path}>
                        <div className="group relative overflow-hidden w-32 h-42 bg-linear-0 from-primary/10 to-primary/5 rounded-xl border-[0.5px] border-primary/15 cursor-pointer hover:border-accent hover:from-accent/30 transition-all p-2">
                            <p>{page.name}</p>
                            <page.icon className="group-hover:text-accent absolute bottom-0 left-1/2 text-primary/15 -translate-x-1/2" size={100}/>
                        </div>
                    </Link>
                )
            })
                
            }
        </div>


      </main>
    </div>
    )
}