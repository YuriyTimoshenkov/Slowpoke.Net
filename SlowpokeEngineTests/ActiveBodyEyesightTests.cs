using Microsoft.VisualStudio.TestTools.UnitTesting;
using SlowpokeEngine.Bodies;
using SlowpokeEngine.Engines;
using SlowpokeEngine.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SlowpokeEngineTests
{
    [TestClass]
    public class ActiveBodyEyesightTests
    {
        [TestMethod]
        public void GetFullFrame_WithTiles()
        {
            var mapEngine = TestMapEngineFactory.InitMapEngine();

            var eyeSight = new ActiveBodyEyesight(mapEngine);

             var player = new PlayerBody(new ShapeCircle(3, new Point(2, 1)),
                new Vector(1, 1), null, null, 0, 0, "Bob", 100);

            mapEngine.AddBody(player);

            var frame = eyeSight.GetFrame(player.Id, null);

            Assert.IsTrue(frame.Bodies != null && frame.Map != null);
        }

        [TestMethod]
        public void GetFullFrame_WithoutTiles()
        {
            var mapEngine = TestMapEngineFactory.InitMapEngine();

            var eyeSight = new ActiveBodyEyesight(mapEngine);

            var player = new PlayerBody(new ShapeCircle(3, new Point(2, 1)),
               new Vector(1, 1), null, null, 0, 0, "Bob", 100);

            mapEngine.AddBody(player);

            var currentTile = eyeSight.GetPlayerCurrentTile(player.Id);
            var frame = eyeSight.GetFrame(player.Id, currentTile);

            Assert.IsTrue(frame.Bodies != null && frame.Map == null);
        }
    }
}
