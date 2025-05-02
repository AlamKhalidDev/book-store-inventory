import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.NODEMAILER_HOST,
  port: parseInt(process.env.NODEMAILER_PORT || "587", 10),
  // secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.NODEMAILER_USER, // generated ethereal user
    pass: process.env.NODEMAILER_PASS, // generated ethereal password
  },
} as nodemailer.TransportOptions);

export async function sendMail(to: string, subject: string, text: string) {
  const info = await transporter.sendMail({
    from: process.env.NODEMAILER_EMAIL,
    to,
    subject,
    text,
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}
