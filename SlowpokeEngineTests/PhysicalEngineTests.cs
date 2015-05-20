using Microsoft.VisualStudio.TestTools.UnitTesting;
using SlowpokeEngine.Engines;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using NSubstitute;
using SlowpokeEngine.Entities;
using SlowpokeEngine.Engines.Map;
using SlowpokeEngine.Bodies;
using SlowpokeEngine;
using SlowpokeEngine.Actions;

namespace SlowpokeEngineTests
{
    [TestClass]
    public class PhysicalEngineTests
    {
        [TestMethod]
        public void OnMoveDistanceShouldBeCalculatedAccordingBodySpeed()
        {
            //Arrange
            var collisionManager = Substitute.For<IShapeCollisionManager>();
            collisionManager.CheckCollision(Arg.Any<Shape>(),Arg.Any<Shape>()).Returns(false);

            IMapEngine me = Substitute.For<IMapEngine>();
            me.GetBodiesForCollision(Arg.Any<ActiveBody>()).Returns(new List<Body>());

            IPhysicsEngine pe = new PhysicsEngine(collisionManager, me);

            int playerSpeed = 10;
            Point playerStartPosition = new Point(0,0);
            PlayerBody player = new PlayerBody(new ShapeCircle(10, playerStartPosition), new Vector(1, 1), null, null, 100, 100, "Bob", 10, playerSpeed);
            
            TimeSpan moveDuration = new TimeSpan(0,0,1);
            GameCommandMove moveCommand = new GameCommandMove(0, new Vector(0,1), null, player, moveDuration);

            //Act
            pe.ProcessBodyAction(moveCommand);

            //Assert
            double moveSize = playerSpeed * moveDuration.TotalMilliseconds / 1000.0;
            Assert.IsTrue(player.Shape.Position == new Point(playerStartPosition.X, playerStartPosition.Y + moveSize));
        }
    }
}
