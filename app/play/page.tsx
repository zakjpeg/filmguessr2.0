"use client";

import { Button } from "@/components/buttons/Button";
import ErrorMessage from "@/components/error/ErrorMessage";
import MovieFrameView from "@/components/game/MovieFrameView";
import BlurredImageBackground from "@/components/image/BlurredImageBackground";
import { RANDOM_IMAGE_URL } from "@/lib/constants/constants";
import { startGame } from "@/lib/game/server/startGame";
import clsx from "clsx";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useState } from "react";


export default function Play() {

    const router = useRouter();

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null)
    const [frame, setFrame] = useState<string | null>("https://m.media-amazon.com/images/M/MV5BMGMyYTcwMTAtNTJkYS00NjBiLWEyZWUtM2QyYWExNDQ5Y2FhXkEyXkFqcGc@._V1_FMjpg_UX2160_.jpg")

    const handleStartGame = async () => {
        setLoading(true);
        setError(null);

        const {game_id, error: startGameError} = await startGame();

        if (startGameError) {
            setError(startGameError);
            setLoading(false);
            return;
        }

        router.push(`/play/${game_id}`);
    }

    return (
        <main className="relative select-none flex-1 self-center max-w-7xl w-full h-20">

            <BlurredImageBackground src={frame ?? RANDOM_IMAGE_URL}/>
            
            <div className={clsx(
                "pt-10 flex-1 flex flex-row gap-12 items-center",
                "max-md:flex-col max-md:p-4"
            )}>

                {/* Play Screen */}
                <div className="flex-3 h-full flex flex-col gap-3">
                    <MovieFrameView 
                    src={frame}
                    showControls={false}
                    />
                </div>

                {/* Guess Menu */}
                <div className="text-center flex-2 flex flex-col items-center gap-8">
                    <p className="uppercase text-5xl font-bold">
                        CLASSIC
                    </p>
                    <p className="text-xl text-primary/75 font">
                        5 rounds. Guess the film&apos;s title and year to get a perfect score.
                    </p>

                    {error &&
                    <ErrorMessage text={error}/>
                    }

                    <div className="pt-10 flex w-80 self-center">
                        <Button
                        text={loading ? "STARTING..." : "START"}
                        color="green"
                        hover="red" 
                        onClick={handleStartGame}
                        disabled={loading}
                        />
                    </div>
                </div>

            </div>

        </main>
    )
}