import express from "express";
import dotenv from "dotenv";
import bookRoutes from "./routes/book.routes";
import adminRoutes from "./routes/admin.routes";
import walletRoutes from "./routes/wallet.routes";
import userRoutes from "./routes/user.routes";
dotenv.config();

const app = express();
app.use(express.json());

app.use("/books", bookRoutes);

app.use("/admin", adminRoutes);

app.use("/wallet", walletRoutes);

app.use("/user", userRoutes);

// Example route
app.get("/", (req, res) => {
  res.send("Library Backend is running");
});

export default app;
