import { useContext, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useUpdateUser } from "../../hooks/user.hooks";
import { Error, Loader } from "../../components/shared";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const {
    mutateAsync: Update,
    isPending: isLoading,
    isError,
    error,
  } = useUpdateUser();
  const [avatar, setAvatar] = useState("/assets/profile.webp");
  const imageRef = useRef(null);
  const [bio, setBio] = useState("");

  const handleImage = (e) => {
    e.preventDefault();
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setAvatar(reader.result);
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!bio && !avatar) {
      toast.error("Please provide Bio or Avatar");
      return;
    }
    const res = await Update({ bio, avatar });
    if (!res) {
      toast.error("Failed to update profile");
      return;
    }
    navigate(`/profile/${user?.username}`);
  };
  return (
    <div className="w-full p-2 lg:py-7 lg:px-24">
      <h1 className="text-[1.5rem] tracking-tight">Edit Profile</h1>
      <form
        onSubmit={handleSubmit}
        className="w-full flex flex-col items-center mt-5"
      >
        <div className="w-[100px] rounded-full h-[100px] overflow-hidden border-[2px] border-gray-400">
          <img
            onClick={(e) => {
              e.preventDefault();
              imageRef.current.click();
            }}
            src={user?.avatar ? user.avatar : avatar}
            alt="profile"
            className="h-full w-full object-cover object-top"
          />
          <input
            type="file"
            accept="image/*"
            ref={imageRef}
            onChange={handleImage}
          />
        </div>
        <div className="flex flex-col items-start w-full mt-2">
          <label className="text-[0.9rem] tracking-tight">Add Bio :-</label>
          <input
            type="text"
            className="input"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>
        {isError && <Error text={error.message} />}
        <button
          type="submit"
          className=" mt-4 bg-violet-600 hover:bg-violet-700 px-5 py-2 rounded-xl"
        >
          {isLoading ? (
            <Loader text={"Updating..."} size={25} />
          ) : (
            "Update Profile"
          )}
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
