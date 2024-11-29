import { v2 as cloudinary } from "cloudinary";
import env from "../constants.js";

cloudinary.config({
  cloud_name: env.CLOUD_NAME,
  api_key: env.CLOUD_API_KEY,
  api_secret: env.CLOUD_API_SECRET,
});

export default async function DeleteFromCloud(id) {
  try {
    await cloudinary.api.delete_resources([id]);
    return true;
  } catch (error) {
    console.error(
      `Internal Error While Deleting The Image From Cloudinary :: ${error.message}`
    );
    return false;
  }
}
