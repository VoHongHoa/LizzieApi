import express, { json } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/users.js";
import authRoutes from "./routes/auth.js";
import roleRoutes from "./routes/role.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
dotenv.config();
const connect = () => {
  mongoose
    .connect(process.env.MONGODB_LINK)
    .then(() => {
      console.log("Connected to mongodb");
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/auths", authRoutes);
app.use("/api/roles", roleRoutes);
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong";
  return res.status(status).json({
    success: false,
    status,
    message,
  });
});

app.listen(8080, () => {
  connect();
  console.log("Conected to server");
});
