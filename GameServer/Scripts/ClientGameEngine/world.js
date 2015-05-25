/**
 * Created by dimapct on 15.02.2015.
 */


function World(serverMap) {
    this.allGameObjects = [];
    this.gameObjectFactory = new GameObjectFactory();
    // KOSTIL
    this.gameMap = new GameMap(serverMap, this.gameObjectFactory);
    

   
}

