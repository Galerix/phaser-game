import { Scene } from "phaser";
import { EventBus } from "../EventBus";

export class GameOver extends Scene {
  constructor() {
    super("GameOver");
  }

  create() {
    const { width, height } = this.scale;

    // Dark and animated background
    const graphics = this.add.graphics();
    graphics.fillStyle(0x000000, 0.9);
    graphics.fillRect(0, 0, width, height);

    // Main "Game Over" text
    const gameOverText = this.add
      .text(width / 2, height / 3, "GAME OVER", {
        fontSize: "64px",
        color: "#ff0000",
        fontFamily: "Arial Black",
        fontStyle: "bold",
        stroke: "#000",
        strokeThickness: 8,
        shadow: {
          offsetX: 4,
          offsetY: 4,
          color: "#000000",
          blur: 10,
          fill: true,
        },
      })
      .setOrigin(0.5);

    // Blinking animation for "Game Over"
    this.tweens.add({
      targets: gameOverText,
      alpha: { from: 0.6, to: 1 },
      ease: "Sine.easeInOut",
      duration: 800,
      yoyo: true,
      repeat: -1,
    });

    // Instructions text to restart
    const restartText = this.add
      .text(width / 2, height / 2 + 100, "Click or press Enter to restart", {
        fontSize: "32px",
        color: "#ffffff",
        fontFamily: "Arial",
        fontStyle: "bold",
        shadow: {
          offsetX: 3,
          offsetY: 3,
          color: "#000000",
          blur: 5,
          fill: true,
        },
      })
      .setOrigin(0.5);

    // Blinking effect for the restart text
    this.tweens.add({
      targets: restartText,
      alpha: { from: 0.5, to: 1 },
      ease: "Sine.easeInOut",
      duration: 800,
      yoyo: true,
      repeat: -1,
    });

    // Keyboard or click event to restart
    this.input.on("pointerdown", () => {
      EventBus.emit("game-over");
    });

    this.input.keyboard?.on("keydown-ENTER", () => {
      EventBus.emit("game-over");
    });
  }
}

