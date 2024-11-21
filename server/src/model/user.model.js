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
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "Email Is Required"],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password Is Required"],
      minlength: 6,
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
    followers: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
    following: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
    posts: [{ type: Schema.Types.ObjectId, ref: "Post", default: [] }],
    savedPost: [{ type: Schema.Types.ObjectId, ref: "Post", default: [] }],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
