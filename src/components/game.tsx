"use client";

import dynamic from "next/dynamic";

import { useRef } from "react";
import { IRefPhaserGame } from "@/game/PhaserGame";

const PhaserGame = dynamic(() => import("@/game/PhaserGame"), { ssr: false });

function Game() {
  // Referencia al componente PhaserGame (exponiendo la instancia del juego)
  const phaserRef = useRef<IRefPhaserGame | null>(null);

  return <PhaserGame ref={phaserRef} />;
}

export default Game;
