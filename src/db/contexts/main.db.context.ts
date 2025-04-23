import { DisciplineRepository } from "../repositories/discipline.repository";
import { MainEventRepository } from "../repositories/main.event.repository";
import { SessionRepository } from "../repositories/session.repository";
import { Database } from "../sqlite";

export class MainDBContext {
  public session: SessionRepository;
  public event: MainEventRepository;
  public discipline: DisciplineRepository;
  constructor(db: Database) {
    this.discipline = new DisciplineRepository(db);
    this.event = new MainEventRepository(db);
    this.session = new SessionRepository(db);
  }
}
