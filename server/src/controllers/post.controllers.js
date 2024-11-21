import User from "../model/user.model.js";
import Post from "../model/post.model.js";
import Notification from "../model/notification.model.js";
import Comment from "../model/comment.model.js";
import Upload from "../utils/Upload.js";
import Delete from "../utils/Delete.js";

export const CreatePost = async (req, res) => {
  const { postImage, caption, location } = req.body;
  if (!postImage || !caption) {
    return res.status(400).json({
      success: false,
      message: "Please Provide All The Required Details",
    });
  }
  try {
    const loggedInUser = await User.findById(req.user._id).select("-password");
    if (!loggedInUser) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized Access",
      });
    }
    const imageObj = await Upload(postImage);
    if (!imageObj) {
      return res.status(400).json({
        success: false,
        message: "Invalid Image File",
      });
    }
    const post = new Post({
      user: loggedInUser._id,
      postImage: imageObj.url,
      postImageId: imageObj.id,
      caption,
      location: location ? location : "",
    });
    await post.save();
    await User.findByIdAndUpdate(loggedInUser._id, {
      $push: { posts: post._id },
    });
    return res.status(201).json({
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

export const DeletePost = async (req, res) => {
  try {
    const loggedInUser = await User.findById(req.user._id).select("-password");
    const post = await Post.findById(req.params.id).populate("user");
    if (!loggedInUser || !post) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized Access",
      });
    }
    if (post.user._id.toString() !== loggedInUser._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You Can Only Delete Your Own Posts",
      });
    }
    await Delete(post.postImageId);
    await Post.findByIdAndDelete(post._id);
    await User.findByIdAndUpdate(loggedInUser._id, {
      $pull: { posts: post._id },
    });
    return res.status(200).json({
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

export const LikePost = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User Not Authenticated",
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
        from: user._id,
        to: post.user._id,
        content: "LIKE",
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
        from: user._id,
        to: post.user._id,
        content: "LIKE",
        post: post._id,
      });
      await notification.save();
      return res.status(200).json({
        success: true,
        message: "Post Liked Successfully",
      });
    }
  } catch (error) {
    console.error(`Internal Error While Liking A Post :: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const CommentOnPost = async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({
      success: false,
      message: "Please Provide Comment Text",
    });
  }
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User Not Authenticated",
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
    const comment = {
      user: user._id,
      text,
      post: post._id,
    };
    const newComment = new Comment(comment);
    await newComment.save();
    const notification = new Notification({
      from: user._id,
      to: post.user._id,
      content: "COMMENT",
      post: post._id,
    });
    await notification.save();
    await Post.findByIdAndUpdate(post._id, {
      $push: { comments: newComment._id },
    });
    return res.status(201).json({
      success: true,
      message: "Comment Created Successfully",
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

export const GetFeedPosts = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User Not Authenticated",
      });
    }
    const posts = await Post.find({
      user: { $in: [...user.following, user._id] },
    })
      .populate("user")
      .sort({ createdAt: -1 });

    if (posts.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No Posts Found",
        posts: [],
      });
    }
    return res.status(201).json({
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

export const GetExplorePosts = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User Not Authenticated",
      });
    }
    const posts = await Post.find({
      user: { $nin: [...user.following, user._id] },
    })
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
    return res.status(201).json({
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

export const GetPostById = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User Not Authenticated",
      });
    }
    const post = await Post.findById(req.params.id)
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments",
        populate: {
          path: "user",
          select: "-password",
        },
      })
      .populate({
        path: "likes",
        select: "-password",
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

export const SavePost = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    const post = await Post.findById(req.params.id);
    if (!post || !user) {
      return res.status(400).json({
        success: false,
        message: "Invalid Request",
      });
    }
    const isSaved = user.savedPost.includes(post._id);

    if (isSaved) {
      await User.findByIdAndUpdate(user._id, {
        $pull: { savedPost: post._id },
      });
      return res.status(200).json({
        success: true,
        message: "Post Unsaved Successfully",
        savedPost: user.savedPost,
      });
    } else {
      await User.findByIdAndUpdate(user._id, {
        $push: { savedPost: post._id },
      });
      return res.status(200).json({
        success: true,
        message: "Post Saved Successfully",
        savedPost: user.savedPost,
      });
    }
  } catch (error) {
    console.error(`Internal Error While Saving Post :: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
