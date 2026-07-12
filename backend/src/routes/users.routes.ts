import { Router } from "express";
import {
  createUser,
  getUserById,
  getUsers,
  getUserByClerkId,
  syncUser,
  addFavorite,
  deleteFavorite,
} from "../controllers/users.controller.js";

const router = Router();

router.get("/", getUsers);
router.get("/clerk/:clerkUserId", getUserByClerkId);
router.get("/:id", getUserById);
router.post("/:id/favorites", addFavorite);
router.delete("/:id/favorites/:tmdbMovieId", deleteFavorite);
router.post("/sync", syncUser);
router.post("/", createUser);

export default router;
