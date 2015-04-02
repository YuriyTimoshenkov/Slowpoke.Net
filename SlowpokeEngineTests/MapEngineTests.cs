using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using SlowpokeEngine.Engines.Map;
using System.Collections.Generic;
using SlowpokeEngine.Bodies;
using SlowpokeEngine.Entities;
using System.Linq;

namespace SlowpokeEngineTests
{
    [TestClass]
    public class MapEngineTests
    {
        private readonly int _mapCellSize = 50;

        [TestMethod]
        public void Init_And_GetProperties_Success()
        {
            List<List<IMapTile>> tiles = BuildSimpleMap();

            IMap map = new Map(tiles, 50);
            IMapEngine mapEngine = new MapEngine(map);

            Assert.IsNotNull(mapEngine.Map.Tiles);
            Assert.IsTrue(mapEngine.Map.Width == 2 && mapEngine.Map.Height == 2);
        }

        [TestMethod]
        public void MoveBodyBetweenTiles_Success()
        {
            List<List<IMapTile>> tiles = BuildSimpleMap();

            IMap map = new Map(tiles, 50);
            IMapEngine mapEngine = new MapEngine(map);

            var player = new PlayerBody(new ShapeCircle(3, new Point(2, 1)), new Vector(1, 1), null, null, 0, 0, "Bob");

            mapEngine.AddActiveBody(player);
            Assert.IsTrue(tiles[0][0].Bodies[0] == player);

            //update player position
            player.Shape.Position = new Point(map.CellSize + 1, map.CellSize + 1);

            //update map
            mapEngine.UpdateActiveBody(player);
            Assert.IsTrue(tiles[1][1].Bodies[0] == player);
        }

        [TestMethod]
        public void GetBodiesForCollission_Success()
        {
            List<List<IMapTile>> tiles = BuildSimpleMap();

            IMap map = new Map(tiles, 50);
            IMapEngine mapEngine = new MapEngine(map);

            var player1 = new PlayerBody(new ShapeCircle(3, new Point(2, 1)), new Vector(1, 1), null, null, 0, 0, "Bob");
            var player2 = new PlayerBody(new ShapeCircle(3, new Point(22, 12)), new Vector(1, 1), null, null, 0, 0, "Bob");

            mapEngine.AddActiveBody(player1);
            mapEngine.AddActiveBody(player2);

            Assert.IsTrue(tiles[0][0].Bodies[0] == player1 && tiles[0][0].Bodies[1] == player2);

            //update map
            var bodiesForCollision = mapEngine.GetBodiesForCollision(player1);
            Assert.IsTrue(bodiesForCollision.Count() == 2);
        }

        private List<List<IMapTile>> BuildSimpleMap()
        {
            string[,] rawMap = new string[2, 2] {
        {"meadow", "water"},
        {"meadow", "meadow"},
        };

            var finalMap = new List<List<IMapTile>>();

            foreach (var row in Enumerable.Range(0, rawMap.GetLength(0)))
            {
                var newLayer = new List<IMapTile>();

                foreach (var column in Enumerable.Range(0, rawMap.GetLength(1)))
                {
                    newLayer.Add(new MapTile(rawMap[row, column],
                        rawMap[row, column] == "water" ? true : false,
                        new Point(row, column), new ShapeRectangle(
                            _mapCellSize, _mapCellSize,
                            new Point(column * _mapCellSize, row * _mapCellSize)
                            )));
                }

                finalMap.Add(newLayer);
            }

            return finalMap;
        }
    }
}
