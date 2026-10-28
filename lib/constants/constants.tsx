// Character minimums/limits
export const CHARLIM_NAME = 24;
export const CHARMIN_NAME = 1;
export const CHARLIM_GUESS_TITLE = 64;

// Gamemode
export const MAX_GAME_ROUNDS = 5; // This is a hardcoded stop to ensure than null-rounded games don't go on forever
export const SCORE_TITLE_WEIGHT = 0.60; // Represents the weight for title guesses
export const GAME_ZONE_GREEN = 0.75; // Anything above this is a GREEN. Anything below is a YELLOW.
export const GAME_ZONE_YELLOW = 0.4; // Anything above this is a YELLOW. Anything below is a RED.

export const XP_PER_GAME = 20; // Experience points granted in a perfect game
export const XP_TOLERANCE = 0.3 // (0 - 1.0) Percentage of the XP_PER_GAME that is guaranteed to the user (Not impacted by game performance)

export const RANDOM_IMAGE_URL = "https://picsum.photos/50/50";
