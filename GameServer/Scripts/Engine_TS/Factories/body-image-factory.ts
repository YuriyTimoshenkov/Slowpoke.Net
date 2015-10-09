/// <reference path="../../typings/easeljs/easeljs.d.ts" />

interface BodyImageFactory {
    viewBodyFactory;
    serverTypeMap;
    createBodyImage(gameObjectType, data): BodyImage;

    createBodyImagebyServerBody(body): BodyImage;
} 