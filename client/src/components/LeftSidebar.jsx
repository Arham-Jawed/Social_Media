import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { House, Compass, CirclePlus, Bell, LogOut } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { useLogoutUser } from "../hooks/auth.hooks";

const LeftSidebar = () => {
  const { pathname } = useLocation();
  const { user } = useContext(AuthContext);
  const { mutateAsync: Logout } = useLogoutUser();
  const handleLogout = async (e) => {
    e.preventDefault();
    await Logout();
  };
  return (
    <aside className="w-[17rem] border-r-[1px] border-zinc-800 h-screen sticky top-0 left-0 lg:flex flex-col items-center hidden py-6 justify-between">
      <div className="Logo flex-center w-full">
        <Link to="/" className="text-[2.5rem] tracking-tight">
          Thread<span className="text-orange-800 font-logo">Link</span>
        </Link>
      </div>
      <div className="Middle_Navbar h-[430px] w-full flex flex-col justify-evenly px-2">
        <Link
          to="/"
          className={`${
            pathname === "/" ? "bg-orange-800 border-none" : ""
          } px-2 w-full h-[50px] border-[1px] border-zinc-800 rounded-xl flex items-center gap-2 hover:bg-orange-900`}
        >
          <House size={25} />
          <h1>Home</h1>
        </Link>
        <Link
          to="/explore"
          className={`${
            pathname === "/explore" ? "bg-orange-800 border-none" : ""
          } px-2 w-full h-[50px] border-[1px] border-zinc-800 rounded-xl flex items-center gap-2 hover:bg-orange-900`}
        >
          <Compass size={25} />
          <h1>Explore</h1>
        </Link>
        <Link
          to="/create"
          className={`${
            pathname === "/create" ? "bg-orange-800 border-none" : ""
          } px-2 w-full h-[50px] border-[1px] border-zinc-800 rounded-xl flex items-center gap-2 hover:bg-orange-900`}
        >
          <CirclePlus size={25} />
          <h1>Create</h1>
        </Link>
        <Link
          to="/notifications"
          className={`${
            pathname === "/notifications" ? "bg-orange-800 border-none" : ""
          } px-2 w-full h-[50px] border-[1px] border-zinc-800 rounded-xl flex items-center gap-2 hover:bg-orange-900`}
        >
          <Bell size={25} />
          <h1>Notifications</h1>
        </Link>
        <Link
          to={`/profile/${user?.username}`}
          className={`${
            pathname === `/profile/${user?.username}`
              ? "bg-orange-800 border-none"
              : ""
          } px-2 w-full h-[50px] border-[1px] border-zinc-800 rounded-xl flex items-center gap-2 hover:bg-orange-900`}
        >
          <img
            src={user?.avatar ? user.avatar : "/profile.webp"}
            alt="profile"
            className="size-8 rounded-full object-cover"
          />
          <h1>Profile</h1>
        </Link>
      </div>
      <div className="Logout_Section h-[100px] w-full flex-center px-2">
        <button
          onClick={handleLogout}
          className="w-full border-[1px] border-zinc-800 flex items-center gap-2 px-4 py-3 rounded-xl hover:bg-red-900 hover:border-none"
        >
          <LogOut size={25} />
          <h1>Logout</h1>
        </button>
      </div>
    </aside>
  );
};

export default LeftSidebar;
