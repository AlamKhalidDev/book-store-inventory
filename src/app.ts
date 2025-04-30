import express from "express";
import dotenv from "dotenv";
import bookRoutes from "./routes/book.routes";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/books", bookRoutes);

// Example route
app.get("/", (req, res) => {
  res.send("Library Backend is running");
});

export default app;
