import { Link, useParams } from "react-router-dom";
import { useFollowUser, useUserByUsername } from "../../hooks/auth.hooks";
import { Loader } from "../../components/shared";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

const ProfilePage = () => {
  const { username } = useParams();
  const { data: user, isLoading } = useUserByUsername(username);
  const { mutateAsync: FollowUser } = useFollowUser();
  const { user: authUser } = useContext(AuthContext);
  const [isSelected, setIsSelected] = useState("POSTS");

  const handleFollow = async (e) => {
    e.preventDefault();
    await FollowUser(user?._id);
  };
  return (
    <div className="w-full min-h-screen p-2 lg:px-32 lg:py-8 flex flex-col gap-2">
      {isLoading && (
        <div className="h-screen w-full flex-center">
          <Loader text={"Loading..."} size={40} />
        </div>
      )}
      {user && (
        <>
          <div className="Top_Profile w-full lg:px-24 lg:py-4 my-3 flex flex-col gap-1 rounded-xl px-2">
            <div className="Top flex items-center justify-between h-[80px]">
              <div className="w-[40%] lg:w-[30%] h-full flex items-center gap-2">
                <img
                  src={user?.avatar ? user.avatar : "/profile.webp"}
                  alt="profile"
                  className="size-12 rounded-full object-cover"
                />
                <div>
                  <h1 className="text-[0.8rem] tracking-tight leading-4 ml-1">
                    {user?.fullName}
                  </h1>
                  <p className="text-[0.7rem] tracking-tight text-gray-500">
                    @{user?.username}
                  </p>
                </div>
              </div>
              <div className="w-[59%] lg:w-[69%] h-full flex items-center justify-evenly">
                <div className="flex items-center justify-between flex-col">
                  <p className="text-[0.8rem] tracking-tight leading-4">
                    {user?.posts?.length}
                  </p>
                  <h1 className="text-[0.8rem] tracking-tight leading-4">
                    Posts
                  </h1>
                </div>
                <Link
                  to={`/followers/${user?.username}`}
                  className="flex-center flex-col"
                >
                  <p className="text-[0.8rem] tracking-tight leading-4">
                    {user?.followers?.length}
                  </p>
                  <h1 className="text-[0.8rem] tracking-tight leading-4">
                    Followers
                  </h1>
                </Link>
                <Link
                  to={`/following/${user?.username}`}
                  className="flex-center flex-col"
                >
                  <p className="text-[0.8rem] tracking-tight leading-4">
                    {user?.following?.length}
                  </p>
                  <h1 className="text-[0.8rem] tracking-tight leading-4">
                    Following
                  </h1>
                </Link>
              </div>
            </div>
            <div className="Bottom flex flex-col min-h-[50px]">
              {user?.bio && (
                <div>
                  <p className="text-[0.9rem] tracking-tight leading-4">
                    {user?.bio}
                  </p>
                </div>
              )}
              <div className="flex items-center justify-between lg:justify-start w-full mt-3 gap-5">
                <Link
                  to={"/update-profile"}
                  className="bg-gray-700 hover:bg-gray-800 px-4 py-1 rounded-xl"
                >
                  Edit Profile
                </Link>
                {authUser?._id?.toString() !== user?._id?.toString() && (
                  <Link
                    onClick={handleFollow}
                    className={`hover:bg-gray-800 px-8 py-1 rounded-xl ${
                      authUser?.following?.includes(user?._id)
                        ? "bg-gray-800"
                        : "bg-orange-800"
                    }`}
                  >
                    {authUser?.following?.includes(user?._id)
                      ? "Following"
                      : "Follow"}
                  </Link>
                )}
              </div>
            </div>
          </div>
          <div className="Bottom_Profile w-full lg:px-24 lg:py-4 my-3 flex flex-col gap-1 rounded-xl px-1">
            <div className="w-full h-[40px] flex items-center gap-1">
              <button
                onClick={() => setIsSelected("POSTS")}
                className={`${
                  isSelected === "POSTS" && "bg-gray-800"
                } h-full w-[50%] bg-gray-700 rounded-xl`}
              >
                Posts
              </button>
              <button
                onClick={() => setIsSelected("SAVED")}
                className={`
                ${isSelected === "SAVED" && "bg-gray-800"}
                h-full w-[50%] bg-gray-700 rounded-xl`}
              >
                Saved
              </button>
            </div>
            <div className="w-full flex gap-1 justify-between lg:justify-evenly gap-y-4 flex-wrap mt-4">
              {isSelected === "POSTS" && (
                <>
                  {user?.posts?.length === 0 &&
                    authUser?._id?.toString() === user?._id?.toString() && (
                      <div className="w-full h-[300px] flex-center flex-col">
                        <p className="text-[0.9rem] tracking-tight leading-4 text-center w-full">
                          Create Your Post And Show The World.❤️
                        </p>
                        <Link
                          className="text-[0.8rem] tracking-tight underline text-orange-800 mt-2"
                          to="/create"
                        >
                          Create Your Post
                        </Link>
                      </div>
                    )}
                  {user?.posts?.length === 0 &&
                    authUser?._id?.toString() !== user?._id?.toString() && (
                      <div className="w-full h-[300px] flex-center flex-col">
                        <p className="text-[0.9rem] tracking-tight leading-4 text-center w-full">
                          No Post Is Created By This User.😢
                        </p>
                      </div>
                    )}
                  {user?.posts?.map((post, i) => (
                    <Link
                      to={`/post/${post?._id}`}
                      key={i}
                      className="w-[48%] lg:w-[170px] h-[250px] rounded-xl overflow-hidden"
                    >
                      <img
                        src={post?.postImage}
                        alt="postImage"
                        className="h-full w-full object-cover"
                      />
                    </Link>
                  ))}
                </>
              )}
              {isSelected === "SAVED" && (
                <>
                  {user?.savedPosts?.length === 0 && (
                    <div className="w-full h-[300px] flex-center flex-col">
                      <p className="text-[0.9rem] tracking-tight leading-4 text-center w-full">
                        No Saved Posts. Please Save Some Posts.👍
                      </p>
                      <Link
                        className="text-[0.8rem] tracking-tight underline text-orange-800 mt-2"
                        to="/create"
                      >
                        Create Your Post
                      </Link>
                    </div>
                  )}
                  {user?.savedPosts?.map((post, i) => (
                    <Link
                      to={`/post/${post?._id}`}
                      key={i}
                      className="w-[48%] lg:w-[170px] h-[250px] rounded-xl overflow-hidden"
                    >
                      <img
                        src={post?.postImage}
                        alt="postImage"
                        className="h-full w-full object-cover"
                      />
                    </Link>
                  ))}
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfilePage;
