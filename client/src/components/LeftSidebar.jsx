import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { GoHome } from "react-icons/go";
import { MdOutlineExplore } from "react-icons/md";
import { CiCirclePlus } from "react-icons/ci";
import { FaRegBell } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { useLogoutUser } from "../hooks/user.hooks";
import { AuthContext } from "../context/AuthContext";

const LeftSidebar = () => {
  const { pathname } = useLocation();
  const { mutateAsync: LogoutUser } = useLogoutUser();
  const { user } = useContext(AuthContext);
  const handleLogout = async (e) => {
    e.preventDefault();
    await LogoutUser();
  };
  return (
    <nav className="hidden h-screen w-[17rem] border-r-[1px] border-zinc-800 sticky top-0 left-0 lg:flex flex-col items-center py-4 px-1 justify-between bg-black">
      <Link to="/" className="w-full flex-center text-[3.2rem] font-logo">
        Soul<span className="text-violet-600">Flick</span>
      </Link>
      <div className="w-full h-[450px] flex flex-col justify-evenly">
        <Link
          to="/"
          className={`${
            pathname === "/" && "bg-violet-700 border-none"
          } h-[60px] w-full rounded-xl border-[1px] border-zinc-800 flex gap-1 items-center hover:bg-violet-800 px-2`}
        >
          <GoHome size={30} />
          <h1 className="text-[1.1rem] mt-1">Home</h1>
        </Link>
        <Link
          to="/explore"
          className={`${
            pathname === "/explore" && "bg-violet-700 border-none"
          } h-[60px] w-full rounded-xl border-[1px] border-zinc-800 flex gap-1 items-center hover:bg-violet-800 px-2`}
        >
          <MdOutlineExplore size={30} />
          <h1 className="text-[1.1rem] mt-1">Explore</h1>
        </Link>
        <Link
          to="/create"
          className={`${
            pathname === "/create" && "bg-violet-700 border-none"
          } h-[60px] w-full rounded-xl border-[1px] border-zinc-800 flex gap-1 items-center hover:bg-violet-800 px-2`}
        >
          <CiCirclePlus size={30} />
          <h1 className="text-[1.1rem] mt-1">Create</h1>
        </Link>
        <Link
          to="/notifications"
          className={`${
            pathname === "/notifications" && "bg-violet-700 border-none"
          } h-[60px] w-full rounded-xl border-[1px] border-zinc-800 flex gap-1 items-center hover:bg-violet-800 px-2`}
        >
          <FaRegBell size={30} />
          <h1 className="text-[1.1rem] mt-1">Notifications</h1>
        </Link>
        <Link
          to={`/profile/${user.username}`}
          className={`${
            pathname === `/profile/${user.username}` &&
            "bg-violet-700 border-none"
          } h-[60px] w-full rounded-xl border-[1px] border-zinc-800 flex gap-1 items-center hover:bg-violet-800 px-2`}
        >
          <img
            src={user?.avatar ? user?.avatar : "/assets/profile.webp"}
            alt="profile"
            className="w-8 rounded-full object-cover"
          />
          <h1 className="text-[1.1rem] mt-1">Profile</h1>
        </Link>
      </div>
      <div className="w-full h-[100px] flex-center px-1">
        <button
          onClick={handleLogout}
          className="w-full bg-black flex gap-1 py-3 px-4 rounded-xl hover:bg-red-700 border-[1px] border-zinc-800"
        >
          <FiLogOut size={25} />
          <h1 className="text-[1.1rem]">Logout</h1>
        </button>
      </div>
    </nav>
  );
};

export default LeftSidebar;
