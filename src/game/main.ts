import { AUTO, Game as PhaserGame } from "phaser";
import { Boot } from "./scenes/Boot";
import { MainMenu } from "./scenes/MainMenu";
import { GameScene } from "./scenes/GameScene";
import { GameOver } from "./scenes/GameOver";

const config: Phaser.Types.Core.GameConfig = {
  type: AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  parent: "game-container",
  backgroundColor: "#000000",
  physics: {
    default: "arcade",
    arcade: {
      debug: false, // You can change to `true` if you need to see collision areas during debugging
    },
  },
  dom: {
    createContainer: true,
  },

  scene: [Boot, MainMenu, GameScene, GameOver], // Add all scenes in order
};

// Start the game with the defined configuration
const StartGame = (parent: string) => {
  return new PhaserGame({ ...config, parent });
};

export default StartGame;

