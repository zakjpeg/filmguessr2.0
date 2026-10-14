"use server";

export default async function getMovieBackdrops(tmdbMovieId: string) {
    try {
        const url = `https://api.themoviedb.org/3/movie/${tmdbMovieId}/images`;
        const res = await fetch(url, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${process.env.TMDB_BEARER_TOKEN}`,
                'Content-Type': 'application/json'
            }
        })

        if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
        }

        const json = await res.json();
        return json;
    } catch (error: any) {
        console.error('Fetch request failed:', error.message);
    }
}
        