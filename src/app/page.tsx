"use client";

import dynamic from "next/dynamic";

const Game = dynamic(() => import("@/components/game"), { ssr: false });

export default function Home() {
  return <Game />;
}
