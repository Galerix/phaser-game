import { Scene } from "phaser";
import { GameScene } from "../scenes/GameScene";
import { addScore } from "@/database/add-score";

export class Player extends Phaser.GameObjects.Rectangle {
  wasdKeys: {
    up: Phaser.Input.Keyboard.Key;
    down: Phaser.Input.Keyboard.Key;
    left: Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
  };
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  bullets: Phaser.Physics.Arcade.Group;
  health: number;
  damageCooldown: boolean;
  playerName: string;

  constructor(scene: Scene, x: number, y: number, playerName: string) {
    super(scene, x, y, 50, 50, 0x00ff00);
    this.health = 3;
    this.damageCooldown = false;
    this.playerName = playerName;

    // Añadir el jugador a la escena y añadir física
    scene.add.existing(this);
    scene.physics.add.existing(this);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setCollideWorldBounds(true);
    body.setSize(50, 50);

    // Grupo de balas del jugador
    this.bullets = this.scene.physics.add.group({
      classType: Phaser.GameObjects.Rectangle,
      runChildUpdate: true,
    });

    // Asegurarse de que las teclas solo se configuren si el sistema de entrada está listo
    if (this.scene.input.keyboard) {
      this.cursors = this.scene.input.keyboard.createCursorKeys();
      this.wasdKeys = {
        up: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
        down: this.scene.input.keyboard.addKey(
          Phaser.Input.Keyboard.KeyCodes.S
        ),
        left: this.scene.input.keyboard.addKey(
          Phaser.Input.Keyboard.KeyCodes.A
        ),
        right: this.scene.input.keyboard.addKey(
          Phaser.Input.Keyboard.KeyCodes.D
        ),
      };
    }
  }

  update() {
    if (this.health <= 0) {
      return; // No actualizar el juego si el jugador está muerto
    }

    // Movimiento del jugador con WASD
    if (this.wasdKeys.left.isDown) {
      this.x -= 5;
    } else if (this.wasdKeys.right.isDown) {
      this.x += 5;
    }

    if (this.wasdKeys.up.isDown) {
      this.y -= 5;
    } else if (this.wasdKeys.down.isDown) {
      this.y += 5;
    }

    // Disparar balas con ESPACIO o las flechas
    if (
      Phaser.Input.Keyboard.JustDown(this.cursors.left) ||
      Phaser.Input.Keyboard.JustDown(this.cursors.right) ||
      Phaser.Input.Keyboard.JustDown(this.cursors.up) ||
      Phaser.Input.Keyboard.JustDown(this.cursors.down)
    ) {
      this.shootBullet();
    }
  }

  shootBullet() {
    // Crear una bala desde la posición del jugador
    const bullet = this.bullets.get() as Phaser.GameObjects.Rectangle;

    if (bullet) {
      // Ajustar la forma de la bala y propiedades
      bullet.setPosition(this.x, this.y);
      bullet.setFillStyle(0x0000ff);
      bullet.setSize(10, 10);
      bullet.setActive(true);
      bullet.setVisible(true);

      // Añadir física para que la bala se mueva
      this.scene.physics.add.existing(bullet);
      const bulletBody = bullet.body as Phaser.Physics.Arcade.Body;

      if (bulletBody) {
        // Ajustar la caja de colisión de la bala al tamaño visible
        bulletBody.setSize(10, 10);

        // Determinar la dirección de disparo según las teclas presionadas
        if (this.cursors.left.isDown) {
          bulletBody.setVelocityX(-300);
          bulletBody.setVelocityY(0);
        } else if (this.cursors.right.isDown) {
          bulletBody.setVelocityX(300);
          bulletBody.setVelocityY(0);
        } else if (this.cursors.up.isDown) {
          bulletBody.setVelocityY(-300);
          bulletBody.setVelocityX(0);
        } else if (this.cursors.down.isDown) {
          bulletBody.setVelocityY(300);
          bulletBody.setVelocityX(0);
        } else {
          bulletBody.setVelocityY(-300);
        }

        bulletBody.setCollideWorldBounds(true);
        bulletBody.onWorldBounds = true;

        // Evento que destruye la bala cuando sale del mundo
        bulletBody.world.on(
          "worldbounds",
          (body: Phaser.Physics.Arcade.Body) => {
            if (body === bulletBody) {
              bullet.destroy(); // Reciclar la bala
            }
          }
        );
      }
    }
  }

  takeDamage() {
    if (this.damageCooldown) return;

    this.health -= 1;

    if (this.health <= 0) this.dead();

    this.damageCooldown = true;

    // Blink effect with color change
    this.scene.tweens.addCounter({
      from: 0,
      to: 5,
      duration: 500,
      onUpdate: (tween) => {
        const value = Math.floor(tween.getValue());
        this.setFillStyle(value % 2 === 0 ? 0x800080 : 0x00ff00);
      },
      onComplete: () => {
        this.damageCooldown = false;
        this.setFillStyle(0x00ff00); // Ensure the player is fully visible after blinking
      },
    });
  }

  async dead() {
    this.scene.scene.start("GameOver");
    await addScore(this.playerName, (this.scene as GameScene).score);
  }
}
