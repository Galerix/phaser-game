"use server";

import { prisma } from "./prisma";

export const getScores = async () => {
  try {
    const scores = await prisma.score.findMany({
      orderBy: { score: "desc" },
      take: 10,
    });
    return scores;
  } catch (error) {
    console.error(error);

    return [];
  }
};
