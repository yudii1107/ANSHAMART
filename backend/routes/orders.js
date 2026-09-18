const express = require("express");
const router = express.Router();
const pool = require("../db");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, async (req, res) => {
  const client = await pool.connect();

  try {
    const { name, address, city, pincode, phone, payment_method, items } =
      req.body;

    if (
      !name ||
      !address ||
      !city ||
      !pincode ||
      !phone ||
      !items ||
      items.length === 0
    ) {
      return res.status(400).json({
        message: "All order details are required",
      });
    }

    if (!/^\d{6}$/.test(pincode)) {
      return res.status(400).json({
        message: "Invalid pincode",
      });
    }

    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({
        message: "Invalid phone number",
      });
    }

    if (payment_method && payment_method !== "COD") {
      return res.status(400).json({
        message: "Invalid payment method",
      });
    }

    await client.query("BEGIN");

    let totalAmount = 0;

    for (const item of items) {
      if (!item.product_id || !item.quantity || item.quantity <= 0) {
        throw new Error("Invalid product or quantity");
      }

      const productResult = await client.query(
        "SELECT id, name, price, stock FROM products WHERE id = $1 FOR UPDATE",
        [item.product_id],
      );

      if (productResult.rows.length === 0) {
        throw new Error(`Product not found: ${item.product_id}`);
      }

      const product = productResult.rows[0];

      if (product.stock < item.quantity) {
        throw new Error(
          `${product.name} is out of stock or has insufficient stock`,
        );
      }

      totalAmount += Number(product.price) * Number(item.quantity);
    }

    const orderResult = await client.query(
      `INSERT INTO orders
            (user_id, name, address, city, pincode, phone, total_amount, payment_method)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *`,
      [
        req.user.id,
        name,
        address,
        city,
        pincode,
        phone,
        totalAmount,
        payment_method || "COD",
      ],
    );

    const order = orderResult.rows[0];

    for (const item of items) {
      const productResult = await client.query(
        "SELECT price FROM products WHERE id = $1",
        [item.product_id],
      );

      const product = productResult.rows[0];

      await client.query(
        `INSERT INTO order_items
                (order_id, product_id, quantity, price)
                VALUES ($1, $2, $3, $4)`,
        [order.id, item.product_id, item.quantity, product.price],
      );

      await client.query(
        `UPDATE products
                 SET stock = stock - $1
                 WHERE id = $2`,
        [item.quantity, item.product_id],
      );
    }

    await client.query("COMMIT");

    res.status(201).json({
      message: "Order placed successfully",
      order: order,
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.log(error);

    res.status(400).json({
      message: error.message || "Failed to place order",
    });
  } finally {
    client.release();
  }
});

router.get("/", authMiddleware, async (req, res) => {
  try {
    const ordersResult = await pool.query(
      `SELECT * FROM orders
             WHERE user_id = $1
             ORDER BY created_at DESC`,
      [req.user.id],
    );

    const orders = ordersResult.rows;

    for (const order of orders) {
      const itemsResult = await pool.query(
        `SELECT order_items.*, products.name, products.image_url
                 FROM order_items
                 JOIN products
                 ON order_items.product_id = products.id
                 WHERE order_items.order_id = $1`,
        [order.id],
      );

      order.items = itemsResult.rows;
    }

    res.json(orders);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to get orders",
    });
  }
});

module.exports = router;
