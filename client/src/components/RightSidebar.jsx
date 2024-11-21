import React from "react";
import { Link } from "react-router-dom";
import { useGetSuggestedUser } from "../hooks/user.hooks";
import { Loader } from "../components/shared";

const RightSidebar = () => {
  const { data: suggestedUsers, isLoading } = useGetSuggestedUser();
  return (
    <div className="hidden h-screen w-[17rem] border-l-[1px] border-zinc-800 sticky top-0 right-0 lg:flex flex-col items-center py-6 px-1 bg-black gap-4">
      <h1 className="text-[1.5rem] tracking-tight cursor-default">
        Suggested Users
      </h1>
      <div className="w-full flex justify-center flex-wrap gap-2">
        {isLoading && <Loader text={"Loading..."} size={30} />}
        {suggestedUsers && suggestedUsers.length === 0 && (
          <p>No Suggested Users</p>
        )}
        {suggestedUsers &&
          suggestedUsers.map((user, i) => (
            <Link
              key={i}
              to={`/profile/${user.username}`}
              className="w-[45%] h-[160px] bg-black border-[1px] border-zinc-800 rounded-xl flex flex-col items-center gap-1 pt-2"
            >
              <img
                src={user?.avatar ? user.avatar : "/assets/profile.webp"}
                alt="profile"
                className="w-24 rounded-full object-cover mb-2"
              />
              <h1 className="text-[0.9rem] tracking-tight text-white leading-3">
                {user?.fullName}
              </h1>
              <p className="text-[0.7rem] tracking-tight text-gray-500 leading-4">
                @{user?.username}
              </p>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default RightSidebar;
