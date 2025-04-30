import express from "express";
import {
  getWalletStatus,
  getWalletMovements,
} from "../controllers/wallet.controller";
import { isAdmin } from "../middlewares/auth";

const router = express.Router();

router.get("/", isAdmin, async (req, res) => {
  try {
    await getWalletStatus(req, res);
  } catch (error) {
    res
      .status(500)
      .send({ error: "An error occurred while fetching the wallet staus." });
  }
});
router.get("/movements", isAdmin, async (req, res) => {
  try {
    await getWalletMovements(req, res);
  } catch (error) {
    res
      .status(500)
      .send({ error: "An error occurred while fetching the wallet staus." });
  }
});

export default router;
