import React, { useRef, useState } from "react";
import { CirclePlus, Image } from "lucide-react";
import { Error, Loader } from "../../components/shared";
import { useCreatePost } from "../../hooks/post.hooks";
import { toast } from "react-hot-toast";

const CreatePage = () => {
  const {
    mutateAsync: Create,
    isPending: isLoading,
    isError,
    error,
  } = useCreatePost();
  const [userData, setUserData] = useState({
    caption: "",
    postImage: "",
    location: "",
  });
  const [image, setImage] = useState(null);
  const imageRef = useRef(null);
  const handleImage = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImage(reader.result);
      setUserData({ ...userData, postImage: reader.result });
    };
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userData.caption || !userData.postImage) {
      toast.error("Please Provide A Caption And Post Image");
      return;
    }
    await Create(userData);
    setUserData({ caption: "", postImage: "", location: "" });
    setImage(null);
  };
  return (
    <div className="w-full min-h-screen px-2 lg:px-8 py-3 lg:py-8">
      <div className="Heading flex items-center gap-1">
        <CirclePlus size={30} className="text-orange-800" />
        <h1 className="text-[1.3rem] lg:text-[1.5rem]">Create Post</h1>
      </div>
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 mt-5">
        <div className="Caption flex flex-col gap-1">
          <label className="text-[0.9rem] tracking-tight ml-2">Caption</label>
          <input
            type="text"
            className="input"
            value={userData.caption}
            onChange={(e) =>
              setUserData({ ...userData, caption: e.target.value })
            }
          />
        </div>
        <div className="Image flex flex-col gap-1">
          <label className="text-[0.9rem] tracking-tight ml-2">Add Photo</label>
          {image ? (
            <div className="h-[400px] w-full border-[1px] border-orange-800 rounded-xl flex-center flex-col p-2">
              <img
                src={image}
                alt="postImage"
                className="h-full w-full object-contain"
              />
            </div>
          ) : (
            <div className="h-[400px] w-full border-[1px] border-orange-800 rounded-xl flex-center flex-col gap-2">
              <Image size={80} className="text-orange-800" />
              <button
                onClick={(e) => {
                  e.preventDefault();
                  imageRef.current.click();
                }}
                className="bg-orange-800 py-2 px-5 rounded-xl"
              >
                Browse Your Device
              </button>
              <input
                type="file"
                accept="image/*"
                hidden
                ref={imageRef}
                onChange={handleImage}
              />
            </div>
          )}
        </div>
        <div className="Location flex flex-col gap-1">
          <label className="text-[0.9rem] tracking-tight ml-2">Location</label>
          <input
            type="text"
            className="input"
            value={userData.location}
            onChange={(e) =>
              setUserData({ ...userData, location: e.target.value })
            }
          />
        </div>
        {isError && <Error error={error.message} />}
        <button
          type="submit"
          disabled={isLoading}
          className="bg-orange-700 flex-center py-3 rounded-xl mt-2 hover:bg-orange-800"
        >
          {isLoading ? <Loader text={"Creatig.."} size={25} /> : "Create"}
        </button>
      </form>
    </div>
  );
};

export default CreatePage;
