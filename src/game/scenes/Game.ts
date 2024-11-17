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
  bullets: Phaser.Physics.Arcade.Group;
  enemies: Phaser.Physics.Arcade.Group;
  score: number;
  scoreText: Phaser.GameObjects.Text;
  health: number;
  healthText: Phaser.GameObjects.Text;

  constructor() {
    super("Game");
    this.score = 0; // Inicializar la puntuación
    this.health = 3; // Inicializar la salud del jugador (3 puntos de salud)
  }

  create() {
    // Inicializar puntuación y salud cada vez que la escena se crea
    this.score = 0;
    this.health = 3;

    // Crear jugador como un rectángulo
    this.player = this.add.rectangle(400, 300, 50, 50, 0x00ff00);
    this.physics.add.existing(this.player); // Añadir física al jugador
    const playerBody = this.player.body as Phaser.Physics.Arcade.Body;
    playerBody.setCollideWorldBounds(true);
    playerBody.setSize(50, 50); // Ajustar la caja de colisión del jugador al tamaño visible

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

    // Crear un grupo de balas
    this.bullets = this.physics.add.group({
      classType: Phaser.GameObjects.Rectangle,
      runChildUpdate: true,
    });

    // Crear un grupo de enemigos
    this.enemies = this.physics.add.group({
      classType: Phaser.GameObjects.Rectangle,
      runChildUpdate: true,
    });

    // Generar enemigos cada 2 segundos
    this.time.addEvent({
      delay: 2000,
      callback: this.spawnEnemy,
      callbackScope: this,
      loop: true,
    });

    // Crear un texto de puntuación en pantalla
    this.scoreText = this.add.text(10, 40, "Puntuación: 0", {
      fontFamily: "Arial",
      fontSize: "16px",
      color: "#ffffff",
    });

    // Crear un texto de salud en pantalla
    this.healthText = this.add.text(10, 70, "Salud: 3", {
      fontFamily: "Arial",
      fontSize: "16px",
      color: "#ffffff",
    });

    // Colisiones entre balas y enemigos
    this.physics.add.overlap(
      this.bullets,
      this.enemies,
      this
        .handleBulletEnemyCollision as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this
    );

    // Colisiones entre jugador y enemigos
    this.physics.add.overlap(
      this.player,
      this.enemies,
      this
        .handlePlayerEnemyCollision as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this
    );

    // Crear un texto de instrucciones
    this.add.text(
      10,
      10,
      "Usa WASD para mover el jugador, ESPACIO o flechas para disparar",
      {
        fontFamily: "Arial",
        fontSize: "16px",
        color: "#ffffff",
      }
    );

    EventBus.emit("current-scene-ready", this);
  }

  update() {
    if (this.health <= 0) {
      return; // No actualizar el juego si el jugador está muerto
    }

    // Movimiento del jugador con WASD
    if (this.wasdKeys.left.isDown) {
      this.player.x -= 5;
    } else if (this.wasdKeys.right.isDown) {
      this.player.x += 5;
    }

    if (this.wasdKeys.up.isDown) {
      this.player.y -= 5;
    } else if (this.wasdKeys.down.isDown) {
      this.player.y += 5;
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

    // Hacer que los enemigos se muevan hacia el jugador
    this.enemies.getChildren().forEach((enemy) => {
      if (enemy && enemy.active) {
        this.physics.moveToObject(
          enemy as Phaser.GameObjects.GameObject,
          this.player,
          50
        );
      }
    });
  }

  shootBullet() {
    // Crear una bala desde la posición del jugador
    const bullet = this.bullets.get() as Phaser.GameObjects.Rectangle;

    if (bullet) {
      // Ajustar la forma de la bala y propiedades
      bullet.setPosition(this.player.x, this.player.y);
      bullet.setFillStyle(0xff0000);
      bullet.setSize(10, 20);
      bullet.setActive(true);
      bullet.setVisible(true);

      // Añadir física para que la bala se mueva
      this.physics.add.existing(bullet);
      const bulletBody = bullet.body as Phaser.Physics.Arcade.Body;

      if (bulletBody) {
        // Ajustar la caja de colisión de la bala al tamaño visible
        bulletBody.setSize(10, 20);

        // Determinar la dirección de disparo según las teclas presionadas
        if (this.cursors.left.isDown) {
          bullet.setSize(20, 10); // Horizontal
          bulletBody.setVelocityX(-300);
          bulletBody.setVelocityY(0);
        } else if (this.cursors.right.isDown) {
          bullet.setSize(20, 10); // Horizontal
          bulletBody.setVelocityX(300);
          bulletBody.setVelocityY(0);
        } else if (this.cursors.up.isDown) {
          bullet.setSize(10, 20); // Vertical
          bulletBody.setVelocityY(-300);
          bulletBody.setVelocityX(0);
        } else if (this.cursors.down.isDown) {
          bullet.setSize(10, 20); // Vertical
          bulletBody.setVelocityY(300);
          bulletBody.setVelocityX(0);
        } else {
          // Por defecto dispara hacia arriba
          bullet.setSize(10, 20);
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

  spawnEnemy() {
    // Crear un enemigo en una posición aleatoria
    const x = Phaser.Math.Between(0, this.scale.width);
    const y = Phaser.Math.Between(0, this.scale.height);
    const enemy = this.enemies.get(x, y) as Phaser.GameObjects.Rectangle;

    if (enemy) {
      enemy.setSize(40, 40);
      enemy.setFillStyle(0xff0000);
      enemy.setActive(true);
      enemy.setVisible(true);

      // Añadir física para el enemigo y ajustar la caja de colisión
      this.physics.add.existing(enemy);
      const enemyBody = enemy.body as Phaser.Physics.Arcade.Body;
      enemyBody.setSize(40, 40);
    }
  }

  handleBulletEnemyCollision(
    bulletObj: Phaser.GameObjects.GameObject,
    enemyObj: Phaser.GameObjects.GameObject
  ) {
    // Coerción de tipo para asegurarnos de que los objetos son rectángulos
    const bullet = bulletObj as Phaser.GameObjects.Rectangle;
    const enemy = enemyObj as Phaser.GameObjects.Rectangle;

    // Destruir tanto la bala como el enemigo
    bullet.destroy();
    enemy.destroy();

    // Incrementar la puntuación
    this.score += 10;
    this.scoreText.setText(`Puntuación: ${this.score}`);
  }

  handlePlayerEnemyCollision(
    playerObj: Phaser.GameObjects.GameObject,
    enemyObj: Phaser.GameObjects.GameObject
  ) {
    // Reducir la salud del jugador
    this.health -= 1;
    this.healthText.setText(`Salud: ${this.health}`);

    // Destruir al enemigo que colisionó con el jugador
    const enemy = enemyObj as Phaser.GameObjects.Rectangle;
    enemy.destroy();

    // Terminar el juego si la salud llega a 0
    if (this.health <= 0) {
      this.scene.pause();
      const gameOverText = this.add
        .text(400, 300, "Game Over\nClick para reiniciar", {
          fontFamily: "Arial",
          fontSize: "48px",
          color: "#ff0000",
          align: "center",
        })
        .setOrigin(0.5);

      // Añadir interacción para reiniciar el juego
      gameOverText.setInteractive().on("pointerdown", () => {
        this.scene.restart();
      });
    }
  }
}

