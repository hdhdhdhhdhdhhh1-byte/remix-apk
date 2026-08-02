import initSqlJs from "sql.js";
import fs from "fs";
import path from "path";

let database:any = null;

export async function getDatabase(){

  if(database)
    return database;

  const SQL = await initSqlJs();

  const file = path.join(
    process.cwd(),
    "src/packages/knowledge/data/nico.db"
  );


  if(fs.existsSync(file)){

    const buffer = fs.readFileSync(file);

    database = new SQL.Database(buffer);

  }else{

    database = new SQL.Database();

    database.run(`
      CREATE TABLE knowledge(
        id INTEGER PRIMARY KEY,
        title TEXT,
        content TEXT,
        category TEXT,
        keywords TEXT,
        importance_weight REAL DEFAULT 1.0
      );
      CREATE INDEX idx_knowledge_title ON knowledge(title);
      CREATE INDEX idx_knowledge_category ON knowledge(category);
    `);

    saveDatabase();

  }


  return database;
}



export function saveDatabase(){

 const file = path.join(
    process.cwd(),
    "src/packages/knowledge/data/nico.db"
  );

 const data = database.export();

 fs.writeFileSync(
   file,
   Buffer.from(data)
 );

}
