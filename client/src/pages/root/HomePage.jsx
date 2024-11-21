import React from "react";
import { useGetFeedPosts } from "../../hooks/post.hooks";
import { Loader } from "../../components/shared";
import PostCard from "../../components/PostCard";

const HomePage = () => {
  const { data: posts, isLoading } = useGetFeedPosts();
  return (
    <div className="lg:py-7 min-w-full py-2 px-1">
      {isLoading ? (
        <Loader size={40} text={"Loading...."} />
      ) : (
        <div className="w-full flex flex-col items-center gap-5">
          {posts?.length === 0 && (
            <h1 className="text-center mt-52 text-[1.5rem]">
              You Haven't Created Any Posts Or Haven't Followed Anyone.😢
            </h1>
          )}
          {posts?.map((post, i) => (
            <PostCard key={i} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
