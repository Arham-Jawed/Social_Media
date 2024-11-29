import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import Notification from "../models/notification.model.js";

export const AllNotifications = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized -- User Not Found",
      });
    }
    const notifications = await Notification.find({
      receiver: user._id,
    })
      .populate({
        path: "sender",
        select: "-password",
      })
      .populate({
        path: "post",
        select: "postImage _id",
      })
      .sort({ createdAt: -1 });

    if (notifications.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No Notifications Found",
        notifications: [],
      });
    }
    return res.status(200).json({
      success: true,
      message: "All Notifications Retrieved Successfully",
      notifications,
    });
  } catch (error) {
    console.error(
      `Internal Error While Fetching All Notifications :: ${error.message}`
    );
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const DeleteOne = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized -- User Not Found",
      });
    }
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification Not Found",
      });
    }

    if (user._id.toString() !== notification.receiver._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized -- You are not the owner of this notification",
      });
    }

    await Notification.findByIdAndDelete(notification._id);
    return res.status(200).json({
      success: true,
      message: "Notification Deleted Successfully",
    });
  } catch (error) {
    console.error(
      `Internal Error While Deleting A Notification :: ${error.message}`
    );
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const DeleteAll = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized -- User Not Found",
      });
    }
    await Notification.deleteMany({ receiver: user._id });
    return res.status(200).json({
      success: true,
      message: "All Notifications Deleted Successfully",
    });
  } catch (error) {
    console.error(
      `Internal Error While Deleting All Notifications :: ${error.message}`
    );
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
