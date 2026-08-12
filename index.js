import dotenv from "dotenv";
dotenv.config();
import express from "express";
import productsRouter from "./src/routes/products.route.js";

const PORT = process.env.PORT || 4321;

const app = express();
app.use(express.json());

app.use("/api/products", productsRouter);

app.listen(PORT, (err) => {
  if (err) {
    console.log(`Unable to listen on port ${PORT}: ${err}`);
  } else {
    console.log(`App listening on port ${PORT}`);
  }
});