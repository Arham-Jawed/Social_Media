import mongoose, { Schema } from "mongoose";

const postSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    postImage: {
      type: String,
      required: [true, "Post Image Is Required"],
    },
    postImageId: {
      type: String,
      required: [true, "Post Image Id Is Required"],
    },
    caption: {
      type: String,
      required: [true, "Caption Is Required"],
    },
    location: {
      type: String,
      default: "",
    },
    likes: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment", default: [] }],
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
