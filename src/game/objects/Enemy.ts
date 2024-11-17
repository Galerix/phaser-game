import { Scene } from "phaser";
import { Player } from "./Player";
import { GameScene } from "../scenes/GameScene";

export class Enemy extends Phaser.GameObjects.Rectangle {
  health: number;
  bullets: Phaser.Physics.Arcade.Group;
  scene: Scene;
  damageCooldown: boolean;

  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y, 40, 40, 0xff0000); // Enemigo como un rectángulo rojo
    this.scene = scene;
    this.health = 3; // Salud del enemigo
    this.damageCooldown = false;

    // Añadir el enemigo a la escena y añadir física
    scene.add.existing(this);
    scene.physics.add.existing(this);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setCollideWorldBounds(true); // Mantener al enemigo dentro de los límites
    body.onWorldBounds = false; // No destruir al tocar el límite
    body.setImmovable(true); // Para que no colisione y sea empujado por otros objetos

    // Grupo de balas del enemigo
    this.bullets = this.scene.physics.add.group({
      classType: Phaser.GameObjects.Rectangle,
      runChildUpdate: true,
    });

    // Iniciar un temporizador para disparar balas al jugador cada cierto intervalo
    this.startShooting();

    // Mensaje de consola para saber cuándo se crea el enemigo
    console.log(`Enemy created at position (${x}, ${y})`);
  }

  update(player: Player) {
    if (this.health <= 0) {
      console.log(`Enemy destroyed at position (${this.x}, ${this.y})`); // Mensaje de consola para saber cuándo se destruye
      this.destroy(); // Destruir el enemigo si se queda sin salud
      return;
    }

    // Movimiento hacia el jugador
    if (player && player.active) {
      this.scene.physics.moveToObject(this, player, 50);
    }
  }

  takeDamage() {
    if (this.damageCooldown) return;

    this.health -= 1;
    this.damageCooldown = true;

    // Blink effect with color change
    this.scene.tweens.addCounter({
      from: 0,
      to: 5,
      duration: 500,
      onUpdate: (tween) => {
        const value = Math.floor(tween.getValue());
        this.setFillStyle(value % 2 === 0 ? 0x0000ff : 0xff0000); // Alternate between blue and original color
      },
      onComplete: () => {
        this.damageCooldown = false;
        this.setFillStyle(0xff0000); // Ensure the enemy is fully visible after blinking
      },
    });

    console.log(`Enemy took damage. Remaining health: ${this.health}`); // Mensaje para ver el daño que recibe
    if (this.health <= 0) {
      this.destroy();
    }
  }

  startShooting() {
    this.scene.time.addEvent({
      delay: 2000, // Disparar cada 2 segundos
      callback: () => {
        if (this.active) {
          this.shootBullet();
        }
      },
      callbackScope: this,
      loop: true,
    });
  }

  shootBullet() {
    if (!this.active) return; // Evitar disparar si el enemigo ya fue destruido

    const playerPosition = {
      x: (this.scene as GameScene).player.x,
      y: (this.scene as GameScene).player.y,
    };

    // Crear una bala desde la posición del enemigo
    const bullet = this.bullets.get(
      this.x,
      this.y
    ) as Phaser.GameObjects.Rectangle;

    if (bullet) {
      // Ajustar la forma de la bala y propiedades
      bullet.setPosition(this.x, this.y);
      bullet.setFillStyle(0x800080); // Bala de enemigo en morado
      bullet.setSize(10, 10);
      bullet.setActive(true);
      bullet.setVisible(true);

      // Añadir física para que la bala se mueva hacia el jugador
      this.scene.physics.add.existing(bullet);
      const bulletBody = bullet.body as Phaser.Physics.Arcade.Body;

      if (bulletBody) {
        bulletBody.setSize(10, 10);
        // Calcular la dirección hacia el jugador y establecer la velocidad
        this.scene.physics.moveToObject(bullet, playerPosition, 200);
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
}
