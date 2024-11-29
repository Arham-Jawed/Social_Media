import { useState } from "react";
import { toast } from "react-hot-toast";
import { useCommentOnPost } from "../../hooks/post.hooks";
import { Link } from "react-router-dom";

const CommentSection = ({ post, user }) => {
  const [content, setContent] = useState("");
  const { mutateAsync: Comment } = useCommentOnPost();

  const handleComment = async (e) => {
    e.preventDefault();
    if (!content) {
      toast.error("Please Enter Comment");
      return;
    }
    await Comment({ id: post?._id, content });
    setContent("");
  };

  return (
    <div className="w-full border-[1px] border-zinc-800 p-3 rounded-xl">
      <h1 className="text-[1.3rem] tracking-tight">All Comments :-</h1>
      <div className="w-full flex items-center gap-2 mt-3">
        <input
          type="text"
          className="input"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button
          onClick={handleComment}
          className="bg-orange-800 p-2 rounded-xl"
        >
          Comment
        </button>
      </div>
      {post?.comments?.length === 0 && (
        <div className="mt-3 text-center w-full h-[100px] flex-center">
          <p>No Comments.😢</p>
        </div>
      )}
      {post?.comments?.length > 0 && (
        <div className="mt-3 w-full p-1 lg:p-2 flex flex-col gap-4">
          {post?.comments?.reverse()?.map((comment, i) => (
            <div
              key={i}
              className="min-h-[60px] w-full border-[1px] border-zinc-800 rounded-xl flex items-center"
            >
              <div className="w-[15%] lg:w-[10%] h-full flex-center">
                <Link to={`/profile/${comment?.user?.username}`}>
                  <img
                    src={
                      comment?.user?.avatar
                        ? comment.user.avatar
                        : "/profile.webp"
                    }
                    alt="profile"
                    className="size-10 lg:size-12 rounded-full object-cover
                "
                  />
                </Link>
              </div>
              <div className="w-[85%] lg:w-[90%] h-full flex flex-col justify-center">
                <p className="text-[0.7rem] tracking-tight leading-3 text-gray-500">
                  @{comment?.user?.username}
                </p>
                <p className="text-[0.8rem] tracking-tighter ml-2">
                  {comment?.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
