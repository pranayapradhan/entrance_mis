import multer from "multer";
import fs from "fs";
import { randomStringGenerator } from "../utilities/helper.js";


const myStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    let filePath = "./public/uploads/"

    if(!fs.existsSync(filePath)){
      fs.mkdirSync(filePath, {recursive: true})
    }

    cb(null, filePath)
  },

  filename: (req, file, cb) => {
    let filename = randomStringGenerator(15) + "-" + file.originalname;
    cb(null, filename)
  }
})

const uploader = (type = "image") => {
  const uploadConfig = {
    fileSize: 3000000,
    fileFilter: function (req, file, cb) {
      let allowedExt = ["jpg", "jpeg", "png", "gif", "svg", "bmp", "webp"];

      if (type === "doc") {
        this.fileSize = 5000000
        allowedExt = ["doc", "docx", "pdf", "xls", "csv", "json", "xlsx"];
      } else if (type === "audio") {
        this.fileSize = 7000000
        allowedExt = ["mp3", "m3u8"];
      }
      const fileExt = file.originalname.split(".").pop(); //PNG

      if (allowedExt.includes(fileExt.toLowerCase())) {
        cb(false, true);
      } else {
        cb({
          code: 422,
          message: "File Format not supported",
          status: "INVALID_FILE_FORMAT",
        });
      }
    },
  };

  return multer({
    storage: myStorage,
    fileFilter: uploadConfig.fileFilter,
    limits: {
      fileSize: uploadConfig.fileSize,
    },
  });
};

export default uploader