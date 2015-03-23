using SlowpokeEngine.Bodies;
using SlowpokeEngine.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SlowpokeEngine.Weapons
{
    class WeaponGun : WeaponBase
    {
        private int _bulletSpeed;
        private int _bulletSize;


        public WeaponGun(
            int damage,
            int bulletSize,
            int shootingDistance,
            int bulletSpeed,
            IMechanicEngine mechanicEngine
            ):base(damage, shootingDistance, mechanicEngine)
        {
            _bulletSpeed = bulletSpeed;
            _bulletSize = bulletSize;
        }

        public override void Shoot(Point startPosition, Vector direction)
        {
            var bullet = new Bullet(_shootingDistance, _bulletSpeed, new ShapeCircle(_bulletSize, startPosition), direction, _mechanicEngine);

            _mechanicEngine.AddActiveBody(bullet);
        }
    }
}
