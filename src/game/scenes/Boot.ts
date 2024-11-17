import { Scene } from "phaser";

export class Boot extends Scene {
  constructor() {
    super("Boot");
  }

  preload() {
    // Aquí podemos cargar todos los recursos del juego, como imágenes y sonidos.
  }

  create() {
    this.scene.start("MainMenu");
  }
}
