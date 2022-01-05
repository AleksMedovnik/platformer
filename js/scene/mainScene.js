'use strict'

export default class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene');
        this.life = false;
        this.flow = 3;
    }

    preload() {
        this.load.image('bg', 'img/bg.jpg');

        this.load.image('platform0', 'img/Platform/platform0.png');
        this.load.image('platform1', 'img/Platform/platform1.png');
        this.load.image('platform2', 'img/Platform/platform2.png');

        this.load.spritesheet('coin', 'img/coin/coin.png', {
            frameWidth: 128,
            frameHeight: 126
        });

        this.load.spritesheet('hero', 'img/Player/hero/hero.png', {
            frameWidth: 128,
            frameHeight: 126
        });
        this.load.spritesheet('hero_run', 'img/Player/hero_run/hero_run.png', {
            frameWidth: 128,
            frameHeight: 126
        });
        this.load.spritesheet('hero_jump', 'img/Player/hero_jump/hero_jump.png', {
            frameWidth: 128,
            frameHeight: 126
        });
        this.load.spritesheet('hero_spawn', 'img/Player/hero_spawn/hero_spawn.png', {
            frameWidth: 128,
            frameHeight: 126
        });

        this.load.image('sea', 'img/sea.png');
    }

    create() {
        this.add.image(400, 270, 'bg').setScale(2);

        this.sea_1 = this.add.tileSprite(0, -30, 1000, 600, 'sea')
            .setOrigin(0, 0);

        this.platforms = this.physics.add.staticGroup();
        this.createPlatform = (x, y) => {
            for (let i = 0; i < 3; i++) {
                this.platforms.create(x, y, `platform${i}`).setScale(0.5).refreshBody();
                x += 50;
            }
        }
        for (let i = 0, x = 50, y = 240, dx = 150, dy = 110; i < 6; x += dx, y += dy, dy = -dy, i++) {
            this.createPlatform(x, y);
        }

        this.hero = this.physics.add.sprite(100, 170, 'hero');
        this.hero.setCollideWorldBounds(true);
        this.hero.setSize(30, 50);
        this.hero.body.setOffset(45, 52);
        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNumbers('hero_run', { start: 0, end: 28 }),
            frameRate: 50,
            repeat: -1
        });
        this.anims.create({
            key: 'iddle',
            frames: this.anims.generateFrameNumbers('hero', { start: 0, end: 37 }),
            frameRate: 50,
            repeat: -1
        });
        this.anims.create({
            key: 'jump',
            frames: this.anims.generateFrameNumbers('hero_jump', { start: 0, end: 48 }),
            frameRate: 50,
            repeat: -1
        });
        this.anims.create({
            key: 'respawn',
            frames: this.anims.generateFrameNumbers('hero_spawn'),
            frameRate: 20,
            repeat: 0
        });


        this.anims.create({
            key: 'coin',
            frames: this.anims.generateFrameNumbers('coin', { start: 0, end: 12 }),
            frameRate: 5,
            repeat: -1
        });
        this.coin = this.physics.add.staticGroup({
            key: 'coin',
            frameQuantity: 10,
        });
        this.coinChildren = this.coin.getChildren();
        for (let i = 0, y = 50, d = 1; i < this.coinChildren.length; y -= 5, i++, d = i + 1) {
            let coin = this.coinChildren[i];
            coin
                .setPosition(90 * d, d * y)
                .setScale(0.3)
                .refreshBody()
                .anims.play('coin', true);

            this.physics.add.overlap(this.hero, coin, () => coin.destroy());
        }

        this.sea_2 = this.add.tileSprite(0, 50, 2000, 600, 'sea')
            .setOrigin(0, 0);

        this.cursor = this.input.keyboard.createCursorKeys();

        this.physics.add.collider(this.hero, this.platforms);

    }

    update() {

        // Hero Controls
        if (this.cursor.up.isDown && this.hero.body.touching.down) {
            this.hero.setVelocityY(-420);
        } else if (this.cursor.left.isDown) {
            this.hero.setVelocityX(-300);
            this.hero.setFlipX(true);
        } else if (this.cursor.right.isDown) {
            this.hero.setVelocityX(300);
            this.hero.setFlipX(false);
        } else {
            this.hero.setVelocityX(0);
        }

        // Hero Animations 
        if (!this.life) {
            this.hero.setPosition(100, 180);
            this.hero.anims.play('respawn', true);
            setTimeout(() => this.life = true, 1000);
        } else {
            if (this.hero.body.touching.down) {
                if (this.cursor.left.isDown || this.cursor.right.isDown) {
                    this.hero.anims.play('run', true);
                } else {
                    this.hero.anims.play('iddle', true);
                }
            } else {
                this.hero.anims.play('jump', true);
            }
        }

        // if Hero falls into the water -> respawn!
        if (this.hero.y > 550) {
            this.life = false;
        }

        // flow
        if (this.sea_2.tilePositionX > 1995 || this.sea_2.tilePositionX < 0) {
            this.flow = -this.flow;
        }
        this.sea_2.tilePositionX += this.flow;
    }

}