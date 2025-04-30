import { Request, Response } from "express";
import { PrismaClient, ActionType } from "@prisma/client";
import { checkAndHandleRestock } from "../utils/restock.helper";
import { scheduleReturnReminder } from "../utils/reminder.helper";

const prisma = new PrismaClient();

export const borrowBook = async (req: Request, res: Response) => {
  const userEmail = req.headers["x-user-email"]?.toString();
  const { bookId } = req.params;

  if (!userEmail)
    return res.status(400).json({ error: "User email required in headers" });

  try {
    const book = await prisma.book.findUnique({ where: { id: bookId } });
    if (!book) return res.status(404).json({ error: "Book not found" });
    if (book.copies < 1)
      return res.status(400).json({ error: "No available copies" });

    // Check if already borrowed
    const existing = await prisma.userBook.findFirst({
      where: { userEmail, bookId },
    });
    if (existing)
      return res.status(400).json({ error: "You already borrowed this book" });

    // Check total borrowed
    const totalBorrowed = await prisma.userBook.count({ where: { userEmail } });
    if (totalBorrowed >= 3)
      return res.status(400).json({ error: "You can borrow a max of 3 books" });

    // Update book copies
    await prisma.book.update({
      where: { id: bookId },
      data: { copies: { decrement: 1 } },
    });

    // Log borrow
    await prisma.bookAction.create({
      data: {
        userEmail,
        bookId,
        type: ActionType.BORROW,
      },
    });

    // Log user-book
    await prisma.userBook.create({
      data: {
        userEmail,
        bookId,
        type: ActionType.BORROW,
        quantity: 1,
      },
    });

    // Wallet CREDIT
    await prisma.wallet.update({
      where: { id: 1 },
      data: {
        balance: { increment: book.borrowPrice },
        movements: {
          create: {
            type: "CREDIT",
            amount: book.borrowPrice,
            reason: `User borrowed ${book.title}`,
          },
        },
      },
    });
    await checkAndHandleRestock(bookId);
    await scheduleReturnReminder(userEmail, bookId);

    res.json({ message: "Book borrowed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong during borrowing" });
  }
};

export const returnBook = async (req: Request, res: Response) => {
  const userEmail = req.headers["x-user-email"]?.toString();
  const { bookId } = req.params;

  if (!userEmail)
    return res.status(400).json({ error: "User email required in headers" });

  try {
    const userBook = await prisma.userBook.findFirst({
      where: { userEmail, bookId },
    });

    if (!userBook)
      return res.status(404).json({ error: "You have not borrowed this book" });

    const book = await prisma.book.update({
      where: { id: bookId },
      data: { copies: { increment: 1 } },
    });

    // Remove user-book relation
    await prisma.userBook.delete({
      where: { id: userBook.id },
    });

    // Log return
    await prisma.bookAction.create({
      data: {
        userEmail,
        bookId,
        type: ActionType.RETURN,
      },
    });

    res.json({ message: "Book returned successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong during return" });
  }
};

export const buyBook = async (req: Request, res: Response) => {
  const userEmail = req.headers["x-user-email"]?.toString();
  const { bookId } = req.params;

  if (!userEmail) return res.status(400).json({ error: "User email required" });

  try {
    const book = await prisma.book.findUnique({ where: { id: bookId } });
    if (!book) return res.status(404).json({ error: "Book not found" });
    if (book.copies < 1)
      return res.status(400).json({ error: "No available copies to buy" });

    const userBooks = await prisma.userBook.findMany({
      where: { userEmail, type: ActionType.BUY },
    });

    const sameBook = userBooks.find((ub) => ub.bookId === bookId);
    const totalBought = userBooks.reduce((acc, ub) => acc + ub.quantity, 0);

    if (sameBook && sameBook.quantity >= 2)
      return res
        .status(400)
        .json({ error: "Cannot buy more than 2 copies of the same book" });

    if (totalBought >= 10)
      return res
        .status(400)
        .json({ error: "Cannot buy more than 10 books in total" });

    // Decrease book copies
    await prisma.book.update({
      where: { id: bookId },
      data: { copies: { decrement: 1 } },
    });

    // Log BUY action
    await prisma.bookAction.create({
      data: {
        userEmail,
        bookId,
        type: ActionType.BUY,
      },
    });

    // Update or insert into UserBook
    if (sameBook) {
      await prisma.userBook.update({
        where: { id: sameBook.id },
        data: {
          quantity: { increment: 1 },
        },
      });
    } else {
      await prisma.userBook.create({
        data: {
          userEmail,
          bookId,
          type: ActionType.BUY,
          quantity: 1,
        },
      });
    }

    // Wallet CREDIT
    await prisma.wallet.update({
      where: { id: 1 },
      data: {
        balance: { increment: book.sellPrice },
        movements: {
          create: {
            type: "CREDIT",
            amount: book.sellPrice,
            reason: `User bought "${book.title}"`,
          },
        },
      },
    });

    // Handle restock check
    await checkAndHandleRestock(bookId);

    res.json({ message: "Book purchased successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error while buying book" });
  }
};
