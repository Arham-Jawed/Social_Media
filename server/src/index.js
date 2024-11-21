import ConnectDB from "./utils/ConnectDB.js";
import app from "./app.js";
import env from "./constants.js";

const PORT = env.PORT || 5000;

ConnectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server Is Running On http://localhost:${PORT}`);
  });
});
