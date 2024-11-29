import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import ConnectDB from "./lib/db.js";
import env from "./constants.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/post.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import path from "path";

const app = express();
const PORT = env.PORT || 5000;
const _dirname = path.resolve();

//Middleware:-
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

//Routes:-
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/notifications", notificationRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(_dirname, "../client/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(_dirname, "../client", "dist", "index.html"));
  });
}

//Listener:-
ConnectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server Is Listening On http://localhost:${PORT}`);
  });
});
