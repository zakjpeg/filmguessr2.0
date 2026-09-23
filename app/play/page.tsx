"use client";

import { Button } from "@/components/buttons/Button";
import BlurredImageBackground from "@/components/image/BlurredImageBackground";
import clsx from "clsx";
import dayjs from "dayjs";
import { useState } from "react";



export default function Play() {

    const [movie, setMovie] = useState<{img: string}>({img: "https://picsum.photos/1080/1080"});
    const [guessYear, setGuessYear] = useState<number>(1994);

    return (
        <main className="relative select-none flex-1 self-center max-w-7xl w-full h-20">

            <BlurredImageBackground src={movie.img}/>
            
            <div className="pt-10 flex-1 flex flex-row gap-12 items-center">

                {/* Play Screen */}
                <div className="flex-3 h-full flex flex-col gap-3">
                    <div className="rounded-3xl max-h-120 overflow-hidden w-full bg-black shadow-lg">
                        <img 
                        src={movie.img} 
                        alt="Filmguessr" 
                        className="w-full h-full"
                        />
                    </div>
                    {/* Round counter */}
                    <div className="px-10 h-1 w-full flex flex-row justify-start items-center gap-2">
                    {Array.from({length: 5}).map((key, idx) => (
                        <div 
                        key={idx} 
                        className={clsx(
                            "flex-1 bg-white h-full rounded-full",
                            idx < 3 ? "" : "opacity-25"
                        )}
                        />
                    ))
                    }
                    </div>
                </div>

                {/* Guess Menu */}
                <div className="flex-2 flex flex-col gap-8">
                    <div className="flex flex-col">
                        <p className="text-xl ml-4">Title</p>
                        <input 
                        type="text" 
                        className="focus:outline-0 text-ellipsis focus:bg-primary/5 w-full text-primary font-bold text-4xl py-2 px-4 rounded-2xl"
                        placeholder="Movie Name"
                        />
                    </div>
                    <div className="flex flex-col">
                        <p className="text-xl ml-4">Year</p>
                        <input type="number"
                        value={guessYear}
                        onChange={(e) => {
                            setGuessYear(Number(e.target.value))
                        }}
                        min={1950}
                        max={dayjs().year()}
                        className="font-bold text-4xl px-4 py-2 rounded-2xl focus:outline-0 focus:bg-primary/5"
                        />
                        <input 
                        type="range" 
                        min={1950}
                        max={dayjs().year()}
                        value={guessYear}
                        onChange={(e) => {
                            setGuessYear(Number(e.target.value));
                        }}
                        className="w-full h-1 appearance-none cursor-pointer rounded-full bg-white outline-none
         track:bg-white moz-track:bg-white
         thumb:appearance-none thumb:w-1 thumb:h-6 thumb:bg-green-500 thumb:rounded-none
         moz-thumb:appearance-none moz-thumb:w-1 moz-thumb:h-6 moz-thumb:bg-green-500 moz-thumb:rounded-none accent-accent"
                        />
                    </div>
                    <div className="pt-10 flex w-80 self-center">
                        <Button text="guess" color="green" hover="red" />
                    </div>
                </div>

            </div>

        </main>
    )
}