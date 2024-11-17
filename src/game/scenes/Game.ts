import { Scene } from "phaser";
import { EventBus } from "../EventBus";

export class Game extends Scene {
  player: Phaser.GameObjects.Rectangle;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  wasdKeys: {
    up: Phaser.Input.Keyboard.Key;
    down: Phaser.Input.Keyboard.Key;
    left: Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
  };

  constructor() {
    super("Game");
  }

  create() {
    // Crear jugador como un rectángulo
    this.player = this.add.rectangle(400, 300, 50, 50, 0x00ff00);

    // Crear teclas de movimiento
    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();

      this.wasdKeys = {
        up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
        down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
        left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
        right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      };
    }

    // Crear un texto en pantalla
    this.add.text(10, 10, "Usa WASD para mover el jugador", {
      fontFamily: "Arial",
      fontSize: "16px",
      color: "#ffffff",
    });

    EventBus.emit("current-scene-ready", this);
  }

  update() {
    if (this.player) {
      // Movimiento del jugador con flechas
      if (this.cursors?.left.isDown || this.wasdKeys?.left.isDown) {
        this.player.x -= 5;
      } else if (this.cursors?.right.isDown || this.wasdKeys?.right.isDown) {
        this.player.x += 5;
      }

      if (this.cursors?.up.isDown || this.wasdKeys?.up.isDown) {
        this.player.y -= 5;
      } else if (this.cursors?.down.isDown || this.wasdKeys?.down.isDown) {
        this.player.y += 5;
      }
    }
  }
}

