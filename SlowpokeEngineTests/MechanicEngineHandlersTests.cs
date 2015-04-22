﻿using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using SlowpokeEngine;
using SlowpokeEngine.Actions;
using SlowpokeEngine.Bodies;
using SlowpokeEngine.Engines;
using SlowpokeEngine.Entities;
using SlowpokeEngine.Weapons;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SlowpokeEngineTests
{
    [TestClass]
    public class MechanicEngineHandlersTests
    {
        [TestMethod]
        public void ScoreShouldBeIncreaseAfterBulletCollisionWithEnemy()
        {
            //Arrange
            Guid ownerId = Guid.NewGuid();
            var handlers = new MechanicEngineHandlersBuilder();
            var mechanicEngine = Substitute.For<IMechanicEngine>();
            var player = Substitute.For<ActiveBody>(null, new Vector(1, 1), mechanicEngine, 100, 100, 100);
            mechanicEngine.FindBody(ownerId).Returns(player);

            var bulletCollisionHandler = handlers.BuildBulletCollisionHandler(mechanicEngine);
            var bullet = new Bullet(10, 10, 10, new ShapeCircle(10, new Point(0,0)), new Vector(1, 1), ownerId, mechanicEngine);

            var gameCommand = new GameCommandMove(new Vector(1,1), mechanicEngine, bullet);
            var npc = Substitute.For<NPCAI>(null, mechanicEngine, 0, 100, 100);
            
            var physicsResult = new PhysicsProcessingResultCollision(new List<Body>() {npc});

            //Act & Assert
            Assert.IsTrue(bulletCollisionHandler.Item1(gameCommand, physicsResult));
            bulletCollisionHandler.Item2(gameCommand, physicsResult);

            Assert.IsTrue(player.Score == 100);
        }
    }
}
