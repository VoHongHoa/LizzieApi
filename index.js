import express, { json } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/users.js";
import authRoutes from "./routes/auth.js";
import roleRoutes from "./routes/role.js";
import categoriesRoutes from "./routes/categories.js";
import productsRoutes from "./routes/product.js";
import customersRoutes from "./routes/customer.js";
import unitsRoutes from "./routes/unit.js";
import colorsRoutes from "./routes/color.js";
import sizesRoutes from "./routes/size.js";
import salesRoutes from "./routes/sale.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { logger, logEvents } from "./middleware/logger.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { corsOptions } from "./config/corsOptions.js";
import { connectDB } from "./config/dbConnect.js";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config();

const PORT = process.env.PORT || 3500;

const app = express();

connectDB();
app.use(logger);

app.use(cors(corsOptions));

app.use(cookieParser());

app.use("/", express.static(path.join(__dirname, "public")));

app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/auths", authRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/customers", customersRoutes);
app.use("/api/units", unitsRoutes);
app.use("/api/colors", colorsRoutes);
app.use("/api/sizes", sizesRoutes);
app.use("/api/invoice", salesRoutes);

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "404 not found" });
  } else {
    res.type(txt).send("404 not found");
  }
});

app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
});
