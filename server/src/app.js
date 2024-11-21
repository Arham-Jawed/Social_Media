import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import UserRoutes from "./routes/user.routes.js";
import PostRoutes from "./routes/post.routes.js";
import NotificationRoutes from "./routes/notification.routes.js";

const app = express();

//Middleware:-
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const corsOptions = {
  origin: "http://localhost:5173",
  creadentials: true,
};
app.use(cors(corsOptions));

//Routes:-
app.use("/api/v1/users", UserRoutes);
app.use("/api/v1/posts", PostRoutes);
app.use("/api/v1/notifications", NotificationRoutes);

export default app;
