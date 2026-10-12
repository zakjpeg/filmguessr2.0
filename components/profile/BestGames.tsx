"use client";

import { useProfileStore } from "@/stores/useProfileStore";
import { useEffect, useRef, useState } from "react";
import ErrorMessage from "../error/ErrorMessage";
import { createClient } from "@/utils/supabase/client";
import FgImage from "../image/FgImage";
import Link from "next/link";
import { PiSpinner } from "react-icons/pi";

export default function BestGames() {
    const supabase = createClient();

    const {user, loading: profileLoading} = useProfileStore();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const initializedRef = useRef(false);

    const [bestGames, setBestGames] = useState<any[]>([]);

    const getBestGames = async () => {
        setError(null);
        setLoading(true);

        if (!user) {
            setLoading(false);
            setError("We couldn't fetch your best games. Please try again.");
            return;
        }

        const {data:gameData, error: gameError} = await supabase
        .from('game')
        .select(`
            *,
            game_mode (*),
            game_round (
                *,
                movie_frame (*)
            )    
        `)
        .eq('user_id', user.id)
        .eq('completed', true)
        .order('created_at', {ascending: false})
        .limit(20);

        if (gameError) {
            setLoading(false);
            setError("We couldn't fetch your best games. Please try again.");
            return;
        }

        // Sort by accuracy ( earned points / possible points )
        const sortedGameData = gameData.sort((a,b) => {

            const aRoundPoints = a.game_round.map((r) => (r.points))
            const aPoints = aRoundPoints.reduce((accumulator: number, currentValue: number) => accumulator + currentValue, 0);
            const aAccuracy = aPoints / a.game_mode.points_per_round * a.game_mode.total_rounds;

            const bRoundPoints = b.game_round.map((r) => (r.points))
            const bPoints = bRoundPoints.reduce((accumulator: number, currentValue: number) => accumulator + currentValue, 0);
            const bAccuracy = bPoints / b.game_mode.points_per_round * b.game_mode.total_rounds;

            return (aAccuracy - bAccuracy);

        })

        setBestGames(sortedGameData.slice().reverse());
        setLoading(false);

    }

    useEffect(() => {
        if (!user) {
            return;
        }

        if (initializedRef.current) {
            return;
        }

        initializedRef.current = true;

        const helper = async () => {
            getBestGames();
        }
        helper();

    }, [user])
    
    
    return (
        <div className="flex flex-col gap-2">
            <p className="uppercase font-bold text-3xl">BEST GAMES</p>
            {error &&
            <ErrorMessage text={error}/>
            }
            <div className="w-full flex flex-row gap-4 flex-nowrap overflow-x-auto scrollbar-none p-3 rounded-lg bg-primary/5">
                {loading ? 
                <div className="relative w-50 h-30 shrink-0 bg-background rounded-md overflow-hidden flex justify-center items-center shadow-md">
                    <PiSpinner className="animate-spin"/>
                </div>
                : (!bestGames || bestGames.length === 0 && (
                    <div className="relative w-50 h-30 shrink-0 bg-background rounded-md overflow-hidden flex flex-col justify-center items-center shadow-md">
                        <p className="">No games</p>
                        <p className="text-xs text-primary/50"><Link href="/play" className="underline">Play</Link> to start leveling up.</p>
                    </div>)
                )
                }
                
                {bestGames.map((game) => {

                    const points = game.game_round.map((round: any) => (round.points)).reduce((sum: number, num: number) => sum + num);
                    const totalPoints = game.game_mode.total_rounds * game.game_mode.points_per_round;
                    return (
                    <Link
                    href={`/play/summary/${game.game_id}`}
                    key={game.game_id} className="group transition-all relative w-50 h-30 shrink-0 bg-background rounded-md overflow-hidden cursor-pointer shadow-md">
                        <div className="z-1 w-full absolute top-0 left-0 p-2 uppercase font-bold text-xs bg-linear-180 from-black/75 to-transparent">{game.game_mode.name}</div>
                        <div className="z-1 w-full absolute bottom-0 left-0 py-1 px-2 bg-linear-0 from-black to-transparent">
                            <span className="text-accent font-bold text-xl">{Number(points).toLocaleString()}</span>
                            <span className="text-sm"> /{Number(totalPoints).toLocaleString()}</span>
                        </div>

                        <div className="flex flex-row w-full h-full">
                            {
                                game.game_round.slice(0, 2).map((round, idx) => {
                                    const img = round.movie_frame.image_url;
                                    return (
                                        <div key={round.movie_frame.frame_id + idx} className="flex-1 h-full w-full">
                                            <FgImage src={img} alt={points} width={80} height={80}/>
                                        </div>
                                    )
                                })
                            }
                        </div>

                        <div className="w-full h-full inset-0 absolute opacity-0 bg-black/40 group-hover:opacity-100 transition-opacity"/>

                    </Link>
                    )
                })}

            </div>
        </div>
    )
}