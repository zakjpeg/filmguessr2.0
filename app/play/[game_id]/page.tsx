"use client";

import { Button } from "@/components/buttons/Button";
import ErrorMessage from "@/components/error/ErrorMessage";
import MovieFrameView from "@/components/game/MovieFrameView";
import BlurredImageBackground from "@/components/image/BlurredImageBackground";
import { CHARLIM_GUESS_TITLE, RANDOM_IMAGE_URL } from "@/lib/constants/constants";
import makeGuess from "@/lib/game/server/makeGuess";
import { nextRound } from "@/lib/game/server/nextRound";
import { createClient } from "@/utils/supabase/client";
import { SupabaseClient } from "@supabase/supabase-js";
import clsx from "clsx";
import dayjs from "dayjs";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const EXAMPLE_FRAMES = [
    "https://m.media-amazon.com/images/M/MV5BMTg1MjMwNTQ3MF5BMl5BanBnXkFtZTgwMDg4MjkzNTM@._V1_FMjpg_UX2048_.jpg",
    "https://m.media-amazon.com/images/M/MV5BMjQwNTgxMTEwNl5BMl5BanBnXkFtZTgwNDc4MjkzNTM@._V1_FMjpg_UX2048_.jpg"
]


export default function Play() {
    const supabase = createClient();
    const router = useRouter();
    const {game_id} = useParams<{game_id: string}>();

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const initializedRef = useRef(false);

    const [gamemode, setGamemode] = useState<any>(null);
    const [currentRound, setCurrentRound] = useState<number>(0);

    const [frame, setFrame] = useState<string | null>( )
    const [inputYear, setInputYear] = useState<number>(1994);
    const inputTitleRef = useRef<HTMLInputElement>(null);

    const [guessResult, setGuessResult] = useState<any>(null);

    const getGamemode = async () => {
        setLoading(true);
        setError(null);
        
        const {data: gamemodeData, error: gamemodeError} = await supabase
        .from('game')
        .select(`
            game_mode (*)
        `)
        .eq('game_id', game_id)
        .order('created_at', {ascending: false})
        .limit(1)
        .single();

        if (gamemodeError) {
            setLoading(false);
            setError("Encountered an error while fetching gamemode. Please try again later");
            return;
        }

        if (!gamemodeData?.game_mode) {
            setLoading(false);
            setError("Couldn't fetch gamemode. Please try again later.");
            return;
        }

        setLoading(false);
        setGamemode(gamemodeData.game_mode);
    }

    const handleNextRound = async () => {
        setLoading(true);
        setError(null);
        
        const {frame, roundNumber, error: nextRoundError, gameOver} = await nextRound(game_id);
        
        if (nextRoundError) {
            setError(nextRoundError);
            setLoading(false);
        }

        // If game is over, show game summary
        if (gameOver) {
            router.replace(`/play/summary/${game_id}`)
        }

        setFrame(frame);
        setCurrentRound(roundNumber ?? 0);
        setLoading(false);
        setGuessResult(null);

    }

    const handleGuess = async () => {
        setLoading(true);
        const result = await makeGuess(game_id, inputTitleRef.current?.value ?? '', inputYear);

        if (result.error) {
            setLoading(false);
            setError(result.error);
            return;
        }

        setLoading(false);
        setGuessResult(result);
        if (inputTitleRef.current) {
            inputTitleRef.current.value = "";
        }
    }

    useEffect(() => {
        if (initializedRef.current) {
            return;
        }

        initializedRef.current = true;

        const helper = async () => {
            // get gamemode
            await getGamemode();
            // get next round
            await handleNextRound();
        }
        helper();

    }, [])

    return (
        <main className="relative select-none flex-1 self-center max-w-7xl w-full h-20">

            <BlurredImageBackground src={frame ?? RANDOM_IMAGE_URL}/>
            
            <div className={clsx(
                "pt-10 flex-1 flex flex-row gap-12 items-center",
                "max-md:flex-col max-md:p-4"
            )}>

                {/* Play Screen */}
                <div className="shrink-0 flex-3 h-full flex flex-col gap-3">
                    <MovieFrameView 
                    src={frame}
                    title={guessResult?.answer.title ?? null}
                    year={guessResult?.answer.year}
                    revealAnswer
                    />
                    {/* Round counter */}
                    <div className="px-10 h-1 w-full flex flex-row justify-start items-center gap-2">
                    {Array.from({length: gamemode?.total_rounds ?? 0}).map((key, idx) => (
                        <div 
                        key={idx} 
                        className={clsx(
                            "flex-1 bg-white h-full rounded-full",
                            idx <= currentRound ? "" : "opacity-25"
                        )}
                        />
                    ))
                    }
                    </div>
                </div>

                {/* Guess / Answer Menu */}
                {guessResult
                ?
                    <div className="flex-2 flex flex-col items-center w-full gap-8">
                        <p className="text-3xl">
                            <span className="font-bold text-accent text-[5rem]">
                            {guessResult.points.toLocaleString()}
                            </span> /{Number(gamemode.points_per_round).toLocaleString()}</p>
                        <div className="flex flex-col w-full">
                            <p className="text-xl ml-4">Title</p>
                            <div 
                            className="focus:outline-0 text-ellipsis focus:bg-primary/5 w-full text-primary font-bold text-4xl py-2 px-4 rounded-2xl"
                            >
                                {guessResult.guess.title}
                            </div>
                        </div>
                        <div className="flex flex-col w-full">
                            <p className="text-xl ml-4">
                                Year
                            </p>
                            <div
                            className="font-bold text-4xl px-4 py-2 rounded-2xl focus:outline-0 focus:bg-primary/5"
                            >
                                {(guessResult.guess.year !== guessResult.answer.year) &&
                                <span className="opacity-70">{guessResult.guess.year} → </span>
                                }
                                <span>{guessResult.answer.year}</span>
                            </div>
                        </div>
                        {error &&
                        <ErrorMessage text={error}/>
                        }
                        <div className="pt-10 flex w-80 self-center">
                            <Button text="next" color="white" hover="green" disabled={loading} onClick={handleNextRound}/>
                        </div>
                    </div>
                :
                    <div className="flex-2 flex flex-col gap-8">
                        <div className="flex flex-col">
                            <p className="text-xl ml-4">Title</p>
                            <input 
                            type="text" 
                            className="focus:outline-0 text-ellipsis focus:bg-primary/5 w-full text-primary font-bold text-4xl py-2 px-4 rounded-2xl"
                            placeholder="Movie Name"
                            autoFocus
                            maxLength={CHARLIM_GUESS_TITLE}
                            ref={inputTitleRef}
                            />
                        </div>
                        <div className="flex flex-col">
                            <p className="text-xl ml-4">Year</p>
                            <input type="number"
                            value={inputYear}
                            onChange={(e) => {
                                setInputYear(Number(e.target.value))
                            }}
                            min={1950}
                            max={dayjs().year()}
                            className="font-bold text-4xl px-4 py-2 rounded-2xl focus:outline-0 focus:bg-primary/5"
                            />
                            <input 
                            type="range" 
                            min={1950}
                            max={dayjs().year()}
                            value={inputYear}
                            onChange={(e) => {
                                setInputYear(Number(e.target.value));
                            }}
                            className="w-full h-1 appearance-none cursor-pointer rounded-full bg-white outline-none
            track:bg-white moz-track:bg-white
            thumb:appearance-none thumb:w-1 thumb:h-6 thumb:bg-green-500 thumb:rounded-none
            moz-thumb:appearance-none moz-thumb:w-1 moz-thumb:h-6 moz-thumb:bg-green-500 moz-thumb:rounded-none accent-accent"
                            />
                        </div>
                        {error &&
                        <ErrorMessage text={error}/>
                        }
                        <div className="pt-10 flex w-80 self-center">
                            <Button text="guess" color="green" hover="red" disabled={loading} onClick={handleGuess}/>
                        </div>
                    </div>
                }
            </div>

        </main>
    )
}