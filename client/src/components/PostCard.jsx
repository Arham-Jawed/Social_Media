import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { AuthContext } from "../context/AuthContext";
import { MdOutlineDelete } from "react-icons/md";
import { BottomPostCard } from "./shared";
import { useDeletePost } from "../hooks/post.hooks";
import { toast } from "react-hot-toast";

const PostCard = ({ post }) => {
  const { mutateAsync: Delete } = useDeletePost();
  const { user } = useContext(AuthContext);
  const isSame = user._id.toString() === post.user._id.toString();
  const navigate = useNavigate();

  const handleDelete = async (e) => {
    e.preventDefault();
    const res = await Delete(post?._id);
    if (!res) {
      toast.error("Delete Post Failed");
      return;
    }
  };

  return (
    <div className="lg:w-[550px] lg:h-[600px] bg-black w-full h-[500px] rounded-xl border-[1px] border-zinc-800 flex flex-col gap-1 overflow-hidden">
      <div className="Top h-[50px] lg:h-[65px] w-full border-b-[1px] border-zinc-800 flex items-center justify-between px-4 py-3">
        <Link
          to={`/profile/${post?.user?.username}`}
          className="flex items-center gap-1"
        >
          <img
            src={post?.user?.avatar ? post.user.avatar : "/assets/profile.webp"}
            alt="profile"
            className="w-9 lg:w-10 rounded-full object-cover"
          />
          <div>
            <h1 className="text-[0.7rem] lg:text-[0.8rem] tracking-tight">
              {post?.user?.fullName}
            </h1>
            <p className="text-[0.6rem] lg:text-[0.7rem] tracking-tight leading-3 text-gray-500">
              @{post?.user?.username}
            </p>
          </div>
        </Link>
        <div className="flex items-center gap-3">
          <div className="lg:mt-2 mt-1 cursor-default">
            <p className="text-[0.7rem] tracking-tighter">
              {formatDistanceToNow(post?.createdAt)} ago
            </p>
            {post?.location && (
              <p className="text-[0.7rem] tracking-tight text-gray-600">
                #{post?.location}
              </p>
            )}
          </div>
          {isSame && (
            <MdOutlineDelete
              onClick={handleDelete}
              size={25}
              className="text-red-500 cursor-pointer"
            />
          )}
        </div>
      </div>
      <div
        onClick={() => navigate(`/post/${post?._id}`)}
        className="Image h-[390px] lg:h-[465px] w-full border-b-[1px] border-zinc-800 cursor-pointer"
      >
        <img
          src={post?.postImage}
          alt="postImage"
          className="h-full w-full object-contain"
        />
      </div>
      <div className="w-full">
        <h2 className="text-[0.8rem] tracking-tight text-gray-300 px-4 cursor-default">
          {post?.caption}
        </h2>
        <BottomPostCard post={post} user={user} />
      </div>
    </div>
  );
};

export default PostCard;
