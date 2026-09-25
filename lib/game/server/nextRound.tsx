"use server";

import { MAX_GAME_ROUNDS } from "@/lib/constants/constants";
import { createClient } from "@/utils/supabase/server";

type nextRoundReturnType = {
    frame_id: string
    round_id: string
} | {
    game: any,
} | {
    error: string,
}

export async function nextRound(gameId: string): Promise<nextRoundReturnType> {
    const supabase = await createClient();

    // Get user
    const {data: {user}, error: userError} = await supabase.auth.getUser();
    if (!user || !user.id) {
        console.error("[STARTGAME] Encountered a user error while creating new game:", userError)
        return {error: "Couldn't find user. Try signing back in"};
    }

    // Check if user has fulfilled maximum number of rounds
    const {data: prevRoundsData, error: prevRoundsError} = await supabase
    .from('game_round')
    .select('*', {count: 'exact', head: true})
    .eq('game_id', gameId);

    if (prevRoundsError) {
        console.error("[NEXTROUND] Encountered a database error while advancing round:", prevRoundsError)
        return {error: "Couldn't advance to next round. Please try again."};
    }

    if (prevRoundsData === null) {
        console.error("[NEXTROUND] Encountered a database error while advancing round (roundCount is null)")
        return {error: "Couldn't advance to next round. Please try again."};
    }

    // If user has fulfilled maximum number of rounds, end game
    if (prevRoundsData.length >= MAX_GAME_ROUNDS) {
        let pointsSummary = 0;
        prevRoundsData.map((round) => {
            pointsSummary += round.points
        })
        // update game and return all the data
        const {data: gameData, error: gameError} = await supabase
        .from('game')
        .update({
            completed: true,
            points_summary: pointsSummary,
        })
        .eq('game_id', gameId)
        .select(`
            *,
            game_round (*)
        `)
        .order('created_at', {ascending: false})
        .limit(1)
        .single();

        if (!gameData || gameError) {
            console.error("[NEXTROUND] Encountered a database error while advancing round:", gameError ?? "gameData is null")
            return {error: "Couldn't advance to next round. Please try again."};
        }

        // return
        return {
            game: gameData
        }

    }

    // Otherwise, create a new round
    // Get a random frame
    const {count: frameCount, error: frameCountError} = await supabase
    .from('movie_frame')
    .select('*', {count: 'exact', head: true});

    if (frameCountError) {
        console.error("[NEXTROUND] Encountered a database error while advancing round:", frameCountError)
        return {error: "Couldn't advance to next round. Please try again."};
    }

    if (frameCount === null) {
        console.error("[NEXTROUND] Encountered a database error while advancing round (roundCount is null)")
        return {error: "Couldn't advance to next round. Please try again."};
    }

    const randomFrameId = Math.floor(Math.random() * frameCount);

    // Create a new round
    const {data: roundData, error: roundError} = await supabase
    .from('game_round')
    .insert({
        game_id: gameId,
        frame_id: randomFrameId,

    })
    .select(`
        round_id,
        frame_id
    `)
    .single();

    if (roundError) {
        console.error("[NEXTROUND] Encountered a database error while advancing round:", roundError);
        return {error: "Couldn't advance to next round. Please try again."};
    }

    if (roundData === null) {
        console.error("[NEXTROUND] Encountered a database error while advancing round (roundData is null)")
        return {error: "Couldn't advance to next round. Please try again."};
    }

    return {
        round_id: roundData.round_id,
        frame_id: roundData.frame_id,
    };
}