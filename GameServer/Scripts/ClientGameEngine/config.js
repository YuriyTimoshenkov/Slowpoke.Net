/**
 * Created by dimapct on 12.02.2015.
 */

var updateFPS = 1000/30;
var serverRequestFPS = updateFPS;

var requestAddress = "http://104.236.42.106:8083/getviewstate/";



// Terrain types
var terrainClass = {
    meadow: 0,
    prairie: 1,
    water: 2,
    rock: 3,
    forest: 4,
    road: 5,
    props: {
        0: {color: "Olivedrab"},
        1: {color: "moccasin"},
        2: {color: "royalblue"},
        3: {color: "peru"},
        4: {color: "forestgreen"},
        5: {color: "sandybrown"}
    }
};

