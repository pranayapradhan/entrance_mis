import { AppConfig } from "../config/config.js"
import {v2 as cloudinary} from "cloudinary"
import { deleteFile } from "../utilities/helper.js"

class CloudinaryService{
  constructor() {
    cloudinary.config({
      cloud_name: AppConfig.cloudinaryCloudName,
      api_key: AppConfig.cloudinaryApiKey,
      api_secret: AppConfig.cloudinaryApiSecret
    })
  }

  fileUpload = async(filePath, dir ='/') => {
    try {
      const { public_id, url, secure_url } = await cloudinary.uploader.upload(filePath, {
        unique_filename: true,
        folder: "/entrance-mis"+dir,
        resource_type: "auto"
      })

      // delete File
      deleteFile(filePath)

      const optimized = cloudinary.url(public_id, {
        transformation: [
          { width: 500, crop: "fill" },
          { quality: "auto", fetch_format: "auto" },
        ],
      });

      return {
        publicId: public_id,
        secureUrl: secure_url,
        optimizedUrl: optimized,
      };
    } catch (exception) {
      console.log(exception)
      throw {
        code: 500,
        message: "File Upload error in cloudinary",
        status: "FILE_UPLOAD_ERROR"

      }
      
    }
  }
}

const cloudinarySvc = new CloudinaryService()
export default cloudinarySvc