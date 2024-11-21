import React, { useEffect } from "react";
import { CiHeart } from "react-icons/ci";
import { LiaCommentAltSolid } from "react-icons/lia";
import { useLikePost } from "../../hooks/post.hooks";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const BottomPostCard = ({ post, user }) => {
  const { mutateAsync: Like } = useLikePost();
  const navigate = useNavigate();
  const isLiked = post?.likes?.includes(user?._id);

  const handleLike = async (e) => {
    e.preventDefault();
    const res = await Like(post._id);
    if (!res) {
      toast.error("Failed To Like");
      return;
    }
  };

  return (
    <div className="Bottom w-full px-6 flex items-center justify-between">
      <div className="Like_Comment flex items-center gap-5">
        <div className="flex items-center gap-1 cursor-pointer hover:text-red-500 mt-1">
          <CiHeart
            onClick={handleLike}
            size={25}
            className={`${isLiked && "text-red-500"}`}
          />
          <h1>{post?.likes?.length}</h1>
        </div>
        <div className="flex items-center gap-1 cursor-pointer hover:text-red-500 mt-1">
          <LiaCommentAltSolid
            onClick={() => navigate(`/post/${post._id}`)}
            size={25}
          />
          <h1>{post?.comments?.length}</h1>
        </div>
      </div>
    </div>
  );
};

export default BottomPostCard;
