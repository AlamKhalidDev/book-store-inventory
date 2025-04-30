import { v4 as uuidv4 } from "uuid";
import request from "supertest";
import app from "../app";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("Borrow and Return API Tests", () => {
  const userEmail = "user@example.com";
  let inStockBookId: string;
  let outOfStockBookId: string;

  beforeAll(async () => {
    // Clean up BookActions first due to foreign key constraint
    await prisma.bookAction.deleteMany({
      where: {
        book: {
          title: {
            startsWith: "Test",
          },
        },
      },
    });

    // Delete test books
    await prisma.book.deleteMany({
      where: {
        title: {
          startsWith: "Test",
        },
      },
    });

    // Create an in-stock book
    const inStockBook = await prisma.book.create({
      data: {
        title: "Test In-Stock Book",
        authors: ["Tester"],
        genres: ["Test"],
        sellPrice: 20,
        stockPrice: 15,
        borrowPrice: 5,
        year: 2022,
        pages: 123,
        publisher: "Test Pub",
        isbn: uuidv4(),
        copies: 3,
        initialStock: 3,
      },
    });

    // Create an out-of-stock book
    const outStockBook = await prisma.book.create({
      data: {
        title: "Test Out-Of-Stock Book",
        authors: ["Tester"],
        genres: ["Test"],
        sellPrice: 20,
        stockPrice: 15,
        borrowPrice: 5,
        year: 2022,
        pages: 123,
        publisher: "Test Pub",
        isbn: uuidv4(),
        copies: 0,
        initialStock: 0,
      },
    });

    inStockBookId = inStockBook.id;
    outOfStockBookId = outStockBook.id;
  });

  it("should allow a user to borrow a book", async () => {
    const res = await request(app)
      .post(`/users/borrow/${inStockBookId}`)
      .set("x-user-email", userEmail);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Book borrowed successfully");
  });

  it("should allow a user to return a book", async () => {
    const res = await request(app)
      .post(`/users/return/${inStockBookId}`)
      .set("x-user-email", userEmail);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Book returned successfully");
  });

  it("should fail to borrow a book if it is out of stock", async () => {
    const res = await request(app)
      .post(`/users/borrow/${outOfStockBookId}`)
      .set("x-user-email", userEmail);

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("No available copies");
  });

  afterAll(async () => {
    // Clean up BookActions first
    await prisma.bookAction.deleteMany({
      where: {
        book: {
          title: {
            startsWith: "Test",
          },
        },
      },
    });

    // Clean up books and users
    await prisma.book.deleteMany({
      where: {
        title: {
          startsWith: "Test",
        },
      },
    });

    await prisma.$disconnect();
  });
});
