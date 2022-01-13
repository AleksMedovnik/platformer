'use strict'

import MainScene from "./scene/mainScene.js";

const main = document.getElementById('main');

const config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 600,
    parent: 'main',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 800 },
            debug: false
        }
    },
    scene: [MainScene]
};

const game = new Phaser.Game(config);