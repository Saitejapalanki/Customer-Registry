import mongoose from "mongoose";
import User from "../models/User.js";

function isValidId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

function sanitizeUser(user) {
  const data = user.toObject ? user.toObject() : user;
  delete data.passwordHash;
  return data;
}

export async function registerUser(req, res, next) {
  try {
    const { name, email, password, role, phone, department } = req.body;

    if (!password || password.length < 6) {
      res.status(400);
      throw new Error("Password must be at least 6 characters");
    }

    const user = await User.create({
      name,
      email,
      role,
      phone,
      department,
      passwordHash: User.hashPassword(password)
    });

    res.status(201).json({ user: sanitizeUser(user) });
  } catch (error) {
    if (error.code === 11000) {
      res.status(409);
      error.message = "A user with this email already exists";
    } else if (error.name === "ValidationError") {
      res.status(400);
    }
    next(error);
  }
}

export async function getUsers(req, res, next) {
  try {
    const query = req.query.role ? { role: req.query.role } : {};
    const users = await User.find(query).sort({ createdAt: -1 });
    res.json({ users });
  } catch (error) {
    next(error);
  }
}

export async function updateUser(req, res, next) {
  try {
    if (!isValidId(req.params.id)) {
      res.status(400);
      throw new Error("Invalid user id");
    }

    const update = { ...req.body };
    if (update.password) {
      update.passwordHash = User.hashPassword(update.password);
      delete update.password;
    }

    const user = await User.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true
    });

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    res.json({ user: sanitizeUser(user) });
  } catch (error) {
    if (error.code === 11000) {
      res.status(409);
      error.message = "A user with this email already exists";
    } else if (error.name === "ValidationError") {
      res.status(400);
    }
    next(error);
  }
}

export async function deleteUser(req, res, next) {
  try {
    if (!isValidId(req.params.id)) {
      res.status(400);
      throw new Error("Invalid user id");
    }

    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
}
