﻿class BodyImage {
    id: number;
    image: createjs.Container;
    baseImage: any;
    infoboxes: Infobox[];
    constructor(id: number, image: createjs.DisplayObject) {
        this.id = id;
        this.image = new createjs.Container();
        this.image.addChild(image);
        this.baseImage = image;
        this.infoboxes = [];
    }
    animate(animationType: string) { }
}

class CharacterBodyImage extends BodyImage {
    weaponImageContainer: createjs.Container;
    constructor(id: number, image: createjs.DisplayObject) {
        super(id, image);
        this.weaponImageContainer = new createjs.Container();
        this.image.addChildAt(this.weaponImageContainer, 0);
    }

    setNewWeaponImage(weaponImage: createjs.DisplayObject) {
        this.weaponImageContainer.removeAllChildren();

        if (weaponImage != null) {
            this.weaponImageContainer.addChild(weaponImage);
        }
    }

    animate(animationType: string) {
        switch (animationType) {
            case "bodyHit":
                this.baseImage.gotoAndPlay(animationType);
                break;
        }
    }
}