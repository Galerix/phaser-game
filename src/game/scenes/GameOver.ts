import Phaser from "phaser";

export class GameOver extends Phaser.Scene {
  constructor() {
    super({ key: "GameOver" });
  }

  create() {
    const { width, height } = this.scale;

    // Game Over text
    const gameOverText = this.add
      .text(width / 2, height / 2 - 100, "Game Over", {
        fontSize: "64px",
        color: "#38bdf8", // Cyan color for accent
        fontFamily: "Arial",
        fontStyle: "bold",
        shadow: {
          offsetX: 4,
          offsetY: 4,
          color: "#000000",
          blur: 15,
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
      .text(width / 2, height / 2 + 50, "Click or press Enter to restart", {
        fontSize: "28px",
        color: "#e2e8f0", // Light gray color for instructions
        fontFamily: "Arial",
        fontStyle: "bold",
        shadow: {
          offsetX: 3,
          offsetY: 3,
          color: "#000000",
          blur: 10,
          fill: true,
        },
      })
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
      .text(width / 2, height / 2 + 150, "Go to Scoreboards", {
        fontSize: "28px",
        color: "#38bdf8", // Cyan color for accent
        fontFamily: "Arial",
        fontStyle: "bold",
        backgroundColor: "#1e293b", // Dark blue-gray background for the button
        padding: { x: 15, y: 8 },
        shadow: {
          offsetX: 3,
          offsetY: 3,
          color: "#000000",
          blur: 10,
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

