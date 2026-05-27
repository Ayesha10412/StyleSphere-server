import { Router } from "express";
import { ReportController } from "../modules/controller/report.controller";

const router = Router()
router.get("/", ReportController.report)
export const reportRoutes = router;