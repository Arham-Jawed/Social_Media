import { Router } from "express";
import {
  FollowUser,
  GetFollowersUserByUsername,
  GetFollowingUserByUsername,
  GetSuggested,
  GetUserByUsername,
  Login,
  Logout,
  Me,
  Register,
  SearchUser,
  UpdateProfile,
} from "../controllers/user.controllers.js";
import ProtectRoutes from "../middlewares/auth.middleware.js";

const router = new Router();

//Routes:-
router.post("/register", Register);
router.post("/login", Login);
router.post("/logout", Logout);
router.get("/me", ProtectRoutes, Me);
router.get("/suggested", ProtectRoutes, GetSuggested);
router.get("/:username", ProtectRoutes, GetUserByUsername);
router.get("/following/:username", ProtectRoutes, GetFollowingUserByUsername);
router.get("/followers/:username", ProtectRoutes, GetFollowersUserByUsername);
router.post("/follow/:id", ProtectRoutes, FollowUser);
router.put("/update", ProtectRoutes, UpdateProfile);
router.post("/search", ProtectRoutes, SearchUser);

export default router;
