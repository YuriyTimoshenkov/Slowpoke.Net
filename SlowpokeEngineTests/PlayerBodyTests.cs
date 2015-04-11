﻿using System;
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
            var player = new PlayerBody(null, new Vector(0,0), null, null, 0, 0, "Bob", 100);
            int weaponsCount = player.WeaponsCount;

            player.AddWeapon(new WeaponSimpleBullet(0, 0, 0, 0, new TimeSpan(), null, "Weapon"));

            Assert.AreEqual(weaponsCount, player.WeaponsCount - 1);
        }

        [TestMethod]
        public void ThrowCurrentWeapon_WithChange_Successful()
        {
            var player = new PlayerBody(null, new Vector(0, 0), null, null, 0, 0, "Bob", 100);
            int weaponsCount = player.WeaponsCount;

            player.AddWeapon(new WeaponSimpleBullet(0, 0, 0, 0, new TimeSpan(), null, "Weapon"));
            player.AddWeapon(new WeaponSimpleBullet(0, 0, 0, 0, new TimeSpan(), null, "Weapon"));

            player.ChangeWeapon();

            player.ThrowAwayCurrentWeapon();

            Assert.AreEqual(1, player.WeaponsCount);
            Assert.IsNotNull(player.CurrentWeapon);
        }
        
        [TestMethod]
        public void Shoot_Successful()
        {
            var player = new PlayerBody(new ShapeCircle(0, new Point(0, 0)),
                new Vector(0, 0), null, null, 0, 0, "Bob", 100);

            var weapon = Substitute.For<WeaponBase>(0, 0, null, "Gun");

            player.AddWeapon(weapon);
            player.Shoot();

            weapon.Received().Shoot(Arg.Any<Point>(), Arg.Any<Vector>());
        }

        [TestMethod]
        public void Move_Successful()
        {
            Vector direction = new Vector(0, 1);

            var mechanigEngine = Substitute.For<IMechanicEngine>();

            var player = new PlayerBody(new ShapeCircle(0, new Point(0, 0)),
                new Vector(0, 0), mechanigEngine, null, 0, 0, "Bob", 100);

            player.Move(direction);

            mechanigEngine.Received().AddCommand(Arg.Is<GameCommandMove>(v =>
                    v.Direction == direction));
        }
    }
}
