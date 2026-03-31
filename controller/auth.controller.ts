import { Request, Response } from "express";
import { asyncHandler, generateToken } from "../lib";
import User from "../models/user.model";
import { AppError } from "../lib";

/**
 * @desc Register a new user
 * @route POST /api/auth/sign-up
 * @access Public
 */

const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  // 🕵🏻 Always check if user already exists
  const user = await User.findOne({ email });

  if (user) {
    // 🎯 throw an AppError so our global Error Handler sends a consistent error response
    throw new AppError("User already exists", 400);
  }

  // Use 'await' to ensure the database record is fully created before continuing.
  const newUser = await User.create({ name, email, password });

  // 🏁 RESPONSE: Use 'return res.json()' to ensure the function STOPS and the client receives data.
  // 201 = "Created"
  return res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: newUser,
  });
});

/**
 * @desc Login user
 * @route POST /api/auth/sign-in
 * @access Public
 */

const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // We hid the password in the Model (select: false),
  // We MUST explicitly use .select("+password") here OR login will always fail!
  const user = await User.findOne({ email }).select("+password");

  // We used an instance method here to keep logic in the model (Skinny Controller).
  const verifyPassword = await user?.comparePassword(password);

  // 🛡️ SECURITY: We check BOTH user existence and password correctness.
  // We use 401 "Unauthorized" for any failure here.
  if (!user || !verifyPassword) {
    throw new AppError("Invalid credentials", 401);
  }

  const userId = user?._id.toString();
  const token = generateToken(userId!);

  // 🏁 RESPONSE: 200 = "OK"
  return res.status(200).json({
    success: true,
    message: "User logged in successfully",
    token: token,
  });
});

export { registerUser, loginUser };
