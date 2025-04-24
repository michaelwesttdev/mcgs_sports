import { sqliteTable, text, index } from "drizzle-orm/sqlite-core";
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

// disciplines
const Discipline = sqliteTable(
  "discipline",
  {
    id: text("id").primaryKey().notNull(),
    name: text("name", { length: 255 }).notNull().unique(),
    description: text("description"),
    ...timestamps,
  },
  (table) => [index("discipline_name_idx").on(table.name)]
);
// events
const Event = sqliteTable("event", {
  id: text("id").primaryKey().notNull(),
  title: text("title", { length: 255 }).notNull(),
  description: text("description"),
  disciplineId: text("discipline_id")
    .notNull()
    .references(() => Discipline.id, { onDelete: "cascade" }),
  type: text("type", { enum: ["team", "individual"] }).notNull(),
  ...timestamps,
});
// sessions
const Session = sqliteTable("session", {
  id: text("id").primaryKey().notNull(),
  title: text("title", { length: 255 }).notNull(),
  date: text("date").notNull(),
  time: text("time"),
  location: text("location", { length: 255 }).notNull(),
  disciplineId: text("discipline_id")
    .notNull()
    .references(() => Discipline.id, {
      onDelete: "cascade",
    }),
  ...timestamps,
});

export { Discipline, Event, Session };
