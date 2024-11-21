import React, { useState } from "react";
import { Error, Loader } from "../../components/shared";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useRegisterUser } from "../../hooks/user.hooks";

const RegisterPage = () => {
  const {
    mutateAsync: RegisterUser,
    isPending: isLoading,
    isError,
    error,
  } = useRegisterUser();
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName || !username || !email || !password) {
      toast.error("Please Provide All The Required Details");
      return;
    }
    if (password.length < 6) {
      toast.error("Password should be at least 6 characters long");
      return;
    }
    await RegisterUser({ fullName, username, email, password });
    setEmail("");
    setFullName("");
    setUsername("");
    setPassword("");
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="cursor-default flex-center flex-col border-b-[1px] border-gray-600 py-1">
        <h1 className="text-[4rem] tracking-tight font-logo">
          Soul<span className="text-violet-500">Flick</span>
        </h1>
        <p className="text-[0.9rem] text-gray-600 leading-3 font-semibold">
          To Use{" "}
          <span className="font-logo text-[1.5rem]">
            Soul<span className="text-violet-500">Flick</span>
          </span>
          , Please Provide All The Details Required
        </p>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-1">
        <div className="FullName flex flex-col items-start gap-1">
          <label className="text-[0.8rem] tracking-tight ml-2">Full Name</label>
          <input
            type="text"
            className="input"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>
        <div className="Username flex flex-col items-start gap-1">
          <label className="text-[0.8rem] tracking-tight ml-2">Username</label>
          <input
            type="text"
            className="input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="Email flex flex-col items-start gap-1">
          <label className="text-[0.8rem] tracking-tight ml-2">Email</label>
          <input
            type="email"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="Password flex flex-col items-start gap-1">
          <label className="text-[0.8rem] tracking-tight ml-2">Password</label>
          <input
            type="password"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {isError && <Error text={error.message} />}
        <button className="flex-center bg-violet-600 py-2 rounded-xl mt-1 hover:bg-violet-700">
          {isLoading ? (
            <Loader size={25} text={"Registering..."} />
          ) : (
            "Register"
          )}
        </button>
        <div className="text-center mt-2">
          <p className="text-[0.9rem] tracking-tight text-gray-600">
            Already Have An Account ?{" "}
            <Link to="/login" className="text-violet-500">
              Log In
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;
