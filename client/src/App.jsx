import { Routes, Route, Navigate } from "react-router-dom";
import { AuthLayout, RegisterPage, LoginPage } from "./pages/Auth";
import { useGetLoggedInUser } from "./hooks/auth.hooks";
import {
  CreatePage,
  ExplorePage,
  FollowersPage,
  FollowingPage,
  HomePage,
  NotificationsPage,
  PostPage,
  ProfilePage,
  RootLayout,
  UpdateProfilePage,
} from "./pages/Root";
import { Loader } from "./components/shared";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

const App = () => {
  const { data, isLoading } = useGetLoggedInUser();
  if (isLoading) {
    return (
      <div className="h-screen w-full flex-center">
        <Loader text={"Loading...."} size={40} />
      </div>
    );
  }
  return (
    <>
      <Routes>
        <Route element={data ? <Navigate to="/" /> : <AuthLayout />}>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Route>
        <Route element={data ? <RootLayout /> : <Navigate to="/login" />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/create" element={<CreatePage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/profile/:username" element={<ProfilePage />} />
          <Route path="/update-profile" element={<UpdateProfilePage />} />
          <Route path="/post/:id" element={<PostPage />} />
          <Route path="/followers/:username" element={<FollowersPage />} />
          <Route path="/following/:username" element={<FollowingPage />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
