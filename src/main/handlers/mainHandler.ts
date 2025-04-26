import { MainDBContext } from "@/db/contexts/main.db.context";
import { PerformanceSportsDBContext } from "@/db/contexts/perfomance_sports.db.context";
import { BaseRepository } from "@/db/repositories/base.repository";
import { Database, initDb } from "@/db/sqlite";
import { RepositoryError } from "@/errors/repository.error";
import {
  IpcChannel,
  PerfomanceSportsChannel,
} from "@/shared/types/electron.main";
import { ipcMain } from "electron";
import * as PsSchema from "@/db/sqlite/p_sports/schema";
import { getSessionDbPath } from "@/shared/helpers/urls";

export class MainHandler {
  private p_sessionsContexts: Map<
    string,
    {
      db: Database;
      context: PerformanceSportsDBContext;
    }
  > = new Map();
  constructor(private db: MainDBContext) {}

  createMainCrudHandler<T>(
    context: "main",
    repoKey: keyof MainDBContext,
    operation: keyof BaseRepository<T>
  ) {
    const channel = `${context}:${repoKey}:${operation}` as IpcChannel;
    ipcMain.handle(channel, async (_, ...args: any[]) => {
      console.log("handling:", channel, "args:", args);
      try {
        const repo = this.db[repoKey] as any;
        const result = await repo[operation](...args);
        return { success: true, data: result };
      } catch (error) {
        this.handleError(error);
      }
    });
  }
  registerMainHandlers() {
    this.registerMainRepositoryHandlers();
    this.registerPerfomanceSportsHandlers();
    this.registerCustomHandlers();
  }
  registerMainRepositoryHandlers() {
    const repositories: (keyof MainDBContext)[] = [
      "session",
      "event",
      "discipline",
    ];
    repositories.forEach((repoKey) => {
      this.createMainCrudHandler("main", repoKey, "list");
      this.createMainCrudHandler("main", repoKey, "read");
      this.createMainCrudHandler("main", repoKey, "create");
      this.createMainCrudHandler("main", repoKey, "update");
      this.createMainCrudHandler("main", repoKey, "delete");
    });
  }
  registerPerfomanceSportsHandlers() {
    const channels: PerfomanceSportsChannel[] = [
      "ps:event:create",
      "ps:event:read",
      "ps:event:update",
      "ps:event:delete",
      "ps:event:list",
      "ps:house:create",
      "ps:house:read",
      "ps:house:update",
      "ps:house:delete",
      "ps:house:list",
      "ps:participant:create",
      "ps:participant:read",
      "ps:participant:update",
      "ps:participant:delete",
      "ps:participant:list",
    ];

    channels.forEach((channel) => {
      ipcMain.handle(channel, async (_, ...args: any[]) => {
        console.log("handling PS:", channel, "args:", args);
        try {
          const [_, repoKey, operation] = channel.split(":") as [
            string,
            keyof PerformanceSportsDBContext,
            keyof BaseRepository<any>
          ];
          const [sessionId, data] = args;
          console.log("found sessionId:", sessionId);
          console.log("found data:", data);
          let context = this.p_sessionsContexts.get(sessionId).context;
          if (!context) {
            const db = initDb(PsSchema, {
              schema: PsSchema,
              dbPath: getSessionDbPath(sessionId),
              migrate: true,
              migrationsPath: `${__dirname}/p_sports/drizzle`,
            });
            const newContext = new PerformanceSportsDBContext(db);
            this.p_sessionsContexts.set(sessionId, {
              db,
              context: newContext,
            });
            context = newContext;
          }
          console.log("found context");
          const repo = context[repoKey] as any;
          console.log("found repo");
          const result = await repo[operation](data);
          console.log("result:", result);

          return { success: true, data: result };
        } catch (error) {
          this.handleError(error);
        }
      });
    });
  }

  registerCustomHandlers() {
    ipcMain.handle("session:createDbContext", async (_, args: string) => {
      console.log("creating db context for session:", args);
      try {
        let context = this.p_sessionsContexts.get(args);
        if (context) {
          return { success: true };
        }
        const dbPath = getSessionDbPath(args);
        const migrationsPath = `${__dirname}/p_sports/drizzle`;
        console.log("migrationsPath:", migrationsPath);
        console.log("dbPath:", dbPath);
        const db = initDb(PsSchema, {
          schema: PsSchema,
          dbPath: dbPath,
          migrate: true,
          migrationsPath: migrationsPath,
        });

        const c = new PerformanceSportsDBContext(db);
        this.p_sessionsContexts.set(args, {
          db,
          context: c,
        });
        return { success: true };
      } catch (error) {
        this.handleError(error);
      }
    });
    ipcMain.handle("session:closeDbContext", async (_, args: string) => {
      try {
        let context = this.p_sessionsContexts.get(args);
        if (!context) {
          return { success: true };
        }
        context.db.close();
        this.p_sessionsContexts.delete(args);
        return { success: true };
      } catch (error) {
        this.handleError(error);
      }
    });
  }

  private handleError(error: any) {
    if (error instanceof RepositoryError) {
      return {
        success: false,
        error: error.message,
        ...(error.originalError
          ? { details: error.originalError.toString() }
          : {}),
      };
    }
    return {
      success: false,
      error: "An unknown error occurred",
      ...(error instanceof Error ? { details: error.message } : {}),
    };
  }
}
