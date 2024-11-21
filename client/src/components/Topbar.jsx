import React from "react";
import { Link } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import { useLogoutUser } from "../hooks/user.hooks";

const Topbar = () => {
  const { mutateAsync: LogoutUser } = useLogoutUser();
  const handleLogout = async (e) => {
    e.preventDefault();
    await LogoutUser();
  };
  return (
    <nav className="w-full h-[4rem] border-b-[1px] border-zinc-800 sticky top-0 left-0 right-0 z-30 bg-black flex items-center justify-between px-3 lg:hidden">
      <Link to="/" className="text-[2.8rem] font-logo">
        Soul<span className="text-violet-600">Flick</span>
      </Link>
      <FiLogOut onClick={handleLogout} size={30} />
    </nav>
  );
};

export default Topbar;
