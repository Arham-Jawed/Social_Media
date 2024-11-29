import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="flex-center">
      <Outlet />
    </div>
  );
};

export default AuthLayout;
