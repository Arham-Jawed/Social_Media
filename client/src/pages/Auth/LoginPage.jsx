import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Error, Loader } from "../../components/shared";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useLoginUser } from "../../hooks/auth.hooks";

const LoginPage = () => {
  const {
    mutateAsync: Login,
    isPending: isLoading,
    isError,
    error,
  } = useLoginUser();
  const [showPassword, setShowPassword] = useState(false);
  const [userData, setUserData] = useState({
    identifier: "",
    password: "",
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userData.identifier || !userData.password) {
      toast.error("Please Provide All The Required Fields");
      return;
    }
    if (userData.password.length < 6) {
      toast.error("Password Must Be At Least 6 Characters");
      return;
    }
    await Login(userData);
    setUserData({
      identifier: "",
      password: "",
    });
  };
  return (
    <div className="flex-center flex-col h-screen gap-2">
      <div className="Heading flex-center flex-col gap-4 cursor-default">
        <h1 className="text-[3rem] tracking-tight leading-4">
          Thread<span className="font-logo text-orange-800">Link</span>
        </h1>
        <p className="text-gray-500 tracking-tight text-[0.9rem] lg:text-[1rem]">
          To Use Thread<span className="font-logo text-orange-800">Link</span>,
          Please Provide All The Required Details.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col w-full mt-2 gap-3">
        <div className="Identifier flex flex-col gap-1">
          <label className="text-[0.9rem] tracking-tight ml-2">
            Username Or Email
          </label>
          <input
            type="text"
            className="input"
            value={userData.identifier}
            onChange={(e) =>
              setUserData({ ...userData, identifier: e.target.value })
            }
          />
        </div>
        <div className="Password flex flex-col gap-1">
          <label className="text-[0.9rem] tracking-tight ml-2">Password</label>
          <div className="flex items-center w-full gap-1 input">
            <input
              type={showPassword ? "text" : "password"}
              value={userData.password}
              className="bg-transparent w-full outline-none"
              onChange={(e) =>
                setUserData({ ...userData, password: e.target.value })
              }
            />
            {showPassword ? (
              <EyeOff
                className="cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              />
            ) : (
              <Eye
                className="cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              />
            )}
          </div>
        </div>
        {isError && <Error error={error.message} />}
        <button
          type="submit"
          disabled={isLoading}
          className="bg-orange-700 flex-center py-3 rounded-xl mt-2 hover:bg-orange-800"
        >
          {isLoading ? <Loader text={"Logging In.."} size={25} /> : "Log In"}
        </button>
      </form>
      <div className="text-center cursor-default mt-2">
        <p>
          Don't Have An Account ?{" "}
          <Link
            to="/register"
            className="ml-2 text-orange-800 underline decoration-orange-800"
          >
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
