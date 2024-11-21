import React from "react";
import { useGetExplorePosts } from "../../hooks/post.hooks";
import { Loader } from "../../components/shared";
import { PostCard, SearchBar } from "../../components";

const ExplorePage = () => {
  const { data: posts, isLoading } = useGetExplorePosts();
  return (
    <div className="lg:py-7 min-w-full py-2 px-1">
      {isLoading ? (
        <Loader size={40} text={"Loading...."} />
      ) : (
        <>
          <SearchBar />
          <div className="w-full flex flex-col items-center gap-5">
            {posts.length === 0 && (
              <h1 className="text-center mt-52 text-[1.5rem]">
                No One Has Created Any Posts.😢
              </h1>
            )}
            {posts.map((post, i) => (
              <PostCard key={i} post={post} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ExplorePage;
