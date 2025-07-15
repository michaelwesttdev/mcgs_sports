export const MainChannels = [
  "main:session:create",
  "main:session:read",
  "main:session:update",
  "main:session:delete",
  "main:session:list",
  "main:event:create",
  "main:event:read",
  "main:event:update",
  "main:event:delete",
  "main:event:list",
  "main:discipline:create",
  "main:discipline:read",
  "main:discipline:update",
  "main:discipline:delete",
  "main:discipline:list",
];
export const PerfomanceSportsChannels = [
  "ps:event:create",
  "ps:event:read",
  "ps:event:update",
  "ps:event:delete",
  "ps:event:list",
  "ps:house:create",
  "ps:house:read",
  "ps:house:update",
  "ps:house:delete",
  "ps:house:list",
  "ps:participant:create",
  "ps:participant:read",
  "ps:participant:update",
  "ps:participant:delete",
  "ps:participant:list",
];
export const DateFormats = [
  'yyyy-MM-dd',
  'dd-MM-yyyy',
  'MM-dd-yyyy',
  'yyyy/MM/dd',
  'dd/MM/yyyy',
  'MM/dd/yyyy',
  'yyyy.MM.dd',
  'dd.MM.yyyy',
];
export const IpcChannels = [
  ...MainChannels,
  ...PerfomanceSportsChannels,
] as const;

export const natures = ["time", "height", "score", "length"] as const;
