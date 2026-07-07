import { Router } from "express";
import {
  getReviews,
  getReviewsByUserId,
  createReview,
  deleteReview,
} from "../controllers/reviews.controller.js";

const router = Router();

router.get("/", getReviews);
router.get("/:id", getReviewsByUserId);
router.post("/", createReview);
router.delete("/:id", deleteReview);

export default router;
