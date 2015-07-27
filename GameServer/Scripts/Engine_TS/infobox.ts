class Infobox {
    data: any;

    constructor(data, container, startPoint?) {
        this.data = data;
    }
    updatePosition(startPoint: Point) { }

    updateLifeText() { } 
    updateCurrentWeaponText() { }
    updateScoreText() { }
 
    removeSelf(container) { }   
}


class PlayerInfoboxFixed extends Infobox {
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

        constructor(data, container: createjs.Stage, startPoint?: Point) {
            super(data, container);
            this.weaponPoint = startPoint;
            this.lifePoint = new Point(this.weaponPoint.x, this.weaponPoint.y - this.textGap);
            this.scorePoint = new Point(this.weaponPoint.x, this.lifePoint.y - this.textGap);
            this.subscribe();
            this.create(container);
        }
        
        subscribe() { }

        create(container) {
            this.createLifeText();
            this.createWeaponText();
            this.createScoreText();
            container.addChild(this.lifeText, this.weaponText, this.scoreText);
        }

        createLifeText() {
            var text = "HP: " + this.data.life;
            this.lifeText = new createjs.Text(text, this.textSize + "px Arial", this.lifeTextColor);
            this.lifeText.x = this.lifePoint.x;
            this.lifeText.y = this.lifePoint.y;
            this.lifeText.zIndex = 100;
        }
        createWeaponText() {
            this.weaponText = new createjs.Text(this.data.currentWeapon, this.textSize + "px Arial", this.lifeTextColor);
            this.weaponText.zIndex = 3;
            this.weaponText.x = this.weaponPoint.x;
            this.weaponText.y = this.weaponPoint.y;
            this.weaponText.zIndex = 100;
        }
        createScoreText() {
            var text = "Score: " + this.data.score;
            this.scoreText = new createjs.Text(text, this.textSize + "px Arial", this.scoreTextColor);
            this.scoreText.x = this.scorePoint.x;
            this.scoreText.y = this.scorePoint.y;
            this.scoreText.zIndex = 100;
        }
        
        updateScoreText() {
            this.scoreText.text = "Score: " + this.data.score;
        }

        updateCurrentWeaponText() {
            this.weaponText.text = this.data.currentWeapon;
        }
        updateLifeText() {
            this.lifeText.text = "HP: " + this.data.life;
        } 

        removeSelf(container) {
            container.removeChild(this.lifeText);
            container.removeChild(this.weaponText);
            container.removeChild(this.scoreText);
        }   
}

class PlayerInfoboxFloating extends Infobox {
    nameTextColor = "blue";
    textSize = 10;
    startPoint: Point;
    nameText: createjs.Text;

    constructor(data, container, startPoint) {
        super(data, container, startPoint);
        this.startPoint = startPoint;
        this.create(container);
    }

    create(container) {
        this.createNameText();
        container.addChild(this.nameText);
    }

    createNameText() {
        this.nameText = new createjs.Text(this.data.name, this.textSize + "px Arial", this.nameTextColor);
        this.nameText.x = this.startPoint.x - this.data.gameRect.width;
        this.nameText.y = this.startPoint.y - this.data.gameRect.height - 20;
        this.nameText.zIndex = 100;
    }

    removeSelf(container) {
        container.removeChild(this.nameText);
    }

}

class NPCInfoboxFloating extends Infobox {
    lifeTextColor = "red";
    textSize = 16;
    startPoint: Point;
    lifeText: createjs.Text;


    constructor(data, container, startPoint) {
        super(data, container, startPoint);
        this.startPoint = startPoint;
        this.create(container);
    }

    create(container) {
        this.createLifeText();
        container.addChild(this.lifeText);
    }

    createLifeText() {
        this.lifeText = new createjs.Text(this.data.life, this.textSize + "px Arial", this.lifeTextColor);
        this.lifeText.x = this.startPoint.x - this.data.gameRect.width;
        this.lifeText.y = this.startPoint.y - this.data.gameRect.height - 20;
        this.lifeText.zIndex = 100;
    }

    updatePosition(startPoint) {
        this.lifeText.x = startPoint.x - this.data.gameRect.width;
        this.lifeText.y = startPoint.y - this.data.gameRect.height - 20;
    }
    updateLifeText() {
        this.lifeText.text = this.data.life;
    } 

    removeSelf(container) {
        container.removeChild(this.lifeText);
    }
}
