import { v2 as cloudinary } from "cloudinary";
import env from "../constants.js";

cloudinary.config({
  cloud_name: env.CLOUD_NAME,
  api_key: env.CLOUD_API_KEY,
  api_secret: env.CLOUD_API_SECRET,
});

export default async function UploadOnCloud(image) {
  try {
    const res = await cloudinary.uploader.upload(image);
    const imageObj = {
      url: res.secure_url,
      id: res.public_id,
    };
    return imageObj;
  } catch (error) {
    console.error(
      `Internal Error While Uploading The Image On Cloudinary :: ${error.message}`
    );
    return null;
  }
}
