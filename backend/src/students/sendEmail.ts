import * as nodemailer from 'nodemailer';

export async function sendEmail(to: string, subject: string, text: string, html: string) {
    console.log('Preparing to send email to:', to); // Log recipient email

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    console.log('Transporter created:', transporter); // Log transporter creation

    const mailOptions = {
        from: process.env.SMTP_FROM,
        to,
        subject,
        text,
        html,
    };

    // Log mail options before sending
    console.log('Mail options:', mailOptions);

    // Send the email
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}
