import mongoose from "mongoose";
import { DBConfig } from "./config.js";

(async () => {
  try {
    await mongoose.connect(DBConfig.mongoDBUrl, {
      dbName: DBConfig.mongoDBName,
      autoCreate: true,
      autoIndex: true
    })
    console.log("MongoDB Connected Successfully")
  } catch (exception) {
    console.log("******* Error Connecting MongoDB *******", exception);
    process.exit(1);
  }
})();