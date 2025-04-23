import { Database } from "../sqlite";
import { Session } from "../sqlite/main/schema";
import { BaseRepository } from "./base.repository";

export class SessionRepository extends BaseRepository<
  typeof Session.$inferSelect
> {
  constructor(db: Database) {
    super(db, Session);
  }
  // Additional methods specific to SessionRepository
}
