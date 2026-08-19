import "dotenv/config.js";
import express from "express";
import productsRoute from "./src/routes/product.route.js";
import authRoute from "./src/routes/auth.route.js";
import categoryRoute from "./src/routes/category.route.js";
import cartRoute from "./src/routes/cart.route.js";
import wishlistRoute from "./src/routes/wishlist.route.js";
import orderRoute from "./src/routes/order.route.js";

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static("public")); // Serve static files from the "public" directory

app.get("/", (req, res) => {
    res.send("Backend is running...");
})

app.use("/auth", authRoute);
// Products & categories are publicly browsable; each route file protects
// its own write endpoints with `authenticate` internally.
app.use("/products", productsRoute);
app.use("/categories", categoryRoute);
// Cart, wishlist and orders are entirely user-specific, so every route in
// these files requires auth (enforced with router.use(authenticate) inside).
app.use("/cart", cartRoute);
app.use("/wishlist", wishlistRoute);
app.use("/orders", orderRoute);

app.listen(PORT, (err) => {
    if (err) {
        console.error("Error starting the server:", err);
    } else {
        console.log(`Backend server is running on PORT: ${PORT}`);
    }
});