import jwt from "jsonwebtoken";
import env from "../constants.js";
import User from "../models/user.model.js";

export default async function ProtectRoutes(req, res, next) {
  try {
    const token = req.cookies.jwt || "";
    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Unauthorized -- No Token Provided",
      });
    }
    const decoded = jwt.verify(token, env.JWT_SECRET);
    if (!decoded) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized -- Invalid Token",
      });
    }
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized -- User Not Found",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error(`Internal Error While Protecting Routes :: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
