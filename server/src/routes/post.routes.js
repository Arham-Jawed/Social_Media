import { Router } from "express";
import ProtectRoutes from "../middlewares/auth.middleware.js";
import {
  CommentOnPost,
  Create,
  Delete,
  ExplorePost,
  FeedPost,
  Like,
  PostById,
  Save,
} from "../controllers/post.controllers.js";

const router = Router();

//Routes:-
router.post("/create", ProtectRoutes, Create);
router.delete("/:id", ProtectRoutes, Delete);
router.get("/", ProtectRoutes, FeedPost);
router.get("/explore", ProtectRoutes, ExplorePost);
router.get("/:id", ProtectRoutes, PostById);
router.post("/like/:id", ProtectRoutes, Like);
router.post("/comment/:id", ProtectRoutes, CommentOnPost);
router.post("/save/:id", ProtectRoutes, Save);

export default router;
