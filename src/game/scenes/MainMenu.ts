import { Scene } from "phaser";

export class MainMenu extends Scene {
  constructor() {
    super("MainMenu");
  }

  create() {
    const { width, height } = this.scale;

    // Animated galaxy background
    const graphics = this.add.graphics();
    const numStars = 200;

    graphics.fillStyle(0x000000, 1);
    graphics.fillRect(0, 0, width, height);

    for (let i = 0; i < numStars; i++) {
      const x = Phaser.Math.Between(0, width);
      const y = Phaser.Math.Between(0, height);
      const radius = Phaser.Math.FloatBetween(0.5, 2);
      graphics.fillStyle(0xffffff, 1);
      graphics.fillCircle(x, y, radius);
    }

    graphics.generateTexture("mainMenuBackground", width, height);
    this.add.image(0, 0, "mainMenuBackground").setOrigin(0);

    // Main title with futuristic effect
    const title = this.add
      .text(width / 2, height / 4, "Space Shooter Game", {
        fontSize: "48px",
        color: "#00e5ff",
        fontFamily: "Arial Black",
        fontStyle: "bold",
        stroke: "#000",
        strokeThickness: 6,
        shadow: {
          offsetX: 5,
          offsetY: 5,
          color: "#000000",
          blur: 10,
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
      .text(width / 2, height / 2 - 100, "Enter your name:", {
        fontSize: "28px",
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

    // Name input
    const nameInput = this.add
      .dom(width / 2, height / 2, "input", {
        type: "text",
        name: "name",
        fontSize: "24px",
        padding: "10px",
        textAlign: "center",
        backgroundColor: "#222",
        color: "#ffffff",
        border: "2px solid #00e5ff",
        borderRadius: "10px",
      })
      .setOrigin(0.5);

    // Start text
    const startText = this.add
      .text(width / 2, height / 2 + 150, "Press Enter to start", {
        fontSize: "28px",
        color: "#00ff88",
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

