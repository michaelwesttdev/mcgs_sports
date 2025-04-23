import { Database } from "../sqlite";
import { Participant } from "../sqlite/p_sports/schema";
import { BaseRepository } from "./base.repository";

export class PerfomanceSportsParticipantRepository extends BaseRepository<
  typeof Participant.$inferSelect
> {
  constructor(db: Database) {
    super(db, Participant);
  }
}
