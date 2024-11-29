import { useParams } from "react-router-dom";
import { useGetPost, useSavePost } from "../../hooks/post.hooks";
import { HeartSection, Loader } from "../../components/shared";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { MessageSquare, Star } from "lucide-react";
import { CommentSection } from "../../components/shared";

const PostPage = () => {
  const { id } = useParams();
  const { data: post, isLoading } = useGetPost(id);
  const { mutateAsync: SavePost } = useSavePost();
  const { user } = useContext(AuthContext);

  const isSaved = user?.savedPosts?.includes(post?._id);

  const handleSave = async (e) => {
    e.preventDefault();
    await SavePost(post?._id);
  };

  return (
    <div className="w-full min-h-screen p-2 lg:px-32 lg:py-8">
      {isLoading && (
        <div className="h-screen flex-center w-full">
          <Loader text={"Loading.."} size={40} />
        </div>
      )}
      {post && (
        <div className="w-full flex flex-col gap-2">
          <div className="h-[450px] rounded-xl border-[1px] border-zinc-800">
            <img
              src={post?.postImage}
              alt="postImage"
              className="h-full w-full object-cover object-top lg:object-contain rounded-xl"
            />
          </div>
          <div className="min-h-[25px] w-full px-3">
            <p className="text-[0.9rem] tracking-tight cursor-default">
              {post?.caption}
            </p>
            {post?.location && (
              <p className="text-[0.6rem] tracking-tight text-gray-600">
                #{post?.location}
              </p>
            )}
          </div>
          <div className="w-full h-[40px] px-3 flex items-center justify-between">
            <div className="flex items-center gap-5">
              <HeartSection post={post} user={user} />
              <div className="Comment flex items-center h-full gap-1">
                <MessageSquare className="size-6 cursor-default" />
                <p>{post?.comments?.length}</p>
              </div>
            </div>
            <div
              onClick={handleSave}
              className={`${
                isSaved ? "text-violet-600" : ""
              } cursor-pointer h-full flex items-center`}
            >
              <Star className="size-6 " />
            </div>
          </div>
          <CommentSection post={post} user={user} />
        </div>
      )}
    </div>
  );
};

export default PostPage;
