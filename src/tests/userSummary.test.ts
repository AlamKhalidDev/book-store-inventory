import request from "supertest";
import app from "../app"; // Assuming app is exported from app.ts

describe("Admin Summary API Tests", () => {
  const adminEmail = "admin@dummy-library.com";

  // Test getting the summary of books borrowed or bought
  it("should get the summary of books borrowed or bought", async () => {
    const response = await request(app)
      .get("/admin/users/books") // Admin endpoint
      .set("x-user-email", adminEmail); // Using admin email header

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();

    // Check if there's at least one user in the summary
    const users = Object.keys(response.body);
    expect(users.length).toBeGreaterThan(0);

    // Check if the summary contains transactions for each user
    const sampleUser = users[0];
    expect(Array.isArray(response.body[sampleUser])).toBe(true);
    expect(response.body[sampleUser].length).toBeGreaterThan(0);
  });

  // Test if the transaction summary contains the right data
  it("should include borrowed/bought book details in the summary", async () => {
    const response = await request(app)
      .get("/admin/users/books") // Admin endpoint for transaction summary
      .set("x-user-email", adminEmail); // Using admin email header

    const users = Object.keys(response.body);
    expect(users.length).toBeGreaterThan(0);

    const sampleUser = users[0];
    const userSummary = response.body[sampleUser];

    // Ensure that each transaction has the expected structure
    userSummary.forEach((transaction: any) => {
      expect(transaction.bookId).toBeDefined();
      expect(transaction.title).toBeDefined();
      expect(transaction.authors).toBeDefined();
      expect(Array.isArray(transaction.authors)).toBe(true);
      expect(transaction.genres).toBeDefined();
      expect(Array.isArray(transaction.genres)).toBe(true);
      expect(["BORROW", "BUY"]).toContain(transaction.type); // Ensure it's either BORROW or BUY
      expect(transaction.quantity).toBeGreaterThan(0); // Quantity should be > 0
    });
  });
});
