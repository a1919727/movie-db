import { Router } from "express";
import {
  createUser,
  getUserById,
  getUsers,
  getUserByClerkId,
} from "../controllers/users.controller.js";

const router = Router();

router.get("/", getUsers);
router.get("/clerk/:clerkUserId", getUserByClerkId);
router.get("/:id", getUserById);
router.post("/", createUser);

export default router;
