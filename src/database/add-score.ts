"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "./prisma";

export const addScore = async (playerName: string, score: number) => {
  try {
    const newScore = await prisma.score.create({
      data: { playerName, score },
    });

    revalidatePath("/");

    return newScore;
  } catch (error) {
    console.error(error);
    throw new Error("Error saving score");
  }
};
