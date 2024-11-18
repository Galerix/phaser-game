import { Scene } from "phaser";

export class GameOver extends Scene {
  constructor() {
    super({ key: "GameOver" });
  }

  create() {
    const { width, height } = this.scale;

    // Adjust scaling factor to make scene responsive
    const scaleFactor = Math.min(width / 800, height / 600);

    // Game Over text
    const gameOverText = this.add
      .text(width / 2, height / 2 - 100 * scaleFactor, "Game Over", {
        fontSize: `${64 * scaleFactor}px`,
        color: "#38bdf8", // Cyan color for accent
        fontFamily: "Arial",
        fontStyle: "bold",
        shadow: {
          offsetX: 4 * scaleFactor,
          offsetY: 4 * scaleFactor,
          color: "#000000",
          blur: 15 * scaleFactor,
          fill: true,
        },
      })
      .setOrigin(0.5);

    // Blinking animation for "Game Over"
    this.tweens.add({
      targets: gameOverText,
      alpha: { from: 0.6, to: 1 },
      ease: "Sine.easeInOut",
      duration: 1000,
      yoyo: true,
      repeat: -1,
    });

    // Instructions text to restart
    const restartText = this.add
      .text(
        width / 2,
        height / 2 + 50 * scaleFactor,
        "Click or press Enter to restart",
        {
          fontSize: `${28 * scaleFactor}px`,
          color: "#e2e8f0", // Light gray color for instructions
          fontFamily: "Arial",
          fontStyle: "bold",
          shadow: {
            offsetX: 3 * scaleFactor,
            offsetY: 3 * scaleFactor,
            color: "#000000",
            blur: 10 * scaleFactor,
            fill: true,
          },
        }
      )
      .setOrigin(0.5);

    // Blinking effect for the restart text
    this.tweens.add({
      targets: restartText,
      alpha: { from: 0.5, to: 1 },
      ease: "Sine.easeInOut",
      duration: 1000,
      yoyo: true,
      repeat: -1,
    });

    // Button to go to scoreboards
    const scoreboardsButton = this.add
      .text(width / 2, height / 2 + 150 * scaleFactor, "Go to Scoreboards", {
        fontSize: `${28 * scaleFactor}px`,
        color: "#38bdf8", // Cyan color for accent
        fontFamily: "Arial",
        fontStyle: "bold",
        backgroundColor: "#1e293b", // Dark blue-gray background for the button
        padding: { x: 15 * scaleFactor, y: 8 * scaleFactor },
        shadow: {
          offsetX: 3 * scaleFactor,
          offsetY: 3 * scaleFactor,
          color: "#000000",
          blur: 10 * scaleFactor,
          fill: true,
        },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => {
        window.location.href = "/scoreboards";
      });

    // Hover effect for the scoreboards button
    scoreboardsButton.on("pointerover", () => {
      scoreboardsButton.setStyle({ backgroundColor: "#0f172a" });
    });
    scoreboardsButton.on("pointerout", () => {
      scoreboardsButton.setStyle({ backgroundColor: "#1e293b" });
    });

    // Blinking effect for the scoreboards button
    this.tweens.add({
      targets: scoreboardsButton,
      alpha: { from: 0.7, to: 1 },
      ease: "Sine.easeInOut",
      duration: 1000,
      yoyo: true,
      repeat: -1,
    });
  }
}

