import { Router } from "express";
import {
  getReviews,
  getReviewsByUserId,
  createReview,
} from "../controllers/reviews.controller.js";

const router = Router();

router.get("/", getReviews);
router.get("/:id", getReviewsByUserId);
router.post("/", createReview);

export default router;
