const path = require('path');
const fs = require('fs');

const dbPath = process.env.DB_PATH 
  ? path.resolve(process.env.DB_PATH) 
  : path.join(__dirname, '../../tasks.db');

// Ensure parent directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

let dbInstance;
let isNodeSqlite = false;

try {
  const Database = require('better-sqlite3');
  dbInstance = new Database(dbPath);
  dbInstance.pragma('journal_mode = WAL');
  dbInstance.pragma('foreign_keys = ON');
} catch (betterSqliteErr) {
  try {
    const { DatabaseSync } = require('node:sqlite');
    dbInstance = new DatabaseSync(dbPath);
    isNodeSqlite = true;
  } catch (nodeSqliteErr) {
    console.error('Failed to initialize SQLite database:', betterSqliteErr, nodeSqliteErr);
    throw new Error('SQLite driver initialization failed.');
  }
}

// Database helper wrapper providing a unified, reliable synchronous interface
const db = {
  execute(sql) {
    if (isNodeSqlite) {
      return dbInstance.exec(sql);
    }
    return dbInstance.exec(sql);
  },

  all(sql, params = []) {
    if (isNodeSqlite) {
      const stmt = dbInstance.prepare(sql);
      return stmt.all(...params);
    }
    const stmt = dbInstance.prepare(sql);
    return stmt.all(params);
  },

  get(sql, params = []) {
    if (isNodeSqlite) {
      const stmt = dbInstance.prepare(sql);
      return stmt.get(...params);
    }
    const stmt = dbInstance.prepare(sql);
    return stmt.get(params);
  },

  run(sql, params = []) {
    if (isNodeSqlite) {
      const stmt = dbInstance.prepare(sql);
      const result = stmt.run(...params);
      return {
        lastInsertRowid: result.lastInsertRowid !== undefined ? Number(result.lastInsertRowid) : null,
        changes: result.changes !== undefined ? Number(result.changes) : 0,
      };
    }
    const stmt = dbInstance.prepare(sql);
    const result = stmt.run(params);
    return {
      lastInsertRowid: Number(result.lastInsertRowid),
      changes: Number(result.changes),
    };
  },
};

// Initialize schema
function initSchema() {
  db.execute(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      priority TEXT NOT NULL DEFAULT 'medium',
      category TEXT NOT NULL DEFAULT 'General',
      due_date TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
    );

    CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
    CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
    CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
  `);

  // Seed sample tasks if table is empty
  const countRow = db.get('SELECT COUNT(*) as count FROM tasks');
  if (countRow && countRow.count === 0) {
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    const nextWeek = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];

    const sampleTasks = [
      {
        title: 'Review quarterly project roadmap & deliverables',
        description: 'Sync with product and engineering teams to align on upcoming milestone deliverables.',
        status: 'pending',
        priority: 'high',
        category: 'Work',
        due_date: tomorrow,
      },
      {
        title: 'Complete frontend responsive layout',
        description: 'Implement modern glassmorphic dashboard with stats counters and Lucide icons.',
        status: 'completed',
        priority: 'high',
        category: 'Work',
        due_date: today,
      },
      {
        title: 'Weekly grocery shopping & meal prep',
        description: 'Stock up on organic produce, fruits, and prepare meals for the upcoming week.',
        status: 'pending',
        priority: 'medium',
        category: 'Personal',
        due_date: nextWeek,
      },
      {
        title: 'Read 2 chapters of System Design Interview',
        description: 'Focus on distributed cache consistency and database replication strategies.',
        status: 'pending',
        priority: 'low',
        category: 'Study',
        due_date: nextWeek,
      },
    ];

    for (const task of sampleTasks) {
      db.run(
        `INSERT INTO tasks (title, description, status, priority, category, due_date)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [task.title, task.description, task.status, task.priority, task.category, task.due_date]
      );
    }
  }
}

initSchema();

module.exports = db;
