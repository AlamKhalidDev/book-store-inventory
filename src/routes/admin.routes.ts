import express from "express";
import { getBookActions } from "../controllers/admin.controller";

const router = express.Router();

router.get("/actions", async (req, res) => {
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

export default router;
