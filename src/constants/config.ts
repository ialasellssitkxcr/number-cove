/** Tunable round + layout constants. */

export const LOADER_DURATION_MS = 8000;

export const COLS = 6;
export const ROWS = 8;

export const PAD = 6;
export const BORDER = 2;
export const BOARD_FRAME = PAD + BORDER;

export const TOTAL_LEVELS = 8;

export const START_PEARLS = 12;
export const HINT_COST = 1;
export const WIN_REWARD = 3;
export const PERFECT_BONUS = 1;

/** MOVE_LIMIT = par + MOVE_SLACK */
export const MOVE_SLACK = 8;

/** Autopilot cadence so the headless runner always reaches a result frame. */
export const AUTO_ADVANCE_MS = 1400;
/** Independent safety net: resolve the round even if the autopilot stalls. */
export const IDLE_BACKSTOP_MS = 40000;

export const ERROR_BLINK_MS = 180;
export const STEP_ANIM_MS = 160;
