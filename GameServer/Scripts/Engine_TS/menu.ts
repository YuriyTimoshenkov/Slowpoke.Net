interface Menu {
    weapon: string;
    life: number;
    score: number
    fps: any;
    ping: any;
    weaponText: createjs.Text;
    scoreText: createjs.Text;
    lifeText: createjs.Text;
    fpsText: createjs.Text;
    pingText: createjs.Text;
    createScoreText(score: number, point: Point): void;
    updateScore(score: number, point: Point): void;
    createLifeText(newLife: number, point: Point): void;
    updateLife(newLife: number, point: Point): void;
    createWeaponText(newWeapon: string, point: Point): void;
    updateWeapon(newWeapon: string, point: Point): void;
    createFPSText(fps: any, point: Point): void;
    updateFPS(fps: any, point: Point): void;
    createPingText(ping: any, point: Point): void;
    updatePing(ping: any, point: Point): void;
}