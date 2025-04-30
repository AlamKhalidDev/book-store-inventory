import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// Example route
app.get("/", (req, res) => {
  res.send("Library Backend is running");
});

export default app;
