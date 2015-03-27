using SlowpokeEngine.Bodies;
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
        private int _bulletSpeed;
        private int _bulletSize;
        private TimeSpan _shootFrequency;
        private DateTime _lastShoot = DateTime.Now;


        public WeaponSimpleBullet(
            int damage,
            int bulletSize,
            int shootingDistance,
            int bulletSpeed,
            TimeSpan shootFrequency,
            IMechanicEngine mechanicEngine
            ):base(damage, shootingDistance, mechanicEngine)
        {
            _bulletSpeed = bulletSpeed;
            _bulletSize = bulletSize;
            _shootFrequency = shootFrequency;
        }

        public override void Shoot(Point startPosition, Vector direction)
        {
            if (DateTime.Now - _lastShoot > _shootFrequency)
            {
                var bullet = new Bullet(_shootingDistance, _bulletSpeed, _damage, new ShapeCircle(_bulletSize, startPosition), direction, _mechanicEngine);

                _mechanicEngine.AddActiveBody(bullet);

                _lastShoot = DateTime.Now;
            }
        }
    }
}
