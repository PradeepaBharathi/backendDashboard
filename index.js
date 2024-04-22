import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./userRoute.js";
const app = express();

dotenv.config();
connectDB();
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("API WORKING");
});

app.use("/api/user", userRoutes);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
