require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

// --- Routes ---

// 1. Root Route (Health Check)
app.get('/', (req, res) => {
    res.json({ message: "Vegetable Ordering API is runing" });
});

// 2. Get All Products
app.get('/products', (req, res) => {
    db.all("SELECT * FROM products", [], (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ data: rows });
    });
});

// 2. Place Order
app.post('/orders', (req, res) => {
    const { buyer_name, address, product_name, quantity } = req.body;

    if (!buyer_name || !address || !product_name || !quantity) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const sql = `INSERT INTO orders (buyer_name, address, product_name, quantity) VALUES (?, ?, ?, ?)`;
    const params = [buyer_name, address, product_name, quantity];

    db.run(sql, params, function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: "Order placed successfully",
            orderId: this.lastID,
            status: "Pending"
        });
    });
});

// 3. Get Order by ID (Tracking)
app.get('/orders/:id', (req, res) => {
    const sql = "SELECT * FROM orders WHERE id = ?";
    db.get(sql, [req.params.id], (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ data: row });
    });
});

// 4. Admin: Get All Orders
app.get('/admin/orders', (req, res) => {
    db.all("SELECT * FROM orders ORDER BY created_at DESC", [], (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ data: rows });
    });
});

// 5. Admin: Update Order Status
app.put('/admin/orders/:id', (req, res) => {
    const { status } = req.body;
    const sql = "UPDATE orders SET status = ? WHERE id = ?";

    db.run(sql, [status, req.params.id], function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ message: "Order updated", changes: this.changes });
    });
});

// 6. Admin: Add Product
app.post('/admin/products', (req, res) => {
    const { name, price, image } = req.body;
    const sql = "INSERT INTO products (name, price, image) VALUES (?, ?, ?)";

    db.run(sql, [name, price, image], function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: "Product added successfully",
            id: this.lastID
        });
    });
});

// 7. Admin: Update Product
app.put('/admin/products/:id', (req, res) => {
    const { name, price, image } = req.body;
    const sql = "UPDATE products SET name = COALESCE(?, name), price = COALESCE(?, price), image = COALESCE(?, image) WHERE id = ?";

    db.run(sql, [name, price, image, req.params.id], function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ message: "Product updated", changes: this.changes });
    });
});

// 8. Admin: Delete Product
app.delete('/admin/products/:id', (req, res) => {
    const sql = "DELETE FROM products WHERE id = ?";
    db.run(sql, [req.params.id], function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ message: "Product deleted", changes: this.changes });
    });
});

// 9. Delete Order (Cancel Order)
app.delete('/orders/:id', (req, res) => {
    const sql = "DELETE FROM orders WHERE id = ?";
    db.run(sql, [req.params.id], function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ message: "Order cancelled", changes: this.changes });
    });
});

// Start Server with Port Retry Logic
const startServer = (port) => {
    const server = app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
    });

    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.log(`Port ${port} is busy, trying ${port + 1}...`);
            startServer(port + 1);
        } else {
            console.error("Server error:", err);
        }
    });
};

startServer(PORT);
