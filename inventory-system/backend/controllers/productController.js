const db = require('../models/db');
const path = require('path');
const fs = require('fs');

// 📦 Get all products
exports.getAllProducts = (req, res) => {
    const query = "SELECT * FROM products";
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
};

// 🆕 Add new product (with image upload)
exports.addProduct = (req, res) => {
    const { name, description, quantity, price } = req.body;
    const imageFile = req.file; // uploaded image

    if (!name || !description || !quantity || !price || !imageFile) {
        return res.status(400).json({ error: "All fields including image are required!" });
    }

    const imagePath = `/uploads/${imageFile.filename}`;

    const query = `
        INSERT INTO products (name, description, quantity, price, image)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(query, [name, description, quantity, price, imagePath], (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: '✅ Product added successfully!' });
    });
};

// ✏️ Update product
exports.updateProduct = (req, res) => {
    const { id } = req.params;
    const { name, description, quantity, price } = req.body;
    const imageFile = req.file;

    let updateQuery = "UPDATE products SET name=?, description=?, quantity=?, price=?";
    let queryParams = [name, description, quantity, price];

    // if image is uploaded, update it too
    if (imageFile) {
        const imagePath = `/uploads/${imageFile.filename}`;
        updateQuery += ", image=?";
        queryParams.push(imagePath);
    }

    updateQuery += " WHERE id=?";
    queryParams.push(id);

    db.query(updateQuery, queryParams, (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: '✅ Product updated successfully!' });
    });
};

// ❌ Delete product
exports.deleteProduct = (req, res) => {
    const { id } = req.params;

    // First get the image path to delete file from /uploads
    db.query("SELECT image FROM products WHERE id=?", [id], (err, results) => {
        if (err) return res.status(500).json({ error: err });
        if (results.length > 0) {
            const imagePath = path.join(__dirname, "..", results[0].image);
            fs.unlink(imagePath, (err) => {
                if (err) console.error("Image delete error:", err);
            });
        }

        // Then delete product from DB
        db.query("DELETE FROM products WHERE id=?", [id], (err) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ message: '🗑️ Product deleted successfully!' });
        });
    });
};
