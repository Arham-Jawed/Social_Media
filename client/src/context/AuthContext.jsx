import { createContext, useState } from "react";
import { useGetLoggedInUser } from "../hooks/user.hooks";
import { Loader } from "../components/shared";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const { data: user, isLoading } = useGetLoggedInUser();

  const value = {
    user,
  };
  if (isLoading) {
    return <Loader text={"Loading..."} size={40} />;
  }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
