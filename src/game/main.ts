import { Game } from "./scenes/Game";
import { AUTO, Game as PhaserGame } from "phaser";

const config: Phaser.Types.Core.GameConfig = {
  type: AUTO,
  width: 800,
  height: 600,
  parent: "game-container",
  backgroundColor: "#000000",
  physics: {
    default: "arcade",
  },
  scene: [Game],
};

const StartGame = (parent: string) => {
  return new PhaserGame({ ...config, parent });
};

export default StartGame;

