import { useGetFeedPosts } from "../../hooks/post.hooks";
import { Loader } from "../../components/shared";
import { Link } from "react-router-dom";
import { PostCard } from "../../components";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const HomePage = () => {
  const { data: posts, isLoading } = useGetFeedPosts();
  const { user } = useContext(AuthContext);
  return (
    <div className="w-full min-h-screen p-2 lg:px-32 lg:py-8">
      {isLoading && <Loader text={"Loading..."} size={40} />}
      {posts?.length === 0 && (
        <div className="w-full h-[calc(100vh-8rem)] lg:h-[calc(100vh-8rem)] flex-center flex-col">
          <h1 className="text-center mb-4 text-[0.9rem] lg:text-[1.3rem] tracking-tight">
            No Post Is Created By You Or You Haven't Followed Anyone.😢
          </h1>
          <Link
            to="/create"
            className="text-orange-800 underline decoration-orange-800"
          >
            Create Your Own Post
          </Link>
        </div>
      )}
      <div className="w-full lg:px-24 lg:py-4 my-3 flex flex-col gap-5">
        {posts?.map((post, i) => (
          <PostCard key={i} post={post} user={user} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
