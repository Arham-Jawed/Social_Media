import mongoose, { Schema } from "mongoose";

const postSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    caption: {
      type: String,
      required: true,
    },
    postImage: {
      type: String,
      required: true,
    },
    postImageId: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      default: "",
    },
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment", default: [] }],
    likes: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
