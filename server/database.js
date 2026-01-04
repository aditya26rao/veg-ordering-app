require('dotenv').config();
const path = require('path');
const fs = require('fs');

// Interface definition:
// db.run(sql, params, callback(err))
// db.get(sql, params, callback(err, row))
// db.all(sql, params, callback(err, rows))

let db;

if (process.env.DATABASE_URL) {
    // --- PostgreSQL Implementation (Production) ---
    const { Pool } = require('pg');
    console.log("Using PostgreSQL Database");

    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false } // Required for Render
    });

    db = {
        run: (sql, params, callback) => {
            // Convert SQLite ? params to Postgres $1, $2, ...
            let paramIndex = 1;
            const pgSql = sql.replace(/\?/g, () => `$${paramIndex++}`);

            pool.query(pgSql, params, (err, res) => {
                if (err) return callback(err);
                // Postgres doesn't easily give 'lastID' or 'changes' in same way without RETURNING
                // Mocking it for now or adding RETURNING to inserts
                callback.call({ lastID: 0, changes: res.rowCount }, null);
            });
        },
        get: (sql, params, callback) => {
            let paramIndex = 1;
            const pgSql = sql.replace(/\?/g, () => `$${paramIndex++}`);
            pool.query(pgSql, params, (err, res) => {
                if (err) return callback(err);
                callback(null, res.rows[0]);
            });
        },
        all: (sql, params, callback) => {
            let paramIndex = 1;
            const pgSql = sql.replace(/\?/g, () => `$${paramIndex++}`);
            pool.query(pgSql, params, (err, res) => {
                if (err) return callback(err);
                callback(null, res.rows);
            });
        },
        init: () => {
            console.log("Initializing Postgres Tables...");
            const createProducts = `
                CREATE TABLE IF NOT EXISTS products (
                    id SERIAL PRIMARY KEY,
                    name TEXT NOT NULL,
                    price DECIMAL NOT NULL,
                    image TEXT
                );`;
            const createOrders = `
                CREATE TABLE IF NOT EXISTS orders (
                    id SERIAL PRIMARY KEY,
                    buyer_name TEXT NOT NULL,
                    address TEXT NOT NULL,
                    product_name TEXT NOT NULL,
                    quantity INTEGER NOT NULL,
                    status TEXT DEFAULT 'Pending',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );`;

            pool.query(createProducts).catch(err => console.error("Err creating products:", err));
            pool.query(createOrders).catch(err => console.error("Err creating orders:", err));
        }
    };

    // Auto-init tables
    db.init();

} else {
    // --- SQLite Implementation (Development) ---
    const sqlite3 = require('sqlite3').verbose();
    console.log("Using SQLite Database (Local)");

    const dbPath = path.resolve(__dirname, 'database.sqlite');
    const sqliteDb = new sqlite3.Database(dbPath, (err) => {
        if (err) console.error('Error opening database ' + err.message);
        else console.log('Connected to SQLite database.');
    });

    db = {
        run: (sql, params, callback) => sqliteDb.run(sql, params, callback),
        get: (sql, params, callback) => sqliteDb.get(sql, params, callback),
        all: (sql, params, callback) => sqliteDb.all(sql, params, callback)
    };

    // Initialize Schema
    sqliteDb.serialize(() => {
        sqliteDb.run(`CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            price REAL NOT NULL,
            image TEXT
        )`);

        sqliteDb.run(`CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            buyer_name TEXT NOT NULL,
            address TEXT NOT NULL,
            product_name TEXT NOT NULL,
            quantity INTEGER NOT NULL,
            status TEXT DEFAULT 'Pending',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Seed Data checks...
        sqliteDb.get("SELECT count(*) as count FROM products", (err, row) => {
            if (row && row.count === 0) {
                console.log("Seeding products...");
                const stmt = sqliteDb.prepare("INSERT INTO products (name, price, image) VALUES (?, ?, ?)");
                stmt.run("Potato (Bulk)", 0.50, "https://images.unsplash.com/photo-1518977676641-8d4d8462c7e9?auto=format&fit=crop&q=80&w=300");
                stmt.run("Onion (Red)", 0.70, "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=300");
                stmt.run("Tomato", 1.20, "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=300");
                stmt.finalize();
            }
        });
    });
}

module.exports = db;
