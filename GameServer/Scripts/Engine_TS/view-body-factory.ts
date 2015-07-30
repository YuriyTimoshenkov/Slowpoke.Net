/// <reference path="../typings/easeljs/easeljs.d.ts" />

interface ViewBodyFactory {

    createGameObject(gameObjectType, data): createjs.Container;

    createGameObjectbyServerBody(body): createjs.Container;
} 