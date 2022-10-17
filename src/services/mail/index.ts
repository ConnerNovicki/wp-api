import sgMail, { ClientResponse } from "@sendgrid/mail";
import winston from "winston";
import { SendGenericEmailParams } from "./types";

export default class MailService {
  private logger: winston.Logger;

  constructor({ apiKey, logger }: { apiKey: string; logger: winston.Logger }) {
    sgMail.setApiKey(apiKey);
    this.logger = logger;
  }

  async sendGenericEmail({
    to,
    from = "novcon@fuspinc.com",
    subject,
    text,
    html,
  }: SendGenericEmailParams): Promise<[ClientResponse, {}]> {
    const res = await sgMail.send({ to, from, subject, text, html });

    this.logger.info(
      `Email sent: ${JSON.stringify({ to, from, subject, text, html })}`
    );
    return res;
  }
}
