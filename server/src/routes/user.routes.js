import { Router } from "express";
import ProtectRoutes from "../middlewares/auth.middleware.js";
import {
  FollowUnfollow,
  SearchUser,
  SuggestedUsers,
  UpdateProfile,
  UserByUsername,
} from "../controllers/user.controllers.js";
const router = Router();

//Routes:-
router.post("/follow/:id", ProtectRoutes, FollowUnfollow);
router.get("/suggested", ProtectRoutes, SuggestedUsers);
router.get("/:username", ProtectRoutes, UserByUsername);
router.post("/search", ProtectRoutes, SearchUser);
router.put("/update-profile", ProtectRoutes, UpdateProfile);

export default router;
