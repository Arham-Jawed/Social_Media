import { useContext } from "react";
import { PostCard, SearchInput } from "../../components";
import { Loader } from "../../components/shared";
import { useGetExplorePosts } from "../../hooks/post.hooks";
import { AuthContext } from "../../context/AuthContext";

const ExplorePage = () => {
  const { data: posts, isLoading } = useGetExplorePosts();
  const { user } = useContext(AuthContext);
  return (
    <div className="w-full min-h-screen p-2 lg:px-32 lg:py-8">
      <div className="w-full lg:px-24 lg:py-4 my-5 flex flex-col gap-5">
        <SearchInput />
      </div>
      <div className="w-full lg:px-24 lg:py-4 my-3 flex flex-col gap-5">
        {isLoading && <Loader text={"Loading..."} size={40} />}
        {posts?.length === 0 && (
          <p className="text-center text-lg text-gray-500">No posts found.😢</p>
        )}
        {posts?.map((post, i) => (
          <PostCard key={i} post={post} user={user} />
        ))}
      </div>
    </div>
  );
};

export default ExplorePage;
