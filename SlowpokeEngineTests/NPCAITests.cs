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
using SlowpokeEngine.Engines.View;
using SlowpokeEngine.Engines.Map;

namespace SlowpokeEngineTests
{
    [TestClass]
    public class NPCAITests
    {
        [TestMethod]
        public void ShootInPlayer_InViewScope_Success()
        {
            //Arrange
            var player = new PlayerBody(new ShapeCircle(2, new Point(10, 10)),
                new Vector(0, 0), null, null, 0, 0, "Bob", 100);

            var viewPort = Substitute.For<IActiveBodyEyesight>();
            viewPort.GetFrame(Arg.Any<Guid>(), Arg.Any<IMapTile>()).Returns(v =>
                    new ViewFrame() { Bodies = new List<ActiveBody> { player } });

            var mechanicEngine = Substitute.For<IMechanicEngine>();
            mechanicEngine.ViewPort.Returns(v => viewPort);

            var weapon = Substitute.For<WeaponBase>(10,100, mechanicEngine, "Gun");

            var npc = new NPCAI(new ShapeCircle(2, new Point(20, 20)), mechanicEngine, 10, 10, 100);
            npc.AddWeapon(weapon);

            //Act
            npc.UpdateState();

            //Assert
            weapon.Received().Shoot(Arg.Any<Point>(), Arg.Any<Vector>());
        }
    }
}
