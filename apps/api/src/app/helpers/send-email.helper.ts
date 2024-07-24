import SendGrid = require('sendgrid');
import config from './../../../config.helper';
import _ = require('lodash');

/**
 * Helper class to send the email
 */
class SendEmail {
  protected helper: any;
  protected method: string = 'POST';
  protected path: string = '/v3/mail/send';
  protected sendGridInstance: any;

  constructor() {
    this.sendGridInstance = SendGrid(config.SENDGRID.apiKey);
    this.helper = SendGrid.mail;
  }

  /**
   * Send the mail
   */
  public async sendEmail({ toEmail, subject, textBody, attachment, attachments }: SendEmailArgs, reqDetails): Promise<any> {
    const mail = new this.helper.Mail();

    // Set default settings
    this.setDefaulMailSettings({ mail, subject });

    // Set mail to args
    this.setMailToArgs({ mail, toEmail });

    // Set Email Body
    mail.addContent(new this.helper.Content('text/html', textBody));

    if (attachment && attachment.content && attachment.type) {
      this.setAttachemnt({ attachment, mail });
    }

    _.each(attachments || [], (item) => {
      this.setAttachemnt({ attachment: item, mail });
    });

    return await this.sendRequest({ mail }, reqDetails);
  }

  /**
   * Set Attachments
   */
  private setAttachemnt({ attachment, mail }: SetAttachmentArgs) {
    const { content, type, fileName = 'default' } = attachment;
    const sendGridAttachment = new this.helper.Attachment();

    let contentBuffer;
    if (!(content instanceof Buffer)) {
      contentBuffer = new Buffer(content);
    } else {
      contentBuffer = content;
    }

    sendGridAttachment.setContent(contentBuffer.toString('base64'));
    sendGridAttachment.setType(type);
    sendGridAttachment.setFilename(fileName);
    sendGridAttachment.setDisposition('attachment');
    mail.addAttachment(sendGridAttachment);
  }

  /**
   * Set Default mail settings. subject, emailFrom
   */
  private setDefaulMailSettings({ mail, subject }: SetDefaulMailSettingsArgs) {
    const fromEmail = new this.helper.Email(config.SENDGRID.fromEmail);
    mail.setFrom(fromEmail);
    mail.setSubject(subject);
  }

  /**
   * Set Recievers mail, emailTo, cc's
   */
  private setMailToArgs({ mail, toEmail }) {
    const personalization = new this.helper.Personalization();
    // Convert all mails to Email format
    toEmail = _.map(toEmail, (email) => {
      return this.helper.Email(email);
    });
    // Email to
    const addTo = _.head(toEmail);
    personalization.addTo(addTo);

    // Email cc
    const addCCs = _.slice(toEmail, 1, toEmail.length);
    _.each(addCCs, (cc) => {
      personalization.addCc(cc);
    });

    mail.addPersonalization(personalization);
  }

  /**
   * Send the request
   */
  private async sendRequest({ mail }, reqDetails) {
    const request = this.sendGridInstance.emptyRequest({
      method: this.method,
      path: this.path,
      body: mail.toJSON(),
    } as any);
    try {
      await this.sendGridInstance.API(request);
      return { success: true };
    } catch (e) {
      // when we get an error from SendGrid it will come with an array of many similar
      // looking error messages, just pick one to tell that there is something wrong
      // for in-depth debugging should just come here
      const defaultErrMsg = 'Error message not available';
      const errorDetail = _.get(e, 'response.body.errors[0]', {
        message: defaultErrMsg,
      });
      logger.error(
        'Error Sending Mail',
        {
          // error title
          message: e.message,
          // error stack trace
          stack: e.stack,
          // error message/detail
          errorDetail,
        },
        reqDetails
      );
      return { success: false, error: errorDetail.message };
    }
  }
}

export default new SendEmail();

export interface SendEmailArgs {
  toEmail: Array<string>;
  subject: string;
  textBody: string;
  attachment?: AttachmentArgs; // to keep compatible with single attachment api, keep this contract.
  attachments?: AttachmentArgs[]; // support multiple attachments
}
export interface AttachmentArgs {
  fileName: string;
  content: string | Buffer;
  type: 'application/csv' | 'application/pdf';
}
export interface SetAttachmentArgs {
  attachment: AttachmentArgs;
  mail: any;
}
export interface SetDefaulMailSettingsArgs {
  subject: string;
  mail: any;
}