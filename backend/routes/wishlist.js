const express = require("express");
const router = express.Router();
const pool = require("../db");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT wishlist.id, wishlist.product_id,
                    products.name, products.price,
                    products.image_url
             FROM wishlist
             JOIN products
             ON wishlist.product_id = products.id
             WHERE wishlist.user_id = $1
             ORDER BY wishlist.created_at DESC`,
            [req.user.id]
        );

        res.json(result.rows);

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Failed to load wishlist"
        });
    }
});

router.post("/", authMiddleware, async (req, res) => {
    try {
        const { product_id } = req.body;

        if (!product_id) {
            return res.status(400).json({
                message: "Product ID is required"
            });
        }

        const product = await pool.query(
            "SELECT id FROM products WHERE id = $1",
            [product_id]
        );

        if (product.rows.length === 0) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        const result = await pool.query(
            `INSERT INTO wishlist (user_id, product_id)
             VALUES ($1, $2)
             ON CONFLICT (user_id, product_id) DO NOTHING
             RETURNING *`,
            [req.user.id, product_id]
        );

        res.status(201).json({
            message: result.rows.length > 0
                ? "Product added to wishlist"
                : "Product already in wishlist"
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Failed to add product"
        });
    }
});

router.delete("/:productId", authMiddleware, async (req, res) => {
    try {
        const { productId } = req.params;

        await pool.query(
            `DELETE FROM wishlist
             WHERE user_id = $1
             AND product_id = $2`,
            [req.user.id, productId]
        );

        res.json({
            message: "Product removed from wishlist"
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Failed to remove product"
        });
    }
});

router.get("/check/:productId", authMiddleware, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT id
             FROM wishlist
             WHERE user_id = $1
             AND product_id = $2`,
            [req.user.id, req.params.productId]
        );

        res.json({
            wishlisted: result.rows.length > 0
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Failed to check wishlist"
        });
    }
});

module.exports = router;