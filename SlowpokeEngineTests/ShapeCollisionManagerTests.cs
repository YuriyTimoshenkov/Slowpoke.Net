using Microsoft.VisualStudio.TestTools.UnitTesting;
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
    public class ShapeCollisionManagerTests
    {
        [TestMethod]
        public void Circle_Rectangle_Collision_Success()
        {
            var collisionManager = new ShapeCollisionManager();
            var circle = new ShapeCircle(10, new Point(0, 0));
            var rectangle = new ShapeRectangle(10, 10, new Point(14, 0));

            Assert.IsTrue(collisionManager.CheckCollision(circle, rectangle));
        }
    }
}
