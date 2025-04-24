export interface DatabaseConfig {
  debug?: boolean;
  migrate?: boolean;
  migrationsPath?: string;
  drizzle?: ReturnType<typeof drizzle> | Transaction;
  schema?: any;
  dbPath?: string;
}

export interface Transaction {
  execute: (query: SQL) => void;
  query: (query: SQL) => any[];
}

export interface SQL {
  sql: string;
  params: any[];
}

//tables
interface BaseTable {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
export interface Discipline extends BaseTable {
  name: string;
  type: "performance" | "team";
}
