import { Scene } from "phaser";
import { GameScene } from "../scenes/GameScene";
import { addScore } from "@/database/add-score";

export class Player extends Phaser.GameObjects.Sprite {
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
    super(scene, x, y, "player");
    this.health = 3;
    this.damageCooldown = false;
    this.playerName = playerName;

    // Add the player to the scene and add physics
    scene.add.existing(this);
    scene.physics.add.existing(this);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setSize(24, 24);

    // Player's bullet group
    this.bullets = this.scene.physics.add.group({
      classType: Phaser.GameObjects.Sprite,
      runChildUpdate: true,
    });

    // Ensure that keys are only set if the input system is ready
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
      return; // Do not update the game if the player is dead
    }

    const body = this.body as Phaser.Physics.Arcade.Body;
    let velocityX = 0;
    let velocityY = 0;

    // Movement control
    if (this.wasdKeys.left.isDown) {
      velocityX = -200;
    } else if (this.wasdKeys.right.isDown) {
      velocityX = 200;
    }

    if (this.wasdKeys.up.isDown) {
      velocityY = -200;
    } else if (this.wasdKeys.down.isDown) {
      velocityY = 200;
    }

    // Set the body's velocity
    body.setVelocity(velocityX, velocityY);

    // Calculate the sprite's rotation based on the movement direction
    if (velocityX !== 0 || velocityY !== 0) {
      const angle = Math.atan2(velocityY, velocityX) + Phaser.Math.DegToRad(90);
      this.setRotation(angle);
    }

    // Shoot bullets with SPACE or arrow keys
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
    // Create a bullet from the player's position
    const bullet = this.bullets.get() as Phaser.GameObjects.Sprite;

    if (bullet) {
      // Adjust the shape of the bullet and properties
      bullet.setTexture("laser-bolts");
      bullet.play("player-shoot");
      bullet.setPosition(this.x, this.y);

      // Add physics so the bullet moves
      this.scene.physics.add.existing(bullet);
      const bulletBody = bullet.body as Phaser.Physics.Arcade.Body;

      // Adjust the bullet's collision box to the visible size
      bulletBody.setSize(16, 16);

      // Determine the shooting direction based on the pressed keys and player's speed
      const playerVelocity = this.body as Phaser.Physics.Arcade.Body;
      const speed = 200;

      if (this.cursors.left.isDown) {
        bulletBody.setVelocity(-speed, playerVelocity.velocity.y / 2);
        bullet.rotation =
          Math.atan2(playerVelocity.velocity.y / 2, -speed) +
          Phaser.Math.DegToRad(90);
      } else if (this.cursors.right.isDown) {
        bulletBody.setVelocity(speed, playerVelocity.velocity.y / 2);
        bullet.rotation =
          Math.atan2(playerVelocity.velocity.y / 2, speed) +
          Phaser.Math.DegToRad(90);
      } else if (this.cursors.up.isDown) {
        bulletBody.setVelocity(playerVelocity.velocity.x / 2, -speed);
        bullet.rotation =
          Math.atan2(-speed, playerVelocity.velocity.x / 2) +
          Phaser.Math.DegToRad(90);
      } else if (this.cursors.down.isDown) {
        bulletBody.setVelocity(playerVelocity.velocity.x / 2, speed);
        bullet.rotation =
          Math.atan2(speed, playerVelocity.velocity.x / 2) +
          Phaser.Math.DegToRad(90);
      }

      // Make the bullet destroy itself automatically after a certain time
      this.scene.time.addEvent({
        delay: 2000, // Duration in milliseconds
        callback: () => {
          bullet.destroy();
        },
      });

      // Event that destroys the bullet when it leaves the world
      bulletBody.world.on("worldbounds", (body: Phaser.Physics.Arcade.Body) => {
        if (body === bulletBody) {
          bullet.destroy(); // Recycle the bullet
        }
      });
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

        if (value % 2 === 0) {
          this.setAlpha(0);
        } else {
          this.setAlpha(1);
        }
      },
      onComplete: () => {
        this.damageCooldown = false;
        this.setAlpha(1);
      },
    });
  }

  async dead() {
    this.scene.scene.start("GameOver");
    await addScore(this.playerName, (this.scene as GameScene).score);
  }
}

