import nodemailer from "nodemailer"
import { SMTPConfig } from "../config/config.js";

class EmailService {
  #transport;

  constructor() {
    try {
      const config = {
        host: SMTPConfig.host,
        port: SMTPConfig.port,
        auth: {
          user: SMTPConfig.user,
          pass: SMTPConfig.password
        }
      }

      if(SMTPConfig.provider === "gmail"){
        config.service = SMTPConfig.provider
      }
      this.#transport = nodemailer.createTransport(config)
      console.log("SMTP Server Connected...")
    } catch (exception) {
      throw {
        message: "SMTP Server connection failed",
        status: "SMTP_CONNECTION_ERR"
      }
    }
  }

  sendMail = async ({to, sub, msg, cc = null, bcc = null, attatchments = null}) => {
    try {
      let msgBody = {
        to: to,
        from: SMTPConfig.from,
        subject: sub,
        html: msg,
      };

      if (cc) {
        msgBody["cc"] = cc;
      }

      if (bcc) {
        msgBody["bcc"] = bcc;
      }

      if (attatchments) {
        msgBody["attatchments"] = attatchments;
      }

      let response = await this.#transport.sendMail(msgBody);
      return response;
    } catch (exception) {
      console.log(exception);
      throw {
        message: "Email sending failed",
        status: "EMAIL_SENDING_FAILED_ERR",
      };
    }
  };
}

const emailSvc = new EmailService()
export default emailSvc