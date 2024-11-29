import { Search } from "lucide-react";
import { useFollowUser, useSearchUser } from "../hooks/auth.hooks";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const SearchInput = () => {
  const { user: authUser } = useContext(AuthContext);
  const { mutateAsync: SearchUser } = useSearchUser();
  const { mutateAsync: FollowUser } = useFollowUser();
  const [users, setUsers] = useState(null);
  const [identifier, setIdentifier] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!identifier) return;
    const response = await SearchUser(identifier);
    setUsers(response);
    setIdentifier("");
  };
  return (
    <>
      <div className="w-full flex items-center gap-2 input">
        <input
          type="text"
          placeholder="Search User.."
          className="w-full bg-transparent outline-none"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
        />
        <Search onClick={handleSearch} size={25} className="cursor-pointer" />
      </div>
      {users && (
        <div className="w-full flex flex-col items-center gap-3">
          {users.map((user, i) => (
            <div
              key={i}
              className="h-[60px] w-full rounded-xl border-[1px] border-zinc-800 flex items-center justify-between px-3"
            >
              <Link
                to={`/profile/${user?.username}`}
                className="flex items-center gap-3 h-full"
              >
                <img
                  src={user?.avatar ? user.avatar : "/profile.webp"}
                  alt="profile"
                  className="w-9 rounded-full object-cover"
                />
                <div>
                  <h1 className="text-[0.8rem] tracking-tight leading-4 ml-1">
                    {user?.fullName}
                  </h1>
                  <p className="text-[0.7rem] tracking-tight leading-3 text-gray-500">
                    @{user?.username}
                  </p>
                </div>
              </Link>
              <button
                onClick={async (e) => {
                  e.preventDefault();
                  await FollowUser(user?._id);
                }}
                className={`${
                  authUser?.following?.includes(user?._id)
                    ? "bg-gray-900"
                    : "bg-orange-800"
                }  px-4 py-1 rounded-xl hover:bg-orange-900`}
              >
                {authUser?.following?.includes(user?._id)
                  ? "Following"
                  : "Follow"}
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default SearchInput;
