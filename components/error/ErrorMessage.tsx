"use client";

import { MdOutlineError } from "react-icons/md";

export default function ErrorMessage({text}:{text: string | null}) {

    if (!text) {
        return null;
    }

    return (
        <div className="shrink flex flex-row items-center gap-3 p-3 rounded-md border-red-500 text-red-500 bg-red-500/10">
            <MdOutlineError className="shrink-0" size={26}/>
            <p>{text}</p>
        </div>
    )
}