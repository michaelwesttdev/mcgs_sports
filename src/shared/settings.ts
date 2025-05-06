export type PlacePoints = {
  [place: number]: number; // e.g. 1 => 10, 2 => 8, etc.
};

export type PointsSettings = {
  team?: PlacePoints;
  individual?: PlacePoints;
};

export type Settings = {
  ageGroups: Record<string, number | [number, number]>;
  metrics: Record<string, string>;
  points: PointsSettings;
};

export const settings: Settings = {
  ageGroups: {
    U14: [12, 13],
    U16: [14, 15],
    U18: [16, 17],
    open: 18,
  },
  metrics: {
    m: "/\b(\d+(\.\d+)?)(?=\s?m\b)/i",       // Matches numbers before "m"
    sec: "/\b(\d+(\.\d+)?)(?=\s?sec\b)/i",   // Matches numbers before "sec"
    min: "/\b(\d+(\.\d+)?)(?=\s?min\b)/i",   // Matches numbers before "min"
  },
  points: {
    individual: {
      1: 10,
      2: 8,
      3: 6,
      4: 4,
      5: 2,
      6: 1,
    },
    team: {
      1: 12,
      2: 8,
      3: 6,
    },
  },
};