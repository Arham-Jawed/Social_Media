import { useGetSuggestedUsers } from "../hooks/auth.hooks";
import { Loader } from "../components/shared";
import { Link } from "react-router-dom";

const RightSidebar = () => {
  const { data: users, isLoading } = useGetSuggestedUsers();
  return (
    <div className="w-[17rem] border-l-[1px] border-zinc-800 h-screen sticky top-0 right-0 lg:flex flex-col items-center hidden py-6 justify-start gap-6">
      <h1 className="text-[1.2rem] tracking-tight">Suggested Users</h1>
      {isLoading && (
        <div className="w-full h-[300px] flex-center">
          <Loader text={"Loading..."} size={25} />
        </div>
      )}
      {users?.length === 0 && (
        <div className="w-full h-[300px] flex-center">
          <p>No Suggested Users.😢</p>
        </div>
      )}
      {users?.length > 0 && (
        <div className="w-full mt-3 flex items-center flex-wrap gap-3 gap-y-4 px-4">
          {users?.map((user, i) => (
            <Link
              to={`/profile/${user?.username}`}
              key={i}
              className="w-[110px] h-[150px] border-[1px] border-zinc-800 rounded-xl flex flex-col items-center py-3"
            >
              <img
                src={user?.avatar ? user.avatar : "/profile.webp"}
                alt="profile"
                className="size-20 rounded-full object-cover"
              />
              <h1 className="text-[0.8rem] tracking-tight leading-5 mt-2">
                {user?.fullName}
              </h1>
              <p className="text-[0.7rem] tracking-tight leading-4 text-gray-500">
                @{user?.username}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default RightSidebar;
