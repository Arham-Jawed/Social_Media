import { Routes, Route, Navigate } from "react-router-dom";
import { AuthLayout, RegisterPage, LoginPage } from "./pages/auth";
import {
  CreatePage,
  EditProfile,
  ExplorePage,
  FollowersPage,
  FollowingPage,
  HomePage,
  NotificationPage,
  PostPage,
  ProfilePage,
  RootLayout,
} from "./pages/root";
import { useGetLoggedInUser } from "./hooks/user.hooks";
import { Loader } from "./components/shared";

const App = () => {
  const { data: user, isLoading } = useGetLoggedInUser();

  if (isLoading) {
    <Loader size={40} text={"Loading..."} />;
  }

  return (
    <>
      <Routes>
        <Route element={user ? <Navigate to="/" /> : <AuthLayout />}>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Route>
        <Route element={user ? <RootLayout /> : <Navigate to="/login" />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/create" element={<CreatePage />} />
          <Route path="/notifications" element={<NotificationPage />} />
          <Route path="/profile/:username" element={<ProfilePage />} />
          <Route path="/post/:id" element={<PostPage />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/followers/:username" element={<FollowersPage />} />
          <Route path="/following/:username" element={<FollowingPage />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
