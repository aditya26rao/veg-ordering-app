const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Connect to SQLite database
const dbPath = process.env.DB_PATH || path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database ' + err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// Initialize Schema
db.serialize(() => {
    // Products Table
    db.run(`CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        image TEXT
    )`);

    // Orders Table
    db.run(`CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        buyer_name TEXT NOT NULL,
        address TEXT NOT NULL,
        product_name TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        status TEXT DEFAULT 'Pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Seed Data (if empty)
    db.get("SELECT count(*) as count FROM products", (err, row) => {
        if (row.count === 0) {
            console.log("Seeding products...");
            const stmt = db.prepare("INSERT INTO products (name, price, image) VALUES (?, ?, ?)");
            stmt.run("Potato (Bulk)", 0.50, "https://images.unsplash.com/photo-1518977676641-8d4d8462c7e9?auto=format&fit=crop&q=80&w=300");
            stmt.run("Onion (Red)", 0.70, "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=300");
            stmt.run("Tomato", 1.20, "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=300");
            stmt.run("Carrot", 0.80, "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&q=80&w=300");
            stmt.run("Apples (Fuji)", 2.50, "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&q=80&w=300");
            stmt.run("Bananas", 1.00, "https://images.unsplash.com/photo-1603833665858-e61d17a86224?auto=format&fit=crop&q=80&w=300");
            stmt.finalize();
        }
    });
});

module.exports = db;
