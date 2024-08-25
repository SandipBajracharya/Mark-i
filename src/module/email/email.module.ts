import { Global, Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Global()
@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        service: 'QueueTest',
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
        // host: 'smtp.gmail.com',
        // port: 587,
        // secure: false, // true for 465, false for other ports
        // auth: {
        //   user: 'sndp07.sb@gmail.com',
        //   pass: 'fyizavwoxynpqftr', // Replace with app password
        // },
      },
      defaults: {
        from: process.env.FROM_EMAIL,
      },
      template: {
        dir: join('src/template/', 'email'),
        adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
