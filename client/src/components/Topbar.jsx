import { LogOut } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import { useLogoutUser } from "../hooks/auth.hooks";

const Topbar = () => {
  const { mutateAsync: Logout } = useLogoutUser();
  const handleLogout = async (e) => {
    e.preventDefault();
    await Logout();
  };
  return (
    <div className="flex items-center justify-between lg:hidden h-[3rem] border-b-[1px] border-zinc-800 sticky top-0 left-0 right-0 bg-zinc-950 px-4">
      <Link to="/" className="text-[1.7rem] tracking-tight">
        Thread<span className="text-orange-800 font-logo">Link</span>
      </Link>
      <LogOut onClick={handleLogout} size={23} />
    </div>
  );
};

export default Topbar;
