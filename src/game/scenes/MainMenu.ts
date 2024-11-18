import { Scene } from "phaser";

export class MainMenu extends Scene {
  constructor() {
    super("MainMenu");
  }

  create() {
    const { width, height } = this.scale;

    // Adjust scaling factor to make scene responsive
    const scaleFactor = Math.min(width / 800, height / 600);

    // Animated galaxy background
    const graphics = this.add.graphics();
    const numStars = 200;

    graphics.fillStyle(0x000000, 1);
    graphics.fillRect(0, 0, width, height);

    for (let i = 0; i < numStars; i++) {
      const x = Phaser.Math.Between(0, width);
      const y = Phaser.Math.Between(0, height);
      const radius = Phaser.Math.FloatBetween(
        0.5 * scaleFactor,
        2 * scaleFactor
      );
      graphics.fillStyle(0xffffff, 1);
      graphics.fillCircle(x, y, radius);
    }

    graphics.generateTexture("mainMenuBackground", width, height);
    this.add.image(0, 0, "mainMenuBackground").setOrigin(0);

    // Main title with futuristic effect
    const title = this.add
      .text(width / 2, height / 4, "Space Shooter Game", {
        fontSize: `${48 * scaleFactor}px`,
        color: "#00e5ff",
        fontFamily: "Arial Black",
        fontStyle: "bold",
        stroke: "#000",
        strokeThickness: 6 * scaleFactor,
        shadow: {
          offsetX: 5 * scaleFactor,
          offsetY: 5 * scaleFactor,
          color: "#000000",
          blur: 10 * scaleFactor,
          fill: true,
        },
      })
      .setOrigin(0.5);

    // Title animation
    this.tweens.add({
      targets: title,
      scale: { from: 1, to: 1.05 },
      ease: "Sine.easeInOut",
      duration: 1000,
      yoyo: true,
      repeat: -1,
    });

    // Enter your name
    this.add
      .text(width / 2, height / 2 - 100 * scaleFactor, "Enter your name:", {
        fontSize: `${28 * scaleFactor}px`,
        color: "#ffffff",
        fontFamily: "Arial",
        fontStyle: "bold",
        shadow: {
          offsetX: 3 * scaleFactor,
          offsetY: 3 * scaleFactor,
          color: "#000000",
          blur: 5 * scaleFactor,
          fill: true,
        },
      })
      .setOrigin(0.5);

    // Name input
    const nameInput = this.add
      .dom(width / 2, height / 2, "input", {
        type: "text",
        name: "name",
        fontSize: `${24 * scaleFactor}px`,
        padding: `${10 * scaleFactor}px`,
        textAlign: "center",
        backgroundColor: "#222",
        color: "#ffffff",
        border: "2px solid #00e5ff",
        borderRadius: `${10 * scaleFactor}px`,
      })
      .setOrigin(0.5);

    // Start text
    const startText = this.add
      .text(width / 2, height / 2 + 150 * scaleFactor, "Press Enter to start", {
        fontSize: `${28 * scaleFactor}px`,
        color: "#00ff88",
        fontFamily: "Arial",
        fontStyle: "bold",
        shadow: {
          offsetX: 3 * scaleFactor,
          offsetY: 3 * scaleFactor,
          color: "#000000",
          blur: 5 * scaleFactor,
          fill: true,
        },
      })
      .setOrigin(0.5);

    // Blinking effect for start text
    this.tweens.add({
      targets: startText,
      alpha: { from: 0.5, to: 1 },
      ease: "Sine.easeInOut",
      duration: 800,
      yoyo: true,
      repeat: -1,
    });

    // Keyboard event to start the game
    this.input.keyboard?.on("keydown-ENTER", () => {
      const playerName = (nameInput.node as HTMLInputElement).value;
      if (playerName.trim() !== "") {
        this.scene.start("GameScene", { playerName });
      } else {
        startText.setText("Please enter your name").setColor("#ff4444");
      }
    });
  }
}

