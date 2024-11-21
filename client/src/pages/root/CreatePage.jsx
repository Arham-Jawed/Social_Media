import React, { useRef, useState } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { MdOutlineAddPhotoAlternate } from "react-icons/md";
import { Error, Loader } from "../../components/shared";
import { useCreatePost } from "../../hooks/post.hooks";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CreatePage = () => {
  const navigate = useNavigate();
  const {
    mutateAsync: CreatePost,
    isPending: isLoading,
    isError,
    error,
  } = useCreatePost();
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState("");
  const [location, setLocation] = useState("");
  const imageRef = useRef(null);

  const handleImage = (e) => {
    e.preventDefault();
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImage(reader.result);
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!caption || !image) {
      toast.error("Please fill caption and image");
      return;
    }
    const res = await CreatePost({ caption, postImage: image, location });
    if (res) {
      toast.success("Post Created Successfully");
      navigate("/");
    }
  };
  return (
    <div className="p-6 w-full">
      <div className="flex gap-2 items-center cursor-default">
        <CiCirclePlus size={40} className="text-violet-600" />
        <h1 className="text-[1.5rem] tracking-tight">Create Post</h1>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full mt-4">
        <div className="Caption flex flex-col gap-1 items-start">
          <label className="text-[0.9rem] tracking-tight ml-2">Caption</label>
          <input
            type="text"
            className="input"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
        </div>
        <div className="Image flex flex-col gap-1 items-start">
          <label className="text-[0.9rem] tracking-tight ml-2">Add Photo</label>
          {image ? (
            <div className="h-[450px] w-full border-[1px] border-violet-800 rounded-xl flex-center flex-col gap-2 overflow-hidden">
              <img
                src={image}
                alt="postImage"
                className="h-full w-full object-contain"
              />
            </div>
          ) : (
            <div className="h-[450px] w-full border-[1px] border-violet-800 rounded-xl flex-center flex-col gap-2">
              <MdOutlineAddPhotoAlternate
                size={100}
                className="text-gray-400"
              />
              <button
                onClick={(e) => {
                  e.preventDefault();
                  imageRef.current.click();
                }}
                className="bg-violet-700 py-2 px-4 rounded-xl hover:bg-violet-800 outline-none"
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
        <div className="Location flex flex-col gap-1 items-start">
          <label className="text-[0.9rem] tracking-tight ml-2">Location</label>
          <input
            type="text"
            className="input"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        {isError && <Error text={error.message} />}
        <button className="flex-center bg-violet-600 py-2 rounded-xl mt-1 hover:bg-violet-700">
          {isLoading ? (
            <Loader size={25} text={"Creating Post..."} />
          ) : (
            "Create Post"
          )}
        </button>
      </form>
    </div>
  );
};

export default CreatePage;
