import { MessageSquare, Star } from "lucide-react";
import { useSavePost } from "../hooks/post.hooks";
import { HeartSection } from "./shared";
import { Link } from "react-router-dom";

const BottomPostCardSection = ({ post, user }) => {
  const { mutateAsync: SavePost } = useSavePost();
  const isSaved = user?.savedPosts?.includes(post?._id);

  const handleSave = async (e) => {
    e.preventDefault();
    await SavePost(post?._id);
  };

  return (
    <>
      <div className="h-[50px] lg:h-[60px] w-full bg-transparent flex items-center justify-between px-3 lg:px-5">
        <div className="Heart_Comment flex items-center h-full gap-3">
          <HeartSection post={post} user={user} />
          <Link
            to={`/post/${post?._id}`}
            className="Comment flex items-center h-full gap-1"
          >
            <MessageSquare className="size-6 cursor-pointer hover:text-orange-800" />
            <p>{post?.comments?.length}</p>
          </Link>
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
    </>
  );
};

export default BottomPostCardSection;
