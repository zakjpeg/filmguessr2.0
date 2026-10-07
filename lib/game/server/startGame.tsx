"use server";

import { createClient } from "@/utils/supabase/server";
import dayjs from "dayjs";

type startGameProps = {
    game_id: string | null,
    error: string | null
}

export async function startGame(gamemode: string | undefined = "classic"): Promise<startGameProps> {
    const supabase = await createClient();

    // Get user
    const {data: {user}, error: userError} = await supabase.auth.getUser();

    // Check for incomplete games started in the past hour
    if (user) {

        const {data: existingGameData, error: existingGameError} = await supabase
        .from('game')
        .select('game_id')
        .eq('user_id', user?.id)
        .eq('completed', false)
        .eq('gamemode', gamemode)
        .order('created_at', {ascending: false})
        .limit(1)
        .single();

        if (existingGameError) {
            console.error("[STARTGAME] Encountered a database error while creating new game:", existingGameError)
        }

        // If ongoing game exists, resume it
        if (existingGameData) {
            return {
                game_id: existingGameData.game_id,
                error: null
            };
        }

    }


    // Otherwise, create a new game
    const {data: gameData, error: gameError} = await supabase
    .from('game')
    .insert({
        user_id: user?.id ?? null,
        gamemode: gamemode,
    })
    .select('game_id')
    .single();

    if (gameError) {
        console.error("[STARTGAME] Encountered a database error while creating new game:", gameError)
        return {
            game_id: null,
            error: "Couldn't start game."
        }
    }

    return {
        game_id: gameData.game_id,
        error: null,
    };

}