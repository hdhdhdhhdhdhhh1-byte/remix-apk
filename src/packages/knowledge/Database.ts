import initSqlJs from "sql.js";
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Device } from '@capacitor/device';

let database: any = null;
let sqliteConn: SQLiteConnection | null = null;
let dbConn: SQLiteDBConnection | null = null;

export async function getDatabase() {
  if (database || dbConn) return database || dbConn;

  const info = await Device.getInfo();
  const isNative = info.platform === 'android' || info.platform === 'ios';

  if (isNative) {
    try {
      sqliteConn = new SQLiteConnection(CapacitorSQLite);
      dbConn = await sqliteConn.createConnection("nico_knowledge", false, "no-encryption", 1, false);
      await dbConn.open();
      
      // Initialize table if not exists
      await dbConn.execute(\`
        CREATE TABLE IF NOT EXISTS knowledge(
          id INTEGER PRIMARY KEY,
          title TEXT,
          content TEXT,
          category TEXT,
          keywords TEXT,
          importance_weight REAL DEFAULT 1.0
        );
      \`);
      return dbConn;
    } catch (e) {
      console.error("Native SQLite failed, falling back to SQL.js", e);
    }
  }

  // Fallback to SQL.js for Web
  const SQL = await initSqlJs({
    locateFile: file => \`https://sql.js.org/dist/\${file}\`
  });
  
  // In a real browser environment, we'd load from IndexedDB or local file
  // Here we just initialize a new one for demonstration
  database = new SQL.Database();
  database.run(\`
    CREATE TABLE IF NOT EXISTS knowledge(
      id INTEGER PRIMARY KEY,
      title TEXT,
      content TEXT,
      category TEXT,
      keywords TEXT,
      importance_weight REAL DEFAULT 1.0
    );
    CREATE INDEX IF NOT EXISTS idx_knowledge_title ON knowledge(title);
    CREATE INDEX IF NOT EXISTS idx_knowledge_category ON knowledge(category);
  \`);
  
  return database;
}

export async function saveDatabase() {
  if (dbConn) {
    // Capacitor SQLite saves automatically or via specific sync
    return;
  }
  
  if (database) {
    const data = database.export();
    // In web, you'd save this to IndexedDB or trigger a download
    console.log("SQL.js database exported, size:", data.length);
  }
}
