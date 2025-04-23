import { Database } from "../sqlite";
import { Event } from "../sqlite/p_sports/schema";
import { BaseRepository } from "./base.repository";

export class PerfomanceSportsEventRepository extends BaseRepository<
  typeof Event.$inferSelect
> {
  constructor(db: Database) {
    super(db, Event);
  }
}
