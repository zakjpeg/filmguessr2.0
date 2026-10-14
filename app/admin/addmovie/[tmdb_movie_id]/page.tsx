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
import FgImage from "@/components/image/FgImage";
import getConfiguration from "@/lib/tmdb/configuration/getConfiguration";
import getPopularMovies from "@/lib/tmdb/discover/getPopularMovies";
import dayjs from "dayjs";
import MovieListing from "@/components/admin/AdminMovieListing";
import AdminMovieListing from "@/components/admin/AdminMovieListing";
import { useParams, useSearchParams } from "next/navigation";
import getMovieDetails from "@/lib/tmdb/discover/getMovieDetails";
import getMovieBackdrops from "@/lib/tmdb/discover/getMovieBackdrops";
import { FaMinus, FaPlus } from "react-icons/fa";
import { createClient } from "@/utils/supabase/client";

export default function Leaderboards() {
    const supabase = createClient();
    const [config, setConfig] = useState<any>(null);
    const [movie, setMovie] = useState<any>(null);
    const [existingRecord, setExistingRecord] = useState<any>(null);
    const [backdrops, setBackdrops] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const { tmdb_movie_id } = useParams();

    const [selectedBackdrops, setSelectedBackdrops] = useState<any[]>([]);

    useEffect(() => {
        const helper = async () => {

            const tmdbConfig = await getConfiguration();
            setConfig(tmdbConfig);

            console.log("config", tmdbConfig)

            if (tmdb_movie_id) {

                const [resDetails, resBackdrops] = await Promise.all([
                    getMovieDetails(tmdb_movie_id as string),
                    getMovieBackdrops(tmdb_movie_id as string)
                ])
                setMovie(resDetails);
                setBackdrops(resBackdrops.backdrops);

                console.log(resDetails);

                const {data: existingMovie} = await supabase
                .from('movie')
                .select(`
                    *,
                    movie_frame (
                        *
                    )
                `)
                .eq('title', resDetails.title)
                .single();

                console.warn(existingMovie);

                if (existingMovie) {
                    setExistingRecord(existingMovie);
                }
            }
        };
        helper();
    }, []);

    useEffect(() => {
        if (!movie) {
            return;
        }
    }, [movie]);

    const handleAddFrames = async () => {
        if (!selectedBackdrops) {
            return;
        }

        setLoading(true);

        const {data, error: movieError} = await supabase
        .from('movie')
        .upsert({
            title: movie.title,
            year: Number(dayjs(movie.release_date).format("YYYY")),
            description: movie.overview,
            url: movie.homepage,
            genre: movie.genres.map((g: any) => (g.name)),
        }, {
            onConflict: 'title',
        })
        .select()
        .single();

        if (!data) {
            alert("Error adding movie: " + JSON.stringify(movieError));
            setLoading(false);
            return;
        }

        const {error: framesError} = await supabase
        .from('movie_frame')
        .upsert(
            selectedBackdrops.map((b) => ({
                movie_id: data.movie_id,
                image_url: config?.images.secure_base_url + config.images.backdrop_sizes[3] + b
            })
            ), {
                onConflict: 'image_url',
                ignoreDuplicates: true,
            }
        )

        if (framesError) {
            alert("Error adding frames: " + JSON.stringify(framesError));
            setLoading(false);
            return;
        }

        setSelectedBackdrops([]);

    }

    return (
        <div className="flex flex-col flex-1 items-center justify-center">
            <main className="px-10 relative flex flex-1 w-full flex-col bg-background rounded-xl">
                <hr className="text-primary/10" />

                {/* Title */}
                <div className="uppercase text-3xl font-bold px-6 py-4 flex flex-row gap-2 items-center">
                    <MdAdminPanelSettings className="text-accent" />
                    <p>
                        <Link href="/admin">Admin</Link>{" "}
                        <span className="text-primary/60 font-light">
                            / ADD MOVIE / MOVIE
                        </span>
                    </p>
                </div>

                {config && (
                    <div className="flex flex-col gap-6 mb-10">
                        <div className="w-full flex flex-row gap-4">
                            <FgImage
                                src={
                                    config?.images.secure_base_url +
                                    config.images.poster_sizes[3] +
                                    movie.poster_path
                                }
                                width={10}
                                height={20}
                                alt={movie.title}
                                className="max-w-32 rounded-lg"
                            />
                            <div className="flex flex-col gap-4 max-w-150">
                                <p className="text-3xl font-bold">{movie.title}, {dayjs(movie.release_date).format("YYYY")}</p>
                                <div className="flex flex-row gap-2 flex-wrap items-center">
                                    {
                                        existingRecord &&
                                        <p
                                        className="rounded-full bg-accent text-background text-sm px-3 py-0.5 uppercase"
                                        >
                                            Added {dayjs(existingRecord.created_at).format("MMM D, YYYY")}
                                        </p>
                                    }
                                    {movie.genres.map((genre: any) => (
                                        <p
                                        key={genre.id}
                                        className="rounded-full bg-primary/5 text-primary/50 text-sm px-3 py-0.5"
                                        >
                                            {genre.name}
                                        </p>
                                    ))}
                                </div>
                                <div className="flex flex-row gap-2">
                                    {
                                        existingRecord?.movie_frame?.length > 0 &&
                                        <div className="flex flex-row gap-4 overflow-x-auto scrollbar-none">
                                        {
                                        existingRecord.movie_frame.map((f: any) => (
                                            <div
                                            key={f.frame_id}
                                            className="group cursor-pointer relative w-32 shrink-0"
                                            >
                                                <FgImage
                                                src={
                                                    f.image_url
                                                }
                                                width={10}
                                                height={20}
                                                alt={existingRecord.title}
                                                className="rounded-lg"
                                                />
                                            </div>
                                        ))
                                        }
                                        </div>
                                    }
                                </div>
                                <p className="text-sm bg-primary/5 p-2 rounded-lg text-primary/75">
                                    {movie.overview}
                                </p>
                            </div>
                        </div>

                        {selectedBackdrops.length > 0 && (
                            <div className="flex flex-col gap-2">
                                <p className="text-2xl uppercase font-bold">Selected Backdrops</p>
                                <div className="bg-black/35 rounded-3xl flex flex-col overflow-hidden">
                                    <div className="p-4 w-full flex flex-row gap-4 overflow-x-auto scrollbar-none">
                                        {selectedBackdrops.map((b: any) => (
                                            <button
                                                key={b}
                                                className="group cursor-pointer relative w-64 shrink-0"
                                                onClick={() => {
                                                    setSelectedBackdrops((prev) =>
                                                        prev.filter((pb) => pb !== b),
                                                    );
                                                }}
                                            >
                                                <FgImage
                                                    src={
                                                        config?.images.secure_base_url +
                                                        config.images.backdrop_sizes[3] +
                                                        b
                                                    }
                                                    width={10}
                                                    height={20}
                                                    alt={movie.title}
                                                    className="group-hover:brightness-50 rounded-lg duration-50"
                                                />
                                                <FaMinus
                                                    className="hidden group-hover:block absolute top-3 right-3"
                                                    size={24}
                                                />
                                            </button>
                                        ))}
                                        
                                    </div>
                                    <div className="p-4 bg-black/20 w-full flex flex-row gap-4 justify-end items-center">
                                        <div>
                                            <Button
                                                color="green"
                                                hover="white"
                                                text={"add " + selectedBackdrops.length + (selectedBackdrops.length > 1 ? " frames" : " frame")}
                                                onClick={handleAddFrames}
                                            />
                                        </div>
                                    </div>

                                </div>
                            </div>
                        )}

                        {backdrops && (
                            <div className="flex flex-col gap-2">
                                <p className="text-2xl uppercase font-bold">Backdrops</p>
                                <div className="bg-black/35 rounded-xl p-4 w-full flex flex-row gap-4 flex-wrap">
                                    {backdrops.map((b: any) => (
                                        <button
                                            key={b.file_path}
                                            className="group cursor-pointer relative"
                                            onClick={() => {
                                                setSelectedBackdrops((prev) => [
                                                    ...prev.filter((pb) => pb !== b.file_path),
                                                    b.file_path,
                                                ]);
                                            }}
                                        >
                                            <FgImage
                                                src={
                                                    config?.images.secure_base_url +
                                                    config.images.backdrop_sizes[3] +
                                                    b.file_path
                                                }
                                                width={10}
                                                height={20}
                                                alt={movie.title}
                                                className="group-hover:brightness-50 max-w-64 rounded-lg duration-50"
                                            />
                                            <FaPlus
                                                className="hidden group-hover:block absolute top-3 right-3"
                                                size={24}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
