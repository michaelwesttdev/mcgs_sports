import { Database } from "../sqlite";
import { Event } from "../sqlite/main/schema";
import { BaseRepository } from "./base.repository";

export class MainEventRepository extends BaseRepository<
  typeof Event.$inferSelect
> {
  constructor(db: Database) {
    super(db, Event);
  }
  // Additional methods specific to EventRepository
}
