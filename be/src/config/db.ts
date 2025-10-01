// SQLite setup and bootstrapping
import sqlite3 from 'sqlite3';
import path from 'path';

// Pick DB file from env or use a sensible default
const dbPath = process.env.DB_PATH || path.join(__dirname, '../../quiz.db');

/**
 * Shared SQLite connection. We kick off schema setup on connect.
 */
export const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

/**
 * Create tables if they're missing.
 */
function initializeDatabase() {
  db.serialize(() => {
    // Quizzes table
    db.run(`
      CREATE TABLE IF NOT EXISTS quizzes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Questions table
    db.run(`
      CREATE TABLE IF NOT EXISTS questions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        quiz_id INTEGER NOT NULL,
        question_text TEXT NOT NULL,
        option_a TEXT NOT NULL,
        option_b TEXT NOT NULL,
        option_c TEXT NOT NULL,
        option_d TEXT NOT NULL,
        correct_option TEXT NOT NULL CHECK(correct_option IN ('A', 'B', 'C', 'D')),
        FOREIGN KEY (quiz_id) REFERENCES quizzes(id)
      )
    `);
  });
}

/**
 * Close the DB connection politely.
 */
export const closeDatabase = () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
    } else {
      console.log('Database connection closed');
    }
  });
};