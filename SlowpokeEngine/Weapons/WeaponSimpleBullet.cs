﻿using SlowpokeEngine.Bodies;
using SlowpokeEngine.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SlowpokeEngine.Weapons
{
    public class WeaponSimpleBullet : WeaponBase
    {
        protected int _bulletSpeed;
        protected int _bulletSize;
        protected TimeSpan _shootFrequency;
        protected DateTime _lastShoot = DateTime.Now;


        public WeaponSimpleBullet(
            int damage,
            int bulletSize,
            int shootingDistance,
            int bulletSpeed,
            TimeSpan shootFrequency,
            IMechanicEngine mechanicEngine,
            string name,
            Shape shape
            )
            : base(damage, shootingDistance, mechanicEngine, name, shape)
        {
            _bulletSpeed = bulletSpeed;
            _bulletSize = bulletSize;
            _shootFrequency = shootFrequency;
        }

        public override void Shoot(Point startPosition, Vector direction, Guid ownerId, long commandId = 0)
        {
            if (DateTime.Now - _lastShoot > _shootFrequency)
            {
                var bullets = CreateBullet(startPosition, direction, ownerId, commandId);

                foreach (var bullet in bullets)
                {
                    _mechanicEngine.AddBody(bullet);
                }

                _lastShoot = DateTime.Now;
            }
        }

        protected virtual List<Bullet> CreateBullet(Point startPosition, Vector direction, Guid ownerId, long commandId)
        {
            return new List<Bullet>
            {
                new Bullet(_shootingDistance, 
                    _bulletSpeed, 
                    _damage, 
                    new ShapeCircle(_bulletSize, startPosition), 
                    direction, 
                    ownerId, 
                    _mechanicEngine, 
                    commandId,
                    "Bullet" + this.Name)
            };
        }
    }
}
