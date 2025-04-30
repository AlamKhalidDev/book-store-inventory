import { PrismaClient } from "@prisma/client";
import { sendMail } from "./mailer";

const prisma = new PrismaClient();

export const checkWalletMilestone = async () => {
  const wallet = await prisma.wallet.findUnique({ where: { id: 1 } });
  if (wallet && wallet.balance >= 2000 && !wallet.milestoneNotified) {
    console.log(`[EMAIL SENT] 🎉 To: management@dummy-library.com`);
    console.log(`Subject: 🎉 Wallet milestone reached!`);
    console.log(`Body: Wallet balance exceeded $2000 🎊`);
    await sendMail(
      "management@dummy-library.com",
      "🎉 Milestone Reached",
      "Wallet balance exceeded $2000!"
    );

    await prisma.wallet.update({
      where: { id: 1 },
      data: { milestoneNotified: true },
    });
  }
};
