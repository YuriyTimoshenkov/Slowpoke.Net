using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using NSubstitute;
using SlowpokeEngine;
using SlowpokeEngine.Actions;
using SlowpokeEngine.Engines;
using SlowpokeEngine.Bodies;
using SlowpokeEngine.Entities;
using SlowpokeEngine.Weapons;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace SlowpokeEngineTests
{
    [TestClass]
    public class NPCAITests
    {
        [TestMethod]
        public void ShootInPlayer_InViewScope_Success()
        {
            //Arrange
            var player = new PlayerBody(new ShapeCircle(2, new Point(10, 10)), new Vector(0, 0), null, null, 0, 0);

            var viewPort = Substitute.For<IViewPort>();
            viewPort.GetActiveBodies(Arg.Any<Guid>()).Returns(v =>
                    new List<ActiveBody> { player } );

            var mechanicEngine = Substitute.For<IMechanicEngine>();
            mechanicEngine.ViewPort.Returns(v => viewPort);

            var npc = new NPCAI(new ShapeCircle(2, new Point(20, 20)), mechanicEngine, 10, 10);

            //Act
            npc.UpdateState();

            //Assert
            mechanicEngine.Received().ProcessGameCommand(Arg.Is<GameCommandMove>(v => v.ActiveBody is Bullet));
        }
    }
}
