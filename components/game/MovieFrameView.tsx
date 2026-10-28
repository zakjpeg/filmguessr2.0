"use client";

import { useEffect, useState } from "react";
import { InsetBorder } from "../style/InsetBorder";
import FgImage from "../image/FgImage";
import { MdOutlineFullscreen, MdOutlineFullscreenExit } from "react-icons/md";
import clsx from "clsx";
import { CgSpinner } from "react-icons/cg";
import { PiSpinner } from "react-icons/pi";

export default function MovieFrameView(
    {src, title, year, revealAnswer = false, showControls = true}:
    {src?: string | null, title?: string, year?: number | string, revealAnswer?: boolean, showControls?: boolean}) 
{

    const [loaded, setLoaded] = useState<boolean>(false);
    const [objectFit, setObjectFit] = useState<"cover" | "contain">("cover");
    const ObjectFitIcon = objectFit === "cover" ? MdOutlineFullscreenExit : MdOutlineFullscreen ;
    const handleClickObjectFit = () => {
        setObjectFit((prev) => (prev === "cover" ? "contain" : "cover"));
    }

    const handleNewSource = async () => {
        setLoaded(false);
    }

    useEffect(() => {
        const helper = async () => {
            await handleNewSource();
        }
        helper();
    }, [src])

    return (
        <div className="shrink-0 flex justify-center items-center select-none group overflow-hidden relative max-h-120 aspect-4/3 rounded-3xl shadow-lg bg-linear-0 bg-background/75">

            {/* Image */}
            {src
            ? <FgImage 
            src={src}
            alt={(revealAnswer ? title : null) ?? "FILMGUESSR"}
            width={100}
            height={100}
            objectFit={objectFit}
            />
            :
            <CgSpinner className="animate-spin opacity-25" size={24}/>
            }

            {/* User Controls */}
            {(src && showControls) && 
            <div className="w-full flex flex-row gap-3 justify-end items-center bg-linear-0 from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-150 text-white absolute bottom-0 right-0 p-3">
                <ObjectFitIcon
                size={32}
                className="cursor-pointer"
                onClick={handleClickObjectFit} 
                />
            </div>
            }

            {/* Answer Reveal */}
            {revealAnswer && title &&
            <div className="transition-opacity duration-500 pointer-events-none absolute top-0 left-0 px-4 py-3 bg-linear-170 from-background to-transparent from-5% to-25% w-full h-full">
                <p className="text-3xl text-shadow-md font-bold">{revealAnswer ? title : null}</p>
                <p className="text-2xl">{revealAnswer ? year : null}</p>
            </div>
            }
            

            {/* Inset border for style*/}
            <InsetBorder />

        </div>
        
    )

}