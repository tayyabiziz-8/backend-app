import "dotenv/config.js";
import express from "express";
import productsRoute from "./src/routes/products.route.js";
import authRoute from "./src/routes/auth.route.js";
import { authenticate } from "./src/middlewares/auth.middleware.js";

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

app.get("/", (req, res)=>{
    res.send("Backend is running...");
})

app.use("/products", authenticate, productsRoute);
app.use("/auth", authRoute);

app.listen(PORT, (err) => {
    if (err) {
        console.error("Error starting the server:", err);
    } else {
        console.log(`Backend server is running on PORT: ${PORT}`);
    }
});