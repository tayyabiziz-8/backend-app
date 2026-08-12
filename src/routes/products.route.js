import express from "express";
import {getProducts} from "../controllers/products.controller.js";
const router = express.Router();

// Sample route for products
router.get("/", getProducts);

router.get("/:id", (req, res) => {
    const productId = req.params.id;
    res.send(`Product details for ID: ${productId}`);
});

export default router;