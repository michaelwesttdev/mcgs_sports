import {
  sqliteTable,
  text,
  integer,
  index,
  primaryKey,
} from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// Helper for timestamps
const timestamps = {
  createdAt: text("created_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
  deletedAt: text("deleted_at"),
};

// Team
const Team = sqliteTable(
  "team",
  {
    id: text("id").primaryKey().notNull(),
    name: text("name", { length: 255 }).notNull(),
    ...timestamps,
  },
  (table) => [index("team_name_idx").on(table.name)]
);

// Player
const Player = sqliteTable(
  "player",
  {
    id: text("id").primaryKey().notNull(),
    name: text("name", { length: 255 }).notNull(),
    teamId: text("team_id").notNull(), // FK to Team
    ...timestamps,
  },
  (table) => [index("player_team_idx").on(table.teamId)]
);

// Event (e.g., football match, basketball game)
const TeamEvent = sqliteTable("team_event", {
  id: text("id").primaryKey().notNull(),
  name: text("name", { length: 255 }).notNull(),
  category: text("category", { length: 100 }), // e.g., "football", "netball"
  gender: text("gender", { length: 10 }), // "boys", "girls", "mixed"
  round: text("round", { length: 100 }), // e.g., "semi-final"
  date: text("date"), // ISO format
  ...timestamps,
});

// Team Participation in an event
const TeamEventParticipation = sqliteTable(
  "team_event_participation",
  {
    eventId: text("event_id").notNull(),
    teamId: text("team_id").notNull(),
    score: integer("score").notNull().default(0),
    position: integer("position"), // Optional: 1 for 1st place, etc.
    ...timestamps,
  },
  (table) => [
    primaryKey({ columns: [table.eventId, table.teamId] }),
    index("team_event_participation_event_idx").on(table.eventId),
    index("team_event_participation_team_idx").on(table.teamId),
  ]
);

// Optional: Player Participation in a team event (for tracking stats)
const PlayerEventStats = sqliteTable(
  "player_event_stats",
  {
    playerId: text("player_id").notNull(),
    eventId: text("event_id").notNull(),
    goals: integer("goals").default(0), // or any stat relevant to the sport
    assists: integer("assists").default(0),
    ...timestamps,
  },
  (table) => [
    primaryKey({ columns: [table.playerId, table.eventId] }),
    index("player_event_stats_event_idx").on(table.eventId),
  ]
);

export { Team, Player, TeamEvent, TeamEventParticipation, PlayerEventStats };
