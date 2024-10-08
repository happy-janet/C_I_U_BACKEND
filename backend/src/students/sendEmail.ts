// src/utils/sendEmail.ts

import nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

export const sendEmail = async (to: string, subject: string, text: string, html: string) => {
  const configService = new ConfigService();

  const transporter = nodemailer.createTransport({
    host: configService.get<string>('SMTP_HOST'),
    port: configService.get<number>('SMTP_PORT'),
    secure: configService.get<boolean>('SMTP_SECURE'), // true for 465, false for other ports
    auth: {
      user: configService.get<string>('SMTP_USER'),
      pass: configService.get<string>('SMTP_PASS'),
    },
  });

  const mailOptions = {
    from: `"No Reply" <${configService.get<string>('SMTP_FROM')}>`,
    to,
    subject,
    text,
    html,
  };

  await transporter.sendMail(mailOptions);
};
