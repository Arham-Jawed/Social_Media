import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import GenerateToken from "../lib/generateToken.js";

export const Register = async (req, res) => {
  const { fullName, username, email, password } = req.body;
  if (!fullName || !username || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please Provide All The Required Fields",
    });
  }
  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Password Must Be At Least 6 Characters",
    });
  }
  try {
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: " Username Or Email Is Already Registered",
      });
    }
    const hashedpassword = await bcrypt.hash(password, 10);
    const user = new User({
      fullName,
      username,
      email,
      password: hashedpassword,
    });
    if (user) {
      await user.save();
      const success = GenerateToken(user._id, res);
      if (success) {
        return res.status(201).json({
          success: true,
          message: "User Registered Successfully",
          user,
        });
      }
    }
  } catch (error) {
    console.error(
      `Internal Error While Registering A User :: ${error.message}`
    );
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const Login = async (req, res) => {
  const { identifier, password } = req.body;
  if (!identifier || !password) {
    return res.status(400).json({
      success: false,
      message: "Please Provide All The Required Fields",
    });
  }
  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Password Must Be At Least 6 Characters",
    });
  }
  try {
    const user = await User.findOne({
      $or: [{ username: identifier }, { email: identifier }],
    });
    const isMatch = await bcrypt.compare(password, user?.password || "");
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid Credentials",
      });
    }
    const success = GenerateToken(user._id, res);
    if (!success) {
      return res.status(401).json({
        success: false,
        message: "Failed to generate token",
      });
    }
    return res.status(201).json({
      success: true,
      message: "User Logged In Successfully",
      user,
    });
  } catch (error) {
    console.error(`Internal Error While Login A User :: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const Logout = (_, res) => {
  try {
    return res.cookie("jwt", "", { maxAge: 0 }).status(201).json({
      success: true,
      message: "User Logged Out Successfully",
    });
  } catch (error) {
    console.error(`Internal Error While Logout A User :: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const GetMe = async (req, res) => {
  try {
    const loggedInUser = await User.findById(req.user._id).select("-password");
    if (!loggedInUser) {
      return res.status(401).json({
        success: false,
        message: "User Not Found",
      });
    }
    return res.status(201).json({
      success: true,
      message: "User Information Retrieved Successfully",
      user: loggedInUser,
    });
  } catch (error) {
    console.error(`Internal Error While Getting User Info :: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
