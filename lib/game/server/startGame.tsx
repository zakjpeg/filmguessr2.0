"use server";

import { createClient } from "@/utils/supabase/server";
import dayjs from "dayjs";

type startGameReturnType = {
    game_id: string,
} | {
    error: string
}

export async function startGame(gamemode?: string | undefined): Promise<startGameReturnType> {
    const supabase = await createClient();

    // Get user
    const {data: {user}, error: userError} = await supabase.auth.getUser();
    if (!user || !user.id) {
        console.error("[STARTGAME] Encountered a user error while creating new game:", userError)
        return {error: "Couldn't find user. Try signing back in"};
    }

    // Check for incomplete games started in the past hour
    const {data: existingGameData} = await supabase
    .from('game')
    .select('game_id')
    .eq('user_id', user.id)
    .eq('completed', false)
    .eq('gamemode', gamemode)
    .lt('created_at', dayjs().subtract(1, 'hour').toISOString())
    .order('created_at', {ascending: false})
    .limit(1)
    .maybeSingle();

    // If ongoing game exists, resume it
    if (existingGameData) {
        return {game_id: existingGameData.game_id};
    }

    // Otherwise, create a new game
    const {data: gameData, error: gameError} = await supabase
    .from('game')
    .insert({
        user_id: user.id,
        gamemode: gamemode,
    })
    .select('game_id')
    .single();

    if (gameError) {
        console.error("[STARTGAME] Encountered a database error while creating new game:", gameError)
        return {error: "Couldn't start game."}
    }

    return {game_id: gameData.game_id};

}