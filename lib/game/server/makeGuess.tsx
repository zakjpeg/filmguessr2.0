"use server";

import { createClient } from "@/utils/supabase/server";
import { scoreTitle } from "./scoreTitle";
import { scoreYear } from "./scoreYear";
import { SCORE_TITLE_WEIGHT } from "@/lib/constants/constants";

type MakeGuessResult = {
    error?: string,
    points?: number,
    answer?: {
        title: string,
        year: number,
    },
    guess?: {
        title: string,
        year: number,
    }
}

export default async function makeGuess(game_id: string, title: string, year: number) : Promise<MakeGuessResult> {
    const supabase = await createClient();
    
    // get the latest round, compare it to the truthful answer, generate a score, update the DB

    const {data: game, error} = await supabase
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

    if (error || !game) {
        console.error("[MAKEGUESS 1] Ran into a database error while making a guess:", error ?? "data is null");
        return {error: "We ran into an error. Please try again."};
    }

    // Isolate the most recent round
    const currentRound = game.game_round.reduce((latest, round) =>
        new Date(round.created_at).getTime() >
        new Date(latest.created_at).getTime()
            ? round
            : latest
    );

    // get the true name
    const trueTitle = currentRound.movie_frame.movie.title;
    const trueYear = currentRound.movie_frame.movie.year;

    // ZAK TODO: Calculate points using levenshtein distance
    // 60% title, 40% year

    // Calculate accuracy
    const titleAccuracy = scoreTitle(title, currentRound.movie_frame.movie.title);
    const yearAccuracy = scoreYear(year, currentRound.movie_frame.movie.year);

    // Use accuracy to make a concrete score
    const titlePoints = titleAccuracy * game.game_mode.points_per_round * SCORE_TITLE_WEIGHT;
    const yearPoints = yearAccuracy * game.game_mode.points_per_round * (1 - SCORE_TITLE_WEIGHT);

    // Sum all the points
    const totalPoints = Math.round(titlePoints + yearPoints);

    console.warn("-----")
    console.warn("GUESS:", title, year);
    console.warn("TRUTH:", currentRound.movie_frame.movie.title, currentRound.movie_frame.movie.year);
    console.warn("ACCURACY:", titleAccuracy, yearAccuracy);
    console.warn("SCORE:", totalPoints);

    const {error: updateError } = await supabase
    .from('game_round')
    .update({
        guess_title: title,
        guess_year: year,
        completed: true,
        points: totalPoints
    })
    .eq('round_id', currentRound.round_id);

    if (updateError) {
        console.error("Error updating game_round:", updateError);
    }

    return {
        points: totalPoints,
        guess: {
            title: title,
            year: year,
        },
        answer: {
            title: trueTitle,
            year: trueYear,
        }
    }


}