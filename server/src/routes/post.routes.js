import { Router } from "express";
import ProtectRoutes from "../middlewares/auth.middleware.js";
import {
  CommentOnPost,
  CreatePost,
  DeletePost,
  GetExplorePosts,
  GetFeedPosts,
  GetPostById,
  LikePost,
  SavePost,
} from "../controllers/post.controllers.js";

const router = new Router();

//Routes:-
router.post("/create", ProtectRoutes, CreatePost);
router.delete("/:id", ProtectRoutes, DeletePost);
router.post("/like/:id", ProtectRoutes, LikePost);
router.post("/comment/:id", ProtectRoutes, CommentOnPost);
router.post("/save/:id", ProtectRoutes, SavePost);
router.get("/feed", ProtectRoutes, GetFeedPosts);
router.get("/explore", ProtectRoutes, GetExplorePosts);
router.get("/:id", ProtectRoutes, GetPostById);

export default router;
