"use client";

import { useRef } from "react";
import { IRefPhaserGame, PhaserGame } from "@/game/PhaserGame";

function Game() {
  // Referencia al componente PhaserGame (exponiendo la instancia del juego)
  const phaserRef = useRef<IRefPhaserGame | null>(null);

  return (
    <div id="app">
      <PhaserGame ref={phaserRef} />
    </div>
  );
}

export default Game;
