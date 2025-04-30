import express from "express";
import {
  getBookActions,
  getUserBooksSummary,
} from "../controllers/admin.controller";
import { isAdmin } from "../middlewares/auth";
const router = express.Router();

router.get("/actions", isAdmin, async (req, res) => {
  try {
    await getBookActions(req, res);
  } catch (error) {
    res.status(500).send({
      error:
        error instanceof Error
          ? error.message
          : "An error occurred while fetching the actions.",
    });
  }
});

router.get("/users/books", isAdmin, async (req, res) => {
  try {
    await getUserBooksSummary(req, res);
  } catch (error) {
    res.status(500).send({
      error:
        error instanceof Error
          ? error.message
          : "An error occurred while fetching the details.",
    });
  }
});

export default router;
