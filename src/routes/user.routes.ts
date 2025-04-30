import express from "express";
import {
  borrowBook,
  returnBook,
  buyBook,
} from "../controllers/user.controller";

const router = express.Router();

router.post("/borrow/:bookId", async (req, res) => {
  try {
    await borrowBook(req, res);
  } catch (error) {
    res
      .status(500)
      .send({ error: "An error occurred while fetching the borrowing book." });
  }
});
router.post("/return/:bookId", async (req, res) => {
  try {
    await returnBook(req, res);
  } catch (error) {
    res
      .status(500)
      .send({ error: "An error occurred while fetching the returning book." });
  }
});

router.post("/buy/:bookId", async (req, res) => {
  try {
    await buyBook(req, res);
  } catch (error) {
    res
      .status(500)
      .send({ error: "An error occurred while fetching the buying book." });
  }
});

export default router;
