import dotenv from "dotenv";
dotenv.config();

const AppConfig = {
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,

  frontendUrl: process.env.FRONTEND_URL
}

const SMTPConfig = {
  provider: process.env.SMTP_PROVIDER,
  host: process.env.SMTP_HOST,
  user: process.env.SMTP_USER,
  password: process.env.SMTP_PASSWORD,
  port: process.env.SMTP_PORT,
  from: process.env.SMTP_FROM
}

const DBConfig = {
  mongoDBUrl: process.env.MONGODB_URL,
  mongoDBName: process.env.MONGODB_DBNAME
}

export {
  AppConfig,
  SMTPConfig,
  DBConfig
}