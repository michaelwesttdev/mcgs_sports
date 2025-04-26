import { Database } from "../sqlite";
import { Discipline, MDiscipline } from "../sqlite/main/schema";
import { BaseRepository } from "./base.repository";

export class DisciplineRepository extends BaseRepository<MDiscipline> {
  constructor(db: Database) {
    super(db, Discipline);
  }
  // Additional methods specific to DisciplineRepository
}
