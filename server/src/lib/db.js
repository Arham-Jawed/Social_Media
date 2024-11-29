import mongoose from "mongoose";
import env from "../constants.js";

export default async function ConnectDB() {
  try {
    const res = await mongoose.connect(`${env.MONGO_URI}/${env.DB_NAME}`);
    console.log(`DB Connected Successfully :: ${res.connection.host}`);
  } catch (error) {
    console.error(`Internal Error While Connecting To DB :: ${error.message}`);
    process.exit(1);
  }
}
