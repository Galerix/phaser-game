import { Scene } from "phaser";
import { Player } from "../objects/Player";
import { Enemy } from "../objects/Enemy";

export class GameScene extends Scene {
  player: Player;
  enemies: Phaser.Physics.Arcade.Group;
  score: number;
  scoreText: Phaser.GameObjects.Text;
  healthText: Phaser.GameObjects.Text;
  playerName: string;

  constructor() {
    super("GameScene");
    this.score = 0;
  }

  init(data: { playerName: string }) {
    this.playerName = data.playerName;
  }

  create() {
    const { width, height } = this.scale;

    // Crear jugador
    this.player = new Player(this, width / 2, height / 2, this.playerName);

    // Crear grupo de enemigos
    this.enemies = this.physics.add.group({
      classType: Enemy,
      runChildUpdate: true,
    });

    // Generar enemigos cada 2 segundos
    this.time.addEvent({
      delay: 2000,
      callback: () => {
        const x = Phaser.Math.Between(0, width);
        const y = Phaser.Math.Between(0, height);
        const enemy = new Enemy(this, x, y);
        this.enemies.add(enemy);
      },
      callbackScope: this,
      loop: true,
    });

    // Mostrar el nombre del jugador
    this.add.text(10, 10, "Jugador: " + this.playerName, {
      fontSize: "16px",
      color: "#ffffff",
    });

    // Puntuación
    this.scoreText = this.add.text(10, 40, "Puntuación: 0", {
      fontSize: "16px",
      color: "#ffffff",
    });

    // Salud del jugador
    this.healthText = this.add.text(10, 70, "Salud: " + this.player.health, {
      fontSize: "16px",
      color: "#ffffff",
    });

    // Explicacion de los controles para moverse
    this.add
      .text(width - 10, 10, "Moverse: WASD", {
        fontSize: "16px",
        color: "#ffffff",
      })
      .setOrigin(1, 0);

    // Explicacion de los controles para disparar

    this.add
      .text(width - 10, 40, "Disparar: 🔼⬅️🔽➡️", {
        fontSize: "16px",
        color: "#ffffff",
      })
      .setOrigin(1, 0);

    // Colisiones
    this.physics.add.overlap(
      this.player.bullets,
      this.enemies,
      this.handleBulletEnemyCollision,
      undefined,
      this
    );

    this.physics.add.overlap(
      this.player,
      this.enemies,
      this.handlePlayerEnemyCollision,
      undefined,
      this
    );
  }

  update() {
    this.player.update();

    // Movimiento de los enemigos hacia el jugador
    this.enemies.getChildren().forEach((enemy) => {
      if (enemy instanceof Enemy) {
        enemy.update(this.player);
      }
    });

    // Colisiones entre las balas de los enemigos y el jugador
    this.enemies.getChildren().forEach((enemy) => {
      if (enemy instanceof Enemy) {
        this.physics.add.overlap(
          enemy.bullets,
          this.player,
          (player, bullet) => {
            bullet.destroy();
            if (player instanceof Player) player.takeDamage();
            this.healthText.setText("Salud: " + this.player.health);
          },
          undefined,
          this
        );
      }
    });
  }

  // Función de colisión entre balas y enemigos
  handleBulletEnemyCollision: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback =
    (bullet, enemy) => {
      // Verificar si los objetos tienen cuerpos de física Arcade válidos

      bullet.destroy();
      if (enemy instanceof Enemy) enemy.takeDamage();

      // Actualizar puntuación
      this.score += 10;
      this.scoreText.setText("Puntuación: " + this.score);
    };

  // Función de colisión entre jugador y enemigos

  handlePlayerEnemyCollision: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback =
    (player) => {
      // Verificar si los objetos tienen cuerpos de física Arcade válidos
      if (player instanceof Player) {
        // Reducir la salud del jugador
        player.takeDamage();

        this.healthText.setText("Salud: " + player.health);
      }
    };
}

