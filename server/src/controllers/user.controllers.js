import User from "../model/user.model.js";
import Notification from "../model/notification.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import env from "../constants.js";
import Delete from "../utils/Delete.js";
import Upload from "../utils/Upload.js";

export const Register = async (req, res) => {
  const { fullName, username, email, password } = req.body;
  if (!fullName || !username || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please Provide All The Required Details",
    });
  }
  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Password should be at least 6 characters long",
    });
  }
  try {
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Username or Email already exists",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = new User({
      fullName,
      username,
      email,
      password: hashedPassword,
    });
    await user.save();
    const token = jwt.sign({ id: user._id }, env.JWT_SECRET, {
      expiresIn: "1d",
    });
    return res
      .cookie("jwt", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .status(201)
      .json({
        success: true,
        message: "User Registered Successfully",
      });
  } catch (error) {
    console.log(`Internal Error While Registering A User :: ${error.message}`);
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
      message: "Please Provide All The Required Details",
    });
  }
  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Password should be at least 6 characters long",
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
    const token = jwt.sign({ id: user._id }, env.JWT_SECRET, {
      expiresIn: "1d",
    });
    return res
      .cookie("jwt", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .status(201)
      .json({
        success: true,
        message: "User Logged In Successfully",
      });
  } catch (error) {
    console.log(`Internal Error While Logging In A User :: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const Logout = async (_, res) => {
  try {
    return res.cookie("jwt", "", { maxAge: 0 }).status(201).json({
      success: true,
      message: "User Logged Out Successfully",
    });
  } catch (error) {
    console.log(`Internal Error While Logging Out A User :: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const Me = async (req, res) => {
  const userId = req.user._id;
  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "User Not Authenticated",
    });
  }
  try {
    const user = await User.findById(userId)
      .select("-password")
      .populate({
        path: "followers",
        select: "-password",
      })
      .populate({
        path: "following",
        select: "-password",
      })
      .populate({
        path: "posts",
        select: "postImage likes comments",
        populate: {
          path: "comments",
          select: "user text",
          populate: {
            path: "user",
            select: "username avatar",
          },
        },
      });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    }
    return res.status(201).json({
      success: true,
      message: "User Data Fetched Successfully",
      user,
    });
  } catch (error) {
    console.log(`Internal Error While Fetching User Data :: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const GetSuggested = async (req, res) => {
  const userId = req.user._id;
  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "User Not Authenticated",
    });
  }
  try {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    }
    const followingUsers = user.following;
    const recommendedUsers = await User.find({
      _id: { $nin: [...followingUsers, user._id] },
    }).select("-password");

    if (recommendedUsers.length === 0) {
      return res.status(201).json({
        success: true,
        message: "No Suggested Users Found",
        suggestedUsers: [],
      });
    }

    const suggestedUsers = recommendedUsers.slice(0, 5);
    if (suggestedUsers.length === 0) {
      return res.status(201).json({
        success: true,
        message: "No Suggested Users Found",
        suggestedUsers: [],
      });
    }
    return res.status(201).json({
      success: true,
      message: "Suggested Users Fetched Successfully",
      suggestedUsers,
    });
  } catch (error) {
    console.log(
      `Internal Error While Fetching Suggested Users :: ${error.message}`
    );
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const FollowUser = async (req, res) => {
  try {
    const loggedInUser = await User.findById(req.user._id).select("-password");
    const userToFollow = await User.findById(req.params.id).select("-password");
    if (!loggedInUser || !userToFollow) {
      return res.status(400).json({
        success: false,
        message: "Invalid Request",
      });
    }
    if (loggedInUser._id.toString() === userToFollow._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You Cannot Follow Yourself",
      });
    }
    const isFollowing = loggedInUser.following.includes(userToFollow._id);
    if (isFollowing) {
      await User.findByIdAndUpdate(userToFollow._id, {
        $pull: { followers: loggedInUser._id },
      });
      await User.findByIdAndUpdate(loggedInUser._id, {
        $pull: { following: userToFollow._id },
      });
      await Notification.findOneAndDelete({
        from: loggedInUser._id,
        to: userToFollow._id,
        content: "FOLLOW",
      });
      return res.status(201).json({
        success: true,
        message: "User Unfollowed Successfully",
      });
    } else {
      await User.findByIdAndUpdate(userToFollow._id, {
        $push: { followers: loggedInUser._id },
      });
      await User.findByIdAndUpdate(loggedInUser._id, {
        $push: { following: userToFollow._id },
      });
      const notification = new Notification({
        from: loggedInUser._id,
        to: userToFollow._id,
        content: "FOLLOW",
      });
      await notification.save();
      return res.status(201).json({
        success: true,
        message: "User Followed Successfully",
      });
    }
  } catch (error) {
    console.log(`Internal Error While Following A User :: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const GetUserByUsername = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .select("-password")
      .populate({
        path: "posts",
        select: "postImage likes comments",
        populate: {
          path: "comments",
          select: "user text",
          populate: {
            path: "user",
            select: "username avatar",
          },
        },
      });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    }
    return res.status(201).json({
      success: true,
      message: "User Data Fetched Successfully",
      user,
    });
  } catch (error) {
    console.log(
      `Internal Error While Getting User By Username :: ${error.message}`
    );
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const UpdateProfile = async (req, res) => {
  const { bio, avatar } = req.body;
  if (!bio && !avatar) {
    return res.status(400).json({
      success: false,
      message: "At least one field (bio or avatar) must be provided",
    });
  }
  try {
    const loggedInUser = await User.findById(req.user._id).select("-password");
    if (!loggedInUser) {
      return res.status(401).json({
        success: false,
        message: "User Not Authenticated",
      });
    }
    if (avatar) {
      if (loggedInUser.avatar) {
        await Delete(loggedInUser.avatarId);
        loggedInUser.avatar = "";
        loggedInUser.avatarId = "";
      }
      const imageObj = await Upload(avatar);
      loggedInUser.avatar = imageObj.url;
      loggedInUser.avatarId = imageObj.id;
    }
    loggedInUser.bio = bio ? bio : loggedInUser.bio;
    await loggedInUser.save();
    return res.status(201).json({
      success: true,
      message: "Profile Updated Successfully",
    });
  } catch (error) {
    console.log(`Internal Error While Updating Profile :: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const SearchUser = async (req, res) => {
  const identifier = req.query.identifier || "";
  if (!identifier) {
    return res.status(400).json({
      success: false,
      message: "Please Provide An Identifier",
    });
  }
  try {
    const regex = new RegExp(identifier, "i");
    const user = await User.find({
      $or: [{ username: { $regex: regex } }, { email: { $regex: regex } }],
    });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    }
    return res.status(201).json({
      success: true,
      message: "User Data Fetched Successfully",
      user,
    });
  } catch (error) {
    console.log(`Internal Error While Searching User :: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const GetFollowingUserByUsername = async (req, res) => {
  try {
    const loggedInUser = await User.findById(req.user._id).select("-password");
    if (!loggedInUser) {
      return res.status(401).json({
        success: false,
        message: "User Not Authenticated",
      });
    }
    const user = await User.findOne({
      username: req.params.username,
    })
      .select("-password")
      .populate({
        path: "following",
        select: "-password",
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    }
    return res.status(201).json({
      success: true,
      message: "Following Users Fetched Successfully",
      user,
    });
  } catch (error) {
    console.error(
      `Internal Error While Getting Following Users :: ${error.message}`
    );
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const GetFollowersUserByUsername = async (req, res) => {
  try {
    const loggedInUser = await User.findById(req.user._id).select("-password");
    if (!loggedInUser) {
      return res.status(401).json({
        success: false,
        message: "User Not Authenticated",
      });
    }
    const user = await User.findOne({
      username: req.params.username,
    })
      .select("-password")
      .populate({
        path: "followers",
        select: "-password",
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    }
    return res.status(201).json({
      success: true,
      message: "Followers Users Fetched Successfully",
      user,
    });
  } catch (error) {
    console.error(
      `Internal Error While Getting Following Users :: ${error.message}`
    );
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
