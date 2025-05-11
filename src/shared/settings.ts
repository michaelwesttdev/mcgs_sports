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

export const generalRegex = {
  time: "^(\\d{1,2}:\\d{2}(\\.\\d{1,2})?|\\d+(\\.\\d{1,2})?)$", // supports "1:23.45" and "23.04"
  distance: "^\\d+(\\.\\d+)?$",
  speed: "^\\d+(\\.\\d+)?$",
  points: "^\\d+(\\.\\d+)?$",
  score: "^\\d?$",
};

export const settings: Settings = {
  ageGroups: {
    U14: [12, 13],
    U16: [14, 15],
    U18: [16, 17],
    open: 18,
  },
  metrics: {
    m: "^(0|[1-9]\\\\d*)(\\\\.\\\\d+)?$",
    sec: "^(0|[1-5]?\\\\d)(\\\\.\\\\d+)?$",
    min: "^(0|[1-5]?\\\\d)(\\\\.\\\\d+)?$",
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