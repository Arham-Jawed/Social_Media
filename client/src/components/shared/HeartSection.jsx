import React from "react";
import { useLikePost } from "../../hooks/post.hooks";
import { Heart } from "lucide-react";

const HeartSection = ({ post, user }) => {
  const { mutateAsync: LikePost } = useLikePost();

  const handleLike = async (e) => {
    e.preventDefault();
    await LikePost(post?._id);
  };
  return (
    <div
      onClick={handleLike}
      className={`${
        post?.likes?.includes(user?._id) && "text-red-600"
      } Heart flex items-center h-full gap-1 cursor-pointer`}
    >
      <Heart className="size-6" />
      <p>{post?.likes?.length}</p>
    </div>
  );
};

export default HeartSection;
