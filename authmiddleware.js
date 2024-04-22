import jwt from "jsonwebtoken";
import User from "./usermodel.js";
import asyncHandler from "express-async-handler";

const protect = asyncHandler(async (req, res, next) => {
  const token = req.headers["x-auth-token"];
  console.log(token);
  if (!token) {
    return res.status(400).json({ message: "Invalid Authorization" });
  }
  console.log(token);
  const decode = jwt.verify(token, process.env.SECRET_KEY);
  console.log(decode);
  next();
});

export { protect };
