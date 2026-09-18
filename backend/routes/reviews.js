const express = require("express");
const router = express.Router();
const pool = require("../db");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/:productId", async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT reviews.id, reviews.rating, reviews.review,
                    reviews.created_at, users.name
             FROM reviews
             JOIN users
             ON reviews.user_id = users.id
             WHERE reviews.product_id = $1
             ORDER BY reviews.created_at DESC`,
            [req.params.productId]
        );

        res.json(result.rows);

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Failed to load reviews"
        });
    }
});

router.post("/", authMiddleware, async (req, res) => {
    try {
        const {
            product_id,
            rating,
            review
        } = req.body;

        if (!product_id || !rating || !review) {
            return res.status(400).json({
                message: "All review fields are required"
            });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                message: "Rating must be between 1 and 5"
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

        const existingReview = await pool.query(
            `SELECT id
             FROM reviews
             WHERE user_id = $1
             AND product_id = $2`,
            [req.user.id, product_id]
        );

        if (existingReview.rows.length > 0) {
            return res.status(400).json({
                message: "You have already reviewed this product"
            });
        }

        const result = await pool.query(
            `INSERT INTO reviews
            (user_id, product_id, rating, review)
            VALUES ($1, $2, $3, $4)
            RETURNING id, rating, review, created_at`,
            [
                req.user.id,
                product_id,
                rating,
                review
            ]
        );

        res.status(201).json({
            message: "Review added successfully",
            review: result.rows[0]
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Failed to add review"
        });
    }
});

module.exports = router;