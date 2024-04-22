import asyncHandler from "express-async-handler";

import User from "./usermodel.js";
import generateToken from "./config/generateToken.js";

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, gender } = req.body;
  if (!name || !email || !password || !gender) {
    res.status(400);
    throw new Error("Please enter all details");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User Already Exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    gender,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      gender: user.gender,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Failed to add user");
  }
});

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    user.count += 1;

    user.lastLoginDate = new Date();
    await user.save();
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      gender: user.gender,
      count: user.count,
      lastLogin: user.lastLoginDate,
      token: generateToken(user._id),
      message: "user loggedin",
    });
  } else {
    res.status(400);
    throw new Error("Invalid Email or Password");
  }
});

const getAllRegisteredUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});

  res.json(users);
});
// /api/user?search="pradeepa"
const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
});

export { registerUser, authUser, allUsers, getAllRegisteredUsers };
