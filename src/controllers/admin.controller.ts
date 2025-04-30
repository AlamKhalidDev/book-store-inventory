// import { Request, Response } from "express";
// import { PrismaClient, $Enums } from "@prisma/client";

// const prisma = new PrismaClient();

// export const getBookActions = async (req: Request, res: Response) => {
//   const { bookId, type } = req.query;

//   try {
//     const actions = await prisma.bookAction.findMany({
//       where: {
//         ...(bookId ? { bookId: String(bookId) } : {}),
//         ...(type ? { type: type as $Enums.ActionType } : {}),
//       },
//       include: {
//         book: {
//           select: { title: true },
//         },
//       },
//       orderBy: {
//         createdAt: "desc",
//       },
//     });

//     res.json(actions);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Failed to fetch actions" });
//   }
// };

import { Request, Response } from "express";
import { PrismaClient, ActionType } from "@prisma/client";

const prisma = new PrismaClient();

export const getBookActions = async (req: Request, res: Response) => {
  const { bookId, type } = req.query;

  try {
    let actionType: ActionType | undefined;

    if (type) {
      const upperType = String(type).toUpperCase();
      if (Object.values(ActionType).includes(upperType as ActionType)) {
        actionType = upperType as ActionType;
      } else {
        return res.status(400).json({
          error: "Invalid action type",
          allowedTypes: Object.values(ActionType),
        });
      }
    }

    const actions = await prisma.bookAction.findMany({
      where: {
        ...(bookId ? { bookId: String(bookId) } : {}),
        ...(actionType ? { type: actionType } : {}),
      },
      include: {
        book: {
          select: { title: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(actions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch actions" });
  }
};
