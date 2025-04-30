import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /books?search=thriller
export const getBooks = async (req: Request, res: Response) => {
  const search = req.query.search?.toString().trim().toLowerCase() || "";

  try {
    const books = await prisma.$queryRaw`
  SELECT * FROM "Book"
  WHERE 
    -- Case-insensitive title search
    LOWER(title) LIKE LOWER(${`%${search}%`})
    
    -- Case-insensitive authors array search
    OR EXISTS (
      SELECT 1 FROM unnest(authors) AS author
      WHERE LOWER(author) LIKE LOWER(${`%${search}%`})
    )
    
    -- Case-insensitive genres array search
    OR EXISTS (
      SELECT 1 FROM unnest(genres) AS genre
      WHERE LOWER(genre) LIKE LOWER(${`%${search}%`})
    )
`;

    res.json(books);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({
      error: "Search failed",
      details: error instanceof Error ? error.message : String(error),
    });
  }
};

export const getBookById = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  const { id } = req.params;

  try {
    const book = await prisma.book.findUnique({ where: { id } });

    if (!book) return res.status(404).json({ error: "Book not found" });

    res.json(book);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong." });
  }
};
