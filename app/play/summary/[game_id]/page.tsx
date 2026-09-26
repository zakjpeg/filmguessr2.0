"use client";

import { Button } from "@/components/buttons/Button";
import ErrorMessage from "@/components/error/ErrorMessage";
import MovieFrameView from "@/components/game/MovieFrameView";
import BlurredImageBackground from "@/components/image/BlurredImageBackground";
import FgImage from "@/components/image/FgImage";
import { RANDOM_IMAGE_URL } from "@/lib/constants/constants";
import { nextRound } from "@/lib/game/server/nextRound";
import { createClient } from "@/utils/supabase/client";
import { SupabaseClient } from "@supabase/supabase-js";
import clsx from "clsx";
import dayjs from "dayjs";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { IoMdShare } from "react-icons/io";
import { PiSpinner } from "react-icons/pi";


export default function Play() {
    const supabase = createClient();
    const {game_id} = useParams<{game_id: string}>();

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const initializedRef = useRef(false);

    const [game, setGame] = useState<any>(null);

    useEffect(() => {

        if (initializedRef.current) {
            return;
        }

        initializedRef.current = true;

        const helper = async () => {
            //get game
            const {data: gameData, error: gameError} = await supabase
            .from('game')
            .select(`
                *,
                game_mode (
                    *
                ),
                game_round (
                    *,
                    movie_frame (
                        *,
                        movie (
                            *
                        )
                    )
                )
            `)
            .eq('game_id', game_id)
            .limit(1)
            .single();

            if (gameError) {
                setError("We couldn't load this game summary. Please try again later.");
                setLoading(false);
                return;
            }

            setGame(gameData);
            setLoading(false);

            console.log(gameData);

        }
        helper();

    }, [])

    return (
        <main className="relative flex-1 self-center max-w-7xl w-full h-20">

            <BlurredImageBackground src={RANDOM_IMAGE_URL}/>

            <ErrorMessage text={error}/>

            {loading &&
            <div className="w-full h-full flex justify-center items-center">
            <PiSpinner className="animate-spin"/>
            </div>
            }

            {game &&
            <div className="flex flex-col gap-5 items-center">
                <div className="flex flex-col items-center">
                    <p className="text-lg uppercase font-bold">{game.game_mode.name}</p>
                    <p className="text-3xl"><span className="font-bold text-accent text-7xl">{Number(game.game_round.map((round) => (round.points)).reduce((sum: number, num: number) => sum + num)).toLocaleString()}</span> /{Number(game.game_mode.total_rounds * game.game_mode.points_per_round).toLocaleString()}</p>
                    <p className="text-lg">Tagline goes here!</p>
                </div>
                <div className="flex flex-row w-[80%] items-center justify-center flex-wrap gap-4">
                    {game?.game_round?.map((round: any) => {

                        const img = round.movie_frame.image_url;
                        const title = round.movie_frame.movie.title;
                        const year = round.movie_frame.movie.year;
                        return (
                            <div key={round.round_id} className="relative z-1 hover:z-2 hover:scale-150 transition-normal duration-750 w-70 shrink-0 aspect-video rounded-2xl overflow-hidden">
                                <FgImage src={round.movie_frame.image_url} alt={`${title}, ${year}`} width={0} height={0}/>
                                <div className="p-3 leading-4 absolute bottom-0 w-full bg-linear-0 from-background to-transparent">
                                    <p><span className="font-bold">{title}</span>, {year}</p>
                                </div>
                                <p className=""></p>
                            </div>
                        )
                    })}
                </div>
                <div className="flex flex-row gap-4">
                    <div>
                <Button text="PLAY AGAIN" color="white"/>
                </div>
                <div>
                <Button text="SHARE" color="green" hover="green">
                    <div className="flex flex-row gap-2 items-center">
                        <IoMdShare />
                        <p>SHARE</p>
                    </div>
                </Button>
                </div>
                </div>
            </div>
            }

        </main>
    )
}