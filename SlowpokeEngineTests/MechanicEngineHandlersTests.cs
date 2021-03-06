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
            var player = Substitute.For<CharacterBody>(null, new Vector(1, 1), mechanicEngine, 100, 100, 100, 1);
            mechanicEngine.FindBody(ownerId).Returns(player);

            var bulletCollisionHandler = handlers.BuildBulletCollisionHandler(mechanicEngine);
            var bullet = new Bullet(10, 10, 10, new ShapeCircle(10, new Point(0,0)), new Vector(1, 1), ownerId, mechanicEngine, 0, string.Empty);

            var gameCommand = new GameCommandMove(0, new Vector(1,1), mechanicEngine, bullet, new TimeSpan());
            var npc = Substitute.For<NPCAI>(null, mechanicEngine, 0, 100, 100, 1);
            
            var physicsResult = new PhysicsProcessingResultCollision(new List<Body>() {npc});

            //Act & Assert
            Assert.IsTrue(bulletCollisionHandler.Item1(gameCommand, physicsResult));
            bulletCollisionHandler.Item2(gameCommand, physicsResult);

            Assert.IsTrue(player.Score == 100);
        }

        [TestMethod]
        public void SameClassActiveBodiesCouldNotMakeDamageToEachOther()
        {
            //Arrange
            Guid ownerId = Guid.NewGuid();
            var handlers = new MechanicEngineHandlersBuilder();
            var mechanicEngine = Substitute.For<IMechanicEngine>();
            var player1 = new PlayerBody(null, new Vector(1, 1), mechanicEngine, null, 100, 100, "Bob", 100, 1);
            var player2 = new PlayerBody(null, new Vector(1, 1), mechanicEngine, null, 100, 100, "Bob", 100, 1);
            player1.SocialGroups.Add("1");
            player2.SocialGroups.Add("1");
            mechanicEngine.FindBody(ownerId).Returns(player1);

            var bulletCollisionHandler = handlers.BuildBulletCollisionHandler(mechanicEngine);
            var bullet = new Bullet(10, 10, 10, new ShapeCircle(10, new Point(0, 0)), new Vector(1, 1), ownerId, mechanicEngine, 0, string.Empty);

            var gameCommand = new GameCommandMove(0, new Vector(1, 1), mechanicEngine, bullet, new TimeSpan());
            var npc = Substitute.For<NPCAI>(null, mechanicEngine, 0, 100, 100, 1);

            var physicsResult = new PhysicsProcessingResultCollision(new List<Body>() { player2 });

            //Act & Assert
            Assert.IsTrue(bulletCollisionHandler.Item1(gameCommand, physicsResult));
            bulletCollisionHandler.Item2(gameCommand, physicsResult);

            Assert.IsTrue(player1.Life == 100 && player2.Life == 100);
        }

        [TestMethod]
        public void BulletShouldNotBeDestroyedWhenCollidedWithIUsableBody()
        {
            //Arrange
            var usableBody = Substitute.For<PassiveBody, IUsableBody>(new ShapeCircle(1, new Point(1,1)));

            var handlers = new MechanicEngineHandlersBuilder();
            var mechanicEngine = Substitute.For<IMechanicEngine>();
            var bulletCollisionHandler = handlers.BuildBulletCollisionHandler(mechanicEngine);
            var bullet = new Bullet(10, 10, 10, new ShapeCircle(10, new Point(0, 0)), new Vector(1, 1), Guid.NewGuid(), mechanicEngine, 0, string.Empty);

            var gameCommand = new GameCommandMove(0, new Vector(1, 1), mechanicEngine, bullet, new TimeSpan());
            var npc = Substitute.For<NPCAI>(null, mechanicEngine, 0, 100, 100, 1);

            var physicsResult = new PhysicsProcessingResultCollision(new List<Body>() { usableBody });

            //Act & Assert
            Assert.IsFalse(bulletCollisionHandler.Item1(gameCommand, physicsResult));
        }
    }
}
