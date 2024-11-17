import { Scene } from "phaser";
import { EventBus } from "../EventBus";

export class GameOver extends Scene {
  constructor() {
    super("GameOver");
  }

  create() {
    const { width, height } = this.scale;

    this.add
      .text(width / 2, height / 2, "Game Over\nClick para reiniciar", {
        fontSize: "48px",
        color: "#ff0000",
        align: "center",
      })
      .setOrigin(0.5);

    this.input.on("pointerdown", () => {
      EventBus.emit("game-over");
    });
  }
}
