import { Link, useParams } from "react-router-dom";
import { useFollowUser, useGetFollowingUser } from "../../hooks/user.hooks";
import { Loader } from "../../components/shared";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const FollowingPage = () => {
  const { username } = useParams();
  const { data: user, isLoading } = useGetFollowingUser(username);
  const { user: authUser } = useContext(AuthContext);
  const { mutateAsync: Follow } = useFollowUser();

  return (
    <div className="w-full p-2 lg:py-7 lg:px-24">
      {isLoading && <Loader text={"Loading..."} size={40} />}
      <h1 className="text-[1.5rem] tracking-tight underline decoration-violet-600">
        All Following Users :-
      </h1>
      {user?.following?.length === 0 && (
        <p className="text-center text-[1.1rem] tracking-tight cursor-default mt-4">
          No Following Users
        </p>
      )}
      <div className="w-full py-4 flex flex-col gap-2 mt-4">
        {user?.following?.map((user, i) => (
          <Link
            key={i}
            to={`/profile/${user?.username}`}
            className="h-[80px] w-full border-[1px] border-zinc-800 rounded-xl flex items-center justify-between px-4"
          >
            <div className="flex items-center">
              <img
                src={user?.avatar ? user.avatar : "/assets/profile.webp"}
                alt="profile"
                className="w-12 lg:w-14 rounded-full object-cover"
              />
              <div className="ml-2">
                <h1 className="text-[0.9rem] tracking-tight">
                  {user?.fullName}
                </h1>
                <p className="text-[0.7rem] tracking-tight text-gray-500">
                  @{user?.username}
                </p>
              </div>
            </div>
            <button
              onClick={async (e) => {
                e.preventDefault();
                await Follow(user?._id);
              }}
              className={`${
                user?.followers?.includes(authUser?._id)
                  ? "bg-gray-600 hover:bg-gray-700"
                  : "bg-violet-600 hover:bg-violet-700"
              } px-4 py-2 rounded-xl`}
            >
              {user?.followers?.includes(authUser?._id) ? "UnFollow" : "Follow"}
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default FollowingPage;
