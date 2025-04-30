import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

      console.log(`[EMAIL SENT] To: ${userEmail}`);
      console.log(`Subject: Reminder to return "${book?.title}"`);
      console.log(
        `Body: You borrowed this book more than 3 days ago. Please return it ASAP.`
      );
    }
  }, 10 * 1000); // Simulate 3 days
};
