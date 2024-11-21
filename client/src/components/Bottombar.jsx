import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { GoHome } from "react-icons/go";
import { MdOutlineExplore } from "react-icons/md";
import { CiCirclePlus } from "react-icons/ci";
import { FaRegBell } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";

const Bottombar = () => {
  const { pathname } = useLocation();
  const { user } = useContext(AuthContext);
  return (
    <div className="w-full h-[4rem] border-t-[1px] border-zinc-800 sticky bottom-0 left-0 right-0 z-30 bg-black flex items-center justify-between px-3 lg:hidden py-1">
      <Link
        to="/"
        className={`${
          pathname === "/" && "bg-violet-700"
        } w-[60px] h-full rounded-xl flex-center flex-col border-[1px] border-zinc-800`}
      >
        <GoHome size={20} />
        <h1 className="text-[0.8rem]">Home</h1>
      </Link>
      <Link
        to="/explore"
        className={`${
          pathname === "/explore" && "bg-violet-700"
        } w-[60px] h-full rounded-xl flex-center flex-col border-[1px] border-zinc-800`}
      >
        <MdOutlineExplore size={20} />
        <h1 className="text-[0.8rem]">Explore</h1>
      </Link>
      <Link
        to="/create"
        className={`${
          pathname === "/create" && "bg-violet-700"
        } w-[60px] h-full rounded-xl flex-center flex-col border-[1px] border-zinc-800`}
      >
        <CiCirclePlus size={20} />
        <h1 className="text-[0.8rem]">Create</h1>
      </Link>
      <Link
        to="/notifications"
        className={`${
          pathname === "/notifications" && "bg-violet-700"
        } w-[60px] h-full rounded-xl flex-center flex-col border-[1px] border-zinc-800`}
      >
        <FaRegBell size={20} />
        <h1 className="text-[0.8rem]">Notify</h1>
      </Link>
      <Link
        to={`/profile/${user.username}`}
        className={`${
          pathname === `/profile/${user.username}` && "bg-violet-700"
        } w-[60px] h-full rounded-xl flex-center flex-col border-[1px] border-zinc-800`}
      >
        <img
          src={user?.avatar ? user.avatar : "/assets/profile.webp"}
          alt="profile"
          className="w-6 rounded-full object-cover"
        />
        <h1 className="text-[0.8rem]">Profile</h1>
      </Link>
    </div>
  );
};

export default Bottombar;
