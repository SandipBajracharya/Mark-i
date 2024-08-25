// import { EmailService } from '@/service/email/email.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { decryptData, encryptData } from '@/utils/crypto';
import * as moment from 'moment';
import { Injectable } from '@nestjs/common';
import { AuthenticationQueryDto } from './dto/authentication-query.dto';
import { urlDecode, urlEncode } from '@/utils/urlEncodeDecode';
import { CustomError } from '@/common/custom/customError';
import { UsersService } from '../users/users.service';
// import { EmailService } from '@/module/email/email.service';
import { ProducerService } from '@/module/rabbit-mq/producer.service';
// import { EmailService } from '@/service/email/email.service';

@Injectable()
export class AuthenticationService {
  private emailTokenKey = process.env.EMAIL_VERIFY_KEY;
  private appUrl = process.env.APP_URL;

  constructor(
    // private readonly emailService: EmailService,
    private readonly userService: UsersService,
    private producerService: ProducerService,
  ) {}

  async registerVerification(user: CreateUserDto) {
    const plainToEncryptData = {
      email: user.email,
      expiry: moment().add(2, 'hours').toISOString(),
    };
    const encryptedToken = encryptData(
      JSON.stringify(plainToEncryptData),
      this.emailTokenKey,
    );
    const verifyUrl = `${this.appUrl}/authentication/verify?token=${urlEncode(encryptedToken)}`;
    const email = user.email;
    const subject = 'User verification after registration';
    const text = `This link will expire in 2 hours. ${verifyUrl}`;
    // this.emailService.sendEmail(to, subject, mailBody); // asynchronous process so will be running in backgroud
    // await this.producerService.addToEmailQueue({ to, subject, text: mailBody });
    // await this.emailService.sendEmail({ email: to, subject, text: mailBody });
    await this.producerService.addToEmailQueue({ email, subject, text });
  }

  async verifyProcess(query: AuthenticationQueryDto) {
    const decodedData = JSON.parse(
      decryptData(urlDecode(query.token), this.emailTokenKey),
    );

    if (
      decodedData &&
      decodedData?.expiry &&
      decodedData.expiry > moment().toISOString()
    ) {
      if (decodedData?.email) {
        const userInfo = await this.userService.findOneWithEmail(
          decodedData.email,
        );
        if (userInfo) {
          if (userInfo.email_verified_at)
            throw new CustomError("You've already verified your account.", 200);
          const updateData = {
            email_verified_at: new Date(),
          };
          await this.userService.update(userInfo.id, updateData);
          return 'Your account has been verified';
        }
      }
    } else {
      throw new CustomError('Expired link', 400);
    }
  }
}
