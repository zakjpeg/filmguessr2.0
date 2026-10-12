import { create } from "zustand";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";

let initialized = false;

type ProfileStore = {
    user: User | null;
    profile: Profile | null;
    loading: boolean;

    initialize: () => void;
    fetchProfile: (userId: string) => Promise<void>;
    clearProfile: () => void;
};

export const useProfileStore = create<ProfileStore>((set, get) => ({
    user: null,
    profile: null,
    loading: true,

    fetchProfile: async (userId) => {
        const supabase = createClient();
        const { data, error } = await supabase
            .from("profile")
            .select(`
                *,
                profile_experience (
                    *
                ),
                admin (
                    *
                )
            `)
            .eq("user_id", userId)
            .maybeSingle();

        if (error) {
            console.error("Failed to fetch profile:", error);
            set({
                profile: null,
                loading: false,
            });
            return;
        }

        set({
            profile: data,
            loading: false,
        });
    },

    clearProfile: () => {
        set({
            profile: null,
            loading: false,
        });
    },

    initialize: () => {
        if (initialized) return;

        initialized = true;

        // Get the current authenticated user
        const supabase = createClient();
        supabase.auth.getSession().then(({ data: { session } }) => {
            const user = session?.user ?? null;

            set({user: user});

            if (!user) {
                set({
                    profile: null,
                    loading: false,
                });
                return;
            }

            get().fetchProfile(user.id);
        });

        // Listen for future auth changes
        supabase.auth.onAuthStateChange((_event, session) => {
            const user = session?.user ?? null;

            if (!user) {
                get().clearProfile();
                return;
            }

            set({ loading: true });

            void get().fetchProfile(user.id);
        });
    },
}));

useProfileStore.getState().initialize();