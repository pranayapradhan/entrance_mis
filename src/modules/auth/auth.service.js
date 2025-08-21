import cloudinarySvc from "../../services/cloudinary.service.js";
import bcrypt from "bcryptjs";
import { Status } from "../../config/constants.js";
import { randomStringGenerator } from "../../utilities/helper.js";
import { AppConfig } from "../../config/config.js";
import emailSvc from "../../services/email.services.js";

class AuthService {
  async transformUserCreate(req) {
    try {
      const data = req.body;

      if(req.file){
        data.image = await cloudinarySvc.fileUpload(req.file.path, '/user/')
      }
      data.password = bcrypt.hashSync(data.password, 12)
      data.status = Status.INACTIVE;
      data.activationToken = randomStringGenerator(100)

      const {confirmPassword, ...mappedData} = data; // seperating the confirmPassword and sperading the other data into mappedData variable

      return mappedData;
    } catch (exception) {
      throw exception
    }
  }

  async sendActivationNotification (user) {
    try {
      const emailTemplate = `
        <div style="background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%); padding: 32px; border-radius: 16px; color: #fff; font-family: 'Segoe UI', Arial, sans-serif;">
          <div style="text-align: center;">
        <h1 style="margin-bottom: 8px; font-size: 2.2em; color: #fff;">Welcome, ${user.name}!</h1>
        <p style="font-size: 1.1em; color: #ffe082;">We're excited to have you join the <span style="color: #ff6f61;">Entrance MCQ System</span> community.</p>
          </div>
          <div style="margin: 24px 0; background: #fff; color: #333; border-radius: 8px; padding: 24px;">
        <h2 style="color: #2575fc;">Activate Your Account</h2>
        <p style="margin-bottom: 16px;">To get started, please activate your account by clicking the button below:</p>
        <a href="${AppConfig.frontendUrl}/activate/${user.activationToken}" style="display: inline-block; padding: 12px 32px; background: linear-gradient(90deg, #ff6f61 0%, #ffe082 100%); color: #fff; font-weight: bold; border-radius: 6px; text-decoration: none; font-size: 1.1em; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">Activate Account</a>
        <p style="margin-top: 20px; font-size: 0.95em;">If the button doesn't work, copy and paste this link into your browser:</p>
        <div style="background: #f3f3f3; color: #2575fc; padding: 8px 12px; border-radius: 4px; font-size: 0.95em; word-break: break-all;">
          ${AppConfig.frontendUrl}/activate/${user.activationToken}
        </div>
          </div>
          <div style="margin-top: 24px; text-align: center; font-size: 0.95em;">
        <p style="color: #ffe082;">Thank you for choosing <span style="color: #ff6f61;">Entrance MCQ System</span>.<br>
        <span style="color: #fff;">If you have any questions, feel free to contact our support team.</span></p>
        <p style="color: #bdbdbd;">Please do not reply to this email directly.</p>
        <p style="color: #bdbdbd;">Best Regards,<br><span style="color: #ffffffff;">System Administrator</span></p>
          </div>
        </div>
      `;
      
      await emailSvc.sendMail({
        to: user.email,
        sub: "Welcome to Entrance MCQ System! Activate Your Account 🎉",
        msg: emailTemplate
      })
    } catch (exception) {
      throw exception
    }
  }
}

const authSvc = new AuthService()
export default authSvc