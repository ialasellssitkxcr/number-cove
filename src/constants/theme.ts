/** OCEAN_FRESH preset, accent values retuned for the sunlit-cove brief. */
export const THEME = {
  name: 'OCEAN_FRESH',
  colors: {
    bg: {
      base: '#F0FAF9',
      mid: '#D9EEF3',
      deep: '#BFE3EA',
    },
    surface: {
      card: '#FFFFFF',
      soft: 'rgba(255,255,255,0.85)',
      veil: 'rgba(255,255,255,0.72)',
      sand: '#F4FAFB',
    },
    border: {
      soft: '#CDE6EC',
      card: '#DCEDF1',
      sand: '#E3F0F3',
    },
    accent: {
      primary: '#168AAD',
      bright: '#1BA5C2',
      success: '#76C893',
      sun: '#FFD166',
      sunDeep: '#C79A2E',
      error: '#E76F51',
    },
    text: {
      primary: '#184E77',
      secondary: '#4F8FA6',
      muted: '#6FA3B5',
      onDark: '#EAF7FA',
      onDarkMuted: '#9DCEDB',
      inverse: '#FFFFFF',
      leafDeep: '#2F7A57',
    },
    rock: {
      fill: '#9DB3BC',
      locked: '#A9C7D0',
      lockedBg: '#E4F0F3',
    },
    deep: {
      d1: '#062B3D',
      d2: '#0B4A63',
      d3: '#0E6B86',
    },
  },
  gradients: {
    menu: ['#F0FAF9', '#D9EEF3', '#BFE3EA'],
    game: ['#F0FAF9', '#DCEFF3'],
    loader: ['#062B3D', '#0B4A63', '#0E6B86'],
    primary: ['#168AAD', '#1BA5C2'],
    tide: ['#76C893', '#168AAD'],
    win: ['#E7F7EF', '#CDEFE0', '#A9E3C6'],
    lose: ['#F0FAF9', '#DCE9EE', '#C3D9E1'],
  },
  radius: {
    sm: 10,
    md: 18,
    lg: 22,
    xl: 26,
    pill: 999,
  },
  space: {
    xs: 6,
    sm: 10,
    md: 16,
    lg: 24,
  },
} as const;

export type Theme = typeof THEME;
