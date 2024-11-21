import denv from "dotenv";
denv.config();

const env = {
  MONGO_URI: String(process.env.MONGO_URI),
  DB_NAME: String(process.env.DB_NAME),
  PORT: Number(process.env.PORT),
  JWT_SECRET: String(process.env.JWT_SECRET),
  CLOUD_NAME: String(process.env.CLOUD_NAME),
  CLOUD_API_KEY: String(process.env.CLOUD_API_KEY),
  CLOUD_API_SECRET: String(process.env.CLOUD_API_SECRET),
};

export default env;
