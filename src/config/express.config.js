import express from "express"
import "./mongodb.config.js";
import router from "./router.config.js";
import { deleteFile } from "../utilities/helper.js";

const app = express()

// parser
app.use(express.json({
  limit: "10mb"
}))
app.use(express.urlencoded())

// router mount
app.use("/api/v1", router);

// router 404
app.use((req, res, next) => {
  next({
    code: 404,
    message: "Resource Not Found",
    status: "NOT_FOUND",
  });
});

// Error Handling Middleware
app.use((error, req, res, next) => {
  console.log("Error: ",error)
  let code = error.code || 500;
  let detail = error.detail || null;
  let message = error.message || "Internal Server Error";
  let status = error.status || "SERVER_ERR";

  if (req.file) {
    //exist
    deleteFile(req.file.path);
  } else if (req.files) {
    req.files.forEach((file) => {
      deleteFile(file.path);
    });
  }

  if(error.name === "MongoServerError"){
    if(+error.code === 11000){
        message= "Validation Failed"
        code= 400
        status= "VALIDATION_FAILED"
        detail = {};

        (Object.keys(error.keyValue)).map((key) => {
            detail[key] = `${key} should be unique.`
        })
    }
  }

  if(error.name === 'MulterError'){
    code = 422
  }
  res.status(code).json({
    error: detail,
    message: message,
    status: status,
    options: null,
  });
});

export default app;