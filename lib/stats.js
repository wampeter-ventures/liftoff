const DEFAULT_STATS = {
  gamesPlayed: 0,
  missionsAccomplished: 0,
  currentStreak: 0,
  maxStreak: 0,
  planetCounts: {
    Mars: 0,
    Ceres: 0,
    Jupiter: 0,
    Saturn: 0,
    Uranus: 0,
    Neptune: 0,
    Pluto: 0,
    Haumea: 0,
    Makemake: 0,
    Eris: 0,
    'Wolf 1061': 0,
  },
};

export function loadStats() {
  if (typeof window === 'undefined') return { ...DEFAULT_STATS };
  try {
    const stored = localStorage.getItem('gameStats');
    if (!stored) return { ...DEFAULT_STATS };
    const parsed = JSON.parse(stored);
    return {
      ...DEFAULT_STATS,
      ...parsed,
      planetCounts: { ...DEFAULT_STATS.planetCounts, ...(parsed.planetCounts || {}) },
    };
  } catch (err) {
    console.error('Failed to load game stats', err);
    return { ...DEFAULT_STATS };
  }
}

export function saveStats(stats) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('gameStats', JSON.stringify(stats));
  } catch (err) {
    console.error('Failed to save game stats', err);
  }
}

export function recordGame({ success, planetName = null }) {
  const stats = loadStats();
  stats.gamesPlayed += 1;
  if (success) {
    stats.missionsAccomplished += 1;
    stats.currentStreak += 1;
    if (planetName && stats.planetCounts[planetName] !== undefined) {
      stats.planetCounts[planetName] += 1;
    }
    if (stats.currentStreak > stats.maxStreak) {
      stats.maxStreak = stats.currentStreak;
    }
  } else {
    stats.currentStreak = 0;
  }
  saveStats(stats);
}

export const planetOrder = [
  'Mars',
  'Ceres',
  'Jupiter',
  'Saturn',
  'Uranus',
  'Neptune',
  'Pluto',
  'Haumea',
  'Makemake',
  'Eris',
  'Wolf 1061',
];
