const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters"
      });
    }

    const existingUser = await db.query(
      "SELECT id FROM users WHERE email = $1",
      [email.toLowerCase()]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        message: "Email already registered"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, created_at",
      [name, email.toLowerCase(), hashedPassword]
    );

    res.status(201).json({
      message: "Registration successful",
      user: result.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error"
    });
  }
});
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    const result = await db.query(
      "SELECT id, name, email, password FROM users WHERE email = $1",
      [email.toLowerCase()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const user = result.rows[0];

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d"
      }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error"
    });
  }
});

router.get("/profile", authMiddleware, async (req, res) => {
    try {
        const result = await db.query(
            `SELECT id, name, email, phone, address, city, pincode
             FROM users
             WHERE id = $1`,
            [req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Failed to load profile"
        });
    }
});

router.put("/profile", authMiddleware, async (req, res) => {
    try {
        const {
            name,
            phone,
            address,
            city,
            pincode
        } = req.body;

        if (!name || !phone || !address || !city || !pincode) {
            return res.status(400).json({
                message: "All profile fields are required"
            });
        }

        if (!/^\d{10}$/.test(phone)) {
            return res.status(400).json({
                message: "Invalid phone number"
            });
        }

        if (!/^\d{6}$/.test(pincode)) {
            return res.status(400).json({
                message: "Invalid pincode"
            });
        }

        const result = await db.query(
            `UPDATE users
             SET name = $1,
                 phone = $2,
                 address = $3,
                 city = $4,
                 pincode = $5
             WHERE id = $6
             RETURNING id, name, email, phone, address, city, pincode`,
            [
                name,
                phone,
                address,
                city,
                pincode,
                req.user.id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json({
            message: "Profile updated successfully",
            user: result.rows[0]
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Failed to update profile"
        });
    }
});

module.exports = router;