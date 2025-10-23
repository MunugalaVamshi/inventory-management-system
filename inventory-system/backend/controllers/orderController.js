const db = require('../models/db');

exports.getAllOrders = (req, res) => {
    db.query("SELECT * FROM orders", (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
};

exports.addOrder = (req, res) => {
    const { orderId, customerName, product, quantity } = req.body;
    if (!orderId || !customerName || !product || !quantity) {
        return res.status(400).json({ error: "All fields are required" });
    }

    db.query(
        "INSERT INTO orders (orderId, customerName, product, quantity) VALUES (?, ?, ?, ?)",
        [orderId, customerName, product, quantity],
        (err, results) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ message: "Order added successfully", orderId });
        }
    );
};

exports.deleteOrder = (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM orders WHERE id=?", [id], (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: "Order deleted successfully" });
    });
};
