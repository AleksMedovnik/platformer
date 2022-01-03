'use strict'

import MainScene from "./scene/mainScene.js";

const main = document.getElementById('main');

const resize = () => {
    if(document.documentElement.clientWidth < 1000){
        alert(`Просматриваемое окно слишком мало! Пожалуйста, увеличьте область просмотра!`)
    }
}
resize();

window.onresize = resize;

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