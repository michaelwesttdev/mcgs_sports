export type PlacePoints = {
  [place: number]: number; // e.g. 1 => 10, 2 => 8, etc.
};

export type PointsSettings = {
  team?: PlacePoints;
  individual?: PlacePoints;
};

export type Settings = {
  ageGroups: Record<string, number | [number, number]>;
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

export const metrics = {
  time: {
    minutes: {
      abbr: "min",
      regex: "^([0-5]?\d):(\d{2})(?:\.(\d{1,2}))?$" // mm:ss(.SS)
    },
    seconds: {
      abbr: "s",
      regex: "^\d{1,2}(?:\.\d{1,2})?$" // ss(.SS)
    },
    hours: {
      abbr: "h",
      regex: "^(\d{1,2}):(\d{2}):(\d{2})(?:\.(\d{1,2}))?$" // HH:mm:ss(.SS)
    },
    days: {
      abbr: "d",
      regex: "^\d+$" // integer days
    },
    milliseconds: {
      abbr: "ms",
      regex: "^\d{1,3}$" // ms
    },
  },
  height: {
    meters: {
      abbr: "m",
      regex: "^\d+(\.\d+)?$"
    },
    centimeters: {
      abbr: "cm",
      regex: "^\d+(\.\d+)?$"
    },
    millimeters: {
      abbr: "mm",
      regex: "^\d+(\.\d+)?$"
    },
    feet: {
      abbr: "ft",
      regex: "^\d+(\.\d+)?$"
    },
    inches: {
      abbr: "in",
      regex: "^\d+(\.\d+)?$"
    },
    miles: {
      abbr: "mi",
      regex: "^\d+(\.\d+)?$"
    },
    kilometers: {
      abbr: "km",
      regex: "^\d+(\.\d+)?$"
    },
  },
  length: {
    meters: {
      abbr: "m",
      regex: "^\d+(\.\d+)?$"
    },
    centimeters: {
      abbr: "cm",
      regex: "^\d+(\.\d+)?$"
    },
    millimeters: {
      abbr: "mm",
      regex: "^\d+(\.\d+)?$"
    },
    feet: {
      abbr: "ft",
      regex: "^\d+(\.\d+)?$"
    },
    inches: {
      abbr: "in",
      regex: "^\d+(\.\d+)?$"
    },
    yards: {
      abbr: "yd",
      regex: "^\d+(\.\d+)?$"
    },
    miles: {
      abbr: "mi",
      regex: "^\d+(\.\d+)?$"
    },
    kilometers: {
      abbr: "km",
      regex: "^\d+(\.\d+)?$"
    },
    nauticalMiles: {
      abbr: "nmi",
      regex: "^\d+(\.\d+)?$"
    },
  },
  score: {
    points: {
      abbr: "pts",
      regex: "^\d+(\.\d+)?$"
    },
    percentage: {
      abbr: "%",
      regex: "^(100(\.0+)?|\d{1,2}(\.\d+)?)$" // 0-100%
    },
  }
}