import { Request, Response } from "express";
import { PrismaClient, ActionType } from "@prisma/client";

const prisma = new PrismaClient();

export const getBookActions = async (req: Request, res: Response) => {
  const { bookId, type } = req.query;

  try {
    let actionType: ActionType | undefined;

    if (type) {
      const upperType = String(type).toUpperCase();
      if (Object.values(ActionType).includes(upperType as ActionType)) {
        actionType = upperType as ActionType;
      } else {
        return res.status(400).json({
          error: "Invalid action type",
          allowedTypes: Object.values(ActionType),
        });
      }
    }

    const actions = await prisma.bookAction.findMany({
      where: {
        ...(bookId ? { bookId: String(bookId) } : {}),
        ...(actionType ? { type: actionType } : {}),
      },
      include: {
        book: {
          select: { title: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(actions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch actions" });
  }
};

export const getUserBooksSummary = async (req: Request, res: Response) => {
  try {
    const userBooks = await prisma.userBook.findMany({
      include: {
        book: true,
      },
    });

    const grouped = userBooks.reduce((acc, record) => {
      const email = record.userEmail;
      if (!acc[email]) acc[email] = [];

      acc[email].push({
        type: record.type, // either 'BORROW' or 'BUY'
        quantity: record.quantity,
        bookId: record.book.id,
        title: record.book.title,
        authors: record.book.authors,
        genres: record.book.genres,
      });

      return acc;
    }, {} as Record<string, any[]>);

    res.json(grouped);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch user books summary" });
  }
};
