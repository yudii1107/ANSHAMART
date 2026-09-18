const express = require("express");
const cors = require("cors");
const pool = require("./db");
const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orders");
const authRoutes = require("./routes/auth");
const wishlistRoutes = require("./routes/wishlist");
const reviewRoutes = require("./routes/reviews");

const app = express();

app.use(cors({
    origin: "http://localhost:3000"
}));
app.use(express.json());

app.use("/api/orders", orderRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "E-Commerce API is running"
    });
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});