"use server";

import { MAX_GAME_ROUNDS } from "@/lib/constants/constants";
import { createClient } from "@/utils/supabase/server";

type nextRoundReturnType = {
    frame?: string,
    roundNumber?: number,
    gameOver?: any,
    error?: string
}

export async function nextRound(gameId: string): Promise<nextRoundReturnType> {
    const supabase = await createClient();

    // Get user
    const {data: {user}, error: userError} = await supabase.auth.getUser();
    if (!user || !user.id) {
        console.error("1[STARTGAME] Encountered a user error while creating new game:", userError)
        return {error: "Couldn't find user. Try signing back in"};
    }

    // Check if user has fulfilled maximum number of rounds
    const prevRoundsQuery = supabase
    .from('game_round')
    .select('*')
    .eq('game_id', gameId);

    const gamemodeQuery =  supabase
    .from('game')
    .select(`
        game_mode (
            total_rounds
        )
        `)
    .eq('game_id', gameId)
    .order('created_at', {ascending: false})
    .limit(1)
    .single();


    const [
        {data: prevRoundsData, error: prevRoundsError}, 
        {data: gamemodeData, error:gamemodeError}
    ] = await Promise.all([
        prevRoundsQuery,
        gamemodeQuery,
    ])

    const numPrevRounds = prevRoundsData?.length ?? 0;

    if (gamemodeError) {
        console.error("[NEXTROUND 1] Encountered a database error while advancing round:", prevRoundsError)
    }

    if (prevRoundsError) {
        console.error("[NEXTROUND 2] Encountered a database error while advancing round:", prevRoundsError)
        return {error: "Couldn't advance to the next round. Please try again."};
    }

    if (prevRoundsData === null) {
        console.error("[NEXTROUND 3] Encountered a database error while advancing round (roundCount is null)")
        return {error: "Couldn't advance to next round. Please try again."};
    }

    // If user has fulfilled maximum number of rounds, end game
    if ((numPrevRounds) >= (gamemodeData?.game_mode.total_rounds ?? MAX_GAME_ROUNDS)) {
        // update game and return all the data
        const {error: gameError} = await supabase
        .from('game')
        .update({
            completed: true,
        })
        .eq('game_id', gameId)

        if (gameError) {
            console.error("[NEXTROUND 4] Encountered a database error while advancing round:", gameError)
            return {error: "We couldn't advance to next round. Please try again."};
        }

        // ZAK TODO: give user experience points

        // return game over
        return {
            gameOver: true
        }

    }

    // Otherwise, create a new round
    // Get a random frame
    const {count: frameCount, error: frameCountError} = await supabase
    .from('movie_frame')
    .select('*', {count: 'exact', head: true});

    if (frameCountError) {
        console.error("[NEXTROUND 5] Encountered a database error while advancing round:", frameCountError)
        return {error: "Couldn't advance to next round. Please try again."};
    }

    if (frameCount === null) {
        console.error("[NEXTROUND 6] Encountered a database error while advancing round (roundCount is null)")
        return {error: "Couldn't advance to next round. Please try again."};
    }

    const randomFrameAltId = Math.floor(Math.random() * frameCount + 1);

    const {data: randomFrame, error: randomFrameError} = await supabase
    .from('movie_frame')
    .select('frame_id')
    .eq('frame_id_alt', randomFrameAltId)
    .limit(1)
    .single();


    // Create a new round
    const {data: roundData, error: roundError} = await supabase
    .from('game_round')
    .insert({
        game_id: gameId,
        frame_id: randomFrame?.frame_id,
    })
    .select(`
        *,
        movie_frame (*)
    `)
    .single();

    if (roundError) {
        console.error("[NEXTROUND 7] Encountered a database error while advancing round:", roundError);
        return {error: "Couldn't advance to next round. Please try again."};
    }

    if (roundData === null) {
        console.error("[NEXTROUND 8] Encountered a database error while advancing round (roundData is null)")
        return {error: "Couldn't advance to next round. Please try again."};
    }

    return {
        frame: roundData.movie_frame.image_url,
        roundNumber: numPrevRounds,
    };
}