import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function main() {
  const filePath = path.join(__dirname, "..", "books.json");
  const rawData = fs.readFileSync(filePath, "utf-8");
  const books = JSON.parse(rawData);

  for (const book of books) {
    await prisma.book.upsert({
      where: { isbn: book.isbn },
      update: {},
      create: {
        title: book.title,
        authors: book.authors,
        genres: book.genres,
        sellPrice: book.prices.sell,
        stockPrice: book.prices.stock,
        borrowPrice: book.prices.borrow,
        year: book.year,
        pages: book.pages,
        publisher: book.publisher,
        isbn: book.isbn,
        copies: book.copies,
        initialStock: book.copies,
      },
    });
  }

  // Initialize wallet if not exists
  await prisma.wallet.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      balance: 100.0,
    },
  });

  console.log("✅ Seeded books and initialized wallet.");
}

main()
  .catch((e) => {
    console.error("❌ Error while seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
