import { Router } from "express";
import ProtectRoutes from "../middlewares/auth.middleware.js";
import {
  DeleteAllNotifications,
  DeleteNotification,
  GetAllNotifications,
} from "../controllers/notification.controllers.js";

const router = new Router();

//Routes:-
router.get("/", ProtectRoutes, GetAllNotifications);
router.delete("/", ProtectRoutes, DeleteAllNotifications);
router.delete("/:id", ProtectRoutes, DeleteNotification)

export default router;
