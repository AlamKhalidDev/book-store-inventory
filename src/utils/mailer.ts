import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email", // Use Ethereal for test emails
  port: 587,
  auth: {
    user: process.env.ETHEREAL_USER,
    pass: process.env.ETHEREAL_PASS,
  },
});

export async function sendMail(to: string, subject: string, text: string) {
  const info = await transporter.sendMail({
    from: '"Dummy Library" <no-reply@library.com>',
    to,
    subject,
    text,
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}
