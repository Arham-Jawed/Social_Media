import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full Name Is Required"],
    },
    username: {
      type: String,
      required: [true, "Username Is Required"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Email Is Required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password Is Required"],
      minlength: [6, "Password must be at least 6 Characters"],
    },
    avatar: {
      type: String,
      default: "",
    },
    avatarId: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    savedPosts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
  },
  { timestamps: true }
); 

const User = mongoose.model("User", userSchema);

export default User;
