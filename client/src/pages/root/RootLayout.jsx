import React from "react";
import { Outlet } from "react-router-dom";
import { Bottombar, LeftSidebar, RightSidebar, Topbar } from "../../components";

const RootLayout = () => {
  return (
    <main className="w-full flex flex-col lg:flex-row">
      <LeftSidebar />
      <Topbar />
      <section className="flex-1 w-full min-h-screen">
        <Outlet />
      </section>
      <RightSidebar />
      <Bottombar />
    </main>
  );
};

export default RootLayout;
