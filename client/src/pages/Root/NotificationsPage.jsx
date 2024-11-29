import { Bell, Trash } from "lucide-react";
import {
  useDeletedNotifications,
  useGetAllNotifications,
} from "../../hooks/notification.hooks";
import { Loader } from "../../components/shared";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useFollowUser } from "../../hooks/auth.hooks";

const NotificationsPage = () => {
  const { data: notifications, isLoading } = useGetAllNotifications();
  const { mutateAsync: DeleteNotifications } = useDeletedNotifications();
  const { mutateAsync: FollowUser } = useFollowUser();
  const { user } = useContext(AuthContext);
  const handleDelete = async (e) => {
    e.preventDefault();
    await DeleteNotifications();
  };
  return (
    <div className="w-full min-h-screen py-3 px-2 lg:px-32 lg:py-8">
      <div className="w-full flex items-center justify-between gap-1 cursor-default">
        <div className="flex items-center gap-1 underline decoration-orange-600">
          <Bell className="text-orange-800" size={30} />
          <h1 className="text-[1.5rem] tracking-tight">Notifications</h1>
        </div>
        {notifications?.length !== 0 && (
          <div
            onClick={handleDelete}
            className="flex items-center gap-1 cursor-pointer hover:text-red-600"
          >
            <Trash />
            <h1>Delete All</h1>
          </div>
        )}
      </div>
      {isLoading && <Loader text={"Loading..."} size={40} />}
      {notifications?.length === 0 && (
        <div className="w-full lg:px-24 lg:py-4 my-3 flex flex-col gap-5 cursor-default">
          <p className="text-center">No Notifications Are There.😊</p>
        </div>
      )}
      {notifications?.length > 0 && (
        <div className="w-full flex flex-col gap-5 mt-5">
          {notifications?.map((notification, i) => (
            <div
              key={i}
              className="h-[60px] w-full rounded-xl border-[1px] border-zinc-800 flex items-center justify-between px-2 py-1"
            >
              <img
                src={
                  notification?.sender?.avatar
                    ? notification.sender.avatar
                    : "/profile.webp"
                }
                alt="profile"
                className="w-8 rounded-full object-cover"
              />
              {notification?.type === "LIKE" && (
                <>
                  <h1>{notification?.sender?.fullName} Liked Your Post.❤️</h1>
                  <Link to={`/post/${notification?.post?._id}`}>
                    <img
                      src={notification?.post?.postImage}
                      alt="post Image"
                      className="size-12 rounded-xl object-cover object-top"
                    />
                  </Link>
                </>
              )}
              {notification?.type === "FOLLOW" && (
                <>
                  <h1>{notification?.sender?.fullName} Followed You.👍</h1>
                  {user?._id?.toString() !==
                    notification?.sender?._id?.toString() && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        FollowUser(notification?.sender?._id);
                      }}
                      className={` px-3 py-1 rounded-xl ${
                        user?.following?.includes(notification?.sender?._id)
                          ? "bg-gray-600"
                          : "bg-orange-800"
                      }`}
                    >
                      {user?.following?.includes(notification?.sender?._id)
                        ? "Following"
                        : "Follow"}
                    </button>
                  )}
                </>
              )}
              {notification?.type === "COMMENT" && (
                <>
                  <h1>
                    {notification?.user?.fullName} Commented On Your Post.💬
                  </h1>
                  <Link to={`/post/${notification?.post?._id}`}>
                    <img
                      src={notification?.post?.postImage}
                      alt="post Image"
                      className="size-12 rounded-xl object-cover object-top"
                    />
                  </Link>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
