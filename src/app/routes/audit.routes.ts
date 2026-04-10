import { Router } from "express";
import { AuditController } from "../modules/controller/audit.controller";

const router = Router();
router.get("/", AuditController.allAudit);
export const auditRoutes = router;
