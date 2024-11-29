import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Error, Loader } from "../../components/shared";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useRegisterUser } from "../../hooks/auth.hooks";

const RegisterPage = () => {
  const {
    mutateAsync: Register,
    isPending: isLoading,
    isError,
    error,
  } = useRegisterUser();
  const [showPassword, setShowPassword] = useState(false);
  const [userData, setUserData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !userData.fullName ||
      !userData.username ||
      !userData.email ||
      !userData.password
    ) {
      toast.error("Please Provide All The Required Fields");
      return;
    }
    if (userData.password.length < 6) {
      toast.error("Password Must Be At Least 6 Characters");
      return;
    }
    await Register(userData);
    setUserData({
      fullName: "",
      username: "",
      email: "",
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
        <div className="FullName flex flex-col gap-1">
          <label className="text-[0.9rem] tracking-tight ml-2">Full Name</label>
          <input
            type="text"
            className="input"
            value={userData.fullName}
            onChange={(e) =>
              setUserData({ ...userData, fullName: e.target.value })
            }
          />
        </div>
        <div className="Username flex flex-col gap-1">
          <label className="text-[0.9rem] tracking-tight ml-2">Username</label>
          <input
            type="text"
            className="input"
            value={userData.username}
            onChange={(e) =>
              setUserData({ ...userData, username: e.target.value })
            }
          />
        </div>
        <div className="Email flex flex-col gap-1">
          <label className="text-[0.9rem] tracking-tight ml-2">Email</label>
          <input
            type="email"
            className="input"
            value={userData.email}
            onChange={(e) =>
              setUserData({ ...userData, email: e.target.value })
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
          {isLoading ? <Loader text={"Regitering.."} size={25} /> : "Register"}
        </button>
      </form>
      <div className="text-center cursor-default mt-2">
        <p>
          Already Have An Account ?{" "}
          <Link
            to="/login"
            className="ml-2 text-orange-800 underline decoration-orange-800"
          >
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
