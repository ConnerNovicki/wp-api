import { MailDataRequired } from "@sendgrid/mail";

export interface SendGenericEmailParams {
  to: MailDataRequired["to"];
  from?: MailDataRequired["from"];
  subject: MailDataRequired["subject"];
  text: NonNullable<MailDataRequired["text"]>;
  html: MailDataRequired["html"];
}
