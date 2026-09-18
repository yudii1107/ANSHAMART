const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/", async (req, res) => {
    try {
        const { search, category, sort } = req.query;

        let query = `
            SELECT products.*, categories.name AS category_name
            FROM products
            LEFT JOIN categories
            ON products.category_id = categories.id
        `;

        let values = [];
        let conditions = [];

        if (search) {
            conditions.push(`
        products.name ILIKE $${values.length + 1}
        OR products.description ILIKE $${values.length + 1}
        OR categories.name ILIKE $${values.length + 1}
    `);

            values.push(`%${search}%`);
        }

        if (category) {
            conditions.push(`categories.name ILIKE $${values.length + 1}`);
            values.push(category);
        }

        if (conditions.length > 0) {
            query += " WHERE " + conditions.join(" AND ");
        }

        if (sort === "low") {
            query += " ORDER BY products.price ASC";
        } else if (sort === "high") {
            query += " ORDER BY products.price DESC";
        } else {
            query += " ORDER BY products.id DESC";
        }

        const result = await pool.query(query, values);

        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: "Failed to get products" });
    }
});
router.get("/:id", async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT products.*, categories.name AS category_name
             FROM products
             LEFT JOIN categories
             ON products.category_id = categories.id
             WHERE products.id = $1`,
            [req.params.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: "Failed to get product" });
    }
});

module.exports = router;