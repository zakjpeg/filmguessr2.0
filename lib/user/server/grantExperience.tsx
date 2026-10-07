"use server";

import { XP_PER_GAME } from "@/lib/constants/constants";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/server";


export default async function grantExperience() {

    console.warn('[GRANT EXPERIENCE] start')
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SECRET_KEY

    if (!supabaseUrl || !supabaseKey) {
    console.warn('[GRANT EXPERIENCE] no supabase key')
        return;
    }

    const supabase = await createClient();
    const supabaseAdmin = createAdminClient(
        supabaseUrl,
        supabaseKey
    )

    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !user?.id) {
    console.warn('[GRANT EXPERIENCE] no user')

        return;
    }

    const { data: experience, error: experienceError } = await supabaseAdmin
    .from('profile_experience')
    .select('points')
    .eq('user_id', user.id)
    .single();

    if (experienceError) {
        console.error("[grantExperience] Error getting user experience:", experienceError);
        return;
    }

    const newPoints = experience.points + XP_PER_GAME;

    const {error: updateExperienceError} = await supabaseAdmin
    .from('profile_experience')
    .update({points: newPoints})
    .eq('user_id', user.id);

    if (updateExperienceError) {
        console.error("[grantExperience] Error updating experience points:", updateExperienceError);
    }

    console.warn('[GRANT EXPERIENCE] all done')
    return;
    
}