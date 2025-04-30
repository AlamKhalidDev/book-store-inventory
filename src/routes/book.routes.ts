import express from "express";
import { getBooks, getBookById } from "../controllers/book.controller";
import { isAdmin } from "../middlewares/auth";
const router = express.Router();

// Search by title, author, or genre
router.get("/", isAdmin, async (req, res) => {
  try {
    await getBooks(req, res);
  } catch (error) {
    res
      .status(500)
      .send({ error: "An error occurred while fetching the books." });
  }
});

// Get book details by ID
router.get("/:id", isAdmin, async (req, res) => {
  try {
    await getBookById(req, res);
  } catch (error) {
    res
      .status(500)
      .send({ error: "An error occurred while fetching the book details." });
  }
});

export default router;
