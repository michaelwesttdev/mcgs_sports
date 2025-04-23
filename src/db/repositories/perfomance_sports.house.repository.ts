import { Database } from "../sqlite";
import { House } from "../sqlite/p_sports/schema";
import { BaseRepository } from "./base.repository";

export class PerfomanceSportsHouseRepository extends BaseRepository<
  typeof House.$inferSelect
> {
  constructor(db: Database) {
    super(db, House);
  }
}
