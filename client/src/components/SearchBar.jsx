import { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { useSearchUser } from "../hooks/user.hooks";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const [identifier, setIdentifier] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { mutateAsync: Search, isPending, isError, error } = useSearchUser();
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!identifier) {
      toast.error("Please Fill The Field First");
      return;
    }
    const res = await Search({ identifier });
    setUser(res);
    setIdentifier("");
  };
  return (
    <div className="mb-4">
      <div className="lg:w-[550px] bg-black w-full rounded-xl border-[1px] border-zinc-800 flex items-center gap-2 overflow-hidden mb-4 lg:mx-auto px-3">
        <input
          type="text"
          className="w-full outline-none bg-transparent rounded-xl py-2 px-4"
          placeholder="Search User"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
        />
        <CiSearch
          onClick={handleSearch}
          size={30}
          className="cursor-pointer hover:text-violet-600"
        />
      </div>
      {user && user?.length > 0 && (
        <>
          {user?.map((user, i) => (
            <div
              key={i}
              className="min-h-[50px] lg:w-[550px] w-full border-[1px] border-zinc-800 rounded-xl flex items-center justify-between p-3 mx-auto mb-3"
            >
              <div className="flex items-center gap-4">
                <img
                  src={user?.avatar ? user.avatar : "/assets/profile.webp"}
                  alt="user"
                  className="w-12 rounded-full object-cover"
                />
                <div>
                  <h1 className="text-[0.8rem] tracking-tight leading-4">
                    {user?.fullName}
                  </h1>
                  <p className="text-[0.7rem] tracking-tighter leading-3 text-gray-500">
                    @{user?.username}
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate(`/profile/${user?.username}`)}
                className="bg-violet-600 py-1 px-4 rounded-xl hover:bg-violet-700"
              >
                Profile
              </button>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default SearchBar;
