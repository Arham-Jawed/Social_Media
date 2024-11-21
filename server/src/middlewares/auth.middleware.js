import User from "../model/user.model.js";
import env from "../constants.js";
import jwt from "jsonwebtoken";

export default async function ProtectRoutes(req, res, next) {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized Access",
      });
    }
    const decoded = jwt.verify(token, env.JWT_SECRET);
    if (!decoded) {
      return res.status(403).json({
        success: false,
        message: "Invalid Token",
      });
    }
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized Access",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error(
      `Internal Error While Authorizing A User :: ${error.message}`
    );
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
