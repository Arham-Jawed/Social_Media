import Notification from "../model/notification.model.js";
import User from "../model/user.model.js";
import Post from "../model/post.model.js";

export const GetAllNotifications = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized Access",
      });
    }
    const notifications = await Notification.find({ to: user._id })
      .populate({
        path: "from",
        select: "-password",
      })
      .populate({
        path: "post",
        select: "postImage",
      });

    if (notifications.length === 0) {
      return res.status(201).json({
        success: true,
        message: "No Notifications Found",
        notifications: [],
      });
    }
    return res.status(201).json({
      success: true,
      message: "Notifications Fetched Successfully",
      notifications,
    });
  } catch (error) {
    console.error(
      `Internal Error While Fetching All The Notifications :: ${error.message}`
    );
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const DeleteAllNotifications = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized Access",
      });
    }
    await Notification.deleteMany({ to: user._id });
    return res.status(201).json({
      success: true,
      message: "All Notifications Deleted Successfully",
    });
  } catch (error) {
    console.error(
      `Internal Error While Deleting All The Notifications :: ${error.message}`
    );
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const DeleteNotification = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized Access",
      });
    }
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification Not Found",
      });
    }
    if (notification.to.toString() !== user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized Access",
      });
    }
    await Notification.findByIdAndDelete(req.params.id);
    return res.status(201).json({
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
