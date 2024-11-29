import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { Trash } from "lucide-react";
import BottomPostCardSection from "./BottomPostCardSection";
import { useDeletePost } from "../hooks/post.hooks";

const PostCard = ({ post, user }) => {
  const { mutateAsync: DeletePost } = useDeletePost();
  const same = post?.user?._id?.toString() === user?._id?.toString();
  const handleDelete = async (e) => {
    e.preventDefault();
    await DeletePost(post?._id);
  };
  return (
    <div className="w-full rounded-xl overflow-hidden border-[1px] border-zinc-800">
      <div className="Post_Head w-full h-[50px] lg:h-[70px] bg-transparent flex items-center justify-between px-3 border-b-[1px] border-zinc-800">
        <Link
          to={`/profile/${post?.user?.username}`}
          className="User_Profile flex items-center gap-2 h-full"
        >
          <img
            src={post?.user?.avatar ? post.user.avatar : "/profile.webp"}
            alt="profile"
            className="size-10 lg:size-12 rounded-full object-cover"
          />
          <div className="mt-1">
            <h1 className="text-[0.8rem] lg:text-[0.9rem] tracking-tight leading-3">
              {post?.user?.fullName}
            </h1>
            <p className="text-[0.7rem] lg:text-[0.7rem] tracking-tighter lg:tracking-tight leading-4 text-gray-500">
              @{post?.user?.username}
            </p>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <div className="h-full flex flex-col mt-1">
            <p className="text-[0.7rem] tracking-tighter text-gray-500">
              {formatDistanceToNow(post?.createdAt)} ago
            </p>
            {post?.location && (
              <p className="text-[0.6rem] lg:text-[0.7rem] tracking-tight text-gray-600">
                #{post?.location}
              </p>
            )}
          </div>
          {same && (
            <Trash
              onClick={handleDelete}
              className="size-5 lg:size-6 hover:text-red-600 cursor-pointer"
            />
          )}
        </div>
      </div>
      <div className="Post_Image w-full h-[400px] lg:h-[470px] bg-transparent lg:px-3 border-b-[1px] border-zinc-800 py-1">
        <Link to={`/post/${post?._id}`} className="h-full w-full">
          <img
            src={post?.postImage}
            alt="postImage"
            className="h-full w-full object-contain"
          />
        </Link>
      </div>
      <div className="Caption min-h-[30px] lg:min-h-[40px] w-full bg-transparent flex flex-col justify-center px-3 lg:px-5">
        <p className="text-[0.9rem] lg:text-[1rem] tracking-tight">
          {post?.caption}
        </p>
      </div>
      <BottomPostCardSection post={post} user={user} />
    </div>
  );
};

export default PostCard;
