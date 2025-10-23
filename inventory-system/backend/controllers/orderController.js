const db = require('../models/db');

exports.getAllOrders = (req, res) => {
    db.query("SELECT * FROM orders", (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
};

exports.addOrder = (req, res) => {
    const { orderId, customerName, place, product, quantity, paymentMethod } = req.body;

    // Validate all required fields
    if (!orderId || !customerName || !place || !product || !quantity || !paymentMethod) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const sql = `
        INSERT INTO orders (orderId, customerName, place, product, quantity, paymentMethod)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [orderId, customerName, place, product, quantity, paymentMethod], (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: "Order added successfully", orderId });
    });
};

exports.deleteOrder = (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM orders WHERE id=?", [id], (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: "Order deleted successfully" });
    });
};
