import { Database } from "../sqlite";
import { Discipline } from "../sqlite/main/schema";
import { BaseRepository } from "./base.repository";

export class DisciplineRepository extends BaseRepository<
  typeof Discipline.$inferSelect
> {
  constructor(db: Database) {
    super(db, Discipline);
  }
  // Additional methods specific to DisciplineRepository
}
