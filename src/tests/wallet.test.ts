import request from "supertest";
import app from "../app"; // Assuming app is exported from app.ts

describe("Wallet API Tests", () => {
  const adminEmail = "admin@dummy-library.com"; // Admin email for requests

  // Test to get wallet balance
  it("should get wallet balance", async () => {
    const response = await request(app)
      .get("/admin/wallet") // Admin endpoint for wallet balance
      .set("x-user-email", adminEmail); // Set the admin email in the header

    expect(response.status).toBe(200);
    expect(response.body.balance).toBeDefined();
    expect(typeof response.body.balance).toBe("string"); // Balance should be returned as a string
    expect(parseFloat(response.body.balance)).toBeGreaterThanOrEqual(0); // Balance should be a positive number or 0
  });

  // Test to get wallet movements
  it("should get wallet movements", async () => {
    const response = await request(app)
      .get("/admin/wallet/movements") // Admin endpoint for wallet movements
      .set("x-user-email", adminEmail); // Set the admin email in the header

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.movements)).toBe(true);
    expect(response.body.movements.length).toBeGreaterThan(0); // Ensure there are movements in the response

    // Check that each movement contains the necessary fields
    response.body.movements.forEach(
      (movement: {
        id: any;
        type: any;
        amount: any;
        reason: any;
        createdAt: string | number | Date;
        walletId: any;
      }) => {
        expect(movement.id).toBeDefined();
        expect(movement.type).toBeDefined();
        expect(movement.amount).toBeDefined();
        expect(typeof movement.amount).toBe("number"); // Amount should be a number
        expect(movement.reason).toBeDefined();
        expect(movement.createdAt).toBeDefined();
        expect(new Date(movement.createdAt).toString()).not.toBe(
          "Invalid Date"
        ); // Ensure createdAt is a valid date
        expect(movement.walletId).toBeDefined();
      }
    );

    // Test specific reason and types
    const validTypes = ["CREDIT", "DEBIT"];

    interface WalletMovement {
      id: string;
      type: "CREDIT" | "DEBIT";
      amount: number;
      reason: string;
      createdAt: string;
      walletId: string;
    }

    // Removed duplicate declaration of validReasons

    response.body.movements.forEach((movement: WalletMovement) => {
      expect(validTypes).toContain(movement.type); // Movement type should be either CREDIT or DEBIT
    });
  });
});
