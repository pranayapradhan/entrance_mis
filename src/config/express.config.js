import express from "express"
import router from "./router.config.js";

const app = express()

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
export default app;