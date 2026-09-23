"use client";
import Link from "next/link";
import { MdLocalMovies } from "react-icons/md";
import { FilmguessrLogo } from "./logo/FilmguessrLogo";

export function NavBar() {

    return (
        <div className="select-none px-16 h-16 w-full flex flex-row justify-between items-center">
            {/* Left Side */}
            <Link
            href="/"
            className="flex flex-row items-center gap-1 text-xl font-bold hover:text-accent cursor-pointer hover:-rotate-1 hover:scale-103 transition-all"
            >
                <FilmguessrLogo/>
            </Link>

            {/* Right Side */}
            <div className="flex flex-row gap-8 justify-end items-center">
                <Link
                href="/leaderboards"
                className="hover:text-accent cursor-pointer"
                >
                    Leaderboards
                </Link>
                <Link
                href="/profile"
                className="hover:text-accent cursor-pointer"
                >
                    <div className="w-8 h-8 bg-red-500 rounded-full"></div>
                </Link>
                
            </div>
            
        </div>
    )
}