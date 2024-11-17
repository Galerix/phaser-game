import { Scene } from "phaser";

export class MainMenu extends Scene {
  constructor() {
    super("MainMenu");
  }

  create() {
    const { width, height } = this.scale;

    this.add
      .text(width / 2, height / 2 - 100, "Ingrese su nombre:", {
        fontSize: "32px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    const nameInput = this.add
      .dom(width / 2, height / 2, "input", {
        type: "text",
        name: "name",
        fontSize: "32px",
        color: "#ffffff",
        backgroundColor: "#000000",
        border: "1px solid #ffffff",
        padding: "10px",
        textAlign: "center",
      })
      .setOrigin(0.5);

    const startText = this.add
      .text(width / 2, height / 2 + 100, "Pulsa Enter para comenzar", {
        fontSize: "32px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    this.input.keyboard?.on("keydown-ENTER", () => {
      const playerName = (nameInput.node as HTMLInputElement).value;
      if (playerName.trim() !== "") {
        this.scene.start("GameScene", { playerName });
      } else {
        startText.setText("Por favor, ingrese su nombre");
      }
    });
  }
}
