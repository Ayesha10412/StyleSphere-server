import { Router } from "express";
import { DashboardController } from "../modules/controller/dashboard.controller";

const router = Router();
router.get("/",DashboardController.dashboard);
export const dashboardRoutes = router;