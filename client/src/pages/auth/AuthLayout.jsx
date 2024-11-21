import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <main className="flex-center h-screen w-full p-1">
      <Outlet />
    </main>
  );
};

export default AuthLayout;
