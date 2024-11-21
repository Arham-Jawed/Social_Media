import { useCommentOnPost, useGetPostById } from "../../hooks/post.hooks";
import { useParams } from "react-router-dom";
import { BottomPostCard, Loader } from "../../components/shared";
import { CiHeart } from "react-icons/ci";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";

const PostPage = () => {
  const [text, setText] = useState("");
  const { id } = useParams();
  const { data: post, isLoading } = useGetPostById(id);
  const { mutateAsync: Comment } = useCommentOnPost();
  const { user } = useContext(AuthContext);

  console.log(post?.comments);

  const handleComment = async (e) => {
    e.preventDefault();
    if (!text) {
      toast.error(`text For Comment Is Required`);
      return;
    }
    await Comment({ id: post?._id, text });
    setText("");
  };
  return (
    <div className="w-full p-2 lg:py-7 lg:px-24 flex flex-col gap-4">
      {isLoading && <Loader text={"Loading...."} size={40} />}
      <div className="w-full p-2 border-[1px] border-zinc-800 rounded-xl">
        <div className="h-[300px] lg:h-[550px] w-full">
          <img
            src={post?.postImage}
            alt="postImage"
            className="h-full w-full object-contain lg:object-cover object-top rounded-xl"
          />
        </div>
        <div className="w-full mt-2">
          <h2 className="text-[1rem] tracking-tight text-gray-300 px-4 cursor-default">
            {post?.caption}
          </h2>
          <p className="text-[0.9rem] tracking-tight text-gray-500 px-4 cursor-default leading-3">
            #{post?.location}
          </p>
        </div>
        <BottomPostCard user={user} post={post} />
      </div>
      <div className="w-full p-2 border-[1px] border-zinc-800 rounded-xl">
        <h1 className="text-[1.2rem] tracking-tight">Comments :-</h1>
        <div className="flex items-center gap-1">
          <input
            type="text"
            className="input mt-2"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button
            onClick={handleComment}
            className="bg-violet-600 py-2 mt-2 rounded-xl px-2 hover:bg-violet-700"
          >
            Comment
          </button>
        </div>
        {post?.comments?.length === 0 && (
          <div className="mt-3">
            <h1 className="text-center">No Comments</h1>
          </div>
        )}
        {post?.comments?.map((comment, i) => (
          <div
            key={i}
            className="min-h-[70px] w-full p-1 border-b-[1px] border-zinc-800 mt-3 flex items-center"
          >
            <img
              src={
                comment?.user?.avatar
                  ? comment.user.avatar
                  : "/assets/profile.webp"
              }
              alt="profile"
              className="w-10 rounded-full object-cover"
            />
            <div className="flex flex-col ml-3">
              <h1 className="text-[0.7rem] tracking-tight">
                @{comment?.user?.username}
              </h1>
              <p className="text-[0.8rem] tracking-tight leading-4 ml-2">
                {comment?.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostPage;
