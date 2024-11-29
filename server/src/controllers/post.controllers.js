import Post from "../models/post.model.js";
import Notification from "../models/notification.model.js";
import Comment from "../models/comment.model.js";
import User from "../models/user.model.js";
import UploadOnCloud from "../lib/Upload.js";
import DeleteFromCloud from "../lib/Delete.js";

export const Create = async (req, res) => {
  const { caption, postImage, location } = req.body;
  if (!caption || !postImage) {
    return res.status(400).json({
      success: false,
      message: "Please Provide Caption And Post Image To Create A Post.",
    });
  }
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized -- User Not Found",
      });
    }
    const imageObj = await UploadOnCloud(postImage);
    if (!imageObj) {
      return res.status(500).json({
        success: false,
        message: "Error Uploading Image To Cloud Storage",
      });
    }
    const post = new Post({
      user: user._id,
      caption,
      postImage: imageObj.url,
      postImageId: imageObj.id,
      location: location ? location : "",
    });
    await post.save();
    await User.findByIdAndUpdate(user._id, {
      $push: { posts: post._id },
    });
    res.status(201).json({
      success: true,
      message: "Post Created Successfully",
      post,
    });
  } catch (error) {
    console.error(`Internal Error While Creating A Post :: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const Delete = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized -- User Not Found",
      });
    }
    const post = await Post.findById(req.params.id).populate({
      path: "user",
      select: "-password",
    });
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post Not Found",
      });
    }
    if (post.user._id.toString() !== user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized -- You Can't Delete This Post",
      });
    }
    await User.findByIdAndUpdate(user._id, {
      $pull: { posts: post._id },
    });
    await DeleteFromCloud(post.postImageId);
    await Post.findByIdAndDelete(req.params.id);

    //TODO: Handle Deleting Comment

    return res.status(201).json({
      success: true,
      message: "Post Deleted Successfully",
    });
  } catch (error) {
    console.error(`Internal Error While Deleting A Post :: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const FeedPost = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized -- User Not Found",
      });
    }
    const posts = await Post.find({ user: { $in: [user.following, user._id] } })
      .populate({
        path: "user",
        select: "-password",
      })
      .sort({ createdAt: -1 });

    if (posts.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No Posts Found",
        posts: [],
      });
    }
    return res.status(200).json({
      success: true,
      message: "Feed Posts Retrieved Successfully",
      posts,
    });
  } catch (error) {
    console.error(
      `Internal Error While Fetching Feed Posts :: ${error.message}`
    );
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const ExplorePost = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized -- User Not Found",
      });
    }
    const posts = await Post.find({
      user: { $nin: [user.following, user._id] },
    }).populate({
      path: "user",
      select: "-password",
    });
    if (posts.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No Posts Found",
        posts: [],
      });
    }
    return res.status(200).json({
      success: true,
      message: "Explore Posts Retrieved Successfully",
      posts,
    });
  } catch (error) {
    console.error(
      `Internal Error While Fetching Explore Posts :: ${error.message}`
    );
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const PostById = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized -- User Not Found",
      });
    }
    const post = await Post.findById(req.params.id)
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments",
        select: "user content",
        populate: {
          path: "user",
          select: "-password",
        },
      });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post Not Found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Post Retrieved Successfully",
      post,
    });
  } catch (error) {
    console.error(
      `Internal Error While Fetching Post By Id :: ${error.message}`
    );
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const Like = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized -- User Not Found",
      });
    }
    const post = await Post.findById(req.params.id).populate({
      path: "user",
      select: "-password",
    });
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post Not Found",
      });
    }
    const isLiked = post.likes.includes(user._id);

    if (isLiked) {
      //Unlike:-
      await Post.findByIdAndUpdate(post._id, {
        $pull: { likes: user._id },
      });
      await Notification.findOneAndDelete({
        sender: user._id,
        receiver: post.user._id,
        type: "LIKE",
        post: post._id,
      });
      return res.status(200).json({
        success: true,
        message: "Post Unliked Successfully",
      });
    } else {
      //Like:-
      await Post.findByIdAndUpdate(post._id, {
        $push: { likes: user._id },
      });
      const notification = new Notification({
        sender: user._id,
        receiver: post.user._id,
        type: "LIKE",
        post: post._id,
      });
      await notification.save();
      return res.status(200).json({
        success: true,
        message: "Post Liked Successfully",
      });
    }
  } catch (error) {
    console.error(`Internal Error While Likeing A Post :: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const CommentOnPost = async (req, res) => {
  const { content } = req.body;
  if (!content) {
    return res.status(400).json({
      success: false,
      message: "Please Provide A Comment Content",
    });
  }
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized -- User Not Found",
      });
    }
    const post = await Post.findById(req.params.id).populate({
      path: "user",
      select: "-password",
    });
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post Not Found",
      });
    }
    const com = {
      content,
      user: user._id,
      post: post._id,
    };
    const comment = new Comment(com);
    await comment.save();
    await Post.findByIdAndUpdate(post._id, {
      $push: { comments: comment._id },
    });
    const notification = new Notification({
      sender: user._id,
      receiver: post.user._id,
      type: "COMMENT",
      post: post._id,
    });
    await notification.save();
    return res.status(200).json({
      success: true,
      message: "Comment Created Successfully",
      comment,
    });
  } catch (error) {
    console.error(
      `Internal Error While Commenting On A Post :: ${error.message}`
    );
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const Save = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized -- User Not Found",
      });
    }
    const post = await Post.findById(req.params.id).populate({
      path: "user",
      select: "-password",
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post Not Found",
      });
    }
    const isSaved = user.savedPosts.includes(post._id);

    if (isSaved) {
      //Unsave:-
      await User.findByIdAndUpdate(user._id, {
        $pull: { savedPosts: post._id },
      });
      await Notification.deleteOne({
        sender: user._id,
        receiver: post.user._id,
        type: "SAVE",
        postId: post._id,
      });
      return res.status(200).json({
        success: true,
        message: "Post Unsaved Successfully",
      });
    } else {
      //Save:-
      await User.findByIdAndUpdate(user._id, {
        $push: { savedPosts: post._id },
      });
      await Notification.deleteOne({
        sender: user._id,
        receiver: post.user._id,
        type: "SAVE",
        postId: post._id,
      });
      return res.status(200).json({
        success: true,
        message: "Post Saved Successfully",
      });
    }
  } catch (error) {
    console.error(`Internal Error While Saving A Post :: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
