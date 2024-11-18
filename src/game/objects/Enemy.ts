import { Scene } from "phaser";
import { Player } from "./Player";
import { GameScene } from "../scenes/GameScene";

export class Enemy extends Phaser.GameObjects.Sprite {
  health: number = 3;
  bullets: Phaser.Physics.Arcade.Group;
  damageCooldown: boolean = false;
  speed: number = 50;

  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y, "enemy");
    this.scene = scene;

    this.initPhysics();
    this.initShooting();
    this.registerEvents();

    console.log(`Enemy created at position (${x}, ${y})`);
  }

  private initPhysics() {
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);

    // Enemy bullet group
    this.bullets = this.scene.physics.add.group({
      classType: Phaser.GameObjects.Sprite,
      runChildUpdate: true,
    });
  }

  private initShooting() {
    // Start a timer to shoot bullets at the player at regular intervals
    this.scene.time.addEvent({
      delay: 2000, // Shoot every 2 seconds
      callback: this.shootBullet,
      callbackScope: this,
      loop: true,
    });
  }

  private registerEvents() {
    this.on("animationcomplete", () => {
      this.destroy();
      console.log("Enemy destroyed");
    });
  }

  update(player: Player) {
    if (player.active) {
      this.scene.physics.moveToObject(this, player, this.speed);
      this.rotation =
        Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y) -
        Math.PI / 2;
    }
  }

  takeDamage() {
    if (this.damageCooldown) return;

    this.health -= 1;
    this.damageCooldown = true;
    console.log(`Enemy took damage. Remaining health: ${this.health}`);

    if (this.health <= 0) {
      this.handleDeath();
    } else {
      this.handleDamageBlink();
    }
  }

  private handleDeath() {
    this.setTexture("explosion");
    this.play("explosion");
    this.speed = 0;
  }

  private handleDamageBlink() {
    this.scene.tweens.addCounter({
      from: 0,
      to: 5,
      duration: 500,
      onUpdate: (tween) => {
        const value = Math.floor(tween.getValue());
        this.setAlpha(value % 2 === 0 ? 0 : 1);
      },
      onComplete: () => {
        this.damageCooldown = false;
        this.setAlpha(1);
      },
    });
  }

  private shootBullet() {
    if (!this.active) return; // Avoid shooting if the enemy has already been destroyed

    const playerPosition = {
      x: (this.scene as GameScene).player.x,
      y: (this.scene as GameScene).player.y,
    };

    const bullet = this.bullets.get(
      this.x,
      this.y
    ) as Phaser.GameObjects.Sprite;

    if (bullet) {
      this.configureBullet(bullet, playerPosition);
    }
  }

  private configureBullet(
    bullet: Phaser.GameObjects.Sprite,
    playerPosition: { x: number; y: number }
  ) {
    bullet.setPosition(this.x, this.y);
    bullet.setTexture("laser-bolts");
    bullet.setActive(true).setVisible(true).setSize(16, 16);
    bullet.play("enemy-shoot");

    this.scene.physics.add.existing(bullet);
    const bulletBody = bullet.body as Phaser.Physics.Arcade.Body;
    bulletBody.setSize(16, 16);

    this.scene.physics.moveToObject(bullet, playerPosition, 200);

    // Make the bullet destroy itself automatically after a certain time
    this.scene.time.addEvent({
      delay: 2000, // Duration in milliseconds
      callback: () => {
        bullet.destroy();
      },
    });

    bulletBody.world.on("worldbounds", (body: Phaser.Physics.Arcade.Body) => {
      if (body === bulletBody) {
        bullet.destroy();
      }
    });
  }
}

