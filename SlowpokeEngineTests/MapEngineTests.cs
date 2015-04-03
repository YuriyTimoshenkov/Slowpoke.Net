using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using SlowpokeEngine.Engines.Map;
using System.Collections.Generic;
using SlowpokeEngine.Bodies;
using SlowpokeEngine.Entities;
using System.Linq;
using NSubstitute;
using SlowpokeEngine.Engines.Levels;

namespace SlowpokeEngineTests
{
    [TestClass]
    public class MapEngineTests
    {
        private readonly int _mapCellSize = 50;

        [TestMethod]
        public void Init_And_GetProperties_Success()
        {
            var gameLevel = Substitute.For<IGameLevel>();

            IMap map = new Map(50);
            IMapEngine mapEngine = new MapEngine(map);

            Assert.IsNotNull(mapEngine.Map.Tiles);
            Assert.IsTrue(mapEngine.Map.Width == 2 && mapEngine.Map.Height == 2);
        }

        [TestMethod]
        public void MoveBodyBetweenTiles_Success()
        {
            var gameLevel = Substitute.For<IGameLevel>();

            IMap map = new Map(50);
            IMapEngine mapEngine = new MapEngine(map);

            var player = new PlayerBody(new ShapeCircle(3, new Point(2, 1)), new Vector(1, 1), null, null, 0, 0, "Bob");

            mapEngine.AddActiveBody(player);
            Assert.IsTrue(map.Tiles[0][0].Bodies[0] == player);

            //update player position
            player.Shape.Position = new Point(map.CellSize + 1, map.CellSize + 1);

            //update map
            mapEngine.UpdateActiveBody(player);
            Assert.IsTrue(map.Tiles[1][1].Bodies[0] == player);
        }

        [TestMethod]
        public void GetBodiesForCollission_Success()
        {
            var gameLevel = Substitute.For<IGameLevel>();

            IMap map = new Map(50);
            IMapEngine mapEngine = new MapEngine(map);

            var player1 = new PlayerBody(new ShapeCircle(3, new Point(2, 1)), new Vector(1, 1), null, null, 0, 0, "Bob");
            var player2 = new PlayerBody(new ShapeCircle(3, new Point(22, 12)), new Vector(1, 1), null, null, 0, 0, "Bob");

            mapEngine.AddActiveBody(player1);
            mapEngine.AddActiveBody(player2);

            Assert.IsTrue(map.Tiles[0][0].Bodies[0] == player1 && map.Tiles[0][0].Bodies[1] == player2);

            //update map
            var bodiesForCollision = mapEngine.GetBodiesForCollision(player1);
            Assert.IsTrue(bodiesForCollision.Count() == 2);
        }
    }
}
