"use client";

import { MdMovie } from "react-icons/md";

export function FilmguessrLogo() {
    return (
        <div className="flex flex-row gap-2 items-center justify-start">
            <MdMovie className="text-accent"/>
            <p className="font-bold">FILMGUESSR</p>
        </div>
    )
}