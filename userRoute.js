
import express from "express";

import { protect } from "./authmiddleware.js";
import {
  allUsers,
  authUser,
  getAllRegisteredUsers,
  registerUser,
} from "./userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.get("/all", protect, allUsers);
router.get("/allUser", protect, getAllRegisteredUsers);
router.post("/login", authUser);

export default router;
