import jwt from "jsonwebtoken";
import env from "../constants.js";

export default function GenerateToken(id, res) {
  try {
    const token = jwt.sign({ id }, env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.cookie("jwt", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
      secure: env.NODE_ENV !== "developmemt",
    });
    return true;
  } catch (error) {
    console.error(
      `Internal Error While Generating A Token :: ${error.message}`
    );
    return null;
  }
}
