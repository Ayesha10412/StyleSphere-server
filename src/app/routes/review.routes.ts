import { Router } from "express";
import { checkAuth } from "../middlewares/checkAuth";
import { ROLE } from "../modules/interface/user.interface";
import { validateRequest } from "../middlewares/validateRequest";
import { create } from "axios";
import { createReviewValidation } from "../modules/validation/review.validation";
import { ReviewController } from "../modules/controller/review.controller";

const router = Router();
router.get("/", ReviewController.getReview);
router.post(
  "/",
  checkAuth(ROLE.USER),
  validateRequest(createReviewValidation),
  ReviewController.createReview,
);
router.delete(
  "/:reviewId",
  checkAuth(ROLE.USER, ROLE.SUPER_ADMIN),
  ReviewController.deleteReview,
);
export const reviewRoutes = router;
