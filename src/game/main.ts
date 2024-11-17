import { AUTO, Game as PhaserGame } from "phaser";
import { Boot } from "./scenes/Boot";
import { MainMenu } from "./scenes/MainMenu";
import { GameScene } from "./scenes/GameScene";
import { GameOver } from "./scenes/GameOver";

const config: Phaser.Types.Core.GameConfig = {
  type: AUTO,
  scale: {
    mode: Phaser.Scale.RESIZE,
    width: "100%",
    height: "100%",
  },
  parent: "game-container",
  backgroundColor: "#000000",
  physics: {
    default: "arcade",
    arcade: {
      debug: false, // Puedes cambiar a `true` si necesitas ver las áreas de colisión durante la depuración
    },
  },
  dom: {
    createContainer: true,
  },
  scene: [Boot, MainMenu, GameScene, GameOver], // Añadimos todas las escenas en orden
};

// Iniciar el juego con la configuración definida
const StartGame = (parent: string) => {
  return new PhaserGame({ ...config, parent });
};

export default StartGame;

