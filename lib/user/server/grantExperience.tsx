"use server";

import { XP_PER_GAME, XP_TOLERANCE } from "@/lib/constants/constants";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/server";
import { useProfileStore } from "@/stores/useProfileStore";

type grantExperienceReturnType = {
    pointsGranted?: number,
    error?: string,
}

// Function: grantExperience
// Purpose: Grants a user experience based on the accuracy of their game
// Input: Accuracy (0 - 1.0)
// Output: { pointsGranted }
//
export default async function grantExperience(accuracy?: number): Promise<grantExperienceReturnType> {

    console.log('[GRANT EXPERIENCE] starting. Accuracy:', accuracy)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SECRET_KEY

    if (!supabaseUrl || !supabaseKey) {
        console.warn('[GRANT EXPERIENCE] no supabase key')
        return {error: "Couldn't grant experience. Please try again."};
    }

    const supabase = await createClient();
    const supabaseAdmin = createAdminClient(
        supabaseUrl,
        supabaseKey
    )

    // Validate user
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !user?.id) {
        console.warn('[GRANT EXPERIENCE] no user')
        return {error: "Couldn't grant experience to user. Please try again."};
    }

    // Get experience points
    const { data: experience, error: experienceError } = await supabaseAdmin
    .from('profile_experience')
    .select('points')
    .eq('user_id', user.id)
    .single();

    if (experienceError) {
        console.error("[grantExperience] Error getting user experience:", experienceError);
        return {error: "Couldn't grant user experience. Please try again."};
    }

    /* 
    Points granted is calculated by
    adding guaranteed points with performance-based points, then rounding.
    
    Guaranteed points = XP per game * tolerance
    Performance-based points = XP per game * inverse of tolerance * game accuracy
    */
    let pointsGranted = 
    (XP_PER_GAME * XP_TOLERANCE) + 
    (XP_PER_GAME * (1 - XP_TOLERANCE) * (accuracy ?? 1))

    pointsGranted = Math.round(pointsGranted);

    const newPoints = experience.points + pointsGranted;

    // Update experience points
    const {error: updateExperienceError} = await supabaseAdmin
    .from('profile_experience')
    .update({points: newPoints})
    .eq('user_id', user.id);

    if (updateExperienceError) {
        console.error("[grantExperience] Error updating experience points:", updateExperienceError);
        return {error: "Had trouble granting experience to user. Please try again."};
    }

    // Log this action
    const {error: logExperienceError} = await supabaseAdmin
    .from('profile_experience_log')
    .insert({
        user_id: user.id,
        action: 'grant_experience',
        points: pointsGranted,
    })

    if (logExperienceError) {
        console.error("[grantExperience] Error logging experience points:", logExperienceError);
    }

    console.log('[GRANT EXPERIENCE] all done')

    if (pointsGranted !== null) {
        return { pointsGranted: pointsGranted }
    } else {
        return {error: "Had issues granting experience to user. Please try again."};
    }

    
}