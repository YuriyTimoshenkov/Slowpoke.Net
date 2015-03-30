using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using SlowpokeEngine.Bodies;
using SlowpokeEngine.Entities;
using SlowpokeEngine.Weapons;
using System.Collections.Generic;
using NSubstitute;
using SlowpokeEngine;
using SlowpokeEngine.Actions;

namespace SlowpokeEngineTests
{
    [TestClass]
    public class PlayerBodyTests
    {
        [TestMethod]
        public void AddWeapon_Successful()
        {
            var player = new PlayerBody(null, new Vector(0,0), null, null, 0, 0);
            int weaponsCount = player.WeaponsCount;

            player.AddWeapon(new WeaponSimpleBullet(0,0,0,0,new TimeSpan(),null));

            Assert.AreEqual(weaponsCount, player.WeaponsCount - 1);
        }

        [TestMethod]
        public void ThrowCurrentWeapon_WithChange_Successful()
        {
            var player = new PlayerBody(null, new Vector(0, 0), null, null, 0, 0);
            int weaponsCount = player.WeaponsCount;

            player.AddWeapon(new WeaponSimpleBullet(0, 0, 0, 0, new TimeSpan(), null));
            player.AddWeapon(new WeaponSimpleBullet(0, 0, 0, 0, new TimeSpan(), null));

            player.ChangeWeapon();

            player.ThrowAwayCurrentWeapon();

            Assert.AreEqual(1, player.WeaponsCount);
            Assert.IsNotNull(player.CurrentWeapon);
        }
        
        [TestMethod]
        public void Shoot_Successful()
        {
            var player = new PlayerBody(new ShapeCircle(0, new Point(0,0)), new Vector(0, 0), null, null, 0, 0);
            bool shootCatched = false;

            var weapon = Substitute.For<WeaponBase>(0, 0, null);
            weapon.When(v => v.Shoot(Arg.Any<Point>(), Arg.Any<Vector>()))
                .Do(v =>
                    {
                        shootCatched = true;
                    });

            player.AddWeapon(weapon);
            player.Shoot();

            Assert.IsTrue(shootCatched);
        }

        [TestMethod]
        public void Move_Successful()
        {
            GameCommandMove moveCommand = null;
            Vector direction = new Vector(0, 1);

            var mechanigEngine = Substitute.For<IMechanicEngine>();
            mechanigEngine.When(v => v.ProcessGameCommand(Arg.Any<GameCommand>()))
                .Do(v =>
                {
                    moveCommand = (GameCommandMove)v.Args()[0];
                });

            var player = new PlayerBody(new ShapeCircle(0, new Point(0, 0)), new Vector(0, 0), mechanigEngine, null, 0, 0);

            player.Move(direction);

            Assert.IsTrue(moveCommand != null && moveCommand.Direction == direction);
        }
    }
}
