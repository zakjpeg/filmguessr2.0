"use client";

import dayjs from "dayjs";
import FgImage from "../image/FgImage";
import Link from "next/link";

export default function AdminMovieListing({tmdbMovie, tmdbConfig}:{tmdbMovie: any, tmdbConfig: any}) {
    const movie = tmdbMovie;
    const config = tmdbConfig;

    const url = "/admin/addmovie/" + movie.id
    return (
        <Link href={url} target="_blank" className="flex flex-row gap-2 w-1/5 min-w-70 hover:bg-primary/10 p-2 rounded-xl cursor-pointer transition-colors">
            <FgImage
            src={config?.images.secure_base_url + config.images.poster_sizes[0] + movie.poster_path}
            width={10}
            height={20}
            alt={movie.title}
            className="max-w-24 rounded-lg"
            />
            <div className="flex flex-col">
                <p className="text-xl font-bold">{movie.title}</p>
                <p className="">{dayjs(movie.release_date).format('YYYY')}</p>
                <p className="opacity-25 text-xs">{movie.id}</p>
            </div>
        </Link>
    )
}