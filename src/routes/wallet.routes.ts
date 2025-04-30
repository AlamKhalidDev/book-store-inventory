import express from "express";
import { getWalletStatus } from "../controllers/wallet.controller";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    await getWalletStatus(req, res);
  } catch (error) {
    res
      .status(500)
      .send({ error: "An error occurred while fetching the wallet staus." });
  }
});

export default router;
