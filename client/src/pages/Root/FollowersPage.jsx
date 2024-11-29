import { Link, useParams } from "react-router-dom";
import { useFollowUser, useUserByUsername } from "../../hooks/auth.hooks";
import { Loader } from "../../components/shared";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
const FollowersPage = () => {
  const { username } = useParams();
  const { data: user, isLoading } = useUserByUsername(username);
  const { mutateAsync: FollowUser } = useFollowUser();
  const { user: authUser } = useContext(AuthContext);
  return (
    <div className="w-full min-h-screen p-2 lg:px-32 lg:py-8">
      <h1 className="text-[1.4rem] tracking-tight">Followers :-</h1>
      {isLoading && (
        <div className="w-full h-screen flex justify-center items-center">
          <Loader text={"Loading..."} size={40} />
        </div>
      )}
      {user?.followers?.length === 0 && (
        <div className="h-[400px] w-full flex-center">
          <p className="text-[1.5rem] tracking-tight cursor-default">
            No Followers Yet.😢
          </p>
        </div>
      )}
      {user?.followers?.length > 0 && (
        <div className="w-full flex flex-col gap-3 mt-4">
          {user?.followers?.map((user, i) => (
            <div
              key={i}
              className="w-full h-[70px] rounded-xl flex items-center justify-between px-4 border-[1px] border-zinc-800"
            >
              <Link
                to={`/profile/${user?.username}`}
                className="flex items-center gap-2"
              >
                <img
                  src={user?.avatar ? user.avatar : "/profile.webp"}
                  alt="profile"
                  className="w-12 rounded-full object-cover"
                />
                <div className="mt-1">
                  <h1 className="text-[0.8rem] tracking-tight leading-4">
                    {user?.fullName}
                  </h1>
                  <p className="text-[0.7rem] tracking-tight text-gray-500">
                    @{user?.username}
                  </p>
                </div>
              </Link>
              {authUser?._id?.toString() === user?._id?.toString() && (
                <p className="py-2 px-8 bg-gray-700 rounded-xl cursor-default">
                  You
                </p>
              )}
              {authUser?._id?.toString() !== user?._id?.toString() && (
                <button
                  onClick={async (e) => {
                    e.preventDefault();
                    await FollowUser(user._id);
                  }}
                  className={`${
                    authUser?.following?.includes(user._id) && "bg-gray-900 text-gray-400"
                  } bg-gray-700 px-4 py-2 rounded-xl`}
                >
                  {authUser?.following?.includes(user._id)
                    ? "Following"
                    : "Follow"}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FollowersPage;
