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


        [TestMethod]
        public void Init_And_GetProperties_Success()
        {
            IMapEngine mapEngine = TestMapEngineFactory.InitMapEngine();

            Assert.IsNotNull(mapEngine.Map.Tiles);
            Assert.IsTrue(mapEngine.Map.Width == 2 && mapEngine.Map.Height == 1);
        }

        [TestMethod]
        public void MoveBodyBetweenTiles_Success()
        {
            IMapEngine mapEngine = TestMapEngineFactory.InitMapEngine();

            var player = new PlayerBody(new ShapeCircle(3, new Point(2, 1)),
                new Vector(1, 1), null, null, 0, 0, "Bob", 100);
            
            mapEngine.AddBody(player);
            Assert.IsTrue(mapEngine.Map.Tiles[0][0].Bodies.ElementAt(0) == player);

            //update player position
            player.Shape.Position = new Point(mapEngine.Map.CellSize + 1, 1);

            //update map
            mapEngine.UpdateActiveBody(player);
            Assert.IsTrue(mapEngine.Map.Tiles[0][1].Bodies.ElementAt(0) == player);
        }

        [TestMethod]
        public void GetBodiesForCollission_Success()
        {
            IMapEngine mapEngine = TestMapEngineFactory.InitMapEngine();

            var player1 = new PlayerBody(new ShapeCircle(3, new Point(2, 1)),
                new Vector(1, 1), null, null, 0, 0, "Bob", 100);
            var player2 = new PlayerBody(new ShapeCircle(3, new Point(22, 12)),
                new Vector(1, 1), null, null, 0, 0, "Bob", 100);

            mapEngine.AddBody(player1);
            mapEngine.AddBody(player2);

            Assert.IsTrue(mapEngine.Map.Tiles[0][0].Bodies.ElementAt(1) == player1 && mapEngine.Map.Tiles[0][0].Bodies.ElementAt(0) == player2);

            //update map
            var bodiesForCollision = mapEngine.GetBodiesForCollision(player1);
            Assert.IsTrue(bodiesForCollision.Count() == 1);
        }

        
    }
}
