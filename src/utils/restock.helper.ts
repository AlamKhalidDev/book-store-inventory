import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const checkAndHandleRestock = async (bookId: string) => {
  const book = await prisma.book.findUnique({ where: { id: bookId } });
  if (!book) return;

  if (book.copies === 1) {
    console.log(`[EMAIL SENT] To: management@library.com`);
    console.log(`Subject: Restock "${book.title}"`);
    console.log(`Body: Only 1 copy left. Please restock.`);

    // Wait 1 hour (simulate with 10 sec in dev)
    setTimeout(async () => {
      const missing = book.initialStock - book.copies;
      if (missing > 0) {
        await prisma.book.update({
          where: { id: book.id },
          data: {
            copies: { increment: missing },
          },
        });

        // Log the stock action
        await prisma.bookAction.create({
          data: {
            bookId: book.id,
            type: "STOCK",
            userEmail: "admin@dummy-library.com",
          },
        });

        // Log wallet debit
        const totalCost = book.stockPrice * missing;
        await prisma.wallet.update({
          where: { id: 1 },
          data: {
            balance: { decrement: totalCost },
            movements: {
              create: {
                type: "DEBIT",
                amount: totalCost,
                reason: `Restocked "${book.title}" with ${missing} copies`,
              },
            },
          },
        });

        console.log(
          `[STOCKED] ${book.title} - Restocked ${missing} copies after 1 hour`
        );
      }
    }, 10 * 1000); // replace with 3600 * 1000 for real 1 hour
  }
};
