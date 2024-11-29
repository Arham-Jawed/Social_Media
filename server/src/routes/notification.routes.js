import { Router } from "express";
import ProtectRoutes from "../middlewares/auth.middleware.js";
import {
  AllNotifications,
  DeleteAll,
  DeleteOne,
} from "../controllers/notification.controllers.js";
const router = Router();

//Routes:-
router.get("/", ProtectRoutes, AllNotifications);
router.delete("/", ProtectRoutes, DeleteAll);
router.delete("/:id", ProtectRoutes, DeleteOne);

export default router;
