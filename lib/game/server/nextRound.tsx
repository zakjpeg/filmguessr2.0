"use server";

import { MAX_GAME_ROUNDS } from "@/lib/constants/constants";
import grantExperience from "@/lib/user/server/grantExperience";
import { useProfileStore } from "@/stores/useProfileStore";
import { createClient } from "@/utils/supabase/server";

type nextRoundReturnType = {
    frame?: string,
    roundNumber?: number,
    gameOver?: boolean,
    error?: string
}

export async function nextRound(gameId: string): Promise<nextRoundReturnType> {
    const supabase = await createClient();

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
        return {error: "Couldn't advance to the next round. Please try again."};
    }

    // If user has fulfilled maximum number of rounds, end game
    if ((numPrevRounds) >= (gamemodeData?.game_mode.total_rounds ?? MAX_GAME_ROUNDS)) {
        // update game and return all the data
        const {data: game, error: gameError} = await supabase
        .from('game')
        .update({
            completed: true,
        })
        .eq('game_id', gameId)
        .select(`
            *,
            game_round (
                points
            ),
            game_mode (
                total_rounds,
                points_per_round
            )    
        `)
        .single();

        if (gameError) {
            console.error("[NEXTROUND 4] Encountered a database error while advancing round:", gameError)
            return {error: "We couldn't advance to next round. Please try again."};
        }

        // Calculate guess accuracy from this game
        const accuracyDividend = game.game_round.map((round: any) => (round.points)).reduce((accumulator: number, currentValue: number) => accumulator + currentValue, 0);
        const accuracyDivisor = game.game_mode.total_rounds * game.game_mode.points_per_round;
        const accuracy = accuracyDividend / accuracyDivisor;

        console.warn("accuracyDividend: ", accuracyDividend);
        console.warn("accuracyDivisor: ", accuracyDivisor);
        console.warn("accuracy: ", accuracy);

        // Grant experience based on points earned
        const {error} = await grantExperience(accuracy);
        // refresh profile store to update experience
        useProfileStore.getState().refresh();

        // return game over
        return {
            gameOver: true
        }

    }

    // Otherwise, create a new round
    // Get a random frame
    const {data: randomFrame } = await supabase
    .rpc('get_random_frame')
    .single();

    console.error(randomFrame);

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
        return {error: "Could not advance to next round. Please try again."};
    }

    if (roundData === null) {
        console.error("[NEXTROUND 8] Encountered a database error while advancing round (roundData is null)")
        return {error: "We couldn't advance to next round. Please try again."};
    }

    return {
        frame: roundData.movie_frame.image_url,
        roundNumber: numPrevRounds,
    };
}