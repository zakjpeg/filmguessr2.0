"use server";

import { createClient } from "@/utils/supabase/server";

type MakeGuessResult = {
    error?: string,
    points?: number,
    answer?: {
        title: string,
        year: number,
    }
}

export default async function makeGuess(game_id: string, title: string, year: number) {
    const supabase = await createClient();
    
    // get the latest round, compare it to the truthful answer, generate a score, update the DB

    const {data, error} = await supabase
    .from('game')
    .select(`
        *,
        game_mode (*),
        game_round (
            *,
            movie_frame (
                *,
                movie (
                    *
                )
            )
        )    
    `)
    .eq('game_id', game_id)
    .single();

    if (error || !data) {
        console.error("[MAKEGUESS 1] Ran into a database error while making a guess:", error ?? "data is null");
        return {error: "We ran into an error. Please try again."};
    }

    // Isolate the most recent round
    const currentRound = data.game_round.reduce((latest, round) =>
        new Date(round.created_at).getTime() >
        new Date(latest.created_at).getTime()
            ? round
            : latest
    );

    // get the true name
    const trueTitle = currentRound.movie_frame.movie.title;
    const trueYear = currentRound.movie_frame.movie.year;
    console.log(trueTitle, trueYear);

    // ZAK TODO: Calculate points using levenshtein distance
    // 60% title, 40% year
    const points = 5000

    await supabase
    .from('game_round')
    .update({
        guess_title: title,
        guess_year: year,
        completed: true,
        points: points
    })
    .eq('round_id', currentRound);

    return {
        points: points,
        answer: {
            title: trueTitle,
            year: trueYear,
        }
    }


}