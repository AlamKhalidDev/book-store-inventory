import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getWalletStatus = async (_req: Request, res: Response) => {
  try {
    const wallet = await prisma.wallet.findUnique({
      where: { id: 1 },
      //   include: {
      //     movements: {
      //       orderBy: { createdAt: "desc" },
      //     },
      //   },
    });

    if (!wallet) return res.status(404).json({ error: "Wallet not found" });

    res.json({
      balance: wallet.balance.toFixed(2) ?? 0,
      //   movements: wallet.movements,
    });
  } catch (error) {
    console.error("Wallet fetch failed:", error);
    res.status(500).json({ error: "Could not retrieve wallet info" });
  }
};

export const getWalletMovements = async (req: Request, res: Response) => {
  const { type, reason } = req.query;

  try {
    const movements = await prisma.walletMovement.findMany({
      where: {
        ...(type ? { type: type.toString().toUpperCase() } : {}),
        ...(reason
          ? { reason: { contains: reason.toString(), mode: "insensitive" } }
          : {}),
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ movements });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch wallet movements" });
  }
};
