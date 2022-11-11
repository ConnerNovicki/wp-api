import sgMail, { ClientResponse } from "@sendgrid/mail";
import winston from "winston";
import { SendGenericEmailParams } from "./types";

export default class MailService {
  private Logger: winston.Logger;

  constructor({ apiKey, Logger }: { apiKey: string; Logger: winston.Logger }) {
    sgMail.setApiKey(apiKey);
    this.Logger = Logger;
  }

  async sendGenericEmail({
    to,
    from = "novcon@fuspinc.com",
    subject,
    text,
    html,
  }: SendGenericEmailParams): Promise<[ClientResponse, {}]> {
    const res = await sgMail.send({ to, from, subject, text, html });

    this.Logger.info(
      `Email sent: ${JSON.stringify({ to, from, subject, text, html })}`
    );
    return res;
  }
}
