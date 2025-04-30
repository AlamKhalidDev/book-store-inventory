import { Request, Response, NextFunction } from "express";

export const isAdmin: (
  req: Request,
  res: Response,
  next: NextFunction
) => void = (req, res, next) => {
  // Middleware logic

  const email = req.header("x-user-email");

  if (!email || email !== "admin@dummy-library.com") {
    return res.status(403).json({ error: "Forbidden: Admin access required" });
  }

  next();
};
