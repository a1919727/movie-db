import { Router } from "express";
import multer from "multer";
import {
  createUser,
  getUserById,
  getUsers,
  getUserByClerkId,
  syncUser,
  updateUserProfile,
  addFavorite,
  deleteFavorite,
  addWatched,
  deleteWatched,
} from "../controllers/users.controller.js";

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1024 * 1024,
  },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("Only image uploads are allowed"));
      return;
    }

    cb(null, true);
  },
});

router.get("/", getUsers);
router.get("/clerk/:clerkUserId", getUserByClerkId);
router.get("/:id", getUserById);
router.patch("/:id", upload.single("avatar"), updateUserProfile);
router.post("/:id/favorites", addFavorite);
router.delete("/:id/favorites/:tmdbMovieId", deleteFavorite);
router.post("/sync", syncUser);
router.post("/", createUser);
router.post("/:id/watched", addWatched);
router.delete("/:id/watched/:tmdbMovieId", deleteWatched);

export default router;
