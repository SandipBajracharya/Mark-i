import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  async sendEmail(options: { email: string; subject: string; text: string }) {
    try {
      const message = {
        to: options.email,
        subject: options.subject,
        template: 'verification', // name of the template file without extension
        context: {
          // data to be sent to the template
          text: options.text,
        },
      };
      const emailSend = await this.mailerService.sendMail({
        ...message,
      });
      return emailSend;
    } catch (error) {
      console.log({ error });
      throw new HttpException('Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
