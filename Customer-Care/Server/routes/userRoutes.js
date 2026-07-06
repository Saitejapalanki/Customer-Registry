import express from "express";
import { deleteUser, getUsers, registerUser, updateUser } from "../controllers/userController.js";

const router = express.Router();

router.route("/").get(getUsers).post(registerUser);
router.route("/:id").put(updateUser).delete(deleteUser);

export default router;
