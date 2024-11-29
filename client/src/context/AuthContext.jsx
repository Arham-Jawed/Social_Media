import { createContext, useState } from "react";
import { useGetLoggedInUser } from "../hooks/auth.hooks";
import { Loader } from "../components/shared";

export const AuthContext = createContext({
  user: null,
});

const AuthContextProvider = ({ children }) => {
  const { data, isLoading } = useGetLoggedInUser();
  const [showComment, setShowComment] = useState(false);
  if (isLoading) {
    return (
      <div className="h-screen w-full flex-center">
        <Loader text={"Loading..."} size={40} />
      </div>
    );
  }
  const value = {
    user: data,
    setShowComment,
    showComment,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContextProvider;
