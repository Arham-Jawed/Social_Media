import { Bell, CirclePlus, Compass, Home } from "lucide-react";
import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Bottombar = () => {
  const { pathname } = useLocation();
  const { user } = useContext(AuthContext);
  return (
    <div className="flex items-center justify-evenly lg:hidden sticky bottom-0 left-0 right-0 bg-zinc-950 border-t-[1px] border-zinc-800 h-[3rem] w-full py-1">
      <Link
        to="/"
        className={`${
          pathname === "/" ? "bg-zinc-900" : "bg-zinc-950"
        } h-full w-[50px] rounded-xl flex-center`}
      >
        <Home className="text-gray-400" />
      </Link>
      <Link
        to="/explore"
        className={`${
          pathname === "/explore" ? "bg-zinc-900" : "bg-zinc-950"
        } h-full w-[50px] rounded-xl flex-center`}
      >
        <Compass className="text-gray-400" />
      </Link>
      <Link
        to="/create"
        className={`${
          pathname === "/create" ? "bg-zinc-900" : "bg-zinc-950"
        } h-full w-[50px] rounded-xl flex-center`}
      >
        <CirclePlus className="text-gray-400" />
      </Link>
      <Link
        to="/notifications"
        className={`${
          pathname === "/notifications" ? "bg-zinc-900" : "bg-zinc-950"
        } h-full w-[50px] rounded-xl flex-center`}
      >
        <Bell className="text-gray-400" />
      </Link>
      <Link
        to={`/profile/${user?.username}`}
        className={`${
          pathname === `/profile/${user?.username}`
            ? "bg-zinc-900"
            : "bg-zinc-950"
        } h-full w-[50px] rounded-xl flex-center`}
      >
        <img
          src={user?.avatar ? user.avatar : "/profile.webp"}
          alt="profile"
          className="w-8 rounded-full object-cover border-[2px] border-orange-800"
        />
      </Link>
    </div>
  );
};

export default Bottombar;
