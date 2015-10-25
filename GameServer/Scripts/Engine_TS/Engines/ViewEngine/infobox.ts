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
            this.lifePoint = new Point(this.weaponPoint.X, this.weaponPoint.Y - this.textGap);
            this.scorePoint = new Point(this.weaponPoint.X, this.lifePoint.Y - this.textGap);
            this.create(body);
        }
        
        create(body: CharacterBody) {
            this.createLifeText(body);
            this.createWeaponText(body);
            this.createScoreText(body);
        }

        addSelfToContainer(container: createjs.Container) {
            container.addChild(this.lifeText, this.weaponText, this.scoreText);
        }

        createLifeText(body: CharacterBody) {
            var text = "HP: " + body.Life;
            this.lifeText = new createjs.Text(text, this.textSize + "px Arial", this.lifeTextColor);
            this.lifeText.x = this.lifePoint.X;
            this.lifeText.y = this.lifePoint.Y;
            this.lifeText.zIndex = 100;
        }
        createWeaponText(body: CharacterBody) {
            this.weaponText = new createjs.Text(body.CurrentWeapon.Name, this.textSize + "px Arial", this.lifeTextColor);
            this.weaponText.zIndex = 3;
            this.weaponText.x = this.weaponPoint.X;
            this.weaponText.y = this.weaponPoint.Y;
            this.weaponText.zIndex = 100;
        }
        createScoreText(body: CharacterBody) {
            var text = "Score: " + body.Score;
            this.scoreText = new createjs.Text(text, this.textSize + "px Arial", this.scoreTextColor);
            this.scoreText.x = this.scorePoint.X;
            this.scoreText.y = this.scorePoint.Y;
            this.scoreText.zIndex = 100;
        }
        
        updateScoreText(body: CharacterBody) {
            this.scoreText.text = "Score: " + body.Score;
        }

        updateCurrentWeaponText(body: CharacterBody) {
            this.weaponText.text = body.CurrentWeapon.Name;
        }
        updateLifeText(body: CharacterBody) {
            this.lifeText.text = "HP: " + body.Life;
        } 

        removeSelf(container: createjs.Container) {
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

    addSelfToContainer(container: createjs.Container) {
        container.addChild(this.nameText);
    }

    createNameText(body: CharacterBody) {
        this.nameText = new createjs.Text(body.Name, this.textSize + "px Arial", this.nameTextColor);
        this.updatePosition(body);
        this.nameText.zIndex = 100;
    }
    updatePosition(body: CharacterBody) {
        this.nameText.x = body.Shape.Position.X - body.Shape.MaxDimension;
        this.nameText.y = body.Shape.Position.Y - body.Shape.MaxDimension - 20;
    }
    removeSelf(container: createjs.Container) {
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
    addSelfToContainer(container: createjs.Container) {
        container.addChild(this.lifeText);
    }
    createLifeText(body: CharacterBody) {
        this.lifeText = new createjs.Text(body.Life.toString(), this.textSize + "px Arial", this.lifeTextColor);
        this.updatePosition(body);
        this.lifeText.zIndex = 100;
    }

    updatePosition(body: CharacterBody) {
        this.lifeText.x = body.Shape.Position.X - body.Shape.MaxDimension;
        this.lifeText.y = body.Shape.Position.Y - body.Shape.MaxDimension - 30;
    }
    updateLifeText(body: CharacterBody) {
        this.lifeText.text = body.Life.toString();
    } 

    removeSelf(container: createjs.Container) {
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
        this.fpsPoint = new Point(this.ppsPoint.X, this.ppsPoint.Y - this.textGap);
        this.create();
    }

    create() {
        this.createPPSText();
        this.createFPSText();
    }
    addSelfToContainer(container: createjs.Container) {
        container.addChild(this.ppsText, this.fpsText);
    }
    createPPSText() {
        var text = "PPS: " + this.data.ping;
        this.ppsText = new createjs.Text(text, this.textSize + "px Arial", this.textColor);
        this.ppsText.x = this.ppsPoint.X;
        this.ppsText.y = this.ppsPoint.Y;
        this.ppsText.zIndex = 100;
    }
    createFPSText() {
        var text = "FPS: " + this.data.fps;
        this.fpsText = new createjs.Text(text, this.textSize + "px Arial", this.textColor);
        this.fpsText.x = this.fpsPoint.X;
        this.fpsText.y = this.fpsPoint.Y;
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
