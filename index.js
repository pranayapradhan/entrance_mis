import http from "http";
import app from "./src/config/express.config.js";

// Server
const server = http.createServer(app)      // server application

const PORT = 5000;
const HOST = "localhost"

server.listen(PORT, HOST, (err) => {
  if(!err){
    console.log("Server is running on PORT: ", PORT)
  }
})