import React, { useContext, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Loader } from "../../components/shared";
import { toast } from "react-hot-toast";
import { useUpdateUser } from "../../hooks/auth.hooks";
import { useNavigate } from "react-router-dom";

const UpdateProfilePage = () => {
  const { mutateAsync: UpdateUser, isPending: isLoading } = useUpdateUser();
  const [image, setImage] = useState(null);
  const [bio, setBio] = useState("");
  const imageRef = useRef(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleImage = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImage(reader.result);
    };
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!bio && !image) {
      toast.error("Please Provide Image Or Bio For Update");
      return;
    }
    if (bio === user?.bio) {
      toast.error("The Provided Bio Is Already In Your Profile");
      return;
    }
    const userData = {
      bio,
      avatar: image,
    };
    const res = await UpdateUser(userData);
    if (!res) {
      toast.error("Failed To Update Profile");
      return;
    } else {
      toast.success(res);
      navigate(`/profile/${user?.username}`);
    }
  };
  return (
    <div className="w-full min-h-screen p-2 lg:px-32 lg:py-8">
      <h1 className="text-[1.2rem] tracking-tight">Update Your Profile</h1>
      <form onSubmit={handleUpdate} className="flex w-full flex-col gap-4 mt-4">
        <div className="w-full h-[100px] flex-center flex-col">
          <img
            onClick={(e) => {
              e.preventDefault();
              imageRef.current.click();
            }}
            src={image || (user?.avatar ? user?.avatar : "/profile.webp")}
            alt="profile"
            className="size-20 rounded-full object-cover"
          />
          <input
            type="file"
            accept="image/*"
            hidden
            ref={imageRef}
            onChange={handleImage}
          />
          <p className="text-[0.7rem] tracking-tight text-gray-500">
            Click On Your Profile To Choose The Image
          </p>
        </div>
        <div className="w-full">
          <input
            type="text"
            placeholder={user?.bio ? user.bio : ""}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="input"
          />
        </div>
        <button
          disabled={isLoading}
          className="bg-orange-800 py-2 rounded-xl flex-center"
        >
          {isLoading ? <Loader text={"Updating.."} size={25} /> : "Update"}
        </button>
      </form>
    </div>
  );
};

export default UpdateProfilePage;
