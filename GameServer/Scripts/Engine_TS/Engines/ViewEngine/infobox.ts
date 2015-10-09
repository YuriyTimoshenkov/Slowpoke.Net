interface Infobox {
    update(updateType: BodyChangesType, body: Body);
    addSelfToContainer(container: createjs.Container);
    removeSelf(container: createjs.Container);
}


class PlayerInfoboxFixed implements Infobox{
        textGap = 30;
        lifeTextColor = "blue";
        weaponTextColor = "blue";
        scoreTextColor = "red";
        textSize = 20;
        lifePoint: Point;
        weaponPoint: Point;
        scorePoint: Point;
        lifeText: createjs.Text;
        weaponText: createjs.Text;
        scoreText: createjs.Text;

        constructor(body: CharacterBody, startPoint: Point) {
            this.weaponPoint = startPoint;
            this.lifePoint = new Point(this.weaponPoint.x, this.weaponPoint.y - this.textGap);
            this.scorePoint = new Point(this.weaponPoint.x, this.lifePoint.y - this.textGap);
            this.create(body);
        }
        
        create(body: CharacterBody) {
            this.createLifeText(body);
            this.createWeaponText(body);
            this.createScoreText(body);
        }

        addSelfToContainer(container) {
            container.addChild(this.lifeText, this.weaponText, this.scoreText);
        }

        createLifeText(body: CharacterBody) {
            var text = "HP: " + body.life;
            this.lifeText = new createjs.Text(text, this.textSize + "px Arial", this.lifeTextColor);
            this.lifeText.x = this.lifePoint.x;
            this.lifeText.y = this.lifePoint.y;
            this.lifeText.zIndex = 100;
        }
        createWeaponText(body: CharacterBody) {
            this.weaponText = new createjs.Text(body.currentWeapon.name, this.textSize + "px Arial", this.lifeTextColor);
            this.weaponText.zIndex = 3;
            this.weaponText.x = this.weaponPoint.x;
            this.weaponText.y = this.weaponPoint.y;
            this.weaponText.zIndex = 100;
        }
        createScoreText(body: CharacterBody) {
            var text = "Score: " + body.score;
            this.scoreText = new createjs.Text(text, this.textSize + "px Arial", this.scoreTextColor);
            this.scoreText.x = this.scorePoint.x;
            this.scoreText.y = this.scorePoint.y;
            this.scoreText.zIndex = 100;
        }
        
        updateScoreText(body: CharacterBody) {
            this.scoreText.text = "Score: " + body.score;
        }

        updateCurrentWeaponText(body: CharacterBody) {
            this.weaponText.text = body.currentWeapon.name;
        }
        updateLifeText(body: CharacterBody) {
            this.lifeText.text = "HP: " + body.life;
        } 

        removeSelf(container) {
            container.removeChild(this.lifeText);
            container.removeChild(this.weaponText);
            container.removeChild(this.scoreText);
        }   

        update(updateType: BodyChangesType, body: CharacterBody) {
            this.updateScoreText(body);
            this.updateCurrentWeaponText(body);
            this.updateLifeText(body);
        }
}

class PlayerInfoboxFloating implements Infobox {
    nameTextColor = "blue";
    textSize = 10;
    nameText: createjs.Text;

    constructor(body: CharacterBody) {
        this.create(body);
    }

    create(body: CharacterBody) {
        this.createNameText(body);
    }

    addSelfToContainer(container) {
        container.addChild(this.nameText);
    }

    createNameText(body: CharacterBody) {
        this.nameText = new createjs.Text(body.name, this.textSize + "px Arial", this.nameTextColor);
        this.updatePosition(body);
        this.nameText.zIndex = 100;
    }
    updatePosition(body: CharacterBody) {
        this.nameText.x = body.gameRect.centerx - body.gameRect.width / 2;
        this.nameText.y = body.gameRect.centery - body.gameRect.height / 2 - 20;
    }
    removeSelf(container) {
        container.removeChild(this.nameText);
    }

    update(updateType: BodyChangesType, body: CharacterBody) {
        this.updatePosition(body);
    }
}

class NPCInfoboxFloating implements Infobox {
    lifeTextColor = "red";
    textSize = 16;
    lifeText: createjs.Text;


    constructor(body: CharacterBody) {
        this.create(body);
    }

    create(body: CharacterBody) {
        this.createLifeText(body);
    }
    addSelfToContainer(container) {
        container.addChild(this.lifeText);
    }
    createLifeText(body: CharacterBody) {
        this.lifeText = new createjs.Text(body.life.toString(), this.textSize + "px Arial", this.lifeTextColor);
        this.updatePosition(body);
        this.lifeText.zIndex = 100;
    }

    updatePosition(body: CharacterBody) {
        this.lifeText.x = body.gameRect.centerx - body.gameRect.width / 2;
        this.lifeText.y = body.gameRect.centery - body.gameRect.height / 2 - 30;
    }
    updateLifeText(body: CharacterBody) {
        this.lifeText.text = body.life.toString();
    } 

    removeSelf(container) {
        container.removeChild(this.lifeText);
    }

    update(updateType: BodyChangesType, body: CharacterBody) {
        this.updatePosition(body);
        this.updateLifeText(body);
    }
}

class PerformanceInfoboxFixed  {
    textGap = 20;
    textColor = "red";
    textSize = 10;
    ppsPoint: Point;
    fpsPoint: Point;
    ppsText: createjs.Text;
    fpsText: createjs.Text;
    data: any;

    constructor(data, startPoint: Point) {
        this.data = data;
        this.ppsPoint = startPoint;
        this.fpsPoint = new Point(this.ppsPoint.x, this.ppsPoint.y - this.textGap);
        this.create();
    }

    create() {
        this.createPPSText();
        this.createFPSText();
    }
    addSelfToContainer(container) {
        container.addChild(this.ppsText, this.fpsText);
    }
    createPPSText() {
        var text = "PPS: " + this.data.ping;
        this.ppsText = new createjs.Text(text, this.textSize + "px Arial", this.textColor);
        this.ppsText.x = this.ppsPoint.x;
        this.ppsText.y = this.ppsPoint.y;
        this.ppsText.zIndex = 100;
    }
    createFPSText() {
        var text = "FPS: " + this.data.fps;
        this.fpsText = new createjs.Text(text, this.textSize + "px Arial", this.textColor);
        this.fpsText.x = this.fpsPoint.x;
        this.fpsText.y = this.fpsPoint.y;
        this.fpsText.zIndex = 100;
    }

    update() {
        this.updatePPSText();
        this.updateFPSText();
    }

    updatePPSText() {
        this.ppsText.text = "PPS: " + this.data.ping;
    }

    updateFPSText() {
        this.fpsText.text = "FPS: " + this.data.fps;
    }
}
