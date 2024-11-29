import { Outlet } from "react-router-dom";
import { LeftSidebar, Topbar, Bottombar, RightSidebar } from "../../components";

const RootLayout = () => {
  return (
    <div className="flex flex-col lg:flex-row">
      <LeftSidebar />
      <Topbar />
      <section className="flex-1 min-h-screen">
        <Outlet />
      </section>
      <RightSidebar />
      <Bottombar />
    </div>
  );
};

export default RootLayout;
