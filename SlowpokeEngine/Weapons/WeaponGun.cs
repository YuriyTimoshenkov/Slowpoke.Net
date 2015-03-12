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


        public WeaponGun(
            int damage,
            int shootingDistance,
            int bulletSpeed,
            IMechanicEngine mechanicEngine
            ):base(damage, shootingDistance, mechanicEngine)
        {
            _bulletSpeed = bulletSpeed;
        }

        public override void Shoot(Point startPosition, Vector direction)
        {
            var bullet = new Bullet(_shootingDistance, _bulletSpeed, startPosition, direction, _mechanicEngine);

            _mechanicEngine.AddActiveBody(bullet);
        }
    }
}
