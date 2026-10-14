"use client";

import { Button } from "@/components/buttons/Button";
import BlurredImageBackground from "@/components/image/BlurredImageBackground";
import { FilmguessrLogo } from "@/components/logo/FilmguessrLogo";
import Avatar from "@/components/user/Avatar";
import { XPLevel } from "@/components/user/XPLevel";
import { useProfileStore } from "@/stores/useProfileStore";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FaChartSimple } from "react-icons/fa6";
import { MdAdminPanelSettings, MdMovie } from "react-icons/md";
import {Image} from "next/image"
import FgImage from "@/components/image/FgImage";
import getConfiguration from "@/lib/tmdb/configuration/getConfiguration";
import getPopularMovies from "@/lib/tmdb/discover/getPopularMovies";
import dayjs from "dayjs";
import MovieListing from "@/components/admin/AdminMovieListing";
import AdminMovieListing from "@/components/admin/AdminMovieListing";

export default function Leaderboards() {

    const {profile, loading: profileLoading} = useProfileStore();
    const pageRef = useRef<number>(1);

    const [config, setConfig] = useState<any>(null);
    const [movies, setMovies] = useState<any[]>([]);

    const handleGetMovies = async () => {

        const popularMovies = await getPopularMovies(pageRef.current);

        setMovies((prev) => [
            ...prev,
            ...popularMovies.results.filter((m: any) => (!prev.map((p) => (p.id)).includes(m.id)))
        ])

        pageRef.current = pageRef.current + 1;

    }

    useEffect(() => {
        const helper = async () => {
            const tmdbConfig = await getConfiguration();
            setConfig(tmdbConfig);
            console.log(tmdbConfig);
            await handleGetMovies();
        }
        helper();
    }, [])


    return (
    <div className="flex flex-col flex-1 items-center justify-center">

      <main className="px-10 relative flex flex-1 w-full flex-col bg-background rounded-xl">
        <hr className="text-primary/10"/>

        {/* Title */}
        <div className="uppercase text-3xl font-bold px-6 py-4 flex flex-row gap-2 items-center">
            <MdAdminPanelSettings className="text-accent"/>
            <p><Link href="/admin">Admin</Link> <span className="text-primary/60 font-light">/ ADD MOVIE</span></p>
        </div>


        <div className="flex flex-row flex-wrap">
        {config && movies.map((movie) => (
            <AdminMovieListing key={movie.id} tmdbMovie={movie} tmdbConfig={config}/>
        ))}
        </div>

        <div className="self-center flex justify-center pt-10 pb-20">
        <Button text="See more" onClick={handleGetMovies} color="green" hover="green"/>
        </div>

      </main>
    </div>
    )
}