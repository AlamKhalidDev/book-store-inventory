import { PrismaClient } from "@prisma/client";
import { sendMail } from "./mailer";

const prisma = new PrismaClient();
const THREE_DAYS = 3 * 24 * 3600 * 1000;
export const scheduleReturnReminder = async (
  userEmail: string,
  bookId: string
) => {
  // Simulate 3 days with 10 seconds
  setTimeout(async () => {
    const stillBorrowed = await prisma.userBook.findFirst({
      where: { userEmail, bookId },
    });

    if (stillBorrowed) {
      const book = await prisma.book.findUnique({ where: { id: bookId } });
      await sendMail(
        userEmail,
        `Subject: Reminder to return "${book?.title}"`,
        "Body: You borrowed this book more than 3 days ago. Please return it ASAP."
      );

      console.log(`[EMAIL SENT] To: ${userEmail}`);
      console.log(`Subject: Reminder to return "${book?.title}"`);
      console.log(
        `Body: You borrowed this book more than 3 days ago. Please return it ASAP.`
      );
    }
  }, THREE_DAYS); // Simulate 3 days
};
//
