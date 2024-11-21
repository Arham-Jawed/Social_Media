import React, { useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useFollowUser, useGetUserByUsername } from "../../hooks/user.hooks";
import { Loader } from "../../components/shared";
import { AuthContext } from "../../context/AuthContext";

const ProfilePage = () => {
  const { username } = useParams();
  const { data: user, isLoading } = useGetUserByUsername({ username });
  const { user: authUser } = useContext(AuthContext);
  const same = authUser?._id.toString() === user?._id.toString();
  const navigate = useNavigate();
  const { mutateAsync: Follow } = useFollowUser();

  return (
    <div className="w-full p-2 lg:py-7 lg:px-24">
      {isLoading && <Loader text={"Loading...."} size={40} />}
      <div className="Main_Profile w-full lg:min-h-[180px] min-h-[150px] border-[1px] border-zinc-800 rounded-xl overflow-hidden">
        <div className="Profile_Top w-full h-[70px] lg:h-[80px] flex items-center overflow-hidden">
          <div className="Half_Profile h-full w-[35%] lg:w-[30%] flex items-center gap-1 px-1 lg:px-3 cursor-default lg:gap-2">
            <img
              src={user?.avatar ? user.avatar : "/assets/profile.webp"}
              alt="profile"
              className="w-10 lg:w-14 rounded-full object-cover"
            />
            <div>
              <h1 className="text-[0.8rem] lg:text-[0.9rem] tracking-tight leading-3">
                {user?.fullName}
              </h1>
              <p className="text-[0.7rem] lg:text-[0.8rem] tracking-tight leading-3 lg:leading-4 text-gray-500">
                @{user?.username}
              </p>
            </div>
          </div>
          <div className="half_Profile h-full w-[65%] lg:w-[70%] flex items-center justify-between px-4 lg:px-7">
            <div className="flex-center flex-col cursor-default">
              <h1 className="text-[0.8rem] tracking-tight">
                {user?.posts?.length}
              </h1>
              <p className="text-[0.8rem] tracking-tight">Posts</p>
            </div>
            <div
              onClick={() => navigate(`/following/${username}`)}
              className="flex-center flex-col cursor-pointer"
            >
              <h1 className="text-[0.8rem] tracking-tight">
                {user?.following?.length}
              </h1>
              <p className="text-[0.8rem] tracking-tight">Following</p>
            </div>
            <div
              onClick={() => navigate(`/followers/${username}`)}
              className="flex-center flex-col cursor-pointer"
            >
              <h1 className="text-[0.8rem] tracking-tight">
                {user?.followers?.length}
              </h1>
              <p className="text-[0.8rem] tracking-tight">Followers</p>
            </div>
          </div>
        </div>
        <div className="Profile_Bottom w-full min-h-[80px] lg:min-h-[98px] flex flex-col py-2">
          {user?.bio && (
            <div className="min-h-[40px] lg:min-h-[45px] px-2">
              <h1 className="text-[0.8rem] tracking-tight leading-3">bio</h1>
              <p className="text-[0.8rem] tracking-tight mt-1 leading-4">{user.bio}</p>
            </div>
          )}
          <div className="h-full w-full flex items-center justify-start gap-6">
            {same && (
              <button
                onClick={() => navigate(`/edit-profile`)}
                className="bg-violet-600 hover:bg-violet-700 px-4 py-2 rounded-xl mt-4 ml-3 lg:px-5 lg:mt-6"
              >
                Edit Profile
              </button>
            )}
            {!same && (
              <button
                onClick={async (e) => {
                  e.preventDefault();
                  await Follow(user?._id);
                }}
                className={` px-4 py-2 rounded-xl mt-4 ml-3 lg:px-5 ${
                  user?.followers?.includes(authUser?._id)
                    ? "bg-gray-600 hover:bg-gray-700"
                    : "bg-violet-600 hover:bg-violet-700"
                }`}
              >
                {user?.followers?.includes(authUser?._id)
                  ? "UnFollow"
                  : "Follow"}
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="Post_Section w-full lg:min-h-[300px] min-h-[300px] border-[1px] border-zinc-800 rounded-xl overflow-hidden mt-4 flex flex-wrap gap-x-4 gap-y-3 p-3 lg:gap-x-9 lg:gap-y-4">
        {user?.posts?.length === 0 && (
          <div className="h-[300px] w-full flex-center flex-col gap-1">
            {same && (
              <>
                <h1>You Haven't Created Any Post Yet.</h1>
                <Link to="/create" className="text-violet-600">
                  Create Post
                </Link>
              </>
            )}
            {!same && (
              <h1 className="cursor-default">
                No Post Is Created By This User
              </h1>
            )}
          </div>
        )}
        {user?.posts?.map((post, i) => (
          <Link
            to={`/post/${post._id}`}
            key={i}
            className="h-[150px] w-[170px] rounded-xl lg:h-[300px] lg:w-[230px] overflow-hidden border-[2px] border-gray-400"
          >
            <img
              src={post?.postImage}
              alt="postImage"
              className="h-full w-full object-cover object-top"
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProfilePage;
