import React from "react";
import { FaRegBell } from "react-icons/fa";
import { MdOutlineDelete } from "react-icons/md";
import {
  useDeleteAllNotifications,
  useDeleteNotification,
  useGetAllNotifications,
} from "../../hooks/notification.hooks";
import { Loader } from "../../components/shared";
import { useNavigate } from "react-router-dom";

const NotificationPage = () => {
  const { data: notifications, isLoading } = useGetAllNotifications();
  const { mutateAsync: Delete } = useDeleteAllNotifications();
  const { mutateAsync: DeleteOne } = useDeleteNotification();
  const navigate = useNavigate();

  const handleDeleteAll = async (e) => {
    e.preventDefault();
    await Delete();
  };

  return (
    <div className="lg:py-7 lg:px-5 min-w-full py-2 px-2">
      <div className="flex items-center justify-between w-full mb-6">
        <div className="flex items-center gap-3 cursor-default">
          <FaRegBell size={35} className="text-violet-600" />
          <h1 className="lg:text-[2rem] text-[1.2rem]">All Notifications</h1>
        </div>
        <div
          onClick={handleDeleteAll}
          className="flex items-center gap-1 cursor-pointer"
        >
          <MdOutlineDelete size={30} className="text-red-600" />
          <h1>Delete All</h1>
        </div>
      </div>
      <div className="w-full px-2 py-4 rounded-xl flex flex-col gap-3">
        {isLoading && <Loader text={"Loading..."} size={30} />}
        {notifications && notifications.length === 0 && (
          <p className="text-center text-[1.1rem] tracking-tight cursor-default">
            No Notifications
          </p>
        )}
        {notifications &&
          notifications.map((notif, i) => (
            <div
              key={i}
              className="flex items-center justify-between lg:px-5 py-2 px-1 border-[1px] border-zinc-800 rounded-xl"
            >
              <div className="w-[95%] flex items-center justify-evenly lg:justify-between">
                <img
                  onClick={() => navigate(`/profile/${notif?.from?.username}`)}
                  src={
                    notif?.from?.avatar
                      ? notif.from.avatar
                      : "/assets/profile.webp"
                  }
                  alt="profile"
                  className="w-10 lg:w-16 rounded-full object-cover cursor-pointer"
                />
                {notif?.content === "LIKE" && (
                  <p className="text-[0.8rem] tracking-tight lg:text-[1.1rem] cursor-default">
                    {notif?.from?.fullName} Liked Your Post.❤️
                  </p>
                )}
                {notif?.content === "FOLLOW" && (
                  <p className="text-[0.8rem] tracking-tight lg:text-[1.1rem] cursor-default">
                    {notif?.from?.fullName} Started Following You.👌
                  </p>
                )}
                {notif?.content === "COMMENT" && (
                  <p className="text-[0.8rem] tracking-tight lg:text-[1.1rem] cursor-default">
                    {notif?.from?.fullName} Commented on Your Post.😍
                  </p>
                )}
                {notif?.content === "LIKE" ||
                  (notif?.content === "COMMENT" && (
                    <img
                      onClick={() => navigate(`/post/${notif?.post?._id}`)}
                      src={notif?.post?.postImage}
                      alt="postImage"
                      className="rounded-xl object-contain h-14 w-14 lg:h-16 lg:w-16 cursor-pointer"
                    />
                  ))}
                {notif?.content === "FOLLOW" && (
                  <button
                    onClick={() =>
                      navigate(`/profile/${notif?.from?.username}`)
                    }
                    className="bg-violet-600 lg:px-3 lg:py-2 rounded-xl px-3 py-2"
                  >
                    Profile
                  </button>
                )}
              </div>
              <MdOutlineDelete
                onClick={(e) => {
                  e.preventDefault();
                  DeleteOne(notif._id);
                }}
                size={25}
                className="text-red-500 cursor-pointer"
              />
            </div>
          ))}
      </div>
    </div>
  );
};

export default NotificationPage;
