import { Scene } from "phaser";
import { Player } from "../objects/Player";
import { Enemy } from "../objects/Enemy";
import VirtualJoystick from "phaser3-rex-plugins/plugins/virtualjoystick.js";

export class GameScene extends Scene {
  player: Player;
  enemies: Phaser.Physics.Arcade.Group;
  score: number = 0;
  scoreText: Phaser.GameObjects.Text;
  healthText: Phaser.GameObjects.Text;
  playerName: string;

  constructor() {
    super("GameScene");
  }

  preload() {
    this.loadAssets();
  }

  init(data: { playerName: string }) {
    this.playerName = data.playerName;
  }

  create() {
    const { width, height } = this.scale;

    // Adjust scaling factor to make scene responsive
    const scaleFactor = Math.min(width / 800, height / 600);

    this.createGalaxyBackground(width, height);
    this.createAnimations();
    this.createPlayer(width, height, scaleFactor);
    this.createEnemies(width, height);
    this.createHUD(width, scaleFactor);
    this.setupCollisions();

    this.cameras.main.roundPixels = false; // Avoid sprite blurring
    this.cameras.main.startFollow(this.player); // Follow the player

    this.physics.world.setBounds(0, 0, width * 2, height * 2);
  }

  update() {
    this.player.update();
    this.updateEnemies();
    this.updateCollisions();
  }

  private loadAssets() {
    const assets = [
      {
        key: "player",
        path: "assets/spritesheets/ship.png",
        frameWidth: 16,
        frameHeight: 24,
      },
      {
        key: "enemy",
        path: "assets/spritesheets/enemy-small.png",
        frameWidth: 16,
        frameHeight: 16,
      },
      {
        key: "laser-bolts",
        path: "assets/spritesheets/laser-bolts.png",
        frameWidth: 16,
        frameHeight: 16,
      },
      {
        key: "explosion",
        path: "assets/spritesheets/explosion.png",
        frameWidth: 16,
        frameHeight: 16,
      },
    ];

    assets.forEach((asset) =>
      this.load.spritesheet(asset.key, asset.path, {
        frameWidth: asset.frameWidth,
        frameHeight: asset.frameHeight,
      })
    );
  }

  private createAnimations() {
    const animations = [
      {
        key: "player-idle",
        frames: [2, 7],
        sprite: "player",
        frameRate: 16,
        repeat: -1,
      },
      {
        key: "player-shoot",
        frames: [2, 3],
        sprite: "laser-bolts",
        frameRate: 16,
        repeat: -1,
      },
      {
        key: "enemy-idle",
        frames: [0, 1],
        sprite: "enemy",
        frameRate: 16,
        repeat: -1,
      },
      {
        key: "enemy-shoot",
        frames: [0, 1],
        sprite: "laser-bolts",
        frameRate: 16,
        repeat: -1,
      },
      {
        key: "explosion",
        frames: [0, 1, 2, 3, 4],
        sprite: "explosion",
        frameRate: 16,
        repeat: 0,
      },
    ];

    animations.forEach((anim) => {
      this.anims.create({
        key: anim.key,
        frames: this.anims.generateFrameNumbers(anim.sprite, {
          frames: anim.frames,
        }),
        frameRate: anim.frameRate,
        repeat: anim.repeat,
      });
    });
  }

  private createPlayer(width: number, height: number, scaleFactor: number) {
    // Virtual joystick
    let movementKeys: {
      up: Phaser.Input.Keyboard.Key;
      down: Phaser.Input.Keyboard.Key;
      left: Phaser.Input.Keyboard.Key;
      right: Phaser.Input.Keyboard.Key;
    };
    let shootingKeys: {
      left: Phaser.Input.Keyboard.Key;
      right: Phaser.Input.Keyboard.Key;
      up: Phaser.Input.Keyboard.Key;
      down: Phaser.Input.Keyboard.Key;
    };

    if (this.game.device.os.desktop && this.input.keyboard) {
      movementKeys = {
        up: this.input.keyboard.addKey("W"),
        down: this.input.keyboard.addKey("S"),
        left: this.input.keyboard.addKey("A"),
        right: this.input.keyboard.addKey("D"),
      };

      shootingKeys = {
        up: this.input.keyboard.addKey("UP"),
        down: this.input.keyboard.addKey("DOWN"),
        left: this.input.keyboard.addKey("LEFT"),
        right: this.input.keyboard.addKey("RIGHT"),
      };
    } else {
      const leftJoystick = new VirtualJoystick(this, {
        x: 100 * scaleFactor,
        y: height - 100 * scaleFactor,
        radius: 50 * scaleFactor,
        base: this.add.circle(0, 0, 50 * scaleFactor, 0x888888),
        thumb: this.add.circle(0, 0, 25 * scaleFactor, 0xcccccc),
      });

      const rightJoystick = new VirtualJoystick(this, {
        x: width - 100 * scaleFactor,
        y: height - 100 * scaleFactor,
        radius: 50 * scaleFactor,
        base: this.add.circle(0, 0, 50 * scaleFactor, 0x888888),
        thumb: this.add.circle(0, 0, 25 * scaleFactor, 0xcccccc),
      });

      movementKeys = leftJoystick.createCursorKeys();
      shootingKeys = rightJoystick.createCursorKeys();
    }

    this.player = new Player(
      this,
      width / 2,
      height / 2,
      this.playerName,
      movementKeys,
      shootingKeys
    );
    this.player.play("player-idle");
  }

  private createEnemies(width: number, height: number) {
    this.enemies = this.physics.add.group({
      classType: Enemy,
      runChildUpdate: true,
    });
    this.time.addEvent({
      delay: 2000,
      callback: () => this.spawnEnemy(width, height),
      callbackScope: this,
      loop: true,
    });
  }

  private spawnEnemy(width: number, height: number) {
    const x = Phaser.Math.Between(0, width);
    const y = Phaser.Math.Between(0, height);
    const enemy = new Enemy(this, x, y);
    enemy.play("enemy-idle");
    this.enemies.add(enemy);
  }

  private createGalaxyBackground(width: number, height: number) {
    const graphics = this.add.graphics();
    const numStars = 200;

    graphics.fillStyle(0x000000, 1);
    graphics.fillRect(0, 0, width * 2, height * 2);

    for (let i = 0; i < numStars; i++) {
      const x = Phaser.Math.Between(0, width * 2);
      const y = Phaser.Math.Between(0, height * 2);
      const radius = Phaser.Math.FloatBetween(0.5, 1.5);
      graphics.fillStyle(0xffffff, 1);
      graphics.fillCircle(x, y, radius);
    }

    graphics.generateTexture("galaxyBackground", width * 2, height * 2);
    this.add.image(0, 0, "galaxyBackground").setOrigin(0).setScrollFactor(0.5);
  }
  private createHUD(width: number, scaleFactor: number) {
    const hudContainer = this.add.container(0, 0);

    // General HUD style
    const textStyle = {
      fontSize: `${22 * scaleFactor}px`,
      color: "#e0e0e0",
      fontFamily: "Arial",
      fontStyle: "bold",
      stroke: "#000",
      strokeThickness: 4 * scaleFactor,
      shadow: {
        offsetX: 3 * scaleFactor,
        offsetY: 3 * scaleFactor,
        color: "#000000",
        blur: 5 * scaleFactor,
        fill: true,
      },
    };

    // Player title with professional design
    hudContainer.add(
      this.add.text(
        20 * scaleFactor,
        20 * scaleFactor,
        `Pilot: ${this.playerName}`,
        {
          ...textStyle,
          fontSize: `${24 * scaleFactor}px`,
          color: "#00e5ff",
          strokeThickness: 5 * scaleFactor,
        }
      )
    );

    // Player score
    this.scoreText = this.add.text(
      20 * scaleFactor,
      60 * scaleFactor,
      "Score: 0",
      {
        ...textStyle,
        fontSize: `${20 * scaleFactor}px`,
        color: "#ffffff",
      }
    );
    hudContainer.add(this.scoreText);

    // Player health
    this.healthText = this.add.text(
      20 * scaleFactor,
      100 * scaleFactor,
      `Health: ${this.player.health}`,
      {
        ...textStyle,
        fontSize: `${20 * scaleFactor}px`,
        color: "#ff4444",
      }
    );
    hudContainer.add(this.healthText);

    // Enhanced control instructions
    hudContainer.add(
      this.add
        .text(width - 20 * scaleFactor, 20 * scaleFactor, "Move: WASD", {
          ...textStyle,
          fontSize: `${18 * scaleFactor}px`,
          color: "#00ff88",
          strokeThickness: 3 * scaleFactor,
        })
        .setOrigin(1, 0)
    );
    hudContainer.add(
      this.add
        .text(width - 20 * scaleFactor, 50 * scaleFactor, "Shoot: Arrows", {
          ...textStyle,
          fontSize: `${18 * scaleFactor}px`,
          color: "#ff8800",
          strokeThickness: 3 * scaleFactor,
        })
        .setOrigin(1, 0)
    );

    // Blinking effect for the title
    this.tweens.add({
      targets: hudContainer.getAt(0),
      alpha: { from: 0.8, to: 1 },
      ease: "Sine.easeInOut",
      duration: 800,
      yoyo: true,
      repeat: -1,
    });

    hudContainer.setScrollFactor(0);
  }

  private setupCollisions() {
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

  private updateEnemies() {
    this.enemies.getChildren().forEach((enemy) => {
      if (enemy instanceof Enemy) {
        enemy.update(this.player);
      }
    });
  }

  private updateCollisions() {
    this.enemies.getChildren().forEach((enemy) => {
      if (enemy instanceof Enemy) {
        this.physics.add.overlap(
          enemy.bullets,
          this.player,
          (player, bullet) => {
            bullet.destroy();
            if (player instanceof Player) player.takeDamage();
            this.healthText.setText(`Health: ${this.player.health}`);
          },
          undefined,
          this
        );
      }
    });
  }

  // Function for bullet-enemy collision
  private handleBulletEnemyCollision: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback =
    (bullet, enemy) => {
      bullet.destroy();
      if (enemy instanceof Enemy) enemy.takeDamage();

      // Update score
      this.score += 10;
      this.scoreText.setText(`Score: ${this.score}`);
    };

  // Function for player-enemy collision
  private handlePlayerEnemyCollision: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback =
    (player) => {
      if (player instanceof Player) {
        player.takeDamage();
        this.healthText.setText(`Health: ${player.health}`);
      }
    };
}
