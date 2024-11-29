import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";
import UploadOnCloud from "../lib/Upload.js";
import DeleteFromCloud from "../lib/Delete.js";

export const FollowUnfollow = async (req, res) => {
  try {
    const loggedInUser = await User.findById(req.user._id).select("-password");
    const userToFollow = await User.findById(req.params.id).select("-password");

    if (!userToFollow || !loggedInUser) {
      return res.status(404).json({
        success: false,
        message: "Invalid Request",
      });
    }

    if (loggedInUser._id.toString() === userToFollow._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You Can't Follow UnFollow Yourself",
      });
    }

    const isFollowing = loggedInUser.following.includes(userToFollow._id);

    if (isFollowing) {
      //Unfollow
      await User.findByIdAndUpdate(loggedInUser._id, {
        $pull: { following: userToFollow._id },
      });
      await User.findByIdAndUpdate(userToFollow._id, {
        $pull: { followers: loggedInUser._id },
      });
      await Notification.findOneAndDelete({
        sender: loggedInUser._id,
        receiver: userToFollow._id,
        type: "FOLLOW",
      });
      return res.status(200).json({
        success: true,
        message: "User Unfollowed Successfully",
      });
    } else {
      //Follow:-
      await User.findByIdAndUpdate(loggedInUser._id, {
        $push: { following: userToFollow._id },
      });
      await User.findByIdAndUpdate(userToFollow._id, {
        $push: { followers: loggedInUser._id },
      });
      const notification = new Notification({
        sender: loggedInUser._id,
        receiver: userToFollow._id,
        type: "FOLLOW",
      });
      await notification.save();
      return res.status(201).json({
        success: true,
        message: "User Followed Successfully",
      });
    }
  } catch (error) {
    console.error(
      `Internal Error While Following Unfollowing A User :: ${error.message}`
    );
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const SuggestedUsers = async (req, res) => {
  try {
    const loggedInUser = await User.findById(req.user._id).select("-password");
    if (!loggedInUser) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized -- User Not Found",
      });
    }
    const followingUser = loggedInUser.following;
    const suggestedUsers = await User.find({
      _id: { $nin: [...followingUser, loggedInUser._id] },
    });
    if (suggestedUsers.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No Suggested Users Found",
        users: [],
      });
    }
    const users = suggestedUsers.slice(0, 5);
    return res.status(200).json({
      success: true,
      message: "Suggested Users Retrieved Successfully",
      users,
    });
  } catch (error) {
    console.error(
      `Internal Error While Getting Suggested Users :: ${error.message}`
    );
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const UserByUsername = async (req, res) => {
  try {
    const loggedInUser = await User.findById(req.user._id).select("-password");
    if (!loggedInUser) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized -- User Not Found",
      });
    }
    const user = await User.findOne({ username: req.params.username })
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
        select: "postImage _id",
      })
      .populate({
        path: "savedPosts",
        select: "postImage _id",
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "User Retrieved Successfully",
      user,
    });
  } catch (error) {
    console.error(
      `Internal Error While Getting User By Username :: ${error.message}`
    );
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const SearchUser = async (req, res) => {
  try {
    const loggedInUser = await User.findById(req.user._id).select("-password");
    if (!loggedInUser) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized -- User Not Found",
      });
    }
    const regex = new RegExp(req.query.identifier, "i");
    const users = await User.find({
      $or: [{ username: regex }, { email: regex }],
    });
    const searchedUsers = users.filter(
      (user) => user._id.toString() !== loggedInUser._id.toString()
    );
    if (searchedUsers.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No Users Found",
        users: [],
      });
    }
    return res.status(200).json({
      success: true,
      message: "Users Retrieved Successfully",
      users: searchedUsers,
    });
  } catch (error) {
    console.error(`Internal Error While Searching User :: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const UpdateProfile = async (req, res) => {
  const { avatar, bio } = req.body;
  let imageObj;
  try {
    const loggedInUser = await User.findById(req.user._id).select("-password");
    if (!loggedInUser) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized -- User Not Found",
      });
    }
    if (avatar) {
      if (loggedInUser.avatar) {
        await DeleteFromCloud(loggedInUser.avatarId);
      }
      imageObj = await UploadOnCloud(avatar);
    }
    await User.findByIdAndUpdate(loggedInUser._id, {
      avatar: imageObj ? imageObj.url : loggedInUser.avatar,
      avatarId: imageObj ? imageObj.id : loggedInUser.avatarId,
      bio: bio ? bio : loggedInUser.bio,
    });
    return res.status(200).json({
      success: true,
      message: "User Profile Updated Successfully",
    });
  } catch (error) {
    console.error(
      `Internal Error While Updating User Profile :: ${error.message}`
    );
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
